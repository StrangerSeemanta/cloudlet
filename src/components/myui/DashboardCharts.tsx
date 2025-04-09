import { Fragment } from "react/jsx-runtime";
import {
  BarChart,
  LineChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Rectangle,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { dateRangeType } from "./DateRangeSelector";
import { AddedProductTypes } from "@/firebase/ProductAddFirebase";
import { SoldProductDataType } from "@/firebase/SoldProductFirebase";
import { Loader2 } from "lucide-react";

function DashboardCharts({
  dateRange,
  data,
}: {
  dateRange: dateRangeType["dateRange"];
  data: {
    addedProducts: AddedProductTypes[] | null;
    soldProducts: SoldProductDataType[] | null;
  };
}) {
  const totalQuantityPerDay = () => {
    if (!data.soldProducts) return;
    const quantityMap = new Map<string, number>();
    if (data.soldProducts) {
      data.soldProducts.forEach((soldProduct) => {
        soldProduct.sold_products.forEach((sold) => {
          const currentSoldQty =
            quantityMap.get(soldProduct.soldAt.toString()) || 0;
          quantityMap.set(
            soldProduct.soldAt.toString(),
            currentSoldQty + Number(sold.selling_quantity)
          );
        });
      });

      const ItemSoldPerDayData = Array.from(quantityMap).map((item) => {
        return { soldAt: item[0], quantity: item[1] };
      });
      return ItemSoldPerDayData;
    }
  };
  return (
    <Fragment>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="px-4 flex flex-col items-center justify-between gap-6">
            <h2 className="text-lg pl-1  font-semibold">Income Over Time</h2>
            {data.soldProducts ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={data.soldProducts}>
                  <XAxis dataKey="soldAt" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="total_sold"
                    stroke={
                      dateRange === "7 days"
                        ? "teal"
                        : dateRange === "1 month"
                        ? "orange"
                        : dateRange === "6 month"
                        ? "coral"
                        : "dodgerblue"
                    }
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <h1>
                <Loader2 className="animate-spin" />
              </h1>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="px-4 flex flex-col items-center justify-between gap-6">
            <h2 className="text-lg font-semibold">Items Sold Per Day</h2>
            {data.soldProducts ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={totalQuantityPerDay()}>
                  <XAxis dataKey="soldAt" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="quantity"
                    fill={
                      dateRange === "7 days"
                        ? "coral"
                        : dateRange === "1 month"
                        ? "dodgerblue"
                        : dateRange === "6 month"
                        ? "orange"
                        : "teal "
                    }
                    activeBar={<Rectangle fill="#f00" />}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <h1>
                <Loader2 className="animate-spin" />
              </h1>
            )}
          </CardContent>
        </Card>
      </div>
    </Fragment>
  );
}

export default DashboardCharts;
