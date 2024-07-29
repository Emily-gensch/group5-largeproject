import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class StorageService {
  static final FlutterSecureStorage _storage = FlutterSecureStorage();

  static Future<void> saveUserID(String userID) async {
    await _storage.write(key: 'userID', value: userID);
  }

  static Future<String?> getUserID() async {
    return await _storage.read(key: 'userID');
  }
}