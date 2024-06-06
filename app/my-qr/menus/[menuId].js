import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const MenuDetails = () => {
  const router = useRouter();
  const { menuId } = router.query;
  const [menu, setMenu] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (!menuId) return;

    const fetchMenu = async () => {
      try {
        const response = await fetch(`/api/menus/${menuId}`);
        if (!response.ok) throw new Error('Failed to fetch menu');
        const data = await response.json();
        setMenu(data);
      } catch (error) {
        console.error('Error fetching menu:', error);
      }
    };

    fetchMenu();
  }, [menuId]);

  useEffect(() => {
    if (!menuId) return;

    const fetchCategories = async () => {
      try {
        const response = await fetch(`/api/menus/${menuId}/categories`);
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [menuId]);

  const handleCreateCategory = async () => {
    const name = prompt('Enter category name:');
    if (!name) return;

    try {
      const response = await fetch(`/api/menus/${menuId}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) throw new Error('Failed to create category');
      const newCategory = await response.json();
      setCategories([...categories, newCategory]);
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  if (!menu) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{menu.name}</h1>
      <Button onClick={handleCreateCategory} className="mb-4">+ Create Category</Button>
      <div className="grid grid-cols-1 gap-4">
        {categories.map(category => (
          <Card key={category.id} className="cursor-pointer" onClick={() => router.push(`/menus/${menuId}/categories/${category.id}`)}>
            <CardHeader>
              <CardTitle>{category.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Created at: {new Date(category.createdAt).toLocaleDateString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MenuDetails;
