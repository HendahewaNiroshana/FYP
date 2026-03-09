import 'dart:io';
import 'dart:typed_data';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:http/http.dart' as http;
import 'package:path/path.dart' as path;
import 'dart:convert';

class EditProductScreen extends StatefulWidget {
  final Map product;
  const EditProductScreen({super.key, required this.product});

  @override
  State<EditProductScreen> createState() => _EditProductScreenState();
}

class _EditProductScreenState extends State<EditProductScreen> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController nameCtrl;
  late TextEditingController descriptionCtrl;
  late TextEditingController priceCtrl;
  late TextEditingController stockCtrl;

  File? selectedImage;
  Uint8List? webImage;
  bool isLoading = false;

  final String baseUrl = "http://localhost:5000"; // change to your PC IP

  @override
  void initState() {
    super.initState();
    nameCtrl = TextEditingController(text: widget.product["name"]);
    descriptionCtrl = TextEditingController(
      text: widget.product["description"],
    );
    priceCtrl = TextEditingController(text: widget.product["price"].toString());
    stockCtrl = TextEditingController(text: widget.product["stock"].toString());
  }

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

  Future<void> _updateProduct() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => isLoading = true);

    try {
      var request = http.MultipartRequest(
        "PUT",
        Uri.parse("$baseUrl/api/products/${widget.product["_id"]}"),
      );

      request.fields['name'] = nameCtrl.text.trim();
      request.fields['description'] = descriptionCtrl.text.trim();
      request.fields['price'] = priceCtrl.text.trim();
      request.fields['stock'] = stockCtrl.text.trim();

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
            content: Text("Product updated successfully"),
            backgroundColor: Colors.green,
          ),
        );
        Navigator.pop(context);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(data['message'] ?? "Failed to update"),
            backgroundColor: Colors.red,
          ),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Server error"),
          backgroundColor: Colors.red,
        ),
      );
    } finally {
      setState(() => isLoading = false);
    }
  }

  // --- UI Helper: Custom Input Decoration ---
  InputDecoration _buildInputDecoration(String label, IconData icon) {
    return InputDecoration(
      labelText: label,
      prefixIcon: Icon(icon, color: const Color.fromARGB(255, 209, 175, 23)),
      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: Colors.grey),
      ),
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
    String? imageUrl = widget.product["image"];
    String? fullImageUrl = (imageUrl != null && imageUrl.isNotEmpty)
        ? "$baseUrl$imageUrl"
        : null;
    const primaryColor = Color.fromARGB(255, 209, 175, 23);

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text(
          "Edit Product Details",
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
        backgroundColor: primaryColor,
        foregroundColor: Colors.white,
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
                                  : (fullImageUrl != null
                                        ? NetworkImage(fullImageUrl)
                                        : null))
                            : selectedImage != null
                            ? FileImage(selectedImage!)
                            : (fullImageUrl != null
                                      ? NetworkImage(fullImageUrl)
                                      : null)
                                  as ImageProvider?,
                        child:
                            (selectedImage == null &&
                                webImage == null &&
                                fullImageUrl == null)
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
                "Product Information",
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Colors.black87,
                ),
              ),
              const SizedBox(height: 15),

              // --- Input Fields ---
              TextFormField(
                controller: nameCtrl,
                decoration: _buildInputDecoration(
                  "Product Name",
                  Icons.shopping_bag_outlined,
                ),
                validator: (val) => val!.isEmpty ? "Enter product name" : null,
              ),
              const SizedBox(height: 16),

              TextFormField(
                controller: descriptionCtrl,
                maxLines: 3,
                decoration: _buildInputDecoration(
                  "Description",
                  Icons.description_outlined,
                ),
                validator: (val) => val!.isEmpty ? "Enter description" : null,
              ),
              const SizedBox(height: 16),

              Row(
                children: [
                  Expanded(
                    child: TextFormField(
                      controller: priceCtrl,
                      keyboardType: TextInputType.number,
                      decoration: _buildInputDecoration(
                        "Price (Rs.)",
                        Icons.attach_money,
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: TextFormField(
                      controller: stockCtrl,
                      keyboardType: TextInputType.number,
                      decoration: _buildInputDecoration(
                        "Stock",
                        Icons.inventory_2_outlined,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 40),

              // --- Update Button ---
              SizedBox(
                width: double.infinity,
                height: 55,
                child: ElevatedButton(
                  onPressed: isLoading ? null : _updateProduct,
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
                          "SAVE CHANGES",
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                            letterSpacing: 1.2,
                          ),
                        ),
                ),
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }
}
