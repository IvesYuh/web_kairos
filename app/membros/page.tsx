"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { MemberForm } from "@/components/member-form"
import { MemberList } from "@/components/member-list"
import { getMembers, saveMember, updateMember, deleteMember, type Member } from "@/lib/storage"

export default function MembrosPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingMember, setEditingMember] = useState<Member | null>(null)

  useEffect(() => {
    setMembers(getMembers())
  }, [])

  const handleSubmit = (data: { name: string; birthDate: string; phone: string; observations: string }) => {
    if (editingMember) {
      updateMember(editingMember.id, data)
    } else {
      saveMember(data)
    }
    setMembers(getMembers())
    setShowForm(false)
    setEditingMember(null)
  }

  const handleEdit = (member: Member) => {
    setEditingMember(member)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    deleteMember(id)
    setMembers(getMembers())
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingMember(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Membros do Grupo</h2>
          <p className="text-muted-foreground mt-1">Gerencie os membros do grupo de jovens</p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Membro
          </Button>
        )}
      </div>

      {showForm ? (
        <MemberForm member={editingMember || undefined} onSubmit={handleSubmit} onCancel={handleCancel} />
      ) : members.length > 0 ? (
        <MemberList members={members} onEdit={handleEdit} onDelete={handleDelete} />
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <p>Nenhum membro cadastrado ainda.</p>
          <p className="text-sm mt-2">Clique em "Novo Membro" para começar.</p>
        </div>
      )}
    </div>
  )
}
