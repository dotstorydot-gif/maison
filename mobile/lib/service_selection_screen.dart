import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'booking_calendar_screen.dart';

class ServiceSelectionScreen extends StatefulWidget {
  final bool isGroup;
  const ServiceSelectionScreen({super.key, this.isGroup = false});

  @override
  State<ServiceSelectionScreen> createState() => _ServiceSelectionScreenState();
}

class _ServiceSelectionScreenState extends State<ServiceSelectionScreen> {
  String? selectedCategoryId;
  List<Map<String, dynamic>> categories = [];
  List<Map<String, dynamic>> services = [];
  List<Map<String, dynamic>> selectedServices = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchData();
  }

  Future<void> _fetchData() async {
    try {
      final supabase = Supabase.instance.client;
      final catData = await supabase.from('categories').select().order('name');
      final servData = await supabase.from('services').select().order('name');

      setState(() {
        categories = List<Map<String, dynamic>>.from(catData);
        services = List<Map<String, dynamic>>.from(servData);
        if (categories.isNotEmpty) {
          selectedCategoryId = categories[0]['id'];
        }
        isLoading = false;
      });
    } catch (e) {
      debugPrint('Error fetching data: $e');
      setState(() => isLoading = false);
    }
  }

  IconData _getCategoryIcon(String? categoryName) {
    final name = categoryName?.toLowerCase() ?? '';
    if (name.contains('hair')) return Icons.content_cut_outlined;
    if (name.contains('skin') || name.contains('facial')) return Icons.face_retouching_natural_outlined;
    if (name.contains('nail')) return Icons.brush_outlined;
    if (name.contains('body') || name.contains('massage')) return Icons.spa_outlined;
    if (name.contains('eye') || name.contains('lash')) return Icons.remove_red_eye_outlined;
    if (name.contains('makeup')) return Icons.auto_awesome_outlined;
    if (name.contains('wax')) return Icons.water_drop_outlined;
    if (name.contains('brow')) return Icons.remove_red_eye_outlined;
    if (name.contains('aesthetic')) return Icons.medical_services_outlined;
    return Icons.category_outlined;
  }

  IconData _getServiceIcon(String serviceName) {
    final name = serviceName.toLowerCase();
    if (name.contains('cut') || name.contains('style')) return Icons.content_cut;
    if (name.contains('color') || name.contains('dye')) return Icons.palette;
    if (name.contains('wash') || name.contains('blow')) return Icons.air;
    if (name.contains('facial')) return Icons.face;
    if (name.contains('wax')) return Icons.opacity;
    if (name.contains('massage')) return Icons.spa;
    if (name.contains('mani') || name.contains('pedi')) return Icons.dry_cleaning;
    if (name.contains('lash') || name.contains('brow')) return Icons.remove_red_eye;
    return Icons.auto_awesome;
  }

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator(color: Color(0xFF98635A))),
      );
    }

    final filteredServices = services.where((s) => s['category_id'] == selectedCategoryId).toList();

    return Scaffold(
      appBar: AppBar(
        title: Text(widget.isGroup ? 'Group Booking' : 'Maison DE POUPÉE', style: GoogleFonts.outfit(fontWeight: FontWeight.bold, color: const Color(0xFF98635A))),
        centerTitle: true,
        elevation: 0,
        backgroundColor: Colors.white,
        iconTheme: const IconThemeData(color: Color(0xFF98635A)),
      ),
      bottomNavigationBar: selectedServices.isEmpty 
        ? null 
        : Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: Colors.white,
              boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 20, offset: const Offset(0, -5))],
            ),
            child: SafeArea(
              child: Row(
                children: [
                  Expanded(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('${selectedServices.length} Services Selected', style: GoogleFonts.outfit(fontWeight: FontWeight.bold)),
                        Text('Total: £${selectedServices.fold<num>(0, (sum, item) => sum + (item['price'] ?? 0)).toStringAsFixed(2)}', style: GoogleFonts.outfit(color: const Color(0xFF98635A))),
                      ],
                    ),
                  ),
                  ElevatedButton(
                    onPressed: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(
                          builder: (context) => BookingCalendarScreen(services: selectedServices),
                        ),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF98635A),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    ),
                    child: const Text('Continue'),
                  ),
                ],
              ),
            ),
          ),
      body: Row(
        children: [
          // Sidebar Categories
          Container(
            width: 80,
            decoration: BoxDecoration(
              border: Border(right: BorderSide(color: const Color(0xFF98635A).withOpacity(0.05))),
              color: const Color(0xFFF5DFD6).withOpacity(0.05),
            ),
            child: ListView.builder(
              itemCount: categories.length,
              itemBuilder: (context, index) {
                final category = categories[index];
                final isSelected = selectedCategoryId == category['id'];
                return InkWell(
                  onTap: () => setState(() => selectedCategoryId = category['id']),
                  child: Container(
                    height: 80,
                    decoration: BoxDecoration(
                      color: isSelected ? const Color(0xFFF5DFD6) : Colors.transparent,
                      border: isSelected ? const Border(right: BorderSide(color: Color(0xFF98635A), width: 3)) : null,
                    ),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(_getCategoryIcon(category['name']), color: const Color(0xFF98635A).withOpacity(isSelected ? 1.0 : 0.4), size: 24),
                        const SizedBox(height: 4),
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 4.0),
                          child: Text(
                            category['name'],
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                              color: const Color(0xFF98635A).withOpacity(isSelected ? 1.0 : 0.4),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
          
          // Services List
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: filteredServices.length,
              itemBuilder: (context, index) {
                final service = filteredServices[index];
                final isSelected = selectedServices.any((s) => s['id'] == service['id']);
                return InkWell(
                  onTap: () {
                    setState(() {
                      if (isSelected) {
                        selectedServices.removeWhere((s) => s['id'] == service['id']);
                      } else {
                        selectedServices.add(service);
                      }
                    });
                  },
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 16),
                    decoration: BoxDecoration(
                      color: isSelected ? const Color(0xFF98635A).withOpacity(0.05) : Colors.white,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: isSelected ? const Color(0xFF98635A) : const Color(0xFF98635A).withOpacity(0.05)),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(20.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Container(
                                padding: const EdgeInsets.all(10),
                                decoration: BoxDecoration(
                                  color: const Color(0xFF98635A).withOpacity(0.1),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Icon(_getServiceIcon(service['name']), color: const Color(0xFF98635A), size: 24),
                              ),
                              const SizedBox(width: 16),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Expanded(child: Text(service['name'], style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF98635A)))),
                                        Text('£${service['price']}', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: Color(0xFF98635A), letterSpacing: -1)),
                                      ],
                                    ),
                                    const SizedBox(height: 4),
                                    Text(service['description'] ?? '', style: const TextStyle(color: Colors.grey, fontSize: 13), maxLines: 2, overflow: TextOverflow.ellipsis),
                                  ],
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Row(
                                children: [
                                  Icon(Icons.access_time, size: 14, color: const Color(0xFF98635A).withOpacity(0.5)),
                                  const SizedBox(width: 4),
                                  Text('${service['duration']} min', style: TextStyle(fontSize: 12, color: const Color(0xFF98635A).withOpacity(0.5), fontWeight: FontWeight.w500)),
                                ],
                              ),
                              Icon(isSelected ? Icons.check_circle : Icons.add_circle_outline, color: const Color(0xFF98635A), size: 20),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
