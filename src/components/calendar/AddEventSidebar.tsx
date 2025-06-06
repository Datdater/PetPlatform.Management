import { useState, useEffect, forwardRef, useCallback } from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Select from '@mui/material/Select'
import Switch from '@mui/material/Switch'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import type { Theme } from '@mui/material/styles'
import { useForm, Controller } from 'react-hook-form'
import PerfectScrollbar from 'react-perfect-scrollbar'
import type { EventDateType, AddEventSidebarType } from '../../types/calendar'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

interface PickerProps {
  label?: string
  error?: boolean
  registername?: string
}

interface DefaultStateType {
  url: string
  title: string
  allDay: boolean
  calendar: string
  description: string
  endDate: Date | string
  startDate: Date | string
  guests: string[] | string | undefined
}

// Vars
const capitalize = (string: string) => string && string[0].toUpperCase() + string.slice(1)

const defaultState: DefaultStateType = {
  url: '',
  title: '',
  guests: [],
  allDay: true,
  description: '',
  endDate: new Date(),
  calendar: 'Business',
  startDate: new Date()
}

const AddEventSidebar = (props: AddEventSidebarType) => {
  // Props
  const {
    calendars,
    calendarApi,
    handleAddEvent,
    handleUpdateEvent,
    handleDeleteEvent,
    handleSelectEvent,
    addEventSidebarOpen,
    handleAddEventSidebarToggle
  } = props

  // States
  const [values, setValues] = useState<DefaultStateType>(defaultState)

  const PickersComponent = forwardRef(({ ...props }: PickerProps, ref) => {
    return (
      <TextField
        inputRef={ref}
        fullWidth
        {...props}
        label={props.label || ''}
        className='is-full'
        error={props.error}
        size='small'
      />
    )
  })

  // Hooks
  const isBelowSmScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

  const {
    control,
    setValue,
    clearErrors,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues: { title: '' } })

  const resetToStoredValues = useCallback(() => {
    if (calendars.selectedEvent !== null) {
      const event = calendars.selectedEvent

      setValue('title', event.title || '')
      setValues({
        url: event.url || '',
        title: event.title || '',
        allDay: event.allDay,
        guests: event.extendedProps.guests || [],
        description: event.extendedProps.description || '',
        calendar: event.extendedProps.calendar || 'Business',
        endDate: event.end !== null ? event.end : event.start,
        startDate: event.start !== null ? event.start : new Date()
      })
    } else {
        setValues(defaultState)
    }
  }, [setValue, calendars.selectedEvent])

  const resetToEmptyValues = useCallback(() => {
    setValue('title', '')
    setValues(defaultState)
  }, [setValue])

  const handleSidebarClose = async () => {
    setValues(defaultState)
    clearErrors()
    handleSelectEvent(null)
    handleAddEventSidebarToggle()
  }

  const onSubmit = (data: { title: string }) => {
    const modifiedEvent = {
      url: values.url,
      display: 'block',
      title: data.title,
      end: values.endDate,
      allDay: values.allDay,
      start: values.startDate,
      extendedProps: {
        calendar: capitalize(values.calendar),
        guests: values.guests && values.guests.length ? values.guests : undefined,
        description: values.description.length ? values.description : undefined
      }
    }

    if (
      calendars.selectedEvent === null ||
      (calendars.selectedEvent !== null && !calendars.selectedEvent.title.length)
    ) {
      handleAddEvent(modifiedEvent)
    } else {
      handleUpdateEvent({ id: calendars.selectedEvent.id, ...modifiedEvent })
    }

    calendarApi.refetchEvents()
    handleSidebarClose()
  }

  const handleDeleteButtonClick = () => {
    if (calendars.selectedEvent) {
      handleDeleteEvent(calendars.selectedEvent.id)
      calendarApi.getEventById(calendars.selectedEvent.id).remove()
    }

    handleSidebarClose()
  }

  const handleStartDate = (date: Date | null) => {
    if (date && date > values.endDate) {
      setValues({ ...values, startDate: new Date(date), endDate: new Date(date) })
    } else if (date) {
      setValues({ ...values, startDate: new Date(date)})
    }
  }

   const handleEndDate = (date: Date | null) => {
    if (date) {
      setValues({ ...values, endDate: new Date(date)})
    }
  }

  const RenderSidebarFooter = () => {
    if (calendars.selectedEvent === null || (calendars.selectedEvent && !calendars.selectedEvent.title.length)) {
      return (
        <div className='flex gap-4'>
          <Button type='submit' variant='contained'>
            Add
          </Button>
          <Button variant='outlined' color='secondary' onClick={resetToEmptyValues}>
            Reset
          </Button>
        </div>
      )
    } else {
      return (
        <div className='flex gap-4'>
          <Button type='submit' variant='contained' color='error'>
            Delete
          </Button>
           <Button type='submit' variant='contained'>
            Update
          </Button>
          <Button variant='outlined' color='secondary' onClick={resetToStoredValues}>
            Reset
          </Button>
        </div>
      )
    }
  }

  const ScrollWrapper = isBelowSmScreen ? 'div' : PerfectScrollbar

  useEffect(() => {
    if (calendars.selectedEvent !== null) {
      resetToStoredValues()
    } else {
      resetToEmptyValues()
    }
  }, [addEventSidebarOpen, resetToStoredValues, resetToEmptyValues, calendars.selectedEvent])

  return (
    <Drawer
      anchor='right'
      open={addEventSidebarOpen}
      onClose={handleSidebarClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        '& .MuiDrawer-paper': { width: ['100%', 400] },
        '& .MuiTypography-root': {
          lineHeight: 'normal'
        }
      }}
    >
      <Box className='flex justify-between items-center sidebar-header p-4 border-be'>
        <Typography variant='h5'>
          {calendars.selectedEvent && calendars.selectedEvent.title.length ? 'Update Event' : 'Add Event'}
        </Typography>
        {calendars.selectedEvent && calendars.selectedEvent.title.length ? (
          <Box className='flex items-center' sx={{ gap: calendars.selectedEvent !== null ? 1 : 0 }}>
            <IconButton size='small' onClick={handleDeleteButtonClick}>
              <i className='ri-delete-bin-7-line text-xl' />
            </IconButton>
            <IconButton size='small' onClick={handleSidebarClose}>
              <i className='ri-close-line text-xl' />
            </IconButton>
          </Box>
        ) : (
          <IconButton size='small' onClick={handleSidebarClose}>
            <i className='ri-close-line text-xl' />
          </IconButton>
        )}
      </Box>
      <ScrollWrapper
        {...(isBelowSmScreen
          ? { className: 'bs-full overflow-y-auto overflow-x-hidden' }
          : { options: { wheelPropagation: false, suppressScrollX: true } })}
      >
        <Box className='sidebar-body p-6'>
          <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
            <FormControl fullWidth className='mbe-6'>
              <Controller
                name='title'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    label='Title'
                    value={value}
                    onChange={onChange}
                    {...(errors.title && { error: true, helperText: 'This field is required' })}
                    size='small'
                  />
                )}
              />
            </FormControl>
            <FormControl fullWidth className='mbe-6'>
              <InputLabel id='event-calendar'>Calendar</InputLabel>
              <Select
                label='Calendar'
                value={values.calendar}
                labelId='event-calendar'
                onChange={e => setValues({ ...values, calendar: e.target.value })}
                 size='small'
              >
                <MenuItem value='Personal'>Personal</MenuItem>
                <MenuItem value='Business'>Business</MenuItem>
                <MenuItem value='Family'>Family</MenuItem>
                <MenuItem value='Holiday'>Holiday</MenuItem>
                <MenuItem value='ETC'>ETC</MenuItem>
              </Select>
            </FormControl>
            <div className='mbe-6'>
              <DatePicker
                selectsStart
                id='event-start-date'
                endDate={values.endDate as Date}
                selected={values.startDate as Date}
                startDate={values.startDate as Date}
                showTimeSelect={!values.allDay}
                dateFormat={!values.allDay ? 'yyyy-MM-dd hh:mm' : 'yyyy-MM-dd'}
                customInput={<PickersComponent label='Start Date' registername='startDate' />}
                onChange={handleStartDate}
              />
            </div>
            <div className='mbe-6'>
              <DatePicker
                selectsEnd
                id='event-end-date'
                endDate={values.endDate as Date}
                selected={values.endDate as Date}
                minDate={values.startDate as Date}
                startDate={values.startDate as Date}
                showTimeSelect={!values.allDay}
                dateFormat={!values.allDay ? 'yyyy-MM-dd hh:mm' : 'yyyy-MM-dd'}
                customInput={<PickersComponent label='End Date' registername='endDate' />}
                onChange={handleEndDate}
              />
            </div>
            <FormControl className='mbe-6'>
              <FormControlLabel
                label='All Day'
                control={
                  <Switch checked={values.allDay} onChange={e => setValues({ ...values, allDay: e.target.checked })} />
                }
                 sx={{ '& .MuiFormControlLabel-label': { lineHeight: 'normal' }}}
              />
            </FormControl>
            <TextField
              fullWidth
              type='url'
              id='event-url'
              className='mbe-6'
              label='Event URL'
              value={values.url}
              onChange={e => setValues({ ...values, url: e.target.value })}
               size='small'
            />
            <FormControl fullWidth className='mbe-6'>
              <InputLabel id='event-guests'>Guests</InputLabel>
              <Select
                multiple
                label='Guests'
                value={values.guests}
                labelId='event-guests'
                id='event-guests-select'
                onChange={e => setValues({ ...values, guests: e.target.value as string[]})}
                 size='small'
              >
                <MenuItem value='bruce'>Bruce</MenuItem>
                <MenuItem value='clark'>Clark</MenuItem>
                <MenuItem value='diana'>Diana</MenuItem>
                <MenuItem value='john'>John</MenuItem>
                <MenuItem value='barry'>Barry</MenuItem>
              </Select>
            </FormControl>
            <TextField
              rows={4}
              multiline
              fullWidth
              className='mbe-6'
              label='Description'
              id='event-description'
              value={values.description}
              onChange={e => setValues({ ...values, description: e.target.value })}
               size='small'
            />
            <Box className='flex items-center footer-btns gap-4'>
              <RenderSidebarFooter />
            </Box>
          </form>
        </Box>
      </ScrollWrapper>
    </Drawer>
  )
}

export default AddEventSidebar 