import 'package:flutter/material.dart';

class BulkTestScreen extends StatelessWidget {
  const BulkTestScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Bulk Testing')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: const [
            CircularProgressIndicator(),
            SizedBox(height: 16),
            Text('Testing 5 proxies...'),
          ],
        ),
      ),
    );
  }
}
