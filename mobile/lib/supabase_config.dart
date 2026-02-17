import 'package:supabase_flutter/supabase_flutter.dart';

class SupabaseConfig {
  static const String url = 'https://ooteiuhrbkemrsgdmtwr.supabase.co';
  static const String anonKey = 'sb_publishable_P3iLgLeUS8oXYJELrJHVeA_qFfrBtRX';

  static Future<void> init() async {
    await Supabase.initialize(
      url: url,
      anonKey: anonKey,
    );
  }

  static SupabaseClient get client => Supabase.instance.client;
}
