!pip install ultralytics flask flask-cors pyngrok -q

from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
from pyngrok import ngrok
import os

# Setup
app = Flask(__name__)
CORS(app)
model = YOLO('yolov8n.pt')
CAPACITY = 200

# Add your token here
ngrok.set_auth_token("2wd1FOO4neT5u5lZ8zZNEdOFajr_6PduhYePSJG5BHpfrK3ds")

@app.route('/analyze', methods=['POST'])
def analyze():
    image = request.files['image']
    path = f"./{image.filename}"
    image.save(path)

    results = model(path)
    people = sum(1 for c in results[0].boxes.cls if int(c) == 0)
    os.remove(path)

    return jsonify({
        "people": people,
        "percentage": round((people / CAPACITY) * 100, 2)
    })

# Start server and print public URL
public_url = ngrok.connect(5000)
print("Public AI endpoint:", public_url)
app.run(port=5000)
