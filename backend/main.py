from ai_analyzer import get_ai_analysis

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel

from resume_parser import extract_text_from_pdf
from ats_calculator import calculate_ats_score

from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer
)
from reportlab.lib.styles import getSampleStyleSheet


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "AI Resume Checker API Running"
    }


@app.post("/analyze")
async def analyze_resume(
    resume: UploadFile = File(...),
    jd: str = Form(...)
):
    resume_text = extract_text_from_pdf(
        resume.file
    )

    result = calculate_ats_score(
        resume_text,
        jd
    )

    try:
        ai_feedback = get_ai_analysis(
            resume_text,
            jd
        )
    except Exception as e:
        ai_feedback = f"AI Analysis unavailable: {str(e)}"

    result["ai_feedback"] = ai_feedback

    return result


class ReportData(BaseModel):
    score: float
    matched_keywords: list[str]
    missing_keywords: list[str]
    suggestions: list[str]
    ai_feedback: str = ""


@app.post("/download-report")
async def download_report(data: ReportData):

    pdf_path = "ATS_Report.pdf"

    doc = SimpleDocTemplate(pdf_path)

    styles = getSampleStyleSheet()

    content = []

    content.append(
        Paragraph(
            "AI Resume Checker Report",
            styles["Title"]
        )
    )

    content.append(Spacer(1, 20))

    content.append(
        Paragraph(
            f"ATS Score: {data.score}%",
            styles["Heading1"]
        )
    )

    content.append(Spacer(1, 20))

    content.append(
        Paragraph(
            "Matched Keywords",
            styles["Heading2"]
        )
    )

    for keyword in data.matched_keywords:
        content.append(
            Paragraph(
                f"• {keyword}",
                styles["BodyText"]
            )
        )

    content.append(Spacer(1, 20))

    content.append(
        Paragraph(
            "Missing Keywords",
            styles["Heading2"]
        )
    )

    for keyword in data.missing_keywords:
        content.append(
            Paragraph(
                f"• {keyword}",
                styles["BodyText"]
            )
        )

    content.append(Spacer(1, 20))

    content.append(
        Paragraph(
            "Suggestions",
            styles["Heading2"]
        )
    )

    for suggestion in data.suggestions:
        content.append(
            Paragraph(
                f"• {suggestion}",
                styles["BodyText"]
            )
        )

    content.append(Spacer(1, 20))

    content.append(
        Paragraph(
            "AI Analysis",
            styles["Heading2"]
        )
    )

    content.append(
        Paragraph(
            data.ai_feedback.replace("\n", "<br/>"),
            styles["BodyText"]
        )
    )

    doc.build(content)

    return FileResponse(
        pdf_path,
        media_type="application/pdf",
        filename="ATS_Report.pdf"
    )