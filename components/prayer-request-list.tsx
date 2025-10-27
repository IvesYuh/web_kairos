"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Trash2 } from "lucide-react"
import type { PrayerRequest } from "@/lib/storage"

interface PrayerRequestListProps {
  requests: PrayerRequest[]
  onToggleAnswered: (id: string, answered: boolean) => void
  onDelete: (id: string) => void
}

export function PrayerRequestList({ requests, onToggleAnswered, onDelete }: PrayerRequestListProps) {
  const sortedRequests = [...requests].sort((a, b) => {
    if (a.answered !== b.answered) return a.answered ? 1 : -1
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  return (
    <div className="space-y-4">
      {sortedRequests.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Nenhum pedido de oração cadastrado
          </CardContent>
        </Card>
      ) : (
        sortedRequests.map((request) => (
          <Card key={request.id} className={request.answered ? "opacity-60" : ""}>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-lg">{request.requester}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(request.date).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {request.answered && (
                    <Badge variant="secondary" className="gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Respondido
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">{request.request}</p>
              <div className="flex gap-2">
                <Button
                  variant={request.answered ? "outline" : "default"}
                  size="sm"
                  onClick={() => onToggleAnswered(request.id, !request.answered)}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  {request.answered ? "Marcar como Pendente" : "Marcar como Respondido"}
                </Button>
                <Button variant="destructive" size="sm" onClick={() => onDelete(request.id)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
