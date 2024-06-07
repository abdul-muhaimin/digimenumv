"use client";

import { useState, useEffect, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { DotsVerticalIcon } from '@heroicons/react/outline';
import { Reorder, motion } from "framer-motion";
import { MdDragIndicator } from "react-icons/md";
import { toast } from 'react-toastify';
import ImageCropper from '@/components/ImageCropper'; // Assume this is the image cropper component

const MenuShowPage = ({ params }) => {
  const { menuId } = params;
  const [menu, setMenu] = useState(null);
  const [categories, setCategories] = useState([]);
  const [originalCategories, setOriginalCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const router = useRouter();
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '' });
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [currentCategoryName, setCurrentCategoryName] = useState('');
  const [orderChanged, setOrderChanged] = useState(false);
  const [isDragEnabled, setIsDragEnabled] = useState(false);
  const [image, setImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch(`/api/menus/${menuId}`);
        const data = await response.json();
        setMenu(data);
        setCategories(data.categories || []);
        setOriginalCategories(data.categories || []);
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

  const handleEditCategory = async () => {
    try {
      const response = await fetch(`/api/categories/${currentCategoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newCategoryName }),
      });

      if (response.ok) {
        const updatedCategory = await response.json();
        setCategories(categories.map(category => (category.id === currentCategoryId ? updatedCategory : category)));
        setNewCategoryName('');
        setIsCategoryModalOpen(false);
      } else {
        console.error('Failed to edit category:', await response.text());
      }
    } catch (error) {
      console.error('Error editing category:', error);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCategories(categories.filter(category => category.id !== categoryId));
      } else {
        console.error('Failed to delete category:', await response.text());
      }
    } catch (error) {
      console.error('Error deleting category:', error);
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
        let updatedProduct = await response.json();
        let productId = updatedProduct.id;

        if (croppedImage) {
          const imageUrl = await uploadImage(croppedImage, productId);
          updatedProduct.imageUrl = imageUrl;

          const updateResponse = await fetch(`/api/products/${productId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ imageUrl }),
          });

          if (updateResponse.ok) {
            const finalProduct = await updateResponse.json();
            updatedProduct = finalProduct;
          }
        }

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
        setImage(null);
        setCroppedImage(null);
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

  const handleReorderCategories = (newOrder) => {
    setCategories(newOrder);
    setOrderChanged(true);
  };

  const handleSaveCategoriesOrder = async () => {
    try {
      const response = await fetch(`/api/menus/${menuId}/categories/reorder`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categories }),
      });

      if (response.ok) {
        toast.success("Category positions updated successfully");
        setOrderChanged(false);
        setOriginalCategories(categories);
      } else {
        toast.error("Failed to update category positions");
      }
    } catch (error) {
      toast.error("An error occurred while updating category positions");
    }
  };

  const handleCancelCategoriesOrder = () => {
    setCategories(originalCategories);
    setOrderChanged(false);
  };

  const handleReorderProducts = (categoryId, newOrder) => {
    setCategories(categories.map(category => {
      if (category.id === categoryId) {
        return { ...category, products: newOrder };
      }
      return category;
    }));
    setOrderChanged(true);
  };

  const handleSaveProductsOrder = async (categoryId) => {
    try {
      const category = categories.find(cat => cat.id === categoryId);
      const response = await fetch(`/api/categories/${categoryId}/products/reorder`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: category.products }),
      });

      if (response.ok) {
        toast.success("Product positions updated successfully");
        setOrderChanged(false);
      } else {
        toast.error("Failed to update product positions");
      }
    } catch (error) {
      toast.error("An error occurred while updating product positions");
    }
  };

  const handleCancelProductsOrder = (categoryId) => {
    const originalCategory = originalCategories.find(cat => cat.id === categoryId);
    setCategories(categories.map(category => {
      if (category.id === categoryId) {
        return { ...category, products: originalCategory.products };
      }
      return category;
    }));
    setOrderChanged(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target.result);
        setImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageCrop = (croppedImg) => {
    setCroppedImage(croppedImg);
  };

  const uploadImage = async (image, productId) => {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('productId', productId);

    try {
      const response = await fetch('/api/image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        return data.imageUrl;
      } else {
        console.error('Failed to upload image:', await response.text());
        return null;
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };


  const handleCropComplete = (croppedImage) => {
    setCroppedImage(croppedImage);
    setSelectedImage(null); // Hide the cropper and show the thumbnail
  };

  const removeCroppedImage = () => {
    setCroppedImage(null);
    setImage(null);
  };

  const toggleDrag = () => {
    setIsDragEnabled(!isDragEnabled);
  };

  return (
    <div className="container mx-auto p-4">
      <Button onClick={handleBack} className="mb-4 text-sm">Back</Button>
      <Button onClick={toggleDrag} className="mb-4 ml-2 text-xs">{isDragEnabled ? 'Disable Drag' : 'Enable Drag'}</Button>
      {menu ? (
        <>
          <h1 className="text-3xl font-bold mb-4">{menu.name}</h1>
          <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
            <DialogTrigger asChild>
              <Button className="mb-4 text-xs">+ Create Category</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editMode ? 'Edit Category' : 'Create New Category'}</DialogTitle>
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
                <Button onClick={editMode ? handleEditCategory : handleAddCategory} className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md">
                  {editMode ? 'Update Category' : 'Add Category'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Reorder.Group axis="y" values={categories} onReorder={handleReorderCategories}>
            {categories.map((category) => (
              <Reorder.Item key={category.id} value={category} drag={isDragEnabled ? "y" : false}>
                <Accordion type="single" collapsible>
                  <AccordionItem key={category.id} value={category.id}>
                    <AccordionTrigger>
                      <div className="flex items-center">
                        <motion.div drag={isDragEnabled ? "y" : false} dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }} className="cursor-pointer mr-4">
                          <MdDragIndicator />
                        </motion.div>
                        {category.name}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="float-right">
                            <DotsVerticalIcon className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => {
                            setCurrentCategoryId(category.id);
                            setNewCategoryName(category.name);
                            setEditMode(true);
                            setIsCategoryModalOpen(true);
                          }}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteCategory(category.id)}>
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button
                        className="mt-2 mb-4 text-xs py-1 px-2"
                        onClick={() => {
                          setCurrentCategoryId(category.id);
                          setIsProductModalOpen(true);
                        }}
                      >
                        + Add Product
                      </Button>
                      <Reorder.Group axis="y" values={category.products || []} onReorder={(newOrder) => handleReorderProducts(category.id, newOrder)}>
                        {category.products && category.products.map((product) => (
                          <Reorder.Item key={product.id} value={product} drag={isDragEnabled ? "y" : false}>
                            <div className="flex items-center mb-2 p-4 border rounded-md bg-white shadow-sm">
                              {product.imageUrl && (
                                <img
                                  src={product.imageUrl}
                                  alt={product.name}
                                  className="w-24 h-24 object-cover rounded-md mr-4"
                                />
                              )}
                              <div className="flex-1">
                                <p className="text-lg font-semibold">{product.name}</p>
                                <p className="text-sm text-gray-500">{product.price}</p>
                                <p className="text-sm text-gray-700">{product.description}</p>
                              </div>
                              <div className="flex space-x-2">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="p-2">
                                      <DotsVerticalIcon className="h-5 w-5" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => handleEditProduct(category.id, product.id, product)}>
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleDeleteProduct(product.id)}>
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </Reorder.Item>
                        ))}
                      </Reorder.Group>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </Reorder.Item>
            ))}
          </Reorder.Group>

          {orderChanged && (
            <div className="flex space-x-2 mt-4">
              <Button onClick={handleSaveCategoriesOrder}>Save Changes</Button>
              <Button onClick={handleCancelCategoriesOrder}>Cancel</Button>
            </div>
          )}
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
                <Label htmlFor="productImage" className="block text-sm font-medium text-gray-700 mt-4">
                  Product Image
                </Label>
                <Input
                  id="productImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
                {selectedImage && (
                  <ImageCropper
                    imageSrc={selectedImage}
                    onCropComplete={handleCropComplete}
                  />
                )}
                {croppedImage && (
                  <div className="mt-4">
                    <img src={URL.createObjectURL(croppedImage)} alt="Cropped" className="w-16 h-16 object-cover mt-2 rounded-md" />
                    <Button onClick={removeCroppedImage} className="mt-2 text-xs">Remove Image</Button>
                  </div>
                )}
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
