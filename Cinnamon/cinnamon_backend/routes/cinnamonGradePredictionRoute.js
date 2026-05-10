const express = require('express');
const router = express.Router();
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const upload = require('../middleware/upload'); 

router.post('/classify-cinnamon', upload.single('image'), async (req, res) => {
    
    if (!req.file) {
        return res.status(400).json({ 
            success: false, 
            message: 'Image Not Found. (Make sure field name is "image")' 
        });
    }

    try {
        const filePath = req.file.path;
        const fileStream = fs.createReadStream(filePath);

        const formData = new FormData();
        formData.append('file', fileStream); 

        const response = await axios.post('http://127.0.0.1:8000/predict', formData, {
            headers: { 
                ...formData.getHeaders(),
            },
        });

        fs.unlinkSync(filePath); 

        if (response.data.success) {
            res.json(response.data);
        } else {
            res.status(500).json({ success: false, message: response.data.error });
        }

    } catch (error) {
        console.error("AI Bridge Error:", error.message);
        
        if (req.file) fs.unlinkSync(req.file.path);

        res.status(500).json({ 
            success: false, 
            message: "Cannot Connect to AI Model. Check Python API." 
        });
    }
});

module.exports = router;