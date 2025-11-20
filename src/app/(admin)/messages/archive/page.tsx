"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";

export default function ArchivePage() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/contacts/archive")
      .then(res => res.json())
      .then(setMessages);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Archived Messages</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>From</TableHead>
              <TableHead>Message</TableHead>
              <TableHead className="text-right">Received</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  Archive is empty.
                </TableCell>
              </TableRow>
            ) : messages.map((msg: any) => (
              <TableRow key={msg.id}>
                <TableCell>{msg.name}</TableCell>
                <TableCell className="max-w-xs truncate">{msg.message}</TableCell>
                <TableCell className="text-right">
                  {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
