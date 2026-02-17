import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'contact_screen.dart';
import 'about_screen.dart';
import 'meet_deena_screen.dart';
import 'profile_screen.dart';
import 'booking_home_screen.dart';

class UserMainScreen extends StatefulWidget {
  const UserMainScreen({super.key});

  @override
  State<UserMainScreen> createState() => _UserMainScreenState();
}

class _UserMainScreenState extends State<UserMainScreen> {
  int _currentIndex = 0;

  final List<Widget> _screens = [
    Navigator(
      onGenerateRoute: (settings) => MaterialPageRoute(
        builder: (context) => const BookingHomeScreen(),
      ),
    ),
    const AboutScreen(),
    const ContactScreen(),
    const MeetDeenaScreen(),
    const ProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        backgroundColor: Colors.white,
        indicatorColor: const Color(0xFF98635A).withOpacity(0.2),
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.calendar_today_outlined),
            selectedIcon: Icon(Icons.calendar_today, color: Color(0xFF98635A)),
            label: 'Book',
          ),
          NavigationDestination(
            icon: Icon(Icons.info_outline),
            selectedIcon: Icon(Icons.info, color: Color(0xFF98635A)),
            label: 'About',
          ),
          NavigationDestination(
            icon: Icon(Icons.mail_outline),
            selectedIcon: Icon(Icons.mail, color: Color(0xFF98635A)),
            label: 'Contact',
          ),
          NavigationDestination(
            icon: Icon(Icons.auto_awesome_outlined),
            selectedIcon: Icon(Icons.auto_awesome, color: Color(0xFF98635A)),
            label: 'Deena',
          ),
          NavigationDestination(
            icon: Icon(Icons.account_circle_outlined),
            selectedIcon: Icon(Icons.account_circle, color: Color(0xFF98635A)),
            label: 'Profile',
          ),
        ],
      ),
    );
  }
}
