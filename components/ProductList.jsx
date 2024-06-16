import React from "react";
import { FaPlusCircle, FaCartPlus, FaPlus, FaMinus } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const ProductList = ({
  view,
  categories,
  handleCardClick,
  getProductQuantity,
  addToCart,
  updateQuantity,
  categoryRefs,
}) => {
  return categories.map((category, index) => (
    <div key={category.id} className="mb-8 mt-1">
      <h2
        ref={(el) => (categoryRefs.current[index] = el)}
        className="text-xl sm:text-2xl text-center font-bold mb-4 w-full bg-blue-100 dark:bg-blue-900 text-black dark:text-white py-2 font-roboto-slab"
      >
        {category.name}
      </h2>
      {view === "grid" ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {category.products.map(
            (product) =>
              product.active === 1 && (
                <Card
                  key={product.id}
                  className={`border rounded-md cursor-pointer ${
                    getProductQuantity(product.id) > 0
                      ? "border-blue-500 dark:border-blue-300"
                      : ""
                  }`}
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name || "Placeholder Image"}
                    className="w-full h-32 sm:h-48 object-cover rounded-t-md"
                    onClick={() => handleCardClick(product)}
                  />
                  <CardContent className="p-4">
                    <h3 className="text-sm sm:text-md font-bold">
                      {product.name}
                    </h3>
                    {product.discountPercentage ? (
                      <p className="text-xs sm:text-sm font-semibold mt-2">
                        <span className="line-through">{product.price} Rf</span>{" "}
                        {product.price -
                          product.price *
                            (product.discountPercentage / 100)}{" "}
                        Rf
                      </p>
                    ) : product.discountFixed ? (
                      <p className="text-xs sm:text-sm font-semibold mt-2">
                        <span className="line-through">{product.price} Rf</span>{" "}
                        {product.price - product.discountFixed} Rf
                      </p>
                    ) : (
                      <p className="text-xs sm:text-sm font-semibold mt-2">
                        {product.price} Rf
                      </p>
                    )}
                    {product.notice && (
                      <p className="text-xs sm:text-sm text-red-600 mt-2">
                        {product.notice}
                      </p>
                    )}
                  </CardContent>
                  <div className="mt-4 ml-2 mb-2 flex items-center space-x-2 justify-center">
                    {getProductQuantity(product.id) > 0 ? (
                      <div className="flex items-center space-x-2">
                        <Button
                          className="p-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateQuantity(
                              product.id,
                              getProductQuantity(product.id) - 1
                            );
                          }}
                        >
                          <FaMinus />
                        </Button>
                        <span>{getProductQuantity(product.id)}</span>
                        <Button
                          className="p-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateQuantity(
                              product.id,
                              getProductQuantity(product.id) + 1
                            );
                          }}
                        >
                          <FaPlus />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                        disabled={product.soldOut === 1}
                      >
                        {product.soldOut === 1 ? "Sold Out" : <FaPlusCircle />}
                      </Button>
                    )}
                  </div>
                </Card>
              )
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {category.products.map(
            (product) =>
              product.active === 1 && (
                <div
                  key={product.id}
                  className={`border p-4 rounded-md cursor-pointer ${
                    getProductQuantity(product.id) > 0
                      ? "border-blue-500 dark:border-blue-300"
                      : ""
                  }`}
                >
                  <div onClick={() => handleCardClick(product)}>
                    <h3 className="text-sm sm:text-md font-bold">
                      {product.name}
                    </h3>
                    {product.discountPercentage ? (
                      <p className="text-xs sm:text-sm font-semibold mt-2">
                        <span className="line-through">{product.price} Rf</span>{" "}
                        {product.price -
                          product.price *
                            (product.discountPercentage / 100)}{" "}
                        Rf
                      </p>
                    ) : product.discountFixed ? (
                      <p className="text-xs sm:text-sm font-semibold mt-2">
                        <span className="line-through">{product.price} Rf</span>{" "}
                        {product.price - product.discountFixed} Rf
                      </p>
                    ) : (
                      <p className="text-xs sm:text-sm font-semibold mt-2">
                        {product.price} Rf
                      </p>
                    )}
                    {product.notice && (
                      <p className="text-xs sm:text-sm text-red-600 mt-2">
                        {product.notice}
                      </p>
                    )}
                  </div>
                  <div className="mt-4 flex items-center space-x-2 justify-center">
                    {getProductQuantity(product.id) > 0 ? (
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          className="p-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateQuantity(
                              product.id,
                              getProductQuantity(product.id) - 1
                            );
                          }}
                        >
                          <FaMinus />
                        </Button>
                        <span>{getProductQuantity(product.id)}</span>
                        <Button
                          variant="ghost"
                          className="p-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateQuantity(
                              product.id,
                              getProductQuantity(product.id) + 1
                            );
                          }}
                        >
                          <FaPlus />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                        disabled={product.soldOut === 1}
                      >
                        {product.soldOut === 1 ? "Sold Out" : <FaCartPlus />}
                        <span>Add</span>
                      </Button>
                    )}
                  </div>
                </div>
              )
          )}
        </div>
      )}
    </div>
  ));
};

export default ProductList;
