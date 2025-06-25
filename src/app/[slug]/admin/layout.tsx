"use client"
import { useOrganization } from "@/contexts/organization"
import { useActiveMember } from "@/lib/auth-client"
import { notFound } from "next/navigation"
import { PropsWithChildren } from "react"

export default function AdminLayout({ children }: PropsWithChildren) {
  const { data } = useOrganization()
  const { data: member } = useActiveMember()

  if (!data || !member) return

  const isOwner = member.role === "owner"

  if (isOwner) return children
  else notFound()
}
