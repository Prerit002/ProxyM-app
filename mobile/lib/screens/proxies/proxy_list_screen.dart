import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../providers/proxy_provider.dart';

class ProxyListScreen extends ConsumerWidget {
  const ProxyListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final proxies = ref.watch(proxyProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('My Proxies'),
        actions: [
          IconButton(icon: const Icon(Icons.folder), onPressed: () => context.push('/proxies/groups')),
          IconButton(icon: const Icon(Icons.file_download), onPressed: () => context.push('/proxies/import')),
          IconButton(icon: const Icon(Icons.speed), onPressed: () => context.push('/proxies/bulk-test')),
        ],
      ),
      body: proxies.isEmpty
          ? const Center(child: Text('No proxies added yet.'))
          : ListView.builder(
              itemCount: proxies.length,
              itemBuilder: (context, index) {
                final proxy = proxies[index];
                return ListTile(
                  leading: const Icon(Icons.public),
                  title: Text('${proxy.ipAddress}:${proxy.port}'),
                  subtitle: Text('Status: ${proxy.status}'),
                  trailing: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      IconButton(icon: const Icon(Icons.play_arrow), onPressed: () => context.push('/proxies/test/${proxy.id}')),
                      IconButton(icon: const Icon(Icons.edit), onPressed: () {}),
                    ],
                  ),
                );
              },
            ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.push('/proxies/add'),
        child: const Icon(Icons.add),
      ),
    );
  }
}
