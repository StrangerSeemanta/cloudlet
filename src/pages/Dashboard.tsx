import { Fragment, useCallback, useEffect, useState } from "react";

import RecentOrdersTable from "@/components/myui/RecentOrders";
import DashboardCharts from "@/components/myui/DashboardCharts";
import DashboardCards from "@/components/myui/DashboardCards";
import DateRangeSelector, {
  dateRangeType,
} from "@/components/myui/DateRangeSelector";
import { getDatesByRange } from "@/utils/getDateByRange";
import { getDataByRangeFirebase } from "@/firebase/getDataByRangeFirebase";
import { AddedProductTypes } from "@/firebase/ProductAddFirebase";
import { SoldProductDataType } from "@/firebase/SoldProductFirebase";
import { toast } from "sonner";
import LoadingTitle from "@/components/myui/LoadingTitle";

export default function Dashboard() {
  const [dateRange, setDateRange] =
    useState<dateRangeType["dateRange"]>("7 days");
  const [loadingData, setLoadingData] = useState(true);
  const [DB, setDB] = useState<{
    addedProducts: AddedProductTypes[] | null;
    soldProducts: SoldProductDataType[] | null;
  } | null>({
    addedProducts: null,
    soldProducts: null,
  });
  const fetchData = useCallback(async () => {
    try {
      const [fromDate, toDate] = getDatesByRange(dateRange);
      const addedProductData = (await getDataByRangeFirebase(
        "addedProductData",
        "productAddedAt",
        fromDate,
        toDate
      )) as AddedProductTypes[];

      const soldProductData = (await getDataByRangeFirebase(
        "soldProductData",
        "soldAt",
        fromDate,
        toDate
      )) as SoldProductDataType[];
      if (
        !addedProductData ||
        !soldProductData ||
        addedProductData.length < 1 ||
        soldProductData.length < 1
      )
        return setDB(null);
      setDB({
        addedProducts: addedProductData,
        soldProducts: soldProductData,
      });
      setLoadingData(false);
    } catch (error) {
      toast.error("Failed To Load Data", {
        description: String(error),
      });
      console.error(error);
      setLoadingData(false);
    }
  }, [dateRange]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  return (
    <Fragment>
      {loadingData ? (
        <LoadingTitle />
      ) : (
        <div className="px-6 pb-6 space-y-6">
          {/* Date Range Selector */}
          <div className=" min-h-10 flex flex-col gap-3 md:gap-0 md:flex-row items-center justify-between">
            <h1 className="font-bold text-2xl">Hi, Welcome back👋</h1>

            <DateRangeSelector
              onDateRangeSelect={(range) => setDateRange(range)}
            />
          </div>

          {/* Key Stats */}
          <DashboardCards dateRange={dateRange} />

          {/* Charts */}

          {DB && <DashboardCharts data={DB} dateRange={dateRange} />}
          <RecentOrdersTable sellingData={DB ? DB.soldProducts : null} />

          {/* Footer */}
          <footer className="hidden md:block mt-16 py-4 text-center text-gray-500">
            &copy; {new Date().getFullYear()} Cloudlet | All rights reserved.
          </footer>
        </div>
      )}
    </Fragment>
  );
}
