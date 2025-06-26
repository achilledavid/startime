import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Resource } from "@/routers/resources";
import { Clock, Download, MoreVertical, Trash } from "lucide-react";
import Link from "next/link";

export default function ResourceCard({ resource, isOwner = false, refetch }: { resource: Resource, isOwner?: boolean, refetch: () => void }) {
    const mutation = trpc.resources.delete.useMutation({
        onSuccess: () => {
            refetch()
        }
    })

    async function handleRemove() {
        await mutation.mutateAsync({ url: resource.url })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{resource.title}</CardTitle>
                <CardDescription>{resource.description}</CardDescription>
                {isOwner && (
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
            <CardContent className="flex items-center gap-4 text-muted-foreground text-sm">
                <p>{resource.size}</p>
                <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <p>{new Date(resource.createdAt).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })}</p>
                </div>
            </CardContent>
            <CardFooter>
                <Button asChild variant="outline" className="w-full">
                    <Link href={resource.url} download target="_blank">
                        <Download />
                        Download
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    )
}
