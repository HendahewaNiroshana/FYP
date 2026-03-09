import 'dart:io';
import 'dart:typed_data';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class AddAdvertisementScreen extends StatefulWidget {
  const AddAdvertisementScreen({super.key});

  @override
  State<AddAdvertisementScreen> createState() => _AddAdvertisementScreenState();
}

class _AddAdvertisementScreenState extends State<AddAdvertisementScreen> {
  final _titleController = TextEditingController();
  final _descController = TextEditingController();

  File? _selectedImage;
  Uint8List? _webImage;
  bool _isLoading = false;

  final String baseUrl = "http://localhost:5000/api/ads";

  Future pickImage() async {
    final picked = await ImagePicker().pickImage(source: ImageSource.gallery);
    if (picked != null) {
      if (kIsWeb) {
        final bytes = await picked.readAsBytes();
        setState(() => _webImage = bytes);
      } else {
        setState(() => _selectedImage = File(picked.path));
      }
    }
  }

  Future uploadAd() async {
    bool hasImage = kIsWeb ? (_webImage != null) : (_selectedImage != null);

    if (_titleController.text.isEmpty ||
        _descController.text.isEmpty ||
        !hasImage) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text("Fill All Fields")));
      return;
    }

    setState(() => _isLoading = true);

    try {
      var request = http.MultipartRequest("POST", Uri.parse(baseUrl));

      request.fields["title"] = _titleController.text.trim();
      request.fields["description"] = _descController.text.trim();

      request.fields["userId"] = "68c7d361c691784823ed8b41";

      if (kIsWeb) {
        request.files.add(
          http.MultipartFile.fromBytes(
            'image',
            _webImage!,
            filename: 'ad_image_${DateTime.now().millisecondsSinceEpoch}.jpg',
          ),
        );
      } else {
        request.files.add(
          await http.MultipartFile.fromPath('image', _selectedImage!.path),
        );
      }

      var streamedResponse = await request.send();
      var response = await http.Response.fromStream(streamedResponse);
      var data = json.decode(response.body);

      if (response.statusCode == 200 && data['success'] == true) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(const SnackBar(content: Text("Successfull!")));
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text("❌ Error: ${data['message'] ?? 'Upload failed'}"),
          ),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text("Server Error: $e")));
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            GestureDetector(
              onTap: pickImage,
              child: Container(
                height: 200,
                width: double.infinity,
                decoration: BoxDecoration(
                  color: Colors.grey[200],
                  borderRadius: BorderRadius.circular(15),
                  border: Border.all(color: Colors.grey.shade300),
                ),
                child: _buildImagePreview(),
              ),
            ),
            const SizedBox(height: 25),
            _buildTextField(_titleController, "Title", Icons.title, 1),
            const SizedBox(height: 15),
            _buildTextField(
              _descController,
              "Description",
              Icons.description,
              4,
            ),
            const SizedBox(height: 30),
            SizedBox(
              width: double.infinity,
              height: 55,
              child: ElevatedButton(
                onPressed: _isLoading ? null : uploadAd,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFD1AF17),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: _isLoading
                    ? const CircularProgressIndicator(color: Colors.white)
                    : const Text(
                        "Publish Now",
                        style: TextStyle(fontSize: 18, color: Colors.white),
                      ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildImagePreview() {
    if (kIsWeb && _webImage != null) {
      return ClipRRect(
        borderRadius: BorderRadius.circular(15),
        child: Image.memory(_webImage!, fit: BoxFit.cover),
      );
    } else if (!kIsWeb && _selectedImage != null) {
      return ClipRRect(
        borderRadius: BorderRadius.circular(15),
        child: Image.file(_selectedImage!, fit: BoxFit.cover),
      );
    }
    return const Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Icon(Icons.add_a_photo, size: 50, color: Colors.grey),
        Text("Select Ad Image"),
      ],
    );
  }

  Widget _buildTextField(
    TextEditingController ctrl,
    String hint,
    IconData icon,
    int lines,
  ) {
    return TextField(
      controller: ctrl,
      maxLines: lines,
      decoration: InputDecoration(
        hintText: hint,
        prefixIcon: Icon(icon, color: const Color(0xFFD1AF17)),
        filled: true,
        fillColor: Colors.grey[50],
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: Colors.grey.shade300),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Color(0xFFD1AF17)),
        ),
      ),
    );
  }
}
