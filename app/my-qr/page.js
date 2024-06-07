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
import { Reorder } from 'framer-motion';
import { MdDragIndicator } from 'react-icons/md';

const QRPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const [menus, setMenus] = useState([]);
  const [originalMenus, setOriginalMenus] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMenu, setCurrentMenu] = useState(null);
  const [name, setName] = useState("");
  const [orderChanged, setOrderChanged] = useState(false);

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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">My QR Menus</h1>
      <Button onClick={() => openModal()}>Create Menu</Button>
      <div className="mt-4">
        {menus.length > 0 ? (
          <Reorder.Group axis="y" values={menus} onReorder={handleReorder}>
            {menus.map((menu) => (
              <Reorder.Item key={menu.id} value={menu}>
                <Card className="mb-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div
                        className="cursor-pointer mr-4"
                        onPointerDown={(e) => e.target.parentNode.parentNode.draggable = true}
                        onPointerUp={(e) => e.target.parentNode.parentNode.draggable = false}
                      >
                        <MdDragIndicator className="text-xl" />
                      </div>
                      <div>
                        <h2 className="text-xl">{menu.name}</h2>
                        <p className="text-sm text-gray-500">
                          {menu.categoriesCount} categories, {menu.productsCount} products
                        </p>
                      </div>
                    </div>
                    <div>
                      <Button onClick={() => openModal(menu)}>Edit</Button>
                      <Button onClick={() => router.push(`/my-qr/menus/${menu.id}`)}>View</Button>
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
  );
};

export default QRPage;
