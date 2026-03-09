import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class OrderDetailsScreen extends StatefulWidget {
  final dynamic order;
  const OrderDetailsScreen({super.key, required this.order});

  @override
  State<OrderDetailsScreen> createState() => _OrderDetailsScreenState();
}

class _OrderDetailsScreenState extends State<OrderDetailsScreen> {
  late String currentStatus;
  bool isLoading = false;

  @override
  void initState() {
    super.initState();
    currentStatus = widget.order["status"];
  }

  Future<void> _updateStatus(String newStatus) async {
    setState(() => isLoading = true);

    try {
      final response = await http.put(
        Uri.parse(
          "http://localhost:5000/api/orders/${widget.order["_id"]}/status",
        ),
        headers: {"Content-Type": "application/json"},
        body: json.encode({"status": newStatus}),
      );

      if (response.statusCode == 200) {
        setState(() => currentStatus = newStatus);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Order status updated to $newStatus")),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Failed to update status")),
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
    final o = widget.order;
    final p = o["productId"] ?? {};

    return Scaffold(
      appBar: AppBar(
        title: const Text("Order Details"),
        backgroundColor: const Color(0xFFD1AF17),
        foregroundColor: Colors.white,
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // ✅ Display product details
              const Icon(
                Icons.shopping_bag,
                size: 100,
                color: Color(0xFFD1AF17),
              ),
              const SizedBox(height: 10),

              Text(
                p["description"] ?? "No description available",
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 5),
              Text("Price: Rs. ${p["price"] ?? 0}"),
              Text("Quantity: ${o["quantity"]}"),
              Text("Total: Rs. ${o["totalPrice"]}"),
              Text("Payment Type: ${o["paymentType"]}"),
              Text("Address: ${o["address"]}"),
              Text("Phone: ${o["phone"]}"),
              const SizedBox(height: 20),

              Text(
                "Current Status: $currentStatus",
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 20),

              // ✅ Status buttons
              if (isLoading)
                const Center(child: CircularProgressIndicator())
              else
                Wrap(
                  spacing: 10,
                  children: [
                    _statusButton("Packed"),
                    _statusButton("On Delivery"),
                    _statusButton("Delivered"),
                  ],
                ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _statusButton(String status) {
    return ElevatedButton(
      onPressed: currentStatus == status ? null : () => _updateStatus(status),
      style: ElevatedButton.styleFrom(
        backgroundColor: const Color(0xFFD1AF17),
        foregroundColor: Colors.white,
        disabledBackgroundColor: Colors.grey.shade400,
      ),
      child: Text(status),
    );
  }
}
