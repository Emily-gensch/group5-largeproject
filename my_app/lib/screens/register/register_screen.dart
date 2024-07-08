import 'package:flutter/material.dart';
import 'package:my_app/screens/welcome/components/background.dart';
import 'package:my_app/screens/welcome/components/button.dart';
import 'package:my_app/screens/welcome/welcome_screen.dart';

class RegisterScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Background(
      child: Column(
        children: <Widget>[
        Button(
            text: "Home",
            press: () {
              // placeholder for apis
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) {
                    return WelcomeScreen();
                  }
                )
              );
            },
          )
      ],)
    );
  }
}
