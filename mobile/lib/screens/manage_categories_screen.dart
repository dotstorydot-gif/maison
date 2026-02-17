import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:google_fonts/google_fonts.dart';

class ManageCategoriesScreen extends StatefulWidget {
  const ManageCategoriesScreen({super.key});

  @override
  State<ManageCategoriesScreen> createState() => _ManageCategoriesScreenState();
}

class _ManageCategoriesScreenState extends State<ManageCategoriesScreen> {
  final SupabaseClient _supabase = Supabase.instance.client;
  List<Map<String, dynamic>> _categories = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchCategories();
  }

  Future<void> _fetchCategories() async {
    setState(() => _isLoading = true);
    try {
      final data = await _supabase.from('categories').select('*').order('name');
      setState(() {
        _categories = List<Map<String, dynamic>>.from(data);
        _isLoading = false;
      });
    } catch (e) {
      debugPrint('Error fetching categories: $e');
      setState(() => _isLoading = false);
    }
  }

  Future<void> _upsertCategory([Map<String, dynamic>? category]) async {
    final nameController = TextEditingController(text: category?['name']);
    final iconController = TextEditingController(text: category?['icon_name'] ?? 'Heart');

    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(category == null ? 'Add Category' : 'Edit Category', style: GoogleFonts.outfit(fontWeight: FontWeight.bold)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(controller: nameController, decoration: const InputDecoration(labelText: 'Category Name')),
            const SizedBox(height: 16),
            DropdownButtonFormField<String>(
              value: iconController.text,
              items: ['Heart', 'Sparkles', 'Scissors', 'Star', 'Zap', 'User']
                  .map((e) => DropdownMenuItem(value: e, child: Text(e)))
                  .toList(),
              onChanged: (val) => iconController.text = val ?? 'Heart',
              decoration: const InputDecoration(labelText: 'Icon Name'),
            ),
          ],
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
      final newCategory = {
        'name': nameController.text,
        'icon_name': iconController.text,
      };

      try {
        if (category == null) {
          await _supabase.from('categories').insert(newCategory);
        } else {
          await _supabase.from('categories').update(newCategory).eq('id', category['id']);
        }
        _fetchCategories();
      } catch (e) {
        debugPrint('Error saving category: $e');
        if (mounted) {
           ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e'), backgroundColor: Colors.red));
        }
      }
    }
  }

  Future<void> _deleteCategory(String id) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Category?'),
        content: const Text('This will remove this category. Note: Services linked to this category may lose their reference.'),
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
        await _supabase.from('categories').delete().eq('id', id);
        _fetchCategories();
      } catch (e) {
        debugPrint('Error deleting category: $e');
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e'), backgroundColor: Colors.red));
        }
      }
    }
  }

  IconData _getIcon(String iconName) {
    switch (iconName) {
      case 'Heart': return Icons.favorite_outline;
      case 'Sparkles': return Icons.auto_awesome_outlined;
      case 'Scissors': return Icons.content_cut_outlined;
      case 'Star': return Icons.star_outline;
      case 'Zap': return Icons.bolt_outlined;
      case 'User': return Icons.person_outline;
      default: return Icons.category_outlined;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Manage Categories', style: GoogleFonts.outfit(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        foregroundColor: const Color(0xFF98635A),
        actions: [
          IconButton(icon: const Icon(Icons.refresh), onPressed: _fetchCategories),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: Color(0xFF98635A)))
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _categories.length,
              itemBuilder: (context, index) {
                final category = _categories[index];
                return Card(
                  elevation: 0,
                  color: const Color(0xFFF9F5F4),
                  margin: const EdgeInsets.only(bottom: 12),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  child: ListTile(
                    contentPadding: const EdgeInsets.all(16),
                    leading: Icon(_getIcon(category['icon_name'] ??''), color: const Color(0xFF98635A)),
                    title: Text(category['name'], style: GoogleFonts.outfit(fontWeight: FontWeight.bold, fontSize: 16)),
                    trailing: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        IconButton(icon: const Icon(Icons.edit, color: Colors.blue), onPressed: () => _upsertCategory(category)),
                        IconButton(icon: const Icon(Icons.delete, color: Colors.red), onPressed: () => _deleteCategory(category['id'])),
                      ],
                    ),
                  ),
                );
              },
            ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _upsertCategory(),
        backgroundColor: const Color(0xFF98635A),
        child: const Icon(Icons.add, color: Colors.white),
      ),
    );
  }
}
