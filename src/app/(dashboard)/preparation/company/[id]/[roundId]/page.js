"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Suspense, use, useEffect, useRef, useState } from "react";
import { APTITUDE_QS, formatTime } from "@/data/preparation";

// Simple IndexedDB wrapper for large blobs
const saveBlobToDB = (key, blob) => {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("InterviewDB", 3);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains("blobs")) {
        db.createObjectStore("blobs");
      }
    };
    req.onsuccess = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains("blobs")) {
        console.error("IndexedDB 'blobs' store not found. Creating a new DB version might be required.");
        // Try creating on the fly (won't work in onsuccess usually, but to prevent crash)
        return reject(new Error("blobs store not found"));
      }
      const tx = db.transaction("blobs", "readwrite");
      const store = tx.objectStore("blobs");
      store.put(blob, key);
      tx.oncomplete = () => resolve();
      tx.onerror = (err) => reject(err);
    };
    req.onerror = (err) => reject(err);
  });
};

const sendTerminalLog = (message) => {
  console.log(message);
  fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://icfai-backend-production.up.railway.app"}/api/preparation/log`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  }).catch(() => { });
};

import { AnalysisPageContent } from "../analysis/page";

export function RoundPageContent({ id, roundId, isolatedMode = false, basePath }) {
  const router = useRouter();

  const [config, setConfig] = useState(null);
  const [aptitudeQuestions, setAptitudeQuestions] = useState([]);
  const [gdQuestion, setGdQuestion] = useState(null);
  const [interviewQuestion, setInterviewQuestion] = useState(null);
  const [studentProgramId, setStudentProgramId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    async function fetchCompanyAndQuestions() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://icfai-backend-production.up.railway.app"}/api/preparation/companies/${id}`);
        let data;
        if (!res.ok) {
          if (id === "999") {
            data = {
              id: 999,
              name: "Self Preparation",
              description: "Self Practice Mode",
              rounds: [
                { id: 14, type: "aptitude", title: "Aptitude Test", order_index: 0 },
                { id: 15, type: "gd", title: "Audio Preparation", order_index: 1 },
                { id: 16, type: "interview", title: "Personal Interview", order_index: 2 }
              ]
            };
          } else {
            throw new Error("Company not found");
          }
        } else {
          data = await res.json();
        }

        if (data.rounds) {
          data.rounds.sort((a, b) => a.order_index - b.order_index);
        }
        setConfig(data);

        // Fetch past sessions for the company
        try {
          const token = localStorage.getItem("student_token");
          const headers = {};
          if (token) headers["Authorization"] = `Bearer ${token}`;
          const sessRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://icfai-backend-production.up.railway.app"}/api/preparation/sessions/${id}`, {
            headers,
            credentials: "include"
          });
          if (sessRes.ok) {
            setSessions(await sessRes.json());
          }
        } catch (e) {
          console.error("Error fetching sessions for company", e);
        }

        // Fetch student program_id
        let progId = null;
        try {
          const token = localStorage.getItem("student_token");
          const headers = {};
          if (token) headers["Authorization"] = `Bearer ${token}`;
          const stRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://icfai-backend-production.up.railway.app"}/auth/student/me`, {
            headers,
            credentials: "include"
          });
          if (stRes.ok) {
            const stData = await stRes.json();
            progId = stData.program_id;
            setStudentProgramId(progId);
          }
        } catch (e) { console.error(e); }

        // If current round is aptitude, fetch questions
        const currentRoundData = data.rounds?.find((r) => r.id === Number(roundId));
        if (currentRoundData) {
          if (currentRoundData.type === "aptitude") {
            setTimeLeft(3600); // 60 minutes for Aptitude
            const qRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://icfai-backend-production.up.railway.app"}/api/preparation/rounds/${roundId}/questions?t=${Date.now()}`);
            if (qRes.ok) {
              const qData = await qRes.json();
              const parsedQuestions = qData.map(q => {
                if (typeof q.options === 'string') {
                  try { q.options = JSON.parse(q.options); } catch (e) { }
                }
                return q;
              });
              setAptitudeQuestions(parsedQuestions);
            }
          } else if (currentRoundData.type === "gd" && progId) {
            setTimeLeft(600); // 10 minutes for Audio Preparation
            const gdRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://icfai-backend-production.up.railway.app"}/api/preparation/gd-questions/random?program_id=${progId}`);
            if (gdRes.ok) setGdQuestion(await gdRes.json());
          } else if ((currentRoundData.type === "interview" || currentRoundData.type === "hr") && progId) {
            setTimeLeft(1200); // 20 minutes for Interview
            const intRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://icfai-backend-production.up.railway.app"}/api/preparation/interview-questions/random?program_id=${progId}`);
            if (intRes.ok) setInterviewQuestion(await intRes.json());
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCompanyAndQuestions();
  }, [id, roundId]);

  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const pcRef = useRef(null);
  const aiAudioRef = useRef(null);

  // State declaration (we keep state local and persist to localStorage on save/exit)
  const [timeLeft, setTimeLeft] = useState(1800);
  const [isFinished, setIsFinished] = useState(false);
  const [answers, setAnswers] = useState({});
  const [skippedRounds, setSkippedRounds] = useState({});
  const [aptSelectedOpt, setAptSelectedOpt] = useState("");

  // Aptitude 10 questions state
  const [aptQIdx, setAptQIdx] = useState(0);
  const [aptAnswers, setAptAnswers] = useState({});

  // GD Voice States
  const [gdAudioPhase, setGdAudioPhase] = useState("ready"); // ready | recording | feedback
  const [gdRecordingTime, setGdRecordingTime] = useState(0);
  const [gdWavePhase, setGdWavePhase] = useState(0);
  const [gdRecordedResponse, setGdRecordedResponse] = useState("");

  // AI Audio Interview States (for HR/Tech)
  const [audioPhase, setAudioPhase] = useState("ready"); // ready | recording | feedback
  const [recordingTime, setRecordingTime] = useState(0);
  const [wavePhase, setWavePhase] = useState(0);
  const [isWebRTCConnected, setIsWebRTCConnected] = useState(false);

  const streamRef = useRef(null);

  // Handle cleanup on unmount
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (pcRef.current) pcRef.current.close();
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (pcRef.current) {
        pcRef.current.close();
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        try { mediaRecorderRef.current.stop(); } catch (e) { }
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const rounds = config?.rounds || [];
  const currentRoundIdx = rounds.findIndex((r) => r.id === Number(roundId));
  const currentRound = rounds[currentRoundIdx];

  const currentQ = aptitudeQuestions.length > 0 ? aptitudeQuestions[aptQIdx] : null;

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const storedAnswers = localStorage.getItem(`answers_${id}`);
      const storedSkipped = localStorage.getItem(`skipped_${id}`);
      if (storedAnswers) {
        const parsedAnswers = JSON.parse(storedAnswers);
        setAnswers(parsedAnswers);
        if (parsedAnswers[roundId]) {
          if (currentRound?.type === "aptitude") {
            try {
              const prevApt = JSON.parse(parsedAnswers[roundId]);
              const restoredAnswers = prevApt.answers || prevApt;
              setAptAnswers(restoredAnswers);
              setAptQIdx(0);
              setAptSelectedOpt(restoredAnswers[0] || "");
            } catch (_e) {
              setAptSelectedOpt(parsedAnswers[roundId]);
            }
          }
        }
      }
      if (storedSkipped) {
        setSkippedRounds(JSON.parse(storedSkipped));
      }
    } catch (e) {
      console.error("Error reading localStorage", e);
    }

  }, [id, roundId, currentRound]);

  // Set timer based on round type and phase
  useEffect(() => {
    if (currentRound) {
      if (currentRound.type === "gd") {
        // Only set time left initially, or keep it as is, wait.
        // If we setTimeLeft(600) here, it resets on phase change. That's fine for GD start.
        if (gdAudioPhase === "ready") {
          setTimeLeft(600);
        }
        setIsTimerPaused(gdAudioPhase !== "recording");
      }
      else if (currentRound.type === "interview" || currentRound.type === "hr") {
        if (audioPhase === "ready") {
          setTimeLeft(1200); // 20 minutes
        }
        setIsTimerPaused(audioPhase !== "recording");
      }
      else {
        setIsTimerPaused(false);
      }
    }
  }, [currentRound, gdAudioPhase, audioPhase]);

  // Initialize time left separately
  useEffect(() => {
    if (currentRound) {
      if (currentRound.type === "gd") setTimeLeft(600);
      else if (currentRound.type === "interview" || currentRound.type === "hr") setTimeLeft(1200);
      else setTimeLeft(currentRound.timeLimit || 1800);
    }
  }, [currentRound]);

  // Keep track of active timer
  useEffect(() => {
    const timer = setInterval(() => {
      if (isTimerPaused) return;
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isTimerPaused]);

  // Recording timer (HR/Tech)
  useEffect(() => {
    let t;
    if (audioPhase === "recording") {
      t = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(t);
  }, [audioPhase]);

  // GD recording timer
  useEffect(() => {
    let t;
    if (gdAudioPhase === "recording") {
      t = setInterval(() => {
        setGdRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      setGdRecordingTime(0);
    }
    return () => clearInterval(t);
  }, [gdAudioPhase]);

  // Voice Wave Animation loop (HR/Tech)
  useEffect(() => {
    let t;
    if (audioPhase === "recording") {
      t = setInterval(() => {
        setWavePhase((p) => (p + 1) % 100);
      }, 80);
    }
    return () => clearInterval(t);
  }, [audioPhase]);

  // GD Voice Wave Animation loop
  useEffect(() => {
    let t;
    if (gdAudioPhase === "recording") {
      t = setInterval(() => {
        setGdWavePhase((p) => (p + 1) % 100);
      }, 80);
    }
    return () => clearInterval(t);
  }, [gdAudioPhase]);

  const saveStateAndNavigate = (nextAnswers, nextSkipped) => {
    // Stop WebRTC and recording if active
    if (pcRef.current) {
      try { pcRef.current.close(); } catch (e) { }
      pcRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try { mediaRecorderRef.current.stop(); } catch (e) { }
    }
    if (streamRef.current) {
      try {
        streamRef.current.getTracks().forEach(track => track.stop());
      } catch (e) { }
      streamRef.current = null;
    }

    try {
      localStorage.setItem(`answers_${id}`, JSON.stringify(nextAnswers));
      localStorage.setItem(`skipped_${id}`, JSON.stringify(nextSkipped));
    } catch (e) {
      console.error("Error writing localStorage", e);
    }

    if (isolatedMode) {
      setIsFinished(true);
      return;
    }

    if (currentRoundIdx < rounds.length - 1 && id !== "999") {
      const nextRound = rounds[currentRoundIdx + 1];
      router.push(`/preparation/company/${id}/${nextRound.id}`);
    } else {
      router.push(`/preparation/company/${id}/analysis`);
    }
  };

  const handleNext = (forceSubmit = false) => {
    const newAnswers = { ...answers };

    if (currentRound?.type === "aptitude") {
      const updatedAptAnswers = {
        ...aptAnswers,
        ...(aptSelectedOpt ? { [aptQIdx]: aptSelectedOpt } : {}),
      };
      setAptAnswers(updatedAptAnswers);

      const maxQIdx = aptitudeQuestions.length > 0 ? aptitudeQuestions.length - 1 : 9;

      if (aptQIdx < maxQIdx && forceSubmit !== true) {
        setAptQIdx(aptQIdx + 1);
        setAptSelectedOpt("");
        return; // Don't proceed to next stage yet
      }

      let correctCount = 0;
      let wrongCount = 0;
      const details = [];
      Object.entries(updatedAptAnswers).forEach(([idx, opt]) => {
        const q = aptitudeQuestions[idx];
        if (q) {
          const is_correct = q.options[q.answer] === opt;
          if (is_correct) {
            correctCount++;
          } else {
            wrongCount++;
          }
          details.push({
            question: q.q,
            selected_option: opt,
            correct_option: q.options[q.answer],
            is_correct: is_correct
          });
        }
      });
      const score = { correct: correctCount, wrong: wrongCount, total: aptitudeQuestions.length || 10, attempted: Object.keys(updatedAptAnswers).length, details };

      // All questions complete, store stringified results object
      newAnswers[roundId] = JSON.stringify({ answers: updatedAptAnswers, score });
    } else if (currentRound?.type === "gd") {
      newAnswers[roundId] = JSON.stringify({ type: "gd", question: gdQuestion?.question_text || "No question loaded", status: "Audio GD contribution saved" });
    } else {
      newAnswers[roundId] = JSON.stringify({ type: "interview", question: "Dynamic AI Interview", status: "AI Audio Response recorded successfully" });
    }

    const newSkipped = { ...skippedRounds };
    delete newSkipped[roundId];

    saveStateAndNavigate(newAnswers, newSkipped);
  };

  // Auto-submit when time is up
  useEffect(() => {
    if (timeLeft === 0 && !isLoading && currentRound) {
      if (currentRound.type === "gd" && gdAudioPhase === "recording") {
        stopGdVoiceAndSend();
      } else if ((currentRound.type === "interview" || currentRound.type === "hr") && audioPhase === "recording") {
        handleDoneRecording();
      } else if (currentRound.type === "aptitude" || gdAudioPhase !== "recording" || audioPhase !== "recording") {
        handleNext(true);
      }
    }
  }, [timeLeft, isLoading, currentRound]);

  const handleBack = () => {
    if (currentRound?.type === "aptitude" && aptQIdx > 0) {
      setAptQIdx(aptQIdx - 1);
      setAptSelectedOpt(aptAnswers[aptQIdx - 1] || "");
      return;
    }

    if (currentRoundIdx > 0 && id !== "999") {
      const prevRound = rounds[currentRoundIdx - 1];
      router.push(`/preparation/company/${id}/${prevRound.id}`);
    } else {
      router.push(id === "999" ? "/preparation" : `/preparation/company/${id}`);
    }
  };

  const handleSkip = () => {
    const newAnswers = { ...answers };

    if (currentRound?.type === "aptitude") {
      // If skipping aptitude, grade what they have answered so far
      let correctCount = 0;
      let wrongCount = 0;
      const details = [];
      Object.entries(aptAnswers).forEach(([idx, opt]) => {
        const q = aptitudeQuestions[idx];
        if (q) {
          const is_correct = q.options[q.answer] === opt;
          if (is_correct) correctCount++;
          else wrongCount++;
          details.push({
            question: q.q,
            selected_option: opt,
            correct_option: q.options[q.answer],
            is_correct: is_correct
          });
        }
      });
      const score = { correct: correctCount, wrong: wrongCount, total: aptitudeQuestions.length || 10, attempted: Object.keys(aptAnswers).length, details };
      newAnswers[roundId] = JSON.stringify({ answers: aptAnswers, score });
    }

    const newSkipped = { ...skippedRounds, [roundId]: true };
    saveStateAndNavigate(newAnswers, newSkipped);
  };

  const startInterviewRecording = async () => {
    setAudioPhase("recording");
    try {
      sendTerminalLog("🌐 Initializing WebRTC Session...");

      // IMPORTANT: Call getUserMedia FIRST, immediately on click.
      // Safari's user-gesture context expires after any async operation,
      // so this must be the very first await in the handler.
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      sendTerminalLog("📷 Camera & Mic access granted.");

      // FIX 1: Now unlock audio playback for Safari.
      // We already have user gesture context from getUserMedia grant,
      // so we can pre-create an Audio element and play a silent buffer
      // to unlock autoplay for the AI voice stream.
      const aiAudio = new Audio();
      aiAudio.setAttribute('playsinline', 'true');
      aiAudioRef.current = aiAudio;
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const tmpCtx = new AudioCtx();
        const silentBuffer = tmpCtx.createBuffer(1, 1, 22050);
        const silentSrc = tmpCtx.createBufferSource();
        silentSrc.buffer = silentBuffer;
        silentSrc.connect(tmpCtx.destination);
        silentSrc.start();
        // Also unlock the Audio element with a silent play
        aiAudio.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';
        await aiAudio.play().catch(() => {});
        aiAudio.pause();
        aiAudio.src = '';
        sendTerminalLog("🔊 Safari audio context unlocked.");
      } catch (audioUnlockErr) {
        sendTerminalLog(`⚠️ Audio unlock attempt: ${audioUnlockErr.message}`);
      }

      // Record locally for analysis transcript and video
      recordedChunksRef.current = [];

      // FIX 3: Better MediaRecorder MIME type detection for Safari.
      // Safari doesn't support video/webm at all. Prefer video/mp4 on Safari.
      let videoMimeType = undefined; // Let browser choose if nothing is supported
      const mimePreferences = [
        'video/mp4',
        'video/webm;codecs=vp9',
        'video/webm;codecs=vp8',
        'video/webm',
      ];
      if (typeof MediaRecorder.isTypeSupported === 'function') {
        for (const mime of mimePreferences) {
          if (MediaRecorder.isTypeSupported(mime)) {
            videoMimeType = mime;
            break;
          }
        }
      }
      sendTerminalLog(`🎥 MediaRecorder using MIME: ${videoMimeType || 'browser default'}`);

      const recorderOptions = videoMimeType ? { mimeType: videoMimeType } : {};
      mediaRecorderRef.current = new MediaRecorder(stream, recorderOptions);
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunksRef.current.push(e.data);
      };
      mediaRecorderRef.current.start(1000);

      // Setup WebRTC connection via backend proxy
      const token = localStorage.getItem("student_token");
      const headers = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://icfai-backend-production.up.railway.app"}/api/preparation/webrtc/session?round_type=interview`, {
        method: "POST",
        headers,
        credentials: "include"
      });
      const data = await resp.json();
      const client_secret = data.value || (data.client_secret && data.client_secret.value);
      sendTerminalLog("🔑 WebRTC Session fetched from backend proxy. Client Secret obtained.");

      if (!client_secret) throw new Error("No client secret in response");

      // FIX 4: Add STUN server for reliable ICE candidate gathering on Safari
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });
      pcRef.current = pc;

      const dc = pc.createDataChannel("oai-events");
      dc.addEventListener("open", () => {
        sendTerminalLog("💬 WebRTC Data Channel Opened");
      });

      pc.addEventListener("connectionstatechange", () => {
        if (pc.connectionState === "connected") {
          setIsWebRTCConnected(true);
        } else if (pc.connectionState === "disconnected" || pc.connectionState === "failed" || pc.connectionState === "closed") {
          setIsWebRTCConnected(false);
        }
      });
      dc.addEventListener("message", (e) => {
        try {
          const event = JSON.parse(e.data);
          if (event.type === "conversation.item.input_audio_transcription.completed") {
            sendTerminalLog(`👤 User: "${event.transcript || ""}"`);
          } else if (event.type === "response.audio_transcript.done") {
            sendTerminalLog(`🤖 AI: "${event.transcript || ""}"`);
          } else if (event.type === "error") {
            sendTerminalLog(`❌ WebRTC Event Error: ${JSON.stringify(event.error)}`);
          }
        } catch (err) {
          console.error("Data channel parsing error", err);
        }
      });

      pc.ondatachannel = (e) => {
        const remoteDc = e.channel;
        remoteDc.addEventListener("message", (evt) => {
          try {
            const event = JSON.parse(evt.data);
            if (event.type === "conversation.item.input_audio_transcription.completed") {
              sendTerminalLog(`👤 User: "${event.transcript || ""}"`);
            } else if (event.type === "response.audio_transcript.done") {
              sendTerminalLog(`🤖 AI: "${event.transcript || ""}"`);
            }
          } catch (err) { }
        });
      };

      // FIX 1 (continued): Reuse the pre-unlocked Audio element for AI voice
      pc.ontrack = (e) => {
        const audio = aiAudioRef.current || new Audio();
        audio.srcObject = e.streams[0];
        audio.play().catch((playErr) => {
          sendTerminalLog(`⚠️ AI audio play failed: ${playErr.message}. Retrying...`);
          // Retry on user interaction as a fallback
          const resumeAudio = () => {
            audio.play().catch(() => {});
            document.removeEventListener('click', resumeAudio);
            document.removeEventListener('touchstart', resumeAudio);
          };
          document.addEventListener('click', resumeAudio, { once: true });
          document.addEventListener('touchstart', resumeAudio, { once: true });
        });
      };

      // Only add audio tracks to WebRTC session (KiteFishAI realtime session is audio-only)
      stream.getAudioTracks().forEach(track => pc.addTrack(track, stream));

      sendTerminalLog("📝 Creating WebRTC Offer...");
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // FIX 2: Wait for ICE gathering to complete before sending SDP.
      // Safari often hasn't gathered all candidates when setLocalDescription resolves.
      if (pc.iceGatheringState !== 'complete') {
        await new Promise((resolve) => {
          const timeout = setTimeout(() => {
            sendTerminalLog("⚠️ ICE gathering timed out after 5s, proceeding with available candidates.");
            resolve();
          }, 5000);
          pc.addEventListener('icegatheringstatechange', () => {
            if (pc.iceGatheringState === 'complete') {
              clearTimeout(timeout);
              resolve();
            }
          });
        });
      }
      sendTerminalLog(`📡 ICE gathering complete (state: ${pc.iceGatheringState}). Sending SDP to backend proxy...`);

      const sdpResp = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://icfai-backend-production.up.railway.app"}/api/preparation/webrtc/sdp`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${client_secret}`,
          "Content-Type": "application/sdp"
        },
        credentials: "include",
        body: pc.localDescription.sdp
      });
      const answerSdp = await sdpResp.text();
      await pc.setRemoteDescription({ type: 'answer', sdp: answerSdp });
      sendTerminalLog("✅ Received SDP Answer. WebRTC Handshake Complete!");
    } catch (err) {
      console.error("WebRTC Error", err);
      sendTerminalLog(`❌ WebRTC Error: ${err.message}`);
    }
  };

  const handleDoneRecording = async () => {
    if (pcRef.current) {
      pcRef.current.close();
      sendTerminalLog("🔌 WebRTC Connection Closed.");
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      await new Promise(resolve => {
        mediaRecorderRef.current.onstop = async () => {
          const blob = new Blob(recordedChunksRef.current, { type: mediaRecorderRef.current.mimeType || 'video/webm' });
          await saveBlobToDB(`interview_video_${id}`, blob);
          sendTerminalLog("💾 Local Video Response recorded and saved to IndexedDB.");
          resolve();
        };
        mediaRecorderRef.current.stop();
      });
    }

    // Instantly close camera tracks to turn off the green light
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }

    setAnswers((prev) => {
      const nextAnswers = {
        ...prev,
        [roundId]: JSON.stringify({ type: "interview", question: interviewQuestion?.question_text || "No question loaded", status: "AI Video Response recorded successfully" }),
      };
      try {
        localStorage.setItem(`answers_${id}`, JSON.stringify(nextAnswers));
      } catch (e) {
        console.error(e);
      }
      return nextAnswers;
    });

    handleNext(true);
  };

  const startGDRecording = async () => {
    setGdAudioPhase("recording");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
      streamRef.current = stream;

      recordedChunksRef.current = [];

      let audioMimeType = 'audio/webm';
      if (typeof MediaRecorder.isTypeSupported === 'function') {
        if (MediaRecorder.isTypeSupported('audio/webm')) {
          audioMimeType = 'audio/webm';
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          audioMimeType = 'audio/mp4';
        } else if (MediaRecorder.isTypeSupported('audio/aac')) {
          audioMimeType = 'audio/aac';
        }
      }

      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: audioMimeType });
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunksRef.current.push(e.data);
      };
      mediaRecorderRef.current.start(1000);
    } catch (err) {
      console.error("GD Audio Error", err);
    }
  };

  const stopGdVoiceAndSend = async () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      await new Promise(resolve => {
        mediaRecorderRef.current.onstop = async () => {
          const blob = new Blob(recordedChunksRef.current, { type: mediaRecorderRef.current.mimeType || 'audio/webm' });
          await saveBlobToDB(`gd_audio_${id}`, blob);
          sendTerminalLog("💾 GD Audio saved to IndexedDB.");
          resolve();
        };
        mediaRecorderRef.current.stop();
      });
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }

    setAnswers((prev) => {
      const nextAnswers = { ...prev, [roundId]: JSON.stringify({ type: "gd", question: gdQuestion?.question_text || "No question loaded", status: "Audio GD contribution saved" }) };
      try {
        localStorage.setItem(`answers_${id}`, JSON.stringify(nextAnswers));
      } catch (e) {
        console.error(e);
      }
      return nextAnswers;
    });

    handleNext(true);
  };

  if (isLoading) {
    return (
      <div className="text-center py-20 flex justify-center">
        <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !config) {
    return <div className="text-center py-10">{error || "Company not found"}</div>;
  }

  if (!currentRound) {
    return <div className="text-center py-10">Round not found</div>;
  }

  if (isFinished && isolatedMode) {
    return <AnalysisPageContent id={id} basePath={basePath} isolatedRoundType={currentRound?.type} />;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      {/* Header Info */}
      <div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 rounded-2xl gap-4 bg-white border"
        style={{
          borderColor: "var(--border)",
        }}
      >
        <div className="flex items-center gap-3">
          {id !== "999" && (
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm shrink-0 border bg-zinc-50 overflow-hidden p-1.5"
              style={{
                borderColor: "var(--border)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={config.icon}
                alt={config.name}
                className="w-full h-full object-contain"
              />
            </div>
          )}
          <div>
            <h1
              className="text-xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              {id === "999" ? currentRound.label : `${config.name} Interview Preparation`}
            </h1>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              {id === "999" ? "Self Practice Mode · Isolated Assessment" : `MBA Placement Track · ${rounds.length} stages`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-red-200 bg-red-50 text-red-700 font-semibold text-sm">
          <svg
            className="w-4 h-4 animate-pulse"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <title>Time Remaining</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Stepper Progress Bar */}
      {id !== "999" && (
        <div
          className="p-5 rounded-2xl bg-white border"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="relative flex items-center justify-between">
            <div
              className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full"
              style={{ background: "var(--accent-pale)", zIndex: 1 }}
            />
            <div
              className="absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full transition-all duration-300"
              style={{
                background: "var(--accent)",
                width: `${(currentRoundIdx / Math.max(1, rounds.length - 1)) * 100}%`,
                zIndex: 2,
              }}
            />

            {rounds.map((round, idx) => {
              const _isCompleted = idx < currentRoundIdx;
              const isActive = idx === currentRoundIdx;
              return (
                <div
                  key={round.id}
                  className="relative flex flex-col items-center z-10"
                >
                  <div
                    className="px-4 py-1.5 rounded-full flex items-center justify-center font-bold text-[10px] sm:text-xs transition-all duration-300 border shadow-sm"
                    style={{
                      background: isActive ? "var(--accent)" : "var(--bg-card)",
                      color: isActive ? "#ffffff" : "var(--text-muted)",
                      borderColor: isActive ? "var(--accent)" : "var(--border)",
                      boxShadow: isActive ? "0 0 12px rgba(0,0,0,0.1)" : "none",
                    }}
                  >
                    {round.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Interactive Round Container */}
      <div
        className="p-6 rounded-2xl min-h-[300px] flex flex-col justify-between space-y-6 bg-white border"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span
              className="text-xs uppercase tracking-widest font-bold px-2.5 py-1 rounded-md"
              style={{
                background: "var(--accent-pale)",
                color: "var(--accent)",
              }}
            >
              STAGE {currentRoundIdx + 1}: {currentRound.label}
            </span>
            <p
              className="mt-2 text-sm font-semibold"
              style={{ color: "var(--text-secondary)" }}
            >
              {currentRound.description}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleSkip}
              className="px-4 py-2 text-sm font-semibold rounded-xl border transition-all hover:bg-zinc-50 text-zinc-600 border-zinc-200 hover:border-zinc-300 cursor-pointer"
            >
              {currentRound?.type === "aptitude" ? "Submit Early" : "Skip Round"}
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2 text-sm font-semibold rounded-xl border border-transparent text-white transition-all hover:opacity-90 cursor-pointer shadow-sm"
              style={{ background: "var(--accent)" }}
            >
              {currentRoundIdx === rounds.length - 1 &&
                (currentRound.type !== "aptitude" || aptQIdx === (aptitudeQuestions.length > 0 ? aptitudeQuestions.length - 1 : 9))
                ? "Finish Prep →"
                : "Next →"}
            </button>
          </div>
        </div>

        {/* Aptitude UI */}
        {currentRound.type === "aptitude" && currentQ && (
          <div className="space-y-4">
            <div
              className="p-4 rounded-xl font-medium text-sm border bg-zinc-50 space-y-2"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="flex justify-between items-center text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                <span>{currentQ.category} Section</span>
                <span>Question {aptQIdx + 1} of {aptitudeQuestions.length > 0 ? aptitudeQuestions.length : 10}</span>
              </div>
              <p className="font-semibold text-zinc-900 leading-relaxed">
                {currentQ.q}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              {currentQ.options.map((option, idx) => (
                <button
                  key={`opt-${idx}`}
                  type="button"
                  onClick={() => setAptSelectedOpt(option)}
                  className="w-full text-left p-3.5 rounded-xl border text-sm font-semibold transition-all hover:bg-zinc-50 cursor-pointer"
                  style={{
                    borderColor:
                      aptSelectedOpt === option
                        ? "var(--accent)"
                        : "var(--border)",
                    background:
                      aptSelectedOpt === option
                        ? "var(--accent-pale)"
                        : "transparent",
                    color:
                      aptSelectedOpt === option
                        ? "var(--text-primary)"
                        : "var(--text-secondary)",
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* GD UI (Voice Only Contribution Simulator) */}
        {currentRound.type === "gd" && (
          <div className="space-y-4">
            <div
              className="flex flex-col items-center justify-center p-8 border rounded-xl bg-zinc-50 space-y-4"
              style={{ borderColor: "var(--border)" }}
            >
              {gdAudioPhase === "ready" && (
                <div className="flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center bg-zinc-950 text-white shadow-md border-none">
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <title>Microphone</title>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v5a3 3 0 01-3 3z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-zinc-900">
                      Start AI Audio GD
                    </h3>

                    <button
                      type="button"
                      onClick={() => startGDRecording()}
                      className="mt-5 px-6 py-2.5 bg-zinc-900 text-white rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-colors shadow-sm cursor-pointer border-none"
                    >
                      Start Recording
                    </button>
                    {gdQuestion && (
                      <div className="mt-6 p-4 bg-zinc-100 border border-zinc-200 rounded-xl text-left w-full max-w-md mx-auto">
                        <p className="text-xs font-bold text-zinc-500 mb-1 uppercase tracking-wider">Audio Preparation</p>
                        <p className="text-sm font-semibold text-zinc-800">{gdQuestion.question_text}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {gdAudioPhase === "recording" && (
                <div className="flex flex-col items-center justify-center py-6 text-center space-y-5">
                  <div className="w-24 h-24 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-500 animate-pulse shadow-sm">
                    <svg
                      className="w-10 h-10"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <title>Microphone</title>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v5a3 3 0 01-3 3z"
                      />
                    </svg>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-red-600 animate-pulse uppercase tracking-wider">
                      Recording Live
                    </span>
                    <p className="text-xs text-zinc-500 mt-1">
                      Share your perspective with the group. Click Done when
                      finished speaking.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={stopGdVoiceAndSend}
                    className="px-6 py-3 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 cursor-pointer shadow-md hover:scale-[1.02] transition-all"
                  >
                    Done
                  </button>

                  {gdQuestion && (
                    <div className="mt-4 p-4 bg-zinc-100 border border-zinc-200 rounded-xl text-center w-full max-w-md">
                      <p className="text-xs font-bold text-zinc-500 mb-1 uppercase tracking-wider">Audio Preparation</p>
                      <p className="text-sm font-semibold text-zinc-800">{gdQuestion.question_text}</p>
                    </div>
                  )}
                </div>
              )}

              {gdAudioPhase === "feedback" && (
                <div
                  className="w-full rounded-xl border p-8 bg-[#f9f9f9] text-center space-y-4 animate-fade-in flex flex-col items-center justify-center"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                    <svg
                      className="w-8 h-8 stroke-current"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                    >
                      <title>Success checkmark</title>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-zinc-900">
                      Audio Contribution Saved
                    </h3>
                    <p className="text-xs text-zinc-500 max-w-sm mt-1.5 mx-auto leading-relaxed">
                      Your response has been successfully posted to the Group
                      Discussion board. Click the <strong>Next →</strong> button
                      at the bottom right to continue.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setGdAudioPhase("ready");
                      const updatedAnswers = { ...answers };
                      delete updatedAnswers[roundId];
                      setAnswers(updatedAnswers);
                    }}
                    className="text-xs text-zinc-500 hover:text-zinc-800 underline font-semibold cursor-pointer border-none bg-transparent pt-2"
                  >
                    Re-record Point
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* AI Video Interview (for both Technical and HR rounds) */}
        {(currentRound.type === "interview" || currentRound.type === "hr") && (
          <div className="space-y-4 flex-1 flex flex-col justify-center">
            {audioPhase === "ready" && (
              <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                <div className="w-20 h-20 rounded-full flex items-center justify-center bg-zinc-950 text-white shadow-md border-none">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <title>Video Camera</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-900">
                    Start AI Video Interview
                  </h3>
                  <div className="mt-4 flex flex-col items-center gap-3">
                    <div className="inline-block px-4 py-1.5 bg-pink-50 text-pink-600 rounded-full text-sm font-semibold border border-pink-100">
                      Once connected, say "Hello" to start!
                    </div>
                    <button
                      type="button"
                      onClick={() => startInterviewRecording()}
                      className="px-6 py-2.5 bg-zinc-900 text-white rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-colors shadow-sm cursor-pointer border-none"
                    >
                      Start Interview
                    </button>
                  </div>
                </div>
              </div>
            )}

            {audioPhase === "recording" && (
              <div className="flex flex-col items-center justify-center py-6 text-center space-y-5">
                {/* Live Webcam Feed Box */}
                <div className="relative w-full max-w-md aspect-video rounded-2xl overflow-hidden bg-zinc-950 shadow-inner border border-zinc-200">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                  {/* Top-left REC tag */}
                  <div className="absolute top-3 left-3 bg-red-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1.5 animate-pulse shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-white block" />
                    REC {formatTime(recordingTime)}
                  </div>
                  {/* Bottom-left Status indicator */}
                  <div className="absolute bottom-3 left-3 bg-black/60 text-white text-[10px] font-semibold px-2 py-1 rounded-md flex items-center gap-1.5 backdrop-blur-xs border border-white/10">
                    <span className={`w-1.5 h-1.5 rounded-full ${isWebRTCConnected ? 'bg-emerald-500 animate-pulse' : 'bg-yellow-500 animate-pulse'} block`} />
                    {isWebRTCConnected ? 'AI Connected' : 'Connecting to AI...'}
                  </div>
                  {/* Bottom-right audio level visualizer overlay */}
                  <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] font-semibold px-2 py-1 rounded-md flex items-center gap-1 backdrop-blur-xs border border-white/10">
                    <div className="flex items-center gap-0.5 h-3">
                      {[1, 2, 3, 4].map((i) => {
                        const h =
                          Math.abs(Math.sin((i + wavePhase) * 0.8)) * 10 + 2;
                        return (
                          <div
                            key={i}
                            className="w-0.5 bg-purple-400 rounded-full transition-all duration-75"
                            style={{ height: `${h}px` }}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold text-red-600 animate-pulse uppercase tracking-wider">
                    Interview in Progress
                  </span>
                  <p className="text-xs text-zinc-500 mt-1">
                    Explain your answer. Click stop when you are finished
                    speaking.
                  </p>
                </div>




              </div>
            )}

            {audioPhase === "feedback" && (
              <div
                className="rounded-xl border p-8 bg-[#f9f9f9] text-center space-y-4 animate-fade-in flex flex-col items-center justify-center"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                  <svg
                    className="w-8 h-8 stroke-current"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                  >
                    <title>Success checkmark</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-900">
                    Video Response Captured
                  </h3>
                  <p className="text-xs text-zinc-500 max-w-sm mt-1.5 mx-auto leading-relaxed">
                    Your recording has been successfully saved. Click the{" "}
                    <strong>Next →</strong> button at the bottom right to
                    continue to the next round.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setAudioPhase("ready");
                    const updatedAnswers = { ...answers };
                    delete updatedAnswers[roundId];
                    setAnswers(updatedAnswers);
                  }}
                  className="text-xs text-zinc-500 hover:text-zinc-800 underline font-semibold cursor-pointer border-none bg-transparent pt-2"
                >
                  Re-record Response
                </button>
              </div>
            )}
          </div>
        )}

        {/* Navigation Action Panel (Only shown during active recording phases for Interview) */}
        {/* {((currentRound?.type === "interview" || currentRound?.type === "hr") && audioPhase === "recording") && (
          <div
            className="flex justify-end items-center pt-4 border-t animate-fade-in"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="flex gap-4 items-center">
              <button
                type="button"
                onClick={() => {
                  const newPausedState = !isTimerPaused;
                  setIsTimerPaused(newPausedState);
                  if (mediaRecorderRef.current) {
                    if (newPausedState && mediaRecorderRef.current.state === "recording") {
                      mediaRecorderRef.current.pause();
                      sendTerminalLog("⏸️ WebRTC MediaRecorder Paused");
                    } else if (!newPausedState && mediaRecorderRef.current.state === "paused") {
                      mediaRecorderRef.current.resume();
                      sendTerminalLog("▶️ WebRTC MediaRecorder Resumed");
                    }
                  }
                }}
                className="px-6 py-3 bg-zinc-800 text-white rounded-xl text-xs font-bold hover:bg-zinc-700 cursor-pointer shadow-md hover:scale-[1.02] transition-all"
              >
                {isTimerPaused ? "Resume Timer" : "Pause Timer"}
              </button>

              <button
                type="button"
                onClick={currentRound.type === "gd" ? stopGdVoiceAndSend : handleDoneRecording}
                className="px-6 py-3 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 cursor-pointer shadow-md hover:scale-[1.02] transition-all"
              >
                Done
              </button>
            </div>
          </div>
        )} */}

      </div>
    </div>
  );
}

export default function RoundPage({ params }) {
  const { id, roundId } = use(params);

  return (
    <Suspense
      fallback={
        <div className="p-10 text-center text-sm text-zinc-500">
          Loading round...
        </div>
      }
    >
      <RoundPageContent id={id} roundId={roundId} />
    </Suspense>
  );
}
