import 'package:flutter/material.dart';
import 'package:my_app/screens/generate_code/generate_code_screen.dart';
import 'package:my_app/screens/home/navbar.dart';
import 'package:my_app/screens/profile/profile_screen.dart';
import 'package:my_app/screens/search/search_screen.dart';
import 'package:my_app/screens/vote/vote_screen.dart';
import 'package:my_app/screens/welcome/components/body.dart';

class WelcomeScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Body(), // change -- for testing
    );
  }
}