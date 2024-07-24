import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  final String baseUrl;

  ApiService(this.baseUrl);

  Future<List<dynamic>> fetchMovies(String pollID) async {
    final response = await http.get(Uri.parse('$baseUrl/api/poll/votePage?pollID=$pollID'));

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return data['movies'];
    } else {
      throw Exception('Failed to load movies');
    }
  }

  Future<void> voteForMovie(String partyID, int movieID) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/poll/upvoteMovie'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({'partyID': partyID, 'movieID': movieID}),
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to vote for movie');
    }
  }

  Future<void> markMovieAsWatched(String partyID, int movieID) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/poll/markWatched'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({'partyID': partyID, 'movieID': movieID}),
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to mark movie as watched');
    }
  }
}
