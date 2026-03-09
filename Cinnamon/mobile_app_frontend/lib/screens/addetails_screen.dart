import 'package:flutter/material.dart';

class AdDetailsScreen extends StatelessWidget {
  final Map ad;

  const AdDetailsScreen({super.key, required this.ad});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(ad["title"] ?? "Advertisement"),
        backgroundColor: const Color.fromARGB(255, 209, 175, 23),
        foregroundColor: Color.fromARGB(255, 219, 219, 219),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 🔹 Ad Image
            if (ad["imageUrl"] != null && ad["imageUrl"].isNotEmpty)
              Image.network(
                ad["imageUrl"].replaceFirst("localhost", "127.0.0.1"),
                width: double.infinity,
                fit: BoxFit.cover,
                errorBuilder: (c, o, s) =>
                    const Icon(Icons.broken_image, size: 100),
              )
            else
              const Icon(Icons.image, size: 100),
            const SizedBox(height: 20),

            // 🔹 Ad Title
            Text(
              ad["title"] ?? "No Title",
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 10),

            // 🔹 Ad Description
            Text(
              ad["description"] ?? "No Description",
              style: const TextStyle(fontSize: 16),
            ),

            const SizedBox(height: 20),

            // 🔹 Optional Button (e.g., Visit, Contact)
            ElevatedButton(
              onPressed: () {
                // Example action: Navigate somewhere or open URL
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color.fromARGB(255, 209, 175, 23),
                foregroundColor: Color.fromARGB(255, 107, 107, 107),
              ),
              child: const Text("Contact / Visit"),
            ),
          ],
        ),
      ),
    );
  }
}
