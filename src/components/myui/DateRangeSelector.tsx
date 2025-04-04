import { useState } from "react";
import { Select } from "../ui/select";
import { Fragment } from "react/jsx-runtime";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
export interface dateRangeType {
  dateRange: "today" | "7 days" | "1 month" | "6 month" | "1 year";
}
export interface DateRangeSelector {
  onDateRangeSelect: (
    dateRange: "today" | "7 days" | "1 month" | "6 month" | "1 year"
  ) => void;
}
function DateRangeSelector({ onDateRangeSelect }: DateRangeSelector) {
  const [dateRange, setDateRange] =
    useState<dateRangeType["dateRange"]>("7 days");

  const handleDateRangeFetch = (days: dateRangeType["dateRange"]) => {
    setDateRange(days);
    onDateRangeSelect(days);
  };
  return (
    <Fragment>
      <div className="">
        <Select
          defaultValue="7 days"
          value={dateRange}
          onValueChange={(value: dateRangeType["dateRange"]) =>
            handleDateRangeFetch(value)
          }
        >
          <SelectTrigger className="w-40 border-2 text-md font-semibold bg-blue-50 text-blue-700">
            <SelectValue placeholder="Select Date Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"today"}>Today</SelectItem>
            <SelectItem value={"7 days"}>Last 7 days</SelectItem>
            <SelectItem value={"1 month"}>Last 1 month</SelectItem>
            <SelectItem value={"6 month"}>Last 6 month</SelectItem>
            <SelectItem value={"1 year"}>Last 1 year</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </Fragment>
  );
}

export default DateRangeSelector;
