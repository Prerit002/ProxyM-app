import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Home'),
        actions: [
          IconButton(icon: const Icon(Icons.notifications), onPressed: () => context.push('/home/notifications')),
          IconButton(icon: const Icon(Icons.support_agent), onPressed: () => context.push('/home/support')),
        ],
      ),
      body: const Center(child: Text('Active Proxy Dashboard')),
    );
  }
}
