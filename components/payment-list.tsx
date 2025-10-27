"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, Trash2 } from "lucide-react"
import type { Payment, Member, Event } from "@/lib/storage"

interface PaymentListProps {
  payments: Payment[]
  members: Member[]
  events: Event[]
  onToggleStatus: (id: string, status: "pendente" | "pago") => void
  onDelete: (id: string) => void
}

export function PaymentList({ payments, members, events, onToggleStatus, onDelete }: PaymentListProps) {
  const getMemberName = (memberId: string) => {
    return members.find((m) => m.id === memberId)?.name || "Desconhecido"
  }

  const getEventTitle = (eventId?: string) => {
    if (!eventId) return null
    return events.find((e) => e.id === eventId)?.title || "Evento desconhecido"
  }

  const getTypeLabel = (type: string) => {
    const labels = {
      mensalidade: "Mensalidade",
      oferta: "Oferta",
      evento: "Evento",
    }
    return labels[type as keyof typeof labels] || type
  }

  const sortedPayments = [...payments].sort((a, b) => {
    if (a.status !== b.status) return a.status === "pendente" ? -1 : 1
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  const membersWithPendingPayments = new Set(payments.filter((p) => p.status === "pendente").map((p) => p.memberId))
  const membersWithNoDebts = members.filter((m) => !membersWithPendingPayments.has(m.id))

  return (
    <div className="space-y-6">
      {membersWithNoDebts.length > 0 && (
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-green-700">
              <CheckCircle2 className="h-5 w-5" />
              Membros com Contas Quitadas ({membersWithNoDebts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {membersWithNoDebts.map((member) => (
                <Badge key={member.id} variant="secondary" className="bg-green-100 text-green-800">
                  {member.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {sortedPayments.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">Nenhum pagamento registrado</CardContent>
          </Card>
        ) : (
          sortedPayments.map((payment) => (
            <Card key={payment.id} className={payment.status === "pago" ? "opacity-60" : ""}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{getMemberName(payment.memberId)}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(payment.date).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <Badge variant={payment.status === "pago" ? "secondary" : "destructive"} className="gap-1">
                    {payment.status === "pago" ? (
                      <>
                        <CheckCircle2 className="h-3 w-3" />
                        Pago
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3" />
                        Pendente
                      </>
                    )}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tipo:</span>
                    <span className="font-medium">{getTypeLabel(payment.type)}</span>
                  </div>
                  {payment.eventId && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Evento:</span>
                      <span className="font-medium">{getEventTitle(payment.eventId)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Valor:</span>
                    <span className="font-semibold text-lg">R$ {payment.amount.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={payment.status === "pago" ? "outline" : "default"}
                    size="sm"
                    onClick={() => onToggleStatus(payment.id, payment.status === "pago" ? "pendente" : "pago")}
                  >
                    {payment.status === "pago" ? "Marcar como Pendente" : "Marcar como Pago"}
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => onDelete(payment.id)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
