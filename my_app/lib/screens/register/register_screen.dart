import 'package:flutter/material.dart';
import 'package:my_app/constants.dart';
import 'package:my_app/screens/login/login_screen.dart';
import 'package:my_app/screens/welcome/components/button.dart';
import 'package:my_app/screens/welcome/welcome_screen.dart';

class RegisterScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Scaffold(body: Container(
      width: double.infinity,
      height: size.height,
      child: Stack(
        alignment: Alignment.center,
        children: <Widget>[
          Positioned(child: SizedBox( // red box
            height: size.height * 0.85,
            width: size.width * 0.8,
            child: DecoratedBox(
              decoration: BoxDecoration(
                color: primaryRed,
                borderRadius: BorderRadius.all(Radius.circular(36)),
                boxShadow: [BoxShadow(
                  color: Colors.black.withOpacity(0.5),
                  blurRadius: 5.0,
                  offset: Offset(2.0, 2.0)
                )]
              ),
            )
          ),),
          Container(
            child: Stack(
              alignment: Alignment.center,
              children: <Widget>[
                Positioned( // title
                  top: size.height * 0.15,
                  child: Text(
                    "Register",
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 70,
                      color: primaryCream,
                      shadows: [Shadow(
                        blurRadius: 5.0,
                        color: Colors.black.withOpacity(0.5),
                        offset: Offset(2.0, 2.0),
                      )],
                    ),
                  ),
                ),
                Positioned(
                  top: size.height * 0.3,
                  child: TextFieldContainer()
                ),
                Positioned(
                  top: size.height * 0.42,
                  child: TextFieldContainer()
                ),
                Positioned(
                  top: size.height * 0.54,
                  child: TextFieldContainer()
                ),
                Positioned(
                  top: size.height * 0.67,
                  child: Button(
                    text: "Submit",
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
                  ),
                ),
                Positioned(
                  top: size.height * 0.78,
                  child: Text(
                    "Already have an account?",
                    style: TextStyle(
                      color: primaryCream,
                      fontSize: 20
                    ),
                  ),
                ),
                Positioned(
                  top: size.height * 0.81,
                  child: TextButton(
                    onPressed: () {
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
                    child: Text(
                      "Login!",
                      style: TextStyle(
                        color: primaryCream,
                        fontSize: 20,
                        decoration: TextDecoration.underline,
                        decorationColor: primaryCream,
                        decorationThickness: 4.0
                      ),
                    ),
                  )
                )
              ]
            )
          )
        ],
      )
    ));
  }
}

class TextFieldContainer extends StatelessWidget {
  const TextFieldContainer({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 20, vertical: 5),
      width: size.width * 0.7,
      height: size.height * 0.1,
      decoration: BoxDecoration(
        color: primaryCream,
        borderRadius: BorderRadius.circular(8),
        boxShadow: [BoxShadow(
                  color: Colors.black.withOpacity(0.5),
                  blurRadius: 5.0,
                  offset: Offset(2.0, 2.0)
                )]
      ),
    );
  }
}
