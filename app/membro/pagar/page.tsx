"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, CheckCircle2, Copy, QrCode, Lock } from "lucide-react"
import { getMembers, getPayments, updatePayment, type Member, type Payment } from "@/lib/storage"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function MemberPaymentPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [selectedMemberId, setSelectedMemberId] = useState<string>("")
  const [accessCode, setAccessCode] = useState<string>("")
  const [authenticated, setAuthenticated] = useState(false)
  const [authError, setAuthError] = useState(false)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [selectedPayments, setSelectedPayments] = useState<string[]>([])
  const [pixCopied, setPixCopied] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState("select")

  // Chave PIX fictícia para demonstração
  const pixKey = "grupo.jovens@igreja.com.br"

  useEffect(() => {
    setMembers(getMembers())
    setPayments(getPayments())
  }, [])

  const handleAuthenticate = () => {
    const member = members.find((m) => m.id === selectedMemberId)
    if (member && member.accessCode === accessCode) {
      setAuthenticated(true)
      setSelectedMember(member)
      setAuthError(false)
      setActiveTab("payment")
    } else {
      setAuthError(true)
      setTimeout(() => setAuthError(false), 3000)
    }
  }

  const getMemberPendingPayments = (memberId: string) => {
    return payments.filter((p) => p.memberId === memberId && p.status === "pendente")
  }

  const getTotalAmount = () => {
    return selectedPayments.reduce((sum, paymentId) => {
      const payment = payments.find((p) => p.id === paymentId)
      return sum + (payment?.amount || 0)
    }, 0)
  }

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixKey)
    setPixCopied(true)
    setTimeout(() => setPixCopied(false), 2000)
  }

  const handleConfirmPayment = () => {
    selectedPayments.forEach((paymentId) => {
      updatePayment(paymentId, { status: "pago" })
    })
    setPayments(getPayments())
    setSelectedPayments([])
    setPaymentSuccess(true)
    setTimeout(() => {
      setPaymentSuccess(false)
      setSelectedMember(null)
      setAuthenticated(false)
      setSelectedMemberId("")
      setAccessCode("")
      setActiveTab("select")
    }, 3000)
  }

  const togglePaymentSelection = (paymentId: string) => {
    setSelectedPayments((prev) =>
      prev.includes(paymentId) ? prev.filter((id) => id !== paymentId) : [...prev, paymentId],
    )
  }

  const getQRCodeUrl = () => {
    const amount = getTotalAmount().toFixed(2)
    const pixData = `00020126580014BR.GOV.BCB.PIX0136${pixKey}520400005303986540${amount}5802BR5925Grupo de Jovens6009SAO PAULO62070503***6304`
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pixData)}`
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-balance">Pagamento via PIX</h2>
        <p className="text-muted-foreground mt-2">Realize seus pagamentos de forma rápida e segura</p>
      </div>

      {paymentSuccess && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="py-6">
            <div className="flex items-center gap-3 text-green-700">
              <CheckCircle2 className="h-6 w-6" />
              <div>
                <p className="font-semibold">Pagamento confirmado com sucesso!</p>
                <p className="text-sm text-green-600">Seus pagamentos foram registrados no sistema.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {authError && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="py-6">
            <div className="flex items-center gap-3 text-red-700">
              <AlertCircle className="h-6 w-6" />
              <div>
                <p className="font-semibold">Código de acesso incorreto!</p>
                <p className="text-sm text-red-600">Verifique o membro e código selecionados.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="select">Autenticação</TabsTrigger>
          <TabsTrigger value="payment" disabled={!authenticated}>
            Realizar Pagamento
          </TabsTrigger>
        </TabsList>

        <TabsContent value="select" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Acesso Seguro
              </CardTitle>
              <CardDescription>Selecione seu nome e digite seu código de acesso para continuar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="member">Selecione seu nome</Label>
                <Select value={selectedMemberId} onValueChange={setSelectedMemberId}>
                  <SelectTrigger id="member">
                    <SelectValue placeholder="Escolha seu nome" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accessCode">Código de Acesso</Label>
                <Input
                  id="accessCode"
                  type="password"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  placeholder="Digite seu código"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && selectedMemberId && accessCode) {
                      handleAuthenticate()
                    }
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  Use o código cadastrado no sistema para acessar suas informações
                </p>
              </div>

              <Button onClick={handleAuthenticate} className="w-full" disabled={!selectedMemberId || !accessCode}>
                Acessar Pagamentos
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-4">
          {selectedMember && authenticated && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Pagamentos Pendentes - {selectedMember.name}</CardTitle>
                  <CardDescription>Selecione os pagamentos que deseja realizar</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getMemberPendingPayments(selectedMember.id).map((payment) => (
                      <Card
                        key={payment.id}
                        className={`cursor-pointer transition-all ${
                          selectedPayments.includes(payment.id) ? "border-primary border-2 bg-primary/5" : ""
                        }`}
                        onClick={() => togglePaymentSelection(payment.id)}
                      >
                        <CardContent className="py-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{payment.type}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Cadastrado em: {new Date(payment.date).toLocaleDateString("pt-BR")}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-semibold">R$ {payment.amount.toFixed(2)}</p>
                              {selectedPayments.includes(payment.id) && (
                                <CheckCircle2 className="h-5 w-5 text-primary ml-auto mt-1" />
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {getMemberPendingPayments(selectedMember.id).length === 0 && (
                      <Card className="border-green-200 bg-green-50">
                        <CardContent className="py-8 text-center">
                          <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-2" />
                          <p className="font-semibold text-green-700">Parabéns!</p>
                          <p className="text-sm text-green-600">Você não possui pagamentos pendentes</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </CardContent>
              </Card>

              {selectedPayments.length > 0 && (
                <Card className="border-primary">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <QrCode className="h-5 w-5" />
                      Pagamento via PIX
                    </CardTitle>
                    <CardDescription>Escaneie o QR Code ou copie a chave PIX para realizar o pagamento</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-center py-4">
                      <div className="rounded-lg border-2 border-primary p-4 bg-white">
                        <img src={getQRCodeUrl() || "/placeholder.svg"} alt="QR Code PIX" className="w-48 h-48" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Chave PIX (E-mail)</Label>
                      <div className="flex gap-2">
                        <Input value={pixKey} readOnly className="font-mono" />
                        <Button variant="outline" size="icon" onClick={handleCopyPix}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      {pixCopied && (
                        <p className="text-sm text-green-600 flex items-center gap-1">
                          <CheckCircle2 className="h-4 w-4" />
                          Chave PIX copiada!
                        </p>
                      )}
                    </div>

                    <div className="rounded-lg bg-muted p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Pagamentos selecionados:</span>
                        <span className="font-medium">{selectedPayments.length}</span>
                      </div>
                      <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                        <span>Total a pagar:</span>
                        <span className="text-primary">R$ {getTotalAmount().toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Após realizar o pagamento, clique no botão abaixo para confirmar.
                      </p>
                      <Button onClick={handleConfirmPayment} className="w-full" size="lg">
                        Confirmar Pagamento
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
