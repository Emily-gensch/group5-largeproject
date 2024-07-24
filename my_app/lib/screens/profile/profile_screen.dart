import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart';
import 'package:my_app/constants.dart';
import 'package:my_app/screens/welcome/welcome_screen.dart';
import 'package:shared_preferences/shared_preferences.dart'; // Make sure this contains your primaryRed color

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({Key? key}) : super(key: key);

  @override
  _ProfileScreenState createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  String name = "";
  String email = "";
  String userId = "";
  TextEditingController newPasswordController = TextEditingController();
  TextEditingController validatePasswordController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _initializeUserIdAndFetch();
  }

  Future<String?> getUserId() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('userId');
  }

  Future<void> _initializeUserIdAndFetch() async {
    final id = await getUserId();
    if (id != null && id.isNotEmpty) {
      setState(() {
        userId = id;
      });
      fetchUserData(userId);
    } else {
      print('Error: userId is null or empty');
    }
  }

  Future<void> fetchUserData(String userID) async {
    final url = Uri.parse('http://192.168.1.79:5000/api/userAccount');
    final headers = {'Content-Type': 'application/json'};
    final body = jsonEncode({'userID': userID});

    try {
      final response = await post(url, headers: headers, body: body);

      if (response.statusCode == 200) {
        final jsonResponse = jsonDecode(response.body);
        setState(() {
          name = jsonResponse['name'] ?? ''; 
          email = jsonResponse['email'] ?? '';
        });
      } else {
        print('Error: ${response.statusCode}');
        print('Error Body: ${response.body}');
      }
    } catch (e) {
      print('Error: $e');
    }
  }

  void pressYesLeave()  {
  }

  Future<void> pressYesChange(String userId, String newPassword, String validatePassword) async {
    final url = Uri.parse('http://192.168.1.79:5000/api/changePassword');

    final response = await post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'userID': userId,
        'newPassword': newPassword,
        'validatePassword': validatePassword
      }),
    );

    if (response.statusCode == 200) {
      final responseData = jsonDecode(response.body);
      print('Password changed successfully: ${responseData['message']}');
      Navigator.pop(context, false);
    } else {
      final responseData = jsonDecode(response.body);
      print('Failed to change password: ${responseData['error']}');
    }
  }

  void pressYesLogout() {
    Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) {
                              return WelcomeScreen(); 
                            }
                          )
                        );
  }

  void pressNo() {
    Navigator.pop(context, false);
  }

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Scaffold(
      body: Stack(
        alignment: Alignment.center,
        children: <Widget>[
          Positioned(
            top: size.height * 0.001,
            child: Container(
              width: size.width * 0.4,
              height: size.height * 0.4,
              decoration: BoxDecoration(
                color: primaryRed,
                shape: BoxShape.circle,
              ),
            ),
          ),
          Positioned(
            top: size.height * 0.1,
            child: Image.asset('assets/icons/profilepage.png'),
          ),
          Positioned(
            top: size.height * 0.35,
            child: Text(
              name,
              style: TextStyle(
                fontSize: 40, 
                fontWeight: FontWeight.bold,
                color: primaryCream
                ),
            ),
          ),
          Positioned(
            top: size.height * 0.41,
            child: Text(
              email,
              style: TextStyle(
                fontSize: 40, 
                fontWeight: FontWeight.bold,
                color: primaryCream
                ),
            ),
          ),
          Positioned(
            top: size.height * 0.55,
            child: ProfileButtons(
              text: "Leave the Party",
              press: () {
                showDialog(
                  context: context, 
                  builder: (context) => AlertDialog(
                    backgroundColor: primaryCream,
                    title: Text(
                      "Are you sure you want to leave the party?",
                      style: TextStyle(
                        fontSize: 30,
                        fontWeight: FontWeight.bold
                      )
                    ),
                    actions: [
                      TextButton(
                        onPressed: pressYesLeave, 
                        child: Text(
                          "Yes",
                          style: TextStyle(
                            color: primaryCream,
                            fontSize: 15
                          ),
                        ),
                        style: TextButton.styleFrom(
                          backgroundColor: Colors.black,
                        )
                      ),
                      TextButton(
                        onPressed: pressNo, 
                        child: Text(
                          "No",
                          style: TextStyle(
                            color: primaryCream,
                            fontSize: 15
                          ),
                        ),
                        style: TextButton.styleFrom(
                          backgroundColor: Colors.black,
                        )
                      ),
                    ]
                  ),
                );
              },
              color: primaryRed,
            ),
          ),
          Positioned(
            top: size.height * 0.65,
            child: ProfileButtons(
              text: "Change Password",
              press: () {
                showDialog(
                  context: context, 
                  builder: (context) => AlertDialog(
                    backgroundColor: primaryRed,
                    title: Text(
                      "Change Password",
                      style: TextStyle(
                        fontSize: 30,
                        fontWeight: FontWeight.bold,
                        color: primaryCream
                      )
                    ),
                    content: Container(
                      width: size.width*0.7,
                      height: size.height*0.3,
                      alignment: Alignment.center,
                      child: Stack(
                        children: <Widget>[
                          Positioned(
                            top: 15,
                            child: TextFieldContainer(child: TextField(
                              obscureText: true,
                              controller: newPasswordController,
                              decoration: InputDecoration(
                                labelText: "New Password",
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
                            top: 120,
                            child: TextFieldContainer(child: TextField(
                              obscureText: true,
                              controller: validatePasswordController,
                              decoration: InputDecoration(
                                labelText: "Retype New Password",
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
                        ]
                      ),
                    ),
                    actions: [
                      TextButton(
                        onPressed: () async{ await pressYesChange("66936aa33044654047731785", newPasswordController.text, validatePasswordController.text); }, 
                        child: Text(
                          "Yes",
                          style: TextStyle(
                            color: primaryCream,
                            fontSize: 15
                          ),
                        ),
                        style: TextButton.styleFrom(
                          backgroundColor: Colors.black,
                        )
                      ),
                      TextButton(
                        onPressed: pressNo, 
                        child: Text(
                          "No",
                          style: TextStyle(
                            color: primaryCream,
                            fontSize: 15
                          ),
                        ),
                        style: TextButton.styleFrom(
                          backgroundColor: Colors.black,
                        )
                      ),
                    ]
                  ),
                );
              },
              color: selectNavBar,
            ),
          ),
          Positioned(
            top: size.height * 0.75,
            child: ProfileButtons(
              text: "Logout",
              press: () {
                showDialog(
                  context: context, 
                  builder: (context) => AlertDialog(
                    backgroundColor: primaryCream,
                    title: Text(
                      "Are you sure you want to logout?",
                      style: TextStyle(
                        fontSize: 30,
                        fontWeight: FontWeight.bold
                      )
                    ),
                    actions: [
                      TextButton(
                        onPressed: pressYesLogout, 
                        child: Text(
                          "Yes",
                          style: TextStyle(
                            color: primaryCream,
                            fontSize: 15
                          ),
                        ),
                        style: TextButton.styleFrom(
                          backgroundColor: Colors.black,
                        )
                      ),
                      TextButton(
                        onPressed: pressNo, 
                        child: Text(
                          "No",
                          style: TextStyle(
                            color: primaryCream,
                            fontSize: 15
                          ),
                        ),
                        style: TextButton.styleFrom(
                          backgroundColor: Colors.black,
                        )
                      ),
                    ]
                  ),
                );
              },
              color: selectNavBar,
            ),
          )
        ],
      ),
    );
  }
}

class ProfileButtons extends StatelessWidget {
  final String text;
  final VoidCallback press;
  final Color color;

  const ProfileButtons({
    Key? key,
    required this.text,
    required this.press,
    required this.color,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return SizedBox(
      height: size.height * 0.08,
      width: size.width * 0.65,
      child: TextButton(
        onPressed: press, 
        child: Text(
          text, 
          style: TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 35,
          ),
        ),
        style: TextButton.styleFrom(
          foregroundColor: primaryCream,
          backgroundColor: color,
          padding: EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          textStyle: TextStyle(fontSize: 16),
        ),
      ),
    );
  }
}

class Confirm extends StatelessWidget {
  final String text;
  final VoidCallback press;
  final Color color;

  const Confirm({
    Key? key,
    required this.text,
    required this.press,
    required this.color,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return SizedBox(
      height: 60,
      width: 190,
      child: TextButton(
        onPressed: press, 
        child: Text(
          text, 
          style: TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 35,
          ),
        ),
        style: TextButton.styleFrom(
          foregroundColor: primaryCream,
          backgroundColor: color,
          padding: EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          textStyle: TextStyle(fontSize: 16),
        ),
      ),
    );
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
