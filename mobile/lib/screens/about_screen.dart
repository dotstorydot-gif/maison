import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:video_player/video_player.dart';

class AboutScreen extends StatefulWidget {
  const AboutScreen({super.key});

  @override
  State<AboutScreen> createState() => _AboutScreenState();
}

class _AboutScreenState extends State<AboutScreen> {
  late VideoPlayerController _controller;

  @override
  void initState() {
    super.initState();
    _controller = VideoPlayerController.networkUrl(
      Uri.parse('https://maisondepoupee.co.uk/wp-content/uploads/2024/10/Walkthrough.mp4'),
    )..initialize().then((_) {
        setState(() {});
        _controller.setLooping(true);
        _controller.setVolume(0);
        _controller.play();
      });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('About Us', style: GoogleFonts.outfit(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        foregroundColor: const Color(0xFF98635A),
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (_controller.value.isInitialized)
              AspectRatio(
                aspectRatio: 9 / 16, // Force portrait ratio for the walkthrough video
                child: Container(
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(20),
                    color: Colors.black,
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFF98635A).withOpacity(0.1),
                        blurRadius: 20,
                        offset: const Offset(0, 10),
                      ),
                    ],
                  ),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(20),
                    child: FittedBox(
                      fit: BoxFit.cover,
                      child: SizedBox(
                        width: _controller.value.size.width,
                        height: _controller.value.size.height,
                        child: VideoPlayer(_controller),
                      ),
                    ),
                  ),
                ),
              )
            else
              const AspectRatio(
                aspectRatio: 9 / 16,
                child: Center(child: CircularProgressIndicator(color: Color(0xFF98635A))),
              ),
            const SizedBox(height: 24),
            Text(
              'Where Beauty Meets Empowerment.',
              style: GoogleFonts.outfit(fontSize: 24, fontWeight: FontWeight.bold, color: const Color(0xFF98635A)),
            ),
            const SizedBox(height: 16),
            Text(
              'Welcome to Maison de Poupeé ~ where beauty meets empowerment, and every woman is treated like royalty. From head to toe, we offer everything you need to glow with confidence, from expert hair styling and skincare to flawless nails and luxurious body treatments.',
              style: GoogleFonts.outfit(fontSize: 16, height: 1.5, color: Colors.grey[800]),
            ),
            const SizedBox(height: 16),
            Text(
              'Our team of specialists in every department is dedicated to bringing out your unique beauty with personalized care and top-quality treatments. Step into our dollhouse of elegance and walk out feeling like the princess you truly are.',
              style: GoogleFonts.outfit(fontSize: 16, height: 1.5, color: Colors.grey[800]),
            ),
            const SizedBox(height: 24),
            Text(
              '“ Because at Maison de Poupeé, beauty isn’t just a service ~ it’s an experience designed to make you feel unstoppable! ”',
              style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.bold, fontStyle: FontStyle.italic, color: const Color(0xFF98635A)),
            ),
          ],
        ),
      ),
    );
  }
}
