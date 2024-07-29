import 'package:flutter/material.dart';
import 'package:my_app/constants.dart';
import 'package:my_app/screens/welcome/components/button.dart';
import 'package:my_app/screens/welcome/welcome_screen.dart';
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
  String? _partyName; 
  String? _partyCode; 
  List<String> _movies = [];
  String? _topMovieTitle;
  int? _topMovieVotes;

  

  String apiUrl = 'https://cod-destined-secondly.ngrok-free.app/api/home';

  @override
  void initState() {
    super.initState();
    _fetchPartyData();
    _fetchMovies();
  }

  void refresh() {
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
  
  Future<String?> getPartyCode() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('partyCode');
  }
  

  Future<void> _fetchPartyData() async {
      final partyID = await getPartyId();
      final partyName = await getPartyName();
      final partyCode = await getPartyCode();
      
      if (partyName != null) {
      setState(() {
        _partyName = partyName; 
      });
      
    }

    if (partyCode != null) {
      setState(() {
        _partyCode = partyCode; 
      });
      
    }
  }

  Future<void> _fetchMovies() async {
    final partyID = await getPartyId();
    if (partyID == null) {
      print('Party ID is null');
      return;
    }
    final url = Uri.parse('https://cod-destined-secondly.ngrok-free.app/api/displayTopMovie');
    final headers = {'Content-Type': 'application/json'};
    final body = jsonEncode({'partyID': partyID});

    try {
      final response = await post(url, headers: headers, body: body);

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        print(data);
        if (data.isNotEmpty) {
          final firstMovie = data.first;
          setState(() {
            _topMovieTitle = firstMovie['title'].toString();
            _topMovieVotes = firstMovie['votes']; 
            _movies = data.map((movie) => movie['title'].toString()).toList();
          });
        } else {
        print('No movies found');
      }
      } else {
        print('Failed to fetch watched movies: ${response.body}');
      }
    } catch (e) {
      print('Error: $e');
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
          Padding(padding: EdgeInsets.all(20)),
          Stack(
            alignment: Alignment.center,
            children: <Widget>[
              
              Container(
                child: Stack(
                  alignment: Alignment.center,
                  children: <Widget>[
                    Positioned(
                      top: size.height * 0.12,
                      child: Text(
                        _partyName ?? 'N/A',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: size.width*0.13,
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
                      top: size.height * 0.25,
                      child: Text(
                        _partyCode ?? 'N/A',
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
                      top: size.height * 0.45,
                      child: Text(
                        (_partyName ?? 'N/A') + "'s Top Pick",
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
                      top: size.height * 0.5, 
                      child: Column(
                        children: <Widget>[
                          Text(
                            _topMovieTitle ?? 'No top movie',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 20,
                              color: primaryCream,
                            ),
                          ),
                          if (_topMovieVotes != null) 
                            Text(
                              'Votes: $_topMovieVotes',
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 18,
                                color: primaryCream,
                              ),
                            ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          Positioned(
            top: size.height * 0.8,
            child: Padding(
              padding: const EdgeInsets.all(8.0),
              child: ElevatedButton(
                child: Text("Refresh", style: TextStyle(color: primaryCream)),
                onPressed: () {
                  _fetchMovies();
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: primaryRed,
                ),
              ),
            ),
          ),
        ],
      ),
    ),
  );
}}