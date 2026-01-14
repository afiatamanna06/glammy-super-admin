"use client";

import { useState } from "react";
import { Mail, Send, User, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ContactSellerModalProps {
  seller: {
    id: string;
    name: string;
    storeName: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ContactSellerModal({
  seller,
  open,
  onOpenChange,
}: ContactSellerModalProps) {
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulate sending message
    alert(
      `Message sent to ${seller.name} at ${seller.storeName}!\n\nSubject: ${subject}\nMessage: ${message}`
    );

    // Reset form
    setMessage("");
    setSubject("");
    onOpenChange(false);
  };

  const quickMessages = [
    "Welcome to our platform! We're excited to have you on board.",
    "Please update your store information and product catalog.",
    "Your account status has been updated. Please review the changes.",
    "We need to verify some information about your store. Please contact us.",
    "Congratulations on reaching a new sales milestone!",
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Contact {seller.name}</DialogTitle>
          <DialogDescription>
            Send a message to {seller.storeName}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{seller.name}</p>
                <p className="text-sm text-muted-foreground">
                  {seller.storeName}
                </p>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="subject">Subject</Label>
              <div className="relative">
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter message subject..."
                  className="pl-8"
                  required
                />
                <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                rows={5}
                className="resize-none"
                required
              />
              <p className="text-xs text-muted-foreground">
                {message.length}/500 characters
              </p>
            </div>

            <div className="grid gap-2">
              <Label>Quick Messages</Label>
              <div className="grid gap-2">
                {quickMessages.map((quickMessage, index) => (
                  <Button
                    key={index}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="justify-start text-left h-auto py-2 px-3"
                    onClick={() => setMessage(quickMessage)}
                  >
                    <MessageSquare className="mr-2 h-3 w-3" />
                    <span className="text-xs">{quickMessage}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!subject || !message}>
              <Send className="mr-2 h-4 w-4" />
              Send Message
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
