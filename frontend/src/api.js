import axios from "axios";

// Change this if your backend runs somewhere other than the default
// `uvicorn app.main:app --reload` address.
export const API_BASE_URL = "https://platelabel-ai.onrender.com";

/**
 * Sends the image to the backend's /analyze endpoint.
 * Throws an Error with a readable `.message` — components can just
 * catch and display err.message directly.
 */
export async function analyzeFood(imageFile) {
  const formData = new FormData();
  formData.append("file", imageFile);

  try {
    const response = await axios.post(`${API_BASE_URL}/analyze`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      // FastAPI's HTTPException body looks like { detail: "..." }
      const detail = error.response.data?.detail;
      throw new Error(detail || `Server error (${error.response.status})`);
    }
    if (error.request) {
      throw new Error(
        "Couldn't reach the backend. Make sure it's running: " +
          "cd backend, then python -m uvicorn app.main:app --reload"
      );
    }
    throw new Error(error.message);
  }
}
