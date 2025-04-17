import { users, type User, type InsertUser, salons, type Salon, type InsertSalon, services, type Service, type InsertService, reviews, type Review, type InsertReview, bookings, type Booking, type InsertBooking, favorites, type Favorite, type InsertFavorite } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  
  // Salon methods
  getSalon(id: number): Promise<Salon | undefined>;
  getSalons(filters?: { category?: string; location?: string; featured?: boolean }): Promise<Salon[]>;
  createSalon(salon: InsertSalon): Promise<Salon>;
  updateSalon(id: number, salon: Partial<Salon>): Promise<Salon | undefined>;
  getSalonsByOwnerId(ownerId: number): Promise<Salon[]>;
  
  // Service methods
  getService(id: number): Promise<Service | undefined>;
  getServicesBySalonId(salonId: number): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, service: Partial<Service>): Promise<Service | undefined>;
  deleteService(id: number): Promise<boolean>;
  
  // Review methods
  getReview(id: number): Promise<Review | undefined>;
  getReviewsBySalonId(salonId: number): Promise<Review[]>;
  getReviewsByUserId(userId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  updateReview(id: number, review: Partial<Review>): Promise<Review | undefined>;
  deleteReview(id: number): Promise<boolean>;
  
  // Booking methods
  getBooking(id: number): Promise<Booking | undefined>;
  getBookingsByUserId(userId: number): Promise<Booking[]>;
  getBookingsBySalonId(salonId: number): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBookingStatus(id: number, status: string): Promise<Booking | undefined>;
  
  // Favorite methods
  addFavorite(favorite: InsertFavorite): Promise<Favorite>;
  removeFavorite(userId: number, salonId: number): Promise<boolean>;
  getFavoritesByUserId(userId: number): Promise<Favorite[]>;
  isFavorite(userId: number, salonId: number): Promise<boolean>;
  
  // Session store
  sessionStore: ReturnType<typeof createMemoryStore>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private salons: Map<number, Salon>;
  private services: Map<number, Service>;
  private reviews: Map<number, Review>;
  private bookings: Map<number, Booking>;
  private favorites: Map<string, Favorite>;
  private userIdCounter: number;
  private salonIdCounter: number;
  private serviceIdCounter: number;
  private reviewIdCounter: number;
  private bookingIdCounter: number;
  sessionStore: ReturnType<typeof createMemoryStore>;

  constructor() {
    this.users = new Map();
    this.salons = new Map();
    this.services = new Map();
    this.reviews = new Map();
    this.bookings = new Map();
    this.favorites = new Map();
    this.userIdCounter = 1;
    this.salonIdCounter = 1;
    this.serviceIdCounter = 1;
    this.reviewIdCounter = 1;
    this.bookingIdCounter = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
    
    // Seed some initial data
    this.seedData();
  }

  private seedData() {
    // Add test users
    this.createUser({
      name: "Test User",
      username: "testuser",
      password: "password123",
      email: "test@example.com",
      phone: "1234567890",
      isSalonOwner: false
    });
    
    this.createUser({
      name: "Salon Owner",
      username: "salonowner",
      password: "password123",
      email: "owner@example.com",
      phone: "0987654321",
      isSalonOwner: true
    });
    
    // Add test salons
    const salon1 = this.createSalon({
      name: "Luxury Spa & Salon",
      address: "123 Main Street",
      email: "contact@luxuryspa.com",
      phone: "555-123-4567",
      description: "A luxury spa and salon offering premium services",
      location: "Marrakech",
      ownerId: 2,
      images: [
        "https://images.unsplash.com/photo-1600334129128-685c5582fd35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=350&q=80",
        "https://images.unsplash.com/photo-1595855426019-73351908fdbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=350&q=80"
      ],
      categories: ["Spa", "Hair", "Nails", "Facial"],
      priceRange: { min: 200, max: 1000 },
      featured: true,
      rating: 4.8,
      reviewCount: 124
    });
    
    const salon2 = this.createSalon({
      name: "Modern Beauty Center",
      address: "456 Avenue Mohammed V",
      email: "info@modernbeauty.com",
      phone: "555-987-6543",
      description: "Contemporary beauty center with the latest trends and techniques",
      location: "Casablanca",
      ownerId: 2,
      images: [
        "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=350&q=80",
        "https://images.unsplash.com/photo-1470259078422-826894b933aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=350&q=80"
      ],
      categories: ["Hair", "Makeup", "Nails"],
      priceRange: { min: 150, max: 800 },
      featured: false,
      rating: 4.2,
      reviewCount: 87
    });
    
    // Add services to salons
    this.createService({
      salonId: 1,
      name: "Luxury Hammam Ritual",
      description: "Traditional Moroccan hammam experience with full body exfoliation and mask",
      price: 600,
      duration: 90,
      category: "Spa",
      image: "https://images.unsplash.com/photo-1583416750470-965b2707b355?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=350&q=80",
      isPopular: true,
      discountedPrice: 500
    });
    
    this.createService({
      salonId: 1,
      name: "Signature Facial",
      description: "Deep cleansing facial with premium products and massage",
      price: 450,
      duration: 60,
      category: "Facial",
      image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=350&q=80",
      isPopular: true,
      discountedPrice: null
    });
    
    this.createService({
      salonId: 2,
      name: "Hair Cut & Style",
      description: "Professional haircut and styling by expert stylists",
      price: 350,
      duration: 45,
      category: "Hair",
      image: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=350&q=80",
      isPopular: true,
      discountedPrice: null
    });
    
    this.createService({
      salonId: 2,
      name: "Gel Manicure",
      description: "Long-lasting gel manicure with nail art options",
      price: 200,
      duration: 60,
      category: "Nails",
      image: "https://images.unsplash.com/photo-1604902396830-aca21156dede?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=350&q=80",
      isPopular: false,
      discountedPrice: 180
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Salon methods
  async getSalon(id: number): Promise<Salon | undefined> {
    return this.salons.get(id);
  }

  async getSalons(filters?: { category?: string; location?: string; featured?: boolean }): Promise<Salon[]> {
    let result = Array.from(this.salons.values());
    
    if (filters) {
      if (filters.category) {
        result = result.filter(salon => 
          salon.categories.some(cat => cat.toLowerCase().includes(filters.category!.toLowerCase()))
        );
      }
      
      if (filters.location) {
        result = result.filter(salon => 
          salon.location.toLowerCase().includes(filters.location!.toLowerCase())
        );
      }
      
      if (filters.featured !== undefined) {
        result = result.filter(salon => salon.featured === filters.featured);
      }
    }
    
    return result;
  }

  async createSalon(salon: InsertSalon): Promise<Salon> {
    const id = this.salonIdCounter++;
    const newSalon: Salon = { ...salon, id };
    this.salons.set(id, newSalon);
    return newSalon;
  }

  async updateSalon(id: number, salonData: Partial<Salon>): Promise<Salon | undefined> {
    const salon = this.salons.get(id);
    if (!salon) return undefined;
    
    const updatedSalon = { ...salon, ...salonData };
    this.salons.set(id, updatedSalon);
    return updatedSalon;
  }

  async getSalonsByOwnerId(ownerId: number): Promise<Salon[]> {
    return Array.from(this.salons.values()).filter(
      (salon) => salon.ownerId === ownerId
    );
  }

  // Service methods
  async getService(id: number): Promise<Service | undefined> {
    return this.services.get(id);
  }

  async getServicesBySalonId(salonId: number): Promise<Service[]> {
    return Array.from(this.services.values()).filter(
      (service) => service.salonId === salonId
    );
  }

  async createService(service: InsertService): Promise<Service> {
    const id = this.serviceIdCounter++;
    const newService: Service = { ...service, id };
    this.services.set(id, newService);
    return newService;
  }

  async updateService(id: number, serviceData: Partial<Service>): Promise<Service | undefined> {
    const service = this.services.get(id);
    if (!service) return undefined;
    
    const updatedService = { ...service, ...serviceData };
    this.services.set(id, updatedService);
    return updatedService;
  }

  async deleteService(id: number): Promise<boolean> {
    return this.services.delete(id);
  }

  // Review methods
  async getReview(id: number): Promise<Review | undefined> {
    return this.reviews.get(id);
  }

  async getReviewsBySalonId(salonId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      (review) => review.salonId === salonId
    );
  }

  async getReviewsByUserId(userId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      (review) => review.userId === userId
    );
  }

  async createReview(review: InsertReview): Promise<Review> {
    const id = this.reviewIdCounter++;
    const newReview: Review = { ...review, id, date: new Date() };
    this.reviews.set(id, newReview);
    
    // Update salon rating
    const salonReviews = await this.getReviewsBySalonId(review.salonId);
    const salon = await this.getSalon(review.salonId);
    
    if (salon) {
      const totalRating = salonReviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / salonReviews.length;
      
      await this.updateSalon(review.salonId, {
        rating: parseFloat(averageRating.toFixed(1)),
        reviewCount: salonReviews.length
      });
    }
    
    return newReview;
  }

  async updateReview(id: number, reviewData: Partial<Review>): Promise<Review | undefined> {
    const review = this.reviews.get(id);
    if (!review) return undefined;
    
    const updatedReview = { ...review, ...reviewData };
    this.reviews.set(id, updatedReview);
    return updatedReview;
  }

  async deleteReview(id: number): Promise<boolean> {
    const review = this.reviews.get(id);
    if (!review) return false;
    
    const result = this.reviews.delete(id);
    
    // Update salon rating
    const salonReviews = await this.getReviewsBySalonId(review.salonId);
    const salon = await this.getSalon(review.salonId);
    
    if (salon && salonReviews.length > 0) {
      const totalRating = salonReviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / salonReviews.length;
      
      await this.updateSalon(review.salonId, {
        rating: parseFloat(averageRating.toFixed(1)),
        reviewCount: salonReviews.length
      });
    } else if (salon) {
      await this.updateSalon(review.salonId, {
        rating: 0,
        reviewCount: 0
      });
    }
    
    return result;
  }

  // Booking methods
  async getBooking(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async getBookingsByUserId(userId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      (booking) => booking.userId === userId
    );
  }

  async getBookingsBySalonId(salonId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      (booking) => booking.salonId === salonId
    );
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const id = this.bookingIdCounter++;
    const newBooking: Booking = { ...booking, id };
    this.bookings.set(id, newBooking);
    return newBooking;
  }

  async updateBookingStatus(id: number, status: string): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;
    
    const updatedBooking = { ...booking, status };
    this.bookings.set(id, updatedBooking);
    return updatedBooking;
  }

  // Favorite methods
  async addFavorite(favorite: InsertFavorite): Promise<Favorite> {
    const key = `${favorite.userId}-${favorite.salonId}`;
    this.favorites.set(key, favorite);
    return favorite;
  }

  async removeFavorite(userId: number, salonId: number): Promise<boolean> {
    const key = `${userId}-${salonId}`;
    return this.favorites.delete(key);
  }

  async getFavoritesByUserId(userId: number): Promise<Favorite[]> {
    return Array.from(this.favorites.values()).filter(
      (favorite) => favorite.userId === userId
    );
  }

  async isFavorite(userId: number, salonId: number): Promise<boolean> {
    const key = `${userId}-${salonId}`;
    return this.favorites.has(key);
  }
}

export const storage = new MemStorage();
