import { dateRangeType } from "@/components/myui/DateRangeSelector";

export const getformattedDate = (date: Date) => {
  return (
    date.getFullYear() +
    "-" +
    String(date.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(date.getDate()).padStart(2, "0")
  );
};

export const getDatesByRange = (range: dateRangeType["dateRange"]) => {
  const currentDate = new Date();
  let startDate: Date, endDate: Date;

  if (range === "today") {
    startDate = new Date(currentDate);
    endDate = new Date(currentDate);
  } else if (range === "7 days") {
    startDate = new Date();
    startDate.setDate(currentDate.getDate() - 7);
    endDate = new Date();
  } else if (range === "1 month") {
    startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    endDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );
  } else if (range === "6 month") {
    startDate = new Date(currentDate);
    startDate.setMonth(currentDate.getMonth() - 5);
    startDate.setDate(1);
    endDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );
  } else if (range === "1 year") {
    startDate = new Date(currentDate.getFullYear(), 0, 1);
    endDate = new Date(currentDate.getFullYear(), 11, 31);
  } else {
    throw new Error("Invalid date range provided");
  }

  return [getformattedDate(startDate), getformattedDate(endDate)];
};
