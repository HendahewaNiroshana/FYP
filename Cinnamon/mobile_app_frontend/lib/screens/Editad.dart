import 'dart:convert';
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:image_picker/image_picker.dart';

class EditAdScreen extends StatefulWidget {
  final Map ad;
  const EditAdScreen({super.key, required this.ad});

  @override
  State<EditAdScreen> createState() => _EditAdScreenState();
}

class _EditAdScreenState extends State<EditAdScreen> {
  final _formKey = GlobalKey<FormState>();
  final picker = ImagePicker();
  bool isLoading = false;

  late TextEditingController titleCtrl;
  late TextEditingController descCtrl;
  File? selectedImage;
  Uint8List? webImage;

  final String baseUrl = "http://localhost:5000"; // Backend IP

  @override
  void initState() {
    super.initState();
    titleCtrl = TextEditingController(text: widget.ad["title"]);
    descCtrl = TextEditingController(text: widget.ad["description"]);
  }

  Future<void> _pickImage() async {
    final picked = await picker.pickImage(source: ImageSource.gallery);
    if (picked != null) {
      if (kIsWeb) {
        webImage = await picked.readAsBytes();
      } else {
        selectedImage = File(picked.path);
      }
      setState(() {});
    }
  }

  Future<void> _updateAd() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => isLoading = true);
    try {
      var request = http.MultipartRequest(
        "PUT",
        Uri.parse("$baseUrl/api/ads/${widget.ad["_id"]}"),
      );

      request.fields["title"] = titleCtrl.text.trim();
      request.fields["description"] = descCtrl.text.trim();

      if (kIsWeb && webImage != null) {
        request.files.add(
          http.MultipartFile.fromBytes(
            "image",
            webImage!,
            filename: "ad_update.png",
          ),
        );
      } else if (selectedImage != null) {
        request.files.add(
          await http.MultipartFile.fromPath("image", selectedImage!.path),
        );
      }

      var response = await request.send();
      var body = await response.stream.bytesToString();
      var data = json.decode(body);

      if (response.statusCode == 200 && data["success"] == true) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text("Ad updated successfully"),
            backgroundColor: Colors.green,
          ),
        );
        Navigator.pop(context);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(data["message"] ?? "Error updating ad"),
            backgroundColor: Colors.red,
          ),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Server connection error"),
          backgroundColor: Colors.red,
        ),
      );
    } finally {
      setState(() => isLoading = false);
    }
  }

  // --- Helper for consistent styling ---
  InputDecoration _buildInputDecoration(String label, IconData icon) {
    return InputDecoration(
      labelText: label,
      prefixIcon: Icon(icon, color: const Color(0xFFD1AF17)),
      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: Colors.grey),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: Color(0xFFD1AF17), width: 2),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    String? imgUrl = widget.ad["imageUrl"];
    String? fullImg = (imgUrl != null && imgUrl.isNotEmpty)
        ? "$baseUrl$imgUrl"
        : null;
    const primaryColor = Color(0xFFD1AF17);

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text(
          "Edit Ad Details",
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        backgroundColor: primaryColor,
        foregroundColor: Colors.white,
        centerTitle: true,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // --- Image Picker Section ---
              Center(
                child: Stack(
                  children: [
                    Container(
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        border: Border.all(color: primaryColor, width: 2),
                      ),
                      child: CircleAvatar(
                        radius: 70,
                        backgroundColor: Colors.grey[100],
                        backgroundImage: kIsWeb
                            ? (webImage != null
                                  ? MemoryImage(webImage!)
                                  : (fullImg != null
                                        ? NetworkImage(fullImg)
                                        : null))
                            : selectedImage != null
                            ? FileImage(selectedImage!)
                            : (fullImg != null ? NetworkImage(fullImg) : null)
                                  as ImageProvider?,
                        child:
                            (selectedImage == null &&
                                webImage == null &&
                                fullImg == null)
                            ? const Icon(
                                Icons.add_a_photo_outlined,
                                size: 40,
                                color: primaryColor,
                              )
                            : null,
                      ),
                    ),
                    Positioned(
                      bottom: 0,
                      right: 0,
                      child: GestureDetector(
                        onTap: _pickImage,
                        child: CircleAvatar(
                          backgroundColor: primaryColor,
                          radius: 20,
                          child: const Icon(
                            Icons.camera_alt,
                            color: Colors.white,
                            size: 18,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 35),

              const Text(
                "Ad Information",
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Colors.black87,
                ),
              ),
              const SizedBox(height: 15),

              // --- Input Fields ---
              TextFormField(
                controller: titleCtrl,
                decoration: _buildInputDecoration(
                  "Advertisement Title",
                  Icons.title,
                ),
                validator: (val) => val!.isEmpty ? "Enter a title" : null,
              ),
              const SizedBox(height: 16),

              TextFormField(
                controller: descCtrl,
                maxLines: 4,
                decoration: _buildInputDecoration(
                  "Description",
                  Icons.description_outlined,
                ),
                validator: (val) => val!.isEmpty ? "Enter a description" : null,
              ),
              const SizedBox(height: 40),

              // --- Update Button ---
              SizedBox(
                width: double.infinity,
                height: 55,
                child: ElevatedButton(
                  onPressed: isLoading ? null : _updateAd,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: primaryColor,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    elevation: 2,
                  ),
                  child: isLoading
                      ? const CircularProgressIndicator(color: Colors.white)
                      : const Text(
                          "UPDATE ADVERTISEMENT",
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                            letterSpacing: 1.1,
                          ),
                        ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
