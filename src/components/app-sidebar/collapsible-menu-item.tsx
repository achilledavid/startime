import { ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { SidebarMenuButton, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "../ui/sidebar";
import { MenuItem } from "./sidebar";
import Link from "next/link";

export default function CollapsibleMenuItem({ slug, item }: { slug: string, item: MenuItem }) {

  return (
    <Collapsible className="group/collapsible">
      <CollapsibleTrigger asChild>
        <SidebarMenuButton className="cursor-pointer">
          <item.icon />
          <span>{item.title}</span>
          <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
        </SidebarMenuButton>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarMenuSub>
          {item.items?.length && item.items.map((subItem) => (
            <SidebarMenuSubItem key={subItem.title}>
              <SidebarMenuSubButton asChild>
                <Link href={"/" + slug + subItem.url}>
                  <subItem.icon />
                  <span>{subItem.title}</span>
                </Link>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  );
}
