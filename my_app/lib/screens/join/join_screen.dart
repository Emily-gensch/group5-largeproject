import 'package:flutter/material.dart';
import 'package:my_app/constants.dart';
import 'package:my_app/screens/create_group/create_group_screen.dart';
import 'package:my_app/screens/home/home.dart';
import 'package:my_app/screens/home/navbar.dart';
import 'package:my_app/screens/welcome/components/button.dart';
import 'package:http/http.dart';
import 'dart:convert';

class JoinScreen extends StatefulWidget{
  const JoinScreen({Key? key}) : super(key: key);

  @override
  _JoinScreenState createState() => _JoinScreenState();
}

class _JoinScreenState extends State<JoinScreen> {
  TextEditingController codeController = TextEditingController();

  Future<void> joinParty(String partyInviteCode, String userID) async {
  final url = Uri.parse('https://cod-destined-secondly.ngrok-free.app/api/party/joinParty');
  final headers = {'Content-Type': 'application/json'};
  final body = jsonEncode({'partyInviteCode': partyInviteCode, 'userID': userID});

  try {
    final response = await post(url, headers: headers, body: body);

    if (response.statusCode == 200) {
      handleResponse(response);
      Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) {
                              return NavBar(); 
                            }
                          )
                        );
    } 
    else {
      print('Error: ${response.statusCode}');
      print('Error Body: ${response.body}');
    }
  } catch (e) {
    print('Error: $e');
  }
}

void handleResponse(Response response) {
  // Handle the response here
  // This is just an example, adjust it according to your needs
  try {
    final jsonResponse = jsonDecode(response.body);
    if (jsonResponse['error'] != null) {
      print('Server Error: ${jsonResponse['error']}');
    } else {
      print('Response: ${jsonResponse}');
    }
  } catch (e) {
    print('Response Error: $e');
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
            height: size.height * 0.55,
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
                  top: size.height * 0.28,
                  child: Text(
                    "Join",
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
                  top: size.height * 0.42,
                  child: Text(
                    "To start voting enter a code:",
                    style: TextStyle(
                      color: primaryCream,
                      fontSize: 18,
                      fontWeight: FontWeight.bold
                    ),
                  ),
                ),
                Positioned(
                  top: size.height * 0.45,
                  child: TextFieldContainer(child: TextField(
                    controller: codeController,
                    decoration: InputDecoration(
                      labelText: "Code",
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
                  top: size.height * 0.6,
                  child: Button(
                    text: "Submit",
                    press: () {
                      joinParty(codeController.text.toString(), "66936aa33044654047731785");
                    },
                  ),
                ),
                Positioned(
                  top: size.height * 0.7,
                  child: TextButton(
                    onPressed: () {
                      // placeholder for apis
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) {
                            return CreateGroupScreen(); //CHANGE TO CREATE GROUP
                          }
                        )
                      );
                    },
                    child: Text(
                      "Create a Group!",
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
