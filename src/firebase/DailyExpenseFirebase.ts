import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { handleActivity } from "./HandleActivityFirebase";

export interface DailyExpenseType {
  expense_title: string;
  expense_amount: string;
  comments: string;
  expenseDate: Date | string;
  timestamp: number;
  spendBy: string;
}
export async function addDailyExpense(expenseData: DailyExpenseType) {
  try {
    const docName =
      expenseData.expense_title.toLowerCase().trim().replace(" ", "_") +
      String(expenseData.timestamp);

    const ref = doc(db, "dailyExpenseData", docName);
    await setDoc(ref, expenseData);
    await handleActivity({
      type: "additional expense",
      description: `Spent ${expenseData.expense_amount} on ${expenseData.expense_title}`,
      amount: Number(expenseData.expense_amount),
      date: expenseData.expenseDate,
      timestamp: Date.now(),
    });
  } catch (error) {
    throw new Error(String(error));
  }
}
export async function getAllDailyExpenseData() {
  try {
    const collectionRef = collection(db, "dailyExpenseData"); // Reference to the collection
    const querySnapshot = await getDocs(collectionRef); // Fetch all documents in the collection

    // Map through the documents and return their data
    const expenses = querySnapshot.docs.map((doc) => ({
      ...doc.data(), // Spread the document data
    })) as DailyExpenseType[];
    if (expenses.length <= 0) return null;
    return expenses;
  } catch (error) {
    throw new Error(String(error));
  }
}
