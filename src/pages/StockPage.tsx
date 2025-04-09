import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getStockProduct, StockProduct } from "@/firebase/StockFirebase";
import FilterBar from "@/components/myui/FilterBar";
import { TbReload } from "react-icons/tb";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const StockPage = () => {
  const [products, setProducts] = useState<StockProduct[] | null>(null);

  const [filteredProducts, setFilteredProducts] = useState<
    StockProduct[] | null
  >(null);
  const [loadingData, setLoadingData] = useState(false);
  const fetchData = useCallback(async () => {
    setLoadingData(true);
    try {
      const data = await getStockProduct();
      if (!data) return setLoadingData(false);
      const sortedData = data
        .filter((val) => val)
        .sort((a, b) => b.timestamp - a.timestamp);
      setProducts(data);
      setFilteredProducts(sortedData);
      setLoadingData(false);
    } catch (error) {
      toast.error("Failed To Get Data. Try Again or Reload", {
        description: String(error),
      });
      console.error("Error fetching product data:", error);
      setLoadingData(false);
    }
  }, []);
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  const handleSearch = (search: string) => {
    if (!products) return;
    const searchedResult = products.filter((value) => {
      if (
        value.productId.toLowerCase().includes(search.toLowerCase()) ||
        value.productName.toLowerCase().includes(search.toLowerCase())
      ) {
        return value;
      }
    });

    setFilteredProducts(searchedResult);
  };

  return (
    <div className="p-2 lg:p-6">
      {/* Search Bar */}

      {/* Stock List */}
      <Card className="relative pt-0 overflow-hidden rounded-sm gap-2">
        <CardHeader className="px-4 py-3 flex items-center justify-between bg-green-600 dark:bg-accent">
          <CardTitle className="text-xl px-0 font-bold text-white">
            Stock Management
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
              onSearch={handleSearch}
              classNames={{ themeColor: "bg-green-600 hover:bg-green-700" }}
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
          ) : filteredProducts && filteredProducts.length >= 1 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4 py-2 text-left  text-gray-600 dark:text-destructive  font-bold">
                    Product Id
                  </TableHead>
                  <TableHead className="px-4 py-2 text-left  text-gray-600 dark:text-destructive  font-bold">
                    Product Name
                  </TableHead>
                  <TableHead className="px-4 py-2 text-left  text-gray-600 dark:text-destructive font-bold">
                    Total Added
                  </TableHead>
                  <TableHead className="px-4 py-2 text-left  text-gray-600 dark:text-destructive font-bold">
                    Total Sold
                  </TableHead>
                  <TableHead className="px-4 py-2 text-left  text-gray-600 dark:text-destructive font-bold">
                    Current Stock
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product, index) => (
                  <TableRow
                    key={index}
                    className={twMerge(
                      "border-b hover:contrast-80 select-text",
                      Number(product.currentStock) <= 0
                        ? "bg-red-300 pointer-events-none select-none"
                        : Number(product.currentStock) <= 5
                        ? "bg-amber-300 hover:bg-amber-300/60 hover:contrast-100"
                        : "bg-white"
                    )}
                  >
                    <TableCell className="px-4 py-3 text-sm text-gray-800 dark:text-primary">
                      {product.productId}
                    </TableCell>
                    <TableCell className="px-4 capitalize py-3 text-sm text-gray-800 dark:text-primary">
                      {product.productName}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-800 dark:text-primary">
                      {product.totalAdded}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-800 dark:text-primary">
                      {product.totalSold}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-800 dark:text-primary">
                      {product.currentStock}
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
};

export default StockPage;
