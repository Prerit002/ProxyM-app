import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/proxy_provider.dart';

class ProxyTestScreen extends ConsumerStatefulWidget {
  final int proxyId;
  const ProxyTestScreen({super.key, required this.proxyId});

  @override
  ConsumerState<ProxyTestScreen> createState() => _ProxyTestScreenState();
}

class _ProxyTestScreenState extends ConsumerState<ProxyTestScreen> {
  Map<String, dynamic>? _result;
  bool _isTesting = true;

  @override
  void initState() {
    super.initState();
    _runTest();
  }

  Future<void> _runTest() async {
    final result = await ref.read(proxyProvider.notifier).testProxy(widget.proxyId);
    if (mounted) {
      setState(() {
        _result = result;
        _isTesting = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Proxy Test Result')),
      body: Center(
        child: _isTesting 
            ? const CircularProgressIndicator()
            : Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    _result?['status'] == 'WORKING' ? Icons.check_circle : Icons.error, 
                    color: _result?['status'] == 'WORKING' ? Colors.green : Colors.red, 
                    size: 64
                  ),
                  const SizedBox(height: 16),
                  Text('Status: ${_result?['status'] ?? 'ERROR'}', style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
                  Text('Latency: ${_result?['latency'] ?? 'N/A'}ms'),
                  Text('IP Detected: ${_result?['ip'] ?? 'None'}'),
                ],
              ),
      ),
    );
  }
}
