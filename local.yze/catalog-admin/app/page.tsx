'use client'

import { useState, useEffect } from 'react'
import { supabase, Brand, Product } from '@/lib/supabase'

export default function AdminDashboard() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [activeTab, setActiveTab] = useState<'brands' | 'products' | 'import'>('brands')
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  useEffect(() => {
    loadBrands()
    loadProducts()
  }, [])

  const loadBrands = async () => {
    const { data } = await supabase.from('brands').select('*').order('name')
    setBrands(data || [])
  }

  const loadProducts = async () => {
    const { data } = await supabase.from('products').select('*, brand:brands(*)').order('name')
    setProducts(data || [])
  }

  const saveBrand = async (brand: Partial<Brand>) => {
    if (editingBrand) {
      await supabase.from('brands').update(brand).eq('id', editingBrand.id)
    } else {
      await supabase.from('brands').insert(brand)
    }
    setEditingBrand(null)
    loadBrands()
  }

  const saveProduct = async (product: Partial<Product>) => {
    if (editingProduct) {
      await supabase.from('products').update(product).eq('id', editingProduct.id)
    } else {
      await supabase.from('products').insert(product)
    }
    setEditingProduct(null)
    loadProducts()
  }

  const deleteBrand = async (id: string) => {
    await supabase.from('brands').delete().eq('id', id)
    loadBrands()
    loadProducts()
  }

  const deleteProduct = async (id: string) => {
    await supabase.from('products').delete().eq('id', id)
    loadProducts()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Catalog Admin</h1>
        
        <div className="flex space-x-4 mb-6">
          {(['brands', 'products', 'import'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded ${activeTab === tab ? 'bg-blue-500 text-white' : 'bg-white'}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'brands' && (
          <BrandsTab 
            brands={brands} 
            onEdit={setEditingBrand} 
            onDelete={deleteBrand}
            editing={editingBrand}
            onSave={saveBrand}
            onCancel={() => setEditingBrand(null)}
          />
        )}

        {activeTab === 'products' && (
          <ProductsTab 
            products={products}
            brands={brands}
            onEdit={setEditingProduct}
            onDelete={deleteProduct}
            editing={editingProduct}
            onSave={saveProduct}
            onCancel={() => setEditingProduct(null)}
          />
        )}

        {activeTab === 'import' && <ImportTab onImport={() => { loadBrands(); loadProducts() }} />}
      </div>
    </div>
  )
}

function BrandsTab({ brands, onEdit, onDelete, editing, onSave, onCancel }: any) {
  const [form, setForm] = useState({ name: '', image_url: '' })

  useEffect(() => {
    if (editing) setForm(editing)
    else setForm({ name: '', image_url: '' })
  }, [editing])

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">{editing ? 'Edit' : 'Add'} Brand</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="Brand Name"
            value={form.name}
            onChange={e => setForm({...form, name: e.target.value})}
            className="border p-2 rounded"
          />
          <input
            placeholder="Image URL"
            value={form.image_url}
            onChange={e => setForm({...form, image_url: e.target.value})}
            className="border p-2 rounded"
          />
        </div>
        <div className="mt-4 space-x-2">
          <button onClick={() => onSave(form)} className="bg-blue-500 text-white px-4 py-2 rounded">
            {editing ? 'Update' : 'Add'}
          </button>
          {editing && <button onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Image</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand: Brand) => (
              <tr key={brand.id} className="border-t">
                <td className="px-6 py-4">{brand.name}</td>
                <td className="px-6 py-4">{brand.image_url ? '✓' : '-'}</td>
                <td className="px-6 py-4 space-x-2">
                  <button onClick={() => onEdit(brand)} className="text-blue-600">Edit</button>
                  <button onClick={() => onDelete(brand.id)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ProductsTab({ products, brands, onEdit, onDelete, editing, onSave, onCancel }: any) {
  const [form, setForm] = useState({ name: '', brand_id: '', price: '', description: '', category: '', subcategory: '', image_url: '' })

  useEffect(() => {
    if (editing) setForm({...editing, price: editing.price?.toString() || ''})
    else setForm({ name: '', brand_id: '', price: '', description: '', category: '', subcategory: '', image_url: '' })
  }, [editing])

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">{editing ? 'Edit' : 'Add'} Product</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            placeholder="Product Name"
            value={form.name}
            onChange={e => setForm({...form, name: e.target.value})}
            className="border p-2 rounded"
          />
          <select
            value={form.brand_id}
            onChange={e => setForm({...form, brand_id: e.target.value})}
            className="border p-2 rounded"
          >
            <option value="">No Brand</option>
            {brands.map((brand: Brand) => (
              <option key={brand.id} value={brand.id}>{brand.name}</option>
            ))}
          </select>
          <input
            placeholder="Price"
            type="number"
            value={form.price}
            onChange={e => setForm({...form, price: e.target.value})}
            className="border p-2 rounded"
          />
          <input
            placeholder="Category"
            value={form.category}
            onChange={e => setForm({...form, category: e.target.value})}
            className="border p-2 rounded"
          />
          <input
            placeholder="Subcategory"
            value={form.subcategory}
            onChange={e => setForm({...form, subcategory: e.target.value})}
            className="border p-2 rounded"
          />
          <input
            placeholder="Description"
            value={form.description}
            onChange={e => setForm({...form, description: e.target.value})}
            className="border p-2 rounded"
          />
          <input
            placeholder="Image URL"
            value={form.image_url}
            onChange={e => setForm({...form, image_url: e.target.value})}
            className="border p-2 rounded"
          />
        </div>
        <div className="mt-4 space-x-2">
          <button onClick={() => onSave({...form, price: form.price ? parseFloat(form.price) : null})} className="bg-blue-500 text-white px-4 py-2 rounded">
            {editing ? 'Update' : 'Add'}
          </button>
          {editing && <button onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Brand</th>
              <th className="px-6 py-3 text-left">Price</th>
              <th className="px-6 py-3 text-left">Category</th>
              <th className="px-6 py-3 text-left">Subcategory</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product: Product) => (
              <tr key={product.id} className="border-t">
                <td className="px-6 py-4">{product.name}</td>
                <td className="px-6 py-4">{product.brand?.name || 'No Brand'}</td>
                <td className="px-6 py-4">{product.price ? `$${product.price}` : '-'}</td>
                <td className="px-6 py-4">{product.category}</td>
                <td className="px-6 py-4">{product.subcategory}</td>
                <td className="px-6 py-4 space-x-2">
                  <button onClick={() => onEdit(product)} className="text-blue-600">Edit</button>
                  <button onClick={() => onDelete(product.id)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ImportTab({ onImport }: any) {
  const [file, setFile] = useState<File | null>(null)
  const [url, setUrl] = useState('')

  const handleFileImport = async () => {
    if (!file) return
    
    const formData = new FormData()
    formData.append('file', file)
    
    await fetch('/api/import', {
      method: 'POST',
      body: formData
    })
    
    onImport()
    setFile(null)
  }

  const handleUrlImport = async () => {
    if (!url) return
    
    await fetch('/api/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    })
    
    onImport()
    setUrl('')
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Import from Excel</h2>
        <div className="space-y-4">
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={e => setFile(e.target.files?.[0] || null)}
            className="border p-2 rounded w-full"
          />
          <button 
            onClick={handleFileImport}
            disabled={!file}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
          >
            Import File
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Import from URL</h2>
        <div className="space-y-4">
          <input
            placeholder="Excel/CSV URL"
            value={url}
            onChange={e => setUrl(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <button 
            onClick={handleUrlImport}
            disabled={!url}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
          >
            Import from URL
          </button>
        </div>
      </div>
    </div>
  )
}