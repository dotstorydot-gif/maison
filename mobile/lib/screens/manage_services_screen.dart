import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:google_fonts/google_fonts.dart';

class ManageServicesScreen extends StatefulWidget {
  const ManageServicesScreen({super.key});

  @override
  State<ManageServicesScreen> createState() => _ManageServicesScreenState();
}

class _ManageServicesScreenState extends State<ManageServicesScreen> {
  final SupabaseClient _supabase = Supabase.instance.client;
  List<Map<String, dynamic>> _services = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchServices();
  }

  Future<void> _fetchServices() async {
    setState(() => _isLoading = true);
    try {
      final data = await _supabase.from('services').select('*').order('name');
      setState(() {
        _services = List<Map<String, dynamic>>.from(data);
        _isLoading = false;
      });
    } catch (e) {
      debugPrint('Error fetching services: $e');
      setState(() => _isLoading = false);
    }
  }

  Future<void> _upsertService([Map<String, dynamic>? service]) async {
    final nameController = TextEditingController(text: service?['name']);
    final priceController = TextEditingController(text: service?['price']?.toString());
    final durationController = TextEditingController(text: service?['duration']?.toString());
    final descriptionController = TextEditingController(text: service?['description']);
    String? selectedCategoryId = service?['category_id']?.toString();

    // Fetch categories for dropdown
    List<Map<String, dynamic>> categories = [];
    try {
      final data = await _supabase.from('categories').select('*').order('name');
      categories = List<Map<String, dynamic>>.from(data);
    } catch (e) {
      debugPrint('Error fetching categories: $e');
    }

    final bool? confirm = await showDialog<bool>(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          title: Text(service == null ? 'Add Service' : 'Edit Service', style: GoogleFonts.outfit(fontWeight: FontWeight.bold)),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(controller: nameController, decoration: const InputDecoration(labelText: 'Service Name')),
                TextField(controller: priceController, decoration: const InputDecoration(labelText: 'Price (£)'), keyboardType: TextInputType.number),
                TextField(controller: durationController, decoration: const InputDecoration(labelText: 'Duration (min)'), keyboardType: TextInputType.number),
                TextField(controller: descriptionController, decoration: const InputDecoration(labelText: 'Description'), maxLines: 3),
                const SizedBox(height: 16),
                DropdownButtonFormField<String>(
                  value: selectedCategoryId,
                  hint: const Text('Select Category'),
                  items: categories.map((cat) => DropdownMenuItem(
                    value: cat['id'].toString(),
                    child: Text(cat['name']),
                  )).toList(),
                  onChanged: (val) => setDialogState(() => selectedCategoryId = val),
                  decoration: const InputDecoration(labelText: 'Category'),
                ),
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
      ),
    );

    if (confirm == true) {
      final newService = {
        'name': nameController.text,
        'price': double.tryParse(priceController.text) ?? 0.0,
        'duration': int.tryParse(durationController.text) ?? 30,
        'description': descriptionController.text,
        'category_id': selectedCategoryId,
      };

      try {
        if (service == null) {
          await _supabase.from('services').insert(newService);
        } else {
          await _supabase.from('services').update(newService).eq('id', service['id']);
        }
        _fetchServices();
      } catch (e) {
        debugPrint('Error saving service: $e');
      }
    }
  }

  Future<void> _deleteService(String id) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Service?'),
        content: const Text('This will permanently remove this service.'),
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
        await _supabase.from('services').delete().eq('id', id);
        _fetchServices();
      } catch (e) {
        debugPrint('Error deleting service: $e');
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Manage Services', style: GoogleFonts.outfit(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        foregroundColor: const Color(0xFF98635A),
        actions: [
          IconButton(icon: const Icon(Icons.refresh), onPressed: _fetchServices),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: Color(0xFF98635A)))
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _services.length,
              itemBuilder: (context, index) {
                final service = _services[index];
                return Card(
                  elevation: 0,
                  color: const Color(0xFFF9F5F4),
                  margin: const EdgeInsets.only(bottom: 12),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  child: ListTile(
                    contentPadding: const EdgeInsets.all(16),
                    title: Text(service['name'], style: GoogleFonts.outfit(fontWeight: FontWeight.bold, fontSize: 16)),
                    subtitle: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const SizedBox(height: 4),
                        Text('£${service['price']} • ${service['duration']} min', style: GoogleFonts.outfit(color: Colors.grey[700])),
                        if (service['description'] != null) ...[
                          const SizedBox(height: 4),
                          Text(service['description'], style: GoogleFonts.outfit(fontSize: 12, color: Colors.grey[600]), maxLines: 2, overflow: TextOverflow.ellipsis),
                        ],
                      ],
                    ),
                    trailing: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        IconButton(icon: const Icon(Icons.edit, color: Colors.blue), onPressed: () => _upsertService(service)),
                        IconButton(icon: const Icon(Icons.delete, color: Colors.red), onPressed: () => _deleteService(service['id'])),
                      ],
                    ),
                  ),
                );
              },
            ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _upsertService(),
        backgroundColor: const Color(0xFF98635A),
        child: const Icon(Icons.add, color: Colors.white),
      ),
    );
  }
}
