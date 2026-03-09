import 'package:flutter/material.dart';
import 'package:mobileapp_ui/screens/ProductSelectionScreen.dart';
import 'package:mobileapp_ui/screens/prediction_screen.dart';

import 'screens/home_screen.dart';
import 'screens/add_screen.dart';
import 'screens/tools_screen.dart';
import 'screens/notification_screen.dart';
import 'screens/settings_screen.dart';
import 'screens/login_screen.dart';
import 'screens/MyProductsScreen.dart';
import 'screens/MyAd.dart';
import 'screens/ViewOrdersScreen.dart';
import 'screens/add_advertisement_screen.dart';

void main() {
  runApp(const CinnamonApp());
}

class CinnamonApp extends StatelessWidget {
  const CinnamonApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'CinnamonBridge',
      theme: ThemeData(
        colorSchemeSeed: const Color(0xFFD1AF17),
        useMaterial3: true,
        fontFamily: 'Inter',
        brightness: Brightness.light,
        scaffoldBackgroundColor: const Color(0xFFF8FAFC),
      ),
      initialRoute: '/',
      routes: {
        '/': (context) => const MainScreen(),
        '/home': (context) => const HomeScreen(),
        '/add': (context) => const AddScreen(),
        '/tools': (context) => const ToolsScreen(),
        '/notification': (context) => const NotificationScreen(),
        '/settings': (context) => const SettingsScreen(),
        '/login': (context) => const LoginScreen(),
        '/myproducts': (context) => const MyProductsScreen(),
        '/myad': (context) => const MyAdsScreen(),
        '/vieworder': (context) => const ViewOrdersScreen(),
        '/prediction': (context) => const PredictionScreen(),
        '/product-prediction': (context) => const ProductSelectionScreen(),
        '/addproduct': (context) => const AddScreen(),
      },
    );
  }
}

class MainScreen extends StatefulWidget {
  const MainScreen({super.key});

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _selectedIndex = 0;

  final List<Widget> _pages = const [
    HomeScreen(),
    ToolsScreen(),
    AddAdvertisementScreen(),
    NotificationScreen(),
    SettingsScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBody: true,
      appBar: AppBar(
        title: const Text(
          "Cinnamon Bridge",
          style: TextStyle(
            fontWeight: FontWeight.w800,
            fontSize: 22,
            letterSpacing: -0.5,
          ),
        ),
        centerTitle: true,
        backgroundColor: Colors.transparent,
        surfaceTintColor: Colors.transparent,
        elevation: 0,
        flexibleSpace: Container(
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              colors: [Color(0xFFD1AF17), Color(0xFFE5C124)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.only(
              bottomLeft: Radius.circular(20),
              bottomRight: Radius.circular(20),
            ),
          ),
        ),
        foregroundColor: Colors.white,
      ),
      body: AnimatedSwitcher(
        duration: const Duration(milliseconds: 400),
        switchInCurve: Curves.easeOutQuart,
        switchOutCurve: Curves.easeInQuart,
        child: _pages[_selectedIndex],
      ),

      bottomNavigationBar: Container(
        margin: const EdgeInsets.fromLTRB(20, 0, 20, 25),
        height: 55,
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.95),
          borderRadius: BorderRadius.circular(30),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              blurRadius: 25,
              offset: const Offset(0, 10),
            ),
          ],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            _buildNavItem(Icons.home_rounded, 0),
            _buildNavItem(Icons.handyman_rounded, 1),
            _buildAddButton(2),
            _buildNavItem(Icons.notifications_rounded, 3),
            _buildNavItem(Icons.settings_rounded, 4),
          ],
        ),
      ),
    );
  }

  Widget _buildNavItem(IconData icon, int index) {
    bool isSelected = _selectedIndex == index;
    return GestureDetector(
      onTap: () => setState(() => _selectedIndex = index),
      behavior: HitTestBehavior.opaque,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: isSelected
              ? const Color(0xFFD1AF17).withOpacity(0.15)
              : Colors.transparent,
          shape: BoxShape.circle,
        ),
        child: Icon(
          icon,
          color: isSelected ? const Color(0xFFD1AF17) : Colors.grey.shade400,
          size: 28,
        ),
      ),
    );
  }

  Widget _buildAddButton(int index) {
    bool isSelected = _selectedIndex == index;
    return GestureDetector(
      onTap: () => setState(() => _selectedIndex = index),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        height: 55,
        width: 55,
        decoration: BoxDecoration(
          gradient: const LinearGradient(
            colors: [Color(0xFFD1AF17), Color(0xFFB89812)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          shape: BoxShape.circle,
          boxShadow: [
            BoxShadow(
              color: const Color(0xFFD1AF17).withOpacity(0.4),
              blurRadius: 12,
              offset: const Offset(0, 6),
            ),
          ],
          border: Border.all(color: Colors.white, width: 3),
        ),
        child: Icon(
          _selectedIndex == 2 ? Icons.add_rounded : Icons.add_rounded,
          color: Colors.white,
          size: 32,
        ),
      ),
    );
  }
}
