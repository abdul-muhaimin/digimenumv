"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
      const response = await fetch(`/api/categories/${menuId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newCategoryName }),
      });

      if (response.ok) {
        const newCategory = await response.json();
        setCategories([...categories, newCategory]);
        setNewCategoryName('');
        setIsModalOpen(false);
      } else {
        console.error('Failed to add category:', await response.text());
      }
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {menu ? (
        <>
          <h1 className="text-3xl font-bold mb-4">{menu.name}</h1>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
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
                  <Button className="mt-2">No Action</Button>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default MenuShowPage;
