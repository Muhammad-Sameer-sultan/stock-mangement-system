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

const Home: React.FC = () => {
  const [loading, setloading] = useState<boolean>(false)

  const [productForm, setProductForm] = useState<Product>({
    "product-slug": "",
    price: 0,
    quantity: 1,
    date: new Date().toISOString().split("T")[0],
  });

  const [productList, setProductList] = useState<Product[]>([]);



  const getProductList = async () => {
    setloading(true)
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
    setloading(false)

  };

  useEffect(() => {
    getProductList();
  }, []);



  return (
    <>
      <Header />
      <div className="container mx-auto my-10 rounded-lg shadow-md p-3">
        <AddProduct getProductList={getProductList} />

       <SearchProduct setProductList={setProductList} getProductList={getProductList} />

       <DisplayProduct productList={productList} loading={loading}  getProductList={getProductList}/>
      </div>
    </>
  );
};

export default Home;
