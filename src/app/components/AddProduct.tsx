import { useState } from "react";

interface AddProductProps {
  getProductList: () => Promise<void>;
}

const AddProduct: React.FC<AddProductProps> = ({ getProductList }) => {

    // states
  const [productForm, setProductForm] = useState({
    "product-slug": "",
    price: 0,
    quantity: 1,
    date: new Date().toISOString().split("T")[0],
  });


//   functions
  
  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const formattedValue = name === "date" ? new Date(value).toISOString().split("T")[0] : value;
    setProductForm({ ...productForm, [name]: formattedValue });
  };


  const addProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if(productForm){

      }
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productForm),
      });
      if (response.ok) {
        getProductList();
        setProductForm({
          "product-slug": "",
          price: 0,
          quantity: 1,
          date: new Date().toISOString().split("T")[0],
        });
        console.log("Product added successfully");
      } else {
        console.log("Product add unsuccessful");
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <form className="container mx-auto p-6 bg-gray-100 rounded-lg" onSubmit={addProduct}>
      <h1 className="text-3xl font-bold mb-6">Add a Product</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {["product-slug", "price", "quantity", "date"].map((field) => (
          <div key={field}>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {field === "product-slug" ? "Product Name" : field === "price" ? "Product Price" : field === "quantity" ? "Quantity" : "Date"}
            </label>
            <input
              required
              onChange={onChangeHandler}
              name={field}
              type={field === "date" ? "date" : field === "quantity" || field === "price" ? "number" : field === "product-slug" ? "text" : 'text'}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              placeholder={`Enter ${field === "product-slug" ? "product name" : field === "price" ? "product price" : field === "quantity" ? "quantity" : "date"}`}
              value={productForm[field as keyof typeof productForm]}
              minLength={field === "price" ? 2 : undefined}
              pattern={field === 'price' || field === 'quantity' ? '^[1-9]\d?$' : undefined}
            />
          </div>
        ))}
      </div>
      <button type="submit" className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300">
        Add Product
      </button>
    </form>
  );
};

export default AddProduct;
