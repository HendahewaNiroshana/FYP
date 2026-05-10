from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import onnxruntime as rt
import numpy as np
import cv2
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    sess = rt.InferenceSession("models/cinnamon_model.onnx")
    input_name = sess.get_inputs()[0].name
    label_name = sess.get_outputs()[0].name
    print("✅ AI Model loaded successfully.")
except Exception as e:
    print(f"❌ Error loading model: {e}")

grades = ["Alba", "C4", "C5", "H1", "C5 Special", "H2", "M4", "M5", "Other"] 

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # Preprocessing
        img_resized = cv2.resize(img, (224, 224))
        img_rgb = cv2.cvtColor(img_resized, cv2.COLOR_BGR2RGB)
        img_float = img_rgb.astype(np.float32) / 255.0
        img_transposed = np.transpose(img_float, (2, 0, 1))
        img_final = np.expand_dims(img_transposed, axis=0)

        # AI Inference
        prediction = sess.run([label_name], {input_name: img_final})
        
        probs = prediction[0][0]
        result_index = int(np.argmax(probs))
        confidence_val = float(probs[result_index])

        
        if confidence_val < 0.3:
            predicted_grade = "It's look Like a Not Cinnamon. Low Confidence."
        elif result_index < len(grades):
            predicted_grade = grades[result_index]
        else:
            predicted_grade = "Unknown Grade"
            
        # ------------------------------

        return {
            "success": True,
            "grade": predicted_grade,
            "confidence": f"{confidence_val * 100:.2f}%"
        }

    except Exception as e:
        print(f"Prediction Error: {e}")
        return {"success": False, "error": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)