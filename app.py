"""
DecodeLabs AI Internship - Project 1: Rule-Based AI Chatbot Web Application
Author: AI Engineer Intern
Description: Flask web server providing RESTful API endpoints and serving the
             high-end interactive web frontend with real-time IPO pipeline telemetry.
"""

import time
import string
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from chatbot import sanitize_input, build_knowledge_base, get_response

app = Flask(__name__, static_folder="static", static_url_path="")
CORS(app)

# Cache the knowledge base
KNOWLEDGE_BASE = build_knowledge_base()


def inspect_ipo_pipeline(raw_input: str):
    """
    Executes the IPO model while capturing intermediate processing steps and telemetry.
    Returns:
        dict containing raw_input, sanitized_input, match_type, matched_rule, response, latency_ms
    """
    start_time = time.perf_counter()
    
    cleaned = sanitize_input(raw_input)
    
    if not cleaned:
        latency_ms = (time.perf_counter() - start_time) * 1000
        return {
            "raw_input": raw_input,
            "sanitized_input": "",
            "match_type": "empty",
            "matched_key": None,
            "response": "",
            "latency_ms": round(latency_ms, 3)
        }
    
    # 1. Direct O(1) Hash Map Lookup
    if cleaned in KNOWLEDGE_BASE:
        response = KNOWLEDGE_BASE[cleaned]
        latency_ms = (time.perf_counter() - start_time) * 1000
        return {
            "raw_input": raw_input,
            "sanitized_input": cleaned,
            "match_type": "direct_hash",
            "matched_key": cleaned,
            "response": response,
            "latency_ms": round(latency_ms, 3)
        }
    
    # 2. Keyword Substring Fallback Matching
    for key, response in KNOWLEDGE_BASE.items():
        if len(key) > 3 and key in cleaned:
            latency_ms = (time.perf_counter() - start_time) * 1000
            return {
                "raw_input": raw_input,
                "sanitized_input": cleaned,
                "match_type": "keyword_substring",
                "matched_key": key,
                "response": response,
                "latency_ms": round(latency_ms, 3)
            }
            
    # 3. Fallback Guardrail
    fallback_response = "I do not understand. Type 'help' to see available questions."
    latency_ms = (time.perf_counter() - start_time) * 1000
    return {
        "raw_input": raw_input,
        "sanitized_input": cleaned,
        "match_type": "fallback",
        "matched_key": None,
        "response": fallback_response,
        "latency_ms": round(latency_ms, 3)
    }


@app.route("/")
def index():
    """Serves the main frontend single-page interface."""
    return send_from_directory(app.static_folder, "index.html")


@app.route("/api/chat", methods=["POST"])
def api_chat():
    """
    Endpoint for chat messages.
    Expects JSON: { "message": "user input string" }
    Returns: JSON with response and IPO telemetry.
    """
    data = request.get_json(silent=True) or {}
    message = data.get("message", "")
    
    if not isinstance(message, str):
        return jsonify({"error": "Invalid message format, string expected."}), 400
        
    result = inspect_ipo_pipeline(message)
    return jsonify(result)


@app.route("/api/knowledge-base", methods=["GET"])
def api_knowledge_base():
    """
    Returns the categorized intent and rule matrix for the UI knowledge explorer.
    """
    categories = {
        "Greetings & Salutations": [
            {"intent": "hello", "response": KNOWLEDGE_BASE["hello"]},
            {"intent": "hi", "response": KNOWLEDGE_BASE["hi"]},
            {"intent": "hey", "response": KNOWLEDGE_BASE["hey"]},
            {"intent": "greetings", "response": KNOWLEDGE_BASE["greetings"]},
            {"intent": "good morning", "response": KNOWLEDGE_BASE["good morning"]},
            {"intent": "good evening", "response": KNOWLEDGE_BASE["good evening"]},
        ],
        "Internship & Project Details": [
            {"intent": "what is project 1", "response": KNOWLEDGE_BASE["what is project 1"]},
            {"intent": "what is decodelabs", "response": KNOWLEDGE_BASE["what is decodelabs"]},
            {"intent": "who are you", "response": KNOWLEDGE_BASE["who are you"]},
        ],
        "Technical Concepts & Architecture": [
            {"intent": "what is rule based ai", "response": KNOWLEDGE_BASE["what is rule based ai"]},
            {"intent": "what is ipo model", "response": KNOWLEDGE_BASE["what is ipo model"]},
            {"intent": "rule based vs llm", "response": KNOWLEDGE_BASE["rule based vs llm"]},
        ],
        "Guidance & Contact": [
            {"intent": "help", "response": KNOWLEDGE_BASE["help"]},
            {"intent": "commands", "response": KNOWLEDGE_BASE["commands"]},
            {"intent": "contact", "response": KNOWLEDGE_BASE["contact"]},
            {"intent": "email", "response": KNOWLEDGE_BASE["email"]},
        ]
    }
    return jsonify({"rules": categories, "total_rules": len(KNOWLEDGE_BASE)})


@app.route("/api/health", methods=["GET"])
def api_health():
    """Health check endpoint for telemetry monitoring."""
    return jsonify({
        "status": "healthy",
        "service": "DecodeLabs Rule-Based AI Chatbot API",
        "version": "1.0.0",
        "total_intents": len(KNOWLEDGE_BASE)
    })


if __name__ == "__main__":
    import sys
    if sys.platform == "win32":
        try:
            sys.stdout.reconfigure(encoding='utf-8')
        except Exception:
            pass
    print("\n========================================================")
    print(" >> DECODELABS RULE-BASED AI CHATBOT WEB SERVER ACTIVE")
    print(" >> Access UI locally at: http://127.0.0.1:5000")
    print("========================================================\n")
    app.run(host="0.0.0.0", port=5000, debug=False)
