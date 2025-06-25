import { PropsWithChildren } from "react";
import { ArrowLeft } from 'lucide-react';
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AuthLayout({ children }: PropsWithChildren) {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="bg-muted relative hidden lg:block">
                <Image
                    width={1080}
                    height={1080}
                    src="/placeholder.jpg"
                    alt="Image"
                    className="absolute inset-0 h-full w-full object-cover brightness-[0.5] dark:grayscale"
                />
            </div>
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <Button asChild variant="link">
                        <Link href="/">
                            <ArrowLeft />
                            Back
                        </Link>
                    </Button>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}