import { dateRangeType } from "@/components/myui/DateRangeSelector";
import FilterBar, { FiltersType } from "@/components/myui/FilterBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getDataByRangeFirebase } from "@/firebase/getDataByRangeFirebase";
import { AddedProductTypes } from "@/firebase/ProductAddFirebase";
import { getDatesByRange } from "@/utils/getDateByRange";
import { format } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { TbReload } from "react-icons/tb";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export default function ProductsPage() {
  const [dateRange, setDateRange] =
    useState<dateRangeType["dateRange"]>("7 days");
  const [addedProductData, setAddedProductData] = useState<
    AddedProductTypes[] | null
  >(null);
  const [filteredData, setFilteredData] = useState<AddedProductTypes[] | null>(
    addedProductData
  );
  const [loadingData, setLoadingData] = useState(true);
  const fetchData = useCallback(async () => {
    setLoadingData(true);
    try {
      const [fromDate, toDate] = getDatesByRange(dateRange);

      const data = (await getDataByRangeFirebase(
        "addedProductData",
        "productAddedAt",
        fromDate,
        toDate
      )) as AddedProductTypes[];
      if (!data) return setLoadingData(false);
      const sortedData = data
        .filter((val) => val)
        .sort((a, b) => b.timestamp - a.timestamp);
      setAddedProductData(data);
      setFilteredData(sortedData);
      setLoadingData(false);
    } catch (error) {
      toast.error("Failed To Get Data. Try Again or Reload", {
        description: String(error),
      });
      console.error("Error fetching product data:", error);
      setLoadingData(false);
    }
  }, [dateRange]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  const handleSearchAddedProduct = (search: string) => {
    if (!addedProductData) return;
    const searchedResult = addedProductData.filter((value) => {
      if (
        value.productId.toLowerCase().includes(search.toLowerCase()) ||
        value.productName.toLowerCase().includes(search.toLowerCase())
      ) {
        return value;
      }
    });

    setFilteredData(searchedResult);
  };
  const handleFilters = ({ date }: FiltersType) => {
    if (!addedProductData) return;
    if (date) {
      const dateStr = format(date, "yyyy-MM-dd");
      const filtered = addedProductData.filter(
        (val) => val.productAddedAt === dateStr
      );
      setFilteredData(filtered);
    }
  };

  return (
    <div className="p-2 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col w-full justify-center gap-3 items-start">
        <h1 className="text-3xl font-bold">Products</h1>
        <Link to="add" className="w-full ">
          <Button
            size={"lg"}
            className="w-full rounded-sm py-6 bg-teal-600 shadow-md hover:bg-teal-700 text-lg"
          >
            Add New Product <FaArrowRight className="size-4 ml-2 " />
          </Button>
        </Link>
      </div>

      {/* Product List */}
      <Card className="relative pt-0 overflow-hidden rounded-sm gap-2">
        <CardHeader className="px-4 py-3 flex items-center justify-between bg-rose-600 dark:bg-accent">
          <CardTitle className="text-xl px-0 font-bold text-white">
            Product Buying History
          </CardTitle>
          <Button
            size={"icon"}
            variant={"ghost"}
            onClick={() => fetchData()}
            className="rounded-full  mr-7 text-white"
          >
            <TbReload
              className={twMerge("size-6", loadingData && "animate-spin")}
            />{" "}
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div>
            <FilterBar
              onDateRangeChanged={(range) => setDateRange(range)}
              onSearch={handleSearchAddedProduct}
              onFilterApply={handleFilters}
              classNames={{ themeColor: "bg-rose-600 hover:bg-rose-700" }}
            />
          </div>
          {loadingData ? (
            <div className="h-40">
              <div className="px-3 py-2 space-y-4">
                <Skeleton className="h-8 bg-gray-300 w-4/5 rounded-full" />
                <Skeleton className="h-8 bg-gray-300 w-full rounded-full " />
                <Skeleton className="h-8 bg-gray-300 w-2/3 rounded-full" />
              </div>
            </div>
          ) : filteredData && filteredData.length >= 1 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4 py-2 text-left  text-gray-600 dark:text-destructive text-[1rem] font-bold">
                    Product Id
                  </TableHead>
                  <TableHead className="px-4 py-2 text-left  text-gray-600 dark:text-destructive  font-bold">
                    Product Name
                  </TableHead>
                  <TableHead className="px-4 py-2 text-left  text-gray-600 dark:text-destructive font-bold">
                    Quantity
                  </TableHead>
                  <TableHead className="px-4 py-2 text-left  text-gray-600 dark:text-destructive  font-bold">
                    Buying Price
                  </TableHead>
                  <TableHead className="px-4 py-2 text-left  text-gray-600 dark:text-destructive  font-bold">
                    Total Price
                  </TableHead>
                  <TableHead className="px-4 py-2 text-left  text-gray-600 dark:text-destructive  font-bold">
                    Date Added
                  </TableHead>
                  <TableHead className="px-4 py-2 text-left  text-gray-600 dark:text-destructive  font-bold">
                    Added By
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((product, index) => (
                  <TableRow key={index} className="border-b hover:contrast-90">
                    <TableCell className="px-4 py-3 text-sm text-gray-800 dark:text-primary">
                      {product.productId}
                    </TableCell>
                    <TableCell className="px-4 capitalize py-3 text-sm text-gray-800 dark:text-primary">
                      {product.productName}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-800 dark:text-primary">
                      {product.quantity}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-800 dark:text-primary">
                      <span> {product.buyingPrice}</span>
                      <span className="ml-2">Taka</span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-800 dark:text-primary">
                      <span>
                        {Number(product.buyingPrice) * Number(product.quantity)}
                      </span>
                      <span className="ml-2">Taka</span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-800 dark:text-primary">
                      {String(product.productAddedAt)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-800 dark:text-primary">
                      {product.addedBy.name}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <h1 className="text-center text-2xl text-gray-600 font-bold m-6">
              No Product History Found
            </h1>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
