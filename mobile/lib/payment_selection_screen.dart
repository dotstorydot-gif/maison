import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_stripe/flutter_stripe.dart';
import 'screens/login_screen.dart';
import 'screens/signup_screen.dart';

class PaymentSelectionScreen extends StatefulWidget {
  final Map<String, dynamic> bookingDetails;
  const PaymentSelectionScreen({super.key, required this.bookingDetails});

  @override
  State<PaymentSelectionScreen> createState() => _PaymentSelectionScreenState();
}

class _PaymentSelectionScreenState extends State<PaymentSelectionScreen> {
  bool isProcessing = false;
  bool isSuccess = false;
  bool _payFullAmount = false; // Default to deposit (50%)
  String? errorMessage;

  Future<void> _handlePayment() async {
    final supabase = Supabase.instance.client;
    final user = supabase.auth.currentUser;

    if (user == null) {
      setState(() => errorMessage = 'Please sign in to continue.');
      return;
    }

    setState(() {
      isProcessing = true;
      errorMessage = null;
    });

    try {
      final services = widget.bookingDetails['services'] as List<Map<String, dynamic>>;
      final serviceIds = services.map((s) => s['id']).toList();

      // 1. Create Payment Intent via Web API
      final response = await http.post(
        Uri.parse('https://booking.maisondepoupee.co.uk/api/create-payment-intent'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'serviceIds': serviceIds,
          'isDeposit': !_payFullAmount,
          'customerDetails': {
            'email': user.email,
            'name': user.userMetadata?['full_name'] ?? 'Mobile User'
          }
        }),
      );

      final responseData = jsonDecode(response.body);

      if (response.statusCode != 200) {
        throw Exception(responseData['error'] ?? 'Failed to create payment intent');
      }

      final clientSecret = responseData['clientSecret'];

      // 2. Initialize Payment Sheet
      await Stripe.instance.initPaymentSheet(
        paymentSheetParameters: SetupPaymentSheetParameters(
          paymentIntentClientSecret: clientSecret,
          merchantDisplayName: 'Maison de poupée',
          style: ThemeMode.light,
        ),
      );

      // 3. Present Payment Sheet
      await Stripe.instance.presentPaymentSheet();

      // 4. Save to Supabase upon success
      
      // Ensure customer exists
      final customerResponse = await supabase
          .from('customers')
          .select('id')
          .eq('email', user.email!)
          .maybeSingle();
      
      String customerId;
      if (customerResponse == null) {
        final newCustomer = await supabase
            .from('customers')
            .insert({
              'full_name': user.userMetadata?['full_name'] ?? 'Mobile User',
              'email': user.email!,
            })
            .select('id')
            .single();
        customerId = newCustomer['id'];
      } else {
        customerId = customerResponse['id'];
      }

      // Create Appointment
      final totalPrice = services.fold<num>(0, (sum, s) => sum + (s['price'] ?? 0));
      final paidAmount = _payFullAmount ? totalPrice : totalPrice / 2;

      final appointment = await supabase
          .from('appointments')
          .insert({
            'customer_id': customerId,
            'appointment_date': widget.bookingDetails['date'],
            'start_time': widget.bookingDetails['time'],
            'end_time': widget.bookingDetails['time'],
            'total_amount': totalPrice,
            'status': 'confirmed',
            'payment_status': _payFullAmount ? 'paid' : 'deposit_paid',
          })
          .select('id')
          .single();

      // Link Services
      final links = services.map((s) => {
        'appointment_id': appointment['id'],
        'service_id': s['id'],
      }).toList();
      
      await supabase.from('appointment_services').insert(links);

      setState(() {
        isProcessing = false;
        isSuccess = true;
      });
    } catch (e) {
      debugPrint('Payment/Booking Error: $e');
      if (e is StripeException) {
        errorMessage = e.error.localizedMessage;
      } else {
        errorMessage = e.toString().replaceAll('Exception: ', '');
      }
      setState(() {
        isProcessing = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final user = Supabase.instance.client.auth.currentUser;
    final services = widget.bookingDetails['services'] as List<Map<String, dynamic>>;
    final totalPrice = services.fold<num>(0, (sum, s) => sum + (s['price'] ?? 0));

    if (isSuccess) {
      return Scaffold(
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(32.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: const Color(0xFF98635A).withOpacity(0.1),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.check_circle_outline, color: Color(0xFF98635A), size: 80),
                ),
                const SizedBox(height: 32),
                Text(
                  'Confirmed!',
                  style: GoogleFonts.outfit(fontSize: 32, fontWeight: FontWeight.bold, letterSpacing: -1, color: const Color(0xFF98635A)),
                ),
                const SizedBox(height: 16),
                Text(
                  'Your appointment is confirmed for ${widget.bookingDetails['date']} at ${widget.bookingDetails['time']}.',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: const Color(0xFF98635A).withOpacity(0.6), fontSize: 16, height: 1.5),
                ),
                const SizedBox(height: 64),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () => Navigator.of(context).popUntil((route) => route.isFirst),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFF5DFD6),
                      foregroundColor: const Color(0xFF98635A),
                      padding: const EdgeInsets.symmetric(vertical: 20),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                      elevation: 0,
                    ),
                    child: const Text('Back to Home', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
                  ),
                ),
              ],
            ),
          ),
        ),
      );
    }

    if (user == null) {
      return Scaffold(
        backgroundColor: Colors.white,
        appBar: AppBar(
          title: Text('Account Required', style: GoogleFonts.outfit(fontWeight: FontWeight.bold, color: const Color(0xFF98635A))),
          backgroundColor: Colors.white,
          elevation: 0,
          iconTheme: const IconThemeData(color: Color(0xFF98635A)),
        ),
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(32.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: const Color(0xFF98635A).withOpacity(0.1),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.lock_person_outlined, color: Color(0xFF98635A), size: 64),
                ),
                const SizedBox(height: 32),
                Text(
                  'Final Step',
                  style: GoogleFonts.outfit(fontSize: 28, fontWeight: FontWeight.bold, letterSpacing: -1, color: const Color(0xFF98635A)),
                ),
                const SizedBox(height: 16),
                Text(
                  'Please sign in or create an account to secure your booking and complete the payment.',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: const Color(0xFF98635A).withOpacity(0.6), fontSize: 16, height: 1.5),
                ),
                const SizedBox(height: 48),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(builder: (context) => const LoginScreen()),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF98635A),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 20),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                      elevation: 0,
                    ),
                    child: const Text('Sign In', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
                  ),
                ),
                const SizedBox(height: 16),
                SizedBox(
                  width: double.infinity,
                  child: OutlinedButton(
                    onPressed: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(builder: (context) => const SignUpScreen()),
                      );
                    },
                    style: OutlinedButton.styleFrom(
                      foregroundColor: const Color(0xFF98635A),
                      side: const BorderSide(color: Color(0xFF98635A)),
                      padding: const EdgeInsets.symmetric(vertical: 20),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                    ),
                    child: const Text('Create Account', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
                  ),
                ),
                const SizedBox(height: 24),
                TextButton(
                  onPressed: () => Navigator.of(context).pop(),
                  child: Text('Review Selection', style: TextStyle(color: const Color(0xFF98635A).withOpacity(0.6))),
                ),
              ],
            ),
          ),
        ),
      );
    }

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: Text('Checkout', style: GoogleFonts.outfit(fontWeight: FontWeight.bold, color: const Color(0xFF98635A))),
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
        iconTheme: const IconThemeData(color: Color(0xFF98635A)),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (errorMessage != null)
              Container(
                margin: const EdgeInsets.only(bottom: 24),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.red.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.red.withOpacity(0.2)),
                ),
                child: Text(errorMessage!, style: const TextStyle(color: Colors.redAccent)),
              ),

            // Summary Card
            Container(
              padding: const EdgeInsets.all(32),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(32),
                border: Border.all(color: const Color(0xFF98635A).withOpacity(0.05)),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFF98635A).withOpacity(0.04),
                    blurRadius: 20,
                    offset: const Offset(0, 10),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Summary', style: GoogleFonts.outfit(fontWeight: FontWeight.bold, fontSize: 20, color: const Color(0xFF98635A))),
                  const SizedBox(height: 24),
                  ...services.map((s) => Padding(
                    padding: const EdgeInsets.only(bottom: 8.0),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(child: Text(s['name'], style: TextStyle(color: const Color(0xFF98635A).withOpacity(0.6)))),
                        Text('£${s['price']}', style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF98635A))),
                      ],
                    ),
                  )).toList(),
                  const Padding(
                    padding: EdgeInsets.symmetric(vertical: 20.0),
                    child: Divider(color: Color(0xFFF5DFD6)),
                  ),
                  _summaryRow('Date', widget.bookingDetails['date']),
                  _summaryRow('Time', widget.bookingDetails['time']),
                  const Padding(
                    padding: EdgeInsets.symmetric(vertical: 24.0),
                    child: Divider(color: Color(0xFFF5DFD6)),
                  ),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Total Amount', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF98635A))),
                      Text(
                        '£$totalPrice',
                        style: GoogleFonts.outfit(fontWeight: FontWeight.w900, fontSize: 32, color: const Color(0xFF98635A), letterSpacing: -1),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 32),
            Text('Payment Option', style: GoogleFonts.outfit(fontWeight: FontWeight.bold, fontSize: 18, color: const Color(0xFF98635A))),
            const SizedBox(height: 16),
            
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: const Color(0xFFF5DFD6).withOpacity(0.1),
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: const Color(0xFF98635A).withOpacity(0.05)),
              ),
              child: Column(
                children: [
                  _paymentOptionTile(
                    title: 'Pay 50% Deposit',
                    subtitle: 'Pay £${totalPrice / 2} now, balance later',
                    isSelected: !_payFullAmount,
                    onTap: () => setState(() => _payFullAmount = false),
                  ),
                  const SizedBox(height: 8),
                  _paymentOptionTile(
                    title: 'Pay Full Amount',
                    subtitle: 'Pay £$totalPrice now',
                    isSelected: _payFullAmount,
                    onTap: () => setState(() => _payFullAmount = true),
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 32),
            Text('Secure Checkout', style: GoogleFonts.outfit(fontWeight: FontWeight.bold, fontSize: 18, color: const Color(0xFF98635A))),
            const SizedBox(height: 16),
            
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: const Color(0xFF98635A).withOpacity(0.1)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.shield_outlined, color: Color(0xFF98635A), size: 28),
                  const SizedBox(width: 20),
                  const Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Stripe Payment', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF98635A))),
                      Text('Safe & Encrypted', style: TextStyle(color: Color(0x8098635A), fontSize: 14)),
                    ],
                  ),
                  const Spacer(),
                  const Icon(Icons.lock, color: Color(0xFF98635A), size: 20),
                ],
              ),
            ),
            
            const SizedBox(height: 48),
            
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: isProcessing ? null : _handlePayment,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF98635A),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 22),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
                  elevation: 0,
                ),
                child: isProcessing 
                  ? const SizedBox(width: 24, height: 24, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                  : Text(
                      _payFullAmount ? 'Pay £$totalPrice' : 'Pay £${totalPrice / 2} Deposit',
                      style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.bold),
                    ),
              ),
            ),
            
            const SizedBox(height: 32),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.lock_outline, size: 14, color: const Color(0xFF98635A).withOpacity(0.3)),
                const SizedBox(width: 8),
                Text('POWERED BY STRIPE', style: TextStyle(color: const Color(0xFF98635A).withOpacity(0.3), fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1)),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _summaryRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: TextStyle(color: const Color(0xFF98635A).withOpacity(0.5))),
          Text(value, style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF98635A))),
        ],
      ),
    );
  }

  Widget _paymentOptionTile({
    required String title,
    required String subtitle,
    required bool isSelected,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(20),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF98635A) : Colors.transparent,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected ? const Color(0xFF98635A) : const Color(0xFF98635A).withOpacity(0.1),
          ),
        ),
        child: Row(
          children: [
            Icon(
              isSelected ? Icons.radio_button_checked : Icons.radio_button_off,
              color: isSelected ? Colors.white : const Color(0xFF98635A),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                      color: isSelected ? Colors.white : const Color(0xFF98635A),
                    ),
                  ),
                  Text(
                    subtitle,
                    style: TextStyle(
                      fontSize: 12,
                      color: isSelected ? Colors.white.withOpacity(0.8) : const Color(0xFF98635A).withOpacity(0.5),
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
}
