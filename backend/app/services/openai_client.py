import os
import json

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

SYSTEM_PROMPT = """
You are SciSeek, a science-focused AI assistant.

Your job is to answer science questions clearly, accurately, and in a structured way for curious general users and students.

- First determine if the question is science-related.

A science-related question includes topics such as physics, chemistry, biology, astronomy, Earth science, medicine, and technology.

If the question is NOT science-related:
- set "is_science" to false
- provide a friendly and helpful refusal_message
- do NOT use negative or restrictive phrasing like "can't", "cannot", or "not allowed"
- do NOT sound apologetic or robotic
- briefly explain that SciSeek focuses on science topics
- redirect the user toward what SciSeek *can* help with
- keep the tone conversational, positive, and welcoming
- Suggested questions must always be clearly science-focused
- Do NOT suggest questions about buying, comparing, or choosing products
- Instead, focus on the underlying science behind the topic
- For example, if the topic is laptops, suggest questions about batteries, processors, or display physics—not product comparisons
- set hook, short_summary, sections, key_points, citations, and visual to null
- still include 3 engaging science-related questions in related_questions

If the question IS science-related:
- set "is_science" to true
- set refusal_message to null
- return the full structured answer

Rules:
- Answer only science-related questions.
- Be clear and easy to understand.
- Do not use markdown.
- Include 2 to 4 sections.
- Include 3 to 5 key points.
- Include exactly 3 related questions.
- Include 2 to 4 citations from reputable scientific or educational sources when possible.
- Prefer sources like NASA, NIH, CDC, NOAA, Britannica, universities, museums, and major scientific organizations.
- Do not invent fake URLs.
- If unsure of a citation, leave it out.
- Keep visual as {"type": "none", "data": {}} for now.
"""

MODEL_BY_TIER = {
    "free": "gpt-5.4-mini",
    "paid": "gpt-5.4",
}

MODE_INSTRUCTIONS = {
    "simple": "Explain in the simplest possible way. Assume no prior knowledge. Use short sentences.",
    "standard": "Give a clear, well-structured explanation suitable for general users.",
    "deep": "Provide a detailed, more technical explanation with deeper insight and nuance.",
}

SCISEEK_SCHEMA = {
    "type": "object",
    "properties": {
        "is_science": {"type": "boolean"},
        "refusal_message": {"type": ["string", "null"]},
        "hook": {"type": ["string", "null"]},
        "short_summary": {"type": ["string", "null"]},
        "sections": {
            "type": ["array", "null"],
            "items": {
                "type": "object",
                "properties": {
                    "title": {"type": "string"},
                    "body": {"type": "string"}
                },
                "required": ["title", "body"],
                "additionalProperties": False
            }
        },
        "key_points": {
            "type": ["array", "null"],
            "items": {"type": "string"}
        },
        "related_questions": {
            "type": "array",
            "items": {"type": "string"}
        },
        "citations": {
            "type": ["array", "null"],
            "items": {
                "type": "object",
                "properties": {
                    "title": {"type": "string"},
                    "url": {"type": "string"},
                    "source": {"type": "string"}
                },
                "required": ["title", "url", "source"],
                "additionalProperties": False
            }
        },
        "visual": {
            "type": ["object", "null"],
            "properties": {
                "type": {"type": "string"},
                "data": {
                    "type": "object",
                    "properties": {},
                    "required": [],
                    "additionalProperties": False
                }
            },
            "required": ["type", "data"],
            "additionalProperties": False
        }
    },
    "required": [
        "is_science",
        "refusal_message",
        "hook",
        "short_summary",
        "sections",
        "key_points",
        "related_questions",
        "citations",
        "visual"
    ],
    "additionalProperties": False
}


def generate_sciseek_answer(
    question: str,
    tier: str = "free",
    mode: str = "standard"
) -> dict:
    model = MODEL_BY_TIER.get(tier, "gpt-5.4-mini")
    mode_instruction = MODE_INSTRUCTIONS.get(mode, MODE_INSTRUCTIONS["standard"])

    response = client.responses.create(
        model=model,
        input=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "system", "content": mode_instruction},
            {"role": "user", "content": question},
        ],
        text={
            "format": {
                "type": "json_schema",
                "name": "sciseek_answer",
                "schema": SCISEEK_SCHEMA,
                "strict": True,
            }
        },
    )

    text_output = response.output_text.strip()
    parsed = json.loads(text_output)

    usage = getattr(response, "usage", None)
    if usage:
        print(
            f"[SciSeek] tier={tier} mode={mode} "
            f"input_tokens={getattr(usage, 'input_tokens', 'n/a')} "
            f"output_tokens={getattr(usage, 'output_tokens', 'n/a')} "
            f"question={question[:80]}"
        )

    return {
        "answer": parsed
    }