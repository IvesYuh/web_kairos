export type UserRole = "leadership" | "member" | null

export interface AuthUser {
  username: string
  role: UserRole
}

const AUTH_STORAGE_KEY = "youth_group_auth"

export function login(username: string, password: string): AuthUser | null {
  // Credenciais de liderança
  if (username === "kairos-lideranca" && password === "Kairos@123") {
    const user: AuthUser = { username, role: "leadership" }
    if (typeof window !== "undefined") {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
    }
    return user
  }

  // Credenciais de membro
  if (username === "kairos-membro" && password === "Membro@123") {
    const user: AuthUser = { username, role: "member" }
    if (typeof window !== "undefined") {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
    }
    return user
  }

  return null
}

export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }
}

export function getCurrentUser(): AuthUser | null {
  if (typeof window === "undefined") return null

  const stored = localStorage.getItem(AUTH_STORAGE_KEY)
  if (!stored) return null

  try {
    return JSON.parse(stored) as AuthUser
  } catch {
    return null
  }
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null
}

export function isLeadership(): boolean {
  const user = getCurrentUser()
  return user?.role === "leadership"
}

export function isMember(): boolean {
  const user = getCurrentUser()
  return user?.role === "member"
}
