import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:async';

import 'package:my_app/constants.dart';
import 'package:shared_preferences/shared_preferences.dart';

class SearchScreen extends StatefulWidget {
  const SearchScreen({Key? key}) : super(key: key);

  @override
  _SearchScreenState createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  TextEditingController searchController = TextEditingController();
  List<String> _movies = [];
  Timer? _debounce;

  Future<String?> getPartyId() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('partyID');
  }

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

  Future<void> _addMovie(String movieTitle) async {
    final partyID = await getPartyId();
    final response = await http.post(
      Uri.parse('https://cod-destined-secondly.ngrok-free.app/api/poll/addMovieToPoll'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'partyID': partyID, 'movieTitle': movieTitle}),
    );

    if (response.statusCode == 201) {
      print('Movie added: $movieTitle');

      
    } else {
      print('Failed to add movie: ${response.body}');
    }
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
              top: size.height * 0.05,
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
              top: size.height * 0.16,
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
              top: size.height * 0.17,
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
              top: size.height * 0.035,
              child: TextFieldContainer(
                child: TextField(
                  controller: searchController,
                  onChanged: _search,
                  decoration: InputDecoration(
                    labelText: "Search",
                    labelStyle: TextStyle(
                      color: primaryCream,
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
                decoration: BoxDecoration(
                  color:primaryCream,
                  borderRadius: BorderRadius.all(Radius.circular(18)),
                ),
                child: ListView.builder(
                  shrinkWrap: true,
                  padding: EdgeInsets.all(8.0),
                  itemCount: _movies.length,
                  itemBuilder: (context, index) {
                    return Container(
                      margin: EdgeInsets.symmetric(vertical: 4.0),
                      child: ListTile(
                        title: Text(_movies[index]),
                        trailing: ElevatedButton(
                          onPressed: () => _addMovie(_movies[index]),
                          child: Text('Add', style: TextStyle(color: primaryCream)),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: primaryRed,
                            padding: EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                            textStyle: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(10),
                            ),
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ),
            ),
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
  final url = Uri.parse('https://cod-destined-secondly.ngrok-free.app/api/searchMovie');
  final headers = {'Content-Type': 'application/json'};
  final body = jsonEncode({'search': searchQuery.trim()});

  try {
    final response = await http.post(url, headers: headers, body: body);

    if (response.statusCode == 200) {
      final List<dynamic> jsonResponse = jsonDecode(response.body);
      return jsonResponse.map<String>((movie) => movie as String).toList();
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

