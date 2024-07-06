import { useState, useEffect, FC } from "react";
import { format, addDays, startOfWeek, isBefore, isAfter, getDay, Day } from 'date-fns';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import DateButton from "@/components/dateButton";

interface WeekNavigationProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

const WeekNavigation: FC<WeekNavigationProps> = ({ selectedDate, setSelectedDate }) => {
  const today = new Date();
  const weekStartsOn: Day = getDay(today) as Day;
  const [weekStart, setWeekStart] = useState(() => startOfWeek(selectedDate, { weekStartsOn: weekStartsOn }));

  useEffect(() => {
    if (isBefore(selectedDate, today)) {
      setSelectedDate(today);
    }
  }, []);

  useEffect(() => {
    setWeekStart(startOfWeek(selectedDate, { weekStartsOn: weekStartsOn }));
  }, [selectedDate]);

  const handlePrevWeek = () => {
    const newWeekStart = addDays(weekStart, -7);
    if (!isBefore(newWeekStart, startOfWeek(today, { weekStartsOn: weekStartsOn }))) {
      setWeekStart(newWeekStart);
      setSelectedDate(newWeekStart);
    }
  };

  const handleNextWeek = () => {
    const newWeekStart = addDays(weekStart, 7);
    const maxDate = addDays(today, 21);
    if (!isAfter(newWeekStart, startOfWeek(maxDate, { weekStartsOn: weekStartsOn }))) {
      setWeekStart(newWeekStart);
      setSelectedDate(newWeekStart);
    }
  };

  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="flex justify-between items-center mb-4">
      <Button variant="ghost" size="icon" onClick={handlePrevWeek}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <div className="flex-1 grid grid-cols-7 gap-1">
        {weekDates.map((date) => (
          <DateButton
            key={date.toISOString()}
            date={date}
            isSelected={format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')}
            onClick={() => setSelectedDate(date)}
          />
        ))}
      </div>
      <Button variant="ghost" size="icon" onClick={handleNextWeek}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default WeekNavigation;