import React, { FC, useState } from 'react';
import { GoTasklist } from 'react-icons/go';
import { CiEdit } from 'react-icons/ci';
import { MdCheck } from 'react-icons/md';
import { MdDelete } from "react-icons/md";

type Product = {
  date: string;
  price: number;
  "product-slug": string;
  quantity: number;
  _id?: string;
};

interface DisplayProductProps {
  productList: Product[];
  onChangeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  getProductList: () => Promise<void>;

}

const DisplayProduct: FC<DisplayProductProps> = ({ productList, onChangeHandler,getProductList }) => {
  const [visibleInputs, setVisibleInputs] = useState<boolean[]>([]);
  const [action, setAction] = useState<boolean>(false);

  const toggleInputVisibility = (index: number) => {
    const updatedVisibility = [...visibleInputs];
    updatedVisibility[index] = !updatedVisibility[index];
    setVisibleInputs(updatedVisibility);
    setAction(!action);
  };

  const formattedDate = (date: string) => new Date(date).toISOString().split('T')[0];

  const editDone=(id:number)=>{
    toggleInputVisibility(id)
  }

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
    <div className="">
      <h1 className="text-3xl bg-gray-100 p-3 rounded-lg font-bold mb-6">Display Products</h1>
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
          {productList.map((product, index) => (
            <tr
              className={visibleInputs[index] ? 'bg-gray-400' : ''}
              key={product._id}
            >
              <td className="relative  py-2 px-4  border">
                {visibleInputs[index] ? (
                  <MdCheck onClick={()=>{editDone(index)}} className="inline-block rounded-full bg-green-900 text-white cursor-pointer me-9" />
                ) : (
                  <span className="group relative me-9">
                    <GoTasklist className=" inline-block text-purple-500 cursor-pointer " />
                    <div className="hidden absolute bg-gray-400 p-1 px-2 top-[50%] translate-y-[-50%] left-[-20px] z-50 gap-1 items-center justify-center">
                      <CiEdit
                        onClick={() => toggleInputVisibility(index)}
                        className="hover:text-purple-700 hover:cursor-pointer"
                      />
                      <MdDelete
                        onClick={() => deleteBtn(product._id)}
                        className="hover:text-purple-700 hover:cursor-pointer"
                      />
                    </div>
                  </span>
                )}
                {product['product-slug']}
                <input
                  value={product['product-slug']}
                  className={visibleInputs[index] ? 'px-2 absolute left-10 w-auto ms-5	' : 'hidden'}
                  type="text"
                  name="product-slug"
                  onChange={onChangeHandler}
                />
              </td>
              <td className="relative py-2 px-4 border">
                <input
                  value={product.price}
                  onChange={onChangeHandler}
                  className={visibleInputs[index] ? 'px-2 absolute left-3 w-[80%]' : 'hidden'}
                  type="number"
                  name="price"
                />
                Rs. {product.price}
              </td>
              <td className="relative py-2 px-4 border">
                {product.quantity}
                <input
                  value={product.quantity}
                  onChange={onChangeHandler}
                  className={visibleInputs[index] ? 'px-2 absolute left-3 w-[80%]' : 'hidden'}
                  type="number"
                  name="quantity"
                />
              </td>
              <td className="relative py-2 px-4 border">
                {formattedDate(product.date)}
                <input
                  value={product.date}
                  onChange={onChangeHandler}
                  className={visibleInputs[index] ? 'px-2 absolute left-3 w-[80%]' : 'hidden'}
                  type="number"
                  name="quantity"
                />
              </td>
            </tr>
          ))}
          {productList.length<1 && <tr><td>No product available to show</td></tr>}
        </tbody>
      </table>
    </div>
  );
};

export default DisplayProduct;
