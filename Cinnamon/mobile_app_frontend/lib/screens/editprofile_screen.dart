import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;
import 'package:path/path.dart' as path;

class EditProfileScreen extends StatefulWidget {
  const EditProfileScreen({super.key});

  @override
  State<EditProfileScreen> createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends State<EditProfileScreen> {
  final _formKey = GlobalKey<FormState>();

  TextEditingController nameCtrl = TextEditingController();
  TextEditingController emailCtrl = TextEditingController();
  TextEditingController contactCtrl = TextEditingController();
  TextEditingController addressCtrl = TextEditingController();
  TextEditingController businessNameCtrl = TextEditingController();
  TextEditingController businessLocationCtrl = TextEditingController();

  String? profilePicUrl;
  String? accountType;
  File? selectedImage;
  bool isLoading = false;
  bool isFetching = true;

  final String baseUrl = "http://localhost:5000"; // Backend IP

  @override
  void initState() {
    super.initState();
    _fetchUserData();
  }

  Future<void> _fetchUserData() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? userId = prefs.getString("userId");

    if (userId == null || userId.isEmpty) {
      _showSnackBar("User ID not found. Please log in again.", Colors.red);
      setState(() => isFetching = false);
      return;
    }

    try {
      final response = await http.get(
        Uri.parse("$baseUrl/api/mobile-auth/get/$userId"),
      );

      if (response.statusCode == 200) {
        var data = json.decode(response.body);
        if (data["success"] == true) {
          var user = data["user"];
          setState(() {
            nameCtrl.text = user["name"] ?? "";
            emailCtrl.text = user["email"] ?? "";
            contactCtrl.text = user["contact"] ?? "";
            addressCtrl.text = user["address"] ?? "";
            profilePicUrl = user["userProfilePic"];
            accountType = user["accountType"] ?? "user";

            if (accountType == "business") {
              businessNameCtrl.text = user["businessName"] ?? "";
              businessLocationCtrl.text = user["businessLocation"] ?? "";
            }
            isFetching = false;
          });
        }
      }
    } catch (e) {
      _showSnackBar("Error connecting to server", Colors.red);
      setState(() => isFetching = false);
    }
  }

  Future<void> _pickImage() async {
    final pickedFile = await ImagePicker().pickImage(
      source: ImageSource.gallery,
    );
    if (pickedFile != null) {
      setState(() => selectedImage = File(pickedFile.path));
    }
  }

  Future<void> _updateProfile() async {
    if (!_formKey.currentState!.validate()) return;

    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? userId = prefs.getString("userId");

    setState(() => isLoading = true);

    var request = http.MultipartRequest(
      "PUT",
      Uri.parse("$baseUrl/api/mobile-auth/updateById/$userId"),
    );
    request.fields["name"] = nameCtrl.text.trim();
    request.fields["contact"] = contactCtrl.text.trim();
    request.fields["address"] = addressCtrl.text.trim();

    if (accountType == "business") {
      request.fields["businessName"] = businessNameCtrl.text.trim();
      request.fields["businessLocation"] = businessLocationCtrl.text.trim();
    }

    if (selectedImage != null) {
      request.files.add(
        await http.MultipartFile.fromPath(
          "userProfilePic",
          selectedImage!.path,
          filename: path.basename(selectedImage!.path),
        ),
      );
    }

    try {
      var response = await request.send();
      var respStr = await response.stream.bytesToString();
      var data = json.decode(respStr);

      if (response.statusCode == 200 && data["success"] == true) {
        _showSnackBar("Profile updated successfully!", Colors.green);
        Navigator.pop(context);
      } else {
        _showSnackBar(data["message"] ?? "Update failed", Colors.red);
      }
    } catch (e) {
      _showSnackBar("Something went wrong", Colors.red);
    } finally {
      setState(() => isLoading = false);
    }
  }

  void _showSnackBar(String msg, Color color) {
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(SnackBar(content: Text(msg), backgroundColor: color));
  }

