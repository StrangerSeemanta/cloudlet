import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import { handleActivity } from "./HandleActivityFirebase";
export interface AddedProductTypes {
  productId: string;
  productName: string;
  quantity: number | string;
  buyingPrice: number | string;
  productAddedAt: Date | string;
  addedBy: {
    name: string;
    uid: string;
  };
  timestamp: number;
}
export async function addProduct(productData: AddedProductTypes) {
  try {
    const docName =
      productData.productId +
      productData.productName.toLowerCase().trim().replace(" ", "_") +
      String(productData.productAddedAt);
    const referance = doc(db, "addedProductData", docName);
    const collection_ref = collection(db, "addedProductData");
    const q = query(
      collection_ref,
      where("productId", "==", productData.productId)
    );

    const querySnapshot = await getDocs(q);

    for (const doc of querySnapshot.docs) {
      const existingProduct = doc.data();
      if (
        existingProduct.productName.toLowerCase() !==
        productData.productName.toLowerCase()
      ) {
        throw new Error(
          `You have already added ${productData.productId} with ${existingProduct.productName}. Two Products Can't Contain Same Product ID`
        );
      }
    }

    const docSnap = await getDoc(referance);
    if (docSnap.exists()) {
      throw new Error(
        "You Cannot Upload Same Product Twice In A Day. Try Add This Product Tomorrow Or Check the Product Id and Product Name Again"
      );
    } else {
      await setDoc(referance, productData);
      await handleActivity({
        type: "Added Product",
        description: `Added ${productData.quantity} items of ${productData.productName} with Product ID: ${productData.productId}`,
        amount: Number(productData.buyingPrice) * Number(productData.quantity),
        date: productData.productAddedAt,
        timestamp: productData.timestamp,
      });
    }
  } catch (error) {
    throw new Error(String(error));
  }
}
export async function getAllAddedProductData() {
  try {
    const collectionRef = collection(db, "addedProductData"); // Reference to the collection
    const querySnapshot = await getDocs(collectionRef); // Fetch all documents in the collection

    // Map through the documents and return their data
    const products = querySnapshot.docs.map((doc) => ({
      ...doc.data(), // Spread the document data
    })) as AddedProductTypes[];
    if (products.length <= 0) return null;
    return products;
  } catch (error) {
    throw new Error(String(error));
  }
}
