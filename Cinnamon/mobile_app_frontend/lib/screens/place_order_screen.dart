import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

class PlaceOrderScreen extends StatefulWidget {
  final Map product;
  const PlaceOrderScreen({super.key, required this.product});

  @override
  State<PlaceOrderScreen> createState() => _PlaceOrderScreenState();
}

class _PlaceOrderScreenState extends State<PlaceOrderScreen> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController nameCtrl = TextEditingController();
  final TextEditingController addressCtrl = TextEditingController();
  final TextEditingController phoneCtrl = TextEditingController();
  int quantity = 1;
  String paymentType = "Cash on Delivery";
  bool isLoading = false;

  Future<void> placeOrder() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => isLoading = true);

    SharedPreferences prefs = await SharedPreferences.getInstance();
    final userId = prefs.getString("userId");
    if (userId == null) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text("User not logged in")));
      setState(() => isLoading = false);
      return;
    }

    final product = widget.product;
    final productId = product["_id"] ?? product["id"];
    if (productId == null) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text("Product ID not found")));
      setState(() => isLoading = false);
      return;
    }

    final totalPrice = (product["price"] ?? 0) * quantity;

    try {
      final response = await http.post(
        Uri.parse("http://localhost:5000/api/orders"),
        headers: {"Content-Type": "application/json"},
        body: json.encode({
          "userId": userId,
          "productId": productId,
          "name": nameCtrl.text.trim(),
          "address": addressCtrl.text.trim(),
          "phone": phoneCtrl.text.trim(),
          "quantity": quantity,
          "totalPrice": totalPrice,
          "paymentType": paymentType,
        }),
      );

      final data = json.decode(response.body);

      if (response.statusCode == 200 && data["success"] == true) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Order placed successfully!")),
        );
        Navigator.pop(context);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text("Failed: ${data["message"] ?? "Unknown error"}"),
          ),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text("Error: $e")));
    }

    setState(() => isLoading = false);
  }

  @override
  Widget build(BuildContext context) {
    final p = widget.product;

    return Scaffold(
      appBar: AppBar(
        title: const Text("Place Order"),
        backgroundColor: const Color(0xFFD1AF17),
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              // ✅ Product image
              Image.network(
                p["image"].replaceFirst(
                  "localhost",
                  "127.0.0.1",
                ), // replace with your IP
                height: 200,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) =>
                    const Icon(Icons.broken_image, size: 100),
              ),

              const SizedBox(height: 20),

              Text(
                p["title"] ?? "Product",
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              Text("Rs. ${p["price"]}", style: const TextStyle(fontSize: 16)),

              const SizedBox(height: 20),

              TextFormField(
                controller: nameCtrl,
                decoration: const InputDecoration(labelText: "Full Name"),
                validator: (v) => v!.isEmpty ? "Enter your name" : null,
              ),
              TextFormField(
                controller: addressCtrl,
                decoration: const InputDecoration(labelText: "Address"),
                validator: (v) => v!.isEmpty ? "Enter your address" : null,
              ),
              TextFormField(
                controller: phoneCtrl,
                decoration: const InputDecoration(labelText: "Phone"),
                keyboardType: TextInputType.phone,
                validator: (v) => v!.isEmpty ? "Enter phone number" : null,
              ),

              const SizedBox(height: 20),

              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  IconButton(
                    onPressed: () {
                      if (quantity > 1) setState(() => quantity--);
                    },
                    icon: const Icon(Icons.remove),
                  ),
                  Text("$quantity", style: const TextStyle(fontSize: 18)),
                  IconButton(
                    onPressed: () => setState(() => quantity++),
                    icon: const Icon(Icons.add),
                  ),
                ],
              ),

              const SizedBox(height: 20),

              DropdownButtonFormField(
                value: paymentType,
                items: const [
                  DropdownMenuItem(
                    value: "Cash on Delivery",
                    child: Text("Cash on Delivery"),
                  ),
                  DropdownMenuItem(
                    value: "Card Payment",
                    child: Text("Card Payment"),
                  ),
                ],
                onChanged: (val) =>
                    setState(() => paymentType = val.toString()),
                decoration: const InputDecoration(labelText: "Payment Type"),
              ),

              const SizedBox(height: 30),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: isLoading ? null : placeOrder,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFD1AF17),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                  ),
                  child: isLoading
                      ? const CircularProgressIndicator(color: Colors.white)
                      : const Text(
                          "Confirm Order",
                          style: TextStyle(fontSize: 18),
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
