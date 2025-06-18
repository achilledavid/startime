import Link from "next/link"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { User } from "lucide-react"

export default function MyAccount() {
  return (
    <Link href="/account" className="h-14 flex items-center justify-center aspect-square">
      <Avatar>
        <AvatarFallback><User className="size-4" /></AvatarFallback>
      </Avatar>
    </Link>
  )
}
