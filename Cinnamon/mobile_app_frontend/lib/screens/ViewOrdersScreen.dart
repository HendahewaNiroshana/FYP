import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'OrderDetailsScreen.dart';

class ViewOrdersScreen extends StatefulWidget {
  const ViewOrdersScreen({super.key});

  @override
  State<ViewOrdersScreen> createState() => _ViewOrdersScreenState();
}

class _ViewOrdersScreenState extends State<ViewOrdersScreen> {
  List orders = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadSellerOrders();
  }

  Future<void> _loadSellerOrders() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    final sellerId = prefs.getString("userId"); 

    if (sellerId == null) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text("Seller not logged in")));
      setState(() => isLoading = false);
      return;
    }

    try {
      final response = await http.get(
        Uri.parse("http://localhost:5000/api/orders/seller/$sellerId"),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        setState(() {
          orders = data["orders"] ?? [];
          isLoading = false;
        });
      } else {
        setState(() => isLoading = false);
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(const SnackBar(content: Text("Failed to load orders")));
      }
    } catch (e) {
      setState(() => isLoading = false);
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text("Error: $e")));
    }
  }

  void _viewOrderDetails(order) {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => OrderDetailsScreen(order: order)),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Customer Orders"),
        backgroundColor: const Color(0xFFD1AF17),
        foregroundColor: Colors.white,
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : orders.isEmpty
          ? const Center(child: Text("No orders received yet"))
          : ListView.builder(
              itemCount: orders.length,
              itemBuilder: (context, index) {
                final o = orders[index];
                final product = o["productId"];
                final buyer = o["userId"];

                final description = product?["description"] ?? "No description";
                final price = product?["price"] ?? 0;
                final buyerName = buyer?["name"] ?? "Unknown Buyer";

                return Card(
                  margin: const EdgeInsets.all(10),
                  elevation: 3,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: ListTile(
                    leading: const Icon(
                      Icons.receipt_long,
                      color: Color(0xFFD1AF17),
                      size: 40,
                    ),
                    title: Text(
                      "Order from $buyerName",
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                    subtitle: Text(
                      "$description\nPrice: Rs. $price\nStatus: ${o["status"]}",
                    ),
                    isThreeLine: true,
                    trailing: const Icon(Icons.arrow_forward_ios, size: 18),
                    onTap: () => _viewOrderDetails(o),
                  ),
                );
              },
            ),
    );
  }
}
