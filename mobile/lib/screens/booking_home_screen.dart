import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../service_selection_screen.dart';

class BookingHomeScreen extends StatelessWidget {
  const BookingHomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Image.asset(
              'assets/logox.png',
              height: 180,
              errorBuilder: (context, error, stackTrace) => Container(),
            ),
            const SizedBox(height: 10),
            Text(
              'Maison DE POUPÉE',
              style: GoogleFonts.outfit(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                letterSpacing: -1,
                color: const Color(0xFF98635A),
              ),
            ),
            const SizedBox(height: 20),
            const Text(
              'Elegance in Every Detail',
              style: TextStyle(
                color: Color(0x8098635A), // 0.5 opacity of 0xFF98635A
                fontSize: 11, 
                fontWeight: FontWeight.bold, 
                letterSpacing: 2,
              ),
            ),
            const SizedBox(height: 40),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 40),
              child: Row(
                children: [
                  Expanded(
                    child: _buildBookingButton(
                      context,
                      title: 'INDIVIDUAL',
                      isGroup: false,
                      icon: Icons.person_outline,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: _buildBookingButton(
                      context,
                      title: 'GROUP',
                      isGroup: true,
                      icon: Icons.groups_outlined,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBookingButton(BuildContext context, {required String title, required bool isGroup, required IconData icon}) {
    return ElevatedButton(
      onPressed: () {
        Navigator.of(context).push(
          MaterialPageRoute(
            builder: (context) => ServiceSelectionScreen(isGroup: isGroup),
          ),
        );
      },
      style: ElevatedButton.styleFrom(
        backgroundColor: const Color(0xFF98635A),
        foregroundColor: Colors.white,
        padding: const EdgeInsets.symmetric(vertical: 24),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
        ),
        elevation: 0,
      ),
      child: Column(
        children: [
          Icon(icon, size: 24),
          const SizedBox(height: 8),
          Text(title, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w900, letterSpacing: 1)),
        ],
      ),
    );
  }
}
