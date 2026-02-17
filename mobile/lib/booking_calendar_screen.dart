import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import 'payment_selection_screen.dart';

class BookingCalendarScreen extends StatefulWidget {
  final List<Map<String, dynamic>> services;
  const BookingCalendarScreen({super.key, required this.services});

  @override
  State<BookingCalendarScreen> createState() => _BookingCalendarScreenState();
}

class _BookingCalendarScreenState extends State<BookingCalendarScreen> {
  DateTime selectedDate = DateTime.now();
  String? selectedTime;

  final List<String> timeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM",
    "05:00 PM", "06:00 PM", "07:00 PM"
  ];

  @override
  Widget build(BuildContext context) {
    final serviceNames = widget.services.map((s) => s['name']).join(', ');
    
    return Scaffold(
      appBar: AppBar(
        title: Text('Select Date & Time', style: GoogleFonts.outfit(color: const Color(0xFF98635A), fontWeight: FontWeight.bold)),
        centerTitle: true,
        backgroundColor: Colors.white,
        elevation: 0,
        iconTheme: const IconThemeData(color: Color(0xFF98635A)),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Booking for: $serviceNames',
              style: GoogleFonts.outfit(
                fontSize: 18,
                color: const Color(0xFF98635A),
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 32),
            
            // Date Picker (Interactive Calendar)
            Text('Pick a Date', style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.w600, color: const Color(0xFF98635A))),
            const SizedBox(height: 16),
            Theme(
              data: Theme.of(context).copyWith(
                colorScheme: const ColorScheme.light(
                  primary: Color(0xFF98635A),
                  onPrimary: Colors.white,
                  onSurface: Color(0xFF98635A),
                ),
              ),
              child: Container(
                decoration: BoxDecoration(
                  color: const Color(0xFFF5DFD6).withOpacity(0.2),
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: const Color(0xFF98635A).withOpacity(0.1)),
                ),
                child: CalendarDatePicker(
                  initialDate: selectedDate,
                  firstDate: DateTime.now(),
                  lastDate: DateTime.now().add(const Duration(days: 30)),
                  onDateChanged: (date) => setState(() => selectedDate = date),
                ),
              ),
            ),
            
            const SizedBox(height: 32),
            
            // Time Slots
            Text('Available Slots', style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.w600, color: const Color(0xFF98635A))),
            const SizedBox(height: 16),
            GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 3,
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
                childAspectRatio: 2.2,
              ),
              itemCount: timeSlots.length,
              itemBuilder: (context, index) {
                final time = timeSlots[index];
                final isSelected = selectedTime == time;
                return InkWell(
                  onTap: () => setState(() => selectedTime = time),
                  child: Container(
                    decoration: BoxDecoration(
                      color: isSelected ? const Color(0xFF98635A) : const Color(0xFFF5DFD6).withOpacity(0.3),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: isSelected ? const Color(0xFF98635A) : const Color(0xFF98635A).withOpacity(0.1),
                      ),
                    ),
                    alignment: Alignment.center,
                    child: Text(
                      time,
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                        color: isSelected ? Colors.white : const Color(0xFF98635A).withOpacity(0.6),
                      ),
                    ),
                  ),
                );
              },
            ),
            
            const SizedBox(height: 48),
            
            // Action Button
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: selectedTime == null ? null : () {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (context) => PaymentSelectionScreen(
                        bookingDetails: {
                          'services': widget.services,
                          'date': DateFormat('yyyy-MM-dd').format(selectedDate),
                          'time': selectedTime,
                        },
                      ),
                    ),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF98635A),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 20),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                  disabledBackgroundColor: const Color(0xFF98635A).withOpacity(0.3),
                  elevation: 0,
                ),
                child: Text(
                  'Continue to Payment',
                  style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.bold),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
