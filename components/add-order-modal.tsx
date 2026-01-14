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

interface OrderFormData {
  customer: string
  email: string
  amount: string
  items: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  notes: string
}

interface AddOrderModalProps {
  onAddOrder: (order: any) => void
  trigger?: React.ReactNode
}

export default function AddOrderModal({ onAddOrder, trigger }: AddOrderModalProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<OrderFormData>({
    customer: "",
    email: "",
    amount: "",
    items: "",
    status: "pending",
    notes: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newOrder = {
      id: `ORD-${Date.now()}`,
      customer: formData.customer,
      email: formData.email,
      amount: parseFloat(formData.amount),
      status: formData.status,
      date: new Date().toISOString().split("T")[0],
      items: parseInt(formData.items),
      notes: formData.notes
    }
    
    onAddOrder(newOrder)
    setOpen(false)
    
    // Reset form
    setFormData({
      customer: "",
      email: "",
      amount: "",
      items: "",
      status: "pending",
      notes: ""
    })
  }

  const handleInputChange = (field: keyof OrderFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" variant="outline" className="h-10 gap-1 rounded-xl">
            <Plus className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only">Add Order</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Order</DialogTitle>
          <DialogDescription>
            Create a new customer order. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="customer">Customer Name</Label>
              <Input
                id="customer"
                value={formData.customer}
                onChange={(e) => handleInputChange("customer", e.target.value)}
                placeholder="e.g., John Doe"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="john@example.com"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                  placeholder="125.00"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="items">Items</Label>
                <Input
                  id="items"
                  type="number"
                  min="1"
                  value={formData.items}
                  onChange={(e) => handleInputChange("items", e.target.value)}
                  placeholder="2"
                  required
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="notes">Order Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Special instructions or notes..."
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Order</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}