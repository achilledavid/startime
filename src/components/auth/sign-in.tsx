import Link from "next/link"
import { Button } from "../ui/button"

export default function SignIn() {
    return (
        <Button asChild>
            <Link href="/sign-in">
                Sign in
            </Link>
        </Button>
    )
}
