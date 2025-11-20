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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
import { format } from "date-fns";

const users = [
    {
        id: "1",
        name: "Jane Doe",
        email: "jane.doe@kiwenda.org",
        role: "Super Admin",
        lastLogin: new Date('2024-07-25T10:00:00'),
        avatar: "https://picsum.photos/seed/user1/40/40",
        avatarHint: "woman portrait"
    },
    {
        id: "2",
        name: "John Smith",
        email: "john.smith@kiwenda.org",
        role: "Content Editor",
        lastLogin: new Date('2024-07-24T14:30:00'),
        avatar: "https://picsum.photos/seed/user2/40/40",
        avatarHint: "man portrait"
    },
    {
        id: "3",
        name: "Admin User",
        email: "admin@kiwenda.org",
        role: "Super Admin",
        lastLogin: new Date('2024-07-25T11:00:00'),
        avatar: "https://picsum.photos/seed/user-avatar/40/40",
        avatarHint: "person portrait"
    },
];

export default function AdminUsersPage() {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="font-headline">Admin Accounts</CardTitle>
                        <CardDescription>Manage admin access and security for the dashboard.</CardDescription>
                    </div>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add User
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead className="hidden md:table-cell">Last Login</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={user.avatar} data-ai-hint={user.avatarHint} />
                                            <AvatarFallback>{user.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{user.name}</p>
                                            <p className="text-sm text-muted-foreground">{user.email}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={user.role === "Super Admin" ? "destructive" : "secondary"}>
                                        {user.role}
                                    </Badge>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">{format(user.lastLogin, "PPP p")}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button size="icon" variant="ghost">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem>Edit Role</DropdownMenuItem>
                                            <DropdownMenuItem>Reset Password</DropdownMenuItem>
                                            <DropdownMenuItem>View Activity Log</DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive">Remove User</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
