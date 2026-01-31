import { memo, useMemo, useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Coins, Circle } from 'lucide-react';
import clsx from 'clsx';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
} from 'date-fns';
import './PayoutCalendar.css';

interface PayoutEvent {
  id: number;
  circleName: string;
  date: Date;
  amount: number;
  isReceiving: boolean;
  color?: string;
}

interface PayoutCalendarProps {
  /** Array of payout events to display */
  events: PayoutEvent[];
  /** Callback when a day is clicked */
  onDayClick?: (date: Date, events: PayoutEvent[]) => void;
  /** Additional class name */
  className?: string;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f97316', '#14b8a6', '#84cc16'];

/**
 * PayoutCalendar Component
 * 
 * Calendar view showing upcoming payout dates for all circles.
 * Helps users visualize when they need to contribute or will receive.
 */
const PayoutCalendar = memo(function PayoutCalendar({
  events,
  onDayClick,
  className
}: PayoutCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const days = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentMonth]);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, PayoutEvent[]>();
    events.forEach((event, index) => {
      const key = format(event.date, 'yyyy-MM-dd');
      const existing = map.get(key) || [];
      map.set(key, [...existing, { ...event, color: event.color || COLORS[index % COLORS.length] }]);
    });
    return map;
  }, [events]);

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    const dayEvents = eventsByDate.get(format(date, 'yyyy-MM-dd')) || [];
    onDayClick?.(date, dayEvents);
  };

  const selectedEvents = selectedDate 
    ? eventsByDate.get(format(selectedDate, 'yyyy-MM-dd')) || []
    : [];

  return (
    <div className={clsx('payout-calendar', className)}>
      <div className="payout-calendar__header">
        <button 
          className="payout-calendar__nav" 
          onClick={handlePrevMonth}
          aria-label="Previous month"
        >
          <ChevronLeft size={20} />
        </button>
        <h3 className="payout-calendar__month">
          <Calendar size={18} />
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <button 
          className="payout-calendar__nav" 
          onClick={handleNextMonth}
          aria-label="Next month"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="payout-calendar__weekdays">
        {WEEKDAYS.map(day => (
          <div key={day} className="payout-calendar__weekday">
            {day}
          </div>
        ))}
      </div>

      <div className="payout-calendar__grid">
        {days.map(day => {
          const dayKey = format(day, 'yyyy-MM-dd');
          const dayEvents = eventsByDate.get(dayKey) || [];
          const hasEvents = dayEvents.length > 0;
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const hasReceiving = dayEvents.some(e => e.isReceiving);

          return (
            <button
              key={dayKey}
              className={clsx(
                'payout-calendar__day',
                !isCurrentMonth && 'payout-calendar__day--outside',
                isToday(day) && 'payout-calendar__day--today',
                isSelected && 'payout-calendar__day--selected',
                hasEvents && 'payout-calendar__day--has-events',
                hasReceiving && 'payout-calendar__day--receiving'
              )}
              onClick={() => handleDayClick(day)}
            >
              <span className="payout-calendar__day-number">
                {format(day, 'd')}
              </span>
              {hasEvents && (
                <div className="payout-calendar__dots">
                  {dayEvents.slice(0, 3).map((event, i) => (
                    <span
                      key={event.id}
                      className="payout-calendar__dot"
                      style={{ backgroundColor: event.color }}
                    />
                  ))}
                  {dayEvents.length > 3 && (
                    <span className="payout-calendar__more">+{dayEvents.length - 3}</span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {selectedDate && selectedEvents.length > 0 && (
        <div className="payout-calendar__events">
          <h4 className="payout-calendar__events-title">
            {format(selectedDate, 'EEEE, MMMM d')}
          </h4>
          <ul className="payout-calendar__events-list">
            {selectedEvents.map(event => (
              <li 
                key={event.id} 
                className={clsx(
                  'payout-calendar__event',
                  event.isReceiving && 'payout-calendar__event--receiving'
                )}
              >
                <Circle size={8} fill={event.color} stroke="none" />
                <span className="payout-calendar__event-name">{event.circleName}</span>
                <span className="payout-calendar__event-amount">
                  <Coins size={14} />
                  {event.isReceiving ? '+' : '-'}{event.amount} STX
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="payout-calendar__legend">
        <div className="payout-calendar__legend-item">
          <span className="payout-calendar__legend-dot payout-calendar__legend-dot--contribute" />
          <span>Contribute</span>
        </div>
        <div className="payout-calendar__legend-item">
          <span className="payout-calendar__legend-dot payout-calendar__legend-dot--receive" />
          <span>Receive Payout</span>
        </div>
      </div>
    </div>
  );
});

export { PayoutCalendar };
export type { PayoutEvent };
export default PayoutCalendar;
