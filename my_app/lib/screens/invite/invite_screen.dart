import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:my_app/constants.dart';
import 'package:my_app/screens/create_group/create_group_screen.dart';
import 'package:my_app/screens/home/navbar.dart';
import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';

class InvitesPage extends StatefulWidget {
  @override
  _InvitesPageState createState() => _InvitesPageState();
}

class _InvitesPageState extends State<InvitesPage> {
  List invites = [];
  List parties = [];
  bool isLoading = true;
  String? errorMessage;

  @override
  void initState() {
    super.initState();
    fetchInvites();
    fetchParties();
  }

  Future<String?> getUserId() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('userId');
  }

  Future<void> storePartyId(String partyID) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('partyID', partyID);
  }

  Future<void> fetchInvites() async {
    final userId = await getUserId();

    if (userId == null) {
      setState(() {
        isLoading = false;
        errorMessage = 'User ID is null';
      });
      return;
    }

    final url = Uri.parse('https://cod-destined-secondly.ngrok-free.app/api/invitations');
    print("here user$userId");

    try {
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'userId': userId,
        }),
      );

      print(jsonDecode(response.body));

      if (response.statusCode == 200) {
        setState(() {
          invites = jsonDecode(response.body);
          isLoading = false;
        });
      } else {
        setState(() {
          errorMessage = 'Failed to fetch invite data: ${response.body}';
          isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        errorMessage = 'Error: $e';
        isLoading = false;
      });
    }
  }

  respondToInvite(String invitationId, String status) async {
    final url = Uri.parse('https://cod-destined-secondly.ngrok-free.app/api/invitations/respond');
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'invitationId': invitationId, 'status': status}),
    );

    if (response.statusCode == 200) {
      fetchInvites();
    } else {
      // Handle error
      print('Failed to respond to invite: ${response.body}');
    }
  }

  Future<void> fetchParties() async {
    final userId = await getUserId();

    if (userId == null) {
      setState(() {
        isLoading = false;
        errorMessage = 'User ID is null';
      });
      return;
    }

    final url = Uri.parse('https://cod-destined-secondly.ngrok-free.app/api/getParties');

    try {
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'userId': userId}),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        print(data);
        if (data is Map && data.containsKey('message')) {
          setState(() {
            parties = [];
            errorMessage = data['message'];
            isLoading = false;
          });
        } else {
          setState(() {
            parties = data;
            isLoading = false;
          });
        }
      } else {
        setState(() {
          errorMessage = 'Failed to fetch party data: ${response.body}';
          isLoading = false;
        });
        print(errorMessage);
      }
    } catch (e) {
      setState(() {
        errorMessage = 'Error: $e';
        isLoading = false;
      });
      print(errorMessage);
    }
  }

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return DefaultTabController(
      length: 2, // Number of tabs
      child: Scaffold(
        appBar: AppBar(
          title: Text('Invitations'),
          bottom: TabBar(
            tabs: [
              Tab(text: 'Invites'),
              Tab(text: 'Parties'), // Placeholder for future tab
            ],
          ),
        ),
        body: TabBarView(
          children: [
            Stack(
              children: <Widget>[
                isLoading
                    ? Center(child: CircularProgressIndicator())
                    : errorMessage != null
                        ? Center(child: Text(errorMessage!))
                        : ListView.builder(
                            itemCount: invites.length,
                            itemBuilder: (context, index) {
                              return ListTile(
                                title: Text(invites[index]['partyId']['partyName']),
                                subtitle: Text('From: ${invites[index]['senderObjectId']['name']}'),
                                trailing: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    IconButton(
                                      icon: Icon(Icons.check),
                                      onPressed: () => respondToInvite(invites[index]['_id'], 'accepted'),
                                    ),
                                    IconButton(
                                      icon: Icon(Icons.clear),
                                      onPressed: () => respondToInvite(invites[index]['_id'], 'declined'),
                                    ),
                                  ],
                                ),
                              );
                            },
                          ),
                Positioned(
                  bottom: 20,
                  left: size.width * 0.05,
                  child: TextButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) {
                            return CreateGroupScreen();
                          },
                        ),
                      );
                    },
                    child: Text(
                      "Create a Group",
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
            // Placeholder for the content of the second tab
            Stack(
              children: <Widget> [Center(
                child: isLoading
                        ? Center(child: CircularProgressIndicator())
                        : errorMessage != null
                ? Center(child: Text(errorMessage!))
                : ListView.builder(
                    itemCount: parties.length,
                    itemBuilder: (context, index) {
                      final party = parties[index];
                      return ListTile(
                    title: Text(party['partyName']),
                    trailing: ElevatedButton(
                      onPressed: () async {
                        await storePartyId(party['_id'].toString());
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) {
                              return NavBar(); 
                            }
                          )
                        );
                      },
                      child: Text('Action'),
                    ),
                  );
                    },
                  ),
              ),
              Positioned(
                      top: size.height * 0.65,
                      child: TextButton(
                        onPressed: () {
                          fetchParties();
                        },
                        child: Text(
                          "Refresh",
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
          ]),
          ],
        ),
      ),
    );
  }
}
