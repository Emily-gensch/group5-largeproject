import 'package:flutter/material.dart';
import 'package:my_app/screens/welcome/components/background.dart';
import 'package:my_app/screens/welcome/components/button.dart';
import 'package:my_app/screens/login/login_screen.dart';
import 'package:my_app/screens/register/register_screen.dart';
import 'package:my_app/constants.dart';

class Body extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size; // total height and width of screen
    return Background(
      child: Positioned(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Container (
              padding: EdgeInsets.all(30),
            ),
            SizedBox(height: 50), // padding
            Padding (
            // buttons
            padding: const EdgeInsets.only(top: 100),
            child: Button(
              text: "Login",
              press: () {
                // placeholder for apis
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) {
                      return LoginScreen();
                    }
                  )
                );
              },
            )),
            SizedBox(height: 20), // padding
            Button(
              text: "Register",
              press: () {
                // placeholder for apis
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) {
                      return RegisterScreen();
                    }
                  )
                );
              },
            )
          ],
        ),
      ),
    );
  }
}