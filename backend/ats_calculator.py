import re

def calculate_ats_score(resume_text, jd_text):

    resume_words = set(
        re.findall(r"\w+", resume_text.lower())
    )

    jd_words = set(
        re.findall(r"\w+", jd_text.lower())
    )

    matched = resume_words.intersection(jd_words)
    missing = jd_words - resume_words

    score = (
        len(matched) /
        max(len(jd_words), 1)
    ) * 100

    suggestions = []

    if len(missing) > 0:
        suggestions.append(
            "Add more missing skills and keywords from the Job Description."
        )

    if score < 60:
        suggestions.append(
            "Your resume needs significant optimization for this role."
        )

    if score >= 60 and score < 80:
        suggestions.append(
            "Good match, but there is room for improvement."
        )

    if score >= 80:
        suggestions.append(
            "Excellent ATS compatibility."
        )

    suggestions.append(
        "Use measurable achievements in project and work descriptions."
    )

    suggestions.append(
        "Keep your resume ATS-friendly with simple formatting."
    )

    return {
    "score": round(score, 2),
    "matched_keywords": sorted(list(matched))[:20],
    "missing_keywords": sorted(list(missing))[:20],
    "matched_count": len(matched),
    "missing_count": len(missing),
    "suggestions": suggestions
}