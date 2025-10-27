"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"
import { ScheduleCalendar } from "@/components/schedule-calendar"
import { getMembers, getCleaningSchedules, type Member, type CleaningSchedule } from "@/lib/storage"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function MembroEscalaLimpezaPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [schedules, setSchedules] = useState<CleaningSchedule[]>([])
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [detailsDialog, setDetailsDialog] = useState(false)
  const [selectedSchedule, setSelectedSchedule] = useState<CleaningSchedule | null>(null)

  useEffect(() => {
    setMembers(getMembers())
    setSchedules(getCleaningSchedules())
  }, [])

  const getMemberName = (id: string) => {
    return members.find((m) => m.id === id)?.name || "Desconhecido"
  }

  const openDetails = (schedule: CleaningSchedule) => {
    setSelectedSchedule(schedule)
    setDetailsDialog(true)
  }

  const displaySchedules = selectedDate ? schedules.filter((s) => s.date === selectedDate) : schedules

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Escala de Cozinha e Limpeza</h2>
        <p className="text-muted-foreground mt-1">Visualize a escala de cozinha e limpeza</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <ScheduleCalendar
            schedules={displaySchedules}
            onDateSelect={setSelectedDate}
            selectedDate={selectedDate}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            {selectedDate
              ? `Escalas em ${new Date(selectedDate + "T00:00:00").toLocaleDateString("pt-BR")}`
              : "Todas as Escalas"}
          </h3>

          {displaySchedules.length > 0 ? (
            displaySchedules.map((schedule) => (
              <Card
                key={schedule.id}
                className="cursor-pointer hover:bg-accent transition-colors"
                onClick={() => openDetails(schedule)}
              >
                <CardHeader>
                  <CardTitle>Escala de Limpeza</CardTitle>
                  <CardDescription>{new Date(schedule.date).toLocaleDateString("pt-BR")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{schedule.members.length} responsáveis</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Clique para ver detalhes</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>{selectedDate ? "Nenhuma escala nesta data." : "Nenhuma escala cadastrada."}</p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={detailsDialog} onOpenChange={setDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Escala</DialogTitle>
            <DialogDescription>
              {selectedSchedule && new Date(selectedSchedule.date).toLocaleDateString("pt-BR")}
            </DialogDescription>
          </DialogHeader>
          {selectedSchedule && (
            <div className="space-y-4 py-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Tarefas e Responsáveis:</h4>
                <div className="space-y-2">
                  {selectedSchedule.tasks.map((task, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span className="font-medium">{task.task}</span>
                      <span className="text-muted-foreground">{getMemberName(task.memberId)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedSchedule.notes && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Observações:</h4>
                  <p className="text-sm text-muted-foreground p-3 bg-muted rounded-lg">{selectedSchedule.notes}</p>
                </div>
              )}

              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Todos os Responsáveis:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedSchedule.members.map((memberId) => (
                    <span key={memberId} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      {getMemberName(memberId)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
