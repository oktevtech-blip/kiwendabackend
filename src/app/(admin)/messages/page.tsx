"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Archive, Reply, CheckCircle, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerClose } from "@/components/ui/drawer";
import { format, formatDistanceToNow } from "date-fns";


interface Message {
  id?: string;
  name: string;
  email: string;
  message: string;
  phone?: string;
  created_at?: string;
  createdAt?: string;
  status?: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await fetch("http://localhost:5000/contacts");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setMessages(data);
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError("Failed to load messages from the server.");
      } finally {
        setLoading(false);
      }
    }

    fetchMessages();
  }, []);

  // ✅ Function to mark a message as read
  const markAsRead = async (id?: string) => {
    if (!id) return;

    try {
      await fetch(`http://localhost:5000/contacts/${id}/read`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === id ? { ...msg, status: "Read" } : msg
        )
      );
    } catch (err) {
      console.error("Error marking message as read:", err);
    }
  };

  // ✅ When a row is clicked, open drawer & mark as read
  const openMessageDrawer = (msg: Message) => {
    setSelectedMessage(msg);
    setDrawerOpen(true);

    if (msg.status !== "Read") {
      markAsRead(msg.id);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
  <div className="flex items-center justify-between">
    <div>
      <CardTitle className="font-headline">Messages & Inquiries</CardTitle>
      <CardDescription>Unread and recent messages only.</CardDescription>
    </div>

    <Button variant="outline" asChild>
      <a href="/messages/archive">
        <Archive className="mr-2 h-4 w-4" /> View Archive
      </a>
    </Button>
  </div>
</CardHeader>


        <CardContent>
          {loading && <p className="text-muted-foreground">Loading messages...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && !error && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>From</TableHead>
                  <TableHead className="hidden lg:table-cell">Message</TableHead>
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
                  <TableHead className="hidden sm:table-cell text-right">
                    Received
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {messages.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground py-8"
                    >
                      No messages yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  messages.map((msg, index) => (
                    <TableRow
                      key={msg.id ?? `${msg.email}-${index}`}
                      className={`cursor-pointer transition hover:bg-muted/40 ${
                        msg.status === "Unread" || msg.status === "New"
                          ? "bg-muted/20 font-medium"
                          : ""
                      }`}
                      onClick={() => openMessageDrawer(msg)}
                    >
                      <TableCell>
                        <div>{msg.name}</div>
                        <div className="text-sm text-muted-foreground font-normal">
                          {msg.email}
                        </div>
                      </TableCell>

                      <TableCell className="hidden lg:table-cell max-w-sm truncate font-normal">
                        {msg.message}
                      </TableCell>

                      <TableCell className="hidden sm:table-cell">
                        <Badge
                          variant={
                            msg.status === "Unread" || msg.status === "New"
                              ? "default"
                              : "outline"
                          }
                          className={
                            msg.status === "Unread" || msg.status === "New"
                              ? "bg-primary text-primary-foreground"
                              : ""
                          }
                        >
                          {msg.status || "Unread"}
                        </Badge>
                      </TableCell>

                      <TableCell className="hidden sm:table-cell text-right font-normal">
                        {msg.createdAt
                        ? format(new Date(msg.createdAt), "MMM d, yyyy, h:mm a")
                        : "N/A"}


                      </TableCell>

                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost" onClick={(e) => e.stopPropagation()}>
                              <MoreHorizontal />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>

                            {msg.status !== "Read" && (
                              <DropdownMenuItem
                                onClick={() => markAsRead(msg.id)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Mark as Read
                              </DropdownMenuItem>
                            )}

                            <DropdownMenuItem>
                              <Reply className="mr-2 h-4 w-4" /> Reply
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <CheckCircle className="mr-2 h-4 w-4" /> Mark as
                              Resolved
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Archive className="mr-2 h-4 w-4" /> Archive
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* ✅ Drawer for message details */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{selectedMessage?.name}</DrawerTitle>
            <DrawerDescription>{selectedMessage?.email}</DrawerDescription>
          </DrawerHeader>

          <div className="p-6 space-y-4">
            {selectedMessage ? (
              <>
                <p className="text-sm text-muted-foreground">
                  <strong>Received:</strong>{" "}
                  {selectedMessage?.createdAt
                  ? format(new Date(selectedMessage.createdAt), "MMM d, yyyy, h:mm a")
                  : "N/A"}


                </p>

                {selectedMessage.phone && (
                  <p className="text-sm">
                    <strong>Phone:</strong> {selectedMessage.phone}
                  </p>
                )}

                <p className="text-base leading-relaxed">
                  {selectedMessage.message}
                </p>
              </>
            ) : (
              <p>No message selected.</p>
            )}
          </div>

          <div className="p-4 border-t flex justify-end">
            <DrawerClose asChild>
              <Button variant="secondary">Close</Button>
            </DrawerClose>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
