import requests
from django.conf import settings

def call_openrouter(prompt):
    endpoint = "https://openrouter.ai/api/v1/chat/completions"

    headers = {
        "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }

    body = {
        "model": "meta-llama/llama-3.1-70b-instruct",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7
    }

    res = requests.post(endpoint, json=body, headers=headers)
    return res.json()["choices"][0]["message"]["content"]
