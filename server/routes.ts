import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertSalonSchema, insertServiceSchema, insertReviewSchema, insertBookingSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Salon routes
  app.get("/api/salons", async (req, res) => {
    try {
      const filters = {
        category: req.query.category as string | undefined,
        location: req.query.location as string | undefined,
        featured: req.query.featured ? req.query.featured === 'true' : undefined
      };
      
      const salons = await storage.getSalons(filters);
      res.json(salons);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch salons" });
    }
  });

  app.get("/api/salons/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const salon = await storage.getSalon(id);
      
      if (!salon) {
        return res.status(404).json({ error: "Salon not found" });
      }
      
      res.json(salon);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch salon" });
    }
  });

  app.post("/api/salons", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const salonData = insertSalonSchema.parse(req.body);
      const salon = await storage.createSalon({
        ...salonData,
        ownerId: req.user!.id
      });
      
      res.status(201).json(salon);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create salon" });
    }
  });

  app.put("/api/salons/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const id = parseInt(req.params.id);
      const salon = await storage.getSalon(id);
      
      if (!salon) {
        return res.status(404).json({ error: "Salon not found" });
      }
      
      if (salon.ownerId !== req.user!.id) {
        return res.status(403).json({ error: "Forbidden" });
      }
      
      const updatedSalon = await storage.updateSalon(id, req.body);
      res.json(updatedSalon);
    } catch (error) {
      res.status(500).json({ error: "Failed to update salon" });
    }
  });

  // Service routes
  app.get("/api/salons/:salonId/services", async (req, res) => {
    try {
      const salonId = parseInt(req.params.salonId);
      const services = await storage.getServicesBySalonId(salonId);
      res.json(services);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch services" });
    }
  });

  app.post("/api/services", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const serviceData = insertServiceSchema.parse(req.body);
      
      // Check if user owns the salon
      const salon = await storage.getSalon(serviceData.salonId);
      if (!salon || salon.ownerId !== req.user!.id) {
        return res.status(403).json({ error: "Forbidden" });
      }
      
      const service = await storage.createService(serviceData);
      res.status(201).json(service);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create service" });
    }
  });

  app.put("/api/services/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const id = parseInt(req.params.id);
      const service = await storage.getService(id);
      
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }
      
      // Check if user owns the salon
      const salon = await storage.getSalon(service.salonId);
      if (!salon || salon.ownerId !== req.user!.id) {
        return res.status(403).json({ error: "Forbidden" });
      }
      
      const updatedService = await storage.updateService(id, req.body);
      res.json(updatedService);
    } catch (error) {
      res.status(500).json({ error: "Failed to update service" });
    }
  });

  app.delete("/api/services/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const id = parseInt(req.params.id);
      const service = await storage.getService(id);
      
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }
      
      // Check if user owns the salon
      const salon = await storage.getSalon(service.salonId);
      if (!salon || salon.ownerId !== req.user!.id) {
        return res.status(403).json({ error: "Forbidden" });
      }
      
      const success = await storage.deleteService(id);
      if (success) {
        res.status(204).end();
      } else {
        res.status(500).json({ error: "Failed to delete service" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to delete service" });
    }
  });

  // Review routes
  app.get("/api/salons/:salonId/reviews", async (req, res) => {
    try {
      const salonId = parseInt(req.params.salonId);
      const reviews = await storage.getReviewsBySalonId(salonId);
      
      // Get user data for each review
      const reviewsWithUser = await Promise.all(
        reviews.map(async (review) => {
          const user = await storage.getUser(review.userId);
          return {
            ...review,
            user: user ? { id: user.id, name: user.name } : null
          };
        })
      );
      
      res.json(reviewsWithUser);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  });

  app.post("/api/reviews", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const reviewData = insertReviewSchema.parse(req.body);
      
      // Check if salon exists
      const salon = await storage.getSalon(reviewData.salonId);
      if (!salon) {
        return res.status(404).json({ error: "Salon not found" });
      }
      
      const review = await storage.createReview({
        ...reviewData,
        userId: req.user!.id
      });
      
      const user = await storage.getUser(req.user!.id);
      
      res.status(201).json({
        ...review,
        user: user ? { id: user.id, name: user.name } : null
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create review" });
    }
  });

  app.delete("/api/reviews/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const id = parseInt(req.params.id);
      const review = await storage.getReview(id);
      
      if (!review) {
        return res.status(404).json({ error: "Review not found" });
      }
      
      // Check if user owns the review
      if (review.userId !== req.user!.id) {
        return res.status(403).json({ error: "Forbidden" });
      }
      
      const success = await storage.deleteReview(id);
      if (success) {
        res.status(204).end();
      } else {
        res.status(500).json({ error: "Failed to delete review" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to delete review" });
    }
  });

  // Booking routes
  app.get("/api/user/bookings", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const bookings = await storage.getBookingsByUserId(req.user!.id);
      
      // Get salon and service data for each booking
      const bookingsWithDetails = await Promise.all(
        bookings.map(async (booking) => {
          const salon = await storage.getSalon(booking.salonId);
          const service = await storage.getService(booking.serviceId);
          
          return {
            ...booking,
            salon: salon ? { id: salon.id, name: salon.name, location: salon.location } : null,
            service: service ? { id: service.id, name: service.name, duration: service.duration } : null
          };
        })
      );
      
      res.json(bookingsWithDetails);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  });

  app.get("/api/salon/bookings", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      // Get salons owned by user
      const salons = await storage.getSalonsByOwnerId(req.user!.id);
      
      if (salons.length === 0) {
        return res.json([]);
      }
      
      // Get bookings for each salon
      const bookingsPromises = salons.map(salon => storage.getBookingsBySalonId(salon.id));
      const bookingsArrays = await Promise.all(bookingsPromises);
      const bookings = bookingsArrays.flat();
      
      // Get user, salon and service data for each booking
      const bookingsWithDetails = await Promise.all(
        bookings.map(async (booking) => {
          const user = await storage.getUser(booking.userId);
          const salon = await storage.getSalon(booking.salonId);
          const service = await storage.getService(booking.serviceId);
          
          return {
            ...booking,
            user: user ? { id: user.id, name: user.name, email: user.email, phone: user.phone } : null,
            salon: salon ? { id: salon.id, name: salon.name } : null,
            service: service ? { id: service.id, name: service.name, duration: service.duration } : null
          };
        })
      );
      
      res.json(bookingsWithDetails);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  });

  app.post("/api/bookings", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const bookingData = insertBookingSchema.parse(req.body);
      
      // Check if salon and service exist
      const salon = await storage.getSalon(bookingData.salonId);
      if (!salon) {
        return res.status(404).json({ error: "Salon not found" });
      }
      
      const service = await storage.getService(bookingData.serviceId);
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }
      
      // Create booking
      const booking = await storage.createBooking({
        ...bookingData,
        userId: req.user!.id
      });
      
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create booking" });
    }
  });

  app.put("/api/bookings/:id/status", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || !["pending", "confirmed", "cancelled", "completed"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      
      const booking = await storage.getBooking(id);
      
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      
      // Check if user is either the booking owner or the salon owner
      const salon = await storage.getSalon(booking.salonId);
      const isUserBookingOwner = booking.userId === req.user!.id;
      const isUserSalonOwner = salon && salon.ownerId === req.user!.id;
      
      if (!isUserBookingOwner && !isUserSalonOwner) {
        return res.status(403).json({ error: "Forbidden" });
      }
      
      // Users can only cancel their own bookings, salon owners can change to any status
      if (isUserBookingOwner && !isUserSalonOwner && status !== "cancelled") {
        return res.status(403).json({ error: "Users can only cancel bookings" });
      }
      
      const updatedBooking = await storage.updateBookingStatus(id, status);
      res.json(updatedBooking);
    } catch (error) {
      res.status(500).json({ error: "Failed to update booking status" });
    }
  });

  // Favorite routes
  app.get("/api/user/favorites", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const favorites = await storage.getFavoritesByUserId(req.user!.id);
      
      // Get salon data for each favorite
      const salons = await Promise.all(
        favorites.map(async (favorite) => {
          const salon = await storage.getSalon(favorite.salonId);
          return salon;
        })
      );
      
      // Filter out undefined salons
      const validSalons = salons.filter(salon => salon !== undefined);
      
      res.json(validSalons);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch favorites" });
    }
  });

  app.post("/api/favorites", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const { salonId } = req.body;
      
      if (!salonId) {
        return res.status(400).json({ error: "Salon ID is required" });
      }
      
      // Check if salon exists
      const salon = await storage.getSalon(salonId);
      if (!salon) {
        return res.status(404).json({ error: "Salon not found" });
      }
      
      // Check if already favorited
      const isFavorite = await storage.isFavorite(req.user!.id, salonId);
      if (isFavorite) {
        return res.status(400).json({ error: "Salon already in favorites" });
      }
      
      const favorite = await storage.addFavorite({
        userId: req.user!.id,
        salonId
      });
      
      res.status(201).json(favorite);
    } catch (error) {
      res.status(500).json({ error: "Failed to add favorite" });
    }
  });

  app.delete("/api/favorites/:salonId", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const salonId = parseInt(req.params.salonId);
      
      // Check if salon exists
      const salon = await storage.getSalon(salonId);
      if (!salon) {
        return res.status(404).json({ error: "Salon not found" });
      }
      
      // Remove from favorites
      const success = await storage.removeFavorite(req.user!.id, salonId);
      
      if (success) {
        res.status(204).end();
      } else {
        res.status(404).json({ error: "Salon not found in favorites" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to remove favorite" });
    }
  });

  app.get("/api/favorites/check/:salonId", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const salonId = parseInt(req.params.salonId);
      const isFavorite = await storage.isFavorite(req.user!.id, salonId);
      
      res.json({ isFavorite });
    } catch (error) {
      res.status(500).json({ error: "Failed to check favorite status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
