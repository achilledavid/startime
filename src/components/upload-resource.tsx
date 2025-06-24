import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { trpc } from "@/app/_trpc/client";
import { Organization } from "@/routers/organization";
import { useMutation } from "@tanstack/react-query";
import { formatFileSize, uploadFile } from "@/lib/blob";
import { useState } from "react";
import { Textarea } from "./ui/textarea";

const formSchema = z.object({
    title: z.string(),
    description: z.string().optional()
})

export default function UploadResource({ organization, onSuccess }: { organization: Organization["organization"], onSuccess?: () => void }) {
    const [file, setFile] = useState<File>()
    const [open, setOpen] = useState(false)

    const mutation = trpc.resources.post.useMutation({
        onSuccess: () => {
            setOpen(false)
            setFile(undefined)
            onSuccess?.()
        }
    })

    const blobMutation = useMutation({
        mutationFn: async (file: File) => {
            return await uploadFile(file, organization.slug)
        }
    })

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const selectedFile = e.target.files?.[0]
        if (selectedFile) setFile(selectedFile)
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: ""
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            if (!file) throw new Error("No file selected")

            const res = await blobMutation.mutateAsync(file);

            await mutation.mutateAsync({
                id: organization.id,
                payload: {
                    ...values,
                    ...res,
                    size: formatFileSize(file.size)
                }
            });

            form.reset();
        } catch (error) {
            console.error("Error during submission:", error);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-fit">Upload a new resource</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload a new resource</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormDescription>(optional)</FormDescription>
                                    <FormControl>
                                        <Textarea {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormItem>
                            <FormLabel>File</FormLabel>
                            <Input type="file" onChange={handleFileChange} />
                        </FormItem>
                        <Button type="submit" disabled={mutation.isPending || blobMutation.isPending}>Submit</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}