"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle } from "lucide-react"
import type { Payment, Member } from "@/lib/storage"

interface MemberPaymentSummaryProps {
  members: Member[]
  payments: Payment[]
}

export function MemberPaymentSummary({ members, payments }: MemberPaymentSummaryProps) {
  const getMemberSummary = (memberId: string) => {
    const memberPayments = payments.filter((p) => p.memberId === memberId)
    const pending = memberPayments.filter((p) => p.status === "pendente")

    const pendingByType = {
      mensalidade: pending.filter((p) => p.type === "mensalidade").length,
      oferta: pending.filter((p) => p.type === "oferta").length,
      evento: pending.filter((p) => p.type === "evento").length,
    }

    const totalPending = pending.reduce((sum, p) => sum + p.amount, 0)

    return { pending, pendingByType, totalPending }
  }

  const membersWithPending = members.filter((m) => getMemberSummary(m.id).pending.length > 0)
  const membersCleared = members.filter((m) => {
    const memberPayments = payments.filter((p) => p.memberId === m.id)
    return memberPayments.length > 0 && getMemberSummary(m.id).pending.length === 0
  })

  return (
    <div className="space-y-6">
      {membersCleared.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold text-green-700">Membros com Contas Quitadas</h3>
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {membersCleared.map((member) => (
              <Card key={member.id} className="border-green-200 bg-green-50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-green-900">{member.name}</span>
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Quitado
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {membersWithPending.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <h3 className="text-lg font-semibold text-destructive">Membros com Pendências</h3>
          </div>
          {membersWithPending.map((member) => {
            const summary = getMemberSummary(member.id)

            return (
              <Card key={member.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <Badge variant="destructive" className="gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {summary.pending.length} pendente{summary.pending.length > 1 ? "s" : ""}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {summary.pendingByType.mensalidade > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Mensalidades:</span>
                        <span className="font-medium">{summary.pendingByType.mensalidade}</span>
                      </div>
                    )}
                    {summary.pendingByType.oferta > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Ofertas:</span>
                        <span className="font-medium">{summary.pendingByType.oferta}</span>
                      </div>
                    )}
                    {summary.pendingByType.evento > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Eventos:</span>
                        <span className="font-medium">{summary.pendingByType.evento}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm pt-2 border-t">
                      <span className="text-muted-foreground font-medium">Total Pendente:</span>
                      <span className="font-semibold text-lg text-destructive">
                        R$ {summary.totalPending.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {membersWithPending.length === 0 && membersCleared.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Nenhum pagamento registrado no momento
          </CardContent>
        </Card>
      )}
    </div>
  )
}
