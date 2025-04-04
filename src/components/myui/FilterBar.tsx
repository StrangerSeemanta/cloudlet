import { useState } from "react";
import { MdDone } from "react-icons/md";
import "react-day-picker/style.css";
import { Funnel } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Input } from "../ui/input";
import { format, parseISO } from "date-fns";
import { Button } from "../ui/button";
import { twMerge } from "tailwind-merge";
import { DayPicker } from "react-day-picker";
import DateRangeSelector, { dateRangeType } from "./DateRangeSelector";

export interface FiltersType {
  date: Date | null;
  byStatus: ("paid" | "pending")[] | null;
}
interface FilterBarProps {
  onSearch: (searchValue: string) => void;
  onDateRangeChanged?: (days: dateRangeType["dateRange"]) => void;

  onFilterApply?: ({ date }: FiltersType) => void;
  classNames?: {
    themeColor?: string;
  };
}
const FilterBar = ({
  onSearch,
  onFilterApply,
  onDateRangeChanged,
  classNames,
}: FilterBarProps) => {
  const [search, setSearch] = useState("");
  const [date, selectDate] = useState<Date>(new Date());
  const [month, setMonth] = useState<Date>(new Date()); // Add a state for the displayed month

  const [byStatus, setByStatus] = useState<("paid" | "pending")[] | null>(null);
  const [drawerOpen, openDrawer] = useState<boolean>(false);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = parseISO(e.target.value); // Convert string to Date
    if (!isNaN(newDate.getTime())) {
      selectDate(newDate);
      setMonth(newDate);
    }
  };

  return (
    <div className="flex flex-col items-start md:flex-row md:items-center min-h-16 w-full bg-transparent gap-3 p-2">
      {/* Search Bar */}
      <div className="flex w-full gap-2 items-center">
        <input
          type="search"
          id="addedProduct_search"
          name="addedProduct_search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            onSearch(e.target.value);
          }}
          placeholder="Search Products Here"
          className="outline-none p-2 border-2 max-w-lg transition rounded-sm flex-1 border-gray-700/30 focus:border-rose-500/70 focus-visible:ring-rose-600/40 focus-visible:ring-2"
        />
        <button
          onClick={() => onSearch(search)}
          className={twMerge(
            "p-2 px-4 bg-rose-500 text-white outline-none transition rounded-sm hover:bg-rose-700",
            classNames && classNames.themeColor && classNames.themeColor
          )}
        >
          Search
        </button>
      </div>

      <div className="flex items-center space-x-4">
        {onDateRangeChanged && (
          <DateRangeSelector
            onDateRangeSelect={(days) => onDateRangeChanged(days)}
          />
        )}
        {/* Filter Button with Dropdown */}

        {onFilterApply && (
          <Drawer
            direction={"bottom"}
            open={drawerOpen}
            onOpenChange={openDrawer}
          >
            <DrawerTrigger asChild>
              <Button
                size={"lg"}
                variant={"ghost"}
                className="p-2 flex gap-2 px-4 transition  outline-none border rounded-sm "
              >
                Filter <Funnel className="w-5 h-5" />
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader className="text-left">
                <DrawerTitle className="text-2xl font-medium">
                  Filters
                </DrawerTitle>
                <DrawerDescription>
                  Select options and apply to sort your data
                </DrawerDescription>
              </DrawerHeader>
              <div className="p-4 flex flex-col md:flex-row justify-between overflow-y-auto">
                <div>
                  <h1 className="text-2xl font-bold font-stretch-extra-condensed">
                    Select A Date
                  </h1>
                  <Input
                    type="date"
                    className="p-3 max-w-xs w-xs font-bold mt-3"
                    value={date ? format(date, "yyyy-MM-dd") : undefined}
                    onChange={handleInputChange}
                  />
                  <h1 className="text-2xl mt-5 font-bold font-stretch-extra-condensed">
                    By Payment Status
                  </h1>
                  <div className="flex gap-2 mt-3">
                    <div
                      onClick={() => {
                        setByStatus((prev) => {
                          const updatedStatus = prev ?? [];
                          if (updatedStatus.includes("paid")) {
                            // Remove "pending" if it exists
                            return updatedStatus.filter(
                              (status) => status !== "paid"
                            );
                          } else {
                            // Add "pending" if it doesn't exist
                            return [...updatedStatus, "paid"];
                          }
                        });
                      }}
                      className="px-5 py-2 flex justify-between items-center gap-2 hover:contrast-75 cursor-pointer text-md font-semibold rounded-full capitalize bg-green-200 text-green-800"
                    >
                      paid{" "}
                      {byStatus?.includes("paid") && <span>{<MdDone />}</span>}
                    </div>
                    <div
                      onClick={() => {
                        setByStatus((prev) => {
                          const updatedStatus = prev ?? [];
                          if (updatedStatus.includes("pending")) {
                            // Remove "pending" if it exists
                            return updatedStatus.filter(
                              (status) => status !== "pending"
                            );
                          } else {
                            // Add "pending" if it doesn't exist
                            return [...updatedStatus, "pending"];
                          }
                        });
                      }}
                      className="px-5 flex justify-between items-center gap-2 hover:contrast-75 cursor-pointer py-2 text-md font-semibold rounded-full capitalize bg-yellow-200 text-yellow-800"
                    >
                      pending{" "}
                      {byStatus?.includes("pending") && (
                        <span>{<MdDone />}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <DayPicker
                    animate
                    mode="single"
                    showOutsideDays={false}
                    selected={date ? date : undefined}
                    className="md:scale-80"
                    captionLayout="dropdown"
                    endMonth={new Date(2040, 11)}
                    month={month}
                    onSelect={(e) => {
                      if (e) {
                        selectDate(e);
                        setMonth(e);
                      }
                    }}
                  />
                </div>
              </div>
              <DrawerFooter>
                <Button
                  onClick={() => {
                    openDrawer(false);

                    onFilterApply({
                      date: date,
                      byStatus: byStatus,
                    });
                  }}
                >
                  Apply Filter
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
