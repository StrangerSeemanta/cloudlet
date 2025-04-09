import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { dateRangeType } from "@/components/myui/DateRangeSelector";
import { ActivityDataType } from "@/firebase/HandleActivityFirebase";
import FilterBar from "@/components/myui/FilterBar";
import { getDatesByRange } from "@/utils/getDateByRange";
import { getDataByRangeFirebase } from "@/firebase/getDataByRangeFirebase";
import { Button } from "@/components/ui/button";
import { TbReload } from "react-icons/tb";
import { twMerge } from "tailwind-merge";
import { Skeleton } from "@/components/ui/skeleton";

const FinancialActivityPage = () => {
  const [dateRange, setDateRange] =
    useState<dateRangeType["dateRange"]>("7 days");

  const [financialData, setFinancialData] = useState<ActivityDataType[] | null>(
    null
  );
  const [loadingData, setLoadingData] = useState(true);
  const [filteredFinancialData, setFilteredFinancialData] = useState<
    ActivityDataType[] | null
  >(financialData);
  const fetchData = useCallback(async () => {
    setLoadingData(true);
    try {
      const [fromDate, toDate] = getDatesByRange(dateRange);
      const data = (await getDataByRangeFirebase(
        "activityData",
        "date",
        fromDate,
        toDate
      )) as ActivityDataType[];
      if (!data) return setLoadingData(false);
      const sortedData = data
        .filter((val) => val)
        .sort((a, b) => b.timestamp - a.timestamp);
      setFinancialData(data);
      setFilteredFinancialData(sortedData);
      setLoadingData(false);
    } catch (error) {
      console.error(error);
    }
  }, [dateRange]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearchActivity = (search: string) => {
    if (!financialData) return null;
    const searchedResult = financialData.filter((value) => {
      if (
        value.date.toString().toLowerCase().includes(search.toLowerCase()) ||
        value.type.toLowerCase().includes(search.toLowerCase()) ||
        value.description.toLowerCase().includes(search.toLowerCase())
      ) {
        return value;
      }
    });

    setFilteredFinancialData(searchedResult);
  };
  return (
    <div className="p-4 space-y-4">
      <Card className="  relative pt-0 bg-violet-50 overflow-hidden transition rounded-sm gap-2">
        <CardHeader className="px-4 py-3 flex items-center justify-between bg-violet-700 dark:bg-accent">
          <CardTitle className="text-xl px-0 font-bold text-white tracking-wide font-Nunito">
            Financial Activity
          </CardTitle>
          <Button
            size={"icon"}
            variant={"ghost"}
            onClick={() => fetchData()}
            className="rounded-full  mr-7 text-white"
          >
            <TbReload
              className={twMerge("size-6", loadingData && "animate-spin")}
            />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <FilterBar
            onSearch={handleSearchActivity}
            onDateRangeChanged={(range) => setDateRange(range)}
          />
          {loadingData ? (
            <div className="p-4 space-y-4">
              {" "}
              <Skeleton className="h-8 bg-gray-200 w-4/5 rounded-full" />
              <Skeleton className="h-8 bg-gray-200 w-full rounded-full " />
              <Skeleton className="h-8 bg-gray-200 w-2/3 rounded-full" />
            </div>
          ) : filteredFinancialData && filteredFinancialData.length >= 1 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4 py-2 text-left  text-gray-600 dark:text-destructive text-[0.9rem] font-bold capitalize">
                    Type
                  </TableHead>
                  <TableHead className="px-4 py-2 text-left  text-gray-600 dark:text-destructive text-[0.9rem] font-bold capitalize">
                    Description
                  </TableHead>
                  <TableHead className="px-4 py-2 text-left  text-gray-600 dark:text-destructive text-[0.9rem] font-bold capitalize">
                    Amount
                  </TableHead>
                  <TableHead className="px-4 py-2 text-left  text-gray-600 dark:text-destructive text-[0.9rem] font-bold capitalize">
                    Date
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFinancialData.map((item, idx) => (
                  <TableRow key={idx} className="border-b ">
                    <TableCell
                      className={twMerge(
                        "px-4 py-3 dark:text-primary capitalize whitespace-break-spaces break-words font-bold",
                        item.type.toLowerCase() === "added product" ||
                          item.type.toLowerCase() === "additional expense"
                          ? "text-red-500"
                          : item.type.toLowerCase() === "repaid pending"
                          ? "text-blue-500"
                          : "text-green-600"
                      )}
                    >
                      {item.type}
                    </TableCell>
                    <TableCell className="px-4 py-3 capitalize text-gray-800 dark:text-primary ">
                      <details>
                        <summary className="text-sm max-w-sm font-semibold text-gray-600 dark:text-primary cursor-pointer">
                          {item.description.length > 40
                            ? item.description.slice(0, 40)
                            : item.description}
                          {item.description.length > 40 && (
                            <span className="italic text-xs">
                              ...(show more)
                            </span>
                          )}
                        </summary>
                        <p className="text-xs max-w-xs text-gray-500 dark:text-primary whitespace-break-spaces break-words">
                          {item.description}
                        </p>
                      </details>
                    </TableCell>
                    <TableCell
                      className={twMerge(
                        "px-4 py-3 dark:text-primary whitespace-break-spaces break-words",
                        item.type.toLowerCase() === "added product" ||
                          item.type.toLowerCase() === "additional expense"
                          ? "text-red-500"
                          : item.type.toLowerCase() === "repaid pending"
                          ? "text-blue-500"
                          : "text-green-600"
                      )}
                    >
                      {item.amount < 0 ? "-" : ""}
                      {Math.abs(item.amount)} BDT
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-800 dark:text-primary whitespace-break-spaces break-words">
                      {item.date.toString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <h1 className="text-center w-full text-lg text-gray-600 font-bold m-6">
              No Financial Activity Found In This Date Range. Please Change the
              Date Range or Add Some Financial Activity.
            </h1>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialActivityPage;
