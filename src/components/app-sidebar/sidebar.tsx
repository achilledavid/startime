"use client"

import {
  Home,
  Users,
  UserPlus,
  User,
  Route,
  FolderOpen,
  Edit,
  Eye,
  BarChart3,
  Zap,
  Archive,
  Bell,
  UserCheck,
  HelpCircle,
  FileText,
  Upload,
  Wrench,
  Calendar,
  Plug,
  Palette,
  Building,
  Lightbulb,
  Settings,
  Shield,
  Mail,
  BookOpen,
  MessageSquare,
  LucideIcon,
  Loader2
} from "lucide-react"


import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import CollapsibleMenuItem from "./collapsible-menu-item"
import NormalMenuItem from "./normal-menu-item"
import Link from "next/link"
import UserItem from "./user-item"
import { useActiveMember, useActiveOrganization } from "@/lib/auth-client"

export interface MenuItem {
  title: string
  url?: string
  icon: LucideIcon
  requiredRoles?: string[]
  items?: MenuItem[]
}

const menuItems: MenuItem[] = [
  {
    title: "Accueil",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Utilisateurs",
    icon: Users,
    requiredRoles: ["owner"],
    items: [
      {
        title: "Liste des utilisateurs",
        url: "/users",
        icon: Users,
        requiredRoles: ["owner"],
      },
      {
        title: "Ajouter un utilisateur",
        url: "/users/add",
        icon: UserPlus,
        requiredRoles: ["owner"],
      },
    ],
  },
  {
    title: "Mon profil",
    url: "/profile",
    icon: User,
  },
  {
    title: "Parcours d'intégration",
    icon: Route,
    items: [
      {
        title: "Mes parcours",
        url: "/onboarding/list",
        icon: FolderOpen,
        requiredRoles: ["owner"],
      },
      {
        title: "Créer un parcours",
        url: "/admin/onboarding/edit",
        icon: Edit,
        requiredRoles: ["owner"],
      },
      {
        title: "Mode test",
        url: "/onboarding/preview",
        icon: Eye,
        requiredRoles: ["owner"],
      },
      {
        title: "Mon parcours",
        url: "/onboarding",
        icon: BookOpen,
        requiredRoles: ["member"],
      },
    ],
  },
  {
    title: "Suivi & automatisation",
    icon: BarChart3,
    requiredRoles: ["owner"],
    items: [
      {
        title: "Tableau de bord",
        url: "/analytics",
        icon: BarChart3,
        requiredRoles: ["owner"],
      },
      {
        title: "Automatisations",
        url: "/automations",
        icon: Zap,
        requiredRoles: ["owner"],
      },
      {
        title: "Historique",
        url: "/history",
        icon: Archive,
        requiredRoles: ["owner"],
      },
    ],
  },
  {
    title: "Communication",
    icon: MessageSquare,
    items: [
      {
        title: "Notifications",
        url: "/notifications",
        icon: Bell,
      },
      {
        title: "Interlocuteurs clés",
        url: "/contacts",
        icon: UserCheck,
      },
      {
        title: "FAQ",
        url: "/faq",
        icon: HelpCircle,
      },
    ],
  },
  {
    title: "Ressources & documents",
    icon: FileText,
    items: [
      {
        title: "Bibliothèque",
        url: "/documents",
        icon: FileText,
      },
      {
        title: "Import / Upload",
        url: "/documents/upload",
        icon: Upload,
        requiredRoles: ["owner"],
      },
    ],
  },
  {
    title: "Outils de l'entreprise",
    url: "/tools",
    icon: Wrench,
  },
  {
    title: "Événements",
    url: "/events",
    icon: Calendar,
  },
  {
    title: "Intégrations",
    icon: Plug,
    requiredRoles: ["owner"],
    items: [
      {
        title: "Intégrations externes",
        url: "/integrations",
        icon: Plug,
        requiredRoles: ["owner"],
      },
    ],
  },
  {
    title: "Personnalisation",
    icon: Palette,
    requiredRoles: ["owner"],
    items: [
      {
        title: "Thèmes graphiques",
        url: "/customization/themes",
        icon: Palette,
        requiredRoles: ["owner"],
      },
      {
        title: "Branding",
        url: "/customization/branding",
        icon: Building,
        requiredRoles: ["owner"],
      },
      {
        title: "Culture d'entreprise",
        url: "/customization/culture",
        icon: Lightbulb,
        requiredRoles: ["owner"],
      },
    ],
  },
  {
    title: "Paramètres",
    icon: Settings,
    requiredRoles: ["owner"],
    items: [
      {
        title: "Gestion des droits",
        url: "/settings/permissions",
        icon: Shield,
        requiredRoles: ["owner"],
      },
      {
        title: "Templates de mails",
        url: "/settings/templates",
        icon: Mail,
        requiredRoles: ["owner"],
      },
      {
        title: "Paramètres généraux",
        url: "/settings/general",
        icon: Settings,
        requiredRoles: ["owner"],
      },
    ],
  },
]

export function AppSidebar() {
  const { data: organization } = useActiveOrganization()
  const { data: member } = useActiveMember()

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
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Building className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Startime</span>
                  <span className="text-xs text-muted-foreground">{organization?.name ?? <Loader2 className="size-4 animate-spin text-muted-foreground" />}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            {
              organization ? (
                <SidebarMenu>
                  {filteredMenuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      {item.items ? (
                        <CollapsibleMenuItem
                          item={item}
                        />
                      ) : (
                        <NormalMenuItem
                          item={item}
                        />
                      )}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Loader2 className="size-6 animate-spin text-muted-foreground" />
                </div>
              )
            }

          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <UserItem />
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}