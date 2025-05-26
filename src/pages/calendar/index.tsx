import { useState, useRef } from 'react'
import Box from '@mui/material/Box'
import { Card } from 'antd'
import { useTheme } from '@mui/material/styles'
import type { EventType, AddEventType, CalendarFiltersType, CalendarType } from '../../types/calendar'
import Calendar from '../../components/calendar/Calendar'
import AddEventSidebar from '../../components/calendar/AddEventSidebar'
import CalendarWrapper from '../../components/calendar/CalendarWrapper'

const CalendarPage = () => {
  const theme = useTheme()
  const [state, setState] = useState<CalendarType>({
    events: [],
    selectedEvent: null,
    selectedCalendars: ['Personal', 'Business', 'Family', 'Holiday', 'ETC'] as CalendarFiltersType[]
  })

  const calendarRef = useRef<any>(null)
  const [mdAbove, setMdAbove] = useState<boolean>(false)
  const [calendarApi, setCalendarApi] = useState<any>(null)
  const [addEventSidebarOpen, setAddEventSidebarOpen] = useState<boolean>(false)

  // Define handleGotoDate function
  const handleGotoDate = (date: Date) => {
    if (calendarApi) {
      calendarApi.gotoDate(date);
    }
  };

  const handleLeftSidebarToggle = () => {
    setMdAbove(!mdAbove)
  }

  const handleAddEventSidebarToggle = () => {
    setAddEventSidebarOpen(!addEventSidebarOpen)
  }

  const handleAddEvent = (event: AddEventType) => {
    const newEvent = {
      id: String(Math.random()),
      ...event
    }
    setState(prevState => ({
      ...prevState,
      events: [...prevState.events, newEvent]
    }))
  }

  const handleUpdateEvent = (event: EventType) => {
    setState(prevState => ({
      ...prevState,
      events: prevState.events.map(e => (e.id === event.id ? event : e))
    }))
  }

  const handleDeleteEvent = (eventId: string) => {
    setState(prevState => ({
      ...prevState,
      events: prevState.events.filter(e => e.id !== eventId)
    }))
  }

  const handleSelectEvent = (event: EventType | null) => {
    setState(prevState => ({
      ...prevState,
      selectedEvent: event
    }))
  }

  const handleSelectAllCalendars = (value: boolean) => {
    setState(prevState => ({
      ...prevState,
      selectedCalendars: value ? ['Personal', 'Business', 'Family', 'Holiday', 'ETC'] as CalendarFiltersType[] : []
    }))
  }

  const handleSelectCalendar = (calendar: CalendarFiltersType) => {
    setState(prevState => ({
      ...prevState,
      selectedCalendars: prevState.selectedCalendars.includes(calendar)
        ? prevState.selectedCalendars.filter(c => c !== calendar)
        : [...prevState.selectedCalendars, calendar]
    }))
  }

  return (
    <Box className='flex flex-col gap-4'>
      <Card
        style={{
          backgroundColor: "#fff",
          borderRadius: 10,
          padding: "10px 20px",
          marginTop: 20,
          marginLeft: 20,
          marginRight: 20,
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <CalendarWrapper
          calendarRef={calendarRef}
          events={state.events}
          selectedEvent={state.selectedEvent}
          selectedCalendars={state.selectedCalendars}
          handleAddEventSidebarToggle={handleAddEventSidebarToggle}
          handleSelectAllCalendars={handleSelectAllCalendars}
          handleSelectCalendar={handleSelectCalendar}
          handleGotoDate={handleGotoDate}
        >
          <Calendar
            mdAbove={mdAbove}
            calendarApi={calendarApi}
            setCalendarApi={setCalendarApi}
            calendars={state}
            handleSelectEvent={handleSelectEvent}
            handleAddEventSidebarToggle={handleAddEventSidebarToggle}
          />
        </CalendarWrapper>
      </Card>

      <AddEventSidebar
        calendars={state}
        calendarApi={calendarApi}
        handleAddEvent={handleAddEvent}
        handleUpdateEvent={handleUpdateEvent}
        handleDeleteEvent={handleDeleteEvent}
        handleSelectEvent={handleSelectEvent}
        addEventSidebarOpen={addEventSidebarOpen}
        handleAddEventSidebarToggle={handleAddEventSidebarToggle}
      />
    </Box>
  )
}

export default CalendarPage 