"use client"
import { Fragment } from "react"
import { Separator } from "@/components/ui/separator"
import ChangeColor from "./change-color"
import { useOrganization } from "@/contexts/organization"

export default function Personalization() {
  const { data, refetch } = useOrganization()

  if (!data) return

  return (
    <Fragment>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Personalization</h1>
            <p className="text-muted-foreground">Customize your organization&apos;s appearance and settings to match your brand identity.</p>
          </div>
        </div>
      </div>
      <Separator />
      <div className="p-4">
        <ChangeColor organization={data.organization} refetch={refetch} />
      </div>
    </Fragment>
  )
}
