"use client";
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaInstagram, FaFacebook, FaTwitter, FaWhatsapp, FaCartPlus } from 'react-icons/fa'; // Import social icons
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'react-toastify';
import Navbar from '@/components/layout/SideBar';


const PublicUserPage = () => {
  const { businessName } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMenuId, setSelectedMenuId] = useState(null);

  useEffect(() => {
    if (!businessName) return;

    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/public/${businessName}`);
        if (!response.ok) throw new Error('Error fetching user data');
        const data = await response.json();
        setUserData(data);
        setSelectedMenuId(data.menus?.[0]?.id || null); // Set the first menu as the default selected
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [businessName]);

  if (loading) return <div>Loading...</div>;

  if (!userData) return <div>User not found</div>;

  const selectedMenu = userData.menus.find((menu) => menu.id === selectedMenuId);

  return (

    <div className="container mx-auto p-4">

      <div className="relative">
        {userData.bannerImageUrl && (
          <img src={userData.bannerImageUrl} alt="Banner" className="w-full h-64 object-cover rounded-md" />
        )}
        {userData.avatarImageUrl && (
          <img src={userData.avatarImageUrl} alt="Avatar" className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 object-cover rounded-full border-4 border-white" />
        )}
      </div>
      <div className="text-center mt-8">
        <h1 className="text-3xl font-bold">{userData.businessName || 'Store'}</h1>
        <p className="text-lg">{userData.storeDescription}</p>
        <div className="flex justify-center space-x-4 mt-4">
          {userData.links?.instagram && <a href={userData.links.instagram} target="_blank" rel="noopener noreferrer"><FaInstagram className="text-2xl" /></a>}
          {userData.links?.facebook && <a href={userData.links.facebook} target="_blank" rel="noopener noreferrer"><FaFacebook className="text-2xl" /></a>}
          {userData.links?.twitter && <a href={userData.links.twitter} target="_blank" rel="noopener noreferrer"><FaTwitter className="text-2xl" /></a>}
          {userData.links?.whatsapp && <a href={userData.links.whatsapp} target="_blank" rel="noopener noreferrer"><FaWhatsapp className="text-2xl" /></a>}
        </div>
      </div>
      <div className="mt-8">
        <Tabs value={selectedMenuId} onValueChange={(value) => setSelectedMenuId(Number(value))}>
          <TabsList className="flex justify-center mb-4">
            {userData.menus.map((menu) => (
              <TabsTrigger key={menu.id} value={menu.id} className="px-4 py-2 mx-2 text-sm font-medium rounded-md ">
                {menu.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {userData.menus.map((menu) => (
            <TabsContent key={menu.id} value={menu.id}>
              {menu.categories.map((category) => (
                <div key={category.id} className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">{category.name}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.products.map((product) => (
                      <Card key={product.id} className="border rounded-md">
                        {product.imageUrl && (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-48 object-cover rounded-t-md"
                          />
                        )}
                        <CardContent className="p-4">
                          <h3 className="text-xl font-bold">{product.name}</h3>
                          <p className="text-sm text-gray-600">{product.description}</p>
                          <p className="text-lg font-semibold mt-2">{product.price} MVR</p>
                          <Button className="mt-4 flex items-center space-x-2">
                            <FaCartPlus />
                            <span>Add to Cart</span>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default PublicUserPage;
