import 'package:flutter/material.dart';

class GlobalMovies {
  static final GlobalMovies _instance = GlobalMovies._internal();

  factory GlobalMovies() {
    return _instance;
  }

  GlobalMovies._internal();

  // Notifier for movies added to the vote list
  ValueNotifier<List<Map<String, dynamic>>> addedMoviesNotifier = ValueNotifier([]);

  // Notifier for movies that are watched
  ValueNotifier<List<String>> watchedMoviesNotifier = ValueNotifier([]);

  // Method to add a movie to the list
  void addMovie(String movieTitle) {
    final currentMovies = addedMoviesNotifier.value;
    if (!currentMovies.any((movie) => movie['title'] == movieTitle)) {
      currentMovies.add({
        'title': movieTitle,
        'votes': 0,
        'hasVoted': false,
      });
      addedMoviesNotifier.value = List.from(currentMovies);
    }
  }

  // Method to upvote a movie
  void upvoteMovie(String movieTitle) {
    final currentMovies = addedMoviesNotifier.value;
    final movieIndex = currentMovies.indexWhere((movie) => movie['title'] == movieTitle);
    if (movieIndex != -1) {
      final movie = currentMovies[movieIndex];
      if (!movie['hasVoted']) {
        movie['votes'] += 1;
        movie['hasVoted'] = true;
        addedMoviesNotifier.value = List.from(currentMovies);
      }
    }
  }

  // Method to mark a movie as watched
  void addWatchedMovie(String movieTitle) {
    final currentWatchedMovies = watchedMoviesNotifier.value;
    if (!currentWatchedMovies.contains(movieTitle)) {
      currentWatchedMovies.add(movieTitle);
      watchedMoviesNotifier.value = List.from(currentWatchedMovies);
    }
  }

  // Method to get the movie with the most votes
  Map<String, dynamic>? getTopMovie() {
    final currentMovies = addedMoviesNotifier.value;
    if (currentMovies.isEmpty) return null;

    currentMovies.sort((a, b) => b['votes'].compareTo(a['votes']));
    return currentMovies.first;
  }
}
