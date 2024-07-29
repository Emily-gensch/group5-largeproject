import 'package:flutter/material.dart';
import 'package:my_app/constants.dart';
import 'package:my_app/screens/invite/invite_screen.dart';
import 'package:my_app/screens/invite/send_invites.dart';
import 'package:my_app/screens/welcome/components/button.dart';
import 'package:my_app/screens/join/join_screen.dart';
import 'package:my_app/screens/generate_code/generate_code_screen.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../storage.dart';
import 'package:shared_preferences/shared_preferences.dart';

class CreateGroupScreen extends StatefulWidget {
  const CreateGroupScreen({Key? key}) : super(key: key);

  @override
  _CreateGroupScreenState createState() => _CreateGroupScreenState();
}

class _CreateGroupScreenState extends State<CreateGroupScreen> {
  TextEditingController groupNameController = TextEditingController();

  Future<void> storePartyId(String partyID) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('partyID', partyID);
  }

  Future<void> storePollId(String pollID) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('pollID', pollID);
  }

  Future<void> storePartyName(String partyName) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('partyName', partyName);
  }

  Future<void> storePartyCode(String partyCode) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('partyCode', partyCode);
  }

  Future<String?> getUserId() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('userId');
  }

  Future<void> createParty(String partyName) async {
  try {
    final url = Uri.parse('https://cod-destined-secondly.ngrok-free.app/api/party/create');
    final userId = await getUserId();
    print('User ID: $userId');  // Log user ID
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'partyName': partyName, 'userId': userId}),
    );
    print('Response status: ${response.statusCode}');  // Log response status
    print('Response body: ${response.body}');  // Log response body

    if (response.statusCode == 201) {
      final responseData = jsonDecode(response.body);
      print('Party and Poll created successfully');
      print('New Party: ${responseData['party']['partyInviteCode']}');
      print('New Poll: ${responseData['poll']}');
      storePartyId(responseData['poll']['partyID']);
      storePollId(responseData['poll']['_id']);
      storePartyName(partyName);
      storePartyCode(responseData['party']['partyInviteCode']);
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) {
            return SendInvites(); 
          },
        ),
      );
    } else {
      final responseData = jsonDecode(response.body);
      print('Failed to create party and poll');
      print('Error: ${responseData['message']}');
      if (responseData.containsKey('error')) {
        print('Error details: ${responseData['error']}');
      }
    }
  } catch (e) {
    print('Exception: $e');  // Log exception
  }
}

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Scaffold(
      body: SingleChildScrollView(
        child: Container(
          width: double.infinity,
          height: size.height,
          child: Stack(
            alignment: Alignment.center,
            children: <Widget>[
              Positioned(
                child: SizedBox(
                  height: size.height * 0.45,
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
                      top: size.height * 0.34,
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
                      top: size.height * 0.4,
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
                      top: size.height * 0.57,
                      child: Button(
                        text: "Submit",
                        press: () async {
                          await createParty(groupNameController.text);
                        },
                      ),
                    ),
                    Positioned(
                      top: size.height * 0.65,
                      child: TextButton(
                        onPressed: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) {
                                return InvitesPage();
                              },
                            ),
                          );
                        },
                        child: Text(
                          "Return to Invites",
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
