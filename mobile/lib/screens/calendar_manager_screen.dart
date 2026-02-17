import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:google_fonts/google_fonts.dart';

class CalendarManagerScreen extends StatefulWidget {
  const CalendarManagerScreen({super.key});

  @override
  State<CalendarManagerScreen> createState() => _CalendarManagerScreenState();
}

class _CalendarManagerScreenState extends State<CalendarManagerScreen> {
  final SupabaseClient _supabase = Supabase.instance.client;
  List<Map<String, dynamic>> _appointments = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchAppointments();
  }

  Future<void> _fetchAppointments() async {
    setState(() => _isLoading = true);
    try {
      // Joining with services and employees to get names
      final data = await _supabase
          .from('appointments')
          .select('*, services(name), employees(full_name)')
          .order('start_time', ascending: false);
      
      setState(() {
        _appointments = List<Map<String, dynamic>>.from(data);
        _isLoading = false;
      });
    } catch (e) {
      debugPrint('Error fetching appointments: $e');
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Calendar', style: GoogleFonts.outfit(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        foregroundColor: const Color(0xFF98635A),
        actions: [
          IconButton(icon: const Icon(Icons.refresh), onPressed: _fetchAppointments),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: Color(0xFF98635A)))
          : RefreshIndicator(
              onRefresh: _fetchAppointments,
              child: ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: _appointments.length,
                itemBuilder: (context, index) {
                  final apt = _appointments[index];
                  final serviceName = apt['services']?['name'] ?? 'Unknown Service';
                  final staffName = apt['employees']?['full_name'] ?? 'Unassigned';
                  final startTime = DateTime.parse(apt['start_time']).toLocal();

                  return Card(
                    elevation: 0,
                    color: const Color(0xFFF9F5F4),
                    margin: const EdgeInsets.only(bottom: 12),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    child: ListTile(
                      contentPadding: const EdgeInsets.all(16),
                      title: Text(apt['customer_name'] ?? 'Guest', style: GoogleFonts.outfit(fontWeight: FontWeight.bold)),
                      subtitle: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('$serviceName with $staffName', style: GoogleFonts.outfit(color: Colors.grey[700])),
                          const SizedBox(height: 4),
                          Text(
                            '${startTime.day}/${startTime.month} at ${startTime.hour}:${startTime.minute.toString().padLeft(2, '0')}',
                            style: GoogleFonts.outfit(fontWeight: FontWeight.w600, color: const Color(0xFF98635A)),
                          ),
                        ],
                      ),
                      trailing: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: Colors.green.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          apt['status'].toString().toUpperCase(),
                          style: const TextStyle(color: Colors.green, fontSize: 10, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
    );
  }
}
