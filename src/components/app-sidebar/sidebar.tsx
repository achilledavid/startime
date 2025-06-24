"use client"

import {
  Home,
  Users,
  UserPlus,
  Route,
  FolderOpen,
  Edit,
  Eye,
  FileText,
  Palette,
  Building,
  Settings,
  BookOpen,
  LucideIcon,
} from "lucide-react"


import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import CollapsibleMenuItem from "./collapsible-menu-item"
import NormalMenuItem from "./normal-menu-item"
import Link from "next/link"
import UserItem from "./user-item"
import { useActiveMember } from "@/lib/auth-client"
import { useOrganization } from "@/contexts/organization"
import { Fragment } from "react"

export type MenuItem = {
  title: string
  url?: string
  icon: LucideIcon
  requiredRoles?: string[]
  items?: MenuItem[]
}

const menuItems: MenuItem[] = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Members",
    icon: Users,
    items: [
      {
        title: "Members list",
        url: "/members",
        icon: Users,
      },
      {
        title: "Add a new member",
        url: "/members/add",
        icon: UserPlus,
        requiredRoles: ["owner"],
      },
    ],
  },
  // {
  //   title: "My profile",
  //   url: "/profile",
  //   icon: User,
  // },
  {
    title: "Onboarding journey",
    icon: Route,
    items: [
      {
        title: "See all",
        url: "/admin/onboardings",
        icon: FolderOpen,
        requiredRoles: ["owner"],
      },
      {
        title: "Create",
        url: "/admin/onboardings/new",
        icon: Edit,
        requiredRoles: ["owner"],
      },
      {
        title: "Preview mode",
        url: "/admin/onboardings/preview",
        icon: Eye,
        requiredRoles: ["owner"],
      },
      {
        title: "My onboarding",
        url: "/onboarding",
        icon: BookOpen,
        requiredRoles: ["member"],
      },
    ],
  },
  // {
  //   title: "Suivi & automatisation",
  //   icon: BarChart3,
  //   requiredRoles: ["owner"],
  //   items: [
  //     {
  //       title: "Tableau de bord",
  //       url: "/analytics",
  //       icon: BarChart3,
  //       requiredRoles: ["owner"],
  //     },
  //     {
  //       title: "Automatisations",
  //       url: "/automations",
  //       icon: Zap,
  //       requiredRoles: ["owner"],
  //     },
  //     {
  //       title: "Historique",
  //       url: "/history",
  //       icon: Archive,
  //       requiredRoles: ["owner"],
  //     },
  //   ],
  // },
  // {
  //   title: "Communication",
  //   icon: MessageSquare,
  //   items: [
  //     {
  //       title: "Notifications",
  //       url: "/notifications",
  //       icon: Bell,
  //     },
  //     {
  //       title: "Interlocuteurs clés",
  //       url: "/contacts",
  //       icon: UserCheck,
  //     },
  //     {
  //       title: "FAQ",
  //       url: "/faq",
  //       icon: HelpCircle,
  //     },
  //   ],
  // },
  {
    title: "Resources & documents",
    icon: FileText,
    url: "/resources",
  },
  // {
  //   title: "Outils de l'entreprise",
  //   url: "/tools",
  //   icon: Wrench,
  // },
  // {
  //   title: "Événements",
  //   url: "/events",
  //   icon: Calendar,
  // },
  // {
  //   title: "Intégrations",
  //   icon: Plug,
  //   requiredRoles: ["owner"],
  //   items: [
  //     {
  //       title: "Intégrations externes",
  //       url: "/integrations",
  //       icon: Plug,
  //       requiredRoles: ["owner"],
  //     },
  //   ],
  // },
  {
    title: "Personalization",
    icon: Palette,
    url: "/admin/personalization",
    requiredRoles: ["owner"],
    // items: [
    // {
    //   title: "Graphique themes",
    //   url: "/admin/customization/themes",
    //   icon: Palette,
    //   requiredRoles: ["owner"],
    // },
    // {
    //   title: "Branding",
    //   url: "/customization/branding",
    //   icon: Building,
    //   requiredRoles: ["owner"],
    // },
    // {
    //   title: "Culture d'entreprise",
    //   url: "/customization/culture",
    //   icon: Lightbulb,
    //   requiredRoles: ["owner"],
    // },
    // ],
  },
  {
    title: "Settings",
    icon: Settings,
    url: "/admin/settings",
    requiredRoles: ["owner"],
    // items: [
    // {
    //   title: "Gestion des droits",
    //   url: "/settings/permissions",
    //   icon: Shield,
    //   requiredRoles: ["owner"],
    // },
    // {
    //   title: "Templates de mails",
    //   url: "/settings/templates",
    //   icon: Mail,
    //   requiredRoles: ["owner"],
    // },
    //   {
    //     title: "General settings",
    //     url: "/admin/settings",
    //     icon: Settings,
    //     requiredRoles: ["owner"],
    //   },
    // ],
  },
]

export function AppSidebar() {
  const { data: member } = useActiveMember()
  const { data, isPending } = useOrganization()

  const filteredMenuItems = menuItems.filter((item) => {
    if (!member) return false;

    if (item.items) {
      item.items = item.items.filter(subItem => {
        if (!subItem.requiredRoles) return true;

        return subItem.requiredRoles.some(role => member.role === role);
      });
    }

    if (!item.requiredRoles) return true;

    return item.requiredRoles.some(role => member.role === role);
  });

  return (
    <Sidebar>
      {(data && member && !isPending) && (
        <Fragment>
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" asChild>
                  <Link href={`/${data.organization.slug}`}>
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                      <Building className="size-4" />
                    </div>
                    <div className="flex flex-col gap-0.5 leading-none">
                      <span className="font-semibold">{data.organization.name}</span>
                      <span className="text-xs text-muted-foreground">Powered by Startime</span>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {filteredMenuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      {item.items ? (
                        <CollapsibleMenuItem slug={data.organization.slug} item={item} />
                      ) : (
                        <NormalMenuItem slug={data.organization.slug} item={item} />
                      )}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <UserItem />
            </SidebarMenu>
          </SidebarFooter>
        </Fragment>
      )}
    </Sidebar>
  )
}