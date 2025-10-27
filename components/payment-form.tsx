"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import type { Member, Event } from "@/lib/storage"

interface PaymentFormProps {
  members: Member[]
  events: Event[]
  onSubmit: (data: {
    memberId: string
    type: "mensalidade" | "oferta" | "evento"
    amount: number
    eventId?: string
  }) => void
}

export function PaymentForm({ members, events, onSubmit }: PaymentFormProps) {
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([])
  const [type, setType] = useState<"mensalidade" | "oferta" | "evento">("mensalidade")
  const [amount, setAmount] = useState("")
  const [eventId, setEventId] = useState("")

  const toggleMember = (memberId: string) => {
    setSelectedMemberIds((prev) =>
      prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId],
    )
  }

  const toggleAll = () => {
    if (selectedMemberIds.length === members.length) {
      setSelectedMemberIds([])
    } else {
      setSelectedMemberIds(members.map((m) => m.id))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedMemberIds.length > 0 && amount) {
      selectedMemberIds.forEach((memberId) => {
        onSubmit({
          memberId,
          type,
          amount: Number.parseFloat(amount),
          eventId: type === "evento" ? eventId : undefined,
        })
      })
      setSelectedMemberIds([])
      setAmount("")
      setEventId("")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registrar Pagamento Pendente</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Membros ({selectedMemberIds.length} selecionados)</Label>
              <Button type="button" variant="outline" size="sm" onClick={toggleAll}>
                {selectedMemberIds.length === members.length ? "Desselecionar Todos" : "Selecionar Todos"}
              </Button>
            </div>
            <div className="max-h-48 space-y-2 overflow-y-auto rounded-md border p-4">
              {members.map((member) => (
                <div key={member.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`member-${member.id}`}
                    checked={selectedMemberIds.includes(member.id)}
                    onCheckedChange={() => toggleMember(member.id)}
                  />
                  <label
                    htmlFor={`member-${member.id}`}
                    className="flex-1 cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {member.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tipo de Pagamento</Label>
            <Select value={type} onValueChange={(v) => setType(v as "mensalidade" | "oferta" | "evento")} required>
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mensalidade">Mensalidade</SelectItem>
                <SelectItem value="oferta">Oferta</SelectItem>
                <SelectItem value="evento">Evento</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {type === "evento" && (
            <div className="space-y-2">
              <Label htmlFor="event">Evento</Label>
              <Select value={eventId} onValueChange={setEventId} required>
                <SelectTrigger id="event">
                  <SelectValue placeholder="Selecione um evento" />
                </SelectTrigger>
                <SelectContent>
                  {events.map((event) => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.title} - R$ {event.amount.toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="amount">Valor (R$)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={selectedMemberIds.length === 0}>
            Registrar Pagamento para {selectedMemberIds.length} Membro(s)
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
