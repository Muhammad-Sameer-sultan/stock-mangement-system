import React, { useState } from 'react';

type Product = {
  date: string;
  price: number;
  "product-slug": string;
  quantity: number;
  _id?: string;
};

interface ProductListProps {
  setProductList: React.Dispatch<React.SetStateAction<Product[]>>;
    getProductList: () => Promise<void>;
}

const SearchProduct: React.FC<ProductListProps> = ({ setProductList, getProductList }) => {
  const [querySearch, setQuerySearch] = useState<string>('');
  const [searchDisabled, setSearchDisabled] = useState<boolean>(false);
  const closeSearch = () => {
    setQuerySearch('');
    setSearchDisabled(false);
    getProductList();
  };

  const queryHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/search?query=${querySearch}`);

      if (response.ok) {
        const { products } = await response.json();
        setProductList(products);
        setSearchDisabled(true);
      } else {
        console.log('Product search failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="my-4 bg-gray-100 rounded-lg p-3">
      <h1 className="text-3xl bg-gray-100 p-3 rounded-lg font-bold">Search Product:</h1>
      <form className="flex relative" onSubmit={queryHandler}>
        <input
          required
          name="searchTerm"
          type="text"
          className="search w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 mr-2"
          placeholder="Enter product name"
          value={querySearch}
          onChange={(e) => setQuerySearch(e.target.value)}
          disabled={searchDisabled}
        />
        <span className={`searchSpan absolute top-[50%] translate-y-[-50%] left-4 bg-gray-500 px-3 text-white ${searchDisabled ? '' : 'hidden'}`}>
          {querySearch}{' '}
          <span onClick={closeSearch} className="ms-1 hover:cursor-pointer font-bold">
            X
          </span>
        </span>
        <button
          type="submit"
          className="searchbtn px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
          disabled={!querySearch || searchDisabled}
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchProduct;
