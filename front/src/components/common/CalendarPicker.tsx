import { useState, useMemo } from "react";
import { Label } from "../ui/label";
import { CalendarIcon } from "lucide-react";

interface CalendarPickerProps {
  value: Date | undefined;
  onChange: (date: Date) => void;
  error?: string;
  touched?: boolean;
  minDate?: Date;
  maxDate?: Date;
}

const MONTHS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

const DAYS = ["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"];

const YEARS = [2024, 2025, 2026, 2027];

export function CalendarPicker({
  value,
  onChange,
  error,
  touched,
  minDate,
  maxDate,
}: CalendarPickerProps) {
  const [viewDate, setViewDate] = useState(() => value || new Date());

  const computedMinDate = useMemo(() => {
    if (minDate) return minDate;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }, [minDate]);

  const computedMaxDate = useMemo(() => {
    if (maxDate) return maxDate;
    const max = new Date();
    max.setMonth(max.getMonth() + 2);
    return max;
  }, [maxDate]);

  const handleMonthChange = (month: number) => {
    const newDate = new Date(viewDate);
    newDate.setMonth(month);
    setViewDate(newDate);
    if (newDate >= computedMinDate && newDate <= computedMaxDate) {
      onChange(newDate);
    }
  };

  const handleYearChange = (year: number) => {
    const newDate = new Date(viewDate);
    newDate.setFullYear(year);
    setViewDate(newDate);
    if (newDate >= computedMinDate && newDate <= computedMaxDate) {
      onChange(newDate);
    }
  };

  const handleDayClick = (dayDate: Date) => {
    onChange(dayDate);
  };

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const currentDate = new Date(viewDate);
    currentDate.setHours(0, 0, 0, 0);
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days: Array<{ day: number; date: Date; isPast: boolean; isFuture: boolean; isSelected: boolean; isToday: boolean }> = [];
    
    // Empty days at the start
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: 0, date: new Date(), isPast: false, isFuture: false, isSelected: false, isToday: false });
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(year, month, day);
      dayDate.setHours(0, 0, 0, 0);
      
      const isPast = dayDate < today;
      const isFuture = dayDate > computedMaxDate;
      
      days.push({
        day,
        date: dayDate,
        isPast,
        isFuture: isFuture || dayDate > computedMaxDate,
        isSelected: value ? dayDate.getTime() === new Date(value).setHours(0, 0, 0, 0) : false,
        isToday: dayDate.getTime() === today.getTime(),
      });
    }
    
    return days;
  }, [viewDate, value, computedMaxDate]);

  return (
    <div className="space-y-2">
      <Label className="text-base font-semibold text-[#000080]">
        Date Préférée *
      </Label>
      
      {/* Month and Year Selection */}
      <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-t-lg border border-b-0 border-gray-200">
        <select
          title="Mois"
          value={viewDate.getMonth()}
          onChange={(e) => handleMonthChange(parseInt(e.target.value))}
          className="flex-1 p-2 border border-gray-300 rounded-md text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-[#000080]"
        >
          {MONTHS.map((month, idx) => (
            <option key={month} value={idx}>{month}</option>
          ))}
        </select>
        <select
          title="Année"
          value={viewDate.getFullYear()}
          onChange={(e) => handleYearChange(parseInt(e.target.value))}
          className="flex-1 p-2 border border-gray-300 rounded-md text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-[#000080]"
        >
          {YEARS.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>
      
      {/* Calendar Grid */}
      <div className="border border-gray-200 rounded-b-lg bg-white p-2">
        {/* Days Header */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {DAYS.map((day, idx) => (
            <div 
              key={day} 
              className={`text-center text-xs font-semibold py-1 ${idx === 0 ? "text-red-500" : "text-gray-500"}`}
            >
              {day}
            </div>
          ))}
        </div>
        
        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((dayInfo, idx) => {
            if (dayInfo.day === 0) {
              return <div key={`empty-${idx}`} className="h-8"></div>;
            }
            
            const isDisabled = dayInfo.isPast || dayInfo.isFuture;
            
            return (
              <button
                key={dayInfo.day}
                type="button"
                disabled={isDisabled}
                onClick={() => handleDayClick(dayInfo.date)}
                className={`h-8 w-full rounded text-sm font-medium transition-all flex items-center justify-center ${
                  dayInfo.isSelected 
                    ? "bg-[#000080] text-white shadow" 
                    : dayInfo.isToday 
                      ? "bg-blue-100 text-[#000080] border border-[#000080] font-bold text-xs"
                      : isDisabled 
                        ? "text-gray-300 cursor-not-allowed bg-gray-50 text-xs"
                        : "hover:bg-gray-100 text-gray-700 text-xs"
                }`}
              >
                {dayInfo.day}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Selected Date Display */}
      {value && (
        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded flex items-center gap-2 text-sm">
          <CalendarIcon className="w-4 h-4 text-green-600" />
          <span className="text-green-700 font-medium">
            {value.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </span>
        </div>
      )}
      
      {error && touched && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
}
