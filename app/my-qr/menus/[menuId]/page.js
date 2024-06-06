"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

const MenuShowPage = ({ params }) => {
  const { menuId } = params;
  const [menu, setMenu] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const router = useRouter();
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '' });
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [currentProductId, setCurrentProductId] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch(`/api/menus/${menuId}`);
        const data = await response.json();
        setMenu(data);
        setCategories(data.categories || []);
      } catch (error) {
        console.error('Failed to fetch menu:', error);
      }
    };

    fetchMenu();
  }, [menuId]);

  const handleAddCategory = async () => {
    try {
      const response = await fetch(`/api/menus/${menuId}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newCategoryName }),
      });

      if (response.ok) {
        const newCategory = await response.json();
        setCategories([...categories, { ...newCategory, products: [] }]);
        setNewCategoryName('');
        setIsCategoryModalOpen(false);
      } else {
        console.error('Failed to add category:', await response.text());
      }
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleAddOrEditProduct = async () => {
    const url = currentProductId ? `/api/products/${currentProductId}` : `/api/categories/${currentCategoryId}/products`;
    const method = currentProductId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });

      if (response.ok) {
        const updatedProduct = await response.json();
        const updatedCategories = categories.map(category => {
          if (category.id === currentCategoryId) {
            if (currentProductId) {
              return {
                ...category,
                products: category.products.map(product => (product.id === currentProductId ? updatedProduct : product)),
              };
            }
            return {
              ...category,
              products: [...(category.products || []), updatedProduct],
            };
          }
          return category;
        });

        setCategories(updatedCategories);
        setNewProduct({ name: '', price: '', description: '' });
        setIsProductModalOpen(false);
        setEditMode(false);
        setCurrentProductId(null);
      } else {
        console.error('Failed to add/edit product:', await response.text());
      }
    } catch (error) {
      console.error('Error adding/editing product:', error);
    }
  };

  const handleEditProduct = (categoryId, productId, product) => {
    setCurrentCategoryId(categoryId);
    setCurrentProductId(productId);
    setNewProduct(product);
    setEditMode(true);
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedCategories = categories.map(category => ({
          ...category,
          products: category.products.filter(product => product.id !== productId),
        }));

        setCategories(updatedCategories);
      } else {
        console.error('Failed to delete product:', await response.text());
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="container mx-auto p-4">
      <Button onClick={handleBack} className="mb-4">Back</Button>
      {menu ? (
        <>
          <h1 className="text-3xl font-bold mb-4">{menu.name}</h1>
          <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
            <DialogTrigger asChild>
              <Button className="mb-4">+ Create Category</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Category</DialogTitle>
              </DialogHeader>
              <div>
                <Label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">
                  Category Name
                </Label>
                <Input
                  id="categoryName"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
                <Button onClick={handleAddCategory} className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md">
                  Add Category
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Accordion type="single" collapsible>
            {categories.map((category) => (
              <AccordionItem key={category.id} value={category.id}>
                <AccordionTrigger>{category.name}</AccordionTrigger>
                <AccordionContent>
                  <Button
                    className="mt-2 mb-4"
                    onClick={() => {
                      setCurrentCategoryId(category.id);
                      setIsProductModalOpen(true);
                    }}
                  >
                    + Add Product
                  </Button>
                  {category.products && category.products.map((product) => (
                    <div key={product.id} className="flex justify-between items-center mb-2 p-2 border rounded">
                      <div>
                        <p className="text-lg font-semibold">{product.name}</p>
                        <p className="text-sm">{product.price}</p>
                        <p className="text-sm">{product.description}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button onClick={() => handleEditProduct(category.id, product.id, product)}>Edit</Button>
                        <Button onClick={() => handleDeleteProduct(product.id)}>Delete</Button>
                      </div>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editMode ? 'Edit Product' : 'Add Product'}</DialogTitle>
              </DialogHeader>
              <div>
                <Label htmlFor="productName" className="block text-sm font-medium text-gray-700">
                  Product Name
                </Label>
                <Input
                  id="productName"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
                <Label htmlFor="productPrice" className="block text-sm font-medium text-gray-700 mt-4">
                  Product Price
                </Label>
                <Input
                  id="productPrice"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
                <Label htmlFor="productDescription" className="block text-sm font-medium text-gray-700 mt-4">
                  Product Description
                </Label>
                <Input
                  id="productDescription"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
                <Button
                  onClick={handleAddOrEditProduct}
                  className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md"
                >
                  {editMode ? 'Update Product' : 'Add Product'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default MenuShowPage;
