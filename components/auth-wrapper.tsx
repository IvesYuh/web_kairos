"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { isAuthenticated } from "@/lib/auth"

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Permitir acesso à página de login sem autenticação
    if (pathname === "/login") {
      setIsChecking(false)
      return
    }

    // Verificar autenticação para outras páginas
    if (!isAuthenticated()) {
      router.push("/login")
    } else {
      setIsChecking(false)
    }
  }, [pathname, router])

  // Mostrar loading enquanto verifica autenticação
  if (isChecking && pathname !== "/login") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
