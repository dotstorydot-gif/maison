import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:google_fonts/google_fonts.dart';

class ManageTeamScreen extends StatefulWidget {
  const ManageTeamScreen({super.key});

  @override
  State<ManageTeamScreen> createState() => _ManageTeamScreenState();
}

class _ManageTeamScreenState extends State<ManageTeamScreen> {
  final SupabaseClient _supabase = Supabase.instance.client;
  List<Map<String, dynamic>> _employees = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchEmployees();
  }

  Future<void> _fetchEmployees() async {
    setState(() => _isLoading = true);
    try {
      final data = await _supabase.from('employees').select('*').order('full_name');
      setState(() {
        _employees = List<Map<String, dynamic>>.from(data);
        _isLoading = false;
      });
    } catch (e) {
      debugPrint('Error fetching employees: $e');
      setState(() => _isLoading = false);
    }
  }

  Future<void> _upsertEmployee([Map<String, dynamic>? employee]) async {
    final nameController = TextEditingController(text: employee?['full_name']);
    final roleController = TextEditingController(text: employee?['role']);
    final emailController = TextEditingController(text: employee?['email']);

    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(employee == null ? 'Add Staff' : 'Edit Staff', style: GoogleFonts.outfit(fontWeight: FontWeight.bold)),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(controller: nameController, decoration: const InputDecoration(labelText: 'Full Name')),
              TextField(controller: roleController, decoration: const InputDecoration(labelText: 'Role (e.g. Senior Artist)')),
              TextField(controller: emailController, decoration: const InputDecoration(labelText: 'Email')),
            ],
          ),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Cancel')),
          ElevatedButton(
            onPressed: () => Navigator.pop(context, true),
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF98635A), foregroundColor: Colors.white),
            child: const Text('Save'),
          ),
        ],
      ),
    );

    if (confirm == true) {
      final newEmployee = {
        'full_name': nameController.text,
        'role': roleController.text,
        'email': emailController.text,
      };

      try {
        if (employee == null) {
          await _supabase.from('employees').insert(newEmployee);
        } else {
          await _supabase.from('employees').update(newEmployee).eq('id', employee['id']);
        }
        _fetchEmployees();
      } catch (e) {
        debugPrint('Error saving employee: $e');
      }
    }
  }

  Future<void> _deleteEmployee(String id) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Staff?'),
        content: const Text('This will permanently remove this team member.'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Cancel')),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Delete', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );

    if (confirm == true) {
      try {
        await _supabase.from('employees').delete().eq('id', id);
        _fetchEmployees();
      } catch (e) {
        debugPrint('Error deleting employee: $e');
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Manage Team', style: GoogleFonts.outfit(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        foregroundColor: const Color(0xFF98635A),
        actions: [
          IconButton(icon: const Icon(Icons.refresh), onPressed: _fetchEmployees),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: Color(0xFF98635A)))
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _employees.length,
              itemBuilder: (context, index) {
                final emp = _employees[index];
                return Card(
                  elevation: 0,
                  color: const Color(0xFFF9F5F4),
                  margin: const EdgeInsets.only(bottom: 12),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  child: ListTile(
                    contentPadding: const EdgeInsets.all(16),
                    leading: CircleAvatar(
                      backgroundColor: const Color(0xFF98635A).withOpacity(0.1),
                      child: Text(emp['full_name'][0], style: const TextStyle(color: Color(0xFF98635A))),
                    ),
                    title: Text(emp['full_name'], style: GoogleFonts.outfit(fontWeight: FontWeight.bold, fontSize: 16)),
                    subtitle: Text(emp['role'] ?? 'Staff', style: GoogleFonts.outfit(color: Colors.grey[700])),
                    trailing: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        IconButton(icon: const Icon(Icons.edit, color: Colors.blue), onPressed: () => _upsertEmployee(emp)),
                        IconButton(icon: const Icon(Icons.delete, color: Colors.red), onPressed: () => _deleteEmployee(emp['id'])),
                      ],
                    ),
                  ),
                );
              },
            ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _upsertEmployee(),
        backgroundColor: const Color(0xFF98635A),
        child: const Icon(Icons.add, color: Colors.white),
      ),
    );
  }
}
