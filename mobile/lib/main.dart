import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'supabase_config.dart';
import 'screens/login_screen.dart';
import 'screens/admin_main_screen.dart';
import 'screens/user_main_screen.dart';
import 'screens/booking_home_screen.dart';
import 'service_selection_screen.dart';

import 'package:flutter_stripe/flutter_stripe.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await SupabaseConfig.init();
  
  // Initialize Stripe
  Stripe.publishableKey = 'pk_live_51PTOw8FuIf3H6zI1LLVNqfpyRU30iXCYkvzkXhES8jv59eHcuMudipRszhxBXYLKYoE9O4EhL4VfTRAjb8dlpvxg00Z7NMdNPT';
  await Stripe.instance.applySettings();
  
  runApp(const MaisonDePoupeeApp());
}

class MaisonDePoupeeApp extends StatelessWidget {
  const MaisonDePoupeeApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Maison de poupée',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.light,
        primaryColor: const Color(0xFF98635A),
        scaffoldBackgroundColor: Colors.white,
        textTheme: GoogleFonts.outfitTextTheme(ThemeData.light().textTheme).copyWith(
          displayLarge: const TextStyle(fontFamily: 'Snell Roundhand', fontSize: 24, fontWeight: FontWeight.normal, letterSpacing: -0.5),
          displayMedium: const TextStyle(fontFamily: 'Snell Roundhand', fontSize: 20, fontWeight: FontWeight.normal, letterSpacing: -0.4),
          titleLarge: const TextStyle(fontFamily: 'Snell Roundhand', fontSize: 18, fontWeight: FontWeight.normal, letterSpacing: -0.3),
          bodyLarge: GoogleFonts.outfit(fontSize: 14, letterSpacing: -0.1),
          bodyMedium: GoogleFonts.outfit(fontSize: 12, letterSpacing: -0.1),
        ),
        colorScheme: const ColorScheme.light(
          primary: Color(0xFF98635A),
          secondary: Color(0xFFF5DFD6),
          surface: Colors.white,
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            elevation: 0,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            textStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, letterSpacing: 0.5),
          ),
        ),
      ),
      home: const AuthGate(),
    );
  }
}

class AuthGate extends StatefulWidget {
  const AuthGate({super.key});

  @override
  State<AuthGate> createState() => _AuthGateState();
}

class _AuthGateState extends State<AuthGate> {
  final SupabaseClient _supabase = Supabase.instance.client;
  bool _isLoading = true;
  bool _isInit = false;

  @override
  void initState() {
    super.initState();
    _checkAuth();
  }

  Future<void> _checkAuth() async {
    final session = _supabase.auth.currentSession;
    if (session != null) {
      // Logic for existing session
    }
    await Future.delayed(const Duration(milliseconds: 500)); // Simulating splash
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator(color: Color(0xFF98635A))),
      );
    }
    
    final session = _supabase.auth.currentSession;
    
    // If no session, go to Login
    if (session == null) {
      return const LoginScreen();
    }
    
    // Simple logic: Check email domain for admin
    // In production, fetch 'role' from profiles table
    final email = session.user.email ?? '';
    if (email.endsWith('@maisondepoupee.com') || 
        email == 'admin@maisondepoupee.com') {
      return const AdminMainScreen();
    }

    // Default to Customer Main (with Tabs)
    return const UserMainScreen();
  }
}

