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
  LucideIcon
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
    requiredRoles: ["admin", "hr"],
    items: [
      {
        title: "Liste des utilisateurs",
        url: "/users",
        icon: Users,
        requiredRoles: ["admin", "hr"],
      },
      {
        title: "Ajouter un utilisateur",
        url: "/users/add",
        icon: UserPlus,
        requiredRoles: ["admin", "hr"],
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
        requiredRoles: ["admin", "hr", "manager"],
      },
      {
        title: "Créer un parcours",
        url: "/admin/onboarding/edit",
        icon: Edit,
        requiredRoles: ["admin", "hr"],
      },
      {
        title: "Mode test",
        url: "/onboarding/preview",
        icon: Eye,
        requiredRoles: ["admin", "hr"],
      },
      {
        title: "Mon parcours",
        url: "/onboarding",
        icon: BookOpen,
        requiredRoles: ["employee"],
      },
    ],
  },
  {
    title: "Suivi & automatisation",
    icon: BarChart3,
    requiredRoles: ["admin", "hr"],
    items: [
      {
        title: "Tableau de bord",
        url: "/analytics",
        icon: BarChart3,
        requiredRoles: ["admin", "hr"],
      },
      {
        title: "Automatisations",
        url: "/automations",
        icon: Zap,
        requiredRoles: ["admin", "hr"],
      },
      {
        title: "Historique",
        url: "/history",
        icon: Archive,
        requiredRoles: ["admin", "hr"],
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
        requiredRoles: ["admin", "hr"],
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
    requiredRoles: ["admin"],
    items: [
      {
        title: "Intégrations externes",
        url: "/integrations",
        icon: Plug,
        requiredRoles: ["admin"],
      },
    ],
  },
  {
    title: "Personnalisation",
    icon: Palette,
    requiredRoles: ["admin", "hr"],
    items: [
      {
        title: "Thèmes graphiques",
        url: "/customization/themes",
        icon: Palette,
        requiredRoles: ["admin", "hr"],
      },
      {
        title: "Branding",
        url: "/customization/branding",
        icon: Building,
        requiredRoles: ["admin", "hr"],
      },
      {
        title: "Culture d'entreprise",
        url: "/customization/culture",
        icon: Lightbulb,
        requiredRoles: ["admin", "hr"],
      },
    ],
  },
  {
    title: "Paramètres",
    icon: Settings,
    requiredRoles: ["admin"],
    items: [
      {
        title: "Gestion des droits",
        url: "/settings/permissions",
        icon: Shield,
        requiredRoles: ["admin"],
      },
      {
        title: "Templates de mails",
        url: "/settings/templates",
        icon: Mail,
        requiredRoles: ["admin"],
      },
      {
        title: "Paramètres généraux",
        url: "/settings/general",
        icon: Settings,
        requiredRoles: ["admin"],
      },
    ],
  },
]

export function AppSidebar() {
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
                  <span className="text-xs">Entreprise</span>
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
            <SidebarMenu>
              {menuItems.map((item) => (
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