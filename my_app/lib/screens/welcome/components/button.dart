import 'package:flutter/material.dart';
import 'package:my_app/constants.dart';

class Button extends StatelessWidget {
  final String text;
  final VoidCallback press;

  const Button({
    Key? key,
    required this.text,
    required this.press,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return SizedBox(
      height: 80,
      width: 260,
      child: TextButton(
        onPressed: press, 
        child: Text(
          text, 
          style: TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 36,
          ),
        ),
        style: TextButton.styleFrom(
          foregroundColor: primaryCream,
          backgroundColor: Colors.black,
          padding: EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          textStyle: TextStyle(fontSize: 16),
        ),
      ),
    );
  }
}