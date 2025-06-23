import { PropsWithChildren } from "react";
import { ArrowLeft } from 'lucide-react';

import Image from "next/image";
import Link from "next/link";
export default function AuthLayout({ children }: PropsWithChildren) {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="bg-muted relative hidden lg:block">
                <Image
                    src="/"
                    alt="Image"
                    width={500}
                    height={500}
                className="absolute h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
            </div>
        <div className="flex flex-col gap-4 p-6 md:p-10">
            <div className="flex justify-center gap-2 md:justify-start">
                <Link href="/" className="flex items-center gap-2 font-medium">
                <div className="text-primary-foreground flex size-6 items-center justify-center rounded-md">
                    <ArrowLeft color="black"/>
                </div>
                Back to the Homepage
                </Link>
            </div>
                <div className="flex flex-col flex-1 items-center justify-center">
                    {children}
                </div>
            </div>
        </div>
    )
}