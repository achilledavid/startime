import Link from "next/link";
import { Button } from "./ui/button";
import AuthNavigation from "./auth/nav";

export default function Header() {
  return (
    <header className="min-h-14 flex items-center justify-between gap-4 max-w-7xl mx-auto px-4">
      <Button asChild variant="link">
        <Link href="/">Startime</Link>
      </Button>
      <AuthNavigation />
    </header>
  )
}
