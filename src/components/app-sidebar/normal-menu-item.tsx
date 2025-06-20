import {
  SidebarMenuButton,
} from "../ui/sidebar";
import { MenuItem } from "./sidebar";

export default function NormalMenuItem({ item }: { item: MenuItem }) {
  return (
    <SidebarMenuButton asChild>
      <a href={item.url}>
        <item.icon />
        <span>{item.title}</span>
      </a>
    </SidebarMenuButton>
  );
}
