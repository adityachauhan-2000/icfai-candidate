import apiClient from "@/utils/apiClient";

export const fetchChatCompletion = async (userQuery) => {
  try {
    const response = await apiClient.post("/chat", {
      userQuery
    });
    
    let data = response.data;
    
    // If the API returns a stringified JSON, parse it
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) {
        // It's just a normal string
      }
    }

    // Extract the text content based on various possible API response structures
    let text = data?.choices?.[0]?.message?.content || 
               data?.message?.content || 
               data?.response?.content || 
               data?.content;

    // Fallbacks if text is still not found
    if (!text && typeof data?.message === 'string') text = data.message;
    if (!text && typeof data?.response === 'string') text = data.response;
    
    // If the text itself is a JSON string (like what Kitefish currently returns)
    if (typeof text === 'string') {
      try {
        const parsedText = JSON.parse(text);
        if (parsedText.content) {
          text = parsedText.content;
        }
      } catch (e) {
        // Normal string, do nothing
      }
    }

    // If data itself is the object {"content": "...", "role": "assistant"} 
    // it will be caught by `data?.content` above.

    return text || (typeof data === 'object' ? JSON.stringify(data) : String(data));
  } catch (error) {
    console.error("Error fetching chat completion:", error);
    throw error;
  }
};
