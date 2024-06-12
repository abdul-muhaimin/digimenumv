"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { useTable, useSortBy, useGlobalFilter } from "react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { FiMoreVertical, FiX, FiTrash2, FiEdit } from "react-icons/fi";
import 'react-toastify/dist/ReactToastify.css';

const GlobalFilter = ({ globalFilter, setGlobalFilter }) => {
  return (
    <Input
      value={globalFilter || ""}
      onChange={(e) => setGlobalFilter(e.target.value || undefined)}
      placeholder={`Search all columns...`}
      className="mb-4"
    />
  );
};

// Custom Modal Component
const Modal = ({ show, onClose, children }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-lg">
        {children}
        <button onClick={onClose} className="mt-4 bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded">
          Close
        </button>
      </div>
    </div>
  );
};

const ProductsPage = () => {
  const { user } = useUser();
  const [products, setProducts] = useState([]);
  const [editProductId, setEditProductId] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProducts();
    }
  }, [user]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`/api/products`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data || []);
      } else {
        toast.error("Failed to fetch products");
      }
    } catch (error) {
      toast.error("An error occurred while fetching products");
    }
  };

  const handleDeleteProduct = async (id) => {
    const confirmed = true; // Replace with actual modal confirmation logic
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (response.ok) {
        toast.success('Product deleted successfully');
        setProducts((prev) => prev.filter((product) => product.id !== id));
      } else {
        toast.error('Failed to delete product');
      }
    } catch (error) {
      toast.error('An error occurred while deleting product');
    }
  };

  const handleRemoveImage = async (id) => {
    const confirmed = true; // Replace with actual modal confirmation logic
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/products/${id}/image`, { method: 'DELETE' });
      if (response.ok) {
        toast.success('Image removed successfully');
        setProducts((prev) =>
          prev.map((product) =>
            product.id === id ? { ...product, imageUrl: '' } : product
          )
        );
      } else {
        toast.error('Failed to remove image');
      }
    } catch (error) {
      toast.error('An error occurred while removing image');
    }
  };

  const handleEditProduct = (product) => {
    setEditProductId(product.id);
    setEditProduct({ ...product });
    setShowModal(true);
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`/api/products/${editProductId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editProduct),
      });
      if (response.ok) {
        toast.success('Product updated successfully');
        setProducts((prev) =>
          prev.map((product) =>
            product.id === editProductId ? { ...editProduct } : product
          )
        );
        setShowModal(false);
      } else {
        toast.error('Failed to update product');
      }
    } catch (error) {
      toast.error('An error occurred while updating product');
    }
  };

  const handleChange = (field, value) => {
    setEditProduct((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Category',
        accessor: 'category.name',
      },
      {
        Header: 'Description',
        accessor: 'description',
      },
      {
        Header: 'Price',
        accessor: 'price',
      },
      {
        Header: 'Image',
        accessor: 'imageUrl',
        Cell: ({ value, row: { original } }) => (
          <div className="flex items-center space-x-2">
            {value && <img src={value} alt="Product" className="w-16 h-16 object-cover" />}
            {value && (
              <button onClick={() => handleRemoveImage(original.id)} className="text-red-500 hover:text-red-700">
                <FiX />
              </button>
            )}
          </div>
        ),
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        Cell: ({ row: { original } }) => (
          <div className="flex items-center space-x-2">
            <button onClick={() => handleEditProduct(original)} className="text-blue-500 hover:text-blue-700">
              <FiEdit />
            </button>
            <button onClick={() => handleDeleteProduct(original.id)} className="text-red-500 hover:text-red-700">
              <FiTrash2 />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data: products,
    },
    useGlobalFilter, // Use global filter hook
    useSortBy
  );

  const { globalFilter } = state;

  console.log("Rendering table with products:", products);

  return (
    <div className="container mx-auto p-4 dark:bg-gray-900 dark:text-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manage Products</h1>
      </div>
      <GlobalFilter globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
      <div className="overflow-x-auto max-h-[750px]">
        <table {...getTableProps()} className="min-w-full bg-white dark:bg-gray-800">
          <thead className="sticky top-0 bg-gray-100 dark:bg-gray-700 z-10">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    key={column.id}
                    className="px-4 py-2"
                  >
                    {column.render('Header')}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? ' 🔽'
                          : ' 🔼'
                        : ''}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={row.original.id}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()} key={cell.column.id} className="border px-4 py-2">
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal show={showModal} onClose={() => setShowModal(false)}>
        {editProduct && (
          <div>
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>
            <div className="mb-4">
              <label className="block mb-2">Name</label>
              <Input
                type="text"
                value={editProduct.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Category</label>
              <Input
                type="text"
                value={editProduct.category.name}
                readOnly
                className="bg-gray-200 cursor-not-allowed"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Description</label>
              <Input
                type="text"
                value={editProduct.description}
                onChange={(e) => handleChange('description', e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Price</label>
              <Input
                type="number"
                value={editProduct.price}
                onChange={(e) => handleChange('price', e.target.value)}
              />
            </div>
            <Button onClick={handleSaveChanges} className="bg-green-500 hover:bg-green-700 text-white">
              Save Changes
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProductsPage;
