export type CalendarFiltersType = 'Personal' | 'Business' | 'Family' | 'Holiday' | 'ETC'

export type EventDateType = Date | null

export interface CalendarColors {
  Personal: string
  Business: string
  Family: string
  Holiday: string
  ETC: string
}

export interface EventType {
  id: string
  url?: string
  title: string
  allDay: boolean
  start: Date | string
  end: Date | string
  extendedProps: {
    calendar?: string
    description?: string
    guests?: string[] | string | undefined
  }
}

export interface AddEventType {
  url?: string
  title: string
  allDay: boolean
  start: Date | string
  end: Date | string
  extendedProps: {
    calendar?: string
    description?: string
    guests?: string[] | string | undefined
  }
}

export interface CalendarType {
  events: EventType[]
  selectedEvent: EventType | null
  selectedCalendars: CalendarFiltersType[]
}

export interface CalendarProps {
  mdAbove: boolean
  calendarApi: any
  setCalendarApi: (api: any) => void
  calendars: CalendarType
  handleSelectEvent: (event: EventType | null) => void
  handleAddEventSidebarToggle: () => void
}

export interface AddEventSidebarType {
  calendars: CalendarType
  calendarApi: any
  handleAddEvent: (event: AddEventType) => void
  handleUpdateEvent: (event: EventType) => void
  handleDeleteEvent: (eventId: string) => void
  handleSelectEvent: (event: EventType | null) => void
  addEventSidebarOpen: boolean
  handleAddEventSidebarToggle: () => void
}

export interface CalendarWrapperProps {
  calendarRef: React.RefObject<any>
  events: EventType[]
  selectedEvent: EventType | null
  selectedCalendars: CalendarFiltersType[]
  handleLeftSidebarToggle: () => void
  handleAddEventSidebarToggle: () => void
  handleSelectAllCalendars: (value: boolean) => void
  handleSelectCalendar: (calendar: CalendarFiltersType) => void
  children: React.ReactNode
}

export type SidebarLeftProps = {
  mdAbove: boolean
  calendarApi: any
  calendars: CalendarType
  leftSidebarOpen: boolean
  calendarsColor: CalendarColors
  handleLeftSidebarToggle: () => void
  handleAddEventSidebarToggle: () => void
  handleAllCalendars: (val: boolean) => void
  handleSelectEvent: (event: EventType | null) => void
  handleCalendarsUpdate: (val: CalendarFiltersType) => void
}

export type CalendarActionType = {
  type: 'added' | 'updated' | 'deleted' | 'selected_event' | 'selected_calendars' | 'selected_all_calendars'
  event?: EventType
  calendar?: CalendarFiltersType
  eventId?: string
  view_all?: boolean
}

export type ThemeColor = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' 