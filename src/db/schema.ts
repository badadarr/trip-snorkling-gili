import { pgTable, serial, text, integer, boolean, timestamp, date, json } from 'drizzle-orm/pg-core';

// 1. Hero Section Content
export const heroSection = pgTable('hero_section', {
  id: serial('id').primaryKey(),
  badgeId: text('badge_id').default('Spot Snorkeling #1 di Gili Trawangan'),
  badgeEn: text('badge_en').default('#1 Snorkeling Destination in Gili Trawangan'),
  titleId: text('title_id').notNull(),
  titleEn: text('title_en').notNull(),
  subtitleId: text('subtitle_id'),
  subtitleEn: text('subtitle_en'),
  backgroundImage: text('background_image').default('https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop'),
  ctaTextId: text('cta_text_id').default('Pesan Trip Sekarang'),
  ctaTextEn: text('cta_text_en').default('Book Your Trip Now'),
  ctaLink: text('cta_link').default('/booking'),
  secondaryCtaId: text('secondary_cta_id').default('Lihat Paket'),
  secondaryCtaEn: text('secondary_cta_en').default('Explore Packages'),
  secondaryCtaLink: text('secondary_cta_link').default('/paket'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 2. Packages (Snorkeling Trip Packages)
export const packages = pgTable('packages', {
  id: serial('id').primaryKey(),
  slug: text('slug').unique().notNull(),
  nameId: text('name_id').notNull(),
  nameEn: text('name_en').notNull(),
  tagId: text('tag_id').default('Paling Populer'),
  tagEn: text('tag_en').default('Most Popular'),
  descriptionId: text('description_id').notNull(),
  descriptionEn: text('description_en').notNull(),
  price: integer('price').notNull(), // in IDR (e.g. 150000)
  priceUsd: integer('price_usd').notNull(), // in USD (e.g. 10)
  durationId: text('duration_id').default('4 - 5 Jam'),
  durationEn: text('duration_en').default('4 - 5 Hours'),
  scheduleId: text('schedule_id').default('Pagi (09:30) & Siang (13:00)'),
  scheduleEn: text('schedule_en').default('Morning (09:30) & Afternoon (13:00)'),
  includesId: json('includes_id').$type<string[]>(),
  includesEn: json('includes_en').$type<string[]>(),
  spotsId: json('spots_id').$type<string[]>(), // e.g. ["Turtle Point (Gili Meno)", "Statue / Patung Bawah Air (Bask Nest)", "Coral Garden (Gili Air)"]
  spotsEn: json('spots_en').$type<string[]>(),
  imageUrl: text('image_url').notNull(),
  isFeatured: boolean('is_featured').default(false),
  isActive: boolean('is_active').default(true),
  orderIndex: integer('order_index').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 3. Gallery (Underwater & Island Photos)
export const gallery = pgTable('gallery', {
  id: serial('id').primaryKey(),
  imageUrl: text('image_url').notNull(),
  titleId: text('title_id').notNull(),
  titleEn: text('title_en').notNull(),
  category: text('category').default('underwater'), // underwater, turtles, statues, sunset, boats
  orderIndex: integer('order_index').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

// 4. Testimonials (Customer Reviews)
export const testimonials = pgTable('testimonials', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  origin: text('origin').default('Jakarta, Indonesia'),
  countryCode: text('country_code').default('ID'),
  rating: integer('rating').default(5),
  tripType: text('trip_type').default('Private Glass Bottom Boat'),
  contentId: text('content_id').notNull(),
  contentEn: text('content_en').notNull(),
  avatarUrl: text('avatar_url'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

// 5. FAQ (Frequently Asked Questions)
export const faq = pgTable('faq', {
  id: serial('id').primaryKey(),
  questionId: text('question_id').notNull(),
  questionEn: text('question_en').notNull(),
  answerId: text('answer_id').notNull(),
  answerEn: text('answer_en').notNull(),
  category: text('category').default('general'), // general, booking, equipment, safety
  orderIndex: integer('order_index').default(0),
  isActive: boolean('is_active').default(true),
});

// 6. Bookings (Customer trip reservations)
export const bookings = pgTable('bookings', {
  id: serial('id').primaryKey(),
  bookingCode: text('booking_code').unique().notNull(),
  packageId: integer('package_id').references(() => packages.id, { onDelete: 'set null' }),
  packageName: text('package_name').notNull(),
  customerName: text('customer_name').notNull(),
  customerEmail: text('customer_email').notNull(),
  customerPhone: text('customer_phone').notNull(),
  numberOfPeople: integer('number_of_people').notNull(),
  tripDate: text('trip_date').notNull(),
  tripSession: text('trip_session').default('morning'), // morning, afternoon, custom
  pickupLocation: text('pickup_location'),
  specialRequests: text('special_requests'),
  totalPriceIdr: integer('total_price_idr').notNull(),
  totalPriceUsd: integer('total_price_usd'),
  status: text('status').default('pending'), // pending, confirmed, completed, cancelled
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 7. About Section
export const aboutSection = pgTable('about_section', {
  id: serial('id').primaryKey(),
  titleId: text('title_id').default('Tentang Trip Snorkeling Gili Trawangan'),
  titleEn: text('title_en').default('About Trip Snorkeling Gili Trawangan'),
  subtitleId: text('subtitle_id').default('Penyedia Wisata Snorkeling Terpercaya & Berpengalaman di 3 Gili'),
  subtitleEn: text('subtitle_en').default('Trusted & Experienced Snorkeling Tour Operator across the 3 Gili Islands'),
  storyId: text('story_id').notNull(),
  storyEn: text('story_en').notNull(),
  imageUrl: text('image_url').default('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop'),
  stats: json('stats').$type<{ number: string; labelId: string; labelEn: string }[]>(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 8. Site Settings (WhatsApp, Email, Address, Socials, SEO)
export const siteSettings = pgTable('site_settings', {
  id: serial('id').primaryKey(),
  key: text('key').unique().notNull(),
  value: text('value').notNull(),
  section: text('section').default('general'),
  label: text('label'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 9. Admin Users
export const admins = pgTable('admins', {
  id: serial('id').primaryKey(),
  email: text('email').unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  name: text('name').notNull(),
  role: text('role').default('superadmin'),
  lastLogin: timestamp('last_login'),
  createdAt: timestamp('created_at').defaultNow(),
});
