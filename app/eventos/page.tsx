"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Pencil, Trash2, Users, DollarSign } from "lucide-react"
import { EventForm } from "@/components/event-form"
import { Calendar } from "@/components/calendar"
import { getMembers, getEvents, saveEvent, updateEvent, deleteEvent, type Member, type Event } from "@/lib/storage"
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

export default function EventosPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [isLeadership, setIsLeadership] = useState(false)

  useEffect(() => {
    setMembers(getMembers())
    setEvents(getEvents())
    const user = getCurrentUser()
    setIsLeadership(user?.role === "leadership")
  }, [])

  const handleSubmit = (data: {
    title: string
    date: string
    description: string
    amount: number
    participants: string[]
  }) => {
    if (editingEvent) {
      updateEvent(editingEvent.id, data)
    } else {
      saveEvent(data)
    }
    setEvents(getEvents())
    setShowForm(false)
    setEditingEvent(null)
  }

  const handleEdit = (event: Event) => {
    setEditingEvent(event)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    deleteEvent(id)
    setEvents(getEvents())
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingEvent(null)
  }

  const getMemberName = (id: string) => {
    return members.find((m) => m.id === id)?.name || "Desconhecido"
  }

  const selectedDateEvents = events.filter((e) => e.date === selectedDate)
  const displayEvents = selectedDate ? selectedDateEvents : events

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Eventos</h2>
          <p className="text-muted-foreground mt-1">
            {isLeadership ? "Cadastre e gerencie eventos do grupo" : "Visualize os eventos do grupo"}
          </p>
        </div>
        {!showForm && isLeadership && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Evento
          </Button>
        )}
      </div>

      {showForm ? (
        <EventForm
          event={editingEvent || undefined}
          members={members}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <Calendar events={events} onDateSelect={setSelectedDate} selectedDate={selectedDate} />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {selectedDate
                ? `Eventos em ${new Date(selectedDate + "T00:00:00").toLocaleDateString("pt-BR")}`
                : "Todos os Eventos"}
            </h3>

            {displayEvents.length > 0 ? (
              displayEvents.map((event) => (
                <Card key={event.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{event.title}</CardTitle>
                        <CardDescription>{new Date(event.date).toLocaleDateString("pt-BR")}</CardDescription>
                      </div>
                      {isLeadership && (
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(event)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => setDeleteId(event.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {event.description && (
                      <p className="text-sm text-muted-foreground text-pretty">{event.description}</p>
                    )}

                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">R$ {event.amount.toFixed(2)}</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{event.participants.length} participantes</span>
                      </div>
                      {event.participants.length > 0 && (
                        <div className="text-sm text-muted-foreground pl-6">
                          {event.participants.map((id) => getMemberName(id)).join(", ")}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>{selectedDate ? "Nenhum evento nesta data." : "Nenhum evento cadastrado."}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {isLeadership && (
        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita.
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
