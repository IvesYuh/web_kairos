"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { X } from "lucide-react"
import type { Member, CleaningSchedule } from "@/lib/storage"

interface CleaningScheduleFormProps {
  schedule?: CleaningSchedule
  members: Member[]
  onSubmit: (data: { date: string; tasks: { memberId: string; task: string }[]; notes?: string }) => void
  onCancel?: () => void
}

const cleaningTasks = ["Cozinha", "Banheiros", "Salão Principal", "Varrer", "Passar Pano", "Organizar Cadeiras"]

export function CleaningScheduleForm({ schedule, members, onSubmit, onCancel }: CleaningScheduleFormProps) {
  const [date, setDate] = useState(schedule?.date || "")
  const [tasks, setTasks] = useState<{ memberId: string; task: string }[]>(schedule?.tasks || [])
  const [notes, setNotes] = useState(schedule?.notes || "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ date, tasks, notes })
  }

  const addTask = () => {
    setTasks([...tasks, { memberId: "", task: "" }])
  }

  const removeTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index))
  }

  const updateTask = (index: number, field: "memberId" | "task", value: string) => {
    const newTasks = [...tasks]
    newTasks[index][field] = value
    setTasks(newTasks)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{schedule ? "Editar Escala de Limpeza" : "Nova Escala de Limpeza"}</CardTitle>
        <CardDescription>Defina a data e os membros responsáveis pela limpeza</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Data</Label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Membros e Tarefas</Label>
              <Button type="button" variant="outline" size="sm" onClick={addTask}>
                Adicionar
              </Button>
            </div>

            {tasks.map((task, index) => (
              <div key={index} className="flex gap-2 items-start">
                <div className="flex-1 space-y-2">
                  <Select value={task.memberId} onValueChange={(value) => updateTask(index, "memberId", value)}>
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
                  <Select value={task.task} onValueChange={(value) => updateTask(index, "task", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a tarefa" />
                    </SelectTrigger>
                    <SelectContent>
                      {cleaningTasks.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button type="button" variant="ghost" size="icon" onClick={() => removeTask(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações (opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Adicione observações sobre a escala..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
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
