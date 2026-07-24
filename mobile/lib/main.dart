import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:go_router/go_router.dart';
import 'screens/auth/login_screen.dart';
import 'screens/auth/register_screen.dart';
import 'screens/shell_screen.dart';
import 'screens/home/home_screen.dart';
import 'screens/proxies/proxy_list_screen.dart';
import 'screens/proxies/add_proxy_screen.dart';
import 'screens/proxies/proxy_test_screen.dart';
import 'screens/proxies/bulk_test_screen.dart';
import 'screens/proxies/proxy_groups_screen.dart';
import 'screens/proxies/import_screen.dart';
import 'screens/settings/settings_screen.dart';
import 'screens/settings/premium_screen.dart';
import 'screens/communication/notifications_screen.dart';
import 'screens/communication/support_list_screen.dart';
import 'screens/communication/chat_screen.dart';

@pragma('vm:entry-point')
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp();
  print("Handling a background message: ${message.messageId}");
}

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  try {
    await Firebase.initializeApp();
    FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);
    await FirebaseMessaging.instance.requestPermission();
    
    // The fcm token should ideally be sent to backend on login
    FirebaseMessaging.instance.getToken().then((token) {
      print("FCM Token: $token");
    });
    
    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      print('Foreground notification: ${message.notification?.title}');
    });
  } catch (e) {
    print('Firebase initialization failed: $e');
  }

  runApp(const ProviderScope(child: ProxyMApp()));
}



// Router
final _router = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(path: '/', builder: (c, s) => const LoginScreen()),
    GoRoute(path: '/auth', builder: (c, s) => const LoginScreen()),
    GoRoute(path: '/auth/register', builder: (c, s) => const RegisterScreen()),
    ShellRoute(
      builder: (context, state, child) => ShellScreen(child: child),
      routes: [
        GoRoute(
          path: '/home', 
          builder: (c, s) => const HomeScreen(),
          routes: [
            GoRoute(path: 'notifications', builder: (c, s) => const NotificationsScreen()),
            GoRoute(
              path: 'support', 
              builder: (c, s) => const SupportListScreen(),
              routes: [
                GoRoute(path: 'chat', builder: (c, s) => ChatScreen(ticketId: s.extra as int)),
              ]
            ),
          ]
        ),
        GoRoute(
          path: '/proxies', 
          builder: (c, s) => const ProxyListScreen(),
          routes: [
            GoRoute(path: 'add', builder: (c, s) => const AddProxyScreen()),
            GoRoute(path: 'test/:id', builder: (c, s) => ProxyTestScreen(proxyId: int.parse(s.pathParameters['id']!))),
            GoRoute(path: 'bulk-test', builder: (c, s) => const BulkTestScreen()),
            GoRoute(path: 'groups', builder: (c, s) => const ProxyGroupsScreen()),
            GoRoute(path: 'import', builder: (c, s) => const ImportScreen()),
          ]
        ),
        GoRoute(
          path: '/settings', 
          builder: (c, s) => const SettingsScreen(),
          routes: [
            GoRoute(path: 'premium', builder: (c, s) => const PremiumScreen()),
          ]
        ),
      ],
    ),
  ],
);

class ProxyMApp extends StatelessWidget {
  const ProxyMApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'ProxyM',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF007AFF), brightness: Brightness.dark),
        useMaterial3: true,
      ),
      routerConfig: _router,
    );
  }
}
