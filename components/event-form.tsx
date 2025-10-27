"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import type { Event, Member } from "@/lib/storage"

interface EventFormProps {
  event?: Event
  members: Member[]
  onSubmit: (data: {
    title: string
    date: string
    description: string
    amount: number
    participants: string[]
  }) => void
  onCancel?: () => void
}

export function EventForm({ event, members, onSubmit, onCancel }: EventFormProps) {
  const [formData, setFormData] = useState({
    title: event?.title || "",
    date: event?.date || "",
    description: event?.description || "",
    amount: event?.amount || 0,
  })
  const [participants, setParticipants] = useState<string[]>(event?.participants || [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ ...formData, participants })
  }

  const toggleParticipant = (memberId: string) => {
    setParticipants((prev) => (prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId]))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{event ? "Editar Evento" : "Novo Evento"}</CardTitle>
        <CardDescription>Cadastre um evento e defina o valor para pagamento</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título do Evento</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="Ex: Retiro Espiritual"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Data</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detalhes sobre o evento"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Valor (R$)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: Number.parseFloat(e.target.value) || 0 })}
              required
            />
          </div>

          <div className="space-y-3">
            <Label>Participantes</Label>
            <div className="space-y-2 max-h-48 overflow-y-auto border rounded-md p-3">
              {members.map((member) => (
                <div key={member.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={member.id}
                    checked={participants.includes(member.id)}
                    onCheckedChange={() => toggleParticipant(member.id)}
                  />
                  <label htmlFor={member.id} className="text-sm cursor-pointer">
                    {member.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            )}
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
