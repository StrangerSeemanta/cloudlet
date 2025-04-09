import { DailyExpenseType } from "@/firebase/DailyExpenseFirebase";
import { AddedProductTypes } from "@/firebase/ProductAddFirebase";
import { SoldProductDataType } from "@/firebase/SoldProductFirebase";
import { getStockProduct } from "@/firebase/StockFirebase";

export const getTotalIncomes = (
  soldProductData: SoldProductDataType[] | null
) => {
  const soldProducts = soldProductData;
  if (!soldProducts || soldProducts.length <= 0) return 0;
  const soldProductMap = new Map<string, number>();
  soldProducts.forEach((sold) => {
    const currentSold = soldProductMap.get(sold.timestamp.toString()) || 0;
    soldProductMap.set(
      sold.timestamp.toString(),
      currentSold +
        Number(
          sold.installment_history
            .map((installment) => Number(installment.amount))
            .reduce((a, b) => a + b)
        )
    );
  });

  const response = Array.from(soldProductMap.values()).reduce((a, b) => a + b);
  return response;
};
export const getTotalPending = (
  soldProductData: SoldProductDataType[] | null
) => {
  const soldProducts = soldProductData;
  if (!soldProducts || soldProducts.length <= 0) return 0;
  const pendingAmountMap = new Map<string, number>();
  soldProducts.forEach((sold) => {
    const currentSold = pendingAmountMap.get(sold.timestamp.toString()) || 0;
    pendingAmountMap.set(
      sold.timestamp.toString(),
      currentSold + Number(sold.pending_amount)
    );
  });

  const response = Array.from(pendingAmountMap.values()).reduce(
    (a, b) => a + b
  );
  return response;
};
// Total Expense Calculation (Daily Expense + Total Product Buying)

export const getTotalExpense = (
  expenseData: DailyExpenseType[] | null,
  addedProductsData: AddedProductTypes[] | null
) => {
  const addedProduct = addedProductsData;
  const expenses = expenseData;
  if (!addedProduct && !expenses) return 0;
  const x = totalSpendOnProduct(addedProduct);
  const y = totalSideExpenses(expenses);
  const total = x + y;
  return total;
};
function totalSpendOnProduct(addedProductsData: AddedProductTypes[] | null) {
  if (!addedProductsData || addedProductsData.length <= 0) return 0;
  const addedProducts = addedProductsData;
  if (!addedProducts) return 0;
  const totalSpendMap = new Map<string, number>();

  addedProducts.forEach((product) => {
    const totalSpend = totalSpendMap.get(product.productId) || 0;
    totalSpendMap.set(
      product.productId,
      totalSpend + Number(product.quantity) * Number(product.buyingPrice)
    );
  });

  const response = Array.from(totalSpendMap.values()).reduce((a, b) => a + b);

  return response;
}

function totalSideExpenses(expenseData: DailyExpenseType[] | null) {
  if (!expenseData || expenseData.length <= 0) return 0;

  const totalExpenseMap = new Map<string, number>();
  expenseData.forEach((data) => {
    const currentTotalExpense =
      totalExpenseMap.get(data.timestamp.toString()) || 0;
    totalExpenseMap.set(
      data.timestamp.toString(),
      currentTotalExpense + Number(data.expense_amount)
    );
  });

  const response = Array.from(totalExpenseMap.values()).reduce((a, b) => a + b);

  return response;
}
export async function getTotalProductsInStock() {
  try {
    const stocks = await getStockProduct();
    if (!stocks || stocks.length <= 0) return 0;
    const totalCurrentStockMap = new Map<string, number>();
    stocks.forEach((product) => {
      const currentStock = totalCurrentStockMap.get(product.productId) || 0;
      totalCurrentStockMap.set(
        product.productId,
        currentStock + product.currentStock
      );
    });

    const response = Array.from(totalCurrentStockMap.values()).reduce(
      (a, b) => a + b
    );
    return response;
  } catch (error) {
    throw new Error("Can't Get Total Products: " + String(error));
  }
}
