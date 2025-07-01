import React, { useState } from 'react';
import { Scheduler } from "@aldabil/react-scheduler";
import { ProcessedEvent } from "@aldabil/react-scheduler/types";
import { Card } from 'antd';
import { vi } from "date-fns/locale/vi";

export const INITIAL_EVENTS: ProcessedEvent[] = [
  {
    event_id: 1,
    title: "Sự kiện 1 (Đã vô hiệu hóa)",
    subtitle: "Sự kiện này đã bị vô hiệu hóa",
    start: new Date(new Date(new Date().setHours(9)).setMinutes(0)),
    end: new Date(new Date(new Date().setHours(10)).setMinutes(0)),
    disabled: true,
  },
  {
    event_id: 2,
    title: "Sự kiện 2",
    subtitle: "Sự kiện này có thể kéo thả",
    start: new Date(new Date(new Date().setHours(10)).setMinutes(0)),
    end: new Date(new Date(new Date().setHours(12)).setMinutes(0)),
    color: "#50b500",
  },
  {
    event_id: 3,
    title: "Sự kiện 3",
    subtitle: "Sự kiện này không thể chỉnh sửa",
    start: new Date(new Date(new Date().setHours(11)).setMinutes(0)),
    end: new Date(new Date(new Date().setHours(12)).setMinutes(0)),
    editable: false,
    deletable: false,
  },
  {
    event_id: 4,
    title: "Sự kiện 4",
    start: new Date(
      new Date(new Date(new Date().setHours(9)).setMinutes(30)).setDate(
        new Date().getDate() - 2
      )
    ),
    end: new Date(
      new Date(new Date(new Date().setHours(11)).setMinutes(0)).setDate(
        new Date().getDate() - 2
      )
    ),
    color: "#900000",
    allDay: true,
  },
  {
    event_id: 5,
    title: "Sự kiện 5",
    subtitle: "Sự kiện này có thể chỉnh sửa",
    start: new Date(
      new Date(new Date(new Date().setHours(10)).setMinutes(30)).setDate(
        new Date().getDate() - 2
      )
    ),
    end: new Date(
      new Date(new Date(new Date().setHours(14)).setMinutes(0)).setDate(
        new Date().getDate() - 2
      )
    ),
    editable: true,
  },
  {
    event_id: 6,
    title: "Sự kiện 6",
    subtitle: "Sự kiện cả ngày",
    start: new Date(
      new Date(new Date(new Date().setHours(20)).setMinutes(30)).setDate(
        new Date().getDate() - 3
      )
    ),
    end: new Date(new Date(new Date().setHours(23)).setMinutes(0)),
    allDay: true,
    sx: { color: "purple" },
  },
  {
    event_id: 7,
    title: "Sự kiện 7 (Không thể kéo thả)",
    subtitle: "Sự kiện này không thể kéo thả",
    start: new Date(
      new Date(new Date(new Date().setHours(10)).setMinutes(30)).setDate(
        new Date().getDate() - 3
      )
    ),
    end: new Date(
      new Date(new Date(new Date().setHours(14)).setMinutes(30)).setDate(
        new Date().getDate() - 3
      )
    ),
    draggable: false,
    color: "#8000cc",
  },
  {
    event_id: 8,
    title: "Sự kiện 8",
    subtitle: "Sự kiện này có màu tùy chỉnh",
    start: new Date(
      new Date(new Date(new Date().setHours(10)).setMinutes(30)).setDate(
        new Date().getDate() + 30
      )
    ),
    end: new Date(
      new Date(new Date(new Date().setHours(14)).setMinutes(30)).setDate(
        new Date().getDate() + 30
      )
    ),
    color: "#8000cc",
  },
  {
    event_id: 9,
    title: "Sự kiện 9",
    start: new Date(
      new Date(new Date(new Date().setHours(10)).setMinutes(0)).setDate(
        new Date().getDate() + 1
      )
    ),
    end: new Date(
      new Date(new Date(new Date().setHours(11)).setMinutes(0)).setDate(
        new Date().getDate() + 1
      )
    ),
  },
  {
    event_id: 10,
    title: "Sự kiện 10",
    start: new Date(new Date(new Date().setHours(14)).setMinutes(15)),
    end: new Date(new Date(new Date().setHours(14)).setMinutes(45)),
    color: "#dc4552",
  },
];

