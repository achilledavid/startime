import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Resource } from "@/routers/resources";
import { Clock, Download } from "lucide-react";
import Link from "next/link";

export default function ResourceCard({ resource }: { resource: Resource }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{resource.title}</CardTitle>
                <CardDescription>{resource.description}</CardDescription>
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