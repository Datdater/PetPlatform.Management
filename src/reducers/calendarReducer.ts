import type { CalendarActionType, CalendarType, EventType, CalendarFiltersType } from '../types/calendar'

const calendarReducer = (state: CalendarType, action: CalendarActionType): CalendarType => {
  switch (action.type) {
    case 'added':
      return {
        ...state,
        events: [...state.events, action.event as EventType]
      }

    case 'updated':
      return {
        ...state,
        events: state.events.map(event => (event.id === action.event?.id ? action.event : event))
      }

    case 'deleted':
      return {
        ...state,
        events: state.events.filter(event => event.id !== action.eventId)
      }

    case 'selected_event':
      return {
        ...state,
        selectedEvent: action.event
      }

    case 'selected_calendars':
      return {
        ...state,
        selectedCalendars: state.selectedCalendars.includes(action.calendar as CalendarFiltersType)
          ? state.selectedCalendars.filter(calendar => calendar !== action.calendar)
          : [...state.selectedCalendars, action.calendar as CalendarFiltersType]
      }

    case 'selected_all_calendars':
      return {
        ...state,
        selectedCalendars: action.view_all
          ? ['Personal', 'Business', 'Family', 'Holiday', 'ETC'] as CalendarFiltersType[]
          : []
      }

    default:
      return state
  }
}

export default calendarReducer 