import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class NotificationScreen extends StatefulWidget {
  const NotificationScreen({super.key});

  @override
  State<NotificationScreen> createState() => _NotificationScreenState();
}

class _NotificationScreenState extends State<NotificationScreen> {
  List<dynamic> notifications = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchNotifications();
  }

  // ✅ Fetch notifications for logged-in user
  Future<void> _fetchNotifications() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? userId = prefs.getString("userId");

    if (userId == null) {
      setState(() => isLoading = false);
      return;
    }

    try {
      final response = await http.get(
        Uri.parse("http://localhost:5000/api/notifications/$userId"),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        setState(() {
          notifications = data["notifications"] ?? [];
          isLoading = false;
        });
      } else {
        setState(() => isLoading = false);
        debugPrint("Failed to fetch notifications: ${response.statusCode}");
      }
    } catch (e) {
      debugPrint("Error fetching notifications: $e");
      setState(() => isLoading = false);
    }
  }

  void _showNotificationDetails(Map<String, dynamic> notification) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (notification["icon"] != null && notification["icon"].isNotEmpty)
              Image.network(notification["icon"], height: 50),
            const SizedBox(height: 10),
            Text(notification["description"] ?? ""),
            const SizedBox(height: 10),
            Text(
              "Created: ${DateTime.parse(notification["createdAt"]).toLocal()}",
              style: const TextStyle(fontSize: 12, color: Colors.grey),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text("Close"),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : notifications.isEmpty
          ? Center(
              child: Text(
                "No notifications found",
                style: TextStyle(fontSize: 18, color: Colors.grey.shade600),
              ),
            )
          : ListView.builder(
              padding: const EdgeInsets.all(10),
              itemCount: notifications.length,
              itemBuilder: (context, index) {
                final notification = notifications[index];
                return Card(
                  elevation: 2,
                  margin: const EdgeInsets.symmetric(vertical: 6),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: ListTile(
                    leading:
                        notification["icon"] != null &&
                            notification["icon"].isNotEmpty
                        ? Image.network(
                            notification["icon"],
                            width: 40,
                            height: 40,
                          )
                        : const Icon(Icons.notifications, size: 40),
                    title: Text(
                      notification["title"] ?? "Notification",
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                    subtitle: Text(
                      notification["description"] ?? "",
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    trailing: notification["flag"] == true
                        ? const Icon(Icons.done, color: Colors.green)
                        : const Icon(
                            Icons.circle,
                            color: Colors.orange,
                            size: 12,
                          ),
                    onTap: () => _showNotificationDetails(notification),
                  ),
                );
              },
            ),
    );
  }
}
