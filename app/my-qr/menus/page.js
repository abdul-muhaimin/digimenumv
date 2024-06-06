import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const MenusPage = () => {
  // Fetch menus from the server
  const menus = [
    { id: 1, name: 'Menu1', createdAt: 'June 5, 2024' },
    // Add more menus as needed
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Menus</h1>
      <Link href="/my-qr/menus/new" passHref>
        <Button>New Menu</Button>
      </Link>
      <div className="mt-4">
        {menus.map(menu => (
          <Link key={menu.id} href={`/my-qr/menus/${menu.id}`} passHref>
            <Card className="mb-4 p-4">
              <h2 className="text-xl font-bold">{menu.name}</h2>
              <p>{menu.createdAt}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MenusPage;
