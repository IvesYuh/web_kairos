"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ScheduleItem {
  id: string
  date: string
  [key: string]: any
}

interface ScheduleCalendarProps {
  schedules: ScheduleItem[]
  onDateSelect: (date: string) => void
  selectedDate?: string
}

export function ScheduleCalendar({ schedules, onDateSelect, selectedDate }: ScheduleCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay()

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ]

  const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const getSchedulesForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return schedules.filter((schedule) => schedule.date === dateStr)
  }

  const isSelectedDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return dateStr === selectedDate
  }

  const days = []
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="p-2" />)
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const daySchedules = getSchedulesForDate(day)
    const hasSchedules = daySchedules.length > 0
    const isSelected = isSelectedDate(day)
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`

    days.push(
      <button
        key={day}
        onClick={() => onDateSelect(dateStr)}
        className={`p-2 text-sm rounded-md hover:bg-accent transition-colors ${
          hasSchedules ? "font-semibold bg-primary/10" : ""
        } ${isSelected ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}`}
      >
        <div>{day}</div>
        {hasSchedules && (
          <div className="flex justify-center gap-0.5 mt-1">
            {daySchedules.map((_, idx) => (
              <div key={idx} className="w-1 h-1 bg-primary rounded-full" />
            ))}
          </div>
        )}
      </button>,
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            {monthNames[month]} {year}
          </CardTitle>
          <div className="flex gap-1">
            <Button variant="outline" size="icon" onClick={previousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          {dayNames.map((name) => (
            <div key={name} className="p-2 text-center text-sm font-medium text-muted-foreground">
              {name}
            </div>
          ))}
          {days}
        </div>
      </CardContent>
    </Card>
  )
}
