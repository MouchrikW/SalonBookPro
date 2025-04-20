class Salon {
  final int id;
  final String name;
  final String address;
  final String phone;
  final String email;
  final List<String> categories;
  final List<String> images;
  final String description;
  final double rating;
  final bool featured;
  final String openingHours;
  final String closingHours;
  final List<String> workingDays;

  Salon({
    required this.id,
    required this.name,
    required this.address,
    required this.phone,
    required this.email,
    required this.categories,
    required this.images,
    required this.description,
    required this.rating,
    required this.featured,
    required this.openingHours,
    required this.closingHours,
    required this.workingDays,
  });

  // Sample data for salon dashboard
  static Salon sampleSalon() {
    return Salon(
      id: 1,
      name: 'Luxury Spa & Salon',
      address: '123 Main Street, Marrakech',
      phone: '+212 555-123-4567',
      email: 'contact@luxuryspa.com',
      categories: ['Spa', 'Hair', 'Nails', 'Facial'],
      images: [
        'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      ],
      description: 'Experience luxury treatments in the heart of Marrakech. Our professional staff offers a wide range of services to make you look and feel your best.',
      rating: 4.8,
      featured: true,
      openingHours: '09:00',
      closingHours: '19:00',
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    );
  }
}