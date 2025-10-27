// Client-side storage utilities using localStorage
export interface Member {
  id: string
  name: string
  birthDate: string
  age: number
  phone: string
  accessCode: string
  observations: string
  createdAt: string
}

export interface WorshipSchedule {
  id: string
  date: string
  members: string[]
  roles: { memberId: string; role: string }[]
}

export interface CleaningSchedule {
  id: string
  date: string
  members: string[]
  tasks: { memberId: string; task: string }[]
  notes?: string
}

export interface Event {
  id: string
  title: string
  date: string
  description: string
  amount: number
  participants: string[]
}

export interface PrayerRequest {
  id: string
  requester: string
  request: string
  date: string
  answered: boolean
}

export interface Payment {
  id: string
  memberId: string
  type: "mensalidade" | "oferta" | "evento"
  amount: number
  date: string
  status: "pendente" | "pago"
  eventId?: string
}

// Generic storage functions
export function getFromStorage<T>(key: string): T[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : []
}

export function saveToStorage<T>(key: string, data: T[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(key, JSON.stringify(data))
}

// Member functions
export function getMembers(): Member[] {
  return getFromStorage<Member>("members")
}

export function saveMember(member: Omit<Member, "id" | "createdAt" | "age" | "accessCode">): Member {
  const members = getMembers()
  const birthDate = new Date(member.birthDate)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  const newMember: Member = {
    ...member,
    id: crypto.randomUUID(),
    age,
    createdAt: new Date().toISOString(),
    accessCode: "", // Default access code
  }
  members.push(newMember)
  saveToStorage("members", members)
  return newMember
}

export function updateMember(id: string, updates: Partial<Member>): void {
  const members = getMembers()
  const index = members.findIndex((m) => m.id === id)
  if (index !== -1) {
    if (updates.birthDate) {
      const birthDate = new Date(updates.birthDate)
      const today = new Date()
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      updates.age = age
    }
    members[index] = { ...members[index], ...updates }
    saveToStorage("members", members)
  }
}

export function deleteMember(id: string): void {
  const members = getMembers()
  const filtered = members.filter((m) => m.id !== id)
  saveToStorage("members", filtered)
}

// Worship Schedule functions
export function getWorshipSchedules(): WorshipSchedule[] {
  return getFromStorage<WorshipSchedule>("worshipSchedules")
}

export function saveWorshipSchedule(schedule: Omit<WorshipSchedule, "id">): WorshipSchedule {
  const schedules = getWorshipSchedules()
  const newSchedule: WorshipSchedule = {
    ...schedule,
    id: crypto.randomUUID(),
  }
  schedules.push(newSchedule)
  saveToStorage("worshipSchedules", schedules)
  return newSchedule
}

export function updateWorshipSchedule(id: string, updates: Partial<WorshipSchedule>): void {
  const schedules = getWorshipSchedules()
  const index = schedules.findIndex((s) => s.id === id)
  if (index !== -1) {
    schedules[index] = { ...schedules[index], ...updates }
    saveToStorage("worshipSchedules", schedules)
  }
}

export function deleteWorshipSchedule(id: string): void {
  const schedules = getWorshipSchedules()
  const filtered = schedules.filter((s) => s.id !== id)
  saveToStorage("worshipSchedules", filtered)
}

// Cleaning Schedule functions
export function getCleaningSchedules(): CleaningSchedule[] {
  return getFromStorage<CleaningSchedule>("cleaningSchedules")
}

export function saveCleaningSchedule(schedule: Omit<CleaningSchedule, "id">): CleaningSchedule {
  const schedules = getCleaningSchedules()
  const newSchedule: CleaningSchedule = {
    ...schedule,
    id: crypto.randomUUID(),
  }
  schedules.push(newSchedule)
  saveToStorage("cleaningSchedules", schedules)
  return newSchedule
}

export function updateCleaningSchedule(id: string, updates: Partial<CleaningSchedule>): void {
  const schedules = getCleaningSchedules()
  const index = schedules.findIndex((s) => s.id === id)
  if (index !== -1) {
    schedules[index] = { ...schedules[index], ...updates }
    saveToStorage("cleaningSchedules", schedules)
  }
}

export function deleteCleaningSchedule(id: string): void {
  const schedules = getCleaningSchedules()
  const filtered = schedules.filter((s) => s.id !== id)
  saveToStorage("cleaningSchedules", filtered)
}

// Event functions
export function getEvents(): Event[] {
  return getFromStorage<Event>("events")
}

export function saveEvent(event: Omit<Event, "id">): Event {
  const events = getEvents()
  const newEvent: Event = {
    ...event,
    id: crypto.randomUUID(),
  }
  events.push(newEvent)
  saveToStorage("events", events)
  return newEvent
}

export function updateEvent(id: string, updates: Partial<Event>): void {
  const events = getEvents()
  const index = events.findIndex((e) => e.id === id)
  if (index !== -1) {
    events[index] = { ...events[index], ...updates }
    saveToStorage("events", events)
  }
}

export function deleteEvent(id: string): void {
  const events = getEvents()
  const filtered = events.filter((e) => e.id !== id)
  saveToStorage("events", filtered)
}

// Prayer Request functions
export function getPrayerRequests(): PrayerRequest[] {
  return getFromStorage<PrayerRequest>("prayerRequests")
}

export function savePrayerRequest(request: Omit<PrayerRequest, "id" | "date" | "answered">): PrayerRequest {
  const requests = getPrayerRequests()
  const newRequest: PrayerRequest = {
    ...request,
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    answered: false,
  }
  requests.push(newRequest)
  saveToStorage("prayerRequests", requests)
  return newRequest
}

export function updatePrayerRequest(id: string, updates: Partial<PrayerRequest>): void {
  const requests = getPrayerRequests()
  const index = requests.findIndex((r) => r.id === id)
  if (index !== -1) {
    requests[index] = { ...requests[index], ...updates }
    saveToStorage("prayerRequests", requests)
  }
}

export function deletePrayerRequest(id: string): void {
  const requests = getPrayerRequests()
  const filtered = requests.filter((r) => r.id !== id)
  saveToStorage("prayerRequests", filtered)
}

export const addPrayerRequest = savePrayerRequest

// Payment functions
export function getPayments(): Payment[] {
  return getFromStorage<Payment>("payments")
}

export function savePayment(payment: Omit<Payment, "id" | "date">): Payment {
  const payments = getPayments()
  const newPayment: Payment = {
    ...payment,
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
  }
  payments.push(newPayment)
  saveToStorage("payments", payments)
  return newPayment
}

export function updatePayment(id: string, updates: Partial<Payment>): void {
  const payments = getPayments()
  const index = payments.findIndex((p) => p.id === id)
  if (index !== -1) {
    payments[index] = { ...payments[index], ...updates }
    saveToStorage("payments", payments)
  }
}

export function deletePayment(id: string): void {
  const payments = getPayments()
  const filtered = payments.filter((p) => p.id !== id)
  saveToStorage("payments", filtered)
}

export function getPaymentsByMember(memberId: string): Payment[] {
  return getPayments().filter((p) => p.memberId === memberId)
}

export function getPendingPaymentsByMember(memberId: string): Payment[] {
  return getPayments().filter((p) => p.memberId === memberId && p.status === "pendente")
}
