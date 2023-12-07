import React, { FC, useState } from 'react';
import { GoTasklist } from 'react-icons/go';
import { CiEdit } from 'react-icons/ci';
import { MdCheck } from 'react-icons/md';
import { MdDelete } from "react-icons/md";
import { CgSpinnerTwo } from "react-icons/cg";type Product = {
  date: string;
  price: number;
  "product-slug": string;
  quantity: number;
  _id?: string;
};

interface DisplayProductProps {
  productList: Product[];
  getProductList: () => Promise<void>;
  loading:boolean

}

const DisplayProduct: FC<DisplayProductProps> = ({ productList,getProductList ,loading}) => {
  const [editform, seteditform] = useState<Product>({
    "product-slug": "",
    price: 0,
    quantity: 0,
    date: new Date().toISOString().split("T")[0],
  });
  const [visibleInputs, setVisibleInputs] = useState<boolean[]>([]);

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('handler click2')
    const { name, value } = e.target;
    const formattedValue =
      e.target.type === "date"
        ? new Date(value).toISOString().split("T")[0]
        : value;
    seteditform({ ...editform, [name]: formattedValue });
  };

  const toggleInputVisibility = (index: number,targetProduct: Product ) => {
    const updatedVisibility:any = [];
    
    updatedVisibility[index] = !updatedVisibility[index];
    setVisibleInputs(updatedVisibility);
    seteditform(targetProduct)
  };

  const formattedDate = (date: string) => new Date(date).toISOString().split('T')[0];

  const editDone = async (id: string | undefined) => {
    console.log("Edit id==>", id);
    const newPrice = 5001;
    const newSlug = editform['product-slug'];
    const newQuantity = editform.quantity;

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
        setVisibleInputs([])
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
            <th className="py-2 px-4 border-b">Date</th>
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
                  <MdCheck onClick={()=>{editDone(product._id)}}
                   className="inline-block  rounded-full bg-green-500 text-white hover:text-green-500 hover:bg-white cursor-pointer me-9" />
                ) : (
                  <span className="group relative me-9">
                    <GoTasklist className=" inline-block  text-purple-500 cursor-pointer " />
                    <div className="hidden absolute bg-white p-1 px-2 top-[50%] translate-y-[-50%] left-[-20px] z-50 gap-1 items-center justify-center">
                      <CiEdit
                        onClick={() => toggleInputVisibility(index,product)}
                        className=" hover:scale-[1.5] text-green-500 hover:cursor-pointer"
                      />
                      <MdDelete
                        onClick={() => deleteBtn(product._id)}
                        className=" hover:scale-[1.5] text-red-500 hover:cursor-pointer"
                      />
                    </div>
                  </span>
                )}
                {product['product-slug']}
                <input
                  value={editform['product-slug']}
                  className={visibleInputs[index] ? 'px-2 absolute left-10 w-auto ms-5	' : 'hidden'}
                  type="text"
                  name="product-slug"
                  onChange={onChangeHandler}
                />
              </td>
              <td className="relative py-2 px-4 border">
                <input
                  value={editform.price}
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
                  value={editform.quantity}
                  onChange={onChangeHandler}
                  className={visibleInputs[index] ? 'px-2 absolute left-3 w-[80%]' : 'hidden'}
                  type="number"
                  name="quantity"
                />
              </td>
              <td className="relative py-2 px-4 border">
                {formattedDate(product.date)}
                <input
                  value={editform.date}
                  onChange={onChangeHandler}
                  className={visibleInputs[index] ? 'px-2 absolute left-3 w-[80%]' : 'hidden'}
                  type="date"
                  name="date"
                />
              </td>
            </tr>
          ))}
          {
            !loading?      <tr ><td  colSpan={4} className=""><CgSpinnerTwo className='spinner text-5xl p-1 mx-auto' /></td> </tr> :productList.length<1 && <tr><td>No product available to show</td></tr>

          }
        </tbody>
      </table>
    </div>
  );
};

export default DisplayProduct;
