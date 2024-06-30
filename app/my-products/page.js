"use client";
import React, { useState, useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import { useTable, useSortBy, useGlobalFilter } from "react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { FiTrash2, FiEdit } from "react-icons/fi";
import 'react-toastify/dist/ReactToastify.css';
import Switch from '@/components/Switch';
import Spinner from '@/components/ui/Spinner';
import useSWR from 'swr';

const fetcher = url => fetch(url).then(res => res.json());

const GlobalFilter = ({ globalFilter, setGlobalFilter }) => {
  return (
    <Input
      value={globalFilter || ""}
      onChange={(e) => setGlobalFilter(e.target.value || undefined)}
      placeholder={`Search all columns...`}
      className="mb-4 border-brandOrange focus:ring-brandOrange"
      style={{ backgroundColor: '#FFFFFF', color: '#333333' }}
    />
  );
};

const Modal = ({ show, onClose, children }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white p-4 rounded-md shadow-lg max-w-4xl w-full max-h-screen overflow-y-auto" style={{ backgroundColor: '#F5F5F5' }}>
        {children}
        <button onClick={onClose} className="mt-4 py-2 px-4 rounded" style={{ backgroundColor: '#FF8400', color: '#FFFFFF' }}>
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // SWR Hook for fetching products
  const { data, error, isLoading, mutate } = useSWR(
    user ? `/api/products` : null,
    fetcher,
    {
      onError: (error) => {

      },
      onSuccess: (data) => {

        setProducts(data || []);
      }
    }
  );


  const handleDeleteProduct = async (id) => {
    const confirmed = true; // Replace with actual modal confirmation logic
    if (!confirmed) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (response.ok) {
        toast.success('Product deleted successfully');
        mutate(); // Revalidate data
      } else {
        toast.error('Failed to delete product');
      }
    } catch (error) {
      toast.error('An error occurred while deleting product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveImage = async (id) => {
    const confirmed = true; // Replace with actual modal confirmation logic
    if (!confirmed) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/products/${id}/image`, { method: 'DELETE' });
      if (response.ok) {
        toast.success('Image removed successfully');
        mutate(); // Revalidate data
      } else {
        toast.error('Failed to remove image');
      }
    } catch (error) {
      toast.error('An error occurred while removing image');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditProductId(product.id);
    setEditProduct({ ...product });
    setShowModal(true);
  };

  const handleSaveChanges = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/products/${editProductId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editProduct),
      });
      if (response.ok) {
        toast.success('Product updated successfully');
        mutate(); // Revalidate data
        setShowModal(false);
      } else {
        toast.error('Failed to update product');
      }
    } catch (error) {
      toast.error('An error occurred while updating product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setEditProduct((prev) => {
      let updatedProduct = { ...prev, [field]: value };

      // Ensure only one discount field is filled at a time
      if (field === 'discountPercentage' && value) {
        updatedProduct.discountFixed = '';
      }
      if (field === 'discountFixed' && value) {
        updatedProduct.discountPercentage = '';
      }

      return updatedProduct;
    });
  };

  const handleToggle = async (product, field) => {
    const updatedProduct = { ...product, [field]: product[field] === 1 ? 0 : 1 };
    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct),
      });
      if (response.ok) {
        mutate(); // Revalidate data
      } else {
        toast.error('Failed to update product');
      }
    } catch (error) {
      toast.error('An error occurred while updating product');
    }
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
        Cell: ({ row: { original } }) => (
          original.category ? original.category.name : 'No Category'
        ),
      },
      {
        Header: () => (
          <div className="hidden lg:table-cell">
            Description
          </div>
        ),
        accessor: 'description',
        Cell: ({ cell: { value } }) => (
          <div className="hidden lg:table-cell">
            {value}
          </div>
        ),
      },
      {
        Header: () => (
          <div className="hidden lg:table-cell">
            Price
          </div>
        ),
        accessor: 'price',
        Cell: ({ cell: { value } }) => (
          <div className="hidden lg:table-cell">
            {value}
          </div>
        ),
      },
      {
        Header: 'Active',
        accessor: 'active',
        Cell: ({ row: { original } }) => (
          <Switch
            isChecked={original.active === 1}
            onChange={() => handleToggle(original, 'active')}
            label={original.active === 1 ? 'Active' : 'Inactive'}
          />
        ),
      },
      {
        Header: 'Sold Out',
        accessor: 'soldOut',
        Cell: ({ row: { original } }) => (
          <Switch
            isChecked={original.soldOut === 1}
            onChange={() => handleToggle(original, 'soldOut')}
            label={original.soldOut === 1 ? 'Sold Out' : 'Available'}
          />
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
      data: products || [],
    },
    useGlobalFilter,
    useSortBy
  );

  const { globalFilter } = state;

  const allergyOptions = [
    { id: 1, name: 'Spicy' },
    { id: 2, name: 'Contains Nuts' },
    { id: 3, name: 'Gluten-Free' },
  ];

  const handleAllergyChange = (allergyId, checked) => {
    setEditProduct((prev) => {
      const updatedAllergies = checked
        ? [...prev.allergyCodes, allergyId]
        : prev.allergyCodes.filter((id) => id !== allergyId);
      return { ...prev, allergyCodes: updatedAllergies };
    });
  };

  return (
    <div className="container mx-auto p-4 min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold text-center" style={{ color: '#333333' }}>Manage Products</h1>
      </div>
      <GlobalFilter globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
      <div className="overflow-x-auto max-h-[750px]">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <Spinner />
          </div>
        ) : (
          <table {...getTableProps()} className="min-w-full" style={{ backgroundColor: '#FFFFFF' }}>
            <thead className="sticky top-0 z-10" style={{ backgroundColor: '#F5F5F5' }}>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      key={column.id}
                      className={`px-4 py-2 ${column.id === 'price' || column.id === 'description' ? 'hidden lg:table-cell' : ''}`}
                      style={{ color: '#333333' }}
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
                      <td
                        {...cell.getCellProps()}
                        key={cell.column.id}
                        className={`border px-4 py-2 ${cell.column.id === 'price' || cell.column.id === 'description' ? 'hidden lg:table-cell' : ''}`}
                        style={{ color: '#333333' }}
                      >
                        {cell.render('Cell')}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <Modal show={showModal} onClose={() => setShowModal(false)}>
        {editProduct && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <h2 className="text-xl font-bold mb-4 col-span-full" style={{ color: '#333333' }}>Edit Product</h2>
            <div className="mb-4">
              <label className="block mb-2" style={{ color: '#333333' }}>Name</label>
              <Input
                type="text"
                value={editProduct.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="border-brandOrange focus:ring-brandOrange"
                style={{ backgroundColor: '#FFFFFF', color: '#333333' }}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2" style={{ color: '#333333' }}>Category</label>
              <Input
                type="text"
                value={editProduct.category?.name || 'No Category'}
                readOnly
                className="bg-gray-200 cursor-not-allowed"
                style={{ backgroundColor: '#F5F5F5', color: '#333333' }}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2" style={{ color: '#333333' }}>Description</label>
              <Input
                type="text"
                value={editProduct.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="border-brandOrange focus:ring-brandOrange"
                style={{ backgroundColor: '#FFFFFF', color: '#333333' }}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2" style={{ color: '#333333' }}>Price</label>
              <Input
                type="number"
                value={editProduct.price}
                onChange={(e) => handleChange('price', e.target.value)}
                className="border-brandOrange focus:ring-brandOrange"
                style={{ backgroundColor: '#FFFFFF', color: '#333333' }}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2" style={{ color: '#333333' }}>Discount Percentage</label>
              <Input
                type="number"
                value={editProduct.discountPercentage}
                onChange={(e) => handleChange('discountPercentage', e.target.value)}
                step="0.01"
                className="border-brandOrange focus:ring-brandOrange"
                style={{ backgroundColor: '#FFFFFF', color: '#333333' }}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2" style={{ color: '#333333' }}>Discount Fixed Amount</label>
              <Input
                type="number"
                value={editProduct.discountFixed}
                onChange={(e) => handleChange('discountFixed', e.target.value)}
                step="0.01"
                className="border-brandOrange focus:ring-brandOrange"
                style={{ backgroundColor: '#FFFFFF', color: '#333333' }}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2" style={{ color: '#333333' }}>Active</label>
              <Switch
                isChecked={editProduct.active === 1}
                onChange={(e) => handleChange('active', e.target.checked ? 1 : 0)}
                label={editProduct.active === 1 ? 'Active' : 'Inactive'}
                className="border-brandOrange focus:ring-brandOrange"
                style={{ backgroundColor: '#FFFFFF', color: '#333333' }}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2" style={{ color: '#333333' }}>Sold Out</label>
              <Switch
                isChecked={editProduct.soldOut === 1}
                onChange={(e) => handleChange('soldOut', e.target.checked ? 1 : 0)}
                label={editProduct.soldOut === 1 ? 'Sold Out' : 'Available'}
                className="border-brandOrange focus:ring-brandOrange"
                style={{ backgroundColor: '#FFFFFF', color: '#333333' }}
              />
            </div>
            <div className="mb-4 col-span-full">
              <label className="block mb-2" style={{ color: '#333333' }}>Allergy Codes</label>
              {allergyOptions.map((allergy) => (
                <label key={allergy.id} className="flex items-center" style={{ color: '#333333' }}>
                  <input
                    type="checkbox"
                    checked={editProduct.allergyCodes.includes(allergy.id)}
                    onChange={(e) => handleAllergyChange(allergy.id, e.target.checked)}
                    className="mr-2"
                    style={{ color: '#333333' }}
                  />
                  {allergy.name}
                </label>
              ))}
            </div>
            <Button
              onClick={handleSaveChanges}
              className="col-span-full"
              style={{ backgroundColor: '#FF8400', color: '#FFFFFF' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? <Spinner /> : 'Save Changes'}
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProductsPage;