const CalendarScreen: React.FC = () => {
  const [events, setEvents] = useState<ProcessedEvent[]>(INITIAL_EVENTS);

  const checkOverlap = (newEvent: ProcessedEvent, allEvents: ProcessedEvent[]) => {
    const newEventStartHour = newEvent.start.getHours();
    const newEventEndHour = newEvent.end.getHours(); 

    const eventsOnSameDay = allEvents.filter(event =>
      event.start.toDateString() === newEvent.start.toDateString()
    );

    for (let hour = newEventStartHour; hour < newEventEndHour; hour++) {
      const slotStart = new Date(newEvent.start.getFullYear(), newEvent.start.getMonth(), newEvent.start.getDate(), hour, 0, 0);
      const slotEnd = new Date(newEvent.start.getFullYear(), newEvent.start.getMonth(), newEvent.start.getDate(), hour + 1, 0, 0);

      let countInSlot = 0;
      
      if (
        (newEvent.start.getTime() < slotEnd.getTime()) &&
        (newEvent.end.getTime() > slotStart.getTime())
      ) {
        countInSlot++;
      }

      for (const existingEvent of eventsOnSameDay) {
        if (existingEvent.event_id === newEvent.event_id) {
          continue;
        }

        if (
          (existingEvent.start.getTime() < slotEnd.getTime()) &&
          (existingEvent.end.getTime() > slotStart.getTime())
        ) {
          countInSlot++;
        }
      }

      if (countInSlot > 2) {
        return true; 
      }
    }

    return false; 
  };

  const handleConfirm = async (event: ProcessedEvent, action: 'edit' | 'create') => {
    if (checkOverlap(event, events)) {
      console.log("Không thể thêm/sửa sự kiện: tối đa 2 sự kiện cho mỗi khung giờ trong ngày.");
      return event; // Return the original event if validation fails
    }

    let updatedEvent = { ...event };
    if (action === 'create') {
      updatedEvent = { ...event, event_id: events.length > 0 ? Math.max(...events.map(e => e.event_id as number)) + 1 : 1 };
      setEvents((prev) => [...prev, updatedEvent]);
    } else if (action === 'edit') {
      setEvents((prev) => prev.map((e) => (e.event_id === event.event_id ? updatedEvent : e)));
    }
    return updatedEvent;
  };

  const handleEventDrop = async (dragEvent: React.DragEvent<HTMLButtonElement>, droppedOn: Date, updatedEvent: ProcessedEvent, originalEvent: ProcessedEvent) => {
    if (checkOverlap(updatedEvent, events)) {
      console.log("Không thể di chuyển sự kiện: tối đa 2 sự kiện cho mỗi khung giờ trong ngày.");
      return originalEvent;
    }

    setEvents((prev) =>
      prev.map((e) => (e.event_id === updatedEvent.event_id ? updatedEvent : e))
    );
    return updatedEvent;
  };

  return (
    <div style={{ 
      height: '100vh', 
      width: '100%',
      position: 'relative',
      overflow: 'hidden',
      padding: '24px'
    }}>
      <Card>
        <Scheduler
          events={events}
          view="month"
          selectedDate={new Date()}
          navigation={true}
          height={700}
          locale={vi}
          month={{
            weekDays: [0, 1, 2, 3, 4, 5, 6],
            weekStartOn: 1,
            startHour: 8,
            endHour: 20,
            navigation: true,
            disableGoToDay: false
          }}
          translations={{
            navigation: {
              month: "Tháng",
              week: "Tuần",
              day: "Ngày",
              today: "Hôm nay",
              agenda: "Lịch trình"
            },
            form: {
              addTitle: "Thêm sự kiện",
              editTitle: "Chỉnh sửa sự kiện",
              confirm: "Xác nhận",
              delete: "Xóa",
              cancel: "Hủy"
            },
            event: {
              title: "Tiêu đề",
              subtitle: "Mô tả",
              start: "Bắt đầu",
              end: "Kết thúc",
              allDay: "Cả ngày"
            },
            validation: {
              required: "Bắt buộc",
              invalidEmail: "Email không hợp lệ",
              onlyNumbers: "Chỉ được nhập số",
              min: "Tối thiểu {{min}} ký tự",
              max: "Tối đa {{max}} ký tự"
            },
            moreEvents: "Xem thêm...",
            noDataToDisplay: "Không có dữ liệu",
            loading: "Đang tải...",
          }}
          onEventClick={(event) => {
            console.log("Event clicked:", event);
          }}
          onEventDrop={handleEventDrop}
          onCellClick={(event) => {
            console.log("Cell clicked:", event);
          }}
          onConfirm={handleConfirm}
          stickyNavigation={true}
          dialogMaxWidth="md"
          hourFormat="24"
        />
      </Card>
    </div>
  );
};

export default CalendarScreen;