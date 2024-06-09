"use client";
import { useEffect, useState, Fragment } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, Transition } from "@headlessui/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Reorder, motion } from 'framer-motion';
import { MdDragIndicator } from 'react-icons/md';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { DotsVerticalIcon } from '@heroicons/react/outline';
import Navbar from "@/components/layout/SideBar";

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

  useEffect(() => {
    if (user) {
      fetchMenus();
    }
  }, [user]);

  const fetchMenus = async () => {
    try {
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
    }
  };

  const handleReorder = (newOrder) => {
    setMenus(newOrder);
    setOrderChanged(true);
  };

  const handleSaveOrder = async () => {
    try {
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
    }
  };

  const handleCancelOrder = () => {
    setMenus(originalMenus);
    setOrderChanged(false);
  };

  const handleDeleteMenu = async (menuId) => {
    try {
      // Fetch categories related to the menu
      const categoriesResponse = await fetch(`/api/menus/${menuId}/categories`);
      if (categoriesResponse.ok) {
        const categories = await categoriesResponse.json();
        // Delete each category
        for (const category of categories) {
          await fetch(`/api/categories/${category.id}`, {
            method: 'DELETE',
          });
        }
      }

      // Delete the menu
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
    }
  };

  const toggleDrag = () => {
    setIsDragEnabled(!isDragEnabled);
  };

  return (
    <div>

      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">My QR Menus</h1>
        <Button onClick={() => openModal()}>Create Menu</Button>
        <Button onClick={toggleDrag} className="ml-4">{isDragEnabled ? 'Disable Drag' : 'Enable Drag'}</Button>
        <div className="mt-4">
          {menus.length > 0 ? (
            <Reorder.Group axis="y" values={menus} onReorder={handleReorder}>
              {menus.map((menu) => (
                <Reorder.Item key={menu.id} value={menu} drag={isDragEnabled ? "y" : false}>
                  <Card className="mb-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <motion.div drag={isDragEnabled ? "y" : false} dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }} className="cursor-pointer mr-4">
                          <MdDragIndicator className="text-xl" />
                        </motion.div>
                        <div>
                          <h2 className="text-xl">{menu.name}</h2>
                          <p className="text-sm text-gray-500">
                            {menu.categoriesCount} categories, {menu.productsCount} products
                          </p>
                        </div>
                      </div>
                      <div>
                        <Button onClick={() => router.push(`/my-qr/menus/${menu.id}`)}>View</Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="p-2">
                              <DotsVerticalIcon className="h-5 w-5" />
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
                  </Card>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          ) : (
            <div>No menus available</div>
          )}
        </div>
        {orderChanged && (
          <div className="flex space-x-2 mt-4">
            <Button onClick={handleSaveOrder}>Save Changes</Button>
            <Button onClick={handleCancelOrder}>Cancel</Button>
          </div>
        )}

        <Transition appear show={isModalOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={closeModal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                      {currentMenu ? "Edit Menu" : "Create Menu"}
                    </Dialog.Title>
                    <div className="mt-2">
                      <Label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full"
                      />
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button onClick={handleSave}>{currentMenu ? "Save" : "Create"}</Button>
                      <Button onClick={closeModal} className="ml-2">Cancel</Button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    </div>
  );
};

export default QRPage;
