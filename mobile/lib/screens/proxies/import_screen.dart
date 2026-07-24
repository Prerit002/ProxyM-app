import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class ImportScreen extends StatelessWidget {
  const ImportScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Import Proxies')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            const TextField(
              decoration: InputDecoration(labelText: 'Paste raw proxies here (one per line)', border: OutlineInputBorder()),
              maxLines: 10,
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () => context.pop(),
              style: ElevatedButton.styleFrom(minimumSize: const Size(double.infinity, 50)),
              child: const Text('Import List'),
            ),
          ],
        ),
      ),
    );
  }
}
