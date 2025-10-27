"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Heart, CheckCircle2 } from "lucide-react"
import { addPrayerRequest } from "@/lib/storage"

export default function MembroPedidoOracaoPage() {
  const [requester, setRequester] = useState("")
  const [request, setRequest] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (requester.trim() && request.trim()) {
      addPrayerRequest({ requester, request })
      setRequester("")
      setRequest("")
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 3000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-4 md:p-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Pedidos de Oração</h1>
          <p className="mt-2 text-gray-600">Compartilhe suas necessidades de oração com o grupo</p>
        </div>

        {submitted && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="flex items-center gap-3 pt-6">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <p className="text-sm font-medium text-green-800">
                Seu pedido foi enviado com sucesso! Estaremos orando por você.
              </p>
            </CardContent>
          </Card>
        )}

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Novo Pedido de Oração</CardTitle>
            <CardDescription>
              Preencha o formulário abaixo para compartilhar seu pedido de oração com o grupo de jovens
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="requester">Seu Nome</Label>
                <Input
                  id="requester"
                  value={requester}
                  onChange={(e) => setRequester(e.target.value)}
                  placeholder="Digite seu nome"
                  required
                  className="text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="request">Pedido de Oração</Label>
                <Textarea
                  id="request"
                  value={request}
                  onChange={(e) => setRequest(e.target.value)}
                  placeholder="Compartilhe seu pedido de oração... Lembre-se que este pedido será compartilhado com o grupo."
                  rows={6}
                  required
                  className="resize-none text-base"
                />
              </div>
              <Button type="submit" className="w-full" size="lg">
                <Heart className="mr-2 h-4 w-4" />
                Enviar Pedido de Oração
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <p className="text-center text-sm text-blue-800">
              "Não andeis ansiosos de coisa alguma; em tudo, porém, sejam conhecidas, diante de Deus, as vossas
              petições, pela oração e pela súplica, com ações de graças." - Filipenses 4:6
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
