import React, { useState } from 'react';
import axios from 'axios';
import './css/CinnamonClassifier.css'; 

const CinnamonClassifier = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file)); 
            setPrediction(null);
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setError('Please select an image first.');
            return;
        }

        setIsLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('image', selectedFile); 

        try {
            const res = await axios.post('http://localhost:5000/api/cinnamon-grade/classify-cinnamon', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (res.data.success) {
                setPrediction(res.data);
            } else {
                setError(res.data.message || 'AI classification failed.');
            }
        } catch (err) {
            console.error("Connection Error:", err.response?.data || err.message);
            setError('Cannot connect to backend. Please check if the Node.js Server is running.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="classifier-container glassmorphism">
            <h2>Cinnamon Grade Detector (AI Detector)</h2>
            
            <div className="upload-section">
                <input 
                    type="file" 
                    onChange={handleFileChange} 
                    accept="image/*" 
                    id="fileInput"
                />
                {previewUrl && (
                    <div className="preview-container">
                        <img src={previewUrl} alt="Preview" className="image-preview" />
                    </div>
                )}
                
                <button 
                    onClick={handleUpload} 
                    disabled={isLoading} 
                    className="predict-btn"
                >
                    {isLoading ? 'Analyzing...' : 'Detect Grade'}
                </button>
            </div>

            {isLoading && (
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>AI system is analyzing the image... Please wait.</p>
                </div>
            )}

            {prediction && (
                <div className="result-section animation-fade-in">
                    <h3>Prediction Report:</h3>
                    <div className="result-card">
                        <p className="predicted-grade">Predicted Grade: <span>{prediction.grade}</span></p>
                    </div>
                    
                    <div className="grade-description">
                        {prediction.grade === 'Alba' && (
                            <p>🌟 <b>Alba:</b> The highest quality grade. It is prized for its slender appearance, sweet taste, and pleasant aroma.</p>
                        )}
                        {prediction.grade === 'C4' && (
                            <p>✅ <b>C4:</b> A popular Continental grade known for its smoothness and golden-yellow color.</p>
                        )}
                        {prediction.grade === 'C5' && (
                            <p>✅ <b>C5:</b> A high-demand Continental grade with a diameter of about 10-12mm, offering excellent flavor.</p>
                        )}
                        {prediction.grade === 'C5 Special' && (
                            <p>✨ <b>C5 Special:</b> An extra-fine version of the C5 grade, exceptionally thin and carefully selected for premium markets.</p>
                        )}
                        {prediction.grade === 'H1' && (
                            <p>🔸 <b>H1:</b> A high-quality Hamburg grade. It is slightly thicker than C grades but maintains a rich spicy profile.</p>
                        )}
                        {prediction.grade === 'H2' && (
                            <p>🔸 <b>H2:</b> A standard Hamburg grade consisting of sorted quills with a good appearance and strong aroma.</p>
                        )}
                        {prediction.grade === 'M4' && (
                            <p>📦 <b>M4:</b> A Mexican grade known for its reddish-brown color and coarse texture, widely used in food processing.</p>
                        )}
                        {prediction.grade === 'M5' && (
                            <p>📦 <b>M5:</b> A more affordable Mexican grade, characterized by slightly thicker quills and a robust spicy taste.</p>
                        )}
                        {prediction.grade === 'Other' && (
                            <p>🔍 <b>Other:</b> The sample detected does not fit into standard premium categories. It might be mixed or lower-grade quills.</p>
                        )}
                    </div>
                </div>
            )}

            {error && <div className="error-message">⚠️ {error}</div>}
        </div>
    );
};

export default CinnamonClassifier;