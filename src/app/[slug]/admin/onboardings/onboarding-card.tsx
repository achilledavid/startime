import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Onboarding } from "@/routers/onboarding";
import { Member } from "better-auth/plugins/organization";
import { MoreVertical, Trash } from "lucide-react";
import Link from "next/link";

export default function OnBoardingCard({ slug, onboarding, refetch, member }: { slug: string, onboarding: Onboarding["data"], refetch: () => void, member: Member }) {
  const mutation = trpc.onboarding.delete.useMutation();

  function handleDelete() {
    mutation.mutate({ onboardingId: onboarding.id, userId: member.userId }, {
      onSuccess: () => {
        refetch()
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{onboarding.title}</CardTitle>
        <CardDescription>{onboarding.description}</CardDescription>
        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem variant="destructive" onClick={handleDelete}><Trash />Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader >
      <CardContent className="space-y-4">
        <Button
          asChild
          className="w-full"
        >
          <Link href={`/${slug}/admin/onboardings/${onboarding.id}`}>
            Edit
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
