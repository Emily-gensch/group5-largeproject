import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart';
import 'package:my_app/constants.dart';
import 'package:my_app/screens/search/global_movies.dart';
import 'package:shared_preferences/shared_preferences.dart'; // Import global movies class

class VoteScreen extends StatefulWidget {

  const VoteScreen({Key? key}) : super(key: key);

  @override
  _VoteScreenState createState() => _VoteScreenState();
}

class _VoteScreenState extends State<VoteScreen> {

  List<Map<String, dynamic>> _movies = [];

  Future<String?> getPollID() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('pollID');
  }

  Future<String?> getPartyId() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('partyID');
  }

  void refresh() {
    _fetchPollData();
  }

  @override
void initState() {
  super.initState();
  _fetchPollData();
}



  Future<void> _fetchPollData() async {
    
  final pollID = await getPollID();
  if (pollID == null) {
    print('Poll ID is null');
    return;
  }
  final url = Uri.parse('https://cod-destined-secondly.ngrok-free.app/api/poll/votePage?pollID=$pollID');

  try {
    final response = await get(url);

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      final movies = List<Map<String, dynamic>>.from(data['movies']);

      final filteredMovies = movies.where((movie) => !movie['watchedStatus']).toList();

        setState(() {
          _movies = filteredMovies;
        });
    } else {
      print('Failed to fetch poll data: ${response.body}');
    }
  } catch (e) {
    print('Error: $e');
  }
}

  Future<void> _upvoteMovie(String movieTitle) async {
    final url = Uri.parse('https://cod-destined-secondly.ngrok-free.app/api/poll/upvoteMovie');
    final headers = {'Content-Type': 'application/json'};
    final partyID = await getPartyId();
    final body = jsonEncode({'partyID': partyID, 'movieTitle': movieTitle});

    try {
      final response = await post(url, headers: headers, body: body);

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        print('Movie upvoted successfully. New votes: ${data['votes']}');
        // Refresh the movie list to show updated votes
        _fetchPollData();
        refresh();
      } else {
        print('Failed to upvote movie: ${response.body}');
      }
    } catch (e) {
      print('Error: $e');
    }
  }

  Future<void> _markAsWatched(String movieTitle) async {
    final url = Uri.parse('https://cod-destined-secondly.ngrok-free.app/api/poll/markWatched');
    final headers = {'Content-Type': 'application/json'};
    final partyID = await getPartyId();
    final body = jsonEncode({'partyID': partyID, 'movieTitle': movieTitle});

    try {
      final response = await post(url, headers: headers, body: body);

      if (response.statusCode == 200) {
        print('Movie marked as watched successfully');
        // Refresh the movie list to show updated status
        
        _fetchPollData();
        refresh();
      } else {
        print('Failed to mark movie as watched: ${response.body}');
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
          child: _movies.isEmpty
              ? Center(child: Text('No movies available.'))
              : Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 8.0),
                  child: ListView.builder(
                    itemCount: _movies.length,
                    itemBuilder: (context, index) {
                      final movie = _movies[index];
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
                          title: Text(movie['movieName'], style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                          subtitle: Text(movie['description']),
                          trailing: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Padding(
                                padding: const EdgeInsets.symmetric(horizontal: 8.0),
                                child: Text('${movie['votes']} votes', style: TextStyle(fontSize: 16)),
                              ),
                              IconButton(
                                icon: Icon(Icons.thumb_up, color: primaryRed),
                                onPressed: movie['watchedStatus'] 
                                  ? null // Disable button if already marked as watched
                                  : () {
                                      _upvoteMovie(movie['movieName']);
                                    },
                              ),
                              IconButton(
                                icon: Icon(Icons.check, color: primaryRed),
                                onPressed: movie['watchedStatus']
                                  ? null // Disable button if already marked as watched
                                  : () {
                                      _markAsWatched(movie['movieName']);
                                    },
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                ),
        ),
        Padding(
          padding: const EdgeInsets.all(8.0),
          child: ElevatedButton(
            child: Text("Refresh", style: TextStyle(color: primaryCream)),
            onPressed: () {
              _fetchPollData();
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