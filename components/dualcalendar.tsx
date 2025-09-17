"use client"

import * as React from "react"

import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import type { DateRange } from "react-day-picker"

export function DualCalendar() {
  const [range, setRange] = React.useState<DateRange | undefined>(undefined)

  const formatRangePart = (date?: Date) =>
    date
      ? date.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        })
      : "—"

  return (
    <div className="space-y-6">
      <Calendar
        mode="range"
        defaultMonth={range?.from ?? new Date()}
        numberOfMonths={2}
        selected={range}
        onSelect={setRange}
        showOutsideDays={false}
        buttonVariant="outline"
        className="rounded-lg border shadow-sm"
        classNames={{
          caption_label: "select-none",
          weekday:
            "text-emerald-900 rounded-md flex-1 font-semibold text-sm select-none",
          button_previous: "rounded-full",
          button_next: "rounded-full",
        }}
      />

      <div className="flex items-center justify-between">
        <div className="text-gray-900">
          Check-in: {formatRangePart(range?.from)}, Check-out: {formatRangePart(range?.to)}
        </div>
        <Button variant="outline" className="rounded-full" onClick={() => setRange(undefined)}>
          Clear dates
        </Button>
      </div>
    </div>
  )
}


