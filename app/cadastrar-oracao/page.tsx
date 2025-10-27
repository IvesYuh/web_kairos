"use client"

import { useState } from "react"
import { PrayerRequestForm } from "@/components/prayer-request-form"
import { savePrayerRequest } from "@/lib/storage"
import { useRouter } from "next/navigation"
import { CheckCircle2 } from "lucide-react"

export default function CreatePrayerPage() {
  const router = useRouter()
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = (data: { requester: string; request: string }) => {
    savePrayerRequest(data)
    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
    }, 3000)
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Cadastrar Pedido de Oração</h1>
        <p className="text-muted-foreground">Compartilhe seu pedido de oração com a liderança</p>
      </div>

      {showSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-800">
          <CheckCircle2 className="h-5 w-5" />
          <p className="font-medium">Pedido de oração enviado com sucesso!</p>
        </div>
      )}

      <PrayerRequestForm onSubmit={handleSubmit} />
    </div>
  )
}
