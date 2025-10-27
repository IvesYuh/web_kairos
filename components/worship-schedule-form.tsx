"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"
import type { Member, WorshipSchedule } from "@/lib/storage"

interface WorshipScheduleFormProps {
  schedule?: WorshipSchedule
  members: Member[]
  onSubmit: (data: { date: string; roles: { memberId: string; role: string }[] }) => void
  onCancel?: () => void
}

const worshipRoles = ["Vocal", "Guitarra", "Baixo", "Bateria", "Teclado", "Violão", "Backing Vocal"]

export function WorshipScheduleForm({ schedule, members, onSubmit, onCancel }: WorshipScheduleFormProps) {
  const [date, setDate] = useState(schedule?.date || "")
  const [roles, setRoles] = useState<{ memberId: string; role: string }[]>(schedule?.roles || [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ date, roles })
  }

  const addRole = () => {
    setRoles([...roles, { memberId: "", role: "" }])
  }

  const removeRole = (index: number) => {
    setRoles(roles.filter((_, i) => i !== index))
  }

  const updateRole = (index: number, field: "memberId" | "role", value: string) => {
    const newRoles = [...roles]
    newRoles[index][field] = value
    setRoles(newRoles)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{schedule ? "Editar Escala de Louvor" : "Nova Escala de Louvor"}</CardTitle>
        <CardDescription>Defina a data e os membros responsáveis pelo louvor</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Data</Label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Membros e Funções</Label>
              <Button type="button" variant="outline" size="sm" onClick={addRole}>
                Adicionar
              </Button>
            </div>

            {roles.map((role, index) => (
              <div key={index} className="flex gap-2 items-start">
                <div className="flex-1 space-y-2">
                  <Select value={role.memberId} onValueChange={(value) => updateRole(index, "memberId", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o membro" />
                    </SelectTrigger>
                    <SelectContent>
                      {members.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1 space-y-2">
                  <Select value={role.role} onValueChange={(value) => updateRole(index, "role", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a função" />
                    </SelectTrigger>
                    <SelectContent>
                      {worshipRoles.map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button type="button" variant="ghost" size="icon" onClick={() => removeRole(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
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
