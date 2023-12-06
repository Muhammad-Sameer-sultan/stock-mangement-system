"use client";
import { useState, useEffect } from "react";
import Header from "./components/Header";

import "./globals.css";
import AddProduct from "./components/AddProduct";
import SearchProduct from "./components/SearchProduct";
import DisplayProduct from "./components/DisplayProduct";

type Product = {
  date: string;
  price: number;
  "product-slug": string;
  quantity: number;
  _id?: string;
};
interface AddProductProps {
  getProductList: () => Promise<void>;
}
const Home: React.FC = () => {
  const [querySearch, setQuerySearch] = useState<string>("");
  const [productForm, setProductForm] = useState<Product>({
    "product-slug": "",
    price: 0,
    quantity: 1,
    date: new Date().toISOString().split("T")[0],
  });
  const [editForm, seteditForm] = useState<Product>({
    "product-slug": "",
    price: 0,
    quantity: 1,
    date: new Date().toISOString().split("T")[0],
  });
  const [productList, setProductList] = useState<Product[]>([]);



  const getProductList = async () => {
    try {
      const response = await fetch("/api/products");
      if (response.ok) {
        const data = await response.json();
        setProductList(data.allProucts);
        console.log("Get all products successfully", data.allProucts);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    getProductList();
  }, []);

  const addProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
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

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const formattedValue =
      e.target.type === "date"
        ? new Date(value).toISOString().split("T")[0]
        : value;
    setProductForm({ ...productForm, [name]: formattedValue });
  };

 

  
  const editBtn = async (id: string | undefined) => {
    // id="dssf4443"
    console.log("Edit id==>", id);
    const newPrice = 444;
    const newSlug = null;
    const newQuantity = 55;

    try {
      const response = await fetch("/api/products", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, newPrice, newSlug, newQuantity }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        getProductList();

        console.log("Product edit successfully");
      } else {
        console.log("Product edit unsuccessful");
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  

  return (
    <>
      <Header />
      <div className="container mx-auto my-10 rounded-lg shadow-md p-3">
        <AddProduct getProductList={getProductList} />

       <SearchProduct setProductList={setProductList} getProductList={getProductList} />

       <DisplayProduct productList={productList} onChangeHandler={onChangeHandler} getProductList={getProductList}/>
      </div>
    </>
  );
};

export default Home;
