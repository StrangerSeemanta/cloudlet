import { Fragment, useCallback, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  FaShoppingCart,
  FaChartLine,
  FaBox,
  FaExclamationTriangle,
} from "react-icons/fa";
import { twMerge } from "tailwind-merge";
import card_bg from "@/assets/shape-square.svg";
import {
  getTotalExpense,
  getTotalIncomes,
  getTotalPending,
  getTotalProductsInStock,
} from "@/utils/dashboardDataManage";
import { SoldProductDataType } from "@/firebase/SoldProductFirebase";
import { toast } from "sonner";
import { Skeleton } from "../ui/skeleton";
import { AddedProductTypes } from "@/firebase/ProductAddFirebase";
import { DailyExpenseType } from "@/firebase/DailyExpenseFirebase";
import { dateRangeType } from "./DateRangeSelector";
import { getDataByRangeFirebase } from "@/firebase/getDataByRangeFirebase";
import { getDatesByRange } from "@/utils/getDateByRange";

function DashboardCards({
  dateRange,
}: {
  dateRange: dateRangeType["dateRange"];
}) {
  const [totalIncomes, setTotalIncomes] = useState<number>(0);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [totalPendingAmount, setTotalPending] = useState<number>(0);

  const [isIncomeLoading, setIncomeLoading] = useState(true);
  const [isExpenseLoading, setExpenseLoading] = useState(true);
  const [isTotalProductsLoading, setTotalProductsLoading] = useState(true);
  const [isTotalPendingLoading, setTotalPendingLoading] = useState(true);

  const handleFetchData = useCallback(async () => {
    try {
      const [fromDate, toDate] = getDatesByRange(dateRange);
      const addedProductData = (await getDataByRangeFirebase(
        "addedProductData",
        "productAddedAt",
        fromDate,
        toDate
      )) as AddedProductTypes[];
      const dailyExpenses = (await getDataByRangeFirebase(
        "dailyExpenseData",
        "expenseDate",
        fromDate,
        toDate
      )) as DailyExpenseType[];
      const soldProductData = (await getDataByRangeFirebase(
        "soldProductData",
        "soldAt",
        fromDate,
        toDate
      )) as SoldProductDataType[];

      const totalIncome = getTotalIncomes(soldProductData);
      setTotalIncomes(totalIncome);

      const total_expenses = getTotalExpense(dailyExpenses, addedProductData);
      setTotalExpenses(total_expenses);

      const productsInStock = await getTotalProductsInStock();
      setTotalProducts(productsInStock);

      const totalPending = getTotalPending(soldProductData);
      setTotalPending(totalPending);
    } catch (error) {
      throw new Error("Failed To Load  Data" + " " + String(error));
    }
  }, [dateRange]);
  const fetchData = () => {
    setTotalProductsLoading(true);
    setIncomeLoading(true);
    setExpenseLoading(true);
    setTotalPendingLoading(true);
    handleFetchData()
      .then(() => {
        setIncomeLoading(false);
        setTotalPendingLoading(false);
        setExpenseLoading(false);
        setTotalProductsLoading(false);
      })
      .catch((err) => {
        toast.error(String(err));
        console.error(err);
        setIncomeLoading(false);
        setTotalPendingLoading(false);
        setExpenseLoading(false);
        setTotalProductsLoading(false);
      });
  };
  useEffect(fetchData, [handleFetchData]);

  return (
    <Fragment>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Card One For Total Sales */}
        <Card
          onClick={handleFetchData}
          className={twMerge("relative py-6 px-1 bg-blue-50")}
        >
          <CardContent className="flex flex-col gap-2">
            <FaShoppingCart className={twMerge("text-3xl text-blue-700")} />
            <h2 className={twMerge("text-xl  font-bold text-blue-800")}>
              Total Income
            </h2>
            <div>
              {isIncomeLoading ? (
                <Skeleton className="bg-gray-300 w-40 h-8" />
              ) : (
                <p className={twMerge("text-2xl  font-bold text-blue-800")}>
                  {String(totalIncomes) + " " + "Taka"}
                </p>
              )}
            </div>
            <p className="text-sm font-semibold capitalize text-right text-gray-700/70">
              In {dateRange}
            </p>
          </CardContent>
          <div
            className={twMerge(
              "absolute w-3/4 h-full inline-flex top-0 left-0 z-10 opacity-40 bg-blue-400"
            )}
            style={{
              maskImage: `url(${card_bg})`,
              WebkitMaskImage: `url(${card_bg})`,
              maskRepeat: "no-repeat",
              maskPosition: "center",
              maskSize: "cover",
            }}
          ></div>
        </Card>

        {/* Card Two For Total Profits */}
        <Card className={twMerge("relative py-6 px-1 bg-yellow-50")}>
          <CardContent className="flex flex-col gap-2">
            <FaChartLine className={twMerge("text-3xl text-yellow-700")} />
            <h2 className={twMerge("text-xl  font-bold text-yellow-800")}>
              Total Expense
            </h2>
            <div>
              {isExpenseLoading ? (
                <Skeleton className="bg-gray-300 w-40 h-8" />
              ) : (
                <p
                  className={twMerge(
                    "text-2xl flex items-center gap-2 font-bold text-yellow-800"
                  )}
                >
                  <span>{totalExpenses}</span>
                  <span>Taka</span>
                </p>
              )}
            </div>
            <p className="text-sm font-semibold capitalize text-right text-gray-700/70">
              In {dateRange}
            </p>
          </CardContent>
          <div
            className={twMerge(
              "absolute w-3/4 h-full inline-flex top-0 left-0 z-10 opacity-40 bg-yellow-400"
            )}
            style={{
              maskImage: `url(${card_bg})`,
              WebkitMaskImage: `url(${card_bg})`,
              maskRepeat: "no-repeat",
              maskPosition: "center",
              maskSize: "cover",
            }}
          ></div>
        </Card>

        {/* Card Three For Products In Stock */}
        <Card className={twMerge("relative py-6 px-1 bg-purple-50")}>
          <CardContent className="flex flex-col gap-2">
            <FaBox className={twMerge("text-3xl text-purple-700")} />
            <h2 className={twMerge("text-xl  font-bold text-purple-800")}>
              Product in Stock
            </h2>
            {isTotalProductsLoading ? (
              <Skeleton className="bg-gray-300 w-40 h-8" />
            ) : (
              <p className={twMerge("text-2xl  font-bold text-purple-800")}>
                {totalProducts} Products
              </p>
            )}
            <p className="text-sm font-semibold text-right text-gray-700/70">
              Check stock page
            </p>
          </CardContent>
          <div
            className={twMerge(
              "absolute w-3/4 h-full inline-flex top-0 left-0 z-10 opacity-40 bg-purple-400"
            )}
            style={{
              maskImage: `url(${card_bg})`,
              WebkitMaskImage: `url(${card_bg})`,
              maskRepeat: "no-repeat",
              maskPosition: "center",
              maskSize: "cover",
            }}
          ></div>
        </Card>

        {/* Card Four For Pending Taka*/}

        <Card className={twMerge("relative py-6 px-1 bg-rose-50")}>
          <CardContent className="flex flex-col gap-2">
            <FaExclamationTriangle
              className={twMerge("text-3xl text-rose-700")}
            />
            <h2 className={twMerge("text-xl  font-bold text-rose-800")}>
              Total Pending
            </h2>
            {isTotalPendingLoading ? (
              <Skeleton className="bg-gray-300 w-40 h-8" />
            ) : (
              <p className={twMerge("text-2xl  font-bold text-rose-800")}>
                {totalPendingAmount} Taka
              </p>
            )}
            <p className="text-sm font-semibold text-right text-gray-700/70">
              Check stock page
            </p>
          </CardContent>
          <div
            className={twMerge(
              "absolute w-3/4 h-full inline-flex top-0 left-0 z-10 opacity-40 bg-rose-400"
            )}
            style={{
              maskImage: `url(${card_bg})`,
              WebkitMaskImage: `url(${card_bg})`,
              maskRepeat: "no-repeat",
              maskPosition: "center",
              maskSize: "cover",
            }}
          ></div>
        </Card>
      </div>
    </Fragment>
  );
}

export default DashboardCards;
