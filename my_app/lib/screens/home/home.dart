import 'package:flutter/material.dart';
import 'package:my_app/constants.dart';
import 'package:my_app/screens/welcome/components/button.dart';
import 'package:my_app/screens/welcome/welcome_screen.dart';
import 'package:my_app/screens/search/global_movies.dart'; // Import GlobalMovies
import 'package:http/http.dart';
import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';

class HomeScreen extends StatefulWidget {
  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {List<Map<String, String>> _users = []; // List to hold users data
  bool _isLoading = true;
  String? _error;

  String apiUrl = 'https://cod-destined-secondly.ngrok-free.app/home';

  @override
  void initState() {
    super.initState();
    _fetchPartyData();
  }

  Future<String?> getPartyId() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('partyID');
  }

  Future<String?> getPartyName() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('partyName');
  }

  Future<void> _fetchPartyData() async {
    String? partyID = await getPartyId(); 
    try {
      final response = await get(Uri.parse('$apiUrl?partyID=$partyID'));
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final guests = data['guests'] as List<dynamic>;
        setState(() {
          _users = guests.map((guest) {
            return {
              'userName': guest['userName'] as String,
              'userEmail': guest['userEmail'] as String,
            };
          }).toList();
          _isLoading = false;
        });
      } else {
        setState(() {
          _error = 'Failed to load data';
          _isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        _error = 'An error occurred: $e';
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;

    return Scaffold(
      body: Container(
        width: double.infinity,
        height: size.height,
        child: Stack(
          children: <Widget>[
            Stack(
              alignment: Alignment.center,
              children: <Widget>[
                Positioned(
                  top: size.height * 0.19,
                  child: SizedBox(
                    height: size.height * 0.38,
                    width: size.width * 0.85,
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
                        top: size.height * 0.03,
                        child: Text(
                          'Party Name',
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
                        top: size.height * 0.1,
                        child: Text(
                          "CODE",
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
                        top: size.height * 0.59,
                        child: Text(
                          "Party Name's Top Pick",
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 25,
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
                        top: size.height * 0.65,
                        child: ValueListenableBuilder<List<Map<String, dynamic>>>(
                          valueListenable: GlobalMovies().addedMoviesNotifier,
                          builder: (context, movies, child) {
                            final topMovie = GlobalMovies().getTopMovie();
                            if (topMovie == null) {
                              return Text(
                                "No movies available",
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 20,
                                  color: primaryCream,
                                  shadows: [
                                    Shadow(
                                      blurRadius: 5.0,
                                      color: Colors.black.withOpacity(0.5),
                                      offset: Offset(2.0, 2.0),
                                    )
                                  ],
                                ),
                              );
                            }

                            return Column(
                              children: [
                                Text(
                                  topMovie['title'],
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 20,
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
                                Text(
                                  "Votes: ${topMovie['votes']}",
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 20,
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
                              ],
                            );
                          },
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
