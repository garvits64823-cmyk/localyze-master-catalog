import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import * as XLSX from 'xlsx'

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type')
    let data: any[]

    if (contentType?.includes('multipart/form-data')) {
      // File upload
      const formData = await request.formData()
      const file = formData.get('file') as File
      const buffer = await file.arrayBuffer()
      const workbook = XLSX.read(buffer)
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      data = XLSX.utils.sheet_to_json(worksheet)
    } else {
      // URL import
      const { url } = await request.json()
      const response = await fetch(url)
      const buffer = await response.arrayBuffer()
      const workbook = XLSX.read(buffer)
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      data = XLSX.utils.sheet_to_json(worksheet)
    }

    // Process data - separate brands and products
    const brands = new Set()
    const products: any[] = []

    data.forEach((row: any) => {
      if (row.brand_name) brands.add(row.brand_name)
      
      products.push({
        name: row.name || row.product_name,
        brand_name: row.brand_name,
        price: row.price ? parseFloat(row.price) : null,
        description: row.description,
        category: row.category,
        subcategory: row.subcategory || row.sub_category,
        image_url: row.image_url
      })
    })

    // Insert brands first
    const brandMap = new Map()
    for (const brandName of brands) {
      const { data: brandData } = await supabase
        .from('brands')
        .upsert({ name: brandName }, { onConflict: 'name' })
        .select()
      if (brandData?.[0]) brandMap.set(brandName, brandData[0].id)
    }

    // Insert products with brand IDs
    const productsToInsert = products.map(product => ({
      ...product,
      brand_id: product.brand_name ? brandMap.get(product.brand_name) : null,
      brand_name: undefined
    }))

    const { error } = await supabase.from('products').upsert(productsToInsert, { onConflict: 'name' })
    if (error) throw error

    // Log the import
    await supabase.from('import_logs').insert({
      type: contentType?.includes('multipart/form-data') ? 'excel' : 'url',
      file_url: contentType?.includes('multipart/form-data') ? 'uploaded_file' : undefined,
      source_url: contentType?.includes('multipart/form-data') ? undefined : url
    })

    return NextResponse.json({ success: true, imported: data.length })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}