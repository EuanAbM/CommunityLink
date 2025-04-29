import { SiteHeader } from "@/components/layout/site-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch, Checkbox } from "@/components/ui/switch"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function AddStudentPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-6">
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild className="mb-2">
              <Link href="/students">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Students
              </Link>
            </Button>
            <h1 className="text-2xl font-semibold">Add New Student</h1>
            <p className="text-muted-foreground">Create a new student record in the system</p>
          </div>

          <Tabs defaultValue="basic">
            <TabsList className="mb-6">
              <TabsTrigger value="basic">Basic Information</TabsTrigger>
              <TabsTrigger value="contacts">Emergency Contacts</TabsTrigger>
              <TabsTrigger value="safeguarding">Safeguarding</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
            </TabsList>

            <TabsContent value="basic">
              <Card>
                <CardHeader>
                  <CardTitle>Student Details</CardTitle>
                  <CardDescription>Enter the basic information for the new student</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="Enter first name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Enter last name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input id="dob" type="date" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select>
                        <SelectTrigger id="gender">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="address">Home Address</Label>
                    <Textarea id="address" placeholder="Enter home address" />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" placeholder="City" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postcode">Postcode</Label>
                      <Input id="postcode" placeholder="Postcode" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="eal" />
                      <Label htmlFor="eal">English as an Additional Language (EAL)</Label>
                    </div>

                    {/* Language selection - shown when EAL is checked */}
                    <div className="mt-2">
                      <Label htmlFor="languages">Languages Spoken</Label>
                      <Select>
                        <SelectTrigger id="languages">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="af">Afrikaans</SelectItem>
                          <SelectItem value="sq">Albanian</SelectItem>
                          <SelectItem value="am">Amharic</SelectItem>
                          <SelectItem value="ar">Arabic</SelectItem>
                          <SelectItem value="hy">Armenian</SelectItem>
                          <SelectItem value="az">Azerbaijani</SelectItem>
                          <SelectItem value="eu">Basque</SelectItem>
                          <SelectItem value="be">Belarusian</SelectItem>
                          <SelectItem value="bn">Bengali</SelectItem>
                          <SelectItem value="bs">Bosnian</SelectItem>
                          <SelectItem value="bg">Bulgarian</SelectItem>
                          <SelectItem value="ca">Catalan</SelectItem>
                          <SelectItem value="ceb">Cebuano</SelectItem>
                          <SelectItem value="ny">Chichewa</SelectItem>
                          <SelectItem value="zh">Chinese (Simplified)</SelectItem>
                          <SelectItem value="zh-TW">Chinese (Traditional)</SelectItem>
                          <SelectItem value="co">Corsican</SelectItem>
                          <SelectItem value="hr">Croatian</SelectItem>
                          <SelectItem value="cs">Czech</SelectItem>
                          <SelectItem value="da">Danish</SelectItem>
                          <SelectItem value="nl">Dutch</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="eo">Esperanto</SelectItem>
                          <SelectItem value="et">Estonian</SelectItem>
                          <SelectItem value="tl">Filipino</SelectItem>
                          <SelectItem value="fi">Finnish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="fy">Frisian</SelectItem>
                          <SelectItem value="gl">Galician</SelectItem>
                          <SelectItem value="ka">Georgian</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                          <SelectItem value="el">Greek</SelectItem>
                          <SelectItem value="gu">Gujarati</SelectItem>
                          <SelectItem value="ht">Haitian Creole</SelectItem>
                          <SelectItem value="ha">Hausa</SelectItem>
                          <SelectItem value="haw">Hawaiian</SelectItem>
                          <SelectItem value="iw">Hebrew</SelectItem>
                          <SelectItem value="hi">Hindi</SelectItem>
                          <SelectItem value="hmn">Hmong</SelectItem>
                          <SelectItem value="hu">Hungarian</SelectItem>
                          <SelectItem value="is">Icelandic</SelectItem>
                          <SelectItem value="ig">Igbo</SelectItem>
                          <SelectItem value="id">Indonesian</SelectItem>
                          <SelectItem value="ga">Irish</SelectItem>
                          <SelectItem value="it">Italian</SelectItem>
                          <SelectItem value="ja">Japanese</SelectItem>
                          <SelectItem value="jw">Javanese</SelectItem>
                          <SelectItem value="kn">Kannada</SelectItem>
                          <SelectItem value="kk">Kazakh</SelectItem>
                          <SelectItem value="km">Khmer</SelectItem>
                          <SelectItem value="ko">Korean</SelectItem>
                          <SelectItem value="ku">Kurdish (Kurmanji)</SelectItem>
                          <SelectItem value="ky">Kyrgyz</SelectItem>
                          <SelectItem value="lo">Lao</SelectItem>
                          <SelectItem value="la">Latin</SelectItem>
                          <SelectItem value="lv">Latvian</SelectItem>
                          <SelectItem value="lt">Lithuanian</SelectItem>
                          <SelectItem value="lb">Luxembourgish</SelectItem>
                          <SelectItem value="mk">Macedonian</SelectItem>
                          <SelectItem value="mg">Malagasy</SelectItem>
                          <SelectItem value="ms">Malay</SelectItem>
                          <SelectItem value="ml">Malayalam</SelectItem>
                          <SelectItem value="mt">Maltese</SelectItem>
                          <SelectItem value="mi">Maori</SelectItem>
                          <SelectItem value="mr">Marathi</SelectItem>
                          <SelectItem value="mn">Mongolian</SelectItem>
                          <SelectItem value="my">Myanmar (Burmese)</SelectItem>
                          <SelectItem value="ne">Nepali</SelectItem>
                          <SelectItem value="no">Norwegian</SelectItem>
                          <SelectItem value="ps">Pashto</SelectItem>
                          <SelectItem value="fa">Persian</SelectItem>
                          <SelectItem value="pl">Polish</SelectItem>
                          <SelectItem value="pt">Portuguese</SelectItem>
                          <SelectItem value="pa">Punjabi</SelectItem>
                          <SelectItem value="ro">Romanian</SelectItem>
                          <SelectItem value="ru">Russian</SelectItem>
                          <SelectItem value="sm">Samoan</SelectItem>
                          <SelectItem value="gd">Scots Gaelic</SelectItem>
                          <SelectItem value="sr">Serbian</SelectItem>
                          <SelectItem value="st">Sesotho</SelectItem>
                          <SelectItem value="sn">Shona</SelectItem>
                          <SelectItem value="sd">Sindhi</SelectItem>
                          <SelectItem value="si">Sinhala</SelectItem>
                          <SelectItem value="sk">Slovak</SelectItem>
                          <SelectItem value="sl">Slovenian</SelectItem>
                          <SelectItem value="so">Somali</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="su">Sundanese</SelectItem>
                          <SelectItem value="sw">Swahili</SelectItem>
                          <SelectItem value="sv">Swedish</SelectItem>
                          <SelectItem value="tg">Tajik</SelectItem>
                          <SelectItem value="ta">Tamil</SelectItem>
                          <SelectItem value="te">Telugu</SelectItem>
                          <SelectItem value="th">Thai</SelectItem>
                          <SelectItem value="tr">Turkish</SelectItem>
                          <SelectItem value="uk">Ukrainian</SelectItem>
                          <SelectItem value="ur">Urdu</SelectItem>
                          <SelectItem value="uz">Uzbek</SelectItem>
                          <SelectItem value="vi">Vietnamese</SelectItem>
                          <SelectItem value="cy">Welsh</SelectItem>
                          <SelectItem value="xh">Xhosa</SelectItem>
                          <SelectItem value="yi">Yiddish</SelectItem>
                          <SelectItem value="yo">Yoruba</SelectItem>
                          <SelectItem value="zu">Zulu</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button>Save & Continue</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contacts">
              <Card>
                <CardHeader>
                  <CardTitle>Emergency Contacts</CardTitle>
                  <CardDescription>Add emergency contacts for the student</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="border rounded-md p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Primary Contact</h3>
                      <div className="flex items-center space-x-2">
                        <Switch id="primary-risk" />
                        <Label htmlFor="primary-risk" className="text-sm text-red-600">
                          Risk Indicator
                        </Label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="contact-name">Full Name</Label>
                        <Input id="contact-name" placeholder="Contact name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="relationship">Relationship</Label>
                        <Select>
                          <SelectTrigger id="relationship">
                            <SelectValue placeholder="Select relationship" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mother">Mother</SelectItem>
                            <SelectItem value="father">Father</SelectItem>
                            <SelectItem value="guardian">Guardian</SelectItem>
                            <SelectItem value="grandparent">Grandparent</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact-phone">Phone Number</Label>
                        <Input id="contact-phone" placeholder="Phone number" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact-email">Email</Label>
                        <Input id="contact-email" type="email" placeholder="Email address" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact-address">Address</Label>
                      <Textarea id="contact-address" placeholder="Contact address" />
                      <div className="flex items-center space-x-2 mt-2">
                        <Switch id="same-address" />
                        <Label htmlFor="same-address" className="text-sm">
                          Same as student
                        </Label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="risk-notes">Risk Notes</Label>
                      <Textarea id="risk-notes" placeholder="Add any risk information here..." />
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    + Add Another Contact
                  </Button>

                  <div className="flex justify-end">
                    <Button>Save & Continue</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="safeguarding">
              <Card>
                <CardHeader>
                  <CardTitle>Safeguarding Information</CardTitle>
                  <CardDescription>Add safeguarding details for the student</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="safeguarding-status">Safeguarding Status</Label>
                      <Select>
                        <SelectTrigger id="safeguarding-status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="cp">Child Protection (CP)</SelectItem>
                          <SelectItem value="cin">Child in Need (CIN)</SelectItem>
                          <SelectItem value="lac">Looked After Child (LAC)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sen-status">SEN Status</Label>
                      <Select>
                        <SelectTrigger id="sen-status">
                          <SelectValue placeholder="Select SEN status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="send-support">SEND Support</SelectItem>
                          <SelectItem value="ehcp">EHCP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="eal" />
                      <Label htmlFor="eal">English as an Additional Language (EAL)</Label>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="languages">Languages Spoken</Label>
                      <Select>
                        <SelectTrigger id="languages">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="albanian">Albanian</SelectItem>
                          <SelectItem value="arabic">Arabic</SelectItem>
                          <SelectItem value="bengali">Bengali</SelectItem>
                          <SelectItem value="bulgarian">Bulgarian</SelectItem>
                          <SelectItem value="chinese">Chinese (Mandarin)</SelectItem>
                          <SelectItem value="cantonese">Chinese (Cantonese)</SelectItem>
                          <SelectItem value="czech">Czech</SelectItem>
                          <SelectItem value="dutch">Dutch</SelectItem>
                          <SelectItem value="farsi">Farsi</SelectItem>
                          <SelectItem value="french">French</SelectItem>
                          <SelectItem value="german">German</SelectItem>
                          <SelectItem value="greek">Greek</SelectItem>
                          <SelectItem value="gujarati">Gujarati</SelectItem>
                          <SelectItem value="hindi">Hindi</SelectItem>
                          <SelectItem value="italian">Italian</SelectItem>
                          <SelectItem value="japanese">Japanese</SelectItem>
                          <SelectItem value="korean">Korean</SelectItem>
                          <SelectItem value="lithuanian">Lithuanian</SelectItem>
                          <SelectItem value="panjabi">Panjabi</SelectItem>
                          <SelectItem value="pashto">Pashto</SelectItem>
                          <SelectItem value="polish">Polish</SelectItem>
                          <SelectItem value="portuguese">Portuguese</SelectItem>
                          <SelectItem value="romanian">Romanian</SelectItem>
                          <SelectItem value="russian">Russian</SelectItem>
                          <SelectItem value="slovak">Slovak</SelectItem>
                          <SelectItem value="somali">Somali</SelectItem>
                          <SelectItem value="spanish">Spanish</SelectItem>
                          <SelectItem value="tamil">Tamil</SelectItem>
                          <SelectItem value="turkish">Turkish</SelectItem>
                          <SelectItem value="urdu">Urdu</SelectItem>
                          <SelectItem value="welsh">Welsh</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="sm" className="mt-2">
                        Add Another Language
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Agency Involvement</Label>
                    <div className="border rounded-md p-4">
                      <div className="flex flex-wrap gap-2">
                        <Button type="button" variant="outline" size="sm">
                          Local Children's Services
                        </Button>
                        <Button type="button" variant="outline" size="sm">
                          CAMHS
                        </Button>
                        <Button type="button" variant="outline" size="sm">
                          + Add Agency
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="confidential" />
                    <Label htmlFor="confidential">Contains confidential information</Label>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="safeguarding-notes">Additional Safeguarding Notes</Label>
                    <Textarea id="safeguarding-notes" placeholder="Add any additional safeguarding information..." />
                  </div>

                  <div className="flex justify-end">
                    <Button>Save & Continue</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="education">
              <Card>
                <CardHeader>
                  <CardTitle>Education Details</CardTitle>
                  <CardDescription>Add educational information for the student</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="year-group">Year Group</Label>
                      <Select>
                        <SelectTrigger id="year-group">
                          <SelectValue placeholder="Select year group" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="year-1">Year 1</SelectItem>
                          <SelectItem value="year-2">Year 2</SelectItem>
                          <SelectItem value="year-3">Year 3</SelectItem>
                          <SelectItem value="year-4">Year 4</SelectItem>
                          <SelectItem value="year-5">Year 5</SelectItem>
                          <SelectItem value="year-6">Year 6</SelectItem>
                          <SelectItem value="year-7">Year 7</SelectItem>
                          <SelectItem value="year-8">Year 8</SelectItem>
                          <SelectItem value="year-9">Year 9</SelectItem>
                          <SelectItem value="year-10">Year 10</SelectItem>
                          <SelectItem value="year-11">Year 11</SelectItem>
                          <SelectItem value="year-12">Year 12</SelectItem>
                          <SelectItem value="year-13">Year 13</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tutor-group">Tutor Group</Label>
                      <Input id="tutor-group" placeholder="e.g. 7A" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="previous-school">Previous School</Label>
                    <Input id="previous-school" placeholder="Previous school name" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="education-notes">Additional Education Notes</Label>
                    <Textarea id="education-notes" placeholder="Add any additional educational information..." />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline">Save Draft</Button>
                    <Button>Create Student Record</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

