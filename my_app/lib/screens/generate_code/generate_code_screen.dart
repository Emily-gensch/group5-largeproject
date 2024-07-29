import 'package:flutter/material.dart';
import 'package:my_app/constants.dart';
import 'package:my_app/screens/home/navbar.dart';
import 'package:my_app/screens/join/join_screen.dart';
import 'package:my_app/screens/welcome/welcome_screen.dart';
import 'package:flutter/services.dart';

class GenerateCodeScreen extends StatelessWidget {
  final String code;
  GenerateCodeScreen({required this.code});

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Scaffold(body: SingleChildScrollView(
      child: Container(
        width: double.infinity,
        height: size.height,
        child: Stack(
          alignment: Alignment.center,
          children: <Widget>[
            Positioned(child: SizedBox(
              height: size.height * 0.5,
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
                  Positioned(
                    top: size.height * 0.29,
                    child: Text(
                      "Your Group",
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 40,
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
                    top: size.height * 0.35,
                    child: Text(
                      "Code is:",
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 40,
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
                    top: size.height * 0.45,
                    child: Container(
                      padding: EdgeInsets.symmetric(horizontal: 20, vertical: 5),
                      width: size.width * 0.7,
                      height: size.height * 0.15,
                      decoration: BoxDecoration(
                        color: Colors.black,
                        borderRadius: BorderRadius.circular(8),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.5),
                            blurRadius: 5.0,
                            offset: Offset(2.0, 2.0),
                          ),
                        ],
                      ),
                      child: Center(
                        child: Text(
                          code, 
                          style: TextStyle(
                            color: primaryCream,
                            fontSize: 60, 
                            fontWeight: FontWeight.bold, 
                          ),
                        ),
                      ),
                    ),
                  ),
                  Positioned(
                    top: size.height * 0.6,
                    child: TextButton(
                      onPressed: () {
                        Clipboard.setData(ClipboardData(text: code));
                      },
                      child: Text(
                        "Copy",
                        style: TextStyle(
                          color: primaryCream,
                          fontSize: 20
                        ),
                      ),
                    )
                  ),
                  Positioned(
                    top: size.height * 0.67,
                    child: TextButton(
                      onPressed: () {
                        // placeholder for apis
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) {
                              return NavBar();
                            }
                          )
                        );
                      },
                      child: Text(
                        "Continue to App",
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
      ),
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
      height: size.height * 0.15,
      decoration: BoxDecoration(
        color: Colors.black,
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
