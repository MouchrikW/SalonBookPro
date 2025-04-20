class Booking {
  final int id;
  final int userId;
  final int salonId;
  final int serviceId;
  final DateTime date;
  final String time;
  final String status; // pending, confirmed, completed, cancelled
  final DateTime createdAt;
  final String customerName;
  final String customerPhone;
  final String serviceName;
  final int serviceDuration;
  final double servicePrice;

  Booking({
    required this.id,
    required this.userId,
    required this.salonId,
    required this.serviceId,
    required this.date,
    required this.time,
    required this.status,
    required this.createdAt,
    required this.customerName,
    required this.customerPhone,
    required this.serviceName,
    required this.serviceDuration,
    required this.servicePrice,
  });

  // Sample bookings data
  static List<Booking> sampleBookings() {
    final now = DateTime.now();
    return [
      Booking(
        id: 1,
        userId: 1,
        salonId: 1,
        serviceId: 1,
        date: DateTime(now.year, now.month, now.day + 2),
        time: '10:00',
        status: 'pending',
        createdAt: DateTime.now().subtract(const Duration(days: 1)),
        customerName: 'Test User',
        customerPhone: '+212 611-222-333',
        serviceName: 'Luxury Hammam Ritual',
        serviceDuration: 90,
        servicePrice: 600.0,
      ),
      Booking(
        id: 2,
        userId: 2,
        salonId: 1,
        serviceId: 2,
        date: DateTime(now.year, now.month, now.day + 3),
        time: '14:30',
        status: 'pending',
        createdAt: DateTime.now().subtract(const Duration(hours: 6)),
        customerName: 'Jane Smith',
        customerPhone: '+212 622-333-444',
        serviceName: 'Signature Facial',
        serviceDuration: 60,
        servicePrice: 450.0,
      ),
      Booking(
        id: 3,
        userId: 3,
        salonId: 1,
        serviceId: 3,
        date: DateTime(now.year, now.month, now.day),
        time: '15:00',
        status: 'confirmed',
        createdAt: DateTime.now().subtract(const Duration(days: 2)),
        customerName: 'Mohamed Ali',
        customerPhone: '+212 633-444-555',
        serviceName: 'Hot Stone Massage',
        serviceDuration: 75,
        servicePrice: 500.0,
      ),
      Booking(
        id: 4,
        userId: 4,
        salonId: 1,
        serviceId: 4,
        date: DateTime(now.year, now.month, now.day - 2),
        time: '11:00',
        status: 'completed',
        createdAt: DateTime.now().subtract(const Duration(days: 4)),
        customerName: 'Fatima Zahra',
        customerPhone: '+212 644-555-666',
        serviceName: 'Haircut & Styling',
        serviceDuration: 45,
        servicePrice: 250.0,
      ),
      Booking(
        id: 5,
        userId: 5,
        salonId: 1,
        serviceId: 1,
        date: DateTime(now.year, now.month, now.day - 1),
        time: '16:30',
        status: 'cancelled',
        createdAt: DateTime.now().subtract(const Duration(days: 3)),
        customerName: 'Youssef Benmoussa',
        customerPhone: '+212 655-666-777',
        serviceName: 'Luxury Hammam Ritual',
        serviceDuration: 90,
        servicePrice: 600.0,
      ),
    ];
  }
}