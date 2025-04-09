import { Fragment, useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TbReload } from "react-icons/tb";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import { SoldProductDataType } from "@/firebase/SoldProductFirebase";
import { toast } from "sonner";

import { twMerge } from "tailwind-merge";
import FilterBar, { FiltersType } from "@/components/myui/FilterBar";

import { format } from "date-fns";
import { getDatesByRange } from "@/utils/getDateByRange";
import { dateRangeType } from "@/components/myui/DateRangeSelector";
import { getDataByRangeFirebase } from "@/firebase/getDataByRangeFirebase";

import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

export default function SalePage() {
  const navigate = useNavigate();
  const [dateRange, setDateRange] =
    useState<dateRangeType["dateRange"]>("7 days");
  const [soldProductData, setSoldProductData] = useState<
    SoldProductDataType[] | null
  >(null);

  const [filteredSoldProductData, setFilteredSoldProductData] = useState<
    SoldProductDataType[] | null
  >(soldProductData);
  const [loadingData, setLoadingData] = useState(true);

  const fetchData = useCallback(async () => {
    setLoadingData(true);
    try {
      const [fromDate, toDate] = getDatesByRange(dateRange);

      const data = (await getDataByRangeFirebase(
        "soldProductData",
        "soldAt",
        fromDate,
        toDate
      )) as SoldProductDataType[];
      if (!data) return setLoadingData(false);
      const sortedData = data
        .filter((val) => val)
        .sort((a, b) => b.timestamp - a.timestamp);
      setSoldProductData(data);
      setFilteredSoldProductData(sortedData);
      setLoadingData(false);
    } catch (error) {
      console.error("Error fetching product data:", error);
      toast.error("Failed To Get Data. Try Again or Reload", {
        description: String(error),
      });
      setLoadingData(false);
    }
  }, [dateRange]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearchProduct = (search: string) => {
    if (!soldProductData) return;
    const searchedResult = soldProductData.filter((value) => {
      if (
        value.buyer_name.toLowerCase().includes(search.toLowerCase()) ||
        value.buyer_phoneNo.toLowerCase().includes(search.toLowerCase())
      ) {
        return value;
      }
    });

    setFilteredSoldProductData(searchedResult);
  };
  const handleFilters = ({ date, byStatus }: FiltersType) => {
    if (!soldProductData) return;
    if (date) {
      const dateStr = format(date, "yyyy-MM-dd");
      const filtered = soldProductData.filter((val) => val.soldAt === dateStr);

      setFilteredSoldProductData(filtered);
    }
    if (byStatus && byStatus.length >= 1 && filteredSoldProductData) {
      const filtered = filteredSoldProductData.filter((val) =>
        byStatus.includes(val.status)
      );
      setFilteredSoldProductData(filtered);
    }
  };

  return (
    <div className="p-2 space-y-6">
      <h2 className="text-xl font-bold">Sales History</h2>
      <Card className="relative pt-0 overflow-hidden transition rounded-sm gap-2">
        <CardHeader className="px-4 py-3 flex items-center justify-between bg-indigo-800 dark:bg-accent">
          <CardTitle className="text-xl px-0 font-bold text-white">
            Product Selling History
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
        <CardContent className="p-0 transition">
          <FilterBar
            onSearch={handleSearchProduct}
            onDateRangeChanged={(range) => setDateRange(range)}
            onFilterApply={handleFilters}
            classNames={{ themeColor: "bg-indigo-800 hover:bg-indigo-900" }}
          />
          {loadingData ? (
            <div className="h-40">
              <div className="px-3 py-4 space-y-4">
                <Skeleton className="h-8 bg-gray-300 w-4/5 rounded-full" />
                <Skeleton className="h-8 bg-gray-300 w-full rounded-full " />
                <Skeleton className="h-8 bg-gray-300 w-2/3 rounded-full" />
              </div>
            </div>
          ) : filteredSoldProductData && filteredSoldProductData.length >= 1 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4 py-2 text-left  text-gray-600 dark:text-destructive text-[0.9rem] font-bold capitalize">
                    Sale Id
                  </TableHead>

                  <TableHead className="px-4 py-2 text-left  text-gray-600 dark:text-destructive text-[0.9rem] font-bold capitalize">
                    Buyer Name
                  </TableHead>
                  <TableHead className="px-4 py-2 text-left  text-gray-600 dark:text-destructive text-[0.9rem] font-bold capitalize">
                    Buyer Number
                  </TableHead>

                  <TableHead className="px-4 py-2 text-left  text-gray-600 dark:text-destructive text-[0.9rem] font-bold capitalize">
                    Total
                  </TableHead>
                  <TableHead className="px-4 py-2 text-left  text-gray-600 dark:text-destructive text-[0.9rem] font-bold capitalize">
                    Date
                  </TableHead>
                  <TableHead className="px-4 py-2 text-left  text-gray-600 dark:text-destructive text-[0.9rem] font-bold capitalize">
                    Sold By
                  </TableHead>
                  <TableHead className="px-4 py-2 text-left  text-gray-600 dark:text-destructive text-[0.9rem] font-bold capitalize">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSoldProductData.map((sale, index) => (
                  <Fragment key={index}>
                    <TableRow
                      onClick={() =>
                        navigate(
                          `/sales/details/${encodeURIComponent(
                            sale.timestamp.toString()
                          )}`
                        )
                      }
                      className={twMerge(
                        "border-b relative hover:bg-primary/10 cursor-pointer group",
                        sale.status === "pending" && "bg-amber-100"
                      )}
                    >
                      <TableCell className="px-4 py-3 text-gray-800 dark:text-primary">
                        {sale.timestamp.toString()}
                      </TableCell>

                      <TableCell className="px-4 py-3 text-gray-800 dark:text-primary">
                        {sale.buyer_name}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-800 text-sm dark:text-primary">
                        {sale.buyer_phoneNo}
                      </TableCell>

                      <TableCell className="px-4 py-3 text-gray-800 dark:text-primary">
                        {sale.total_sold + " BDT"}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-800 dark:text-primary">
                        {String(sale.soldAt)}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-800 dark:text-primary">
                        {sale.seller_name}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-3 transition-all py-1 text-sm font-semibold rounded-full capitalize
                      ${
                        sale.status === "paid"
                          ? "bg-green-200 text-green-800 "
                          : "bg-yellow-300 text-yellow-800 "
                      }`}
                        >
                          {sale.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          ) : (
            <h1 className="text-center text-2xl text-gray-600 font-bold m-6">
              No History Found
            </h1>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
