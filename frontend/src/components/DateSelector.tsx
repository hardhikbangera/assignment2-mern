import React from "react";

interface DateSelectorProps {
  dates: string[];
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({
  dates,
  selectedDate,
  onSelectDate,
}) => {
  return (
    <div className="flex flex-wrap gap-3">
      {dates.map((date) => {
        const isSelected = selectedDate === date;
        return (
          <button
            key={date}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSelectDate(date);
            }}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              isSelected
                ? "bg-yellow-400 border-yellow-500 font-semibold"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            {date}
          </button>
        );
      })}
    </div>
  );
};

export default DateSelector;
