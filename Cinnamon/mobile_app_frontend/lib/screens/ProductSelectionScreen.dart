import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'product_prediction_screen.dart';

class ProductSelectionScreen extends StatefulWidget {
  const ProductSelectionScreen({super.key});

  @override
  State<ProductSelectionScreen> createState() => _ProductSelectionScreenState();
}

class _ProductSelectionScreenState extends State<ProductSelectionScreen> {
  List<dynamic> products = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchMyProducts();
  }

  Future<void> _fetchMyProducts() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? userId = prefs.getString("userId");

    try {
      final res = await http.get(
        Uri.parse("http://localhost:5000/api/products/seller/$userId"),
      );
      if (res.statusCode == 200) {
        setState(() {
          products = json.decode(res.body)['products'];
          isLoading = false;
        });
      }
    } catch (e) {
      debugPrint("Error: $e");
      setState(() => isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Select Product for AI Analysis"),
        backgroundColor: const Color(0xFFD1AF17),
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : ListView.builder(
              itemCount: products.length,
              padding: const EdgeInsets.all(10),
              itemBuilder: (context, index) {
                final prod = products[index];
                String title = prod['name']?.toString() ?? "No Title";
                String price = prod['price']?.toString() ?? "0.00";
                String imageUrl = prod['image']?.toString() ?? "";

                return Card(
                  elevation: 2,
                  margin: const EdgeInsets.symmetric(vertical: 8),
                  child: ListTile(
                    leading: imageUrl.isNotEmpty
                        ? Image.network(
                            "http://localhost:5000$imageUrl",
                            width: 50,
                            errorBuilder: (context, error, stackTrace) =>
                                const Icon(Icons.image),
                          )
                        : const Icon(Icons.image_not_supported),
                    title: Text(title),
                    subtitle: Text("Price: Rs. $price"),
                    trailing: const Icon(
                      Icons.query_stats,
                      color: Color(0xFFD1AF17),
                    ),
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => ProductPredictionScreen(
                            productId: prod['_id']?.toString() ?? "",
                            productName: title,
                          ),
                        ),
                      );
                    },
                  ),
                );
              },
            ),
    );
  }
}
