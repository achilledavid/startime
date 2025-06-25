"use client"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Organization } from "@/routers/organization";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { oklch, formatHex } from 'culori';
import z from "zod";
import { Button } from "@/components/ui/button";
import { trpc } from "@/app/_trpc/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RotateCcw } from "lucide-react";

const personalizationSchema = z.object({
  color: z.string()
    .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, "Please enter a valid hex color")
    .refine((color) => {
      const hex = color.replace('#', '');
      const r = parseInt(hex.length === 3 ? hex[0] + hex[0] : hex.slice(0, 2), 16);
      const g = parseInt(hex.length === 3 ? hex[1] + hex[1] : hex.slice(2, 4), 16);
      const b = parseInt(hex.length === 3 ? hex[2] + hex[2] : hex.slice(4, 6), 16);

      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

      return luminance <= 0.7;
    }, "Color is too light and may cause contrast issues. Please choose a darker color."),
})

const getOklch = (color: string) => {
  const data = color.match(/\(([^)]+)\)/)?.[1] || "";

  const slice = data.split(" ") || ["0", "0", "0"];

  return { mode: 'oklch' as const, l: parseFloat(slice[0]), c: parseFloat(slice[1]), h: parseFloat(slice[2]) };
}

export default function ChangeColor({ organization, refetch }: { organization: Organization["organization"], refetch: () => void }) {
  const mutation = trpc.organization.putColor.useMutation();
  const oklchColor = getOklch(organization.color);
  const hexColor = formatHex(oklch(oklchColor));

  const form = useForm<z.infer<typeof personalizationSchema>>({
    resolver: zodResolver(personalizationSchema),
    defaultValues: {
      color: hexColor,
    },
  })

  const onSubmit = async (values: z.infer<typeof personalizationSchema>) => {
    const hexToOklch = (hex: string) => {
      const oklchColor = oklch(hex);

      if (!oklchColor) return

      return `${oklchColor.l || 0} ${oklchColor.c || 0} ${oklchColor.h || 0}`;
    };

    const oklchValue = `oklch(${hexToOklch(values.color)})`;

    mutation.mutate({
      slug: organization.slug,
      color: oklchValue,
    }, {
      onSuccess: () => refetch()
    });
  }

  return (
    <div className="max-w-2xl space-y-4">
      <div>
        <strong className="text-lg font-semibold tracking-tight">Color Settings</strong>
        <p className="text-sm text-muted-foreground">
          Choose a color that will be used throughout your organization's interface.
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary Color</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <Input
                      className="flex-1 font-mono"
                      placeholder="#000000"
                      {...field}
                    />
                    <Input
                      type="color"
                      className="w-12 h-9 border border-input p-1 rounded-md cursor-pointer bg-transparent [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch]:rounded-[4px] [&::-moz-color-swatch]:border-0 [&::-moz-color-swatch]:rounded-[4px] [&::-moz-focus-inner]:border-0"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Separator />
          <div className="p-4 border rounded-lg space-y-6" style={{
            '--primary': form.watch("color")
          } as React.CSSProperties}>
            <div className="flex flex-col gap-3">
              <strong className="text-sm font-medium">Buttons</strong>
              <div className="flex items-center gap-4 flex-wrap">
                <Button type="button" size="sm" className="transition-none">Primary</Button>
                <Button type="button" variant="secondary" size="sm">Secondary</Button>
                <Button type="button" variant="outline" size="sm">Outline</Button>
                <Button type="button" variant="ghost" size="sm">Ghost</Button>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <strong className="text-sm font-medium">Interactive elements</strong>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-md">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-sm font-medium">Active State</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-muted border rounded-md">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/50"></div>
                  <span className="text-sm text-muted-foreground">Inactive State</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-medium">Color variations</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="h-8 rounded-md bg-primary"></div>
                  <span className="text-xs text-muted-foreground">Primary (100%)</span>
                </div>
                <div>
                  <div className="h-8 rounded-md bg-primary/80"></div>
                  <span className="text-xs text-muted-foreground">Primary (80%)</span>
                </div>
                <div>
                  <div className="h-8 rounded-md bg-primary/60"></div>
                  <span className="text-xs text-muted-foreground">Primary (60%)</span>
                </div>
                <div>
                  <div className="h-8 rounded-md bg-primary/20"></div>
                  <span className="text-xs text-muted-foreground">Primary (20%)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => form.reset({ color: hexColor })}
            >
              <RotateCcw />
              Reset
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending || !form.formState.isValid}
            >
              Save changes
            </Button>
          </div>
        </form>
      </Form>
    </div >
  )
}
