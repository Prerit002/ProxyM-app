import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../providers/support_provider.dart';

class SupportListScreen extends ConsumerWidget {
  const SupportListScreen({super.key});

  void _createNewTicket(BuildContext context, WidgetRef ref) {
    final subjectController = TextEditingController();
    final messageController = TextEditingController();

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('New Support Ticket'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: subjectController,
              decoration: const InputDecoration(labelText: 'Subject', hintText: 'e.g. Proxy failing to connect'),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: messageController,
              decoration: const InputDecoration(labelText: 'Message'),
              maxLines: 3,
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          ElevatedButton(
            onPressed: () async {
              if (subjectController.text.isNotEmpty && messageController.text.isNotEmpty) {
                await ref.read(supportProvider.notifier).createTicket(subjectController.text, messageController.text);
                if (ctx.mounted) Navigator.pop(ctx);
              }
            },
            child: const Text('Submit'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final tickets = ref.watch(supportProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Support Desk'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () => ref.read(supportProvider.notifier).fetchTickets(),
          )
        ],
      ),
      body: tickets.isEmpty
          ? const Center(child: Text('You have no active support tickets.'))
          : RefreshIndicator(
              onRefresh: () => ref.read(supportProvider.notifier).fetchTickets(),
              child: ListView.builder(
                itemCount: tickets.length,
                itemBuilder: (context, index) {
                  final ticket = tickets[index];
                  return ListTile(
                    title: Text(ticket.subject, style: const TextStyle(fontWeight: FontWeight.bold)),
                    subtitle: Text('Status: ${ticket.status.toUpperCase()} • ${ticket.messagesCount} messages'),
                    trailing: const Icon(Icons.chevron_right),
                    onTap: () {
                      context.push('/home/support/chat', extra: ticket.id);
                    },
                  );
                },
              ),
            ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _createNewTicket(context, ref),
        child: const Icon(Icons.add),
      ),
    );
  }
}
