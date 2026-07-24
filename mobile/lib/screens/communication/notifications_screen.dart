import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/notification_provider.dart';

class NotificationsScreen extends ConsumerWidget {
  const NotificationsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final notifications = ref.watch(notificationProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Notifications'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () => ref.read(notificationProvider.notifier).fetchNotifications(),
          )
        ],
      ),
      body: notifications.isEmpty
          ? const Center(child: Text('No notifications yet.'))
          : RefreshIndicator(
              onRefresh: () => ref.read(notificationProvider.notifier).fetchNotifications(),
              child: ListView.builder(
                itemCount: notifications.length,
                itemBuilder: (context, index) {
                  final notif = notifications[index];
                  return ListTile(
                    leading: CircleAvatar(
                      backgroundColor: notif.isRead ? Colors.grey[800] : Colors.blue,
                      child: Icon(notif.isRead ? Icons.notifications_none : Icons.notifications, color: Colors.white),
                    ),
                    title: Text(notif.title, style: TextStyle(fontWeight: notif.isRead ? FontWeight.normal : FontWeight.bold)),
                    subtitle: Text(notif.message),
                    trailing: notif.isRead ? null : const Icon(Icons.circle, color: Colors.blue, size: 12),
                    onTap: () {
                      if (!notif.isRead) {
                        ref.read(notificationProvider.notifier).markAsRead(notif.id);
                      }
                      // Show full message in a dialog
                      showDialog(
                        context: context,
                        builder: (ctx) => AlertDialog(
                          title: Text(notif.title),
                          content: Text(notif.message),
                          actions: [
                            TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Close'))
                          ],
                        )
                      );
                    },
                  );
                },
              ),
            ),
    );
  }
}
