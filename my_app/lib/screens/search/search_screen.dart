import 'package:flutter/material.dart';
import 'package:my_app/constants.dart';
import 'package:http/http.dart' as http;
import 'package:my_app/screens/search/global_movies.dart';
import 'dart:convert';
import 'dart:async';

import 'package:my_app/screens/vote/vote_screen.dart';

class SearchScreen extends StatefulWidget {
  const SearchScreen({Key? key}) : super(key: key);

  @override
  _SearchScreenState createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  TextEditingController searchController = TextEditingController();
  List<String> _movies = [];
  List<String> _addedMovies = []; // List to keep track of added movies
  Timer? _debounce;

  void _search(String query) {
    if (_debounce?.isActive ?? false) _debounce!.cancel();
    _debounce = Timer(const Duration(milliseconds: 300), () async {
      if (query.isNotEmpty) {
        final movies = await searchMovie(query);
        setState(() {
          _movies = movies;
        });
      } else {
        setState(() {
          _movies = [];
        });
      }
    });
  }

  void _addMovie(String movie) {
  GlobalMovies().addMovie(movie);
  print('Added movie: $movie'); // Debug print
}
  
  @override
  void dispose() {
    _debounce?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Scaffold(
      body: Container(
        width: double.infinity,
        height: size.height,
        child: Stack(
          alignment: Alignment.center,
          children: <Widget>[
            Positioned(
              top: size.height * 0.03,
              child: SizedBox(
                height: size.height * 0.09,
                width: size.width * 0.92,
                child: DecoratedBox(
                  decoration: BoxDecoration(
                    color: primaryRed,
                    borderRadius: BorderRadius.all(Radius.circular(18)),
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
            Positioned(
              top: size.height * 0.14,
              child: SizedBox(
                height: size.height * 0.73,
                width: size.width * 0.92,
                child: DecoratedBox(
                  decoration: BoxDecoration(
                    color: primaryRed,
                    borderRadius: BorderRadius.all(Radius.circular(18)),
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
            Positioned(
              top: size.height * 0.15,
              child: SizedBox(
                height: size.height * 0.71,
                width: size.width * 0.9,
                child: DecoratedBox(
                  decoration: BoxDecoration(
                    color: primaryCream,
                    borderRadius: BorderRadius.all(Radius.circular(18)),
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
            Positioned(
              top: size.height * 0.011,
              child: TextFieldContainer(
                child: TextField(
                  controller: searchController,
                  onChanged: _search,
                  decoration: InputDecoration(
                    labelText: "Search",
                    labelStyle: TextStyle(
                      color: secondaryCream,
                      fontWeight: FontWeight.bold,
                      fontSize: 30,
                    ),
                    enabledBorder: UnderlineInputBorder(
                      borderSide: BorderSide(color: Colors.transparent),
                    ),
                    focusedBorder: UnderlineInputBorder(
                      borderSide: BorderSide(color: Colors.transparent),
                    ),
                    floatingLabelBehavior: FloatingLabelBehavior.never,
                  ),
                ),
              ),
            ),
            Positioned(
              top: size.height * 0.17,
              left: size.width * 0.05,
              right: size.width * 0.05,
              bottom: size.height * 0.05,
              child: Container(
                // Make sure the container fits within its parent
                decoration: BoxDecoration(
                  color: primaryCream, // Set background color if needed
                  borderRadius: BorderRadius.all(Radius.circular(18)), // Match with your design
                ),
                child: ListView.builder(
                  shrinkWrap: true, // Ensure the ListView takes only the needed height
                  padding: EdgeInsets.all(8.0), // Padding around the ListView
                  itemCount: _movies.length,
                  itemBuilder: (context, index) {
                    return Container(
                      margin: EdgeInsets.symmetric(vertical: 4.0), // Space between items
                      child: ListTile(
                        title: Text(_movies[index]),
                        trailing: ElevatedButton(
                          onPressed: () => _addMovie(_movies[index]),
                          child: Text('Add', style: TextStyle(color: primaryCream)),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: primaryRed, // Background color of the button
                            padding: EdgeInsets.symmetric(horizontal: 20, vertical: 10), // Padding inside the button
                            textStyle: TextStyle(fontSize: 16, fontWeight: FontWeight.bold), // Text style
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(10), // Rounded corners
                            ),
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ),
            )

          ],
        ),
      ),
    );
  }
}


class TextFieldContainer extends StatelessWidget {
  final Widget child;
  const TextFieldContainer({
    super.key,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Container(
      margin: EdgeInsets.symmetric(vertical: 20),
      padding: EdgeInsets.symmetric(horizontal: 20, vertical: 5),
      width: size.width * 0.9,
      height: size.height * 0.075,
      decoration: BoxDecoration(
        color: primaryCream,
        borderRadius: BorderRadius.circular(10),
      ),
      child: child,
    );
  }
}

Future<List<String>> searchMovie(String searchQuery) async {
  final url = Uri.parse('http://192.168.1.79:5000/api/searchMovie');
  final headers = {'Content-Type': 'application/json'};
  final body = jsonEncode({'search': searchQuery.trim()});

  try {
    final response = await http.post(url, headers: headers, body: body);

    if (response.statusCode == 200) {
      final List<dynamic> jsonResponse = jsonDecode(response.body);
      return List<String>.from(jsonResponse);
    } else {
      print('Error: ${response.statusCode}');
      print('Error Body: ${response.body}');
      return [];
    }
  } catch (e) {
    print('Error: $e');
    return [];
  }
}
