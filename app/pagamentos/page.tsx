"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PaymentForm } from "@/components/payment-form"
import { PaymentList } from "@/components/payment-list"
import { MemberPaymentSummary } from "@/components/member-payment-summary"
import { getPayments, getMembers, getEvents, savePayment, updatePayment, deletePayment } from "@/lib/storage"
import type { Payment, Member, Event } from "@/lib/storage"

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [events, setEvents] = useState<Event[]>([])

  useEffect(() => {
    setPayments(getPayments())
    setMembers(getMembers())
    setEvents(getEvents())
  }, [])

  const handleSubmit = (data: {
    memberId: string
    type: "mensalidade" | "oferta" | "evento"
    amount: number
    eventId?: string
  }) => {
    savePayment({ ...data, status: "pendente" })
    setPayments(getPayments())
  }

  const handleToggleStatus = (id: string, status: "pendente" | "pago") => {
    updatePayment(id, { status })
    setPayments(getPayments())
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este pagamento?")) {
      deletePayment(id)
      setPayments(getPayments())
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Pagamentos</h1>
        <p className="text-muted-foreground">Gerencie mensalidades, ofertas e pagamentos de eventos</p>
      </div>

      <Tabs defaultValue="summary" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="summary">Resumo por Membro</TabsTrigger>
          <TabsTrigger value="all">Todos os Pagamentos</TabsTrigger>
          <TabsTrigger value="new">Novo Pagamento</TabsTrigger>
        </TabsList>

        <TabsContent value="summary">
          <MemberPaymentSummary members={members} payments={payments} />
        </TabsContent>

        <TabsContent value="all">
          <PaymentList
            payments={payments}
            members={members}
            events={events}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDelete}
          />
        </TabsContent>

        <TabsContent value="new">
          <div className="max-w-2xl mx-auto">
            <PaymentForm members={members} events={events} onSubmit={handleSubmit} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
