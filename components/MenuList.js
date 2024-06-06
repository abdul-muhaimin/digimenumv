import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const MenuList = () => {
  const [menus, setMenus] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await fetch('/api/menus');
        if (!response.ok) throw new Error('Failed to fetch menus');
        const data = await response.json();
        setMenus(data);
      } catch (error) {
        console.error('Error fetching menus:', error);
      }
    };

    fetchMenus();
  }, []);

  const handleCreateMenu = async () => {
    const name = prompt('Enter menu name:');
    if (!name) return;

    try {
      const response = await fetch('/api/menus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) throw new Error('Failed to create menu');
      const newMenu = await response.json();
      setMenus([...menus, newMenu]);
    } catch (error) {
      console.error('Error creating menu:', error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Menus</h1>
      <Button onClick={handleCreateMenu} className="mb-4">+ New Menu</Button>
      <div className="grid grid-cols-1 gap-4">
        {menus.map(menu => (
          <Card key={menu.id} className="cursor-pointer" onClick={() => router.push(`/menus/${menu.id}`)}>
            <CardHeader>
              <CardTitle>{menu.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Created at: {new Date(menu.createdAt).toLocaleDateString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MenuList;
