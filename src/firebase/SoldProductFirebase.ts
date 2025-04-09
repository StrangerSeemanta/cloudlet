import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import { getformattedDate } from "@/utils/getDateByRange";
import { handleActivity } from "./HandleActivityFirebase";

export interface SoldProductDataType {
  buyer_name: string;
  buyer_phoneNo: string;
  seller_name: string;
  sold_products: {
    productName: string;
    productId: string;
    selling_quantity: string | number;
    selling_price: string | number;
    total_price: string | number;
  }[];
  total_sold: number | string;
  soldAt: Date | string;
  timestamp: number;
  pending_amount: string | number;
  received_amount: string | number;
  installment_history: {
    amount: number;
    remain: number;
    repay_date: Date | string;
  }[];

  status: "paid" | "pending";
}
export async function addSoldProductData(soldPoductData: SoldProductDataType) {
  try {
    const docName = String(soldPoductData.timestamp);

    const ref = doc(db, "soldProductData", docName);
    await setDoc(ref, soldPoductData);
    await handleActivity({
      type: "Sold Product",
      description: `Sold BDT ${soldPoductData.total_sold} Taka to ${soldPoductData.buyer_name}(${soldPoductData.buyer_phoneNo})`,
      amount: Number(soldPoductData.total_sold),
      date: soldPoductData.soldAt,
      timestamp: soldPoductData.timestamp,
    });
  } catch (error) {
    throw new Error(String(error));
  }
}
export async function getAllSoldProductData() {
  try {
    const collectionRef = collection(db, "soldProductData"); // Reference to the collection
    const querySnapshot = await getDocs(collectionRef); // Fetch all documents in the collection

    // Map through the documents and return their data
    const products = querySnapshot.docs.map((doc) => ({
      ...doc.data(), // Spread the document data
    })) as SoldProductDataType[];
    if (products.length <= 0) return null;
    return products;
  } catch (error) {
    throw new Error(String(error));
  }
}

export interface RepayAmountDataType {
  buyer_name: string;
  buyer_phone: string;
  pending_amount: string | number;
  received_amount: string | number;
  installment_history: {
    amount: number;
    remain: number;
    repay_date: Date | string;
  };
  timestamp: number;
  total_amount: number | string;
}
export async function repayAmount(data: RepayAmountDataType) {
  try {
    const collectionRef = collection(db, "soldProductData");
    const q = query(
      collectionRef,

      where("buyer_name", "==", data.buyer_name),
      where("buyer_phoneNo", "==", data.buyer_phone),
      where("timestamp", "==", data.timestamp)
    ); // Reference to the collection
    const querySnapshot = await getDocs(q); // Fetch all documents in the collection

    // Map through the documents and return their data
    const matchedDocs = querySnapshot.docs.map((doc) => doc.id);
    const prevData = querySnapshot.docs.map((doc) =>
      doc.data()
    ) as SoldProductDataType[];
    if (matchedDocs.length <= 0) return null;

    // finialize the update data

    const installment_history: SoldProductDataType["installment_history"] = [
      ...prevData[0].installment_history,
      data.installment_history,
    ];

    await updateDoc(doc(db, "soldProductData", matchedDocs[0]), {
      ["installment_history"]: installment_history,
      ["pending_amount"]:
        Number(prevData[0].total_sold) -
        (Number(data.received_amount) + Number(prevData[0].received_amount)),
      ["received_amount"]:
        Number(data.received_amount) + Number(prevData[0].received_amount),
      ["repay_date"]: getformattedDate(new Date()),
      ["status"]:
        Number(prevData[0].total_sold) ===
        Number(data.received_amount) + Number(prevData[0].received_amount)
          ? "paid"
          : "pending",
    });
    await handleActivity({
      type: "Repaid Pending",
      description: `${data.buyer_name}(${data.buyer_phone}) repaid BDT ${data.installment_history.amount} Taka. Sale Id: ${data.timestamp}`,
      amount: Number(data.installment_history.amount),
      date: data.installment_history.repay_date,
      timestamp: Date.now(),
    });
  } catch (error) {
    throw new Error("Failed To Repay: " + String(error));
  }
}
