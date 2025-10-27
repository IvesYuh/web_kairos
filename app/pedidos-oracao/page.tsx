"use client"

import { useState, useEffect } from "react"
import { PrayerRequestList } from "@/components/prayer-request-list"
import { getPrayerRequests, updatePrayerRequest, deletePrayerRequest } from "@/lib/storage"
import type { PrayerRequest } from "@/lib/storage"

export default function PrayerRequestsPage() {
  const [requests, setRequests] = useState<PrayerRequest[]>([])

  useEffect(() => {
    setRequests(getPrayerRequests())
  }, [])

  const handleToggleAnswered = (id: string, answered: boolean) => {
    updatePrayerRequest(id, { answered })
    setRequests(getPrayerRequests())
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este pedido?")) {
      deletePrayerRequest(id)
      setRequests(getPrayerRequests())
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Pedidos de Oração</h1>
        <p className="text-muted-foreground">Visualize e gerencie todos os pedidos de oração do grupo</p>
      </div>

      <PrayerRequestList requests={requests} onToggleAnswered={handleToggleAnswered} onDelete={handleDelete} />
    </div>
  )
}
