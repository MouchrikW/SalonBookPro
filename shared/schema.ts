import { pgTable, text, serial, integer, boolean, timestamp, json, doublePrecision, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  phone: text("phone"),
  isSalonOwner: boolean("is_salon_owner").default(false).notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  name: true,
  phone: true,
  isSalonOwner: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const salons = pgTable("salons", {
  id: serial("id").primaryKey(),
  ownerId: integer("owner_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  address: text("address").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  images: json("images").$type<string[]>().notNull(),
  categories: json("categories").$type<string[]>().notNull(),
  featured: boolean("featured").default(false).notNull(),
  rating: doublePrecision("rating").default(0).notNull(),
  reviewCount: integer("review_count").default(0).notNull(),
  priceRange: json("price_range").$type<{min: number, max: number}>().notNull(),
});

export const insertSalonSchema = createInsertSchema(salons).omit({
  id: true,
});

export type InsertSalon = z.infer<typeof insertSalonSchema>;
export type Salon = typeof salons.$inferSelect;

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  salonId: integer("salon_id").notNull().references(() => salons.id),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  duration: integer("duration").notNull(), // in minutes
  category: text("category").notNull(),
  image: text("image"),
  isPopular: boolean("is_popular").default(false).notNull(),
  discountedPrice: integer("discounted_price"),
});

export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
});

export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  salonId: integer("salon_id").notNull().references(() => salons.id),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  date: timestamp("date").defaultNow().notNull(),
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  date: true,
});

export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  salonId: integer("salon_id").notNull().references(() => salons.id),
  serviceId: integer("service_id").notNull().references(() => services.id),
  date: timestamp("date").notNull(),
  status: text("status").notNull().default("pending"), // pending, confirmed, cancelled, completed
  totalPrice: integer("total_price").notNull(),
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
});

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;

export const favorites = pgTable("favorites", {
  userId: integer("user_id").notNull().references(() => users.id),
  salonId: integer("salon_id").notNull().references(() => salons.id),
}, (t) => ({
  pk: primaryKey(t.userId, t.salonId),
}));

export const insertFavoriteSchema = createInsertSchema(favorites);

export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type Favorite = typeof favorites.$inferSelect;
