"use client";
// PublicUserPage.js
import { useParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cartContext';
import FloatingSummaryBar from '@/components/FloatingSummaryBar';
import BannerAvatar from '@/components/BannerAvatar';
import BusinessInfo from '@/components/BusinessInfo';
import MenuTabs from '@/components/MenuTabs';
import CategoryBar from '@/components/CategoryBar';
import ProductList from '@/components/ProductList';
import ProductModal from '@/components/ProductModal';
import SearchBar from '@/components/SearchBar';
import SplashLoading from '@/components/SplashLoading';

const PublicUserPage = () => {
  const { businessName } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMenuId, setSelectedMenuId] = useState(null);
  const [view, setView] = useState('grid');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [showCategories, setShowCategories] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const categoryRefs = useRef([]);
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

        // Track the visit
        await fetch('/api/track-visit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ storeId: data.clerkId }), // Use clerkId as storeId
        });
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        setError('Failed to load user data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [businessName]);

  const handleSearch = (searchTerm) => {
    if (!userData) return;
    const results = [];
    userData.menus.forEach((menu) => {
      menu.categories.forEach((category) => {
        category.products.forEach((product) => {
          if (product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
            results.push(product);
          }
        });
      });
    });
    setSearchResults(results);
    setSelectedMenuId(null); // Reset the selected menu ID when searching
  };

  if (loading) return <SplashLoading />;

  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

  if (!userData) return <div className="text-center text-red-500 mt-10">User not found</div>;

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

  const handleMenuTabClick = (menuId) => {
    setSelectedMenuId(menuId);
    setSearchResults([]); // Clear search results when a menu tab is clicked
  };

  const getCategories = () => {
    if (searchResults.length > 0) {
      return [{ name: 'Search Results', products: searchResults }];
    }
    if (userData) {
      const selectedMenu = userData.menus.find((menu) => menu.id === selectedMenuId);
      return selectedMenu ? selectedMenu.categories : [];
    }
    return [];
  };

  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-white">
      <BannerAvatar bannerImageUrl={userData.bannerImageUrl} avatarImageUrl={userData.avatarImageUrl} />
      <BusinessInfo businessName={userData.businessName} storeDescription={userData.storeDescription} links={userData.links} />
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900">
        <MenuTabs menus={userData.menus} selectedMenuId={selectedMenuId} setSelectedMenuId={handleMenuTabClick} />
        <CategoryBar
          categories={getCategories()}
          categoryRefs={categoryRefs}
          showCategories={showCategories}
          setShowCategories={setShowCategories}
          setView={setView}
          view={view}
          showSearch={showSearch}
          setShowSearch={setShowSearch}
        />
        {showSearch && <SearchBar onSearch={handleSearch} />}
      </div>
      <ProductList
        view={view}
        categories={getCategories()}
        handleCardClick={handleCardClick}
        getProductQuantity={getProductQuantity}
        addToCart={addToCart}
        updateQuantity={updateQuantity}
        categoryRefs={categoryRefs}
      />
      <ProductModal
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
        getProductQuantity={getProductQuantity}
        addToCart={addToCart}
        updateQuantity={updateQuantity}
      />
      <FloatingSummaryBar />
    </div>
  );
};

export default PublicUserPage;
