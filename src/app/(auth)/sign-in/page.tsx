"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { signIn } from "@/lib/auth-client"
import Link from "next/link"
import { Fragment } from "react"

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "8 chars. min").max(128, "128 chars. max"),
})

export default function SignIn() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await signIn.email({
      ...values,
      callbackURL: "/account"
    }, {
      onError: (data) => {
        form.setError("email", {});
        form.setError("password", { message: data.error.message });
      }
    });
  }

  return (
    <Fragment>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 p-10 w-2xl">
            <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Welcome</h1>
            <p className="text-muted-foreground text-sm text-balance">
              Login to your account to your Startime account
            </p>
          </div>
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
          <Button type="submit">Submit</Button>
          <FormMessage />
        </form>
      </Form>
      <Button variant="secondary" asChild>
        <Link href="/sign-up">
          No account? Sign up
        </Link>
      </Button>
    </Fragment>
  )
}