import 'package:intl/intl.dart';

class Formatters {
  // Format currency (Moroccan Dirham)
  static String formatCurrency(double amount) {
    final formatter = NumberFormat.currency(
      locale: 'fr_MA',
      symbol: 'MAD',
      decimalDigits: 0,
    );
    return formatter.format(amount);
  }

  // Format date to readable format
  static String formatDate(DateTime date) {
    return DateFormat('EEEE, MMMM d, y').format(date);
  }

  // Format short date
  static String formatShortDate(DateTime date) {
    return DateFormat('MMM d, y').format(date);
  }

  // Format time period
  static String formatTimePeriod(String startTime, int durationMinutes) {
    final parsedTime = DateFormat('HH:mm').parse(startTime);
    final endTime = parsedTime.add(Duration(minutes: durationMinutes));
    
    return '${DateFormat('h:mm a').format(parsedTime)} - ${DateFormat('h:mm a').format(endTime)}';
  }

  // Format duration in hours and minutes
  static String formatDuration(int minutes) {
    final hours = minutes ~/ 60;
    final remainingMinutes = minutes % 60;
    
    if (hours > 0) {
      return '$hours hr${hours > 1 ? 's' : ''} ${remainingMinutes > 0 ? '$remainingMinutes min' : ''}';
    } else {
      return '$minutes min';
    }
  }

  // Format booking status
  static String formatStatus(String status) {
    return status.substring(0, 1).toUpperCase() + status.substring(1);
  }
}