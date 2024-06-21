import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { FaMinus, FaPlus, FaCartPlus } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import allergyIcons from "@/utils/allergyIcons"; // Assuming this utility file exists for allergy icons

const ProductModal = ({
  selectedProduct,
  setSelectedProduct,
  getProductQuantity,
  addToCart,
  updateQuantity,
}) => {
  return (
    <Transition appear show={!!selectedProduct} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => setSelectedProduct(null)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                {selectedProduct && (
                  <>
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                    >
                      {selectedProduct.name}
                    </Dialog.Title>
                    <div className="mt-2 relative">
                      {selectedProduct.imageUrl && (
                        <div className="relative w-full h-64 sm:h-80 lg:h-96 mb-4">
                          <Image
                            src={selectedProduct.imageUrl}
                            alt={selectedProduct.name}
                            fill
                            style={{ objectFit: "contain" }}
                            className="rounded"
                          />
                          {selectedProduct.discountPercentage && (
                            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                              {selectedProduct.discountPercentage}% OFF
                            </div>
                          )}
                          {selectedProduct.discountFixed && (
                            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                              {selectedProduct.discountFixed} Rf OFF
                            </div>
                          )}
                        </div>
                      )}
                      <p className="text-sm text-gray-500 dark:text-gray-300 mb-4">
                        {selectedProduct.description}
                      </p>
                      <p className="text-lg text-gray-500 dark:text-gray-300 font-semibold mb-4">
                        {selectedProduct.discountPercentage ? (
                          <>
                            <span className="line-through">
                              {selectedProduct.price} Rf
                            </span>{" "}
                            {selectedProduct.price -
                              selectedProduct.price *
                                (selectedProduct.discountPercentage / 100)}{" "}
                            Rf
                          </>
                        ) : selectedProduct.discountFixed ? (
                          <>
                            <span className="line-through">
                              {selectedProduct.price} Rf
                            </span>{" "}
                            {selectedProduct.price -
                              selectedProduct.discountFixed}{" "}
                            Rf
                          </>
                        ) : (
                          `${selectedProduct.price} Rf`
                        )}
                      </p>
                      {selectedProduct.notice && (
                        <p className="text-sm text-red-600 mb-4">
                          {selectedProduct.notice}
                        </p>
                      )}
                      <div className="flex space-x-2 mb-4">
                        {selectedProduct.allergyCodes &&
                          selectedProduct.allergyCodes.map((code) => (
                            <span key={code}>{allergyIcons[code]}</span>
                          ))}
                      </div>
                      <div className="mt-4 flex items-center justify-between space-x-2">
                        {getProductQuantity(selectedProduct.id) > 0 ? (
                          <>
                            <Button
                              onClick={() =>
                                updateQuantity(
                                  selectedProduct.id,
                                  getProductQuantity(selectedProduct.id) - 1
                                )
                              }
                            >
                              <FaMinus />
                            </Button>
                            <span>
                              {getProductQuantity(selectedProduct.id)}
                            </span>
                            <Button
                              onClick={() =>
                                updateQuantity(
                                  selectedProduct.id,
                                  getProductQuantity(selectedProduct.id) + 1
                                )
                              }
                            >
                              <FaPlus />
                            </Button>
                          </>
                        ) : (
                          !selectedProduct.soldOut && (
                            <Button onClick={() => addToCart(selectedProduct)}>
                              <FaCartPlus />
                              <span>Add</span>
                            </Button>
                          )
                        )}
                      </div>
                    </div>
                  </>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ProductModal;
