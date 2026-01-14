"use client";

import { useState } from "react";
import {
  MoreHorizontal,
  Search,
  ShoppingCart,
  Truck,
  Eye,
  Edit,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
import AddOrderModal from "@/components/add-order-modal";
import EditOrderModal from "@/components/edit-order-modal";
import CancelOrderModal from "@/components/cancel-order-modal";
import ExportDropdown from "@/components/export-dropdown";
import OrderDetailsModal from "@/components/order-details-modal";

type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

interface Order {
  id: string;
  customer: string;
  email: string;
  amount: number;
  status: OrderStatus;
  date: string;
  items: number;
  notes?: string;
  phone?: string;
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

// Mock data for orders
const MOCK_ORDERS: Order[] = [
  {
    id: "ORD-7352",
    customer: "Liam Johnson",
    email: "liam@example.com",
    phone: "+1 (555) 123-4567",
    amount: 125.0,
    status: "delivered",
    date: "2023-06-23",
    items: 3,
    address: "123 Fashion Ave, New York, NY 10001",
    products: [
      { name: "Summer Floral Dress", quantity: 1, price: 45.0, sku: "FLD-001" },
      { name: "Denim Jacket", quantity: 1, price: 55.0, sku: "DNM-002" },
      { name: "Leather Handbag", quantity: 1, price: 25.0, sku: "LHB-003" },
    ],
    shippingMethod: "Standard Shipping",
    estimatedDelivery: "2023-06-28",
    trackingNumber: "TRK123456789",
  },
  {
    id: "ORD-7353",
    customer: "Olivia Smith",
    email: "olivia@example.com",
    phone: "+1 (555) 987-6543",
    amount: 54.5,
    status: "processing",
    date: "2023-06-24",
    items: 1,
    address: "456 Style Street, Los Angeles, CA 90001",
    products: [
      { name: "Silk Scarf", quantity: 1, price: 54.5, sku: "SLF-004" },
    ],
    shippingMethod: "Express Shipping",
    estimatedDelivery: "2023-06-27",
  },
  {
    id: "ORD-7354",
    customer: "Noah Williams",
    email: "noah@example.com",
    phone: "+1 (555) 456-7890",
    amount: 299.99,
    status: "pending",
    date: "2023-06-25",
    items: 2,
    address: "789 Trend Blvd, Chicago, IL 60601",
    products: [
      { name: "Designer Suit", quantity: 1, price: 199.99, sku: "DSU-005" },
      { name: "Dress Shoes", quantity: 1, price: 100.0, sku: "DRS-006" },
    ],
    shippingMethod: "Standard Shipping",
    estimatedDelivery: "2023-07-02",
  },
  {
    id: "ORD-7355",
    customer: "Emma Brown",
    email: "emma@example.com",
    amount: 89.0,
    status: "shipped",
    date: "2023-06-26",
    items: 4,
  },
  {
    id: "ORD-7356",
    customer: "Ava Jones",
    email: "ava@example.com",
    amount: 34.0,
    status: "cancelled",
    date: "2023-06-26",
    items: 1,
  },
  {
    id: "ORD-7357",
    customer: "Sophia Garcia",
    email: "sophia@example.com",
    amount: 156.0,
    status: "delivered",
    date: "2023-06-27",
    items: 2,
  },
  {
    id: "ORD-7358",
    customer: "Isabella Miller",
    email: "isabella@example.com",
    amount: 45.0,
    status: "processing",
    date: "2023-06-28",
    items: 1,
  },
];

export default function OrdersManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter(
    (order) =>
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: OrderStatus) => {
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

  const handleAddOrder = (newOrder: Order) => {
    setOrders((prev) => [...prev, newOrder]);
  };

  const handleEditOrder = (updatedOrder: Order) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === updatedOrder.id ? updatedOrder : order))
    );
  };

  const handleCancelOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? { ...order, status: "cancelled" as OrderStatus }
          : order
      )
    );
  };

  const handleEditClick = (order: Order) => {
    setSelectedOrder(order);
    setEditModalOpen(true);
  };

  const handleCancelClick = (order: Order) => {
    setSelectedOrder(order);
    setCancelModalOpen(true);
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setDetailsModalOpen(true);
  };

  return (
    <>
      <Card className="rounded-3xl border-border/60 bg-card/90 shadow-xl">
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">
              Recent Orders
            </CardTitle>
            <CardDescription>
              Manage and track recent customer orders and shipments.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search orders..."
                className="w-full rounded-xl bg-background pl-8 md:w-[200px] lg:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <AddOrderModal onAddOrder={handleAddOrder} />
            <ExportDropdown
              data={filteredOrders}
              filename="orders-export"
              label="Export"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="hidden md:table-cell text-right">
                  Items
                </TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No orders found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{order.customer}</span>
                        <span className="hidden text-xs text-muted-foreground md:inline">
                          {order.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {order.date}
                    </TableCell>
                    <TableCell className="text-right">
                      ${order.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-right">
                      {order.items}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={getStatusColor(order.status)}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
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
                          <DropdownMenuItem
                            onClick={() => handleViewDetails(order)}
                          >
                            <Eye className="mr-2 h-3.5 w-3.5" />
                            View details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEditClick(order)}
                          >
                            <Edit className="mr-2 h-3.5 w-3.5" />
                            Update status
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleCancelClick(order)}
                            className="text-destructive"
                          >
                            Cancel order
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
      </Card>

      <EditOrderModal
        order={selectedOrder}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onEditOrder={handleEditOrder}
      />

      <CancelOrderModal
        order={selectedOrder}
        open={cancelModalOpen}
        onOpenChange={setCancelModalOpen}
        onCancelOrder={handleCancelOrder}
      />

      <OrderDetailsModal
        order={selectedOrder}
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
      />
    </>
  );
}
