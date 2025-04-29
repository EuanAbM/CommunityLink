"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertCircle, X, Upload, LucideImage } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import NextImage from "next/image"

export default function SettingsPage() {
  const [newDomain, setNewDomain] = useState("")
  const [domains, setDomains] = useState(["oakridge.edu"])
  const [showDomainDialog, setShowDomainDialog] = useState(false)
  const [schoolLogo, setSchoolLogo] = useState<string | null>(null)
  const [loginImage, setLoginImage] = useState<string | null>(null)

  const handleAddDomain = () => {
    if (newDomain && !domains.includes(newDomain)) {
      setDomains([...domains, newDomain])
      setNewDomain("")
      setShowDomainDialog(true)
    }
  }

  const handleRemoveDomain = (domain: string) => {
    setDomains(domains.filter((d) => d !== domain))
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">General Settings</h1>
        <p className="text-muted-foreground">Manage your school and platform settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>School Information</CardTitle>
          <CardDescription>View your school details and platform settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="school-name">School Name</Label>
                <Input id="school-name" defaultValue="Oakridge Academy" disabled className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="info@oakridge.edu" disabled className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" defaultValue="020 7123 4567" disabled className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" type="url" defaultValue="https://oakridge.edu" disabled className="bg-muted" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" defaultValue="123 Education Lane, London, SW1 2AB" disabled className="bg-muted" />
            </div>

            <Separator />

            {/* School Logo */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>School Logo</Label>
                <Button variant="outline" size="sm">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload New Logo
                </Button>
              </div>

              <div className="flex items-center gap-6">
                <div className="border rounded-md p-4 bg-white flex items-center justify-center w-40 h-40">
                  {schoolLogo ? (
                    <div className="relative w-full h-full">
                      <NextImage
                        src={schoolLogo || "/placeholder.svg"}
                        alt="School Logo"
                        fill
                        style={{ objectFit: "contain" }}
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <LucideImage className="h-10 w-10 mb-2" />
                      <span className="text-xs">No logo uploaded</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2 flex-1">
                  <p className="text-sm font-medium">Logo Requirements:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Square or rectangular format</li>
                    <li>• Minimum size: 200x200 pixels</li>
                    <li>• Maximum size: 1MB</li>
                    <li>• Supported formats: PNG, JPG, SVG</li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-2">
                    Your logo will appear alongside the CommunityLink logo throughout the platform.
                  </p>
                </div>
              </div>
            </div>

            {/* Login Page Image */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Login Page Image</Label>
                <Button variant="outline" size="sm">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Image
                </Button>
              </div>

              <div className="flex items-center gap-6">
                <div className="border rounded-md p-4 bg-white flex items-center justify-center w-60 h-40">
                  {loginImage ? (
                    <div className="relative w-full h-full">
                      <NextImage
                        src={loginImage || "/placeholder.svg"}
                        alt="Login Page Image"
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <LucideImage className="h-10 w-10 mb-2" />
                      <span className="text-xs">No image uploaded</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2 flex-1">
                  <p className="text-sm font-medium">Image Requirements:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Recommended size: 1200x800 pixels</li>
                    <li>• Maximum size: 2MB</li>
                    <li>• Supported formats: PNG, JPG</li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-2">
                    This image will be displayed on the login page of your CommunityLink platform.
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Allowed Email Domains</Label>
              <div className="space-y-2">
                {domains.map((domain) => (
                  <div key={domain} className="flex items-center gap-2">
                    <Input value={domain} readOnly />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemoveDomain(domain)}
                      disabled={domain === "oakridge.edu"}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Add new domain..."
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                  />
                  <Button variant="outline" onClick={handleAddDomain}>
                    Add Domain
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Only users with these email domains can register or be invited.
              </p>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-medium">Platform Settings</h3>

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="auto-approve" className="flex flex-col space-y-1">
                  <span>Auto-approve new users</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Automatically approve new users with allowed email domains.
                  </span>
                </Label>
                <Switch id="auto-approve" />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="confidential" className="flex flex-col space-y-1">
                  <span>Restrict confidential information</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Only designated staff can view confidential information.
                  </span>
                </Label>
                <Switch id="confidential" defaultChecked />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="audit" className="flex flex-col space-y-1">
                  <span>Enable advanced audit logging</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Track all user actions and data access.
                  </span>
                </Label>
                <Switch id="audit" defaultChecked />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="dual-branding" className="flex flex-col space-y-1">
                  <span>Enable dual branding</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Show both CommunityLink and school logos throughout the platform.
                  </span>
                </Label>
                <Switch id="dual-branding" defaultChecked />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button>Save Changes</Button>
          </div>
        </CardContent>
      </Card>

      {/* Domain confirmation dialog */}
      <Dialog open={showDomainDialog} onOpenChange={setShowDomainDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Domain Added</DialogTitle>
            <DialogDescription>
              By adding this domain you will allow all users with the following domain to be granted invitation to your
              organisation's CommunityLink.
            </DialogDescription>
          </DialogHeader>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Important</AlertTitle>
            <AlertDescription>
              Make sure you only add domains that belong to your organization. Anyone with an email from this domain can
              be invited to access your safeguarding data.
            </AlertDescription>
          </Alert>
          <DialogFooter>
            <Button onClick={() => setShowDomainDialog(false)}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

