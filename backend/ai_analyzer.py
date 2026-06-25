import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

def get_ai_analysis(resume_text, jd_text):
    try:

        model = genai.GenerativeModel(
            "gemini-2.5-flash"
        )

        prompt = f"""
You are a professional ATS Resume Expert.

Analyze the resume against the job description.

Resume:
{resume_text[:4000]}

Job Description:
{jd_text[:2000]}

Return ONLY the following sections:

ATS Match Summary:
(2-3 lines)

Missing Skills:
(Bullet points)

Resume Improvements:
(Bullet points)

Strong Points:
(Bullet points)

Final Recommendation:
(1-2 lines)

Keep the response under 300 words.
"""

        response = model.generate_content(
            prompt
        )

        return response.text

    except Exception as e:

        if "429" in str(e):
            return """
ATS Match Summary:
AI quota limit reached.

Missing Skills:
Check the Missing Keywords section above.

Resume Improvements:
Add missing keywords and quantify achievements.

Strong Points:
Resume parsed successfully and ATS score generated.

Final Recommendation:
Try AI analysis again after the Gemini quota resets.
"""

        return f"AI ERROR: {str(e)}"