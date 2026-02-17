import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';

class ContactScreen extends StatelessWidget {
  const ContactScreen({super.key});

  Future<void> _launchUrl(String url) async {
    if (!await launchUrl(Uri.parse(url))) {
      throw Exception('Could not launch $url');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: Text('CONTACT US', style: GoogleFonts.outfit(fontWeight: FontWeight.bold, letterSpacing: 2)),
        centerTitle: true,
        backgroundColor: Colors.white,
        elevation: 0,
        foregroundColor: const Color(0xFF98635A),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 20),
            _buildContactItem(
              icon: Icons.location_on_outlined,
              title: 'LOCATION',
              value: 'Mayfair, London, United Kingdom',
              onTap: () => _launchUrl('https://maps.google.com/?q=Mayfair,London'),
            ),
            const SizedBox(height: 32),
            _buildContactItem(
              icon: Icons.phone_outlined,
              title: 'PHONE',
              value: '+44 (0) 20 1234 5678',
              onTap: () => _launchUrl('tel:+442012345678'),
            ),
            const SizedBox(height: 32),
            _buildContactItem(
              icon: Icons.mail_outline,
              title: 'EMAIL',
              value: 'contact@maisondepoupee.co.uk',
              onTap: () => _launchUrl('mailto:contact@maisondepoupee.co.uk'),
            ),
            const SizedBox(height: 48),
            Text(
              'SOCIALS',
              style: GoogleFonts.outfit(
                fontSize: 12,
                fontWeight: FontWeight.bold,
                letterSpacing: 2,
                color: const Color(0xFF98635A).withOpacity(0.5),
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                _buildSocialButton(
                  'Instagram',
                  'https://www.instagram.com/deena.osmann/',
                  Icons.camera_alt_outlined,
                ),
                const SizedBox(width: 12),
                _buildSocialButton(
                  'TikTok',
                  'https://www.tiktok.com/@deenaosmannn',
                  Icons.music_note_outlined,
                ),
              ],
            ),
            const SizedBox(height: 60),
            Container(
              padding: const EdgeInsets.all(32),
              decoration: BoxDecoration(
                color: const Color(0xFFF5DFD6).withOpacity(0.3),
                borderRadius: BorderRadius.circular(32),
              ),
              child: Column(
                children: [
                  Text(
                    'MAISON DE POUPÉE',
                    style: GoogleFonts.outfit(
                      fontWeight: FontWeight.bold,
                      letterSpacing: 4,
                      color: const Color(0xFF98635A),
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Where beauty meets empowerment',
                    style: GoogleFonts.outfit(
                      fontSize: 12,
                      fontStyle: FontStyle.italic,
                      color: const Color(0xFF98635A).withOpacity(0.6),
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

  Widget _buildContactItem({
    required IconData icon,
    required String title,
    required String value,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Row(
        children: [
          Container(
            width: 56,
            height: 56,
            decoration: BoxDecoration(
              color: const Color(0xFFF5DFD6).withOpacity(0.5),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Icon(icon, color: const Color(0xFF98635A)),
          ),
          const SizedBox(width: 20),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: GoogleFonts.outfit(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 2,
                    color: const Color(0xFF98635A).withOpacity(0.5),
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  value,
                  style: GoogleFonts.outfit(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: const Color(0xFF98635A),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSocialButton(String label, String url, IconData icon) {
    return Expanded(
      child: GestureDetector(
        onTap: () => _launchUrl(url),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 16),
          decoration: BoxDecoration(
            border: Border.all(color: const Color(0xFFF5DFD6)),
            borderRadius: BorderRadius.circular(16),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, size: 18, color: const Color(0xFF98635A)),
              const SizedBox(width: 8),
              Text(
                label,
                style: GoogleFonts.outfit(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  color: const Color(0xFF98635A),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
