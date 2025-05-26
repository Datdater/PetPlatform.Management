import { useEffect, useRef } from 'react'
import { useTheme } from '@mui/material/styles'
import FullCalendar from '@fullcalendar/react'
import listPlugin from '@fullcalendar/list'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { EventType } from '../../types/calendar'

interface CalendarProps {
  mdAbove: boolean
  calendarApi: any
  setCalendarApi: (api: any) => void
  calendars: {
    events: EventType[]
    selectedEvent: EventType | null
    selectedCalendars: string[]
  }
  handleSelectEvent: (event: EventType | null) => void
  handleAddEventSidebarToggle: () => void
}

const Calendar = (props: CalendarProps) => {
  const { mdAbove, calendarApi, setCalendarApi, calendars, handleSelectEvent, handleAddEventSidebarToggle } = props

  const calendarRef = useRef<FullCalendar>(null)

  useEffect(() => {
    if (calendarRef.current) {
      setCalendarApi(calendarRef.current.getApi())
    }
  }, [setCalendarApi])

  const handleEventClick = (arg: any) => {
    handleSelectEvent(arg.event)
  }

  const handleDateClick = (arg: any) => {
    handleAddEventSidebarToggle()
  }

  const handleEventDrop = (arg: any) => {
    // Handle event drop
  }

  const handleEventResize = (arg: any) => {
    // Handle event resize
  }

  return (
    <FullCalendar
      ref={calendarRef}
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
      initialView='dayGridMonth'
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: mdAbove ? 'dayGridMonth,timeGridWeek,timeGridDay,listWeek' : 'dayGridMonth,timeGridWeek,timeGridDay'
      }}
      events={calendars.events}
      eventClick={handleEventClick}
      dateClick={handleDateClick}
      eventDrop={handleEventDrop}
      eventResize={handleEventResize}
      height='auto'
      editable={true}
      droppable={true}
      selectable={true}
      selectMirror={true}
      dayMaxEvents={true}
      weekends={true}
      nowIndicator={true}
      initialDate={new Date()}
      slotMinTime='06:00:00'
      slotMaxTime='20:00:00'
      allDaySlot={true}
      slotDuration='00:30:00'
      slotLabelInterval='00:30:00'
      slotLabelFormat={{
        hour: '2-digit',
        minute: '2-digit',
        meridiem: false
      }}
      views={{
        week: {
          titleFormat: { year: 'numeric', month: 'short', day: 'numeric' }
        },
        dayGridMonth: {
          titleFormat: { year: 'numeric', month: 'short' }
        },
        timeGridWeek: {
          titleFormat: { year: 'numeric', month: 'short', day: 'numeric' }
        },
        timeGridDay: {
          titleFormat: { year: 'numeric', month: 'short', day: 'numeric' }
        }
      }}
    />
  )
}

export default Calendar 