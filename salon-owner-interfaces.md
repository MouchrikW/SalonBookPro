# Salon Owner Dashboard Interfaces

## 1. Overview Dashboard

```
┌────────────────────────────────────────────────────────────────┐
│ Salon Dashboard                                       [Owner]  │
│ Manage your salon business                                     │
├────────────────────────────────────────────────────────────────┤
│ [✓] Overview                                                   │
│ [ ] Bookings                                                   │
│ [ ] Services                                                   │
│ [ ] Settings                                                   │
├────────────────────────────────────────────────────────────────┤
│ [Switch to User Dashboard]                                     │
└────────────────────────────────────────────────────────────────┘

┌───────────────┐ ┌─────────────────┐ ┌───────────────┐
│ Pending       │ │ Today's          │ │ Total         │
│ Bookings      │ │ Appointments     │ │ Services      │
│               │ │                  │ │               │
│ 2             │ │ 1                │ │ 4             │
└───────────────┘ └─────────────────┘ └───────────────┘

┌────────────────────────────────────────────────────────────────┐
│ Luxury Spa & Salon                         [Standard] ★ 4.8(124)│
├────────────────────────────────────────────────────────────────┤
│ ┌───────────────────────┐  ┌───────────────────────────────┐   │
│ │                       │  │ Address                        │   │
│ │                       │  │ 123 Main Street, Marrakech     │   │
│ │                       │  │                                │   │
│ │     [Salon Image]     │  │ Contact                        │   │
│ │                       │  │ 555-123-4567 • contact@...     │   │
│ │                       │  │                                │   │
│ │                       │  │ Services                       │   │
│ │                       │  │ [Spa] [Hair] [Nails] [Facial]  │   │
│ └───────────────────────┘  └───────────────────────────────┘   │
├────────────────────────────────────────────────────────────────┤
│                                 [View Public Page] [Edit Salon] │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│ Modern Beauty Center                        [Standard] ★ 4.2(87)│
│ ...                                                             │
└────────────────────────────────────────────────────────────────┘
```

## 2. Bookings Management

```
┌────────────────────────────────────────────────────────────────┐
│ Manage Bookings                                                │
│ View and manage customer appointments                          │
├────────────────────────────────────────────────────────────────┤
│ [Pending] [Confirmed] [Past]                                   │
├────────────────────────────────────────────────────────────────┤
│ Date: April 18, 2025 at 10:00 AM                              │
│ Service: Luxury Hammam Ritual (90 min)                        │
│ Customer: Test User                                           │
│ Status: Pending                                               │
│                                         [Confirm] [Cancel]     │
├────────────────────────────────────────────────────────────────┤
│ Date: April 19, 2025 at 2:30 PM                               │
│ Service: Signature Facial (60 min)                            │
│ Customer: Jane Smith                                          │
│ Status: Pending                                               │
│                                         [Confirm] [Cancel]     │
└────────────────────────────────────────────────────────────────┘
```

## 3. Services Management

```
┌────────────────────────────────────────────────────────────────┐
│ Manage Services                                                │
│ Add, edit, or remove services for your salon                   │
├────────────────────────────────────────────────────────────────┤
│ Salon: [Luxury Spa & Salon ▼]                [+ Add Service]   │
├────────────────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ Luxury Hammam Ritual                                     │   │
│ │ Category: Spa                                            │   │
│ │ 90 min • 600 MAD                                         │   │
│ │                                                          │   │
│ │ Traditional Moroccan hammam experience with full body    │   │
│ │ exfoliation and mask                                     │   │
│ │                                                          │   │
│ │                                        [Edit] [Delete]   │   │
│ └──────────────────────────────────────────────────────────┘   │
│                                                                │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ Signature Facial                                         │   │
│ │ Category: Facial                                         │   │
│ │ 60 min • 450 MAD                                         │   │
│ │                                                          │   │
│ │ Deep cleansing facial with premium products and massage  │   │
│ │                                                          │   │
│ │                                        [Edit] [Delete]   │   │
│ └──────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────┘
```

## 4. Service Add/Edit Form

