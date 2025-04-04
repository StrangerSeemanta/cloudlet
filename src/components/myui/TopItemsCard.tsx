// TopItemsCard.tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { FaBoxOpen } from "react-icons/fa"; // Optional, for an icon
import { formatCurrency } from "@/utils/formatCurrency"; // Optional utility to format prices (you can define it)

interface Item {
  name: string;
  quantitySold: number;
  price: number;
}

const TopItemsCard = () => {
  // Sample data for top 3 items sold
  const topItems: Item[] = [
    { name: "Product A", quantitySold: 120, price: 25 },
    { name: "Product B", quantitySold: 100, price: 30 },
    { name: "Product C", quantitySold: 80, price: 20 },
  ];

  return (
    <Card className="w-full max-w-sm mx-auto border border-gray-300 rounded-lg shadow-lg">
      <CardHeader className="text-black">
        <CardTitle className="text-lg font-semibold">
          Top 3 Sold Items
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 p-4">
        {topItems.map((item, index) => (
          <div key={index} className="flex justify-between items-center">
            <div className="flex items-center">
              <FaBoxOpen className="mr-2 text-yellow-500" />
              <span className="font-medium">{item.name}</span>
            </div>
            <span className="text-sm text-gray-600">
              {item.quantitySold} Sold
            </span>
          </div>
        ))}
      </CardContent>
      <CardFooter className="bg-gray-100 p-4">
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-700">Total Value</span>
          <span className="font-semibold text-lg text-gray-900">
            {formatCurrency(
              topItems.reduce(
                (total, item) => total + item.quantitySold * item.price,
                0
              )
            )}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TopItemsCard;
