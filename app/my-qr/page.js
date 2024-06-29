"use client";
import { useEffect, useState, Fragment } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, Transition, TransitionChild, DialogPanel, DialogTitle } from "@headlessui/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Reorder, motion } from 'framer-motion';
import { MdDragIndicator } from 'react-icons/md';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { DotsVerticalIcon } from '@heroicons/react/outline';
import Navbar from "@/components/layout/SideBar";
import Spinner from "@/components/ui/Spinner"; // Import the Spinner component

const QRPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const [menus, setMenus] = useState([]);
  const [originalMenus, setOriginalMenus] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMenu, setCurrentMenu] = useState(null);
  const [name, setName] = useState("");
  const [orderChanged, setOrderChanged] = useState(false);
  const [isDragEnabled, setIsDragEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      fetchMenus();
    }
  }, [user]);

  const fetchMenus = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/menus`);
      if (response.ok) {
        const data = await response.json();
        setMenus(data);
        setOriginalMenus(data);
      } else {
        toast.error("Failed to fetch menus");
      }
    } catch (error) {
      toast.error("An error occurred while fetching menus");
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (menu = null) => {
    setCurrentMenu(menu);
    setName(menu ? menu.name : "");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentMenu(null);
    setName("");
  };

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      let response;
      if (currentMenu) {
        response = await fetch(`/api/menus/${currentMenu.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        });
      } else {
        response = await fetch(`/api/menus`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        });
      }

      if (response.ok) {
        toast.success(`Menu ${currentMenu ? "updated" : "created"} successfully`);
        fetchMenus();
        closeModal();
      } else {
        toast.error(`Failed to ${currentMenu ? "update" : "create"} menu`);
      }
    } catch (error) {
      toast.error("An error occurred while saving menu");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReorder = (newOrder) => {
    setMenus(newOrder);
    setOrderChanged(true);
  };

  const handleSaveOrder = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/menus/reorder`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ menus }),
      });

      if (response.ok) {
        toast.success("Menu positions updated successfully");
        setOrderChanged(false);
        setOriginalMenus(menus);
      } else {
        toast.error("Failed to update menu positions");
      }
    } catch (error) {
      toast.error("An error occurred while updating menu positions");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelOrder = () => {
    setMenus(originalMenus);
    setOrderChanged(false);
  };

  const handleDeleteMenu = async (menuId) => {
    try {
      setIsSubmitting(true);
      const categoriesResponse = await fetch(`/api/menus/${menuId}/categories`);
      if (categoriesResponse.ok) {
        const categories = await categoriesResponse.json();
        for (const category of categories) {
          await fetch(`/api/categories/${category.id}`, {
            method: 'DELETE',
          });
        }
      }

      const response = await fetch(`/api/menus/${menuId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMenus(menus.filter(menu => menu.id !== menuId));
        toast.success("Menu deleted successfully");
      } else {
        toast.error("Failed to delete menu");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the menu");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleDrag = () => {
    setIsDragEnabled(!isDragEnabled);
  };

  return (
    <div className="container mx-auto p-4" style={{ backgroundColor: '#FFFFFF' }}>
      <h1 className="text-3xl font-bold mb-4 text-center" style={{ color: '#333333' }}>My Menus</h1>
      <div className="flex justify-between items-center mb-4">
        <Button onClick={() => openModal()} style={{ backgroundColor: '#FF8400', color: '#FFFFFF' }}>Create Menu</Button>
        <Button onClick={toggleDrag} className="ml-4" style={{ backgroundColor: '#FFB84D', color: '#333333' }}>{isDragEnabled ? 'Disable Drag' : 'Enable Drag'}</Button>
      </div>
      <div className="mt-4">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <Spinner />
          </div>
        ) : (
          <>
            {menus.length > 0 ? (
              <Reorder.Group axis="y" values={menus} onReorder={handleReorder}>
                {menus.map((menu) => (
                  <Reorder.Item key={menu.id} value={menu} drag={isDragEnabled ? "y" : false}>
                    <div className="mb-4 p-4 rounded-md shadow-lg" style={{ backgroundColor: '#F5F5F5' }}>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div drag={isDragEnabled ? "y" : false} className="cursor-pointer mr-4">
                            <MdDragIndicator className="text-xl ml-2" />
                          </div>
                          <div>
                            <h2 className="text-xl mb-2" style={{ color: '#333333' }}>{menu.name}</h2>
                            <p className="text-sm" style={{ color: '#777777' }}>
                              {menu.categoriesCount} categories, {menu.productsCount} products
                            </p>
                          </div>
                        </div>
                        <div>
                          <Button variant="ghost" onClick={() => router.push(`/my-qr/menus/${menu.id}`)} style={{ color: '#FF8400' }}>View</Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost">
                                <DotsVerticalIcon className="h-5 w-5 mt-2" style={{ color: '#333333' }} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => openModal(menu)}>
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteMenu(menu.id)}>
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            ) : (
              <div style={{ color: '#333333' }}>No menus available</div>
            )}
          </>
        )}
      </div>
      {orderChanged && (
        <div className="flex space-x-2 mt-4">
          <Button onClick={handleSaveOrder} disabled={isSubmitting} style={{ backgroundColor: '#FF8400', color: '#FFFFFF' }}>
            {isSubmitting ? <Spinner /> : 'Save Changes'}
          </Button>
          <Button onClick={handleCancelOrder} disabled={isSubmitting} style={{ backgroundColor: '#FFB84D', color: '#333333' }}>
            Cancel
          </Button>
        </div>
      )}

      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl" style={{ backgroundColor: '#F5F5F5' }}>
                  <DialogTitle as="h3" className="text-lg font-medium leading-6" style={{ color: '#333333' }}>
                    {currentMenu ? "Edit Menu" : "Create Menu"}
                  </DialogTitle>
                  <div className="mt-2">
                    <Label htmlFor="name" className="block text-sm font-medium" style={{ color: '#333333' }}>Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 block w-full border-brandOrange focus:ring-brandOrange"
                      style={{ backgroundColor: '#FFFFFF', color: '#333333' }}
                    />
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button onClick={handleSave} disabled={isSubmitting} style={{ backgroundColor: '#FF8400', color: '#FFFFFF' }}>
                      {isSubmitting ? <Spinner /> : currentMenu ? "Save" : "Create"}
                    </Button>
                    <Button onClick={closeModal} className="ml-2" style={{ backgroundColor: '#FFB84D', color: '#333333' }}>
                      Cancel
                    </Button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default QRPage;