```
┌────────────────────────────────────────────────────────────────┐
│ Add New Service                                                │
├────────────────────────────────────────────────────────────────┤
│ Salon: Luxury Spa & Salon                                      │
│                                                                │
│ Service Name: ______________________________                    │
│                                                                │
│ Category: [Select ▼]                                           │
│                                                                │
│ Description:                                                   │
│ ┌────────────────────────────────────────────────────────────┐ │
│ │                                                            │ │
│ └────────────────────────────────────────────────────────────┘ │
│                                                                │
│ Price (MAD): _________                                         │
│                                                                │
│ Discounted Price (Optional): _________                         │
│                                                                │
│ Duration (minutes): _________                                  │
│                                                                │
│ Image URL: ______________________________                      │
│                                                                │
│ Featured Service: [  ]                                         │
│                                                                │
│                                         [Cancel] [Save Service]│
└────────────────────────────────────────────────────────────────┘
```

## 5. Settings Page

```
┌────────────────────────────────────────────────────────────────┐
│ Salon Settings                                                 │
│ Configure your salon profile and business settings             │
├────────────────────────────────────────────────────────────────┤
│ Profile                                                        │
│ ┌────────────────────────────────────────────────────────────┐ │
│ │ Salon Name: ______________________________                  │ │
│ │                                                            │ │
│ │ Location: [Select City ▼]                                  │ │
│ │                                                            │ │
│ │ Address: ______________________________                    │ │
│ │                                                            │ │
│ │ Phone: ______________________________                      │ │
│ │                                                            │ │
│ │ Email: ______________________________                      │ │
│ │                                                            │ │
│ │ Description:                                               │ │
│ │ ┌────────────────────────────────────────────────────────┐ │ │
│ │ │                                                        │ │ │
│ │ └────────────────────────────────────────────────────────┘ │ │
│ │                                                            │ │
│ │ Categories: [Select Multiple ▼]                            │ │
│ │                                                            │ │
│ │ Price Range: Min ________ Max ________                     │ │
│ │                                                            │ │
│ │ Images:                                                    │ │
│ │ ______________________________  [+ Add More]              │ │
│ │                                                            │ │
│ │ Featured Salon: [  ]                                       │ │
│ │                                                            │ │
│ │                                              [Save Changes]│ │
│ └────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
```

## 6. Analytics (Future Enhancement)

```
┌────────────────────────────────────────────────────────────────┐
│ Salon Analytics                                                │
│ View business performance metrics                              │
├────────────────────────────────────────────────────────────────┤
│ Period: [Last 30 Days ▼]                                       │
│                                                                │
│ ┌───────────────┐ ┌─────────────────┐ ┌───────────────┐        │
│ │ Total         │ │ Revenue         │ │ New           │        │
│ │ Bookings      │ │                 │ │ Customers     │        │
│ │               │ │                 │ │               │        │
│ │ 24            │ │ 12,450 MAD      │ │ 8             │        │
│ └───────────────┘ └─────────────────┘ └───────────────┘        │
│                                                                │
│ ┌────────────────────────────────────────────────────────────┐ │
│ │                                                            │ │
│ │                                                            │ │
│ │                                                            │ │
│ │                   [Bookings Chart]                         │ │
│ │                                                            │ │
│ │                                                            │ │
│ │                                                            │ │
│ └────────────────────────────────────────────────────────────┘ │
│                                                                │
│ Top Services                                                   │
│ 1. Luxury Hammam Ritual - 10 bookings                         │
│ 2. Signature Facial - 8 bookings                              │
│ 3. Hot Stone Massage - 6 bookings                             │
└────────────────────────────────────────────────────────────────┘
```

## 7. Business Account Settings (Future Enhancement)

```
┌────────────────────────────────────────────────────────────────┐
│ Business Account Settings                                      │
│ Manage your owner account and notification preferences         │
├────────────────────────────────────────────────────────────────┤
│ Personal Information                                           │
│ Name: Salon Owner                                              │
│ Email: owner@example.com                                       │
│ Phone: 0987654321                                              │
│                                                [Edit Profile]  │
│                                                                │
│ Notification Preferences                                       │
│ [✓] Email notifications for new bookings                       │
│ [✓] SMS notifications for new bookings                         │
│ [✓] Daily booking summary                                      │
│ [ ] Marketing updates                                          │
│                                          [Save Preferences]    │
│                                                                │
│ Payment Information                                            │
│ Bank Account: ●●●● ●●●● ●●●● 1234                             │
│ Payment Terms: Standard (7 days)                               │
│                                        [Update Payment Info]   │
└────────────────────────────────────────────────────────────────┘
```