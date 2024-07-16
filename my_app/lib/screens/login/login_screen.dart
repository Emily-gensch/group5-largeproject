import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:my_app/constants.dart';
import 'package:my_app/screens/register/register_screen.dart';
import 'package:my_app/screens/welcome/components/button.dart';
import 'package:my_app/screens/welcome/welcome_screen.dart';
import 'package:my_app/screens/join/join_screen.dart';
import 'package:http/http.dart';

class LoginScreen extends StatefulWidget{
  const LoginScreen({Key? key}) : super(key: key);

  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  TextEditingController emailController = TextEditingController();
  TextEditingController passwordController = TextEditingController();

  void login(String email, String password) async {
    try{
      print(email);
      print(password);
      Response response = await post(
        Uri.parse("http://localhost:5000/api/auth/login"),
        body: jsonEncode({
          'email': email,
          'password': password
        }),
        headers: {'Content-Type': 'application/json'},
      );
      if(response.statusCode == 200){
        var data = jsonDecode(response.body.toString());
        print(data['token']);
        Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) {
                            return JoinScreen(); 
                          }
                        )
                      );
      } else {
        print("Login failed");
        print(jsonDecode(response.body.toString()));
      }
    }catch(e){
      print(e.toString());
    }
  }

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Scaffold(body: Container(
      width: double.infinity,
      height: size.height,
      child: Stack(
        alignment: Alignment.center,
        children: <Widget>[
          Positioned(child: SizedBox(
            height: size.height * 0.7,
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
                  top: size.height * 0.22,
                  child: Text(
                    "Login",
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
                  top: size.height * 0.35,
                  child: TextFieldContainer(child: TextFormField(
                    controller: emailController,
                    decoration: InputDecoration(
                      labelText: "Email",
                      labelStyle: TextStyle(
                        color: secondaryCream,
                        fontWeight: FontWeight.bold,
                        fontSize: 30
                      ),
                      enabledBorder: UnderlineInputBorder(
                      borderSide: BorderSide(color: Colors.transparent),
                    ),
                      focusedBorder: UnderlineInputBorder(
                      borderSide: BorderSide(color: Colors.transparent),
                    ),
                    floatingLabelBehavior: FloatingLabelBehavior.never
                    ),
                  ))
                ),
                Positioned(
                  top: size.height * 0.48,
                  child: TextFieldContainer(child: TextField(
                    obscureText: true,
                    controller: passwordController,
                    decoration: InputDecoration(
                      labelText: "Password",
                      labelStyle: TextStyle(
                        color: secondaryCream,
                        fontWeight: FontWeight.bold,
                        fontSize: 30
                      ),
                      enabledBorder: UnderlineInputBorder(
                      borderSide: BorderSide(color: Colors.transparent),
                    ),
                      focusedBorder: UnderlineInputBorder(
                      borderSide: BorderSide(color: Colors.transparent),
                    ),
                    floatingLabelBehavior: FloatingLabelBehavior.never
                    ),
                  ))
                ),
                Positioned(
                  top: size.height * 0.64,
                  child: Button(
                    text: "Submit",
                    press: () {
                      // placeholder for apis
                      login(emailController.text.toString(), passwordController.text.toString());
                    },
                  ),
                ),
                Positioned(
                  top: size.height * 0.75,
                  child: Text(
                    "Don't have an account?",
                    style: TextStyle(
                      color: primaryCream,
                      fontSize: 20
                    ),
                  ),
                ),
                Positioned(
                  top: size.height * 0.78,
                  child: TextButton(
                    onPressed: () {
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
                    child: Text(
                      "Sign Up!",
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
  final Widget child;
  const TextFieldContainer({
    super.key,
    required this.child
  });

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Container(
      margin: EdgeInsets.symmetric(vertical: 20),
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
      child: child
    );
  }
}
