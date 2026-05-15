import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:fl_chart/fl_chart.dart';

class ProductPredictionScreen extends StatefulWidget {
  final String productId;
  final String productName;

  const ProductPredictionScreen({
    super.key,
    required this.productId,
    required this.productName,
  });

  @override
  State<ProductPredictionScreen> createState() =>
      _ProductPredictionScreenState();
}

class _ProductPredictionScreenState extends State<ProductPredictionScreen> {
  int prediction = 0;
  List<FlSpot> chartSpots = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchProductData();
  }

  Future<void> _fetchProductData() async {
    try {
      final response = await http.get(
        Uri.parse(
          "http://localhost:5000/api/prediction/product/${widget.productId}",
        ),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success']) {
          List<dynamic> orders = data['orders'];
          Map<String, int> monthlyData = {};

          for (var o in orders) {
            DateTime date = DateTime.parse(o['createdAt']);
            String key = "${date.year}-${date.month}";
            monthlyData[key] = (monthlyData[key] ?? 0) + (o['quantity'] as int);
          }

          List<FlSpot> spots = [];
          int index = 0;
          monthlyData.forEach((key, value) {
            spots.add(FlSpot(index.toDouble(), value.toDouble()));
            index++;
          });

          setState(() {
            prediction = data['prediction'];
            chartSpots = spots;
            isLoading = false;
          });
        }
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
        title: Text("${widget.productName} Analysis"),
        backgroundColor: const Color(0xFFD1AF17),
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  _buildPredictionCard(),
                  const SizedBox(height: 30),
                  const Text(
                    "Sales History",
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 20),
                  _buildProductChart(),
                ],
              ),
            ),
    );
  }

  Widget _buildPredictionCard() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.orange.shade50,
        borderRadius: BorderRadius.circular(15),
        border: Border.all(color: Colors.orange.shade200),
      ),
      child: Column(
        children: [
          const Icon(Icons.online_prediction, size: 40, color: Colors.orange),
          const SizedBox(height: 10),
          const Text("Next Month Prediction"),
          Text(
            "$prediction Units",
            style: const TextStyle(
              fontSize: 32,
              fontWeight: FontWeight.bold,
              color: Colors.orange,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProductChart() {
    return SizedBox(
      height: 250,
      child: LineChart(
        LineChartData(
          borderData: FlBorderData(
            show: true,
            border: Border.all(color: Colors.grey.shade300),
          ),
          lineBarsData: [
            LineChartBarData(
              spots: chartSpots,
              isCurved: true,
              color: const Color(0xFFD1AF17),
              barWidth: 4,
              belowBarData: BarAreaData(
                show: true,
                color: const Color(0xFFD1AF17).withOpacity(0.1),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
