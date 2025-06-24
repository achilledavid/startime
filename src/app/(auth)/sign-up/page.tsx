"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { signUp } from "@/lib/auth-client"
import { Fragment } from "react"
import { redirect } from "next/navigation"

const formSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8, "8 chars. min").max(128, "128 chars. max")
})

export default function SignUp() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      name: ""
    }
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await signUp.email({
      ...values,
      callbackURL: "/account"
    }, {
      onError: (data) => {
        form.setError("name", {});
        form.setError("email", {});
        form.setError("password", { message: data.error.message });
      }
    }).then((response) => { if (response.data?.user) redirect("/account") });
  }

  return (
    <Fragment>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Create your account</h1>
            <p className="text-muted-foreground text-sm text-balance">
              Please enter your details below to sign up for Startime.
            </p>
          </div>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Sign up</Button>
          <Button type="button" variant="secondary" asChild>
            <Link href="/sign-in">
              Already have an account?
            </Link>
          </Button>
        </form>
      </Form>
    </Fragment>
  )
}