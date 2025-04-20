import 'package:flutter/material.dart';
import 'package:salon_book/screens/dashboard_screen.dart';
import 'package:salon_book/utils/app_theme.dart';

void main() {
  runApp(const SalonBookApp());
}

class SalonBookApp extends StatelessWidget {
  const SalonBookApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SalonBook',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      home: const DashboardScreen(),
    );
  }
}