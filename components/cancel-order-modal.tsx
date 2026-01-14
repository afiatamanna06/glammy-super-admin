"use client"

import { useState } from "react"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface CancelOrderModalProps {
  order: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onCancelOrder: (orderId: string) => void
}

export default function CancelOrderModal({ order, open, onOpenChange, onCancelOrder }: CancelOrderModalProps) {
  const handleCancel = () => {
    onCancelOrder(order.id)
    onOpenChange(false)
  }

  if (!order) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Cancel Order
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to cancel order "{order.id}" for {order.customer}? 
            This action cannot be undone and will refund the customer ${order.amount.toFixed(2)}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep Order</AlertDialogCancel>
          <AlertDialogAction onClick={handleCancel} className="bg-destructive text-destructive-foreground">
            Cancel Order
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}