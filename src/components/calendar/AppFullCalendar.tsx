import { styled } from '@mui/material/styles'
import type { Theme } from '@mui/material/styles'

const AppFullCalendar = styled('div')(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  '& .fc': {
    zIndex: 1,

    '.fc-col-header, .fc-daygrid-body, .fc-scrollgrid-sync-table, .fc-timegrid-body, .fc-timegrid-body table': {
      width: '100% !important'
    },

    // Toolbar
    '& .fc-toolbar': {
      flexWrap: 'wrap',
      flexDirection: 'row !important',
      '&.fc-header-toolbar': {
        gap: theme.spacing(2),
        marginBottom: theme.spacing(4),
        [theme.breakpoints.down('md')]: {
           marginBottom: theme.spacing(4)
        }
      },
      '& .fc-button-group:has(.fc-next-button)': {
        marginInlineStart: theme.spacing(2)
      },
      '.fc-prev-button, & .fc-next-button': {
        display: 'flex',
        backgroundColor: 'transparent',
        padding: theme.spacing(0.75, 1.5),
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius,
        '& .fc-icon': {
          color: theme.palette.text.secondary,
          fontSize: '1.25rem'
        },
        '&:hover, &:active, &:focus': {
          boxShadow: 'none !important',
          backgroundColor: 'transparent !important'
        }
      },
      '& .fc-toolbar-chunk:first-of-type': {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        rowGap: theme.spacing(2),
        [theme.breakpoints.down('md')]: {
          '& div:first-of-type': {
            display: 'flex',
            alignItems: 'center'
          }
        }
      },
      '& .fc-button': {
        '&:active, .&:focus': {
          boxShadow: 'none'
        }
      },
       // View buttons and general button group styles
       '& .fc-button-group': {
         boxShadow: 'none',
         '& .fc-button': {
           boxShadow: 'none !important',
            padding: theme.spacing(0.75, 2.5),
           '&:not(:last-of-type)': {
             borderTopRightRadius: 0,
             borderBottomRightRadius: 0
           },
           '&:not(:first-of-type)': {
             borderTopLeftRadius: 0,
             borderBottomLeftRadius: 0
           }
         },
         '& .fc-button-primary': {
           backgroundColor: 'transparent',
           color: theme.palette.primary.main,
           borderColor: theme.palette.primary.main,
           '&.fc-button-active': {
             color: theme.palette.primary.contrastText,
             backgroundColor: theme.palette.primary.main,
             borderColor: theme.palette.primary.main
           },
           '&:hover': {
             backgroundColor: 'rgba(145, 85, 253, 0.04)'
           }
         }
       },
      '& .fc-toolbar-title': {
        marginInline: theme.spacing(2),
        ...theme.typography.h4
      }


    },

    // Calendar head & body common
    '& tbody td, & thead th': {
      borderColor: theme.palette.grey[400],
      '&.fc-col-header-cell': {
        borderLeft: 0,
        borderRight: 0,
        padding: theme.spacing(0.5, 1),
        '& .fc-col-header-cell-cushion': {
          ...theme.typography.body1,
          fontWeight: 500,
          textDecoration: 'none !important',
          textAlign: 'center',
          color: theme.palette.text.primary
        }
      },
      '&[role="presentation"]': {
        borderRightWidth: 0
      }
    },

    // Event Colors
    '& .fc-event': {
      '& .fc-event-title-container, .fc-event-main-frame': {
        lineHeight: 1
      },
      '&:not(.fc-list-event)': {
        '&.event-bg-primary': {
          border: 0,
          color: '#fff',
          backgroundColor: theme.palette.primary.main,
          '& .fc-event-title, & .fc-event-time': {
            ...theme.typography.caption,
            fontWeight: 500,
            color: '#fff',
            padding: 0
          }
        },
        '&.event-bg-success': {
          border: 0,
          color: '#fff',
          backgroundColor: theme.palette.success.main,
          '& .fc-event-title, & .fc-event-time': {
            ...theme.typography.caption,
            fontWeight: 500,
            color: '#fff',
            padding: 0
          }
        },
        '&.event-bg-error': {
          border: 0,
          color: '#fff',
          backgroundColor: theme.palette.error.main,
          '& .fc-event-title, & .fc-event-time': {
            ...theme.typography.caption,
            fontWeight: 500,
            color: '#fff',
            padding: 0
          }
        },
        '&.event-bg-warning': {
          border: 0,
          color: '#fff',
          backgroundColor: theme.palette.warning.main,
          '& .fc-event-title, & .fc-event-time': {
            ...theme.typography.caption,
            fontWeight: 500,
            color: '#fff',
            padding: 0
          }
        },
        '&.event-bg-info': {
          border: 0,
          color: '#fff',
          backgroundColor: theme.palette.info.main,
          '& .fc-event-title, & .fc-event-time': {
            ...theme.typography.caption,
            fontWeight: 500,
            color: '#fff',
            padding: 0
          }
        }
      }
    },

    '& .fc-view-harness': {
      minHeight: '650px',
      margin: 0,
      width: '100%',
       [theme.breakpoints.down('md')]: {
           margin: 0,
           width: '100%',
       }
    },

    // Calendar Head
    '& .fc-col-header': {
      '& .fc-col-header-cell': {
        fontSize: '.875rem',
        color: theme.palette.text.primary,
        '& .fc-col-header-cell-cushion': {
          ...theme.typography.body1,
          fontWeight: 500,
          padding: theme.spacing(1, 0),
          textDecoration: 'none !important',
          textAlign: 'center',
        }
      }
    },

    // Daygrid
    '& .fc-scrollgrid-section-liquid > td': {
      borderBottom: 0
    },
    '& .fc-daygrid-event-harness': {
      '& .fc-event': {
        padding: theme.spacing(0.5, 1),
        borderRadius: theme.shape.borderRadius,
      },
      '&:not(:last-of-type)': {
        marginBottom: theme.spacing(0.5)
      }
    },
     '& .fc-daygrid-day-number': {
         padding: theme.spacing(0.5, 1.5),
         color: theme.palette.text.disabled,
     },
    '& .fc-daygrid-day-bottom': {
      marginTop: theme.spacing(1.2)
    },
    '& .fc-daygrid-day': {
      padding: 0,
      '& .fc-daygrid-day-top': {
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: theme.spacing(1.5),
      }
    },
    '& .fc-scrollgrid': {
      borderColor: theme.palette.grey[400]
    },
    '& .fc-scrollgrid-sync-inner': {
      border: 'none',
    },
    '& .fc-scrollgrid table': {
      border: 'none',
    },
    '& .fc-day-past, & .fc-day-future': {
      '&.fc-daygrid-day-number': {
        color: theme.palette.text.disabled
      }
    },
    '& .fc-daygrid-day-events': {
      marginTop: theme.spacing(2)
    },

    // more events button
    '& .fc-daygrid-more-link': {
      ...theme.typography.caption,
      textDecoration: 'none !important',
      fontWeight: 500,
      color: theme.palette.primary.main,
      marginTop: theme.spacing(1)
    },

    // All Views Event
    '& .fc-daygrid-day-number, & .fc-timegrid-slot-label-cushion, & .fc-list-event-time': {
      textDecoration: 'none !important',
      color: `${theme.palette.text.primary} !important`
    },
    '& .fc-day-today:not(.fc-popover)': {
      backgroundColor: theme.palette.action.selected,
    },

    // Media Queries
    [theme.breakpoints.up('md')]: {
      '& .fc-sidebarToggle-button': {
        display: 'none'
      },
      '& .fc-toolbar-title': {
        marginLeft: 0
      }
    },

    // React Datepicker overrides
    '& .react-datepicker-wrapper': {
        width: '100%'
    },
    '& .react-datepicker': {
        border: 'none',
        padding: theme.spacing(2),
        '& .react-datepicker__month': {
            border: 'none',
        },
         '& .react-datepicker__header': {
            backgroundColor: 'transparent',
            borderBottom: 'none',
            padding: theme.spacing(1, 0),
             '& .react-datepicker__current-month': {
                 ...theme.typography.body1,
                 fontWeight: 500,
                 color: theme.palette.text.primary
             },
             '& .react-datepicker__navigation': {
                 top: theme.spacing(2),
                 lineHeight: 1,
                  '& .react-datepicker__navigation-icon::before, & .react-datepicker__navigation-icon--previous::before': {
                     borderColor: theme.palette.text.secondary + ' !important',
                      fontSize: '1.25rem',
                      transform: 'translateY(-50%) !important',
                  },
                  '&.react-datepicker__navigation--previous': {
                     left: theme.spacing(2.5),
                  },
                  '&.react-datepicker__navigation--next': {
                      right: theme.spacing(2.5),
                  },
             },
              '& .react-datepicker__day-names': {
                  '& .react-datepicker__day-name': {
                      ...theme.typography.caption,
                      margin: 0,
                      color: theme.palette.text.secondary
                  }
              }
         },

        '& .react-datepicker__day': {
            // default day styles
            margin: 0,
            width: theme.spacing(4.5), // Adjust width
            height: theme.spacing(4.5), // Adjust height
            lineHeight: theme.spacing(4.5), // Center text vertically
            color: theme.palette.text.primary,
            '&:hover': {
                 backgroundColor: theme.palette.action.hover
            },
             '&.react-datepicker__day--selected, &.react-datepicker__day--in-selecting-range, &.react-datepicker__day--in-range': {
                 borderRadius: '50%',
                 backgroundColor: theme.palette.primary.main,
                 color: theme.palette.primary.contrastText,
             },
             '&.react-datepicker__day--keyboard-selected': {
                 backgroundColor: theme.palette.action.selected
             },
             '&.react-datepicker__day--outside-month': {
                 color: theme.palette.text.disabled
             },
             '&.react-datepicker__day--today': {
                 fontWeight: 500,
             }
        }

    }
  }
}))

export default AppFullCalendar 