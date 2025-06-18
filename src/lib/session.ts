import { redirect } from "next/navigation";
import { auth } from "./auth";
import { headers } from "next/headers";

type Session = Awaited<ReturnType<typeof auth.api.getSession>>
export type CurrentSession = Exclude<Session, null>
export type User = Omit<CurrentSession["user"], "createdAt" | "updatedAt"> & {
    createdAt: string | Date;
    updatedAt: string | Date;
};

export async function authenticate<T extends boolean = true>(redirection: T = true as T): Promise<T extends true ? CurrentSession : Session> {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session && redirection) {
        redirect("/");
    }

    return session as unknown as CurrentSession;
}