import 'package:flutter/material.dart';
import 'package:my_app/constants.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:async';

class SearchScreen extends StatefulWidget {
  const SearchScreen({Key? key}) : super(key: key);

  @override
  _SearchScreenState createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  TextEditingController searchController = TextEditingController();
  List<String> _movies = [];
  Timer? _debounce;

  void _search(String query) {
    if (_debounce?.isActive ?? false) _debounce!.cancel();
    _debounce = Timer(const Duration(milliseconds: 1), () async {
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
              top: size.height * 0.2,
              left: size.width * 0.02,
              right: size.width * 0.02,
              bottom: size.height * 0.02,
              child: ListView.builder(
                itemCount: _movies.length,
                itemBuilder: (context, index) {
                  return ListTile(
                    title: Text(_movies[index]),
                  );
                },
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
  final url = Uri.parse('http://localhost:5000/api/searchMovie');
  final headers = {'Content-Type': 'application/json'};
  final body = jsonEncode({'search': searchQuery.trim()});

  try {
    final response = await http.post(url, headers: headers, body: body);

    if (response.statusCode == 200) {
      final jsonResponse = jsonDecode(response.body);
      return List<String>.from(jsonResponse['results']);
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
