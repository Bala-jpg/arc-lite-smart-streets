import { useState } from "react";
import { Settings as SettingsIcon, User, Bell, Shield, Palette } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import ThemeToggle from "@/components/ThemeToggle";
import { useUserRegistration } from "@/hooks/useUserRegistration";
import { useAuth } from "@/hooks/useAuth";

const Settings = () => {
  const { user } = useAuth();
  const { isRegistered, loading, userData, registerUser } = useUserRegistration();
  const [formData, setFormData] = useState({
    firstName: userData?.first_name || "",
    lastName: userData?.last_name || "",
    email: userData?.email || ""
  });
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
      return { isValid: false, message: "All fields are required" };
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return { isValid: false, message: "Please enter a valid email address" };
    }
    
    return { isValid: true, message: "" };
  };

  const handleSubmit = async () => {
    const validation = validateForm();
    if (!validation.isValid) {
      alert(validation.message);
      return;
    }

    setSubmitting(true);
    
    const success = await registerUser({
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email
    });

    if (success) {
      // Update form data to reflect registered data
      setFormData({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email
      });
    }
    
    setSubmitting(false);
  };

  // Update form when userData changes
  useState(() => {
    if (userData) {
      setFormData({
        firstName: userData.first_name,
        lastName: userData.last_name,
        email: userData.email
      });
    }
  });

  return (
    <div className="min-h-screen bg-gradient-bg">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your account preferences and system settings
          </p>
        </div>

        <div className="space-y-8">
          {/* User Registration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                User Registration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!user ? (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">Please log in to register your details</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input 
                        id="firstName" 
                        placeholder="Enter your first name"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        disabled={loading || isRegistered}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input 
                        id="lastName" 
                        placeholder="Enter your last name"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        disabled={loading || isRegistered}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={loading || isRegistered}
                    />
                  </div>
                  {!isRegistered && (
                    <Button 
                      onClick={handleSubmit}
                      disabled={submitting || loading}
                    >
                      {submitting ? "Saving..." : "Submit"}
                    </Button>
                  )}
                  {isRegistered && (
                    <div className="text-center py-2">
                      <p className="text-sm text-green-600">✓ Registration completed successfully!</p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Appearance Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Theme</Label>
                  <p className="text-sm text-muted-foreground">
                    Choose your preferred theme
                  </p>
                </div>
                <ThemeToggle />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email alerts for system events
                  </p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Fault Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when faults are detected
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Energy Reports</Label>
                  <p className="text-sm text-muted-foreground">
                    Weekly energy consumption reports
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Change Password</Label>
                <div className="space-y-2">
                  <Input type="password" placeholder="Current password" />
                  <Input type="password" placeholder="New password" />
                  <Input type="password" placeholder="Confirm new password" />
                </div>
                <Button variant="outline">Update Password</Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Enable 2FA
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* System Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="w-5 h-5" />
                System Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Auto-refresh Dashboard</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically refresh data every 30 seconds
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Data Export</Label>
                  <p className="text-sm text-muted-foreground">
                    Export your data in CSV format
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Export Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Settings;