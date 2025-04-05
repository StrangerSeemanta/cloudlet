import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export interface ActivityDataType {
  type: string;
  description: string;
  amount: number;
  date: Date | string;
  timestamp: number;
}
export async function handleActivity(activity: ActivityDataType) {
  try {
    const timestamp = Date.now();
    const docref = doc(db, "activityData", String(timestamp));
    const activityData = {
      ...activity,
      timestamp: timestamp,
    };

    await setDoc(docref, activityData);
  } catch (error) {
    throw new Error("Failed to add activity: " + String(error));
  }
}
export async function getActivityData() {
  try {
    const collection_ref = collection(db, "activityData");
    const querySnapshot = await getDocs(collection_ref);
    const response = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
    })) as ActivityDataType[];
    if (response.length === 0) return null;
    console.log(response);
    return response;
  } catch (error) {
    throw new Error("Failed to get activity data: " + String(error));
  }
}
