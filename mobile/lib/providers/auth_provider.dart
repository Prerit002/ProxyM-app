import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../services/api_service.dart';
import '../services/websocket_service.dart';

final authProvider = NotifierProvider<AuthNotifier, bool>(() {
  return AuthNotifier();
});

class AuthNotifier extends Notifier<bool> {
  final _apiService = ApiService();
  final _storage = const FlutterSecureStorage();

  @override
  bool build() {
    _checkAuth();
    return false;
  }

  Future<void> _checkAuth() async {
    final token = await _storage.read(key: 'auth_token');
    state = token != null;
    if (token != null) {
      WebSocketService().init(token);
    }
  }

  Future<bool> login(String email, String password) async {
    try {
      final response = await _apiService.client.post('/login', data: {
        'email': email,
        'password': password,
      });

      if (response.statusCode == 200) {
        final token = response.data['access_token'];
        await _storage.write(key: 'auth_token', value: token);
        state = true;
        WebSocketService().init(token);
        return true;
      }
    } catch (e) {
      print('Login error: $e');
    }
    return false;
  }

  Future<bool> register(String name, String email, String password) async {
    try {
      final response = await _apiService.client.post('/register', data: {
        'name': name,
        'email': email,
        'password': password,
      });

      if (response.statusCode == 200) {
        final token = response.data['access_token'];
        await _storage.write(key: 'auth_token', value: token);
        state = true;
        WebSocketService().init(token);
        return true;
      }
    } catch (e) {
      print('Register error: $e');
    }
    return false;
  }

  Future<void> logout() async {
    await _storage.delete(key: 'auth_token');
    state = false;
    WebSocketService().disconnect();
  }
}
