# ETAHA - Wheelchair Parts & Maintenance Platform

A comprehensive web platform for wheelchair parts ordering and maintenance service booking, built with Next.js, React, and Supabase.

## Features

- **User Authentication**: Secure email/password authentication with user profiles
- **Parts Catalog**: Browse and search wheelchair parts by category
- **Shopping Cart**: Add items to cart and checkout with address management
- **Maintenance Booking**: Schedule professional wheelchair maintenance services
- **Order Tracking**: View order history and track status
- **Service Requests**: Monitor maintenance request status
- **Profile Management**: Update personal information and manage addresses

## Tech Stack

- **Frontend**: Next.js 13, React, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Icons**: Lucide React

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Supabase

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project
3. Copy your project URL and anon key
4. Update `.env.local` with your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 3. Database Setup

The database schema and sample data have already been created through migrations:

- User profiles
- Product categories (Wheels & Tires, Cushions & Seating, Brakes & Axles, Accessories)
- Sample products (15 wheelchair parts)
- Cart functionality
- Order management
- Maintenance request tracking
- Address management

All tables have Row Level Security (RLS) enabled for data protection.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### 5. Build for Production

```bash
npm run build
npm start
```

## Application Structure

```
/app
  /dashboard          - Protected dashboard pages
    /cart            - Shopping cart and checkout
    /maintenance     - Book maintenance services
    /orders          - Order history
    /parts           - Browse parts catalog
    /profile         - User profile settings
    /requests        - Maintenance requests
  /login             - Login page
  /register          - Registration page
  page.tsx           - Landing page

/components
  /ui                - shadcn/ui components
  dashboard-layout.tsx - Dashboard navigation layout

/lib
  auth-context.tsx   - Authentication context
  supabase.ts        - Supabase client configuration
  utils.ts           - Utility functions
```

## Database Schema

### Tables

- **profiles**: User profile information
- **addresses**: User delivery/service addresses
- **categories**: Product categories
- **products**: Wheelchair parts catalog
- **cart_items**: Shopping cart items
- **orders**: Order records
- **order_items**: Order line items
- **maintenance_requests**: Service requests

## User Workflow

1. **Registration**: Create account with email, password, name, and phone
2. **Login**: Sign in to access dashboard
3. **Browse Parts**: Search and filter wheelchair parts by category
4. **Add to Cart**: Select items and quantities
5. **Checkout**: Choose delivery address and complete order
6. **Book Maintenance**: Schedule service with preferred date/time
7. **Track Orders**: Monitor order and service request status
8. **Manage Profile**: Update personal information and addresses

## Design Features

- Modern, clean interface with teal (#17a2b8) and navy (#0d5a7d) color scheme
- Responsive design for mobile, tablet, and desktop
- Smooth animations and transitions
- Accessible UI components
- Real-time cart updates
- Form validation and error handling

## Security

- Row Level Security (RLS) on all database tables
- Authenticated user policies
- Secure password handling
- Environment variable protection
- HTTPS-only connections (production)

## Support

For issues or questions, please check the database structure and ensure all environment variables are correctly configured.

---

Built with Next.js and Supabase
