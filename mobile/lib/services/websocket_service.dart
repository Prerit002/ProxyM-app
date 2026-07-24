import 'dart:async';
import 'dart:convert';
import 'package:dart_pusher_channels/dart_pusher_channels.dart';
import 'package:mobile/services/api_service.dart';

class WebSocketService {
  static final WebSocketService _instance = WebSocketService._internal();
  factory WebSocketService() => _instance;
  WebSocketService._internal();

  PusherChannelsClient? client;
  StreamSubscription? _connectionSub;
  final Map<String, PrivateChannel> _channels = {};
  final Map<String, StreamSubscription> _eventSubs = {};
  String? _token;

  Future<void> init(String token) async {
    if (client != null) return;
    _token = token;

    try {
      final options = PusherChannelsOptions.fromHost(
        scheme: 'ws',
        host: '10.0.2.2',
        port: 8080,
        key: 'reverb_key_local',
        shouldSupplyMetadataQueries: true,
      );

      client = PusherChannelsClient.websocket(
        options: options,
        connectionErrorHandler: (exception, trace, refresh) {
          refresh();
        },
      );

      _connectionSub = client?.onConnectionEstablished.listen((_) {
        for (final channel in _channels.values) {
          channel.subscribeIfNotUnsubscribed();
        }
      });

      client?.connect();
    } catch (e) {
      print('WebSocket Init Error: $e');
    }
  }

  void listenToChannel(String channelName, String eventName, Function(dynamic) callback) {
    if (client == null) return;

    final fullChannel = channelName.startsWith('private-') ? channelName : 'private-$channelName';

    PrivateChannel? channel = _channels[fullChannel];
    if (channel == null) {
      channel = client!.privateChannel(
        fullChannel,
        authorizationDelegate: EndpointAuthorizableChannelTokenAuthorizationDelegate.forPrivateChannel(
          authorizationEndpoint: Uri.parse('${ApiService.baseUrl}/broadcasting/auth'),
          headers: {
            'Authorization': 'Bearer $_token',
            'Accept': 'application/json',
          },
        ),
      );
      _channels[fullChannel] = channel;
      channel.subscribeIfNotUnsubscribed();
      
      // DEBUG: Listen to ALL events on this channel to see what Laravel is sending
      channel.bindToAll().listen((event) {
        print('====== WEBSOCKET EVENT RECEIVED ======');
        print('Channel: ${event.channelName}');
        print('Event Name: ${event.name}');
        print('Event Data: ${event.data}');
        print('======================================');
      });
    }

    final key = '$fullChannel:$eventName';
    _eventSubs[key] = channel.bind(eventName).listen((event) {
      dynamic data = event.data;
      if (data is String) {
        try {
          data = jsonDecode(data);
        } catch (_) {}
      }
      callback(data);
    });
  }

  void leaveChannel(String channelName) {
    final fullChannel = channelName.startsWith('private-') ? channelName : 'private-$channelName';
    _channels[fullChannel]?.unsubscribe();
    _channels.remove(fullChannel);

    _eventSubs.removeWhere((key, sub) {
      if (key.startsWith('$fullChannel:')) {
        sub.cancel();
        return true;
      }
      return false;
    });
  }

  void disconnect() {
    _connectionSub?.cancel();
    for (final sub in _eventSubs.values) {
      sub.cancel();
    }
    _eventSubs.clear();
    for (final channel in _channels.values) {
      channel.unsubscribe();
    }
    _channels.clear();
    client?.dispose();
    client = null;
    _token = null;
  }
}
