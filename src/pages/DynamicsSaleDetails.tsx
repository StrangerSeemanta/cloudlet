import { motion } from "framer-motion";

import { Input } from "@/components/ui/input";

import NoPage from "@/components/myui/NoPage";
import { Card, CardContent } from "@/components/ui/card";
import { AuthContext } from "@/context/authContext";
import {
  getAllSoldProductData,
  repayAmount,
  RepayAmountDataType,
  SoldProductDataType,
} from "@/firebase/SoldProductFirebase";
import { FormEvent, useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import { toast } from "sonner";
import { Dialog } from "@radix-ui/react-dialog";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Loader, Loader2 } from "lucide-react";
import { getformattedDate } from "@/utils/getDateByRange";
import { Button } from "@/components/ui/button";
import generateInvoicePDF from "@/utils/generateInvoicePDF";
import LoadingTitle from "@/components/myui/LoadingTitle";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// Get the Sold Product Id From Url
function DynamicsSaleDetails() {
  const { loadingUser, user } = useContext(AuthContext);
  const { soldProductId } = useParams();
  const [pageLoading, setPageLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [soldProductData, setSoldProduct] =
    useState<SoldProductDataType | null>(null);

  const [repayFormData, setRepayFormData] = useState({
    repay_productID: "",
    repay_productName: "",
    pending_amount: "",
    received_amount: "",
    repay_date: "",
    buyer_name: "",
    buyer_phone: "",
    timestamp: 0,
    total_amount: 0,
  });
  const [isRepayLoading, setRepayLoading] = useState(false);

  // Fetch

  async function fetchSoldProductData(pid: number) {
    try {
      setPageLoading(true);
      // Get All Stock Data
      const allSoldProductData = await getAllSoldProductData();
      if (!allSoldProductData) return setSoldProduct(null);
      // Match The Id

      const soldProductData = allSoldProductData.filter(
        (product) => product.timestamp === pid
      );

      if (soldProductData.length === 0) {
        setPageLoading(false);
        return toast.error("No Product Found With This Id");
      }
      if (soldProductData.length > 1) {
        setPageLoading(false);
        return toast.error("Duplicate Product Found With This Id");
      }
      // Set The Sold Product Data

      setSoldProduct(soldProductData[0]);
      setPageLoading(false);
    } catch (error) {
      toast.error("Try Again or Contact With The Developer", {
        description: String(error),
      });
      setPageLoading(false);
    }
  }

  const fetchData = useCallback(async () => {
    try {
      setPageLoading(true);
      if (!soldProductId) return toast.error("Incorrect Url");
      const pid = Number(decodeURIComponent(soldProductId.toString()));
      await fetchSoldProductData(pid);
      // Get All Stock Data
      setPageLoading(false);
    } catch (error) {
      toast.error("Try Again or Contact With The Developer", {
        description: String(error),
      });
      setPageLoading(false);
    }
  }, [soldProductId]);

  // Effect to handle loading
  useEffect(() => {
    if (loadingUser) setPageLoading(true);
    fetchData();
  }, [loadingUser, fetchData]);

  const handleRepaySubmission = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user || !user.displayName)
      return toast.error(
        "You Need To Log In First! And Be Sure You Have A Name"
      );
    if (!soldProductData) return toast.error("Can't Get The Data. Reload");
    if (!repayFormData.received_amount) {
      return toast.error("All fields are required!");
    }
    if (Number(soldProductData.pending_amount) <= 0)
      return toast.error("There Is No Pending Amount. ");
    setRepayLoading(true);
    const RepayData: RepayAmountDataType = {
      total_amount: repayFormData.total_amount,
      received_amount: repayFormData.received_amount,
      pending_amount: 0,
      buyer_name: repayFormData.buyer_name,
      buyer_phone: repayFormData.buyer_phone,
      installment_history: {
        amount: Number(repayFormData.received_amount),
        remain:
          Number(soldProductData.total_sold) -
          (Number(soldProductData.received_amount) +
            Number(repayFormData.received_amount)),
        repay_date: getformattedDate(new Date()),
      },
      timestamp: repayFormData.timestamp,
    };
    repayAmount(RepayData)
      .then(async () => {
        if (!soldProductId) return;
        await fetchSoldProductData(
          Number(decodeURIComponent(soldProductId.toString()))
        );
        toast("Payment Added ");
        setRepayLoading(false);
      })
      .catch((error) => {
        toast.error("Failed To Repay. Try Again", {
          description: String(error),
        });
        setRepayLoading(false);
      });
  };
  return (
    <Fragment>
      {pageLoading ? (
        <>
          <LoadingTitle />
        </>
      ) : soldProductData ? (
        <Fragment>
          <div className="p-2 lg:p-4 space-y-4 ">
            <h1 className="text-2xl md:text-4xl  font-Nunito font-bold ">
              Sale Details
            </h1>
            <div className="grid grid-cols-1 space-x-4">
              <Button
                onClick={() => {
                  setGenerating(true);
                  const t = setTimeout(() => {
                    generateInvoicePDF(soldProductData);
                    setGenerating(false);
                  }, 10);

                  return () => clearTimeout(t);
                }}
                className="bg-teal-600 max-w-lg text-white text-md hover:bg-teal-700"
              >
                {generating ? (
                  <>
                    Generating... <Loader2 className="animate-spin" />
                  </>
                ) : (
                  "Cash Memo"
                )}
              </Button>
            </div>
            <Card className="max-w-lg md:min-w-lg">
              <CardContent className="space-y-5">
                <div>
                  <h1 className="text-lg font-bold border-b-4 mb-2 border-gray-600/60 border-double">
                    Buyer Details
                  </h1>
                  <div className="flex item-center space-x-4 ">
                    <h1 className="text-md font-Roboto font-light">
                      Buyer Name:
                    </h1>
                    <h1 className="text-md font-Nunito capitalize font-bold">
                      {soldProductData.buyer_name}
                    </h1>
                  </div>

                  <div className="flex item-center space-x-4 ">
                    <h1 className="text-md font-Roboto  font-light">
                      Buyer Phone No:
                    </h1>
                    <h1 className="text-md font-Nunito font-bold">
                      {soldProductData.buyer_phoneNo}
                    </h1>
                  </div>

                  <div className="flex item-center space-x-4 ">
                    <h1 className="text-md font-Roboto  font-light">Date:</h1>
                    <h1 className="text-md font-Nunito capitalize font-bold">
                      {soldProductData.soldAt.toString()}
                    </h1>
                  </div>

                  <div className="flex item-center space-x-4 ">
                    <h1 className="text-md font-Roboto  font-light">
                      Seller Name:
                    </h1>
                    <h1 className="text-md font-Nunito capitalize font-bold">
                      {soldProductData.seller_name}
                    </h1>
                  </div>
                </div>

                {/* Product Details */}
                <div>
                  <h1 className="text-lg font-bold border-b-4 mb-2 border-gray-600/60 border-double">
                    Shopping Details
                  </h1>
                  <Table className="w-full border border-blue-200">
                    <TableHeader className="bg-blue-500 hover:bg-blue-500  text-white">
                      <TableRow className="hover:bg-blue-500 ">
                        <TableHead className="text-white uppercase">
                          Id
                        </TableHead>
                        <TableHead className="text-white uppercase">
                          Name
                        </TableHead>
                        <TableHead className="text-white uppercase">
                          Price
                        </TableHead>
                        <TableHead className="text-white uppercase">
                          Quantity
                        </TableHead>
                        <TableHead className="text-white uppercase">
                          Total
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {soldProductData.sold_products &&
                        soldProductData.sold_products.map((product, index) => (
                          <TableRow
                            key={index.toString() + product.productId}
                            className="border-b"
                          >
                            <TableCell>{product.productId}</TableCell>
                            <TableCell>{product.productName}</TableCell>
                            <TableCell>
                              {product.selling_price + " Taka"}
                            </TableCell>
                            <TableCell>{product.selling_quantity}</TableCell>
                            <TableCell>
                              {product.total_price + " Taka"}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>

                <div>
                  <h1 className="text-xl font-bold border-b-4 mb-2 border-gray-600/60 border-double">
                    Payment Details
                  </h1>
                  <div className="flex item-center space-x-4 ">
                    <h1 className="text-md font-Roboto  font-light">
                      Total Amount :
                    </h1>
                    <h1 className="text-md font-Nunito font-bold">
                      {soldProductData.total_sold.toString() + " " + "Taka"}
                    </h1>
                  </div>
                  <div className="flex item-center space-x-4 ">
                    <h1 className="text-md font-Roboto  font-light">
                      Received Amount :
                    </h1>
                    <h1 className="text-md font-Nunito font-bold">
                      {soldProductData.received_amount.toString() +
                        " " +
                        "Taka"}
                    </h1>
                  </div>
                  <div className="flex item-center space-x-4 border-b-2 border-gray-400/30 ">
                    <h1 className="text-md font-Roboto  font-light">
                      Pending Amount :
                    </h1>
                    <h1 className="text-md font-Nunito font-bold">
                      {soldProductData.pending_amount.toString() + " " + "Taka"}
                    </h1>
                  </div>
                  <div className="flex item-center space-x-4 mt-2 ">
                    <h1 className="text-md font-Roboto  font-light">
                      Payment Status:
                    </h1>
                    <h1 className="text-md font-Nunito font-bold capitalize">
                      {soldProductData.status === "paid" ? "paid" : "pending"}
                    </h1>
                  </div>

                  <div className="mt-2 w-full flex space-x-5">
                    {/* Show Repay History */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <motion.div
                          initial={{
                            opacity: 0,
                            scale: 0.8,
                            letterSpacing: "0rem",
                          }}
                          whileInView={{
                            opacity: 1,
                            scale: 1,
                            letterSpacing: "0rem",
                          }}
                          whileTap={{ letterSpacing: "0.2rem" }}
                          transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 10,
                          }}
                          // Smooth transition
                          className="bg-green-700 flex cursor-pointer tracking-wide 
                                   justify-center  
                                   items-center text-md font-semibold text-white font-Nunito 
                                   h-10 mt-4 flex-1"
                        >
                          <motion.span
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{
                              delay: 0.1,
                              type: "spring",
                              stiffness: 200,
                            }}
                          >
                            Transaction History
                          </motion.span>
                        </motion.div>
                      </DialogTrigger>
                      <DialogContent className="overflow-auto max-h-screen">
                        <DialogHeader className="text-xl font-bold">
                          <DialogTitle>Transaction History</DialogTitle>
                        </DialogHeader>
                        <div className="font-Nunito">
                          <h1>
                            Total Amount:{" "}
                            {soldProductData.total_sold.toString()} Taka
                          </h1>{" "}
                          <h1>
                            Total Received Amount:{" "}
                            {soldProductData.received_amount.toString()} Taka
                          </h1>
                          <h1 className="text-red-600">
                            Total Pending Amount:{" "}
                            {soldProductData.pending_amount.toString()} Taka
                          </h1>
                          <div>
                            <h1 className="font-bold my-3 border-b-2 border-gray-500/50 border-dashed">
                              Transactions
                            </h1>
                            {soldProductData.installment_history.length >= 1 ? (
                              soldProductData.installment_history.map(
                                (installment, index) => (
                                  <div
                                    key={
                                      index.toString() +
                                      installment.repay_date.toString()
                                    }
                                    className="border-b-2 border-gray-500/50 mb-4 border-dashed"
                                  >
                                    <h1 className="text-indigo-600 font-bold text-lg">
                                      <span className="mr-2">Installment:</span>
                                      <span>
                                        {"#" + (index + 1).toString()}
                                      </span>
                                    </h1>
                                    <h1 className="font-bold  mt-1">
                                      Date: {installment.repay_date.toString()}
                                    </h1>
                                    <h1 className="font-bold ">
                                      Received: {installment.amount.toString()}{" "}
                                      Taka
                                    </h1>
                                  </div>
                                )
                              )
                            ) : (
                              <h1 className="font-bold text-gray-500">
                                No transaction
                              </h1>
                            )}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* Repay Button */}
                    {(soldProductData.status === "pending" ||
                      Number(soldProductData.pending_amount) > 0) && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <motion.div
                            initial={{
                              opacity: 0,
                              scale: 0.8,
                              letterSpacing: "0rem",
                            }}
                            whileInView={{
                              opacity: 1,
                              scale: 1,
                              letterSpacing: "0rem",
                            }}
                            whileTap={{ letterSpacing: "0.2rem" }}
                            transition={{
                              type: "spring",
                              stiffness: 200,
                              damping: 10,
                            }}
                            // Smooth transition
                            className="bg-indigo-800 flex cursor-pointer tracking-wide 
                                   justify-center  
                                   items-center text-md font-semibold text-white font-Nunito 
                                   w-full h-10 flex-1 mt-4"
                          >
                            <motion.span
                              initial={{ opacity: 0, y: 40 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{
                                delay: 0.1,
                                type: "spring",
                                stiffness: 200,
                              }}
                            >
                              Repay The Pending
                            </motion.span>
                          </motion.div>
                        </DialogTrigger>
                        <DialogContent className="overflow-auto max-h-screen">
                          <DialogHeader className="text-xl font-bold">
                            <DialogTitle>Repay The Pending</DialogTitle>
                          </DialogHeader>
                          <div>
                            <form
                              name="repay_form"
                              onSubmit={handleRepaySubmission}
                              className="space-y-3"
                            >
                              <Label htmlFor="buyer_name">Buyer Name</Label>
                              <Input
                                id="buyer_name"
                                name="buyer_name"
                                readOnly
                                disabled
                                value={soldProductData.buyer_name}
                              />

                              <Label htmlFor="total_amount">
                                Total Sold Amount
                              </Label>
                              <Input
                                name="total_amount"
                                id="total_amount"
                                readOnly
                                disabled
                                value={soldProductData.total_sold}
                              />

                              <Label htmlFor="pending_amount">
                                Pending Amount
                              </Label>
                              <Input
                                name="pending_amount"
                                id="pending_amount"
                                readOnly
                                disabled
                                value={soldProductData.pending_amount}
                              />
                              <Label htmlFor="received_amount">
                                Repay Amount
                              </Label>
                              <Input
                                required
                                name="received_amount"
                                id="received_amount"
                                value={repayFormData.received_amount}
                                onChange={(e) => {
                                  const inputValue = parseFloat(e.target.value);
                                  const pendingAmount = Number(
                                    soldProductData.pending_amount
                                  );

                                  if (inputValue > pendingAmount) {
                                    e.target.setCustomValidity(
                                      `Amount cannot exceed pending amount (${pendingAmount})`
                                    );
                                  } else {
                                    e.target.setCustomValidity("");
                                  }

                                  setRepayFormData({
                                    ...repayFormData,

                                    received_amount: e.target.value,
                                    buyer_name: soldProductData.buyer_name,
                                    buyer_phone: soldProductData.buyer_phoneNo,
                                    timestamp: soldProductData.timestamp,
                                    total_amount: Number(
                                      soldProductData.total_sold
                                    ),
                                  });
                                }}
                              />

                              <Button
                                type="submit"
                                className="bg-indigo-800 w-full text-white hover:bg-indigo-700"
                              >
                                Repay
                                <Loader
                                  className={
                                    isRepayLoading ? "animate-spin" : ""
                                  }
                                />
                              </Button>
                            </form>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </Fragment>
      ) : (
        <NoPage />
      )}
    </Fragment>
  );
}

export default DynamicsSaleDetails;
