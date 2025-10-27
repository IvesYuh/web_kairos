"use client"
import { Users, Calendar, Music, ChefHat, Heart, DollarSign, CreditCard, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getCurrentUser, logout, type UserRole } from "@/lib/auth"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

const leadershipItems = [
  {
    title: "Membros",
    url: "/membros",
    icon: Users,
  },
  {
    title: "Escala de Louvor",
    url: "/escala-louvor",
    icon: Music,
  },
  {
    title: "Escala de Limpeza",
    url: "/escala-limpeza",
    icon: ChefHat,
  },
  {
    title: "Eventos",
    url: "/eventos",
    icon: Calendar,
  },
  {
    title: "Pedidos de Oração",
    url: "/pedidos-oracao",
    icon: Heart,
  },
  {
    title: "Pagamentos",
    url: "/pagamentos",
    icon: DollarSign,
  },
]

const memberItems = [
  {
    title: "Ver Eventos",
    url: "/membro/eventos",
    icon: Calendar,
  },
  {
    title: "Ver Escala de Limpeza",
    url: "/membro/escala-limpeza",
    icon: ChefHat,
  },
  {
    title: "Fazer Pedido de Oração",
    url: "/membro/pedido-oracao",
    icon: Heart,
  },
  {
    title: "Pagar via PIX",
    url: "/membro/pagar",
    icon: CreditCard,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [userRole, setUserRole] = useState<UserRole>(null)

  useEffect(() => {
    const user = getCurrentUser()
    setUserRole(user?.role || null)
  }, [pathname])

  const handleLogout = () => {
    logout()
    window.location.href = "/login"
  }

  // Não mostrar sidebar na página de login
  if (pathname === "/login") {
    return null
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-6 py-4">
        <Link href="/" className="block">
          <h2 className="text-lg font-semibold text-sidebar-foreground">Kairós</h2>
          <p className="text-xs text-muted-foreground mt-1">
            {userRole === "leadership" ? "Área da Liderança" : "Área dos Membros"}
          </p>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {userRole === "leadership" && (
          <SidebarGroup>
            <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {leadershipItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {userRole === "member" && (
          <SidebarGroup>
            <SidebarGroupLabel>Área dos Membros</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {memberItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <Button variant="outline" className="w-full justify-start bg-transparent" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
