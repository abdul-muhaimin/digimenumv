"use client";
import { useParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { FaInstagram, FaFacebook, FaTwitter, FaWhatsapp, FaPlusCircle, FaCartPlus, FaPlus, FaMinus, FaTh, FaList, FaHeart } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { useCart } from '@/context/cartContext';
import FloatingSummaryBar from '@/components/FloatingSummaryBar';

// Allergy icons mapping
const allergyIcons = {
  1: '🌶️', // Spicy
  2: '🥜', // Contains Nuts
  3: '🍞', // Gluten-Free
  // Add more icons as needed
};

const PublicUserPage = () => {
  const { businessName } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMenuId, setSelectedMenuId] = useState(null);
  const [view, setView] = useState('grid');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const categoryRefs = useRef([]);
  const categoryBarRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [showCategories, setShowCategories] = useState(false); // New state for toggling categories
  const { cart, addToCart, removeFromCart, updateQuantity, getProductQuantity } = useCart();

  useEffect(() => {
    if (!businessName) return;

    const fetchUserData = async () => {
      try {
        console.log('Fetching user data...');
        const response = await fetch(`/api/public/${businessName}`);
        if (!response.ok) throw new Error('Error fetching user data');
        const data = await response.json();
        setUserData(data);
        setSelectedMenuId(data.menus?.[0]?.id || null);
        console.log('User data fetched successfully:', data);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [businessName]);

  useEffect(() => {
    let scrollTimeout;

    const handleScroll = () => {
      setIsScrolling(true);
      console.log('Scrolling...');
      if (scrollTimeout) clearTimeout(scrollTimeout);

      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
        console.log('Stopped scrolling.');
      }, 200);

      categoryRefs.current.forEach((ref, index) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          if (rect.top <= 0 && rect.bottom >= 0) {
            ref.classList.add('sticky', 'top-16');
          } else {
            ref.classList.remove('sticky', 'top-16');
          }
        }
      });

      if (categoryBarRef.current) {
        const rect = categoryBarRef.current.getBoundingClientRect();
        if (rect.top <= 0) {
          categoryBarRef.current.classList.add('sticky', 'top-16', 'bg-white', 'dark:bg-gray-900');
          console.log('Category bar is sticky.');
        } else {
          categoryBarRef.current.classList.remove('sticky', 'top-16', 'bg-white', 'dark:bg-gray-900');
          console.log('Category bar is not sticky.');
        }
      }
    };

    console.log('Adding scroll event listener');
    window.addEventListener('scroll', handleScroll);

    return () => {
      console.log('Removing scroll event listener');
      window.removeEventListener('scroll', handleScroll);
    };
  }, [userData]);

  if (loading) return <div>Loading...</div>;

  if (!userData) return <div>User not found</div>;

  const handleCardClick = (product) => {
    setSelectedProduct(product);
  };

  const handleLikeClick = async (product) => {
    try {
      const response = await fetch(`/api/products/${product.id}/like`, { method: 'POST' });
      if (response.ok) {
        const updatedProduct = await response.json();
        setUserData((prev) => ({
          ...prev,
          menus: prev.menus.map((menu) => ({
            ...menu,
            categories: menu.categories.map((category) => ({
              ...category,
              products: category.products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)),
            })),
          })),
        }));
      }
    } catch (error) {
      console.error('Failed to like product:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-white">
      <div className="">
        {userData.bannerImageUrl && (
          <img src={userData.bannerImageUrl} alt="Banner" className="w-full h-64 object-cover" />
        )}
        <div className="relative">
          {userData.avatarImageUrl && (
            <img
              src={userData.avatarImageUrl}
              alt="Avatar"
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-32 h-32 object-cover rounded-full border-4 border-white dark:border-gray-800"
            />
          )}
        </div>
      </div>
      <div className="text-center mt-16">
        <h1 className="text-3xl font-bold">{userData.businessName || 'Store'}</h1>
        <p className="text-lg">{userData.storeDescription}</p>
        <div className="flex justify-center space-x-4 mt-4">
          {userData.links?.instagram && (
            <a href={userData.links.instagram} target="_blank" rel="noopener noreferrer">
              <FaInstagram className="text-2xl" />
            </a>
          )}
          {userData.links?.facebook && (
            <a href={userData.links.facebook} target="_blank" rel="noopener noreferrer">
              <FaFacebook className="text-2xl" />
            </a>
          )}
          {userData.links?.twitter && (
            <a href={userData.links.twitter} target="_blank" rel="noopener noreferrer">
              <FaTwitter className="text-2xl" />
            </a>
          )}
          {userData.links?.whatsapp && (
            <a href={userData.links.whatsapp} target="_blank" rel="noopener noreferrer">
              <FaWhatsapp className="text-2xl" />
            </a>
          )}
        </div>
      </div>
      <div className="mt-2">
        <Tabs value={selectedMenuId} onValueChange={(value) => setSelectedMenuId(Number(value))}>
          <div className={`sticky top-0 z-10 bg-white dark:bg-gray-900 ${isScrolling ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
            <div className="flex justify-center">
              <TabsList className="flex justify-center mb-0">
                {userData.menus.map((menu) => (
                  <TabsTrigger key={menu.id} value={menu.id} className="px-4 py-2 mx-2 text-sm font-medium rounded-md">
                    {menu.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            <hr className="border-gray-300 dark:border-gray-700 my-2 mb-2 ml-2" />
            <div className="flex justify-center mt-2 mb-2">
              <Button onClick={() => setShowCategories(!showCategories)} className="mx-2 mb-2" variant="ghost">
                {showCategories ? 'Hide Categories' : 'Show Categories'}
              </Button>
              <Button onClick={() => setView(view === 'grid' ? 'list' : 'grid')} className="mx-2 mb-2" variant="ghost">
                {view === 'grid' ? <FaList /> : <FaTh />}
              </Button>
            </div>
            {showCategories && (
              <div ref={categoryBarRef} className="flex flex-wrap justify-center bg-gray">
                {userData.menus.find(menu => menu.id === selectedMenuId)?.categories.map((category, index) => (
                  <Button
                    key={category.id}
                    onClick={() => categoryRefs.current[index]?.scrollIntoView({ behavior: 'smooth' })}
                    className="mx-2 mb-2"
                    variant="ghost"
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            )}
          </div>
          {userData.menus.map((menu) => (
            <TabsContent key={menu.id} value={menu.id}>
              {menu.categories.map((category, index) => (
                <div key={category.id} className="mb-8">
                  <h2
                    ref={(el) => (categoryRefs.current[index] = el)}
                    className="text-2xl text-center font-bold mb-4 w-full bg-blue-100 dark:bg-blue-900 text-black dark:text-white py-2 font-roboto-slab"
                  >
                    {category.name}
                  </h2>

                  {view === 'grid' ? (
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {category.products.map((product) => (
                        product.active === 1 && (
                          <Card key={product.id} className={`border rounded-t-md cursor-pointer ${getProductQuantity(product.id) > 0 ? 'border-blue-500 dark:border-blue-300' : ''}`}>
                            <img
                              src={product.imageUrl}
                              alt={product.name || 'Placeholder Image'}
                              className="w-full h-48 object-cover rounded-md"
                              onClick={() => handleCardClick(product)}
                            />
                            <CardContent className="p-4">
                              <h3 className="text-md font-bold">{product.name}</h3>
                              {product.discountPercentage ? (
                                <p className="text-sm font-semibold mt-2">
                                  <span className="line-through">{product.price} Rf</span> {product.price - (product.price * (product.discountPercentage / 100))} Rf
                                </p>
                              ) : product.discountFixed ? (
                                <p className="text-sm font-semibold mt-2">
                                  <span className="line-through">{product.price} Rf</span> {product.price - product.discountFixed} Rf
                                </p>
                              ) : (
                                <p className="text-sm font-semibold mt-2">{product.price} Rf</p>
                              )}
                              {product.notice && <p className="text-sm text-red-600 mt-2">{product.notice}</p>}
                            </CardContent>
                            <div className="mt-4 ml-2 mb-2 flex items-center space-x-2 justify-center">
                              {getProductQuantity(product.id) > 0 ? (
                                <div className="flex items-center space-x-2">
                                  <Button
                                    className="p-2"
                                    onClick={(e) => { e.stopPropagation(); updateQuantity(product.id, getProductQuantity(product.id) - 1); }}
                                  >
                                    <FaMinus />
                                  </Button>
                                  <span>{getProductQuantity(product.id)}</span>
                                  <Button
                                    className="p-2"
                                    onClick={(e) => { e.stopPropagation(); updateQuantity(product.id, getProductQuantity(product.id) + 1); }}
                                  >
                                    <FaPlus />
                                  </Button>
                                </div>
                              ) : (
                                <Button variant="ghost" onClick={(e) => { e.stopPropagation(); addToCart(product); }} disabled={product.soldOut === 1}>
                                  {product.soldOut === 1 ? 'Sold Out' : <FaPlusCircle />}
                                </Button>
                              )}
                            </div>
                            <div className="flex justify-center mt-2">
                              <Button variant="ghost" onClick={(e) => { e.stopPropagation(); handleLikeClick(product); }}>
                                <FaHeart /> {product.likes}
                              </Button>
                            </div>
                          </Card>
                        )
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {category.products.map((product) => (
                        product.active === 1 && (
                          <div key={product.id} className={`border p-4 rounded-t-md cursor-pointer ${getProductQuantity(product.id) > 0 ? 'border-blue-500 dark:border-blue-300' : ''}`}>
                            <div onClick={() => handleCardClick(product)}>
                              <h3 className="text-md font-bold">{product.name}</h3>
                              {product.discountPercentage ? (
                                <p className="text-sm font-semibold mt-2">
                                  <span className="line-through">{product.price} Rf</span> {product.price - (product.price * (product.discountPercentage / 100))} Rf
                                </p>
                              ) : product.discountFixed ? (
                                <p className="text-sm font-semibold mt-2">
                                  <span className="line-through">{product.price} Rf</span> {product.price - product.discountFixed} Rf
                                </p>
                              ) : (
                                <p className="text-sm font-semibold mt-2">{product.price} Rf</p>
                              )}
                              {product.notice && <p className="text-sm text-red-600 mt-2">{product.notice}</p>}
                            </div>
                            <div className="mt-4 flex items-center space-x-2 justify-center">
                              {getProductQuantity(product.id) > 0 ? (
                                <div className="flex items-center space-x-2">
                                  <Button
                                    variant="ghost"
                                    className="p-2"
                                    onClick={(e) => { e.stopPropagation(); updateQuantity(product.id, getProductQuantity(product.id) - 1); }}
                                  >
                                    <FaMinus />
                                  </Button>
                                  <span>{getProductQuantity(product.id)}</span>
                                  <Button
                                    variant="ghost"
                                    className="p-2"
                                    onClick={(e) => { e.stopPropagation(); updateQuantity(product.id, getProductQuantity(product.id) + 1); }}
                                  >
                                    <FaPlus />
                                  </Button>
                                </div>
                              ) : (
                                <Button variant="ghost" onClick={(e) => { e.stopPropagation(); addToCart(product); }} disabled={product.soldOut === 1}>
                                  {product.soldOut === 1 ? 'Sold Out' : <FaCartPlus />}
                                  <span>Add</span>
                                </Button>
                              )}
                            </div>
                            <div className="flex justify-center mt-2">
                              {/* <Button variant="ghost" onClick={(e) => { e.stopPropagation(); handleLikeClick(product); }}>
                                <FaHeart /> {product.likes}
                              </Button> */}
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </div>
      {selectedProduct && (
        <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedProduct.name}</DialogTitle>
              <DialogClose />
            </DialogHeader>
            <div className="flex flex-col items-center">
              {selectedProduct.imageUrl && (
                <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="w-full h-64 object-cover mb-4" />
              )}
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{selectedProduct.description}</p>
              <p className="text-lg font-semibold mb-4">{selectedProduct.price} MVR</p>
              {selectedProduct.notice && <p className="text-sm text-red-600 mb-4">{selectedProduct.notice}</p>}
              <div className="flex space-x-2 mb-4">
                {selectedProduct.allergyCodes && selectedProduct.allergyCodes.map((code) => (
                  <span key={code}>{allergyIcons[code]}</span>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between space-x-2">
                {getProductQuantity(selectedProduct.id) > 0 ? (
                  <>
                    <Button onClick={() => updateQuantity(selectedProduct.id, getProductQuantity(selectedProduct.id) - 1)}>
                      <FaMinus />
                    </Button>
                    <span>{getProductQuantity(selectedProduct.id)}</span>
                    <Button onClick={() => updateQuantity(selectedProduct.id, getProductQuantity(selectedProduct.id) + 1)}>
                      <FaPlus />
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => addToCart(selectedProduct)}>
                    <FaCartPlus />
                    <span>Add to Cart</span>
                  </Button>
                )}
              </div>
              <Button variant="ghost" onClick={() => handleLikeClick(selectedProduct)} className="mt-4">
                <FaHeart /> {selectedProduct.likes}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
      <FloatingSummaryBar />
    </div>
  );
};

export default PublicUserPage;