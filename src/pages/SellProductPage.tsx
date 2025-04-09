import { Fragment } from "react/jsx-runtime";
import { Card, CardContent } from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { FormEvent, useContext, useEffect, useState } from "react";
import { getformattedDate } from "@/utils/getDateByRange";
import { AuthContext } from "@/context/authContext";
import { toast } from "sonner";
import {
  addSoldProductData,
  SoldProductDataType,
} from "@/firebase/SoldProductFirebase";
import NoPage from "@/components/myui/NoPage";
import LoadingTitle from "@/components/myui/LoadingTitle";
import SellProductRow from "@/components/myui/SellProductRow";
import { useNavigate } from "react-router-dom";

function SellProductPage() {
  const { user, loadingUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [soldItems, setSoldItems] = useState<
    {
      productName: string;
      productId: string;
      selling_quantity: string | number;
      selling_price: string | number;
      total_price: string | number;
    }[]
  >([
    {
      productId: "",
      productName: "",
      selling_quantity: "",
      selling_price: "",
      total_price: "",
    },
  ]);

  const [total_sold_amount, setTotalSoldAmount] = useState<number>(0);
  useEffect(() => {
    setTotalSoldAmount(
      soldItems.map((item) => Number(item.total_price)).reduce((a, b) => a + b)
    );
  }, [soldItems]);
  const [isSelling, setSellingStat] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"paid" | "pending" | null>(
    null
  );
  const [formData, setFormData] = useState({
    buyer_name: "",
    buyer_phoneNo: "",
    total_price: "",
    soldAt: "",
    received_amount: "",
  });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      total_price: String(0),
      soldAt: getformattedDate(new Date()),
    });
  };

  const handleProductSell = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user || !user.displayName)
      return toast("You Need To Log In First! And Be Sure You Have A Name");

    if (!formData.buyer_name || !formData.buyer_phoneNo || !paymentStatus) {
      return toast.error("All fields are required!");
    }
    setSellingStat(true);

    const ProductDATA: SoldProductDataType = {
      buyer_name: formData.buyer_name,
      buyer_phoneNo: formData.buyer_phoneNo,
      sold_products: soldItems,
      total_sold: total_sold_amount,
      soldAt: getformattedDate(new Date()),
      seller_name: user.displayName,
      timestamp: Date.now(),
      status: paymentStatus,
      pending_amount:
        paymentStatus === "pending"
          ? total_sold_amount - Number(formData.received_amount)
          : 0,
      received_amount:
        paymentStatus === "paid" ? total_sold_amount : formData.received_amount,
      installment_history: [
        {
          repay_date: getformattedDate(new Date()),
          amount:
            paymentStatus === "paid"
              ? total_sold_amount
              : Number(formData.received_amount),
          remain:
            paymentStatus === "paid"
              ? 0
              : total_sold_amount - Number(formData.received_amount),
        },
      ],
    };
    addSoldProductData(ProductDATA)
      .then(() => {
        toast("Successfully Product Added ");
        setSellingStat(false);
        navigate("/sales");
      })
      .catch((error) => {
        toast.error("Failed To Add The Product. Try Again", {
          description: String(error),
        });
        setSellingStat(false);
      });
  };
  return (
    <Fragment>
      <div className="p-2 space-y-6">
        {loadingUser ? (
          <LoadingTitle />
        ) : user ? (
          <Fragment>
            <h1 className="text-2xl font-bold">Sell Product</h1>
            <Card>
              <CardContent className="p-6 space-y-4">
                <form action="" onSubmit={handleProductSell}>
                  <div className="space-y-4">
                    <Label htmlFor="buyer_name">Buyer Name</Label>
                    <Input
                      required
                      name="buyer_name"
                      id="buyer_name"
                      value={formData.buyer_name}
                      onChange={handleInputChange}
                      className=" border-1 border-gray-600/50 font-Nunito"
                      placeholder="Buyer Name"
                    />
                    <Label htmlFor="buyer_phoneNo">Buyer Phone Number</Label>
                    <Input
                      required
                      name="buyer_phoneNo"
                      id="buyer_phoneNo"
                      type="number"
                      value={formData.buyer_phoneNo}
                      onChange={handleInputChange}
                      className=" border-1 border-gray-600/50 font-Nunito"
                      placeholder="Buyer Phone Number"
                    />
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className=" py-2 text-left  text-gray-600 dark:text-destructive text-[0.9rem] font-bold capitalize">
                            Product
                          </TableHead>
                          <TableHead className="px-4 py-2 text-left  text-gray-600 dark:text-destructive text-[0.9rem] font-bold capitalize">
                            Product ID
                          </TableHead>
                          <TableHead className="px-4 py-2 text-left  text-gray-600 dark:text-destructive text-[0.9rem] font-bold capitalize">
                            Product Name
                          </TableHead>
                          <TableHead className="px-4 py-2 text-left  text-gray-600 dark:text-destructive text-[0.9rem] font-bold capitalize">
                            Quantity
                          </TableHead>
                          <TableHead className="px-4 py-2 text-left  text-gray-600 dark:text-destructive text-[0.9rem] font-bold capitalize">
                            Price
                          </TableHead>
                          <TableHead className="px-4 py-2 text-left  text-gray-600 dark:text-destructive text-[0.9rem] font-bold capitalize">
                            Total
                          </TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {soldItems.map((item, index) => (
                          <SellProductRow
                            key={index}
                            productNo={index}
                            item={item}
                            onChange={(updatedItem) => {
                              const updatedItems = [...soldItems];
                              updatedItems[index] = updatedItem;
                              setSoldItems(updatedItems);
                            }}
                          />
                        ))}
                      </TableBody>
                    </Table>
                    <Button
                      onClick={() => {
                        setSoldItems((prev) => [
                          ...prev,
                          {
                            productId: "",
                            productName: "",
                            selling_quantity: "",
                            selling_price: "",
                            total_price: "",
                          },
                        ]);
                        console.log(soldItems);
                      }}
                      type="button"
                      size={"sm"}
                      className="mt-2"
                      variant={"themed"}
                    >
                      + Add Product
                    </Button>
                    <Label htmlFor="total_sold">Total Price </Label>
                    <Input
                      required
                      name="total_sold"
                      id="total_sold"
                      value={total_sold_amount + " Taka"}
                      placeholder="Total Price"
                      className="transition   focus:ring-0 focus-visible:ring-0  font-Nunito"
                      readOnly
                      type="text"
                    />
                    <Label htmlFor="selling_status">Selling Status </Label>

                    <Select
                      onValueChange={(e) => {
                        if (e === "paid" || e === "pending") {
                          setPaymentStatus(e);
                        }
                      }}
                    >
                      <SelectTrigger className="w-full font-Nunito hover:contrast-90   border-2 p-7 text-md font-semibold bg-blue-50 text-blue-700">
                        <SelectValue
                          className=" font-Nunito"
                          placeholder="Select Payment Status"
                        />
                      </SelectTrigger>
                      <SelectContent id="selling_status p-5  font-Nunito">
                        <SelectItem
                          className="bg-green-600 font-Nunito mb-2 px-3 transition text-lg font-medium tracking-wider focus:bg-green-400 focus:ring-2 focus:ring-gray-600 cursor-pointer py-5 border-b-2 border-b-gray-300/40"
                          value={"paid"}
                        >
                          Paid
                        </SelectItem>

                        <SelectItem
                          className="bg-blue-600 px-3 transition font-Nunito text-lg font-medium tracking-wider focus:bg-blue-400 focus:ring-2 focus:ring-gray-600 cursor-pointer py-5 border-b-2 border-b-gray-300/40"
                          value={"pending"}
                        >
                          Pending
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    {paymentStatus && paymentStatus === "pending" && (
                      <>
                        <Label htmlFor="received_amount">
                          Received Amount{" "}
                        </Label>
                        <Input
                          required
                          name="received_amount"
                          id="received_amount"
                          value={formData.received_amount}
                          onChange={handleInputChange}
                          placeholder="Amount You Received"
                          className=" border-1 border-gray-600/50  font-Nunito"
                          type="text"
                        />
                      </>
                    )}
                    <Button
                      type="submit"
                      className="w-full bg-green-700  font-Nunito font-bold  hover:bg-green-600"
                    >
                      {isSelling ? (
                        <>
                          <span>Selling... </span>
                          <Loader2 className="animate-spin" />
                        </>
                      ) : (
                        <span>Sell Product</span>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </Fragment>
        ) : (
          <NoPage />
        )}
      </div>
    </Fragment>
  );
}

export default SellProductPage;
