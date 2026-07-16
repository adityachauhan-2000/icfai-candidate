import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  try {
    const { userQuery } = await request.json();

    const response = await axios.post(
      "https://api.kitefishai.com/v1/chat",
      {
        model: "kitefish-reasoning",
        messages: [{ role: "user", content: userQuery }]
      },
      {
        headers: {
          "X-api-key": "932c84dfea66476791f94b5ee80384eb",
          "Content-Type": "application/json"
        }
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Server API error:", error.response?.data || error.message);
    return NextResponse.json(
      { error: "Failed to fetch response from AI" },
      { status: error.response?.status || 500 }
    );
  }
}
