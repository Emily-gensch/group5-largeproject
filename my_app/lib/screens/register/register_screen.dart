import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart';
import 'package:my_app/constants.dart';
import 'package:my_app/screens/login/login_screen.dart';
import 'package:my_app/screens/welcome/components/button.dart';
import 'package:my_app/screens/welcome/welcome_screen.dart';

class RegisterScreen extends StatefulWidget{
  const RegisterScreen({Key? key}) : super(key: key);

  @override
  _RegisterScreenState createState() => _RegisterScreenState();
}


class _RegisterScreenState extends State<RegisterScreen> {
  TextEditingController emailController = TextEditingController();
  TextEditingController nameController = TextEditingController();
  TextEditingController passwordController = TextEditingController();

  void register(String email, String name, String password) async {
    try{
      Response response = await post(
        Uri.parse("http://localhost:5000/api/auth/register"),
        body: jsonEncode({
          'email': email,
          'name': name,
          'password': password
        }),
        headers: {'Content-Type': 'application/json'},
      );
      if(response.statusCode == 201){
        var data = jsonDecode(response.body.toString());
        print(data);
        print(data['token']);
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => LoginScreen()), 
        );
      } else {
        print("Register failed");
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
                  top: size.height * 0.28,
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
                  top: size.height * 0.4,
                  child: TextFieldContainer(child: TextFormField(
                    controller: nameController,
                    decoration: InputDecoration(
                      labelText: "Name",
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
                  top: size.height * 0.52,
                  child: TextFieldContainer(child: TextFormField(
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
                  top: size.height * 0.67,
                  child: Button(
                    text: "Submit",
                    press: () {
                      register(emailController.text.toString(), nameController.text.toString(), passwordController.text.toString());
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

