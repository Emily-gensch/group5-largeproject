import 'package:flutter/material.dart';
import 'package:my_app/constants.dart';
import 'package:my_app/screens/search/global_movies.dart'; // Import global movies class

class WatchedScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: ValueListenableBuilder<List<String>>(
        valueListenable: GlobalMovies().watchedMoviesNotifier,
        builder: (context, watchedMovies, child) {
          return watchedMovies.isEmpty
              ? Center(child: Text('No movies watched yet.'))
              : ListView.builder(
                  padding: EdgeInsets.all(8.0), // Add padding around the list
                  itemCount: watchedMovies.length,
                  itemBuilder: (context, index) {
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
                        title: Text(
                          watchedMovies[index],
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
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