  InputDecoration _inputStyle(String label, IconData icon) {
    return InputDecoration(
      labelText: label,
      prefixIcon: Icon(icon, color: const Color(0xFFD1AF17)),
      filled: true,
      fillColor: Colors.grey[50],
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide.none,
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: Colors.grey[200]!),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: Color(0xFFD1AF17)),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    const primaryColor = Color(0xFFD1AF17);

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text(
          "Edit Profile",
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        backgroundColor: primaryColor,
        foregroundColor: Colors.white,
        centerTitle: true,
        elevation: 0,
      ),
      body: isFetching
          ? const Center(child: CircularProgressIndicator(color: primaryColor))
          : SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: Form(
                key: _formKey,
                child: Column(
                  children: [
                    // --- Profile Picture Section ---
                    Center(
                      child: Stack(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(4),
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              border: Border.all(color: primaryColor, width: 2),
                            ),
                            child: CircleAvatar(
                              radius: 65,
                              backgroundColor: Colors.grey[200],
                              backgroundImage: selectedImage != null
                                  ? FileImage(selectedImage!)
                                  : (profilePicUrl != null &&
                                        profilePicUrl!.isNotEmpty)
                                  ? NetworkImage(
                                      "$baseUrl$profilePicUrl".replaceFirst(
                                        "localhost",
                                        "127.0.0.1",
                                      ),
                                    )
                                  : const AssetImage(
                                          "assets/default_avatar.png",
                                        )
                                        as ImageProvider,
                            ),
                          ),
                          Positioned(
                            bottom: 0,
                            right: 0,
                            child: GestureDetector(
                              onTap: _pickImage,
                              child: const CircleAvatar(
                                radius: 20,
                                backgroundColor: primaryColor,
                                child: Icon(
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
                    const SizedBox(height: 35),

                    // --- Form Fields ---
                    TextFormField(
                      controller: nameCtrl,
                      decoration: _inputStyle(
                        "Full Name",
                        Icons.person_outline,
                      ),
                      validator: (val) =>
                          val!.isEmpty ? "Name is required" : null,
                    ),
                    const SizedBox(height: 16),

                    TextFormField(
                      controller: emailCtrl,
                      readOnly: true,
                      decoration: _inputStyle(
                        "Email Address (Locked)",
                        Icons.email_outlined,
                      ),
                    ),
                    const SizedBox(height: 16),

                    TextFormField(
                      controller: contactCtrl,
                      keyboardType: TextInputType.phone,
                      decoration: _inputStyle(
                        "Contact Number",
                        Icons.phone_android_outlined,
                      ),
                      validator: (val) =>
                          val!.isEmpty ? "Contact is required" : null,
                    ),
                    const SizedBox(height: 16),

                    TextFormField(
                      controller: addressCtrl,
                      decoration: _inputStyle(
                        "Home Address",
                        Icons.location_on_outlined,
                      ),
                      validator: (val) =>
                          val!.isEmpty ? "Address is required" : null,
                    ),

                    if (accountType == "business") ...[
                      const Padding(
                        padding: EdgeInsets.symmetric(vertical: 20),
                        child: Divider(),
                      ),
                      const Align(
                        alignment: Alignment.centerLeft,
                        child: Text(
                          "Business Information",
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Colors.blueGrey,
                          ),
                        ),
                      ),
                      const SizedBox(height: 15),
                      TextFormField(
                        controller: businessNameCtrl,
                        decoration: _inputStyle(
                          "Business Name",
                          Icons.business_outlined,
                        ),
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: businessLocationCtrl,
                        decoration: _inputStyle(
                          "Business Location",
                          Icons.map_outlined,
                        ),
                      ),
                    ],

                    const SizedBox(height: 40),

                    // --- Save Button ---
                    SizedBox(
                      width: double.infinity,
                      height: 55,
                      child: ElevatedButton(
                        onPressed: isLoading ? null : _updateProfile,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: primaryColor,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(15),
                          ),
                          elevation: 2,
                        ),
                        child: isLoading
                            ? const CircularProgressIndicator(
                                color: Colors.white,
                              )
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
                  ],
                ),
              ),
            ),
    );
  }
}
