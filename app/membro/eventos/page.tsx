"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, DollarSign, UserPlus, Check, ChevronsUpDown } from "lucide-react"
import { Calendar } from "@/components/calendar"
import { getMembers, getEvents, updateEvent, type Member, type Event } from "@/lib/storage"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export default function MembroEventosPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [participationDialog, setParticipationDialog] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [selectedMemberId, setSelectedMemberId] = useState("")
  const [participationError, setParticipationError] = useState("")
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setMembers(getMembers())
    setEvents(getEvents())
  }, [])

  const getMemberName = (id: string) => {
    return members.find((m) => m.id === id)?.name || "Desconhecido"
  }

  const handleConfirmParticipation = () => {
    if (!selectedEvent || !selectedMemberId) {
      setParticipationError("Por favor, selecione seu nome")
      return
    }

    if (selectedEvent.participants.includes(selectedMemberId)) {
      setParticipationError("Você já está participando deste evento!")
      return
    }

    const updatedParticipants = [...selectedEvent.participants, selectedMemberId]
    updateEvent(selectedEvent.id, { participants: updatedParticipants })
    setEvents(getEvents())
    setParticipationDialog(false)
    setSelectedMemberId("")
    setParticipationError("")
    setSelectedEvent(null)
  }

  const openParticipationDialog = (event: Event) => {
    setSelectedEvent(event)
    setParticipationDialog(true)
    setSelectedMemberId("")
    setParticipationError("")
  }

  const displayEvents = selectedDate ? events.filter((e) => e.date === selectedDate) : events

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Eventos</h2>
        <p className="text-muted-foreground mt-1">Visualize os eventos do grupo</p>
      </div>

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
                  <CardTitle>{event.title}</CardTitle>
                  <CardDescription>{new Date(event.date).toLocaleDateString("pt-BR")}</CardDescription>
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

                  <Button onClick={() => openParticipationDialog(event)} className="w-full mt-2">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Confirmar Participação
                  </Button>
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

      <Dialog open={participationDialog} onOpenChange={setParticipationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Participação</DialogTitle>
            <DialogDescription>Selecione seu nome para confirmar sua participação no evento</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="memberName">Nome do Membro</Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between bg-transparent"
                  >
                    {selectedMemberId
                      ? members.find((member) => member.id === selectedMemberId)?.name
                      : "Selecione seu nome..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Buscar membro..." />
                    <CommandList>
                      <CommandEmpty>Nenhum membro encontrado.</CommandEmpty>
                      <CommandGroup>
                        {members.map((member) => (
                          <CommandItem
                            key={member.id}
                            value={member.name}
                            onSelect={() => {
                              setSelectedMemberId(member.id)
                              setParticipationError("")
                              setOpen(false)
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedMemberId === member.id ? "opacity-100" : "opacity-0",
                              )}
                            />
                            {member.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {participationError && <p className="text-sm text-destructive">{participationError}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setParticipationDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmParticipation}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
