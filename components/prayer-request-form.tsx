"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

interface PrayerRequestFormProps {
  onSubmit: (data: { requester: string; request: string }) => void
}

export function PrayerRequestForm({ onSubmit }: PrayerRequestFormProps) {
  const [requester, setRequester] = useState("")
  const [request, setRequest] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (requester.trim() && request.trim()) {
      onSubmit({ requester, request })
      setRequester("")
      setRequest("")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Novo Pedido de Oração</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="requester">Nome</Label>
            <Input
              id="requester"
              value={requester}
              onChange={(e) => setRequester(e.target.value)}
              placeholder="Seu nome"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="request">Pedido de Oração</Label>
            <Textarea
              id="request"
              value={request}
              onChange={(e) => setRequest(e.target.value)}
              placeholder="Descreva seu pedido de oração..."
              rows={4}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Enviar Pedido
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
