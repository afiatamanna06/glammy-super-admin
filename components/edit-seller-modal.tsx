"use client"

import { useState, useEffect } from "react"
import { Edit, Palette, Store, MapPin, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

type SellerRole = "designer" | "seller"
type SellerStatus = "active" | "pending" | "suspended"

interface SellerFormData {
  name: string
  storeName: string
  location: string
  email: string
  phone: string
  role: SellerRole
  status: SellerStatus
  bio: string
}

interface EditSellerModalProps {
  seller?: {
    id: string
    name: string
    storeName: string
    location: string
    status: SellerStatus
    role: SellerRole
  }
  open: boolean
  onOpenChange: (open: boolean) => void
  onEditSeller: (updatedSeller: any) => void
}

export default function EditSellerModal({ 
  seller, 
  open, 
  onOpenChange, 
  onEditSeller 
}: EditSellerModalProps) {
  const [formData, setFormData] = useState<SellerFormData>({
    name: seller?.name || "",
    storeName: seller?.storeName || "",
    location: seller?.location || "",
    email: "",
    phone: "",
    role: seller?.role || "seller",
    status: seller?.status || "pending",
    bio: ""
  })

  useEffect(() => {
    if (seller) {
      setFormData({
        name: seller.name || "",
        storeName: seller.storeName || "",
        location: seller.location || "",
        email: "",
        phone: "",
        role: seller.role || "seller",
        status: seller.status || "pending",
        bio: ""
      })
    }
  }, [seller])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const updatedSeller = {
      ...seller,
      name: formData.name,
      storeName: formData.storeName,
      location: formData.location,
      role: formData.role,
      status: formData.status
    }
    
    onEditSeller(updatedSeller)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Seller Profile</DialogTitle>
          <DialogDescription>
            Update the seller's information and settings.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="pl-8"
                  required
                />
                <Edit className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="storeName">Store Name</Label>
              <div className="relative">
                <Input
                  id="storeName"
                  value={formData.storeName}
                  onChange={(e) => setFormData(prev => ({ ...prev, storeName: e.target.value }))}
                  className="pl-8"
                  required
                />
                {formData.role === "designer" ? (
                  <Palette className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                ) : (
                  <Store className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="pl-8"
                  required
                />
                <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: SellerRole) => setFormData(prev => ({ ...prev, role: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="designer">Designer</SelectItem>
                    <SelectItem value="seller">Seller</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: SellerStatus) => setFormData(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="pl-8"
                />
                <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <div className="relative">
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="pl-8"
                />
                <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Brief description about the seller..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}