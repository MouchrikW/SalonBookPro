import { 
  User, InsertUser, 
  Salon, InsertSalon, 
  Service, InsertService, 
  Review, InsertReview, 
  Booking, InsertBooking, 
  Favorite, InsertFavorite,
  users, salons, services, reviews, bookings, favorites 
} from "@shared/schema";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { db, pool } from "./db";
import { eq, and, desc, sql, SQL } from "drizzle-orm";

const PostgresSessionStore = connectPg(session);

import { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async seedDatabase(): Promise<void> {
    // Check if users already exist
    const existingUsers = await db.select().from(users).limit(1);
    if (existingUsers.length > 0) {
      console.log("Database already seeded, skipping...");
      return;
    }

    console.log("Seeding database...");

    // Add test users
    const testUser = await this.createUser({
      name: "Test User",
      username: "testuser",
      password: "password123",
      email: "test@example.com",
      phone: "1234567890",
      isSalonOwner: false
    });
    
    const ownerUser = await this.createUser({
      name: "Salon Owner",
      username: "salonowner",
      password: "password123",
      email: "owner@example.com",
      phone: "0987654321",
      isSalonOwner: true
    });
    
    // Add test salons
    const salon1 = await this.createSalon({
      name: "Luxury Spa & Salon",
      address: "123 Main Street",
      email: "contact@luxuryspa.com",
      phone: "555-123-4567",
      description: "A luxury spa and salon offering premium services",
      location: "Marrakech",
      ownerId: ownerUser.id,
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
    
    const salon2 = await this.createSalon({
      name: "Modern Beauty Center",
      address: "456 Avenue Mohammed V",
      email: "info@modernbeauty.com",
      phone: "555-987-6543",
      description: "Contemporary beauty center with the latest trends and techniques",
      location: "Casablanca",
      ownerId: ownerUser.id,
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
    await this.createService({
      salonId: salon1.id,
      name: "Luxury Hammam Ritual",
      description: "Traditional Moroccan hammam experience with full body exfoliation and mask",
      price: 600,
      duration: 90,
      category: "Spa",
      image: "https://images.unsplash.com/photo-1583416750470-965b2707b355?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=350&q=80",
      isPopular: true,
      discountedPrice: 500
    });
    
    await this.createService({
      salonId: salon1.id,
      name: "Signature Facial",
      description: "Deep cleansing facial with premium products and massage",
      price: 450,
      duration: 60,
      category: "Facial",
      image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=350&q=80",
      isPopular: true,
      discountedPrice: null
    });
    
    await this.createService({
      salonId: salon2.id,
      name: "Hair Cut & Style",
      description: "Professional haircut and styling by expert stylists",
      price: 350,
      duration: 45,
      category: "Hair",
      image: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=350&q=80",
      isPopular: true,
      discountedPrice: null
    });
    
    await this.createService({
      salonId: salon2.id,
      name: "Gel Manicure",
      description: "Long-lasting gel manicure with nail art options",
      price: 200,
      duration: 60,
      category: "Nails",
      image: "https://images.unsplash.com/photo-1604902396830-aca21156dede?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=350&q=80",
      isPopular: false,
      discountedPrice: 180
    });

    console.log("Database seeded successfully!");
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db
      .select()
      .from(users)
      .where(sql`LOWER(${users.username}) = LOWER(${username})`)
      .limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db
      .select()
      .from(users)
      .where(sql`LOWER(${users.email}) = LOWER(${email})`)
      .limit(1);
    return result[0];
  }

  async createUser(userData: InsertUser): Promise<User> {
    const result = await db.insert(users).values(userData).returning();
    return result[0];
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const result = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }

  // Salon methods
  async getSalon(id: number): Promise<Salon | undefined> {
    const result = await db.select().from(salons).where(eq(salons.id, id)).limit(1);
    return result[0];
  }

  async getSalons(filters?: { category?: string; location?: string; featured?: boolean }): Promise<Salon[]> {
    let query = db.select().from(salons);
    
    if (filters) {
      const conditions: SQL[] = [];
      
      if (filters.category) {
        conditions.push(sql`${salons.categories} ? ${filters.category}`);
      }
      
      if (filters.location) {
        conditions.push(sql`${salons.location} ILIKE ${'%' + filters.location + '%'}`);
      }
      
      if (filters.featured !== undefined) {
        conditions.push(eq(salons.featured, filters.featured));
      }
      
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }
    }
    
    return await query;
  }

  async createSalon(salonData: InsertSalon): Promise<Salon> {
    const result = await db.insert(salons).values(salonData).returning();
    return result[0];
  }

  async updateSalon(id: number, salonData: Partial<Salon>): Promise<Salon | undefined> {
    const result = await db
      .update(salons)
      .set(salonData)
      .where(eq(salons.id, id))
      .returning();
    return result[0];
  }

  async getSalonsByOwnerId(ownerId: number): Promise<Salon[]> {
    return await db.select().from(salons).where(eq(salons.ownerId, ownerId));
  }

  // Service methods
  async getService(id: number): Promise<Service | undefined> {
    const result = await db.select().from(services).where(eq(services.id, id)).limit(1);
    return result[0];
  }

  async getServicesBySalonId(salonId: number): Promise<Service[]> {
    return await db.select().from(services).where(eq(services.salonId, salonId));
  }

  async createService(serviceData: InsertService): Promise<Service> {
    const result = await db.insert(services).values(serviceData).returning();
    return result[0];
  }

  async updateService(id: number, serviceData: Partial<Service>): Promise<Service | undefined> {
    const result = await db
      .update(services)
      .set(serviceData)
      .where(eq(services.id, id))
      .returning();
    return result[0];
  }

  async deleteService(id: number): Promise<boolean> {
    const result = await db.delete(services).where(eq(services.id, id)).returning();
    return result.length > 0;
  }

  // Review methods
  async getReview(id: number): Promise<Review | undefined> {
    const result = await db.select().from(reviews).where(eq(reviews.id, id)).limit(1);
    return result[0];
  }

  async getReviewsBySalonId(salonId: number): Promise<Review[]> {
    return await db
      .select()
      .from(reviews)
      .where(eq(reviews.salonId, salonId))
      .orderBy(desc(reviews.date));
  }

  async getReviewsByUserId(userId: number): Promise<Review[]> {
    return await db
      .select()
      .from(reviews)
      .where(eq(reviews.userId, userId))
      .orderBy(desc(reviews.date));
  }

  async createReview(reviewData: InsertReview): Promise<Review> {
    // Set the date to current time if not provided
    const dataWithDate = {
      ...reviewData,
      date: reviewData.date || new Date(),
    };
    
    const result = await db.insert(reviews).values(dataWithDate).returning();
    const newReview = result[0];
    
    // Update salon rating
    const salonReviews = await this.getReviewsBySalonId(reviewData.salonId);
    
    if (salonReviews.length > 0) {
      const totalRating = salonReviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / salonReviews.length;
      
      await this.updateSalon(reviewData.salonId, {
        rating: parseFloat(averageRating.toFixed(1)),
        reviewCount: salonReviews.length
      });
    }
    
    return newReview;
  }

  async updateReview(id: number, reviewData: Partial<Review>): Promise<Review | undefined> {
    const result = await db
      .update(reviews)
      .set(reviewData)
      .where(eq(reviews.id, id))
      .returning();
    
    const updatedReview = result[0];
    
    if (updatedReview) {
      // If rating was updated, update salon rating
      if (reviewData.rating) {
        const salonReviews = await this.getReviewsBySalonId(updatedReview.salonId);
        const totalRating = salonReviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / salonReviews.length;
        
        await this.updateSalon(updatedReview.salonId, {
          rating: parseFloat(averageRating.toFixed(1))
        });
      }
    }
    
    return updatedReview;
  }

  async deleteReview(id: number): Promise<boolean> {
    // Get the review first to find salonId
    const reviewToDelete = await this.getReview(id);
    if (!reviewToDelete) return false;
    
    const result = await db.delete(reviews).where(eq(reviews.id, id)).returning();
    
    if (result.length > 0) {
      // Update salon rating after deletion
      const salonReviews = await this.getReviewsBySalonId(reviewToDelete.salonId);
      const salon = await this.getSalon(reviewToDelete.salonId);
      
      if (salon) {
        if (salonReviews.length > 0) {
          const totalRating = salonReviews.reduce((sum, review) => sum + review.rating, 0);
          const averageRating = totalRating / salonReviews.length;
          
          await this.updateSalon(reviewToDelete.salonId, {
            rating: parseFloat(averageRating.toFixed(1)),
            reviewCount: salonReviews.length
          });
        } else {
          // No reviews left
          await this.updateSalon(reviewToDelete.salonId, {
            rating: 0,
            reviewCount: 0
          });
        }
      }
      
      return true;
    }
    
    return false;
  }

  // Booking methods
  async getBooking(id: number): Promise<Booking | undefined> {
    const result = await db.select().from(bookings).where(eq(bookings.id, id)).limit(1);
    return result[0];
  }

  async getBookingsByUserId(userId: number): Promise<Booking[]> {
    return await db
      .select()
      .from(bookings)
      .where(eq(bookings.userId, userId))
      .orderBy(desc(bookings.date));
  }

  async getBookingsBySalonId(salonId: number): Promise<Booking[]> {
    return await db
      .select()
      .from(bookings)
      .where(eq(bookings.salonId, salonId))
      .orderBy(desc(bookings.date));
  }

  async createBooking(bookingData: InsertBooking): Promise<Booking> {
    // Set default status if not provided
    const dataWithDefaults = {
      ...bookingData,
      status: bookingData.status || 'pending'
    };
    
    const result = await db.insert(bookings).values(dataWithDefaults).returning();
    return result[0];
  }

  async updateBookingStatus(id: number, status: string): Promise<Booking | undefined> {
    const result = await db
      .update(bookings)
      .set({ status })
      .where(eq(bookings.id, id))
      .returning();
    return result[0];
  }

  // Favorite methods
  async addFavorite(favorite: InsertFavorite): Promise<Favorite> {
    const result = await db.insert(favorites).values(favorite).returning();
    return result[0];
  }

  async removeFavorite(userId: number, salonId: number): Promise<boolean> {
    const result = await db
      .delete(favorites)
      .where(
        and(
          eq(favorites.userId, userId),
          eq(favorites.salonId, salonId)
        )
      )
      .returning();
    return result.length > 0;
  }

  async getFavoritesByUserId(userId: number): Promise<Favorite[]> {
    return await db.select().from(favorites).where(eq(favorites.userId, userId));
  }

  async isFavorite(userId: number, salonId: number): Promise<boolean> {
    const result = await db
      .select()
      .from(favorites)
      .where(
        and(
          eq(favorites.userId, userId),
          eq(favorites.salonId, salonId)
        )
      )
      .limit(1);
    return result.length > 0;
  }
}