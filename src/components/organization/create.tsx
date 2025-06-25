"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react";
import { organization } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";
import { createOrganization } from "@/lib/organization";
import { Plus } from "lucide-react";

const formSchema = z.object({
    name: z.string().min(2, "2 chars. min").max(128, "128 chars. max"),
})

export default function CreateOrganization() {
    const [open, setOpen] = useState(false)

    const mutation = useMutation({
        mutationFn: createOrganization,
        onError: (error) => {
            form.setError("name", { message: error.message })
        },
        onSuccess: (response) => {
            setOpen(false);
            organization.setActive({
                organizationId: response.data.id
            })
        }
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        mutation.mutate(values)
    }

    useEffect(() => { form.reset() }, [open, form])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus />
                    Create organization
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a new organization</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Organization name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={mutation.isPending}>
                            Create
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
