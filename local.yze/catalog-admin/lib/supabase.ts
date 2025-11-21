import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Brand = {
  id: string
  name: string
  image_url?: string
  created_at: string
}

export type Product = {
  id: string
  brand_id?: string
  name: string
  price?: number
  description?: string
  category?: string
  subcategory?: string
  image_url?: string
  custom_fields?: Record<string, any>
  created_at: string
  brand?: Brand
}

export type ImportLog = {
  id: string
  type: 'excel' | 'url'
  file_url?: string
  source_url?: string
  created_at: string
}