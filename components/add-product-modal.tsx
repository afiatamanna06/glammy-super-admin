"use client"

import { useState } from "react"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface ProductFormData {
  name: string
  category: string
  price: string
  inventory: string
  description: string
  status: "in_stock" | "low_stock" | "out_of_stock"
}

interface AddProductModalProps {
  onAddProduct: (product: any) => void
  trigger?: React.ReactNode
}

export default function AddProductModal({ onAddProduct, trigger }: AddProductModalProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    category: "",
    price: "",
    inventory: "",
    description: "",
    status: "in_stock"
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newProduct = {
      id: `PRD-${Date.now()}`,
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      status: formData.status,
      inventory: parseInt(formData.inventory),
      description: formData.description
    }
    
    onAddProduct(newProduct)
    setOpen(false)
    
    // Reset form
    setFormData({
      name: "",
      category: "",
      price: "",
      inventory: "",
      description: "",
      status: "in_stock"
    })
  }

  const handleInputChange = (field: keyof ProductFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" className="h-10 gap-1 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Plus className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only">Add Product</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Add a new fashion product to your catalog. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="e.g., Silk Summer Dress"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                placeholder="e.g., Dresses, Accessories, Shoes"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="129.99"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="inventory">Inventory</Label>
                <Input
                  id="inventory"
                  type="number"
                  min="0"
                  value={formData.inventory}
                  onChange={(e) => handleInputChange("inventory", e.target.value)}
                  placeholder="50"
                  required
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="status">Stock Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in_stock">In Stock</SelectItem>
                  <SelectItem value="low_stock">Low Stock</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe your product..."
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Product</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}