// RecentOrdersTable.tsx
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { SoldProductDataType } from "@/firebase/SoldProductFirebase";
import { useEffect, useState } from "react";

// Sample order data

const RecentOrdersTable = ({
  sellingData,
}: {
  sellingData: SoldProductDataType[] | null;
}) => {
  const [recentData, setRecentData] = useState<SoldProductDataType[] | null>(
    null
  );
  useEffect(() => {
    if (sellingData) {
      const sortedData = [...sellingData].sort(
        (a, b) => b.timestamp - a.timestamp
      );
      const recentOrders = sortedData.slice(0, 5);
      setRecentData(recentOrders);
    }
  }, [sellingData]);

  return (
    <Card className="relative pt-0 overflow-hidden rounded-sm gap-2">
      <CardHeader className="px-4 py-3  bg-teal-600 dark:bg-accent">
        <CardTitle className="text-2xl px-0 font-bold text-white">
          Recent Orders
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto ">
          {recentData ? (
            <table className="min-w-full table-auto">
              <thead>
                <tr className=" border-b">
                  <th className="px-4 py-2 text-left  text-gray-600 dark:text-destructive">
                    Sale ID
                  </th>
                  <th className="px-4 py-2 text-left  text-gray-600 dark:text-destructive">
                    Customer
                  </th>
                  <th className="px-4 py-2 text-left  text-gray-600 dark:text-destructive">
                    Date
                  </th>
                  <th className="px-4 py-2 text-left  text-gray-600 dark:text-destructive">
                    Status
                  </th>
                  <th className="px-4 py-2 text-left  text-gray-600 dark:text-destructive">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentData.map((order, index) => (
                  <tr key={index} className="border-b hover:bg-primary/10">
                    <td className="px-4 py-3 text-sm text-gray-800 dark:text-primary">
                      {order.timestamp}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800 dark:text-primary">
                      {order.buyer_name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800 dark:text-primary">
                      {order.soldAt.toString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800 dark:text-primary">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full 
                  ${
                    order.status === "paid"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800">
                      {order.total_sold} Taka
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <h1 className="text-center w-full text-lg text-gray-600 font-bold ">
              No Recent Orders Available.
            </h1>
          )}
        </div>
      </CardContent>
      <CardFooter className="px-4">
        <Link to={"/sales"} className="flex justify-end ">
          <span className="text-teal-800 font-medium italic hover:underline">
            {"For more details check Sales Data page ->"}
          </span>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default RecentOrdersTable;
