class Service {
  final int id;
  final int salonId;
  final String name;
  final String description;
  final double price;
  final double? discountedPrice;
  final int durationMinutes;
  final String category;
  final String? imageUrl;
  final bool featured;

  Service({
    required this.id,
    required this.salonId,
    required this.name,
    required this.description,
    required this.price,
    this.discountedPrice,
    required this.durationMinutes,
    required this.category,
    this.imageUrl,
    required this.featured,
  });

  // Sample services data
  static List<Service> sampleServices() {
    return [
      Service(
        id: 1,
        salonId: 1,
        name: 'Luxury Hammam Ritual',
        description: 'Traditional Moroccan hammam experience with full body exfoliation and mask',
        price: 600.0,
        durationMinutes: 90,
        category: 'Spa',
        imageUrl: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        featured: true,
      ),
      Service(
        id: 2,
        salonId: 1,
        name: 'Signature Facial',
        description: 'Deep cleansing facial with premium products and massage',
        price: 450.0,
        durationMinutes: 60,
        category: 'Facial',
        imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        featured: true,
      ),
      Service(
        id: 3,
        salonId: 1,
        name: 'Hot Stone Massage',
        description: 'Full body massage with hot stones to relieve tension and stress',
        price: 500.0,
        durationMinutes: 75,
        category: 'Massage',
        imageUrl: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        featured: false,
      ),
      Service(
        id: 4,
        salonId: 1,
        name: 'Haircut & Styling',
        description: 'Professional haircut and styling with consultation',
        price: 250.0,
        durationMinutes: 45,
        category: 'Hair',
        imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        featured: false,
      ),
    ];
  }
}