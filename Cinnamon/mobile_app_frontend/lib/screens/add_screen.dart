import 'dart:typed_data';
import 'dart:io';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;
import 'package:path/path.dart' as path;
import 'dart:convert';

class AddScreen extends StatefulWidget {
  const AddScreen({super.key});

  @override
  State<AddScreen> createState() => _AddScreenState();
}

class _AddScreenState extends State<AddScreen> {
  final _formKey = GlobalKey<FormState>();

  TextEditingController nameCtrl = TextEditingController();
  TextEditingController descriptionCtrl = TextEditingController();
  TextEditingController priceCtrl = TextEditingController();
  TextEditingController stockCtrl = TextEditingController();

  File? selectedImage;
  Uint8List? webImage;
  bool isLoading = false;

  final String baseUrl = "http://localhost:5000"; // ඔබේ Backend URL එක

  // Pick image (mobile & web)
  Future<void> _pickImage() async {
    final picker = ImagePicker();
    final pickedFile = await picker.pickImage(source: ImageSource.gallery);

    if (pickedFile != null) {
      if (kIsWeb) {
        webImage = await pickedFile.readAsBytes();
      } else {
        selectedImage = File(pickedFile.path);
      }
      setState(() {});
    }
  }

  // Submit product to backend
  Future<void> _submitProduct() async {
    if (!_formKey.currentState!.validate()) return;
    if (kIsWeb ? webImage == null : selectedImage == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Please select an image"),
          backgroundColor: Colors.orange,
        ),
      );
      return;
    }

    setState(() => isLoading = true);

    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? sellerId = prefs.getString("userId");

    if (sellerId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("User not logged in"),
          backgroundColor: Colors.red,
        ),
      );
      setState(() => isLoading = false);
      return;
    }

    try {
      var request = http.MultipartRequest(
        "POST",
        Uri.parse("$baseUrl/api/products"),
      );

      request.fields['name'] = nameCtrl.text.trim();
      request.fields['description'] = descriptionCtrl.text.trim();
      request.fields['price'] = priceCtrl.text.trim();
      request.fields['stock'] = stockCtrl.text.trim();
      request.fields['sellerId'] = sellerId;

      if (kIsWeb && webImage != null) {
        request.files.add(
          http.MultipartFile.fromBytes(
            'image',
            webImage!,
            filename: "web_image_${DateTime.now().millisecondsSinceEpoch}.png",
          ),
        );
      } else if (selectedImage != null) {
        request.files.add(
          await http.MultipartFile.fromPath(
            'image',
            selectedImage!.path,
            filename: path.basename(selectedImage!.path),
          ),
        );
      }

      var response = await request.send();
      var respStr = await response.stream.bytesToString();
      var data = json.decode(respStr);

      if (response.statusCode == 200 && data['success'] == true) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text("Product added successfully!"),
            backgroundColor: Colors.green,
          ),
        );
        Navigator.pop(context);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(data['message'] ?? "Failed to add product"),
            backgroundColor: Colors.red,
          ),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Error connecting to server"),
          backgroundColor: Colors.red,
        ),
      );
    } finally {
      setState(() => isLoading = false);
    }
  }

  // Helper for Input Decoration
  InputDecoration _buildDecoration(String label, IconData icon) {
    return InputDecoration(
      labelText: label,
      prefixIcon: Icon(icon, color: const Color.fromARGB(255, 209, 175, 23)),
      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(
          color: Color.fromARGB(255, 209, 175, 23),
          width: 2,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    const primaryColor = Color.fromARGB(255, 209, 175, 23);

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text(
          "Add New Product",
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
                            ? (webImage != null ? MemoryImage(webImage!) : null)
                            : (selectedImage != null
                                  ? FileImage(selectedImage!)
                                  : null),
                        child: (selectedImage == null && webImage == null)
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
                            Icons.add,
                            color: Colors.white,
                            size: 20,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 30),

              const Text(
                "Product Details",
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 15),

              // --- Input Fields ---
              TextFormField(
                controller: nameCtrl,
                decoration: _buildDecoration(
                  "Product Name",
                  Icons.shopping_bag_outlined,
                ),
                validator: (val) =>
                    val == null || val.isEmpty ? "Enter product name" : null,
              ),
              const SizedBox(height: 16),

              TextFormField(
                controller: descriptionCtrl,
                maxLines: 3,
                decoration: _buildDecoration(
                  "Description",
                  Icons.description_outlined,
                ),
                validator: (val) =>
                    val == null || val.isEmpty ? "Enter description" : null,
              ),
              const SizedBox(height: 16),

              Row(
                children: [
                  Expanded(
                    child: TextFormField(
                      controller: priceCtrl,
                      keyboardType: TextInputType.number,
                      decoration: _buildDecoration(
                        "Price (Rs.)",
                        Icons.payments_outlined,
                      ),
                      validator: (val) =>
                          val == null || val.isEmpty ? "Required" : null,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: TextFormField(
                      controller: stockCtrl,
                      keyboardType: TextInputType.number,
                      decoration: _buildDecoration(
                        "Stock",
                        Icons.inventory_2_outlined,
                      ),
                      validator: (val) =>
                          val == null || val.isEmpty ? "Required" : null,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 40),

              // --- Submit Button ---
              SizedBox(
                width: double.infinity,
                height: 55,
                child: ElevatedButton(
                  onPressed: isLoading ? null : _submitProduct,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: primaryColor,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: isLoading
                      ? const CircularProgressIndicator(color: Colors.white)
                      : const Text(
                          "UPLOAD PRODUCT",
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
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
