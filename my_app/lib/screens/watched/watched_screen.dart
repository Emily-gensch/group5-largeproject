import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart';
import 'package:my_app/constants.dart';
import 'package:shared_preferences/shared_preferences.dart'; // Import global movies class

class WatchedScreen extends StatefulWidget {
  @override
  _WatchedScreenState createState() => _WatchedScreenState();
}

class _WatchedScreenState extends State<WatchedScreen> {
  List<String> _watchedMovies = [];

  @override
  void initState() {
    super.initState();
    _fetchWatchedMovies();
  }

  void refresh() {
    _fetchWatchedMovies();
  }

  Future<String?> getPartyId() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('partyID');
  }

  Future<void> _fetchWatchedMovies() async {
    final partyID = await getPartyId();
    if (partyID == null) {
      print('Party ID is null');
      return;
    }
    final url = Uri.parse('https://cod-destined-secondly.ngrok-free.app/api/displayWatchedMovies');
    final headers = {'Content-Type': 'application/json'};
    final body = jsonEncode({'partyID': partyID});

    try {
      final response = await post(url, headers: headers, body: body);

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        print(data);
        final List<String> watchedMovies = data.map((movie) => movie['title'].toString()).toList();
        print(watchedMovies);

        setState(() {
          _watchedMovies = watchedMovies;
        });
      } else {
        print('Failed to fetch watched movies: ${response.body}');
      }
    } catch (e) {
      print('Error: $e');
    }
  }

  @override
Widget build(BuildContext context) {
  return Scaffold(
    body: Column(
      children: [
        Padding(padding: EdgeInsets.all(20),),
        Expanded(
          child: _watchedMovies.isEmpty
              ? Center(child: Text('No movies watched yet.'))
              : ListView.builder(
                  padding: EdgeInsets.all(8.0), 
                  itemCount: _watchedMovies.length,
                  itemBuilder: (context, index) {
                    return Container(
                      margin: EdgeInsets.symmetric(vertical: 4.0), 
                      decoration: BoxDecoration(
                        color: primaryCream, 
                        borderRadius: BorderRadius.circular(18), 
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.2),
                            blurRadius: 4.0,
                            offset: Offset(2.0, 2.0),
                          )
                        ],
                      ),
                      child: ListTile(
                        contentPadding: EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0), 
                        title: Text(
                          _watchedMovies[index],
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    );
                  },
                ),
        ),
        Padding(
          padding: const EdgeInsets.all(8.0),
          child: ElevatedButton(
            child: Text("Refresh", style: TextStyle(color: primaryCream)),
            onPressed: () {
              _fetchWatchedMovies();
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: primaryRed
            )
          ),
        ),
      ],
    ),
  );
}
}