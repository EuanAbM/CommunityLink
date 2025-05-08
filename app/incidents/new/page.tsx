import { SiteHeader } from "@/components/layout/site-header"
import { IncidentReportForm } from "@/components/incidents/incident-form"
import TestFormPage from "@/components/incidents/testform"

export default function NewIncidentPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold">Report Incident</h1>
            <p className="text-muted-foreground">Record a new safeguarding incident or concern</p>
          </div>
          <IncidentReportForm />
          <TestFormPage />
        </div>
      </main>
    </div>
  )
}
