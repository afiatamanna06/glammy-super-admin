"use client";

import { useState } from "react";
import {
  Check,
  X,
  User,
  Store,
  MapPin,
  Calendar,
  Star,
  Shield,
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface Seller {
  id: string;
  name: string;
  role: "designer" | "seller";
  storeName: string;
  location: string;
  status: "active" | "pending" | "suspended";
  rating: number;
  totalSales: number;
  joinedDate: string;
  avatar?: string;
  verificationDocuments?: string[];
  businessLicense?: string;
  taxId?: string;
}

interface VerifySellerModalProps {
  seller: Seller | null;
  open: boolean;
  onClose: () => void;
  onVerify: (
    sellerId: string,
    status: "active" | "rejected",
    notes?: string
  ) => void;
}

export default function VerifySellerModal({
  seller,
  open,
  onClose,
  onVerify,
}: VerifySellerModalProps) {
  const [notes, setNotes] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  if (!seller) return null;

  const handleVerify = async (status: "active" | "rejected") => {
    setIsVerifying(true);
    try {
      await onVerify(seller.id, status, notes);
      setNotes("");
      onClose();
    } catch (error) {
      console.error("Verification failed:", error);
    } finally {
      setIsVerifying(false);
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-background">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-foreground">
                <Shield className="h-6 w-6 text-blue-600" />
                Verify Seller Account
              </DialogTitle>
              <DialogDescription className="mt-1 text-foreground">
                Review and verify {seller.name}'s seller account
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Seller Information */}
          <div className="rounded-xl bg-gradient-to-r from-blue-950 to-purple-950 p-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Name
                  </label>
                  <p className="font-medium text-lg">{seller.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Business License
                  </label>
                  <div className="flex items-center gap-2">
                    <Store className="h-4 w-4 text-foreground" />
                    <p className="font-medium text-foreground">
                      {seller.storeName}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Business Address
                  </label>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-foreground" />
                    <p className="font-medium text-foreground">
                      {seller.location}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Role
                  </label>
                  <Badge variant="outline" className="capitalize">
                    {seller.role}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Joined Date
                  </label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-foreground" />
                    <p className="font-medium text-foreground">
                      {seller.joinedDate}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Current Rating
                  </label>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <p className="font-medium text-foreground">
                      {seller.rating}/5.0
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Requirements */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              Verification Requirements
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium text-foreground">
                    Business License
                  </p>
                  <p className="text-sm text-foreground">
                    Required for commercial sellers
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="bg-green-100 text-green-700 border-green-200"
                >
                  Verified
                </Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium text-foreground">
                    Tax ID Verification
                  </p>
                  <p className="text-sm text-foreground">
                    Required for tax purposes
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="bg-green-100 text-green-700 border-green-200"
                >
                  Verified
                </Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium text-foreground">
                    Identity Verification
                  </p>
                  <p className="text-sm text-foreground">
                    Government ID required
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="bg-yellow-100 text-yellow-700 border-yellow-200"
                >
                  Pending
                </Badge>
              </div>
            </div>
          </div>

          {/* Review Notes */}
          <div className="space-y-2">
            <Label htmlFor="verification-notes">Review Notes (Optional)</Label>
            <Textarea
              id="verification-notes"
              placeholder="Add any notes about the verification process..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Sales Performance */}
          <div className="rounded-lg bg-gray-900 p-4">
            <h4 className="font-medium mb-2 text-foreground">
              Sales Performance
            </h4>
            <div className="grid gap-2 md:grid-cols-2">
              <div>
                <p className="text-sm text-foreground">Total Sales</p>
                <p className="font-semibold text-lg text-foreground">
                  {formatCurrency(seller.totalSales)}
                </p>
              </div>
              <div>
                <p className="text-sm text-foreground">Account Status</p>
                <Badge
                  variant="outline"
                  className={
                    seller.status === "active"
                      ? "bg-green-100 text-green-700 border-green-200"
                      : seller.status === "pending"
                      ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                      : "bg-red-100 text-red-700 border-red-200"
                  }
                >
                  {seller.status.charAt(0).toUpperCase() +
                    seller.status.slice(1)}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isVerifying}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleVerify("rejected")}
            disabled={isVerifying}
            className="bg-red-600 hover:bg-red-700"
          >
            Reject Application
          </Button>
          <Button
            onClick={() => handleVerify("active")}
            disabled={isVerifying}
            className="bg-green-600 hover:bg-green-700"
          >
            <Check className="mr-2 h-4 w-4" />
            Approve Seller
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
