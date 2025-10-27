"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { CleaningScheduleForm } from "@/components/cleaning-schedule-form"
import { ScheduleCalendar } from "@/components/schedule-calendar"
import {
  getMembers,
  getCleaningSchedules,
  saveCleaningSchedule,
  updateCleaningSchedule,
  deleteCleaningSchedule,
  type Member,
  type CleaningSchedule,
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
import { getCurrentUser } from "@/lib/auth"

export default function EscalaLimpezaPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [schedules, setSchedules] = useState<CleaningSchedule[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<CleaningSchedule | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [isLeadership, setIsLeadership] = useState(false)

  useEffect(() => {
    setMembers(getMembers())
    setSchedules(getCleaningSchedules())
    const user = getCurrentUser()
    setIsLeadership(user?.role === "leadership")
  }, [])

  const handleSubmit = (data: { date: string; tasks: { memberId: string; task: string }[] }) => {
    const memberIds = data.tasks.map((t) => t.memberId)
    if (editingSchedule) {
      updateCleaningSchedule(editingSchedule.id, { ...data, members: memberIds })
    } else {
      saveCleaningSchedule({ ...data, members: memberIds })
    }
    setSchedules(getCleaningSchedules())
    setShowForm(false)
    setEditingSchedule(null)
  }

  const handleEdit = (schedule: CleaningSchedule) => {
    setEditingSchedule(schedule)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    deleteCleaningSchedule(id)
    setSchedules(getCleaningSchedules())
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
          <h2 className="text-3xl font-bold tracking-tight">Escala de Limpeza</h2>
          <p className="text-muted-foreground mt-1">
            {isLeadership ? "Organize a escala de cozinha e limpeza" : "Visualize a escala de limpeza"}
          </p>
        </div>
        {!showForm && isLeadership && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Escala
          </Button>
        )}
      </div>

      {showForm ? (
        <CleaningScheduleForm
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
                          <CardDescription>{schedule.tasks.length} membros escalados</CardDescription>
                        </div>
                        {isLeadership && (
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(schedule)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => setDeleteId(schedule.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {schedule.tasks.map((task, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="font-medium">{task.task}:</span>
                            <span className="text-muted-foreground">{getMemberName(task.memberId)}</span>
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
              {isLeadership && <p className="text-sm mt-2">Clique em "Nova Escala" para começar.</p>}
            </div>
          )}
        </>
      )}

      {isLeadership && (
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
      )}
    </div>
  )
}
