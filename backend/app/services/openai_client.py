from openai import OpenAI
import os

# This is the "3-line switch"
client = OpenAI(
    api_key=os.getenv("GEMINI_API_KEY"),
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
)

async def get_science_answer(question: str):
    response = client.chat.completions.create(
        model="gemini-1.5-flash", # Use the fast, cheap model first
        messages=[
            {"role": "system", "content": "You are a SciSeek expert. Provide structured science answers with citations."},
            {"role": "user", "content": question}
        ]
    )
    return response.choices[0].message.content

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