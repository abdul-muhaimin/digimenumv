import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const CategoryDetails = () => {
  const router = useRouter();
  const { categoryId } = router.query;
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!categoryId) return;

    const fetchCategory = async () => {
      try {
        const response = await fetch(`/api/categories/${categoryId}`);
        if (!response.ok) throw new Error('Failed to fetch category');
        const data = await response.json();
        setCategory(data);
      } catch (error) {
        console.error('Error fetching category:', error);
      }
    };

    fetchCategory();
  }, [categoryId]);

  useEffect(() => {
    if (!categoryId) return;

    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/categories/${categoryId}/products`);
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [categoryId]);

  const handleCreateProduct = async () => {
    const name = prompt('Enter product name:');
    const price = prompt('Enter product price:');
    if (!name || !price) return;

    try {
      const response = await fetch(`/api/categories/${categoryId}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price }),
      });

      if (!response.ok) throw new Error('Failed to create product');
      const newProduct = await response.json();
      setProducts([...products, newProduct]);
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  if (!category) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{category.name}</h1>
      <Button onClick={handleCreateProduct} className="mb-4">+ Create Product</Button>
      <div className="grid grid-cols-1 gap-4">
        {products.map(product => (
          <Card key={product.id}>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Price: {product.price}</p>
              <p>Created at: {new Date(product.createdAt).toLocaleDateString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CategoryDetails;
