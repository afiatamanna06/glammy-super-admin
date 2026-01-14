"use client";

import { useState } from "react";
import {
  MoreHorizontal,
  Search,
  Package,
  Eye,
  Edit,
  Trash2,
  ShoppingBag,
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
import AddProductModal from "@/components/add-product-modal";
import EditProductModal from "@/components/edit-product-modal";
import DeleteProductModal from "@/components/delete-product-modal";
import ExportDropdown from "@/components/export-dropdown";

type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  status: StockStatus;
  inventory: number;
  image?: string;
  description?: string;
}

// Mock data for fashion products
const MOCK_PRODUCTS: Product[] = [
  {
    id: "PRD-1001",
    name: "Silk Summer Dress",
    category: "Dresses",
    price: 129.99,
    status: "in_stock",
    inventory: 45,
  },
  {
    id: "PRD-1002",
    name: "Leather Crossbody Bag",
    category: "Accessories",
    price: 89.5,
    status: "in_stock",
    inventory: 28,
  },
  {
    id: "PRD-1003",
    name: "Classic Denim Jacket",
    category: "Outerwear",
    price: 75.0,
    status: "low_stock",
    inventory: 5,
  },
  {
    id: "PRD-1004",
    name: "Gold Plated Necklace",
    category: "Jewelry",
    price: 45.0,
    status: "in_stock",
    inventory: 120,
  },
  {
    id: "PRD-1005",
    name: "High-Heeled Sandals",
    category: "Shoes",
    price: 59.99,
    status: "out_of_stock",
    inventory: 0,
  },
  {
    id: "PRD-1006",
    name: "Cashmere Scarf",
    category: "Accessories",
    price: 110.0,
    status: "in_stock",
    inventory: 15,
  },
  {
    id: "PRD-1007",
    name: "Floral Midi Skirt",
    category: "Skirts",
    price: 65.0,
    status: "low_stock",
    inventory: 3,
  },
];

export default function ProductsManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: StockStatus) => {
    switch (status) {
      case "in_stock":
        return "bg-green-500/15 text-green-600 border-green-500/30";
      case "low_stock":
        return "bg-yellow-500/15 text-yellow-600 border-yellow-500/30";
      case "out_of_stock":
        return "bg-red-500/15 text-red-600 border-red-500/30";
      default:
        return "bg-gray-500/15 text-gray-600 border-gray-500/30";
    }
  };

  const getStatusLabel = (status: StockStatus) => {
    switch (status) {
      case "in_stock":
        return "In Stock";
      case "low_stock":
        return "Low Stock";
      case "out_of_stock":
        return "Out of Stock";
      default:
        return status;
    }
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [...prev, newProduct]);
  };

  const handleEditProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== productId));
  };

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    setDeleteModalOpen(true);
  };

  return (
    <>
      <Card className="rounded-3xl border-border/60 bg-card/90 shadow-xl">
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">
              Fashion Products
            </CardTitle>
            <CardDescription>
              Manage your fashion inventory and product catalog.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="w-full rounded-xl bg-background pl-8 md:w-[200px] lg:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <AddProductModal onAddProduct={handleAddProduct} />
            <ExportDropdown
              data={filteredProducts}
              filename="products-export"
              label="Export"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Product ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="hidden md:table-cell text-right">
                  Inventory
                </TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No products found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted/50">
                          <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {product.category}
                    </TableCell>
                    <TableCell className="text-right">
                      ${product.price.toFixed(2)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-right">
                      {product.inventory}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={getStatusColor(product.status)}
                      >
                        {getStatusLabel(product.status)}
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
                            onClick={() => handleEditClick(product)}
                          >
                            <Edit className="mr-2 h-3.5 w-3.5" />
                            Edit details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(product)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-3.5 w-3.5" />
                            Delete product
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

      <EditProductModal
        product={selectedProduct}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onEditProduct={handleEditProduct}
      />

      <DeleteProductModal
        product={selectedProduct}
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onDeleteProduct={handleDeleteProduct}
      />
    </>
  );
}
