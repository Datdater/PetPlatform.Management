import { ReactNode, useState } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import Button from '@mui/material/Button'
import type { Theme } from '@mui/material/styles'
import type { EventType, CalendarFiltersType, CalendarColors } from '../../types/calendar'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
// Thêm CSS tùy chỉnh để ghi đè lên các kiểu mặc định của DatePicker
import '../../styles/calendar-custom.css'

interface CalendarWrapperProps {
    children: ReactNode
    calendarRef: React.RefObject<any>
    events: EventType[]
    selectedEvent: EventType | null
    selectedCalendars: CalendarFiltersType[]
    handleAddEventSidebarToggle: () => void
    handleSelectAllCalendars: (value: boolean) => void
    handleSelectCalendar: (calendar: CalendarFiltersType) => void
    handleGotoDate: (date: Date) => void
}

const CalendarWrapper = (props: CalendarWrapperProps) => {
    const {
        children,
        calendarRef,
        events,
        selectedEvent,
        selectedCalendars,
        handleAddEventSidebarToggle,
        handleSelectAllCalendars,
        handleSelectCalendar,
        handleGotoDate
    } = props

    const isBelowLgScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))

    // State for the mini calendar date
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
    // State for the left sidebar visibility
    const [leftSidebarOpen, setLeftSidebarOpen] = useState(!isBelowLgScreen)

    const calendarsColor: CalendarColors = {
        Personal: '#9155FD', // Example color, replace with your theme colors
        Business: '#1C9CEA',
        Family: '#FFB547',
        Holiday: '#56CA00',
        ETC: '#FF4C51',
    };

    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date)
        // Optionally, you can update the main calendar view to the selected date here
        if (date) {
            handleGotoDate(date)
        }
    }

    const handleLeftSidebarToggle = () => {
        setLeftSidebarOpen(!leftSidebarOpen)
    }

    return (
        <Card sx={{ p: 0, overflow: 'hidden' }}>
            <Box sx={{ display: 'flex', flexDirection: ['column', 'column', 'row'], p: 0 }}>
                {/* Sidebar */}
                {leftSidebarOpen && (
                    <Box
                        className='flex flex-col p-3 border-be lg:border-be-0 lg:border-ie'
                        sx={{
                            width: ['100%', '100%', 260],
                            minWidth: 260,
                            borderRight: '1px solid #e0e0e0',
                        }}
                    >
                        <Box 
                          sx={{ 
                              height: '56px', // Đặt chiều cao cố định để đảm bảo khoảng cách đồng nhất với lịch lớn
                              mb: 0,
                              display: 'flex', // Use flexbox for centering
                              justifyContent: 'center', // Center horizontally
                          }}
                        >
                          <Button
                              variant='contained'
                              onClick={handleAddEventSidebarToggle}
                              startIcon={<i className='ri-add-line' />}
                              sx={{
                                  '& .MuiButton-startIcon': {
                                      marginRight: 1 // Điều chỉnh khoảng cách giữa icon và text
                                  },
                                  width: 'calc(100% - 32px)', // Set width with some margin for padding
                                  maxWidth: 200, // Set a max width similar to Image 1
                                  mb: 1.2,
                                  mt: 1.2
                              }}
                          >
                              Add Event
                          </Button>
                        </Box>

                        <Box className='calendar-mini-wrapper mb-4'>
                            <DatePicker
                                inline
                                selected={selectedDate}
                                onChange={handleDateChange}
                                className="calendar-custom"
                            />
                        </Box>

                        <Box className='flex items-center justify-between mb-4'>
                            <Typography variant='h6'>Calendars</Typography>
                            {isBelowLgScreen && (
                                <IconButton onClick={handleLeftSidebarToggle}>
                                    <i className='ri-menu-fold-line' />
                                </IconButton>
                            )}
                        </Box>
                        <Box className='flex flex-col gap-2'>
                            <Box className='flex items-center'>
                                <input
                                    type='checkbox'
                                    id='select-all'
                                    checked={selectedCalendars.length === 5}
                                    onChange={e => handleSelectAllCalendars(e.target.checked)}
                                    className='mie-2'
                                />
                                <label htmlFor='select-all'>Select All</label>
                            </Box>
                            {['Personal', 'Business', 'Family', 'Holiday', 'ETC'].map(calendar => (
                                <Box key={calendar} className='flex items-center'>
                                    <input
                                        type='checkbox'
                                        id={calendar}
                                        checked={selectedCalendars.includes(calendar as CalendarFiltersType)}
                                        onChange={() => handleSelectCalendar(calendar as CalendarFiltersType)}
                                        className='mie-2'
                                    />
                                    <Box
                                        component='span'
                                        sx={{ width: 10, height: 10, borderRadius: '50%', display: 'inline-block', mie: 2,
                                            backgroundColor: calendarsColor[calendar as CalendarFiltersType]
                                        }}
                                    />
                                    <label htmlFor={calendar}>{calendar}</label>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                )}

                {/* Main Calendar Content */}
                <Box className={`flex-1 ${leftSidebarOpen ? '' : 'w-full'}`} sx={{ mr: { lg: 1 } }}>
                    {!leftSidebarOpen && isBelowLgScreen && (
                        <IconButton onClick={handleLeftSidebarToggle} className='m-2'>
                            <i className='ri-menu-line text-xl' />
                        </IconButton>
                    )}
                    {children}
                </Box>
            </Box>
        </Card>
    )
}

export default CalendarWrapper