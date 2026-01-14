"use client"

import { useState } from "react"
import { Download, Copy, FileText, FileJson } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { exportToCSV, exportToJSON, copyToClipboard } from "@/lib/export-utils"

interface ExportDropdownProps {
  data: any[]
  filename: string
  label?: string
  variant?: "outline" | "default" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export default function ExportDropdown({ 
  data, 
  filename, 
  label = "Export",
  variant = "outline",
  size = "sm",
  className = ""
}: ExportDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleExportCSV = () => {
    exportToCSV(data, filename)
    setIsOpen(false)
  }

  const handleExportJSON = () => {
    exportToJSON(data, filename)
    setIsOpen(false)
  }

  const handleCopyCSV = () => {
    copyToClipboard(data, 'csv')
    setIsOpen(false)
  }

  const handleCopyJSON = () => {
    copyToClipboard(data, 'json')
    setIsOpen(false)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size={size} 
          className={`gap-1 rounded-xl ${className}`}
        >
          <Download className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only">{label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Export Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleExportCSV}>
          <FileText className="mr-2 h-4 w-4" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportJSON}>
          <FileJson className="mr-2 h-4 w-4" />
          Export as JSON
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleCopyCSV}>
          <Copy className="mr-2 h-4 w-4" />
          Copy as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyJSON}>
          <Copy className="mr-2 h-4 w-4" />
          Copy as JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}