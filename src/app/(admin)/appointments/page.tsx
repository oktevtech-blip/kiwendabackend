"use client";

import { useEffect, useState } from "react";
import { MoreHorizontal, Plus } from "lucide-react";
import { format, parseISO } from "date-fns";

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Appointment = {
  id: number | string;
  patient_name?: string;
  patientName?: string;
  service: string;
  appointment_time?: string;
  time?: string | Date;
  contact: string;
  status: "Upcoming" | "Past" | "Cancelled";
};

export default function AppointmentsPage() {
  const [open, setOpen] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);

  // form fields
  const [patientName, setPatientName] = useState("");
  const [service, setService] = useState("");
  const [contact, setContact] = useState("");
  const [time, setTime] = useState("");
  const [status, setStatus] = useState<Appointment["status"]>("Upcoming");

  useEffect(() => {
    fetchAppointments();
  }, []);

  async function fetchAppointments() {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/appointments");
      const json = await res.json();

      if (json.success) {
        const normalized = json.data.map((r: any) => ({
          ...r,
          patientName: r.patient_name ?? r.patientName,
          time: r.appointment_time ?? r.time,
        }));
        setAppointments(normalized);
      }
    } catch (err) {
      console.error("Failed to fetch appointments", err);
    } finally {
      setLoading(false);
    }
  }

  // CREATE NEW APPOINTMENT
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      patientName,
      service,
      contact,
      time,
      status,
    };

    try {
      const res = await fetch("http://localhost:5000/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success && json.data) {
        const newApp = {
          ...json.data,
          patientName: json.data.patient_name ?? json.data.patientName,
          time: json.data.appointment_time ?? json.data.time,
        };

        setAppointments((prev) => [newApp, ...prev]);
        setPatientName("");
        setService("");
        setContact("");
        setTime("");
        setStatus("Upcoming");
        setOpen(false);

        fetchAppointments();
      }
    } catch (err) {
      console.error("Error creating appointment", err);
    }
  }

 // DELETE APPOINTMENT (CRASH-PROOF)
async function handleDelete(id: number | string) {
  try {
    const res = await fetch(`http://localhost:5000/appointments/${id}`, {
      method: "DELETE",
    });

    // ✅ Safely parse JSON only if body exists
    let json: any = {};
    try {
      json = await res.json();
    } catch {
      json = {}; // empty body -> no crash
    }

    // If DELETE was successful (status 200 or 204), update UI
    if (res.ok) {
      setAppointments((prev) => prev.filter((a) => a.id !== id));
      return;
    }

    // Otherwise, log error
    console.error("Delete failed", json);
  } catch (err) {
    console.error("Error deleting appointment", err);
  }
}

  const upcoming = appointments.filter((a) => a.status === "Upcoming");
  const past = appointments.filter((a) => a.status === "Past");
  const cancelled = appointments.filter((a) => a.status === "Cancelled");

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="font-headline">Manage Appointments</CardTitle>
          <CardDescription>
            View and manage patient appointment requests.
          </CardDescription>
        </div>

        {/* Add Appointment Button + Dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Appointment
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Appointment</DialogTitle>
              <DialogDescription>
                Fill in the details below to schedule a new appointment.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label>Patient Name</Label>
                <Input
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>Service</Label>
                <Input
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>Date & Time</Label>
                <Input
                  type="datetime-local"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>Contact</Label>
                <Input
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>Status</Label>
                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as Appointment["status"])
                  }
                  className="input"
                >
                  <option value="Upcoming">Upcoming</option>
                  <option value="Past">Past</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <DialogFooter>
                <Button type="submit">Save Appointment</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="upcoming">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            <AppointmentsTable
              appointments={upcoming}
              loading={loading}
              onDelete={handleDelete}
            />
          </TabsContent>

          <TabsContent value="past">
            <AppointmentsTable
              appointments={past}
              loading={loading}
              onDelete={handleDelete}
            />
          </TabsContent>

          <TabsContent value="cancelled">
            <AppointmentsTable
              appointments={cancelled}
              loading={loading}
              onDelete={handleDelete}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function AppointmentsTable({
  appointments,
  loading,
  onDelete,
}: {
  appointments: any[];
  loading?: boolean;
  onDelete: (id: number | string) => void;
}) {
  return (
    <>
      {loading ? <div>Loading...</div> : null}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead className="hidden md:table-cell">Contact</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {appointments.map((app) => (
            <TableRow key={app.id}>
              <TableCell className="font-medium">
                {app.patientName ?? app.patient_name}
              </TableCell>

              <TableCell>
                <Badge variant="outline">{app.service}</Badge>
              </TableCell>

              <TableCell>
                {app.time
                  ? format(
                      parseISO(
                        typeof app.time === "string" &&
                        !app.time.includes("T")
                          ? app.time.replace(" ", "T")
                          : app.time
                      ),
                      "PPP p"
                    )
                  : "—"}
              </TableCell>

              <TableCell className="hidden md:table-cell">
                {app.contact}
              </TableCell>

              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>

                    {/* DELETE BUTTON */}
                    <DropdownMenuItem onClick={() => onDelete(app.id)}>
                      Delete
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem className="text-destructive">
                      Cancel
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

