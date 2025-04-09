import { Fragment } from "react/jsx-runtime";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormEvent, useContext, useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AddedProductTypes, addProduct } from "@/firebase/ProductAddFirebase";
import { AuthContext } from "@/context/authContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { AlertDestructive } from "@/components/ui/AlertDestructive";
import { getformattedDate } from "@/utils/getDateByRange";
import { useNavigate } from "react-router-dom";

function AddProductPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isAdding, setAdding] = useState(false);
  const [errorMsg, setError] = useState("");
  const [formData, setFormData] = useState({
    product_id: "",
    product_name: "",
    quantity: "",
    price: "",
  });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleProductUpload = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user || !user.displayName)
      return toast("You Need To Log In First! And Be Sure You Have A Name");

    if (
      !formData.product_id ||
      !formData.product_name ||
      !formData.quantity ||
      !formData.price
    ) {
      return toast("All fields are required!");
    }
    setAdding(true);
    const ProductDATA: AddedProductTypes = {
      productId: formData.product_id.toUpperCase(),
      productName: formData.product_name.toLowerCase(),
      quantity: formData.quantity,
      buyingPrice: formData.price,
      productAddedAt: getformattedDate(new Date()),
      addedBy: {
        name: user.displayName,
        uid: user.uid,
      },
      timestamp: Date.now(),
    };
    addProduct(ProductDATA)
      .then(() => {
        toast("Successfully Product Added ");
        setAdding(false);
        navigate("/products");
      })
      .catch((error) => {
        toast.error("Failed To Add The Product. Try Again", {
          description: String(error),
        });
        setError(String(error));
        setAdding(false);
      });
  };

  return (
    <Fragment>
      <Card>
        <CardContent>
          <form action="" onSubmit={handleProductUpload}>
            <div className="space-y-4">
              <Label htmlFor="product_id">Product ID</Label>
              <Input
                required
                name="product_id"
                id="product_id"
                value={formData.product_id}
                onChange={handleInputChange}
                placeholder="Product Id"
                className="uppercase"
              />
              <Label htmlFor="product_name">Name</Label>
              <Input
                name="product_name"
                id="product_name"
                value={formData.product_name}
                onChange={handleInputChange}
                placeholder="Product Name"
              />
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                name="quantity"
                id="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                placeholder="Quantity"
                type="number"
              />
              <Label htmlFor="price">Buying Price / ( Per Item ) </Label>
              <Input
                name="price"
                id="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="Price Per Item"
                type="number"
              />
              <Label htmlFor="total_spend">Total Buying Price </Label>
              <Input
                name="total_spend"
                id="total_spend"
                value={
                  Number(formData.price) * Number(formData.quantity) + " Taka"
                }
                placeholder="Price Per Item"
                type="text"
                disabled
              />
              {errorMsg && <AlertDestructive>{errorMsg}</AlertDestructive>}
              <Button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-800"
              >
                {isAdding ? (
                  <>
                    <span>Working... </span>
                    <Loader2 className="animate-spin" />
                  </>
                ) : (
                  <span>Add Product</span>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Fragment>
  );
}

export default AddProductPage;
