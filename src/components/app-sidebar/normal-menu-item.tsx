import Link from "next/link";
import {
  SidebarMenuButton,
} from "../ui/sidebar";
import { MenuItem } from "./sidebar";

export default function NormalMenuItem({ slug, item }: { slug: string, item: MenuItem }) {
  return (
    <SidebarMenuButton asChild>
      <Link href={"/" + slug + item.url}>
        <item.icon />
        <span>{item.title}</span>
      </Link>
    </SidebarMenuButton>
  );
}
