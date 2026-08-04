"""
Unit Test Suite for DecodeLabs Rule-Based AI Chatbot (Task 1)
"""

import unittest
from chatbot import sanitize_input, build_knowledge_base, get_response


class TestRuleBasedChatbot(unittest.TestCase):

    def setUp(self):
        self.kb = build_knowledge_base()

    def test_sanitize_input(self):
        self.assertEqual(sanitize_input("  HELLO  "), "hello")
        self.assertEqual(sanitize_input("What is Project 1?"), "what is project 1")
        self.assertEqual(sanitize_input("  Hi!  "), "hi")
        self.assertEqual(sanitize_input(""), "")
        self.assertEqual(sanitize_input(None), "")

    def test_direct_intent_lookup(self):
        self.assertIn("Hello!", get_response("hello", self.kb))
        self.assertIn("Project 1 is the foundation phase", get_response("what is project 1", self.kb))
        self.assertIn("DecodeLabs is an AI research", get_response("what is decodelabs", self.kb))
        self.assertIn("Input (Sanitization) -> Process", get_response("what is ipo model", self.kb))

    def test_punctuation_handling(self):
        self.assertIn("Hello!", get_response("hello!", self.kb))
        self.assertIn("Project 1 is the foundation phase", get_response("What is project 1?", self.kb))
        self.assertIn("Input (Sanitization) -> Process", get_response("ipo model.", self.kb))

    def test_keyword_fallback(self):
        # Queries with additional words that include the intent phrase
        self.assertIn("DecodeLabs is an AI research", get_response("tell me decodelabs info", self.kb))
        self.assertIn("Rule-Based AI relies on explicit logic", get_response("explain rule based ai concept", self.kb))

    def test_fallback_response(self):
        fallback_msg = "I do not understand. Type 'help' to see available questions."
        self.assertEqual(get_response("xyz123 random question", self.kb), fallback_msg)
        self.assertEqual(get_response("quantum physics superstring", self.kb), fallback_msg)

    def test_blank_input(self):
        self.assertEqual(get_response("   ", self.kb), "")
        self.assertEqual(get_response("", self.kb), "")


if __name__ == "__main__":
    unittest.main()
