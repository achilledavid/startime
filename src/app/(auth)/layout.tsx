import { PropsWithChildren } from "react";

export default function AuthLayout({ children }: PropsWithChildren) {
    return (
        <div className="space-y-4 p-4">
            {children}
        </div>
    )
}