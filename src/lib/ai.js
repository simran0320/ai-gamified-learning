// Client-side AI helpers (using OpenAI directly)
import axios from 'axios';

const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_KEY;

export async function summarizeText(text) {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You summarize educational videos. Output 5-8 crisp bullet points separated by newline."
          },
          {
            role: "user",
            content: `Summarize the following transcript:\n\n${text}`
          }
        ],
        max_tokens: 500,
        temperature: 0.2
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error summarizing:', error);
    throw error;
  }
}

export async function generateQuiz(text) {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Create multiple-choice questions from transcript. Output ONLY JSON."
          },
          {
            role: "user",
            content: `From the transcript below, generate 5 MCQs. Strict JSON:
            {"questions": [
              {"id":"q1","q":"Question?","choices":["A","B","C","D"],"answerIndex":0},
              {"id":"q2","q":"Question?","choices":["A","B","C","D"],"answerIndex":2}
            ]}
            Transcript:
            ${text}`
          }
        ],
        max_tokens: 800,
        temperature: 0.4
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const content = response.data.choices[0].message.content;
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      const s = content.indexOf("{");
      const e = content.lastIndexOf("}");
      parsed = JSON.parse(content.slice(s, e + 1));
    }
    return parsed.questions || [];
  } catch (error) {
    console.error('Error generating quiz:', error);
    throw error;
  }
}