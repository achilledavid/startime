"use client"

import { useSession } from "@/lib/auth-client";
import MyAccount from "./my-account";
import SignIn from "./sign-in";

export default function AuthNavigation() {
    const { data: session, isPending } = useSession();
    return !isPending && (session ? <MyAccount /> : <SignIn />)
}