"use client";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import { GoTasklist } from "react-icons/go";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import "./globals.css";

type Product = {
  date: string;
  price: number;
  "product-slug": string;
  quantity: number;
  _id?: string;
};

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

  const queryHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const search = document.querySelector(".search") as HTMLInputElement | null;
    const searchSpan = document.querySelector(
      ".searchSpan"
    ) as HTMLElement | null;

    if (search && searchSpan) {
      try {
        const response = await fetch(`/api/search?query=${querySearch}`);

        if (response.ok) {
          const data = await response.json();
          console.log(data.products);
          console.log("Product search successful");
          setProductList(data.products);
          search.setAttribute("disabled", "true");
          searchSpan.classList.remove("hidden");
          const searchBtn = document.querySelector(
            ".searchbtn"
          ) as HTMLButtonElement | null;
          if (searchBtn) {
            searchBtn.setAttribute("disabled", "true");
          }
        } else {
          console.log("Product search failed");
        }
      } catch (error) {
        console.error("Error: ", error);
      }
    } else {
      console.error("Search input or span not found");
    }
  };

  const closeSearch = () => {
    const searchSpan = document.querySelector(".searchSpan") as HTMLElement;
    const searchBtn = document.querySelector(".searchbtn") as HTMLButtonElement;
    const search = document.querySelector(".search") as HTMLInputElement;

    if (searchSpan && searchBtn && search) {
      searchSpan.classList.add("hidden");
      searchBtn.removeAttribute("disabled");
      search.removeAttribute("disabled");
      setQuerySearch("");
    }

    getProductList();
  };
  const editBtn = async (id: string | undefined) => {
    // id="dssf4443"
    console.log("Edit id==>", id);
    const newPrice = 444;
    const newSlug = null;
    const newQuantity = "mu quntity";

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

  const deleteBtn = async (id: string | undefined) => {
    console.log("delete id==>", id);
    try {
      const response = await fetch("/api/products", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        getProductList();

        console.log("Product delete successfully");
      } else {
        console.log("Product delete unsuccessful");
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <>
      <Header />
      <div className="container mx-auto my-10 rounded-lg shadow-md p-3">
        <form
          className="container mx-auto p-6 bg-gray-100 rounded-lg"
          onSubmit={addProduct}
        >
          <h1 className="text-3xl font-bold mb-6 ">Add a Product</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            <div className="">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Product Name:
              </label>
              <input
                required
                onChange={onChangeHandler}
                name="product-slug"
                type="text"
                className="w-full relative px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                placeholder="Enter product name"
                value={productForm["product-slug"]}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Product Price:
              </label>
              <input
                required
                onChange={onChangeHandler}
                name="price"
                type="number"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                placeholder="Enter product price"
                value={productForm.price}
                min={1}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Quantity:
              </label>
              <input
                required
                onChange={onChangeHandler}
                name="quantity"
                type="number"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                placeholder="Enter quantity"
                value={productForm.quantity}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Date:
              </label>
              <input
                required
                onChange={onChangeHandler}
                name="date"
                type="date"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                placeholder="Enter category"
                value={productForm.date}
              />
            </div>
          </div>
          <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300">
            Add Product
          </button>
        </form>

        <div className="my-4  bg-gray-100 rounded-lg p-3">
          <h1 className="text-3xl bg-gray-100 p-3 rounded-lg font-bold">
            Search Product:
          </h1>
          <form className="flex relative" onSubmit={queryHandler}>
            <input
              required
              name="searchTerm"
              type="text"
              className="search w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 mr-2"
              placeholder="Enter product name"
              value={querySearch}
              onChange={(e) => setQuerySearch(e.target.value)}
            />
            <span className="searchSpan absolute top-[50%] translate-y-[-50%] left-4 bg-gray-500 px-3 text-white hidden">
              {querySearch}{" "}
              <span
                onClick={closeSearch}
                className="ms-1 hover:cursor-pointer  font-bold"
              >
                X
              </span>
            </span>
            <button
              type="submit"
              className="searchbtn px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
            >
              Search
            </button>
          </form>
        </div>

        <div className="">
          <h1 className="text-3xl bg-gray-100 p-3 rounded-lg font-bold mb-6">
            Display Products
          </h1>
          <table className="min-w-full bg-white border border-gray-300 rounded-md overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 border-b">Product Name</th>
                <th className="py-2 px-4 border-b">Product Price</th>
                <th className="py-2 px-4 border-b">Quantity</th>
                <th className="py-2 px-4 border-b">Category</th>
              </tr>
            </thead>
            <tbody>
              {productList && productList.length !== 0 ? (
                productList.map((product) => (
                  <tr className=" bg-gray-400" key={product._id}>
                    <td className="relative  py-2 px-4  border ">
                      <span className="group  relative  me-9">
                        <GoTasklist className=" inline-block text-purple-500 cursor-pointer hover:first-child:bg-red-900" />
                        <div className="hidden absolute bg-gray-400 p-1 px-2 top-[50%] translate-y-[-50%]  left-[-20px] z-50  gap-1 items-center justify-center ">
                          {" "}
                          <CiEdit
                            onClick={() => editBtn(product._id)}
                            className=" hover:text-purple-700 hover:cursor-pointer"
                          />
                          {/* <MdDelete onClick={()=>deleteBtn(product._id)} className=" hover:text-red-700 hover:cursor-pointer" /> */}
                        </div>
                      </span>{" "}
                      {product["product-slug"]}
                      <input
                      value={product["product-slug"]}
                        className=" px-2 absolute left-10 w-auto"
                        type="text"
                      />
                    </td>
                    <td className="relative py-2 px-4 border">
                      Rs. {product.price}
                      <input
                      value={product.price}
                      onChange={onChangeHandler}
                        className=" px-2 absolute left-3 w-auto"
                        type="number"
                      />
                    </td>
                    <td className="relative py-2 px-4 border">
                      {product.quantity}
                      <input
                      value={product.quantity}
                      onChange={onChangeHandler}
                        className=" px-2 absolute left-3 w-auto"
                        type="number"
                      />
                    </td>
                    <td className="relative py-2 px-4 border">
                      {product.date}
                      <input
                      
                      value={product.date}
                      onChange={onChangeHandler}
                        className=" px-2 absolute left-3 w-auto"
                        type="date"
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td>No Product Available to show</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Home;
