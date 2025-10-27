import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { AuthWrapper } from "@/components/auth-wrapper"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Kairós - Gerenciamento",
  description: "Sistema para gerenciar grupo de jovens - Kairós",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`font-sans antialiased`}>
        <AuthWrapper>
          <SidebarProvider>
            <AppSidebar />
            <main className="flex-1 w-full">
              <div className="border-b border-border bg-card">
                <div className="flex h-14 items-center px-4 gap-4">
                  <SidebarTrigger />
                  <h1 className="text-lg font-semibold">Igreja Holiness</h1>
                </div>
              </div>
              <div className="p-6">{children}</div>
            </main>
          </SidebarProvider>
        </AuthWrapper>
        <Analytics />
      </body>
    </html>
  )
}
