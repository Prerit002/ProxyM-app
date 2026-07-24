import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Settings')),
      body: ListView(
        children: [
          const ListTile(
            leading: Icon(Icons.person),
            title: Text('Account Profile'),
            subtitle: Text('Manage your account'),
          ),
          ListTile(
            leading: const Icon(Icons.star, color: Colors.amber),
            title: const Text('Upgrade to Premium'),
            subtitle: const Text('Unlock all features'),
            onTap: () => context.push('/settings/premium'),
          ),
          const ListTile(
            leading: Icon(Icons.color_lens),
            title: Text('Theme'),
            subtitle: Text('Dark Mode'),
          ),
        ],
      ),
    );
  }
}
