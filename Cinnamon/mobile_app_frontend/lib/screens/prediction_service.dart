import 'dart:convert';
import 'dart:io';
import 'package:flutter/foundation.dart'; // kIsWeb sadaha meka avashyayi
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:http/http.dart' as http;

class PredictiongradeScreen extends StatefulWidget {
  const PredictiongradeScreen({super.key});

  @override
  State<PredictiongradeScreen> createState() => _PredictiongradeScreenState();
}

class _PredictiongradeScreenState extends State<PredictiongradeScreen> {
  File? _image;
  Uint8List? _webImage; 
  bool _isLoading = false;
  String? _predictedGrade;
  String? _confidence;
  final _picker = ImagePicker();

  final String _nodeApiUrl = "http://localhost:5000/api/cinnamon-grade/classify-cinnamon";

  Future<void> _pickImage(ImageSource source) async {
    try {
      final pickedFile = await _picker.pickImage(
        source: source,
        imageQuality: 80,
      );
      
      if (pickedFile != null) {
        if (kIsWeb) {
          final bytes = await pickedFile.readAsBytes();
          setState(() {
            _webImage = bytes;
            _image = File(pickedFile.path); 
            _predictedGrade = null;
            _confidence = null;
          });
        } else {
          // Mobile sadaha
          setState(() {
            _image = File(pickedFile.path);
            _predictedGrade = null;
            _confidence = null;
          });
        }
      }
    } catch (e) {
      _showSnackBar("Error picking image: $e");
    }
  }

  Future<void> _analyzeWithNodeBridge() async {
    if (_image == null && _webImage == null) return;

    setState(() => _isLoading = true);

    try {
      var request = http.MultipartRequest('POST', Uri.parse(_nodeApiUrl));
      
      if (kIsWeb) {
        request.files.add(http.MultipartFile.fromBytes(
          'image',
          _webImage!,
          filename: 'upload.jpg',
        ));
      } else {
        request.files.add(await http.MultipartFile.fromPath('image', _image!.path));
      }

      var streamedResponse = await request.send();
      var response = await http.Response.fromStream(streamedResponse);

      if (response.statusCode == 200) {
        var data = json.decode(response.body);
        
        setState(() {
          _predictedGrade = data['grade'] ?? "Unknown";
          _confidence = data['confidence'] ?? "N/A";
        });
      } else {
        var errorData = json.decode(response.body);
        _showSnackBar(errorData['message'] ?? "Server Error: ${response.statusCode}");
      }
    } catch (e) {
      _showSnackBar("Cannot Connect to Node.js Server. Check Port 5000 and CORS.");
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  void _showSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message), 
        backgroundColor: Colors.redAccent,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text("Cinnamon AI Bridge", 
          style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
        centerTitle: true,
        backgroundColor: const Color(0xFFD1AF17),
        elevation: 0,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          child: Column(
            children: [
              Container(
                height: 20,
                decoration: const BoxDecoration(
                  color: Color(0xFFD1AF17),
                  borderRadius: BorderRadius.only(
                    bottomLeft: Radius.circular(30),
                    bottomRight: Radius.circular(30),
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
                child: Column(
                  children: [
                    const Text(
                      "Express Bridge Prediction",
                      style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: Color(0xFF2C3E50)),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      kIsWeb ? "Running on Web Mode" : "Running on Mobile Mode",
                      style: TextStyle(color: Colors.blueGrey.withOpacity(0.7), fontSize: 12),
                    ),
                    const SizedBox(height: 25),

                    // Image Card Fix
                    AspectRatio(
                      aspectRatio: 1,
                      child: Container(
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(25),
                          boxShadow: [
                            BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 20, offset: const Offset(0, 10))
                          ],
                          border: Border.all(color: const Color(0xFFD1AF17).withOpacity(0.3), width: 2),
                        ),
                        child: (_image != null || _webImage != null)
                            ? ClipRRect(
                                borderRadius: BorderRadius.circular(23),
                                child: kIsWeb 
                                  ? Image.memory(_webImage!, fit: BoxFit.cover) 
                                  : Image.file(_image!, fit: BoxFit.cover),
                              )
                            : Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Icon(Icons.center_focus_strong_outlined, size: 60, color: Colors.grey.shade400),
                                  const SizedBox(height: 12),
                                  Text("Select Image to Predict", style: TextStyle(color: Colors.grey.shade500)),
                                ],
                              ),
                      ),
                    ),
                    const SizedBox(height: 25),

                    // Buttons
                    Row(
                      children: [
                        Expanded(
                          child: _buildActionButton(
                            icon: Icons.camera_alt_rounded,
                            label: "Camera",
                            onPressed: () => _pickImage(ImageSource.camera),
                          ),
                        ),
                        const SizedBox(width: 15),
                        Expanded(
                          child: _buildActionButton(
                            icon: Icons.photo_library_rounded,
                            label: "Gallery",
                            onPressed: () => _pickImage(ImageSource.gallery),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 30),

                    if (_isLoading)
                      const Column(
                        children: [
                          CircularProgressIndicator(color: Color(0xFFD1AF17)),
                          SizedBox(height: 15),
                          Text("Processing via Express Server..."),
                        ],
                      )
                    else if (_predictedGrade != null)
                      _buildResultCard()
                    else if (_image != null || _webImage != null)
                      ElevatedButton(
                        onPressed: _analyzeWithNodeBridge,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFFD1AF17),
                          foregroundColor: Colors.white,
                          minimumSize: const Size.fromHeight(60),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
                          elevation: 4,
                        ),
                        child: const Text("Run Prediction", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                      ),
                    
                    const SizedBox(height: 50),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildActionButton({required IconData icon, required String label, required VoidCallback onPressed}) {
    return OutlinedButton.icon(
      onPressed: onPressed,
      icon: Icon(icon, color: const Color(0xFF2C1810)),
      label: Text(label, style: const TextStyle(color: Color(0xFF2C1810), fontWeight: FontWeight.bold)),
      style: OutlinedButton.styleFrom(
        padding: const EdgeInsets.symmetric(vertical: 15),
        side: BorderSide(color: const Color(0xFF2C1810).withOpacity(0.3)),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
    );
  }

  Widget _buildResultCard() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: const Color(0xFFFDF7E2),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFD1AF17).withOpacity(0.5)),
      ),
      child: Column(
        children: [
          const Text(
            "Final Grade",
            style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFFB89812), letterSpacing: 1.2),
          ),
          const SizedBox(height: 12),
          Text(
            _predictedGrade!,
            textAlign: TextAlign.center,
            style: const TextStyle(fontSize: 32, fontWeight: FontWeight.w900, color: Color(0xFF2C1810)),
          ),
          
        ],
      ),
    );
  }
}