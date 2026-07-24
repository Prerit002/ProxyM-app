import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/api_service.dart';
import '../services/websocket_service.dart';

class NotificationItem {
  final int id;
  final String title;
  final String message;
  final bool isRead;
  final String createdAt;

  NotificationItem({
    required this.id,
    required this.title,
    required this.message,
    required this.isRead,
    required this.createdAt,
  });

  factory NotificationItem.fromJson(Map<String, dynamic> json) {
    return NotificationItem(
      id: json['id'],
      title: json['title'],
      message: json['message'],
      isRead: json['is_read'] == 1 || json['is_read'] == true,
      createdAt: json['created_at'],
    );
  }
}

final notificationProvider = NotifierProvider<NotificationNotifier, List<NotificationItem>>(() {
  return NotificationNotifier();
});

class NotificationNotifier extends Notifier<List<NotificationItem>> {
  final _apiService = ApiService();

  @override
  List<NotificationItem> build() {
    fetchNotifications();
    return [];
  }

  Future<void> fetchNotifications() async {
    try {
      final response = await _apiService.client.get('/notifications');
      final List<dynamic> data = response.data;
      state = data.map((item) => NotificationItem.fromJson(item)).toList();

      try {
        final userResponse = await _apiService.client.get('/user');
        final userId = userResponse.data['id'];
        WebSocketService().listenToChannel('user.$userId.notifications', 'notification.sent', (data) {
          final payload = data['notification'];
          if (payload != null) {
            final newNotif = NotificationItem.fromJson(Map<String, dynamic>.from(payload));
            state = [newNotif, ...state];
          }
        });
      } catch (e) {
        print('Socket listen error: $e');
      }
    } catch (e) {
      print('Failed to fetch notifications: $e');
    }
  }

  Future<void> markAsRead(int id) async {
    try {
      await _apiService.client.post('/notifications/$id/read', data: {});
      state = state.map((n) {
        if (n.id == id) {
          return NotificationItem(id: n.id, title: n.title, message: n.message, isRead: true, createdAt: n.createdAt);
        }
        return n;
      }).toList();
    } catch (e) {
      print('Failed to mark as read: $e');
    }
  }
}
