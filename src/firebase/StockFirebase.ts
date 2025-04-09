import {
  AddedProductTypes,
  getAllAddedProductData,
} from "./ProductAddFirebase";
import { getAllSoldProductData } from "./SoldProductFirebase";

export interface StockProduct {
  currentStock: number;
  productId: string;
  productName: string;
  buyingPrice: number | string;
  addedBy: {
    name: string;
    uid: string;
  };
  timestamp: number;
  totalAdded: number;
  totalSold: number;
}
export async function getStockProduct() {
  try {
    const addedProducts = await getAllAddedProductData();
    const soldProducts = await getAllSoldProductData();
    if (!addedProducts) return null;

    // Step 1: Group added products by productId and sum total added quantity
    const productMap = new Map<
      string,
      Omit<AddedProductTypes, "quantity"> & { totalAdded: number }
    >();

    addedProducts.forEach((product) => {
      if (!productMap.has(product.productId)) {
        productMap.set(product.productId, {
          ...product,
          totalAdded: Number(product.quantity),
        });
      } else {
        const existing = productMap.get(product.productId)!;
        productMap.set(product.productId, {
          ...existing,
          totalAdded: existing.totalAdded + Number(product.quantity),
        });
      }
    });

    // Step 2: Calculate total sold quantity per productId
    const soldMap = new Map<string, number>();
    if (soldProducts) {
      soldProducts.forEach((soldProduct) => {
        soldProduct.sold_products.forEach((sold) => {
          const currentSoldQty = soldMap.get(sold.productId) || 0;
          soldMap.set(
            sold.productId,
            currentSoldQty + Number(sold.selling_quantity)
          );
        });
      });
    }

    // Step 3: Create final stock data by merging added & sold information
    const response: StockProduct[] = Array.from(productMap.values()).map(
      (product) => {
        const totalSold = soldMap.get(product.productId) || 0;
        return {
          ...product,
          totalSold: totalSold,
          currentStock: product.totalAdded - totalSold, // Stock calculation
        };
      }
    );

    return response;
  } catch (error) {
    throw new Error("Failed To Get Stock: " + String(error));
  }
}
