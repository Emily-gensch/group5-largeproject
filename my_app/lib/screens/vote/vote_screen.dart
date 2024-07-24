import 'package:flutter/material.dart';
import 'package:my_app/constants.dart';
import 'package:my_app/screens/search/global_movies.dart'; // Import global movies class

class VoteScreen extends StatelessWidget {
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