import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import { User } from "firebase/auth";
export interface UserData extends User {
  password: string | number | boolean | null;
  completedSteps: number[];
}
export const saveUserData = async (user: User) => {
  try {
    const ref = doc(db, "userData", user.uid);
    const data = Object.fromEntries(
      Object.entries(user.toJSON()).map(([key, val]) => [
        key,
        val === undefined ? null : val,
      ])
    );
    await setDoc(ref, data);
  } catch (error) {
    console.log(error);
  }
};

export const updateUserData = async (
  userUID: string,
  field: string,
  value: string | string[] | number | number[] | boolean | boolean[] | null
) => {
  try {
    const ref = doc(db, "userData", userUID); // Reference to the Firestore document

    // Update the specific field with the provided value
    await updateDoc(ref, { [field]: value });
  } catch (error) {
    console.error("Error updating user data:", error);
    throw new Error(String(error));
  }
};

export const getUserData = async (user: User) => {
  try {
    const ref = doc(db, "userData", user.uid);
    const snapshot = await getDoc(ref);
    if (snapshot.exists()) {
      return snapshot.data() as UserData;
    } else {
      console.error("No user data found");
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const checkEmailExists = async (email: string) => {
  const usersRef = collection(db, "userData");
  const q = query(usersRef, where("email", "==", email));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty; // true if email exists
};
