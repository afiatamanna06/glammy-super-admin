"use client";

import { useState } from "react";
import {
  Package,
  User,
  Calendar,
  DollarSign,
  Mail,
  Phone,
  MapPin,
  Truck,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Order {
  id: string;
  customer: string;
  email: string;
  phone?: string;
  date: string;
  amount: number;
  items: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  address?: string;
  products?: Array<{
    name: string;
    quantity: number;
    price: number;
    sku?: string;
  }>;
  shippingMethod?: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
}

interface OrderDetailsModalProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
}

export default function OrderDetailsModal({
  order,
  open,
  onClose,
}: OrderDetailsModalProps) {
  if (!order) return null;

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/15 text-yellow-600 border-yellow-500/30";
      case "processing":
        return "bg-blue-500/15 text-blue-600 border-blue-500/30";
      case "shipped":
        return "bg-purple-500/15 text-purple-600 border-purple-500/30";
      case "delivered":
        return "bg-green-500/15 text-green-600 border-green-500/30";
      case "cancelled":
        return "bg-red-500/15 text-red-600 border-red-500/30";
      default:
        return "bg-gray-500/15 text-gray-600 border-gray-500/30";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-background">
        <DialogHeader>
          <div>
            <DialogTitle className="text-2xl font-bold text-foreground">
              Order Details
            </DialogTitle>
            <DialogDescription className="mt-1 text-foreground">
              Complete information for order #{order.id}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Status */}
          <div className="rounded-xl bg-gradient-to-r from-blue-950 to-purple-950 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Order Status
                  </p>
                  <Badge
                    variant="outline"
                    className={getStatusColor(order.status)}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">
                  Order Date
                </p>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-foreground" />
                  <span className="text-sm text-foreground">{order.date}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
              <User className="h-5 w-5" />
              Customer Information
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Name
                  </label>
                  <p className="font-medium text-foreground">
                    {order.customer}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Email
                  </label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-foreground" />
                    <p className="font-medium text-foreground">{order.email}</p>
                  </div>
                </div>
                {order.phone && (
                  <div>
                    <label className="text-sm font-medium text-foreground">
                      Phone
                    </label>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-foreground" />
                      <p className="font-medium text-foreground">
                        {order.phone}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              {order.address && (
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Shipping Address
                  </label>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <p className="font-medium text-foreground">
                      {order.address}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Order Summary */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
              <DollarSign className="h-5 w-5" />
              Order Summary
            </h3>
            <div className="rounded-lg bg-gray-900 p-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-foreground">
                    Subtotal ({order.items} items)
                  </span>
                  <span className="font-medium">
                    {formatCurrency(order.amount * 0.9)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground">Shipping</span>
                  <span className="font-medium">
                    {formatCurrency(order.amount * 0.05)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground">Tax</span>
                  <span className="font-medium">
                    {formatCurrency(order.amount * 0.05)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold text-foreground">
                  <span>Total</span>
                  <span>{formatCurrency(order.amount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          {(order.shippingMethod ||
            order.estimatedDelivery ||
            order.trackingNumber) && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
                  <Truck className="h-5 w-5" />
                  Shipping Information
                </h3>
                <div className="grid gap-4 md:grid-cols-3">
                  {order.shippingMethod && (
                    <div>
                      <label className="text-sm font-medium text-foreground">
                        Method
                      </label>
                      <p className="font-medium text-foreground">
                        {order.shippingMethod}
                      </p>
                    </div>
                  )}
                  {order.estimatedDelivery && (
                    <div>
                      <label className="text-sm font-medium text-foreground">
                        Est. Delivery
                      </label>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <p className="font-medium text-foreground">
                          {order.estimatedDelivery}
                        </p>
                      </div>
                    </div>
                  )}
                  {order.trackingNumber && (
                    <div>
                      <label className="text-sm font-medium text-foreground">
                        Tracking #
                      </label>
                      <p className="font-mono text-sm text-foreground">
                        {order.trackingNumber}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Product Details */}
          {order.products && order.products.length > 0 && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
                  <Package className="h-5 w-5" />
                  Products ({order.products.length})
                </h3>
                <div className="space-y-3">
                  {order.products.map((product, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg bg-gray-900 p-3"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground">
                          {product.name}
                        </p>
                        {product.sku && (
                          <p className="text-sm text-foreground">
                            SKU: {product.sku}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-foreground">
                          Qty: {product.quantity}
                        </p>
                        <p className="text-sm text-foreground">
                          {formatCurrency(product.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            onClick={() => {
              // You can add print or export functionality here
              window.print();
            }}
          >
            Print Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
