import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart';
import 'package:my_app/constants.dart';
import 'package:my_app/screens/search/global_movies.dart'; // Import global movies class

class VoteScreen extends StatelessWidget {
  Future<void> _fetchPollData(String pollID) async {
  final url = Uri.parse('https://cod-destined-secondly.ngrok-free.app/api/poll/votePage?pollID=$pollID');

  try {
    final response = await get(url);

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      final movies = List<String>.from(data['movies'].map((movie) => movie['movieName']));
      // Update your UI with the fetched data
    } else {
      print('Failed to fetch poll data: ${response.body}');
    }
  } catch (e) {
    print('Error: $e');
  }
}

  Future<void> _upvoteMovie(String partyID, String movieID) async {
  final url = Uri.parse('https://cod-destined-secondly.ngrok-free.app/api/upvoteMovie');
  final headers = {'Content-Type': 'application/json'};
  final body = jsonEncode({
    'partyID': partyID,
    'movieID': movieID,
  });

  try {
    final response = await post(url, headers: headers, body: body);

    if (response.statusCode == 200) {
      print('Movie upvoted successfully');
      // Optionally update UI or show a confirmation
    } else {
      print('Failed to upvote movie: ${response.body}');
    }
  } catch (e) {
    print('Error: $e');
  }
}



  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: ValueListenableBuilder<List<Map<String, dynamic>>>(
        valueListenable: GlobalMovies().addedMoviesNotifier,
        builder: (context, addedMovies, child) {
          return addedMovies.isEmpty
              ? Center(child: Text('No movies added yet.'))
              : ListView.builder(
                  padding: EdgeInsets.all(8.0), // Add padding around the list
                  itemCount: addedMovies.length,
                  itemBuilder: (context, index) {
                    final movie = addedMovies[index];
                    return Container(
                      margin: EdgeInsets.symmetric(vertical: 4.0), // Space between items
                      decoration: BoxDecoration(
                        color: primaryCream, // Background color
                        borderRadius: BorderRadius.circular(18), // Rounded corners
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.2),
                            blurRadius: 4.0,
                            offset: Offset(2.0, 2.0),
                          )
                        ],
                      ),
                      child: ListTile(
                        contentPadding: EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0), // Padding inside ListTile
                        title: Text(movie['title'], style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                        trailing: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Padding(
                              padding: const EdgeInsets.symmetric(horizontal: 8.0),
                              child: Text('${movie['votes']} votes', style: TextStyle(fontSize: 16)),
                            ),
                            IconButton(
                              icon: Icon(Icons.thumb_up, color: primaryRed),
                              onPressed: movie['hasVoted']
                                  ? null // Disable button if already voted
                                  : () {
                                      GlobalMovies().upvoteMovie(movie['title']);
                                    },
                            ),
                            IconButton(
                              icon: Icon(Icons.check, color: primaryRed),
                              onPressed: () {
                                GlobalMovies().addWatchedMovie(movie['title']);
                                // Optionally remove the movie from the added list
                                final currentMovies = GlobalMovies().addedMoviesNotifier.value;
                                currentMovies.removeWhere((m) => m['title'] == movie['title']);
                                GlobalMovies().addedMoviesNotifier.value = List.from(currentMovies);
                              },
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                );
        },
      ),
    );
  }
}