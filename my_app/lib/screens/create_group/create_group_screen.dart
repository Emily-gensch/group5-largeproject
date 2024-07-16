import 'package:flutter/material.dart';
import 'package:my_app/constants.dart';
import 'package:my_app/screens/welcome/components/button.dart';
import 'package:my_app/screens/join/join_screen.dart';
import 'package:my_app/screens/generate_code/generate_code_screen.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

class CreateGroupScreen extends StatefulWidget {
  const CreateGroupScreen({Key? key}) : super(key: key);

  @override
  _CreateGroupScreenState createState() => _CreateGroupScreenState();
}

class _CreateGroupScreenState extends State<CreateGroupScreen> {
  TextEditingController groupNameController = TextEditingController();
  TextEditingController codeController = TextEditingController();

  final String apiUrl = 'http://localhost:5000/api';

  // Refresh token function
  Future<String> refreshToken() async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    final String? token = prefs.getString('token');
    print('Refreshing token with current token: $token');

    final response = await http.post(
      Uri.parse('$apiUrl/auth/refresh'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    print('Refresh token response status: ${response.statusCode}');
    print('Refresh token response body: ${response.body}');

    if (response.statusCode != 200) {
      // Checking if response is not JSON
      if (response.body.contains('<html>')) {
        print('Invalid endpoint or server error');
        throw Exception('Invalid endpoint or server error');
      }
      final error = json.decode(response.body);
      throw Exception(error['message'] ?? 'Something went wrong');
    }

    final data = json.decode(response.body);
    await prefs.setString('token', data['token']);
    await prefs.setInt('tokenExpiry', DateTime.now().millisecondsSinceEpoch + 3600 * 1000);
    print('Token refreshed and stored: ${data['token']}');
    return data['token'];
  }

  // Get token function
  Future<String> getToken() async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    final String? token = prefs.getString('token');
    final int? tokenExpiry = prefs.getInt('tokenExpiry');
    print('Current token: $token');
    print('Token expiry: $tokenExpiry');
    print('Current time: ${DateTime.now().millisecondsSinceEpoch}');

    if (token == null || DateTime.now().millisecondsSinceEpoch > tokenExpiry!) {
      try {
        final newToken = await refreshToken();
        return newToken;
      } catch (error) {
        print('Error refreshing token: $error');
        throw Exception('Session expired. Please log in again.');
      }
    }

    print('Token retrieved: $token');
    return token;
  }

  // Create party function
  Future<Map<String, dynamic>> createParty(String partyName) async {
    final String token = await getToken();
    print('Creating party with token: $token');

    final response = await http.post(
      Uri.parse('$apiUrl/party/create'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: json.encode({'partyName': partyName}),
    );

    print('Create party response status: ${response.statusCode}');
    print('Create party response body: ${response.body}');

    if (response.statusCode != 200) {
      final error = json.decode(response.body);
      throw Exception(error['message'] ?? 'Something went wrong');
    }

    print('Party created successfully');
    return json.decode(response.body);
  }

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Scaffold(
      body: Container(
        width: double.infinity,
        height: size.height,
        child: Stack(
          alignment: Alignment.center,
          children: <Widget>[
            Positioned(
              child: SizedBox(
                height: size.height * 0.65,
                width: size.width * 0.8,
                child: DecoratedBox(
                  decoration: BoxDecoration(
                    color: primaryRed,
                    borderRadius: BorderRadius.all(Radius.circular(36)),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.5),
                        blurRadius: 5.0,
                        offset: Offset(2.0, 2.0),
                      )
                    ],
                  ),
                ),
              ),
            ),
            Container(
              child: Stack(
                alignment: Alignment.center,
                children: <Widget>[
                  Positioned(
                    top: size.height * 0.25,
                    child: Text(
                      "Create a Group",
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 40,
                        color: primaryCream,
                        shadows: [
                          Shadow(
                            blurRadius: 5.0,
                            color: Colors.black.withOpacity(0.5),
                            offset: Offset(2.0, 2.0),
                          )
                        ],
                      ),
                    ),
                  ),
                  Positioned(
                    top: size.height * 0.35,
                    child: TextFieldContainer(
                      child: TextField(
                        controller: groupNameController,
                        decoration: InputDecoration(
                          labelText: "Group Name",
                          labelStyle: TextStyle(
                            color: secondaryCream,
                            fontWeight: FontWeight.bold,
                            fontSize: 30,
                          ),
                          enabledBorder: UnderlineInputBorder(
                            borderSide: BorderSide(color: Colors.transparent),
                          ),
                          focusedBorder: UnderlineInputBorder(
                            borderSide: BorderSide(color: Colors.transparent),
                          ),
                          floatingLabelBehavior: FloatingLabelBehavior.never,
                        ),
                      ),
                    ),
                  ),
                  Positioned(
                    top: size.height * 0.48,
                    child: TextFieldContainer(
                      child: TextField(
                        controller: codeController,
                        decoration: InputDecoration(
                          labelText: "Code",
                          labelStyle: TextStyle(
                            color: secondaryCream,
                            fontWeight: FontWeight.bold,
                            fontSize: 30,
                          ),
                          enabledBorder: UnderlineInputBorder(
                            borderSide: BorderSide(color: Colors.transparent),
                          ),
                          focusedBorder: UnderlineInputBorder(
                            borderSide: BorderSide(color: Colors.transparent),
                          ),
                          floatingLabelBehavior: FloatingLabelBehavior.never,
                        ),
                      ),
                    ),
                  ),
                  Positioned(
                    top: size.height * 0.62,
                    child: Button(
                      text: "Submit",
                      press: () async {
                        try {
                          final response = await createParty(groupNameController.text);
                          print('Party created response: $response');
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) {
                                return GenerateCodeScreen(); // placeholder for code screen
                              },
                            ),
                          );
                        } catch (error) {
                          print('Error creating party: $error');
                        }
                      },
                    ),
                  ),
                  Positioned(
                    top: size.height * 0.73,
                    child: TextButton(
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) {
                              return JoinScreen();
                            },
                          ),
                        );
                      },
                      child: Text(
                        "Return to Join Group",
                        style: TextStyle(
                          color: primaryCream,
                          fontSize: 20,
                          decoration: TextDecoration.underline,
                          decorationColor: primaryCream,
                          decorationThickness: 4.0,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class TextFieldContainer extends StatelessWidget {
  final Widget child;
  const TextFieldContainer({Key? key, required this.child}) : super(key: key);

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
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.5),
            blurRadius: 5.0,
            offset: Offset(2.0, 2.0),
          )
        ],
      ),
      child: child,
    );
  }
}
