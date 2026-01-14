"use client";

import { useState } from "react";
import {
  BadgeCheck,
  Edit,
  Mail,
  MapPin,
  MoreHorizontal,
  Palette,
  Search,
  Star,
  Store,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EditSellerModal from "@/components/edit-seller-modal";
import ContactSellerModal from "@/components/contact-seller-modal";
import ExportDropdown from "@/components/export-dropdown";
import VerifySellerModal from "@/components/verify-seller-modal";

type SellerRole = "designer" | "seller";
type SellerStatus = "active" | "pending" | "suspended";

interface Seller {
  id: string;
  name: string;
  role: SellerRole;
  storeName: string;
  location: string;
  status: SellerStatus;
  rating: number;
  totalSales: number;
  joinedDate: string;
  avatar?: string;
}

// Mock data for designers and sellers
const MOCK_SELLERS: Seller[] = [
  {
    id: "SLR-2001",
    name: "Elena Romano",
    role: "designer",
    storeName: "Romano Couture",
    location: "Milan, Italy",
    status: "active",
    rating: 4.9,
    totalSales: 1250,
    joinedDate: "2023-01-15",
  },
  {
    id: "SLR-2002",
    name: "Urban Threads Co.",
    role: "seller",
    storeName: "Urban Threads",
    location: "New York, USA",
    status: "active",
    rating: 4.7,
    totalSales: 5400,
    joinedDate: "2022-11-20",
  },
  {
    id: "SLR-2003",
    name: "Sakura Designs",
    role: "designer",
    storeName: "Sakura Studio",
    location: "Tokyo, Japan",
    status: "active",
    rating: 4.8,
    totalSales: 890,
    joinedDate: "2023-03-10",
  },
  {
    id: "SLR-2004",
    name: "Nordic Minimal",
    role: "seller",
    storeName: "Nordic Home & Wear",
    location: "Stockholm, Sweden",
    status: "pending",
    rating: 0,
    totalSales: 0,
    joinedDate: "2023-07-01",
  },
  {
    id: "SLR-2005",
    name: "Isabella De Luca",
    role: "designer",
    storeName: "IDL Fashion",
    location: "Paris, France",
    status: "suspended",
    rating: 4.2,
    totalSales: 320,
    joinedDate: "2023-02-28",
  },
  {
    id: "SLR-2006",
    name: "Global Trends Ltd",
    role: "seller",
    storeName: "Global Trends",
    location: "London, UK",
    status: "active",
    rating: 4.5,
    totalSales: 12000,
    joinedDate: "2022-08-15",
  },
];

export default function SellersManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sellers, setSellers] = useState<Seller[]>(MOCK_SELLERS);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);

  const filteredSellers = sellers.filter(
    (seller) =>
      seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditSeller = (updatedSeller: Seller) => {
    setSellers((prev) =>
      prev.map((seller) =>
        seller.id === updatedSeller.id ? updatedSeller : seller
      )
    );
  };

  const handleEditClick = (seller: Seller) => {
    setSelectedSeller(seller);
    setEditModalOpen(true);
  };

  const handleContactClick = (seller: Seller) => {
    setSelectedSeller(seller);
    setContactModalOpen(true);
  };

  const handleVerifyClick = (seller: Seller) => {
    setSelectedSeller(seller);
    setVerifyModalOpen(true);
  };

  const handleVerifySeller = (
    sellerId: string,
    status: "active" | "rejected",
    notes?: string
  ) => {
    setSellers((prev) =>
      prev.map((seller) =>
        seller.id === sellerId
          ? { ...seller, status: status as SellerStatus }
          : seller
      )
    );

    // Show success message
    const message =
      status === "active"
        ? "Seller account approved successfully!"
        : "Seller application rejected.";
    alert(message);
  };

  const handleVerifyNewClick = () => {
    // Find the first pending seller
    const pendingSeller = sellers.find((seller) => seller.status === "pending");
    if (pendingSeller) {
      setSelectedSeller(pendingSeller);
      setVerifyModalOpen(true);
    } else {
      alert("No new sellers pending verification!");
    }
  };

  const handleSuspendClick = (sellerId: string) => {
    if (confirm("Are you sure you want to suspend this account?")) {
      setSellers((prev) =>
        prev.map((seller) =>
          seller.id === sellerId
            ? { ...seller, status: "suspended" as SellerStatus }
            : seller
        )
      );
    }
  };

  const getStatusColor = (status: SellerStatus) => {
    switch (status) {
      case "active":
        return "bg-green-500/15 text-green-600 border-green-500/30";
      case "pending":
        return "bg-yellow-500/15 text-yellow-600 border-yellow-500/30";
      case "suspended":
        return "bg-red-500/15 text-red-600 border-red-500/30";
      default:
        return "bg-gray-500/15 text-gray-600 border-gray-500/30";
    }
  };

  const getRoleIcon = (role: SellerRole) => {
    return role === "designer" ? (
      <Palette className="h-3.5 w-3.5 mr-1 text-purple-500" />
    ) : (
      <Store className="h-3.5 w-3.5 mr-1 text-blue-500" />
    );
  };

  return (
    <Card className="rounded-3xl border-border/60 bg-card/90 shadow-xl">
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle className="text-lg font-semibold text-foreground">
            Designers & Sellers
          </CardTitle>
          <CardDescription>
            Manage your network of fashion designers and retail partners.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search designers..."
              className="w-full rounded-xl bg-background pl-8 md:w-[200px] lg:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            size="sm"
            className="h-10 gap-1 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20"
            onClick={handleVerifyNewClick}
          >
            <BadgeCheck className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only">Verify New</span>
          </Button>
          <ExportDropdown
            data={filteredSellers}
            filename="sellers-export"
            label="Export"
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Name & Store</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="hidden md:table-cell">Location</TableHead>
              <TableHead className="text-right">Sales</TableHead>
              <TableHead className="hidden md:table-cell text-center">
                Rating
              </TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSellers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No designers or sellers found.
                </TableCell>
              </TableRow>
            ) : (
              filteredSellers.map((seller) => (
                <TableRow key={seller.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-border">
                        <AvatarImage src={seller.avatar} alt={seller.name} />
                        <AvatarFallback className="font-medium text-primary bg-primary/10">
                          {seller.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">
                          {seller.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {seller.storeName}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm capitalize">
                      {getRoleIcon(seller.role)}
                      {seller.role}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="mr-1 h-3 w-3" />
                      {seller.location}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {seller.totalSales.toLocaleString()}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">
                        {seller.rating > 0 ? seller.rating : "N/A"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className={getStatusColor(seller.status)}
                    >
                      {seller.status.charAt(0).toUpperCase() +
                        seller.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        {seller.status === "pending" && (
                          <DropdownMenuItem
                            onClick={() => handleVerifyClick(seller)}
                            className="text-green-600"
                          >
                            <BadgeCheck className="mr-2 h-3.5 w-3.5" />
                            Verify Now
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => handleEditClick(seller)}
                        >
                          <Edit className="mr-2 h-3.5 w-3.5" />
                          Edit profile
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleContactClick(seller)}
                        >
                          <Mail className="mr-2 h-3.5 w-3.5" />
                          Contact
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleSuspendClick(seller.id)}
                        >
                          <Trash2 className="mr-2 h-3.5 w-3.5" />
                          Suspend account
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
      {selectedSeller && (
        <>
          <EditSellerModal
            seller={selectedSeller}
            open={editModalOpen}
            onOpenChange={setEditModalOpen}
            onEditSeller={handleEditSeller}
          />
          <ContactSellerModal
            seller={selectedSeller}
            open={contactModalOpen}
            onOpenChange={setContactModalOpen}
          />
          <VerifySellerModal
            seller={selectedSeller}
            open={verifyModalOpen}
            onClose={() => setVerifyModalOpen(false)}
            onVerify={handleVerifySeller}
          />
        </>
      )}
    </Card>
  );
}
