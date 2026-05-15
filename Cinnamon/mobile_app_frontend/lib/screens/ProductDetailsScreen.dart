import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'place_order_screen.dart';

class ProductDetailsScreen extends StatelessWidget {
  final Map product;

  const ProductDetailsScreen({super.key, required this.product});

  Future<bool> _checkLogin() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    return prefs.getBool("isLoggedIn") ?? false;
  }

  void _handleBuy(BuildContext context) async {
    bool loggedIn = await _checkLogin();
    if (loggedIn) {
      Navigator.push(
        context,
        MaterialPageRoute(builder: (_) => PlaceOrderScreen(product: product)),
      );
    } else {
      Navigator.pushNamed(context, "/login");
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(product["name"] ?? "Product Details"),
        backgroundColor: const Color.fromARGB(255, 209, 175, 23),
        foregroundColor: const Color.fromARGB(255, 219, 219, 219),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Product Image
            if (product["image"] != null &&
                product["image"].toString().isNotEmpty)
              Image.network(
                product["image"].toString().replaceFirst(
                  "localhost",
                  "127.0.0.1",
                ),
                height: 200,
                width: double.infinity,
                fit: BoxFit.cover,
                errorBuilder: (c, o, s) => const Icon(Icons.image, size: 100),
              )
            else
              const Icon(Icons.image, size: 100),
            const SizedBox(height: 20),

            // Product Name
            Text(
              product["name"] ?? "No Name",
              style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 10),

            // Price
            Text(
              "Rs. ${product["price"] ?? '0'}",
              style: const TextStyle(fontSize: 18, color: Colors.green),
            ),
            const SizedBox(height: 10),

            // Description
            Text(
              product["description"] ?? "No description available",
              style: const TextStyle(fontSize: 16),
            ),
            const SizedBox(height: 30),

            // Buy Button
            Center(
              child: ElevatedButton(
                onPressed: () => _handleBuy(context),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color.fromARGB(255, 209, 175, 23),
                  foregroundColor: const Color.fromARGB(255, 107, 107, 107),
                  padding: const EdgeInsets.symmetric(
                    horizontal: 40,
                    vertical: 15,
                  ),
                ),
                child: const Text("Place Order"),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
