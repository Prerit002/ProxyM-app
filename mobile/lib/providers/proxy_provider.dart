import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:dio/dio.dart';
import '../services/api_service.dart';

class ProxyItem {
  final int id;
  final String ipAddress;
  final String port;
  final String status;

  ProxyItem({required this.id, required this.ipAddress, required this.port, required this.status});

  factory ProxyItem.fromJson(Map<String, dynamic> json) {
    return ProxyItem(
      id: json['id'],
      ipAddress: json['ip_address'],
      port: json['port'],
      status: json['status'] ?? 'unknown',
    );
  }
}

final proxyProvider = NotifierProvider<ProxyNotifier, List<ProxyItem>>(() {
  return ProxyNotifier();
});

class ProxyNotifier extends Notifier<List<ProxyItem>> {
  final _apiService = ApiService();

  @override
  List<ProxyItem> build() {
    fetchProxies();
    return [];
  }

  Future<void> fetchProxies() async {
    try {
      final response = await _apiService.client.get('/proxies');
      final List<dynamic> data = response.data;
      state = data.map((item) => ProxyItem.fromJson(item)).toList();
    } catch (e) {
      print('Fetch error: $e');
    }
  }

  Future<void> addProxy(String rawProxy) async {
    try {
      final response = await _apiService.client.post('/proxies', data: {
        'raw_proxy': rawProxy,
      });
      if (response.statusCode == 201) {
        state = [...state, ProxyItem.fromJson(response.data)];
      }
    } on DioException catch (e) {
      if (e.response?.statusCode == 403) {
        throw e.response?.data['message'] ?? 'Proxy limit reached';
      }
      throw 'Failed to add proxy';
    } catch (e) {
      throw e.toString();
    }
  }

  Future<Map<String, dynamic>?> testProxy(int id) async {
    try {
      final response = await _apiService.client.post('/proxies/$id/test');
      if (response.statusCode == 200) {
        // Update local state status
        state = state.map((p) => p.id == id ? ProxyItem(id: p.id, ipAddress: p.ipAddress, port: p.port, status: response.data['status']) : p).toList();
        return response.data;
      }
    } catch (e) {
      print('Test error: $e');
    }
    return null;
  }
}
