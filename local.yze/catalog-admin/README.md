# Catalog Admin

Private admin-only catalog management system built with Next.js 14, React, Tailwind CSS, and Supabase.

## Features

- ✅ Manage brands (create, edit, delete)
- ✅ Manage products under brands or as non-branded
- ✅ Import catalog from Excel files or URLs
- ✅ API endpoints for future app integration
- ✅ Responsive admin dashboard

## Setup

1. **Environment Variables**
   Update `.env.local` with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

2. **Database Setup**
   Run the SQL in `supabase-schema.sql` in your Supabase SQL editor.

3. **Install & Run**
   ```bash
   npm install
   npm run dev
   ```

## API Endpoints

- `GET/POST/PUT/DELETE /api/brands` - Brand management
- `GET/POST/PUT/DELETE /api/products` - Product management  
- `POST /api/import` - Import from Excel file or URL

## Import Format

Excel/CSV should have columns:
- `name` or `product_name` (required)
- `brand_name` (optional)
- `price` (optional)
- `description` (optional)
- `category` (optional)
- `sub_category` (optional)
- `image_url` (optional)