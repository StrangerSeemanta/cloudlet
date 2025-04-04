// RecentOrdersTable.tsx
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

// Sample order data
interface Order {
  product: string;
  quantity: number;
  customer: string;
  date: string;
  status: "Paid" | "Pending";
  price: number;
}

const RecentOrdersTable = () => {
  // Sample recent orders data
  const orders: Order[] = [
    {
      product: "Product A",
      quantity: 2,
      customer: "John Doe",
      date: "2025-03-06",
      status: "Paid",
      price: 50,
    },
    {
      product: "Product B",
      quantity: 1,
      customer: "Jane Smith",
      date: "2025-03-06",
      status: "Pending",
      price: 30,
    },
    {
      product: "Product C",
      quantity: 3,
      customer: "Alice Johnson",
      date: "2025-03-03",
      status: "Paid",
      price: 75,
    },
    {
      product: "Product D",
      quantity: 5,
      customer: "Bob Brown",
      date: "2025-03-01",
      status: "Pending",
      price: 100,
    },
  ];

  return (
    <Card className="relative pt-0 overflow-hidden rounded-sm gap-2">
      <CardHeader className="px-4 py-3  bg-teal-600 dark:bg-accent">
        <CardTitle className="text-2xl px-0 font-bold text-white">
          Recent Orders
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto ">
          <table className="min-w-full table-auto">
            <thead>
              <tr className=" border-b">
                <th className="px-4 py-2 text-left  text-gray-600 dark:text-destructive">
                  Product
                </th>
                <th className="px-4 py-2 text-left  text-gray-600 dark:text-destructive">
                  Quantity
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
              {orders.map((order, index) => (
                <tr key={index} className="border-b hover:bg-primary/10">
                  <td className="px-4 py-3 text-sm text-gray-800 dark:text-primary">
                    {order.product}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800 dark:text-primary">
                    {order.quantity}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800 dark:text-primary">
                    {order.customer}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800 dark:text-primary">
                    {order.date}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800 dark:text-primary">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full 
                  ${
                    order.status === "Paid"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800">
                    {order.price} Taka
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
      <CardFooter className="px-4">
        <Link to={"/reports"} className="flex justify-end ">
          <span className="text-teal-800 font-medium italic hover:underline">
            {"For more details check Report page ->"}
          </span>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default RecentOrdersTable;
