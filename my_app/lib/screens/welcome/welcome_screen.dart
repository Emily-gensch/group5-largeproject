import 'package:flutter/material.dart';
import 'package:my_app/screens/home/navbar.dart';
import 'package:my_app/screens/welcome/components/body.dart';

class WelcomeScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: NavBar(), // change -- for testing
    );
  }
}