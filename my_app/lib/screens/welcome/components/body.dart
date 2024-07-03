import 'package:flutter/material.dart';
import 'package:my_app/screens/welcome/components/background.dart';
import 'package:my_app/screens/welcome/components/button.dart';
import 'package:my_app/screens/login/login_screen.dart';
import 'package:my_app/screens/register/register_screen.dart';
import 'package:my_app/constants.dart';
import 'package:elliptic_text/elliptic_text.dart';

class Body extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size; // total height and width of screen
    return Background(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[
          Container (
            padding: EdgeInsets.all(30),
            child: Text(
              "Project Title",
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 40,
                color: primaryCream,
                backgroundColor: Colors.black,
              ),
            ),
          ),
          SizedBox(height: 50), // padding
          // buttons
          Button(
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
          ),
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
    );
  }
}

final _ellipticTextStack = Stack(
  // To draw multiple texts on the same curve, use a Stack.
  children: [
    // To set the size of your ellipse, wrap a SizedBox around it.
    SizedBox(
      height: 450.0,
      width: 300.0,
      child: EllipticText(

        // Write a nice message to the Germans and the Spanish for being great
        // people.
        text: "Deutschland ist ein tolles Land... ¡y España tambien!",

        // Style your text.
        style: TextStyle(
          color: Colors.purple,
          fontSize: 20.0,

          // Space your letters out by specifying the letterSpacing.
          letterSpacing: 2.0,
          
          // Text decorations are NOT supported and will throw an error if
          // specified.
          //decoration: TextDecoration.underline,

          // Word spacing is NOT supported and will throw an error if
          // specified.
          //wordSpacing: 5.0,
        ),

        // Align your text nicely in the middle.
        textAlignment: EllipticText_TextAlignment.centre,

        // Draw your text at the bottom of the ellipse.
        perimiterAlignment: EllipticText_PerimiterAlignment.bottom,

        // Offset your text by -5 pixels along perimiter.
        offset: -5.0,

        // Ensure the bottom of your text faces away from the centre of the
        // ellipse.
        centreAlignment: EllipticText_CentreAlignment.bottomSideAway,

        // Stretch text to half of the circumference of the ellipse.
        fitFactor: 1 / 2,

        // Specify how you'd like to stretch your text. By auto-adjusting
        // the letterSpacing, the fontSize, or maybe a combo of both?
        fitType: EllipticText_FitType.stretchFit,

        // Use this to stretch your text some more.
        stretchFactor: 1.0,

        // Finally, if you're debugging your application, add the following line
        // to see the ellipse on which your text is drawn.
        debugStrokeWidth: 1.0,
      ),
    ),
  ],
);