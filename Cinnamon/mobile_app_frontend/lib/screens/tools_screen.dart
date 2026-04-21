import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ToolsScreen extends StatefulWidget {
  const ToolsScreen({super.key});

  @override
  State<ToolsScreen> createState() => _ToolsScreenState();
}

class _ToolsScreenState extends State<ToolsScreen> {
  bool _isLoggedIn = false;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _checkLoginStatus();
  }

  Future<void> _checkLoginStatus() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    bool? loggedIn = prefs.getBool("isLoggedIn") ?? false;

    if (!loggedIn) {
      if (!mounted) return;
      WidgetsBinding.instance.addPostFrameCallback((_) {
        Navigator.pushReplacementNamed(context, '/login');
      });
    } else {
      setState(() {
        _isLoggedIn = true;
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Scaffold(
        body: Center(
          child: CircularProgressIndicator(color: Color(0xFFD1AF17)),
        ),
      );
    }

    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9),
      body: CustomScrollView(
        physics: const BouncingScrollPhysics(),
        slivers: [
          SliverAppBar(
            expandedHeight: 140.0,
            floating: false,
            pinned: true,
            elevation: 0,
            backgroundColor: const Color(0xFFF1F5F9),
            flexibleSpace: FlexibleSpaceBar(
              centerTitle: true,
              title: const Text(
                "Business Tools",
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w900,
                  color: Color(0xFF1E293B),
                  letterSpacing: -0.5,
                ),
              ),
              background: Stack(
                children: [
                  Positioned(
                    top: -20,
                    right: -20,
                    child: CircleAvatar(
                      radius: 80,
                      backgroundColor: const Color(0xFFD1AF17).withOpacity(0.1),
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Tools Grid
          SliverPadding(
            padding: const EdgeInsets.fromLTRB(20, 0, 20, 20),
            sliver: SliverGrid(
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                mainAxisSpacing: 18,
                crossAxisSpacing: 18,
                childAspectRatio: 0.85,
              ),
              delegate: SliverChildListDelegate([
                _buildModernToolCard(
                  context,
                  icon: Icons.inventory_2_rounded,
                  title: "My Products",
                  desc: "Inventory Management",
                  route: '/myproducts',
                  iconColor: const Color(0xFF3B82F6), // Blue
                ),
                _buildModernToolCard(
                  context,
                  icon: Icons.search_rounded,
                  title: "Cinnamon Grades Classifier",
                  desc: "Identify Your Cinnamon Grade",
                  route: '/cinnamon-grades',
                  iconColor: const Color.fromARGB(255, 235, 170, 31), // Blue
                ),
                _buildModernToolCard(
                  context,
                  icon: Icons.add_circle_rounded,
                  title: "Add Products",
                  desc: "List New Item",
                  route: '/addproduct',
                  iconColor: const Color(0xFF10B981), // Green
                ),
                _buildModernToolCard(
                  context,
                  icon: Icons.auto_awesome_motion_rounded,
                  title: "My Ads",
                  desc: "Campaign Center",
                  route: '/myad',
                  iconColor: const Color(0xFFF59E0B), // Amber
                ),
                _buildModernToolCard(
                  context,
                  icon: Icons.local_shipping_rounded,
                  title: "Orders",
                  desc: "Track Sales",
                  route: '/vieworder',
                  iconColor: const Color(0xFF8B5CF6), // Purple
                ),
                _buildModernToolCard(
                  context,
                  icon: Icons.query_stats_rounded,
                  title: "Business",
                  desc: "Market Trends",
                  route: '/prediction',
                  iconColor: const Color(0xFFEF4444), // Red
                ),
                _buildModernToolCard(
                  context,
                  icon: Icons.analytics_rounded,
                  title: "Product",
                  desc: "Growth Insights",
                  route: '/product-prediction',
                  iconColor: const Color(0xFF06B6D4), // Cyan
                ),
              ]),
            ),
          ),
          const SliverToBoxAdapter(child: SizedBox(height: 120)),
        ],
      ),
    );
  }

  Widget _buildModernToolCard(
    BuildContext context, {
    required IconData icon,
    required String title,
    required String desc,
    required String route,
    required Color iconColor,
  }) {
    return InkWell(
      onTap: () => Navigator.pushNamed(context, route),
      borderRadius: BorderRadius.circular(28),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(28),
          boxShadow: [
            BoxShadow(
              color: const Color(0xFF1E293B).withOpacity(0.04),
              blurRadius: 20,
              offset: const Offset(0, 10),
            ),
          ],
        ),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Icon Container
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: iconColor.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Icon(icon, color: iconColor, size: 34),
              ),
              const SizedBox(height: 16),
              // Title
              Text(
                title,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontWeight: FontWeight.w800,
                  fontSize: 15,
                  color: Color(0xFF1E293B),
                ),
              ),
              const SizedBox(height: 6),
              // Description
              Text(
                desc,
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: Colors.grey.shade500,
                  fontSize: 11,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
