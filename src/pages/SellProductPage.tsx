import { Fragment } from "react/jsx-runtime";
import { Card, CardContent } from "@/components/ui/card";

import { Label } from "@/components/ui/label";

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
import { FormEvent, useCallback, useContext, useEffect, useState } from "react";
import { getformattedDate } from "@/utils/getDateByRange";
import { AuthContext } from "@/context/authContext";
import { toast } from "sonner";
import {
  addSoldProductData,
  SoldProductDataType,
} from "@/firebase/SoldProductFirebase";
import { useParams } from "react-router-dom";
import NoPage from "@/components/myui/NoPage";
import { getStockProduct, StockProduct } from "@/firebase/StockFirebase";
function SellProductPage() {
  const { productId } = useParams();
  const { user, loadingUser } = useContext(AuthContext);
  const [pageLoading, setPageLoading] = useState(true);
  const [productData, setProductData] = useState<StockProduct | null>(null);

  const fetchData = useCallback(async () => {
    try {
      if (!productId) return toast.error("No Param");
      const pid = decodeURIComponent(productId.toUpperCase());

      // Get All Stock Data
      const allStockData = await getStockProduct();
      if (!allStockData) return setProductData(null);
      // Match The Id

      const stockData = allStockData.filter(
        (product) => product.productId.toUpperCase() === pid
      );

      if (stockData.length > 1)
        throw new Error("This Product Id has Two Different Stock Data");

      setProductData(stockData[0]);
      setPageLoading(false);
    } catch (error) {
      toast.error("Try Again or Contact With The Developer", {
        description: String(error),
      });
      setPageLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    if (loadingUser) setPageLoading(true);

    fetchData();
  }, [loadingUser, fetchData]);
  const [isSelling, setSellingStat] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"paid" | "pending" | null>(
    null
  );
  const [formData, setFormData] = useState({
    buyer_name: "",
    selling_quantity: "",
    selling_price: "",
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
      total_price: String(
        Number(formData.selling_quantity) * Number(formData.selling_price)
      ),
      soldAt: getformattedDate(new Date()),
    });
  };

  const handleProductSell = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user || !user.displayName)
      return toast("You Need To Log In First! And Be Sure You Have A Name");

    if (
      !productData ||
      !productId ||
      !productData.productName ||
      !formData.selling_quantity ||
      !formData.selling_quantity ||
      !formData.buyer_name ||
      !formData.buyer_phoneNo ||
      !paymentStatus
    ) {
      return toast.error("All fields are required!");
    }
    setSellingStat(true);
    const ProductDATA: SoldProductDataType = {
      productId: decodeURIComponent(productId.toUpperCase()),
      productName: productData.productName.toLowerCase(),
      buyer_name: formData.buyer_name,
      buyer_phoneNo: formData.buyer_phoneNo,
      selling_quantity: formData.selling_quantity,
      selling_price: formData.selling_price,
      total_sold:
        Number(formData.selling_quantity) * Number(formData.selling_price),
      soldAt: getformattedDate(new Date()),
      seller_name: user.displayName,
      timestamp: Date.now(),
      status: paymentStatus,
      pending_amount:
        paymentStatus === "pending"
          ? Number(formData.selling_quantity) * Number(formData.selling_price) -
            Number(formData.received_amount)
          : 0,
      received_amount:
        paymentStatus === "paid"
          ? Number(formData.selling_quantity) * Number(formData.selling_price)
          : formData.received_amount,
      installment_history: [
        {
          repay_date: getformattedDate(new Date()),
          amount:
            paymentStatus === "paid"
              ? Number(formData.selling_quantity) *
                Number(formData.selling_price)
              : Number(formData.received_amount),
          remain:
            paymentStatus === "paid"
              ? 0
              : Number(formData.selling_quantity) *
                  Number(formData.selling_price) -
                Number(formData.received_amount),
        },
      ],
    };
    addSoldProductData(ProductDATA)
      .then(() => {
        toast("Successfully Product Added ");
        setSellingStat(false);
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
        {pageLoading ? (
          <div className="w-full h-[80vh] flex justify-center items-center">
            <div className="p-3  border-gray-500 bg-zinc-300 font-Nunito">
              Loading ...
            </div>
          </div>
        ) : productData ? (
          <Fragment>
            <h1 className="text-2xl font-bold">Sell Product</h1>
            <Card>
              <CardContent className="p-6 space-y-4">
                <form action="" onSubmit={handleProductSell}>
                  <div className="space-y-4">
                    <Label htmlFor="productId">Product ID</Label>
                    <Input
                      required
                      name="productId"
                      id="productId"
                      value={productId}
                      readOnly
                      className="transition uppercase  focus:ring-0 focus-visible:ring-0  font-Nunito"
                      placeholder="Product Id"
                    />

                    <Label htmlFor="productName">Product Name</Label>
                    <div className="flex items-center gap-5 transition">
                      <Input
                        required
                        name="productName"
                        id="productName"
                        value={productData.productName}
                        placeholder="Product Name"
                        className="transition   focus:ring-0 focus-visible:ring-0 font-Nunito"
                        readOnly
                      />
                    </div>
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
                    <div className="gap-2  flex flex-col">
                      <Label htmlFor="selling_quantity">Selling Quantity</Label>
                      <Input
                        required
                        id="selling_quantity"
                        name="selling_quantity"
                        value={formData.selling_quantity}
                        onChange={handleInputChange}
                        placeholder="Selling Quantity"
                        max={productData.currentStock}
                        className=" border-1 border-gray-600/50 font-Nunito"
                        type="number"
                      />
                      <h6 className="text-sm font-Nunito font-bold italic text-green-700 ">
                        Available Stock: {productData.currentStock}
                      </h6>
                    </div>
                    <Label htmlFor="selling_price">
                      Selling Price / ( Per Item ){" "}
                    </Label>
                    <Input
                      required
                      id="selling_price"
                      name="selling_price"
                      value={formData.selling_price}
                      onChange={handleInputChange}
                      placeholder="Selling Price Per Item"
                      className=" border-1 border-gray-600/50 font-Nunito"
                      type="number"
                    />
                    <Label htmlFor="total_sold">Total Price </Label>
                    <Input
                      required
                      name="total_sold"
                      id="total_sold"
                      value={
                        Number(formData.selling_price) *
                          Number(formData.selling_quantity) +
                        " Taka"
                      }
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
                      className="w-full bg-teal-600  font-Nunito font-bold  hover:bg-teal-800"
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
