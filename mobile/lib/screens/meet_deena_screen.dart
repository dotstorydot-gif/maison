import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class MeetDeenaScreen extends StatelessWidget {
  const MeetDeenaScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Meet Deena', style: GoogleFonts.outfit(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        foregroundColor: const Color(0xFF98635A),
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Container(
              height: 240,
              width: 240,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(40),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFF98635A).withOpacity(0.1),
                    blurRadius: 30,
                    offset: const Offset(0, 15),
                  ),
                ],
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(40),
                child: Image.asset(
                  'assets/deena.png',
                  fit: BoxFit.cover,
                  alignment: const Alignment(0, -0.6), // Shift up to avoid cropping head
                ),
              ),
            ),
            const SizedBox(height: 32),
            Text(
              'Deena Osman',
              style: GoogleFonts.outfit(fontSize: 32, fontWeight: FontWeight.bold, color: const Color(0xFF98635A)),
            ),
            Text(
              'Founder',
              style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.w500, color: Colors.grey[600]),
            ),
            const SizedBox(height: 32),
            Text(
              '“Living in London my whole life, I have struggled to find a one-stop shop where I can get all of my treatments done which has a luxurious atmosphere and professional experienced team. I therefore developed a passion for all things beauty and have taken it upon myself to achieve this dream so that other women can have this opportunity.”',
              textAlign: TextAlign.center,
              style: GoogleFonts.outfit(fontSize: 16, height: 1.6, color: Colors.grey[800], fontStyle: FontStyle.italic),
            ),
            const SizedBox(height: 16),
            Text(
              '“Our aim is to also build a community where it feels like home, where our clients needs are met and they can feel empowered, confident, and healthy.”',
              textAlign: TextAlign.center,
              style: GoogleFonts.outfit(fontSize: 16, height: 1.6, color: Colors.grey[800]),
            ),
          ],
        ),
      ),
    );
  }
}
