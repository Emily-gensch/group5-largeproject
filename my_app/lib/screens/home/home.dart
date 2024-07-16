import 'package:flutter/material.dart';
import 'package:my_app/constants.dart';
import 'package:my_app/screens/welcome/components/button.dart';
import 'package:my_app/screens/welcome/welcome_screen.dart';

class HomeScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Scaffold(body: Container(
      width: double.infinity,
      height: size.height,
      child: Stack(
        children: <Widget>[
          Stack(
            alignment: Alignment.center,
            children: <Widget>[
              Positioned(top: size.height*0.19, child: SizedBox(
                height: size.height * 0.38,
                width: size.width * 0.85,
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
                      top: size.height * 0.03,
                      child: Text(
                        "Group: Group Name",
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
                      top: size.height * 0.1,
                      child: Text(
                        "CODE",
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
                    // REMOVE
                    Positioned(
                  top: size.height * 0.6,
                  child: Button(
                    text: "Submit",
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
                  ),
                ),
                    Positioned(
                      top: size.height * 0.21,
                      child: TextFieldContainer()
                    ),
                    Positioned(
                      top: size.height * 0.33,
                      child: TextFieldContainer()
                    ),
                    Positioned(
                      top: size.height * 0.45,
                      child: TextFieldContainer()
                    ),
                    Positioned(
                      top: size.height * 0.59,
                      child: Text(
                        "Group Name's Top Pick",
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 25,
                          color: primaryCream,
                          shadows: [Shadow(
                            blurRadius: 5.0,
                            color: Colors.black.withOpacity(0.5),
                            offset: Offset(2.0, 2.0),
                          )],
                        ),
                      ),
                    ),
                    Positioned(top: size.height*0.65, child: SizedBox(
                      height: size.height * 0.21,
                      width: size.width * 0.65,
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
                    
                  ]
                )
              )
            ],
          ),
          Positioned(top: size.height*0.665, left: size.width*0.2, child: SizedBox(
                height: size.height * 0.18,
                width: size.width * 0.3,
                child: DecoratedBox(
                  decoration: BoxDecoration(
                    color: selectNavBar,
                    borderRadius: BorderRadius.all(Radius.circular(36)),
                    boxShadow: [BoxShadow(
                      color: Colors.black.withOpacity(0.5),
                      blurRadius: 5.0,
                      offset: Offset(2.0, 2.0)
                    )]
                  ),
                )
          ),),
          Positioned(
                      top: size.height * 0.7,
                      left: size.width*0.52,
                      child: Text(
                        "Movie Name",
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 20,
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
                      top: size.height * 0.73,
                      left: size.width*0.52,
                      child: Text(
                        "Genre",
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 20,
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
                      top: size.height * 0.76,
                      left: size.width*0.52,
                      child: Text(
                        "Desc.",
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 20,
                          color: primaryCream,
                          shadows: [Shadow(
                            blurRadius: 5.0,
                            color: Colors.black.withOpacity(0.5),
                            offset: Offset(2.0, 2.0),
                          )],
                        ),
                      ),
                    ),
        ]),
      ),
      
    );
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
      width: size.width * 0.78,
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
      child: Text(
        "username",
        style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 25,
                      color: Colors.black
                    ),
      ),
    );
  }
}
