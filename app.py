import os

from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
from google import genai


# ========================================
# LOAD ENVIRONMENT VARIABLES
# ========================================

load_dotenv()


# ========================================
# GET GEMINI API KEY
# ========================================

api_key = os.getenv("GEMINI_API_KEY")


if not api_key:

    raise ValueError(
        "GEMINI_API_KEY is missing. "
        "Please check your .env file."
    )


# ========================================
# CREATE GEMINI CLIENT
# ========================================

client = genai.Client(
    api_key=api_key
)


# ========================================
# CREATE FLASK APPLICATION
# ========================================

app = Flask(__name__)


# ========================================
# HOME PAGE
# ========================================

@app.route("/")
def home():

    return render_template(
        "index.html"
    )


# ========================================
# IMPROVE WHATSAPP MESSAGE
# ========================================

@app.route(
    "/improve",
    methods=["POST"]
)
def improve_message():

    try:

        # ====================================
        # GET DATA FROM BROWSER
        # ====================================

        data = request.get_json()


        # Check if data exists
        if not data:

            return jsonify({

                "success": False,

                "error":
                "No message data was received."

            }), 400


        # Get message
        message = data.get(
            "message",
            ""
        ).strip()


        # Get selected style
        style = data.get(
            "style",
            "Professional"
        )


        # ====================================
        # CHECK MESSAGE
        # ====================================

        if not message:

            return jsonify({

                "success": False,

                "error":
                "Please enter a WhatsApp message."

            }), 400


        # Maximum message length
        if len(message) > 500:

            return jsonify({

                "success": False,

                "error":
                "Message must be 500 characters or less."

            }), 400


        # ====================================
        # VALID MESSAGE STYLES
        # ====================================

        allowed_styles = [

            "Professional",

            "Friendly",

            "Formal",

            "Short and Simple"

        ]


        # If invalid style is received,
        # use Professional
        if style not in allowed_styles:

            style = "Professional"


        # ====================================
        # CREATE AI PROMPT
        # ====================================

        prompt = f"""
You are an AI WhatsApp Message Improver.

Rewrite the user's WhatsApp message so
that it is clear, natural, grammatically
correct, and appropriate for the selected style.

Selected style:
{style}

Original WhatsApp message:
{message}

Follow these rules:

1. Keep the original meaning.

2. Do not invent new information.

3. Do not change names, dates, times,
   numbers, locations, or important facts.

4. Correct grammar and spelling.

5. Make the English natural and easy
   to understand.

6. Follow the selected style.

7. Keep the result suitable for WhatsApp.

8. Do not add explanations.

9. Do not add headings.

10. Do not write "Improved message:".

11. Return ONLY the final improved message.

Style guidelines:

Professional:
Clear, polite, polished, and suitable
for school or workplace communication.

Friendly:
Warm, natural, polite, and conversational.

Formal:
Respectful, official, and professional.

Short and Simple:
Short, clear, direct, and easy to understand.

Now improve the message.
"""


        # ====================================
        # SEND REQUEST TO GEMINI
        # ====================================

        interaction = client.interactions.create(

            model="gemini-3.6-flash",

            input=prompt

        )


        # ====================================
        # GET AI RESPONSE
        # ====================================

        improved_message = (
            interaction.output_text.strip()
        )


        # ====================================
        # CHECK AI RESPONSE
        # ====================================

        if not improved_message:

            return jsonify({

                "success": False,

                "error":
                "The AI did not return a message. "
                "Please try again."

            }), 500


        # ====================================
        # SEND SUCCESS RESPONSE
        # ====================================

        return jsonify({

            "success": True,

            "message": improved_message

        })


    # ========================================
    # HANDLE ERRORS
    # ========================================

    except Exception as e:

        print(
            "Gemini Error:",
            e
        )


        return jsonify({

            "success": False,

            "error":
            "Something went wrong while "
            "contacting the AI. Please try again."

        }), 500


# ========================================
# RUN FLASK APPLICATION
# ========================================

if __name__ == "__main__":

    app.run(
        debug=True
    )