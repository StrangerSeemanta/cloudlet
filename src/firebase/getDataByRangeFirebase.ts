import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";

export async function getDataByRangeFirebase(
  collectionName: string,
  fieldName: string,
  fromDate: string,
  toDate: string
) {
  try {
    const q = query(
      collection(db, collectionName),
      where(fieldName, ">=", fromDate),
      where(fieldName, "<=", toDate)
    );

    const querySnapshot = await getDocs(q);
    const results = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
    }));

    return results;
  } catch (error) {
    throw new Error("Can't Filter Data By Date Range: " + String(error));
  }
}
