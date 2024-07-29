import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';

class SendInvites extends StatefulWidget {
  @override
  _InvitePageState createState() => _InvitePageState();
}

class _InvitePageState extends State<SendInvites> {
  final _emailController = TextEditingController();
  bool _isLoading = false;
  String _errorMessage = '';

  Future<String?> getUserId() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('userId');
  }

  Future<void> _sendInvitation() async {
    final email = _emailController.text;

    if (email.isEmpty) {
      setState(() {
        _errorMessage = 'Please enter an email address.';
      });
      return;
    }

    // Dummy partyId and senderId for demonstration

    setState(() {
      _isLoading = true;
      _errorMessage = '';
    });

    try {
      final senderId = await getUserId();
      final response = await http.post(
        Uri.parse('https://cod-destined-secondly.ngrok-free.app/api/invite'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'senderId': senderId,
          'receiverId': email // Replace with actual receiverId lookup
        }),
      );

      if (response.statusCode == 200) {
        // Handle successful invitation
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Invitation sent successfully')),
        );
        _emailController.clear();
      } else {
        // Handle server error
        setState(() {
          _errorMessage = 'Failed to send invitation: ${response.body}';
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'Error: $e';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Send Invitation'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
              controller: _emailController,
              decoration: InputDecoration(
                labelText: 'Recipient Email',
                border: OutlineInputBorder(),
              ),
              keyboardType: TextInputType.emailAddress,
            ),
            SizedBox(height: 16.0),
            _isLoading
                ? CircularProgressIndicator()
                : ElevatedButton(
                    onPressed: _sendInvitation,
                    child: Text('Send Invitation'),
                  ),
            if (_errorMessage.isNotEmpty)
              Padding(
                padding: const EdgeInsets.only(top: 16.0),
                child: Text(
                  _errorMessage,
                  style: TextStyle(color: Colors.red),
                ),
              ),
          ],
        ),
      ),
    );
  }
}