import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../providers/proxy_provider.dart';

class AddProxyScreen extends ConsumerStatefulWidget {
  const AddProxyScreen({super.key});

  @override
  ConsumerState<AddProxyScreen> createState() => _AddProxyScreenState();
}

class _AddProxyScreenState extends ConsumerState<AddProxyScreen> {
  final _proxyController = TextEditingController();
  bool _isLoading = false;

  Future<void> _saveProxy() async {
    setState(() => _isLoading = true);
    try {
      await ref.read(proxyProvider.notifier).addProxy(_proxyController.text);
      if (mounted) context.pop();
    } catch (e) {
      if (mounted) {
        if (e.toString().contains('limit')) {
          showDialog(
            context: context,
            builder: (ctx) => AlertDialog(
              title: const Text('Upgrade Required'),
              content: Text(e.toString()),
              actions: [
                TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
                ElevatedButton(
                  onPressed: () {
                    Navigator.pop(ctx);
                    context.push('/premium');
                  },
                  child: const Text('Upgrade Now'),
                ),
              ],
            ),
          );
        } else {
          ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.toString())));
        }
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Add Proxy')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
              controller: _proxyController,
              decoration: const InputDecoration(labelText: 'Proxy (IP:PORT or IP:PORT:USER:PASS)', border: OutlineInputBorder()),
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: _isLoading ? null : _saveProxy,
              style: ElevatedButton.styleFrom(minimumSize: const Size(double.infinity, 50)),
              child: _isLoading ? const CircularProgressIndicator() : const Text('Save Proxy'),
            ),
          ],
        ),
      ),
    );
  }
}
