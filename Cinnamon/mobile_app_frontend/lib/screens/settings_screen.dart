import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'editprofile_screen.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  String? name;
  String? email;
  String? profilePic;
  bool isLoggedIn = false;

  @override
  void initState() {
    super.initState();
    _loadUserData();
  }

  Future<void> _loadUserData() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    setState(() {
      name = prefs.getString("name");
      email = prefs.getString("email");
      profilePic = prefs.getString("userProfilePic"); // 🖼️ profile pic URL
      isLoggedIn = prefs.getBool("isLoggedIn") ?? false;
    });
  }

  Future<void> _logout() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.clear();
    Navigator.pushNamed(context, "/");
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: isLoggedIn
            ? Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // 🖼️ Profile Picture
                  CircleAvatar(
                    radius: 50,
                    backgroundImage:
                        (profilePic != null && profilePic!.isNotEmpty)
                        ? NetworkImage("http://localhost:5000$profilePic")
                        : const AssetImage("assets/default_avatar.png")
                              as ImageProvider,
                  ),
                  const SizedBox(height: 20),
                  Text(
                    name ?? "No Name",
                    style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Text(email ?? "No Email"),
                  const SizedBox(height: 20),
                  ElevatedButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const EditProfileScreen(),
                        ),
                      );
                    },
                    child: const Text("Edit Profile"),
                  ),

                  ElevatedButton(
                    onPressed: _logout,
                    child: const Text("Logout"),
                  ),
                ],
              )
            : ElevatedButton(
                onPressed: () {
                  Navigator.pushNamed(context, "/login");
                },
                child: const Text("Login"),
              ),
      ),
    );
  }
}
