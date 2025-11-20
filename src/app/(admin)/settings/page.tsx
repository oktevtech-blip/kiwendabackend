import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="font-headline text-2xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">Manage your website's general configuration and theme.</p>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="theme">Theme &amp; Appearance</TabsTrigger>
                    <TabsTrigger value="contact">Contact Info</TabsTrigger>
                </TabsList>
                
                <TabsContent value="general">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">General Information</CardTitle>
                            <CardDescription>Update your website title, tagline, and other general settings.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="site-title">Website Title</Label>
                                <Input id="site-title" defaultValue="Kiwenda Rehabilitation Centre" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="site-tagline">Tagline</Label>
                                <Input id="site-tagline" defaultValue="Your Partner in Recovery and Wellness" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="footer-text">Footer Text</Label>
                                <Textarea id="footer-text" defaultValue="© 2024 Kiwenda Rehabilitation Centre. All rights reserved." />
                            </div>
                            <Button>Save Changes</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="theme">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Theme &amp; Appearance</CardTitle>
                            <CardDescription>Customize the look and feel of your website.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label>Logo &amp; Favicon</Label>
                                <div className="flex items-center gap-4">
                                    <Button variant="outline">Upload New Logo</Button>
                                    <Button variant="outline">Upload Favicon</Button>
                                </div>
                            </div>
                             <div className="flex items-center space-x-2 rounded-lg border p-4">
                                <Switch id="dark-mode-switch" />
                                <Label htmlFor="dark-mode-switch">Enable Dark Mode for Visitors</Label>
                            </div>
                            <Button>Save Theme Settings</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="contact">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Contact Information</CardTitle>
                            <CardDescription>Update the contact details displayed on your site.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input id="phone" defaultValue="+256 777 123 456" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input id="email" type="email" defaultValue="contact@kiwenda.org" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Physical Address</Label>
                                <Input id="address" defaultValue="123 Kiwenda Road, Kampala, Uganda" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="hours">Operating Hours</Label>
                                <Input id="hours" defaultValue="Mon-Fri: 9:00 AM - 5:00 PM, Sat: 10:00 AM - 2:00 PM" />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="map-location">Google Maps Location URL</Label>
                                <Input id="map-location" placeholder="Paste Google Maps URL here" />
                            </div>
                            <Button>Update Contact Info</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
