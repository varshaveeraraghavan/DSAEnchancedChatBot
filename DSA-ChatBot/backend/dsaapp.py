
import os
import sys
from flask import Flask, request, jsonify
from flask_cors import CORS
import uuid
from combined import get_answer

sys.path.append("../..")

app = Flask(__name__)
CORS(app)


@app.route('/upload', methods=['POST'])
def upload_pdf():
    try:
        uploaded_file = request.files['file']
        if uploaded_file.filename != '':
            target_directory = "./docs"
            os.makedirs(target_directory, exist_ok=True)
            unique_filename = str(uuid.uuid4()) + ".pdf"
            file_path = os.path.join(target_directory, unique_filename)
            uploaded_file.save(file_path)
            return jsonify({
                "message": "PDF file uploaded and saved successfully",
                "original_filename": uploaded_file.filename,
                "file_path": file_path
            })
        else:
            return jsonify({"error": "No file selected"})
    except Exception as e:
        return jsonify({"error": str(e)})


@app.route('/chatDsa', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        query = data.get('query')

        print(f"Query: {query}")

        answer = get_answer(query)
        print("this is answer ",answer)
        conversation_answer = answer
        # conversation_answer = '\n'.join([' ' * 6 + line for line in answer.split('\n')])
        response = {
            "result": answer,
            "conversation_result": conversation_answer
                
        }
        

        return jsonify(response)

    except Exception as e:
        return jsonify({"error": str(e)})


if __name__ == '__main__':
     app.run(port =5002)
