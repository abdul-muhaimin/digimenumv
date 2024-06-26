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
import Navbar from '@/components/layout/SideBar';
import Spinner from "@/components/ui/Spinner"; // Import the Spinner component
import useSWR from 'swr';

const fetcher = url => fetch(url).then(res => res.json());

const MenuShowPage = ({ params }) => {
  const { menuId } = params;

  const [categories, setCategories] = useState([]);
  const [originalCategories, setOriginalCategories] = useState([]);
  const [productsWithoutCategory, setProductsWithoutCategory] = useState([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '' });
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [orderChanged, setOrderChanged] = useState(false);
  const [isDragEnabled, setIsDragEnabled] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImageRemoving, setIsImageRemoving] = useState(false); // State for image removal
  const router = useRouter();
  const [errors, setErrors] = useState({});
  // Using SWR to fetch data
  const { data: menu, error, isLoading, mutate } = useSWR(`/api/menus/${menuId}`, fetcher);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        // setIsLoading(true);
        const response = await fetch(`/api/menus/${menuId}`);
        const data = await response.json();
        setMenu(data);
        setCategories(data.categories || []);
        setProductsWithoutCategory(data.productsWithoutCategory || []);
        setOriginalCategories(data.categories || []);
      } catch (error) {
        console.error('Failed to fetch menu:', error);
      } finally {
        // setIsLoading(false);
      }
    };

    fetchMenu();
  }, [menuId]);

  const validateForm = () => {
    const newErrors = {};
    if (!newProduct.name) newErrors.name = "Product name is required.";
    if (!newProduct.price || isNaN(newProduct.price)) newErrors.price = "Valid product price is required.";
    if (selectedImage && !croppedImage) newErrors.image = "Please crop the uploaded image.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddCategory = async () => {
    try {
      setIsSubmitting(true);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditCategory = async () => {
    try {
      setIsSubmitting(true);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      setIsSubmitting(true);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddOrEditProduct = async () => {
    if (!validateForm()) return;
    const url = currentCategoryId ? `/api/categories/${currentCategoryId}/products` : `/api/menus/${menuId}/products`;
    const method = currentProductId ? 'PUT' : 'POST';

    try {
      setIsSubmitting(true);
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
          const imageUrl = await uploadImage(croppedImage, `/api/image`, productId);
          if (imageUrl) {
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
        }

        if (currentCategoryId) {
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
        } else {
          setProductsWithoutCategory(prevProducts => {
            if (currentProductId) {
              return prevProducts.map(product => (product.id === currentProductId ? updatedProduct : product));
            }
            return [...prevProducts, updatedProduct];
          });
        }

        setNewProduct({ name: '', price: '', description: '', imageUrl: '' });
        setSelectedImage(null);
        setCroppedImage(null);
        setIsProductModalOpen(false);
        setEditMode(false);
        setCurrentProductId(null);
      } else {
        console.error('Failed to add/edit product:', await response.text());
      }
    } catch (error) {
      console.error('Error adding/editing product:', error);
    } finally {
      setIsSubmitting(false);
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
      setIsSubmitting(true);
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        if (currentCategoryId) {
          const updatedCategories = categories.map(category => ({
            ...category,
            products: category.products.filter(product => product.id !== productId),
          }));

          setCategories(updatedCategories);
        } else {
          setProductsWithoutCategory(prevProducts => prevProducts.filter(product => product.id !== productId));
        }
      } else {
        console.error('Failed to delete product:', await response.text());
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveImage = async () => {
    try {
      setIsImageRemoving(true);
      const response = await fetch(`/api/products/${currentProductId}/clear-image`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicId: newProduct.imageUrl.split('/').pop().split('.')[0] }), // Extract publicId from imageUrl
      });

      if (response.ok) {
        setNewProduct((prev) => ({
          ...prev,
          imageUrl: '',
        }));
        toast.success('Image removed successfully');
      } else {
        toast.error('Failed to remove image');
      }
    } catch (error) {
      toast.error('An error occurred while removing image');
    } finally {
      setIsImageRemoving(false);
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
      setIsSubmitting(true);
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
    } finally {
      setIsSubmitting(false);
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
      setIsSubmitting(true);
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
    } finally {
      setIsSubmitting(false);
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
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedImg) => {
    setCroppedImage(croppedImg);
    setSelectedImage(null);
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors.image;
      return newErrors;
    });
  };

  const removeCroppedImage = () => {
    setCroppedImage(null);
  };

  const handleModalClose = () => {
    setNewProduct({ name: '', price: '', description: '' });
    setSelectedImage(null);
    setCroppedImage(null);
    setEditMode(false);
    setCurrentCategoryId(null); // Clear category ID on modal close
  };

  const toggleDrag = () => {
    setIsDragEnabled(!isDragEnabled);
  };

  const uploadImage = async (image, endpoint, productId) => {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('productId', productId);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Error uploading image');
      const data = await response.json();
      return data.imageUrl;
    } catch (error) {
      toast.error('Failed to upload image');
      return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div>Error loading menu details</div>;
  }

  return (
    <div className="container mx-auto p-4" style={{ backgroundColor: '#FFFFFF' }}>
      <>
        <h1 className="text-3xl font-bold mb-4 text-center" style={{ color: '#333333' }}>{menu.name}</h1>
        <div className="flex items-center mb-4">
          <Button onClick={router.back} className="text-sm" style={{ backgroundColor: '#FFB84D', color: '#FFFFFF' }}>Back</Button>
          <Button onClick={toggleDrag} className="ml-2 text-xs" style={{ backgroundColor: '#FF8400', color: '#333333' }}>{isDragEnabled ? 'Disable Drag' : 'Enable Drag'}</Button>
          <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
            <DialogTrigger asChild>
              <Button className="ml-2 text-xs" style={{ backgroundColor: '#FF8400', color: '#FFFFFF' }}>+ Create Category</Button>
            </DialogTrigger>
            <DialogContent style={{ backgroundColor: '#F5F5F5' }}>
              <DialogHeader>
                <DialogTitle style={{ color: '#333333' }}>{editMode ? 'Edit Category' : 'Create New Category'}</DialogTitle>
              </DialogHeader>
              <div>
                <Label htmlFor="categoryName" className="block text-sm font-medium" style={{ color: '#333333' }}>
                  Category Name
                </Label>
                <Input
                  id="categoryName"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-brandOrange"
                  style={{ backgroundColor: '#FFFFFF', color: '#333333' }}
                />
                <Button onClick={editMode ? handleEditCategory : handleAddCategory} className="mt-4 w-full py-2 px-4 rounded-md" style={{ backgroundColor: '#FF8400', color: '#FFFFFF' }} disabled={isSubmitting}>
                  {isSubmitting ? <Spinner /> : editMode ? 'Update Category' : 'Add Category'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={isProductModalOpen} onOpenChange={(isOpen) => {
            setIsProductModalOpen(isOpen);
            if (!isOpen) handleModalClose();
          }}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setCurrentCategoryId(null); // Clear categoryId for direct menu products
                  setIsProductModalOpen(true);
                }}
                className="ml-2 text-xs"
                style={{ backgroundColor: '#FF8400', color: '#FFFFFF' }}
              >
                + Add Product
              </Button>
            </DialogTrigger>
            <DialogContent style={{ backgroundColor: '#F5F5F5' }}>
              <DialogHeader>
                <DialogTitle style={{ color: '#333333' }}>{editMode ? 'Edit Product' : 'Add Product'}</DialogTitle>
              </DialogHeader>
              <div>
                <Label htmlFor="productName" className="block text-sm font-medium" style={{ color: '#333333' }}>
                  Product Name
                </Label>
                <Input
                  id="productName"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-brandOrange"
                  style={{ backgroundColor: '#FFFFFF', color: '#333333' }}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}

                <Label htmlFor="productPrice" className="block text-sm font-medium mt-4" style={{ color: '#333333' }}>
                  Product Price
                </Label>
                <Input
                  id="productPrice"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-brandOrange"
                  style={{ backgroundColor: '#FFFFFF', color: '#333333' }}
                />
                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}

                <Label htmlFor="productDescription" className="block text-sm font-medium mt-4" style={{ color: '#333333' }}>
                  Product Description
                </Label>
                <Input
                  id="productDescription"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-brandOrange"
                  style={{ backgroundColor: '#FFFFFF', color: '#333333' }}
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}

                <Label htmlFor="productImage" className="block text-sm font-medium mt-4" style={{ color: '#333333' }}>
                  Product Image
                </Label>
                <Input
                  id="productImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-brandOrange"
                  style={{ backgroundColor: '#FFFFFF', color: '#333333' }}
                />
                {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}

                {selectedImage && (
                  <ImageCropper
                    imageSrc={selectedImage}
                    onCropComplete={handleCropComplete}
                    aspectRatio={1.0}
                  />
                )}
                {croppedImage && (
                  <div className="mt-4">
                    <img src={URL.createObjectURL(croppedImage)} alt="Cropped" className="w-16 h-16 object-cover mt-2 rounded-md" />
                    <Button onClick={removeCroppedImage} className="mt-2 text-xs" style={{ backgroundColor: '#FF8400', color: '#FFFFFF' }}>Remove Image</Button>
                  </div>
                )}
                {editMode && newProduct.imageUrl && !croppedImage && (
                  <div className="mt-4">
                    <img src={newProduct.imageUrl} alt="Current" className="w-16 h-16 object-cover mt-2 rounded-md" />
                    <Button onClick={handleRemoveImage} className="mt-2 text-xs" style={{ backgroundColor: '#FF8400', color: '#FFFFFF' }} disabled={isImageRemoving}>
                      {isImageRemoving ? <Spinner /> : 'Remove Current Image'}
                    </Button>
                  </div>
                )}

                <Button
                  onClick={handleAddOrEditProduct}
                  className="mt-4 w-full py-2 px-4 rounded-md"
                  style={{ backgroundColor: '#FF8400', color: '#FFFFFF' }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Spinner /> : editMode ? 'Update Product' : 'Add Product'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {menu.productsWithoutCategory.length > 0 && (
          <>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#333333' }}>Menu Items</h2>
            <Reorder.Group axis="y" values={menu.productsWithoutCategory} onReorder={setProductsWithoutCategory}>
              {menu.productsWithoutCategory.map((product) => (
                <Reorder.Item key={product.id} value={product} drag={isDragEnabled ? "y" : false}>
                  <div className="flex items-center mb-2 p-4 border rounded-md shadow-sm" style={{ backgroundColor: '#F5F5F5' }}>
                    {product.imageUrl && (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-24 h-24 object-cover rounded-md mr-4"
                      />
                    )}
                    <div className="flex-1">
                      <p className="text-lg font-semibold" style={{ color: '#333333' }}>{product.name}</p>
                      <p className="text-sm" style={{ color: '#777777' }}>{product.price}</p>
                      <p className="text-sm" style={{ color: '#777777' }}>{product.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="p-2">
                            <DotsVerticalIcon className="h-5 w-5" style={{ color: '#333333' }} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleEditProduct(null, product.id, product)}>
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
          </>
        )}
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#333333' }}>Menu categories</h2>
        <Reorder.Group axis="y" values={menu.categories} onReorder={handleReorderCategories}>
          {menu.categories.map((category) => (
            <Reorder.Item key={category.id} value={category} drag={isDragEnabled ? "y" : false}>
              <Accordion type="single" collapsible>
                <AccordionItem key={category.id} value={category.id}>
                  <AccordionTrigger>
                    <div className="flex items-center">
                      <motion.div drag={isDragEnabled ? "y" : false} dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }} className="cursor-pointer mr-4">
                        <MdDragIndicator />
                      </motion.div>
                      <span style={{ color: '#333333' }}>{category.name}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="float-right">
                          <DotsVerticalIcon className="h-5 w-5" style={{ color: '#333333' }} />
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
                      style={{ backgroundColor: '#FF8400', color: '#FFFFFF' }}
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
                          <div className="flex items-center mb-2 p-4 border rounded-md shadow-sm" style={{ backgroundColor: '#F5F5F5' }}>
                            {product.imageUrl && (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-24 h-24 object-cover rounded-md mr-4"
                              />
                            )}
                            <div className="flex-1">
                              <p className="text-lg font-semibold" style={{ color: '#333333' }}>{product.name}</p>
                              <p className="text-sm" style={{ color: '#777777' }}>{product.price}</p>
                              <p className="text-sm" style={{ color: '#777777' }}>{product.description}</p>
                            </div>
                            <div className="flex space-x-2">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="p-2">
                                    <DotsVerticalIcon className="h-5 w-5" style={{ color: '#333333' }} />
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
            <Button onClick={handleSaveCategoriesOrder} disabled={isSubmitting} style={{ backgroundColor: '#FF8400', color: '#FFFFFF' }}>
              {isSubmitting ? <Spinner /> : 'Save Changes'}
            </Button>
            <Button onClick={handleCancelCategoriesOrder} disabled={isSubmitting} style={{ backgroundColor: '#FFB84D', color: '#333333' }}>
              Cancel
            </Button>
          </div>
        )}

      </>
    </div>
  );
};

export default MenuShowPage;