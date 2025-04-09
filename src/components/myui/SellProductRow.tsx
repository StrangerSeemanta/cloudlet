import { TableCell, TableRow } from "@/components/ui/table";
import { Input } from "../ui/input";
import { ChangeEvent, useState } from "react";
import { getStockProduct, StockProduct } from "@/firebase/StockFirebase";
import { toast } from "sonner";

function SellProductRow({
  productNo,
  item,
  onChange,
}: {
  productNo: number;
  item: {
    productName: string;
    productId: string;
    selling_quantity: string | number;
    selling_price: string | number;
    total_price: string | number;
  };
  onChange: (updatedItem: typeof item) => void;
}) {
  const [loadingProductName, setLoadingProductName] = useState(false);
  const [productData, setProductData] = useState<StockProduct | null>(null);

  const handleProductIdChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const newProductId = e.target.value.trim().toUpperCase();
    onChange({
      ...item,
      productId: newProductId,
    });

    try {
      setLoadingProductName(true);
      const allStockData = await getStockProduct();
      if (!allStockData) throw new Error("No stock data found.");
      // Filter the stock data to find the product with the matching ID
      const matched = allStockData.filter((p) =>
        newProductId.toUpperCase().includes(p.productId.toUpperCase())
      );
      if (matched.length !== 1)
        throw new Error("Product not found or duplicated.");

      const product = matched[0];
      setProductData(product);
      onChange({
        ...item,
        productId: newProductId,
        productName: product.productName,
      });
    } catch (error) {
      toast.error("Invalid Product ID", { description: String(error) });
      setProductData(null);
      onChange({
        ...item,
        productId: newProductId,
        productName: "",
      });
    } finally {
      setLoadingProductName(false);
    }
  };

  const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
    const quantity = e.target.value;
    onChange({
      ...item,
      selling_quantity: quantity,
      total_price: String(Number(quantity) * Number(item.selling_price || 0)),
    });
  };

  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const price = e.target.value;
    onChange({
      ...item,
      selling_price: price,
      total_price: String(Number(item.selling_quantity || 0) * Number(price)),
    });
  };

  return (
    <TableRow className="border-b">
      <TableCell>
        {(productNo + 1)
          .toString()
          .padStart(productNo.toString().length + 1, "0")}
      </TableCell>
      <TableCell>
        <Input
          required
          name="productId"
          id={"productId" + productNo.toString()}
          value={item.productId}
          onChange={handleProductIdChange}
          className="border-1 border-gray-600/50 font-Nunito max-w-28 p-2"
          placeholder="Product Id"
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-5 transition">
          <Input
            required
            name="productName"
            id={"productName" + productNo.toString()}
            value={loadingProductName ? "loading..." : item.productName}
            placeholder="Product Name"
            className="transition focus:ring-0 focus-visible:ring-0 font-Nunito"
            readOnly
          />
        </div>
      </TableCell>
      <TableCell>
        <div className="gap-1 justify-center flex items-center">
          <Input
            required
            id={"selling_quantity" + productNo.toString()}
            name="selling_quantity"
            value={item.selling_quantity}
            onChange={handleQuantityChange}
            max={productData?.currentStock}
            className="border-1 border-gray-600/50 max-w-14 p-2 font-Roboto"
            type="number"
          />
          <h6 className="text-sm font-Nunito font-bold italic text-green-700">
            {productData && `(${productData.currentStock})`}
          </h6>
        </div>
      </TableCell>
      <TableCell>
        <Input
          required
          id={"selling_price" + productNo.toString()}
          name="selling_price"
          value={item.selling_price}
          onChange={handlePriceChange}
          className="border-1 border-gray-600/50 max-w-20 p-2 font-Roboto"
          type="number"
        />
      </TableCell>
      <TableCell>
        <Input
          required
          name="total_price"
          id={"total_price" + productNo.toString()}
          value={Number(item.selling_price) * Number(item.selling_quantity)}
          placeholder="Total Price"
          className="transition focus:ring-0 focus-visible:ring-0 font-Roboto max-w-24"
          readOnly
          type="text"
        />
      </TableCell>
    </TableRow>
  );
}

export default SellProductRow;
