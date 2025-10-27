"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, Music, ChefHat, Heart, DollarSign, Send, CreditCard } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getCurrentUser, type UserRole } from "@/lib/auth"

export default function HomePage() {
  const [userRole, setUserRole] = useState<UserRole>(null)

  useEffect(() => {
    const user = getCurrentUser()
    setUserRole(user?.role || null)
  }, [])

  const leadershipCards = [
    {
      title: "Membros",
      description: "Cadastre e gerencie os membros do grupo",
      icon: Users,
      href: "/membros",
      color: "text-blue-600",
    },
    {
      title: "Escala de Louvor",
      description: "Organize a escala de músicos e cantores",
      icon: Music,
      href: "/escala-louvor",
      color: "text-purple-600",
    },
    {
      title: "Escala de Limpeza",
      description: "Gerencie a escala de cozinha e limpeza",
      icon: ChefHat,
      href: "/escala-limpeza",
      color: "text-green-600",
    },
    {
      title: "Eventos",
      description: "Cadastre eventos e acompanhe pagamentos",
      icon: Calendar,
      href: "/eventos",
      color: "text-orange-600",
    },
    {
      title: "Pedidos de Oração",
      description: "Visualize e gerencie pedidos de oração",
      icon: Heart,
      href: "/pedidos-oracao",
      color: "text-red-600",
    },
    {
      title: "Pagamentos",
      description: "Controle mensalidades e ofertas",
      icon: DollarSign,
      href: "/pagamentos",
      color: "text-emerald-600",
    },
  ]

  const memberCards = [
    {
      title: "Ver Eventos",
      description: "Confira os próximos eventos",
      icon: Calendar,
      href: "/membro/eventos",
      gradient: "from-orange-500 to-amber-500",
      bgGradient: "from-orange-50 to-amber-50",
      border: "border-orange-200",
    },
    {
      title: "Ver Escala de Limpeza",
      description: "Confira a escala de limpeza",
      icon: ChefHat,
      href: "/membro/escala-limpeza",
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50",
      border: "border-green-200",
    },
    {
      title: "Pedido de Oração",
      description: "Envie seu pedido de oração",
      icon: Send,
      href: "/membro/pedido-oracao",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
      border: "border-purple-200",
    },
    {
      title: "Pagamento via PIX",
      description: "Realize seus pagamentos online",
      icon: CreditCard,
      href: "/membro/pagar",
      gradient: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-50 to-teal-50",
      border: "border-emerald-200",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-balance">Bem-vindo ao Sistema de Gerenciamento</h2>
        <p className="text-muted-foreground mt-2">
          {userRole === "leadership"
            ? "Gerencie todas as atividades do Kairós !"
            : "Acesse as funcionalidades disponíveis para membros"}
        </p>
      </div>

      {userRole === "member" && (
        <div className="space-y-3">
          <h3 className="text-xl font-semibold">Área dos Membros</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {memberCards.map((card) => (
              <Card key={card.title} className={`border-2 ${card.border} bg-gradient-to-br ${card.bgGradient}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg bg-gradient-to-br ${card.gradient}`}>
                        <card.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{card.title}</CardTitle>
                        <CardDescription className="mt-1">{card.description}</CardDescription>
                      </div>
                    </div>
                    <Link href={card.href}>
                      <button
                        className={`rounded-lg bg-gradient-to-r ${card.gradient} px-6 py-2 text-sm font-medium text-white hover:opacity-90 transition-all`}
                      >
                        Acessar
                      </button>
                    </Link>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      )}

      {userRole === "leadership" && (
        <div className="space-y-3">
          <h3 className="text-xl font-semibold">Área da Liderança</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {leadershipCards.map((card) => (
              <Link key={card.title} href={card.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-muted ${card.color}`}>
                        <card.icon className="h-6 w-6" />
                      </div>
                      <CardTitle>{card.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-pretty">{card.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
