import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:google_fonts/google_fonts.dart';
import 'login_screen.dart';
import 'manage_categories_screen.dart';
import 'manage_services_screen.dart';
import 'manage_team_screen.dart';
import 'admin_profile_screen.dart';

class AdminDashboardScreen extends StatefulWidget {
  const AdminDashboardScreen({super.key});

  @override
  State<AdminDashboardScreen> createState() => _AdminDashboardScreenState();
}

class _AdminDashboardScreenState extends State<AdminDashboardScreen> {
  final SupabaseClient _supabase = Supabase.instance.client;
  int _totalAppointments = 0;
  int _totalServices = 0;
  int _totalStaff = 0;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchStats();
  }

  Future<void> _fetchStats() async {
    setState(() => _isLoading = true);
    try {
      final apptCount = await _supabase.from('appointments').count();
      final serviceCount = await _supabase.from('services').count();
      final staffCount = await _supabase.from('employees').count();

      setState(() {
        _totalAppointments = apptCount;
        _totalServices = serviceCount;
        _totalStaff = staffCount;
        _isLoading = false;
      });
    } catch (e) {
      debugPrint('Error fetching stats: $e');
      setState(() => _isLoading = false);
    }
  }

  Future<void> _signOut() async {
    await _supabase.auth.signOut();
    if (mounted) {
      Navigator.of(context).pushAndRemoveUntil(
        MaterialPageRoute(builder: (context) => const LoginScreen()),
        (route) => false,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: Text('Admin Dashboard', style: GoogleFonts.outfit(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        foregroundColor: const Color(0xFF98635A),
        elevation: 0,
        actions: [
          IconButton(icon: const Icon(Icons.refresh), onPressed: _fetchStats),
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: _signOut,
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: Color(0xFF98635A)))
          : SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                   Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF98635A), Color(0xFFB8867E)],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(24),
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFF98635A).withOpacity(0.3),
                          blurRadius: 20,
                          offset: const Offset(0, 10),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Business Health',
                          style: GoogleFonts.outfit(color: Colors.white.withOpacity(0.8), fontSize: 14, fontWeight: FontWeight.w500),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Growing Steady',
                          style: GoogleFonts.outfit(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 16),
                        Row(
                          children: [
                            const Icon(Icons.trending_up, color: Colors.white, size: 20),
                            const SizedBox(width: 8),
                            Text(
                              'Data synced with Web',
                              style: GoogleFonts.outfit(color: Colors.white.withOpacity(0.9), fontSize: 12),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 32),
                  Text(
                    'Key Metrics',
                    style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.bold, color: const Color(0xFF98635A)),
                  ),
                  const SizedBox(height: 16),
                  _buildStatGrid(),
                  const SizedBox(height: 32),
                  Text(
                    'Quick Actions',
                    style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.bold, color: const Color(0xFF98635A)),
                  ),
                  const SizedBox(height: 16),
                  _buildQuickAction(
                    icon: Icons.calendar_today,
                    title: 'New Appointment',
                    subtitle: 'Manually add a booking',
                    onTap: () {},
                  ),
                  const SizedBox(height: 12),
                  _buildQuickAction(
                    icon: Icons.category,
                    title: 'Manage Categories',
                    subtitle: 'Add or remove service categories',
                    onTap: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(builder: (context) => const ManageCategoriesScreen()),
                      );
                    },
                  ),
                  const SizedBox(height: 12),
                  _buildQuickAction(
                    icon: Icons.add_business,
                    title: 'Add Service',
                    subtitle: 'Create a new beauty treatment',
                    onTap: () {},
                  ),
                ],
              ),
            ),
    );
  }

  Widget _buildStatGrid() {
    return GridView.count(
      crossAxisCount: 2,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      mainAxisSpacing: 16,
      crossAxisSpacing: 16,
      childAspectRatio: 1.3,
      children: [
        _buildStatCard('Bookings', _totalAppointments.toString(), Icons.event),
        _buildStatCard('Services', _totalServices.toString(), Icons.spa),
        _buildStatCard('Team', _totalStaff.toString(), Icons.people_alt),
        _buildStatCard('Income', '£--', Icons.payments),
      ],
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFF5DFD6)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.03),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(color: const Color(0xFFF5DFD6), borderRadius: BorderRadius.circular(10)),
            child: Icon(icon, color: const Color(0xFF98635A), size: 18),
          ),
          const SizedBox(height: 12),
          Text(value, style: GoogleFonts.outfit(fontSize: 22, fontWeight: FontWeight.bold, color: Colors.black)),
          Text(title, style: GoogleFonts.outfit(fontSize: 12, color: Colors.grey[600], fontWeight: FontWeight.w500)),
        ],
      ),
    );
  }

  Widget _buildQuickAction({required IconData icon, required String title, required String subtitle, required VoidCallback onTap}) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: const Color(0xFFF9F5F4),
          borderRadius: BorderRadius.circular(16),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12)),
              child: Icon(icon, color: const Color(0xFF98635A)),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: GoogleFonts.outfit(fontWeight: FontWeight.bold, fontSize: 16)),
                  Text(subtitle, style: GoogleFonts.outfit(fontSize: 12, color: Colors.grey[600])),
                ],
              ),
            ),
            const Icon(Icons.chevron_right, color: Colors.grey, size: 20),
          ],
        ),
      ),
    );
  }
}
