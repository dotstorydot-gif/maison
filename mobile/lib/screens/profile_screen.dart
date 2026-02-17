import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:google_fonts/google_fonts.dart';
import 'login_screen.dart';
import 'user_bookings_screen.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  Future<void> _signOut(BuildContext context) async {
    await Supabase.instance.client.auth.signOut();
    if (context.mounted) {
       Navigator.of(context).pushAndRemoveUntil(
        MaterialPageRoute(builder: (context) => const LoginScreen()),
        (route) => false,
      );
    }
  }

  Future<void> _deleteAccount(BuildContext context) async {
    // Show confirmation dialog
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Account?'),
        content: const Text('This action is irreversible. Are you sure?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Cancel')),
          TextButton(onPressed: () => Navigator.pop(context, true), child: const Text('Delete', style: TextStyle(color: Colors.red))),
        ],
      ),
    );

    if (confirm == true) {
      // In a real app, you might call a specific Edge Function to delete user data safely
      // For now, we sign out as a safety measure or call admin API
      await _signOut(context);
    }
  }

  @override
  Widget build(BuildContext context) {
    final user = Supabase.instance.client.auth.currentUser;
    final email = user?.email ?? 'Guest';

    return Scaffold(
      appBar: AppBar(
        title: Text('Profile', style: GoogleFonts.outfit(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        foregroundColor: const Color(0xFF98635A),
        elevation: 0,
      ),
      body: ListView(
        padding: const EdgeInsets.all(24),
        children: [
          const CircleAvatar(
            radius: 40,
            backgroundColor: Color(0xFFF5DFD6),
            child: Icon(Icons.person, size: 40, color: Color(0xFF98635A)),
          ),
          const SizedBox(height: 16),
          Center(
            child: Text(
              email,
              style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.bold),
            ),
          ),
          const SizedBox(height: 40),
          _buildListTile(
            icon: Icons.history,
            title: 'My Bookings',
            onTap: () {}, // TODO: Navigate to bookings history
          ),
           _buildListTile(
            icon: Icons.settings,
            title: 'App Settings',
            onTap: () {},
          ),
          const Divider(height: 40),
          _buildListTile(
            icon: Icons.logout,
            title: 'Sign Out',
            onTap: () => _signOut(context),
            textColor: const Color(0xFF98635A),
          ),
          _buildListTile(
            icon: Icons.delete_forever,
            title: 'Delete Account',
            onTap: () => _deleteAccount(context),
            textColor: Colors.red,
          ),
        ],
      ),
    );
  }

  Widget _buildListTile({required IconData icon, required String title, required VoidCallback onTap, Color? textColor}) {
    return ListTile(
      leading: Icon(icon, color: textColor ?? Colors.grey[600]),
      title: Text(
        title,
        style: GoogleFonts.outfit(
          fontSize: 16,
          fontWeight: FontWeight.w500,
          color: textColor ?? Colors.black87,
        ),
      ),
      onTap: onTap,
      contentPadding: const EdgeInsets.symmetric(vertical: 4),
      trailing: const Icon(Icons.chevron_right, size: 20),
    );
  }
}
