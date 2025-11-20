'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { CalendarDays, MessagesSquare, PlusCircle, Image as ImageIcon, Eye } from "lucide-react";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type Appointment = {
  id: number;
  patient_name: string;
  service: string;
  appointment_time: string;
};

type ServiceView = {
  service: string;
  views: number;
};

export default function DashboardPage() {
  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);
  const [chartData, setChartData] = useState<ServiceView[]>([]);
  const [loading, setLoading] = useState(true);
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // ✅ Fetch upcoming appointments
    const fetchAppointments = async () => {
      try {
        const res = await fetch("http://localhost:5000/upcoming-appointments");
        const data = await res.json();

        if (data?.data) {
          const appointments = data.data;

          // ✅ Filter appointments for the next 7 days
          const now = new Date();
          const sevenDaysLater = new Date();
          sevenDaysLater.setDate(now.getDate() + 7);

          const upcomingIn7Days = appointments.filter((app: Appointment) => {
            const appointmentDate = new Date(app.appointment_time);
            return appointmentDate >= now && appointmentDate <= sevenDaysLater;
          });

          setUpcomingCount(upcomingIn7Days.length);
          setRecentAppointments(upcomingIn7Days);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    // ✅ Fetch service analytics
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("http://localhost:5000/analytics/visits-summary");
        const data = await res.json();
        if (Array.isArray(data)) {
          setChartData(data);
        } else if (data?.data) {
          setChartData(data.data);
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
      }
    };

    fetchAppointments();
    fetchAnalytics();
  }, []);

  useEffect(() => {
  const fetchUnreadCount = async () => {
    try {
      const res = await fetch("http://localhost:5000/contacts/unread-count");
      const data = await res.json();
      setUnreadCount(data.count);
    } catch (error) {
      console.error("Error fetching unread messages count:", error);
    }
  };

  fetchUnreadCount();
}, []);


  const chartConfig = {
    views: { label: "Views" },
  } satisfies ChartConfig;

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* ✅ New Appointments (Dynamic) */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Appointments</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : `+${upcomingCount}`}
            </div>
            <p className="text-xs text-muted-foreground">in the next 7 days</p>
          </CardContent>
        </Card>

        {/* New Messages placeholder */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Messages</CardTitle>
            <MessagesSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              +{unreadCount}
            </div>

            <p className="text-xs text-muted-foreground">unread inquiries</p>
          </CardContent>
        </Card>
      </div>

      {/* ✅ Most Viewed Services Chart */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle className="font-headline">Most Viewed Services</CardTitle>
            <CardDescription>A look at which services are getting the most attention.</CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="service"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <YAxis />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                    <Bar dataKey="views" radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <p className="text-muted-foreground text-sm">No analytics data available yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline">Quick Actions</CardTitle>
            <CardDescription>Get started with common tasks.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button asChild>
              <Link href="/services/new"><PlusCircle /> Add New Service</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/gallery"><ImageIcon /> Add Image to Gallery</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/messages"><Eye /> View Messages</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* ✅ Appointments Table */}
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Upcoming Appointments</CardTitle>
          <CardDescription>A summary of appointments scheduled for the next 7 days.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Service</TableHead>
                <TableHead className="text-right">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : recentAppointments.length > 0 ? (
                recentAppointments.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">{app.patient_name}</TableCell>
                    <TableCell><Badge variant="outline">{app.service}</Badge></TableCell>
                    <TableCell className="text-right">
                      {new Date(app.appointment_time).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    No appointments in the next 7 days.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}


