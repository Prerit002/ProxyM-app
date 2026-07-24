import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'dart:io';

class ApiService {
  late final Dio _dio;
  final _storage = const FlutterSecureStorage();

  // For Android emulator pointing to localhost, use 10.0.2.2
  // For iOS emulator use 127.0.0.1
  // For real device, use the machine's local IP (e.g., 192.168.x.x)
  static final String baseUrl = _getBaseUrl();

  static String _getBaseUrl() {
    if (Platform.isAndroid) return 'http://10.0.2.2:8000/api';
    return 'http://127.0.0.1:8000/api';
  }

  ApiService() {
    _dio = Dio(BaseOptions(
      baseUrl: baseUrl,
      headers: {'Accept': 'application/json'},
    ));

    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await _storage.read(key: 'auth_token');
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
    ));
  }

  Dio get client => _dio;
}
