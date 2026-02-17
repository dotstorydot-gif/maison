import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:google_fonts/google_fonts.dart';
import 'login_screen.dart';

class AdminProfileScreen extends StatelessWidget {
  const AdminProfileScreen({super.key});

  Future<void> _signOut(BuildContext context) async {
    await Supabase.instance.client.auth.signOut();
    if (context.mounted) {
       Navigator.of(context).pushAndRemoveUntil(
        MaterialPageRoute(builder: (context) => const LoginScreen()),
        (route) => false,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final user = Supabase.instance.client.auth.currentUser;
    final email = user?.email ?? 'Admin';

    return Scaffold(
      appBar: AppBar(
        title: Text('Admin Profile', style: GoogleFonts.outfit(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        foregroundColor: const Color(0xFF98635A),
        elevation: 0,
      ),
      body: ListView(
        padding: const EdgeInsets.all(24),
        children: [
          const Center(
            child: CircleAvatar(
              radius: 50,
              backgroundColor: Color(0xFF98635A),
              child: Icon(Icons.admin_panel_settings, size: 50, color: Colors.white),
            ),
          ),
          const SizedBox(height: 24),
          Center(
            child: Column(
              children: [
                Text(
                  'Administrator',
                  style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.bold, color: const Color(0xFF98635A)),
                ),
                Text(
                  email,
                  style: GoogleFonts.outfit(fontSize: 14, color: Colors.grey[600]),
                ),
              ],
            ),
          ),
          const SizedBox(height: 40),
          _buildAdminTile(
            icon: Icons.business,
            title: 'Business Info',
            onTap: () {},
          ),
          _buildAdminTile(
            icon: Icons.notifications_active,
            title: 'Notification Settings',
            onTap: () {},
          ),
          _buildAdminTile(
            icon: Icons.security,
            title: 'Security & Permissions',
            onTap: () {},
          ),
          const Divider(height: 48),
          ListTile(
            leading: const Icon(Icons.logout, color: Color(0xFF98635A)),
            title: Text('Sign Out', style: GoogleFonts.outfit(fontWeight: FontWeight.bold, color: const Color(0xFF98635A))),
            onTap: () => _signOut(context),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
              side: const BorderSide(color: Color(0xFFF5DFD6)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAdminTile({required IconData icon, required String title, required VoidCallback onTap}) {
    return ListTile(
      leading: Icon(icon, color: Colors.grey[700]),
      title: Text(title, style: GoogleFonts.outfit(fontWeight: FontWeight.w500)),
      trailing: const Icon(Icons.chevron_right),
      onTap: onTap,
    );
  }
}
