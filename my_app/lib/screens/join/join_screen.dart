import 'package:flutter/material.dart';
import 'package:my_app/constants.dart';
import 'package:my_app/screens/create_group/create_group_screen.dart';
import 'package:my_app/screens/home/navbar.dart';
import 'package:my_app/screens/welcome/components/button.dart';
import 'package:http/http.dart';
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

class JoinScreen extends StatefulWidget{
  const JoinScreen({Key? key}) : super(key: key);

  @override
  _JoinScreenState createState() => _JoinScreenState();
}

class _JoinScreenState extends State<JoinScreen> {
  TextEditingController codeController = TextEditingController();

  final String apiUrl = 'http://localhost:5000/api';

// Refresh token function
Future<String> refreshToken() async {
  final SharedPreferences prefs = await SharedPreferences.getInstance();
  final String? token = prefs.getString('token');

  final response = await post(
    Uri.parse('$apiUrl/auth/refresh'),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    },
  );

  if (response.statusCode != 200) {
    final error = json.decode(response.body);
    throw Exception(error['message'] ?? 'Something went wrong');
  }

  final data = json.decode(response.body);
  await prefs.setString('token', data['token']);
  await prefs.setInt('tokenExpiry', DateTime.now().millisecondsSinceEpoch + 3600 * 1000);
  return data['token'];
}

// Get token function
Future<String> getToken() async {
  final SharedPreferences prefs = await SharedPreferences.getInstance();
  final String? token = prefs.getString('token');
  final int? tokenExpiry = prefs.getInt('tokenExpiry');

  if (token == null || DateTime.now().millisecondsSinceEpoch > tokenExpiry!) {
    try {
      final newToken = await refreshToken();
      return newToken;
    } catch (error) {
      throw Exception('Session expired. Please log in again.');
    }
  }

  return token;
}

// Create party function
Future<Map<String, dynamic>> createParty(String partyName) async {
  final String token = await getToken();

  final response = await post(
    Uri.parse('$apiUrl/party/create'),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    },
    body: json.encode({'partyName': partyName}),
  );

  if (response.statusCode != 200) {
    final error = json.decode(response.body);
    throw Exception(error['message'] ?? 'Something went wrong');
  }

  return json.decode(response.body);
}

  void joinParty(String partyInviteCode) async {
    try{
      Response response = await post(
        Uri.parse("http://localhost:5000/api/party/joinParty"),
        body: jsonEncode({
          'partyInviteCode': partyInviteCode
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
                  top: size.height * 0.46,
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
                      joinParty(codeController.text.toString());
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
                            return CreateGroupScreen(); 
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
