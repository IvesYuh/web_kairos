"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { WorshipScheduleForm } from "@/components/worship-schedule-form"
import { ScheduleCalendar } from "@/components/schedule-calendar"
import {
  getMembers,
  getWorshipSchedules,
  saveWorshipSchedule,
  updateWorshipSchedule,
  deleteWorshipSchedule,
  type Member,
  type WorshipSchedule,
} from "@/lib/storage"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function EscalaLouvorPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [schedules, setSchedules] = useState<WorshipSchedule[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<WorshipSchedule | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>("")

  useEffect(() => {
    setMembers(getMembers())
    setSchedules(getWorshipSchedules())
  }, [])

  const handleSubmit = (data: { date: string; roles: { memberId: string; role: string }[] }) => {
    const memberIds = data.roles.map((r) => r.memberId)
    if (editingSchedule) {
      updateWorshipSchedule(editingSchedule.id, { ...data, members: memberIds })
    } else {
      saveWorshipSchedule({ ...data, members: memberIds })
    }
    setSchedules(getWorshipSchedules())
    setShowForm(false)
    setEditingSchedule(null)
  }

  const handleEdit = (schedule: WorshipSchedule) => {
    setEditingSchedule(schedule)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    deleteWorshipSchedule(id)
    setSchedules(getWorshipSchedules())
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingSchedule(null)
  }

  const getMemberName = (id: string) => {
    return members.find((m) => m.id === id)?.name || "Desconhecido"
  }

  const schedulesToDisplay = selectedDate ? schedules.filter((s) => s.date === selectedDate) : schedules

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Escala de Louvor</h2>
          <p className="text-muted-foreground mt-1">Organize a escala de músicos e cantores</p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Escala
          </Button>
        )}
      </div>

      {showForm ? (
        <WorshipScheduleForm
          schedule={editingSchedule || undefined}
          members={members}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      ) : (
        <>
          <ScheduleCalendar schedules={schedules} onDateSelect={setSelectedDate} selectedDate={selectedDate} />

          {selectedDate && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Mostrando escalas de {new Date(selectedDate + "T00:00:00").toLocaleDateString("pt-BR")}
              </span>
              <Button variant="ghost" size="sm" onClick={() => setSelectedDate("")}>
                Limpar filtro
              </Button>
            </div>
          )}

          {schedulesToDisplay.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {schedulesToDisplay
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((schedule) => (
                  <Card key={schedule.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{new Date(schedule.date).toLocaleDateString("pt-BR")}</CardTitle>
                          <CardDescription>{schedule.roles.length} membros escalados</CardDescription>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(schedule)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => setDeleteId(schedule.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {schedule.roles.map((role, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="font-medium">{role.role}:</span>
                            <span className="text-muted-foreground">{getMemberName(role.memberId)}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>{selectedDate ? "Nenhuma escala nesta data." : "Nenhuma escala cadastrada ainda."}</p>
              <p className="text-sm mt-2">Clique em "Nova Escala" para começar.</p>
            </div>
          )}
        </>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta escala? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) {
                  handleDelete(deleteId)
                  setDeleteId(null)
                }
              }}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
