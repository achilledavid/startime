import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { organization } from "@/lib/auth-client";
import { User } from "@/lib/session";
import { Member } from "better-auth/plugins/organization";
import { Calendar, Crown, MoreVertical, Settings, Trash, UserIcon } from "lucide-react";

export default function MemberCard({ member, user, isOwner = false, refetch }: { member: Member, user: User, isOwner?: boolean, refetch: () => void }) {
    async function handleRemove() {
        await organization.removeMember({
            memberIdOrEmail: member.id
        }).then(() => refetch())
    }

    const getRoleIcon = (role: string) => {
        switch (role) {
            case "owner":
                return Crown
            case "admin":
                return Settings
            default:
                return UserIcon
        }
    }

    const RoleIcon = getRoleIcon(member.role)

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {user.name}
                </CardTitle>
                <CardDescription>{user.email}</CardDescription>
                {(member.role === "member" && isOwner) && (
                    <CardAction>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem variant="destructive" onClick={handleRemove}><Trash />Remove</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </CardAction>
                )}
            </CardHeader>
            <CardContent className="flex items-center gap-2">
                <Badge className="capitalize">
                    <RoleIcon className="w-3 h-3" />
                    {member.role}
                </Badge>
                <Badge variant="secondary">
                    <Calendar className="w-3 h-3" />
                    {new Date(member.createdAt).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })}
                </Badge>
            </CardContent>
        </Card>
    )
}