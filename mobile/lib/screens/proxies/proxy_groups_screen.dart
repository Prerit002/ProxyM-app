import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class ProxyGroupsScreen extends StatelessWidget {
  const ProxyGroupsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Proxy Groups')),
      body: ListView.builder(
        itemCount: 1, // Mock
        itemBuilder: (context, index) {
          return ListTile(
            leading: const Icon(Icons.folder),
            title: const Text('Default Group'),
            subtitle: const Text('5 proxies'),
            onTap: () => context.pop(), // Go back to proxy list
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {}, // Add group logic later
        child: const Icon(Icons.add),
      ),
    );
  }
}
