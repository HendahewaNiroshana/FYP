import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'ProductDetailsScreen.dart';
import 'addetails_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  List products = [];
  List filteredProducts = []; 
  List ads = [];
  bool isLoading = true;
  TextEditingController searchController = TextEditingController(); 

  @override
  void initState() {
    super.initState();
    fetchData();
  }

  Future<void> fetchData() async {
    try {
      final productRes = await http.get(
        Uri.parse("http://localhost:5000/api/m-products"),
      );
      final adRes = await http.get(
        Uri.parse("http://localhost:5000/api/m-ads"),
      );

      if (productRes.statusCode == 200 && adRes.statusCode == 200) {
        setState(() {
          products = json.decode(productRes.body);
          filteredProducts = products; 
          ads = json.decode(adRes.body);
          isLoading = false;
        });
      }
    } catch (e) {
      print("Error: $e");
    }
  }

  void filterSearch(String query) {
    setState(() {
      filteredProducts = products
          .where((p) => p["name"].toLowerCase().contains(query.toLowerCase()))
          .toList();
    });
  }

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.all(12.0),
            child: TextField(
              controller: searchController,
              onChanged: (value) => filterSearch(value),
              decoration: InputDecoration(
                hintText: "Search products...",
                prefixIcon: const Icon(Icons.search, color: Colors.grey),
                filled: true,
                fillColor: Colors.grey[200],
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                  borderSide: BorderSide.none,
                ),
              ),
            ),
          ),

          const Padding(
            padding: EdgeInsets.all(12),
            child: Text(
              "Products",
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
          ),

          SizedBox(
            height: 270,
            child: filteredProducts.isEmpty 
              ? const Center(child: Text("No products found"))
              : ListView.builder(
                  scrollDirection: Axis.horizontal,
                  itemCount: filteredProducts.length, 
                  itemBuilder: (context, index) {
                    final p = filteredProducts[index];
                    return Card(
                      margin: const EdgeInsets.all(10),
                      child: Container(
                        width: 180,
                        padding: const EdgeInsets.all(8),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Expanded(
                              child: p["image"] != null && p["image"].isNotEmpty
                                  ? Image.network(
                                      p["image"].replaceFirst(
                                        "localhost",
                                        "127.0.0.1",
                                      ),
                                      fit: BoxFit.cover,
                                      errorBuilder: (c, o, s) =>
                                          const Icon(Icons.broken_image, size: 50),
                                    )
                                  : const Icon(Icons.broken_image, size: 50),
                            ),
                            const SizedBox(height: 5),
                            Text(
                              p["name"],
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            Text("Rs. ${p["price"]}"),
                            const SizedBox(height: 5),
                            ElevatedButton(
                              onPressed: () {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (_) =>
                                        ProductDetailsScreen(product: p),
                                  ),
                                );
                              },
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color.fromARGB(
                                  255,
                                  209,
                                  175,
                                  23,
                                ),
                                foregroundColor: const Color.fromARGB(255, 107, 107, 107),
                              ),
                              child: const Text("Buy"),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
          ),

          const Padding(
            padding: EdgeInsets.all(12),
            child: Text(
              "Advertisements",
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
          ),
          ListView.builder(
            physics: const NeverScrollableScrollPhysics(),
            shrinkWrap: true,
            itemCount: ads.length,
            itemBuilder: (context, index) {
              final ad = ads[index];
              return Card(
                margin: const EdgeInsets.all(10),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    AspectRatio(
                      aspectRatio: 16 / 9,
                      child: Image.network(
                        ad["imageUrl"].replaceFirst("localhost", "127.0.0.1"),
                        fit: BoxFit.cover,
                        errorBuilder: (c, o, s) =>
                            const Icon(Icons.broken_image, size: 50),
                      ),
                    ),
                    ListTile(
                      title: Text(
                        ad["title"],
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                      subtitle: Text(ad["description"]),
                      trailing: ElevatedButton(
                        onPressed: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => AdDetailsScreen(ad: ad),
                            ),
                          );
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color.fromARGB(
                            255,
                            209,
                            175,
                            23,
                          ),
                          foregroundColor: const Color.fromARGB(255, 107, 107, 107),
                        ),
                        child: const Text("View"),
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}