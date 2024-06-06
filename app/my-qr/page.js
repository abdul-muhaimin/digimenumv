"use client"
import { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'react-toastify';

const QRPage = () => {
  const [menus, setMenus] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMenuId, setCurrentMenuId] = useState(null);
  const [menuName, setMenuName] = useState('');

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await fetch('/api/menus');
        if (response.ok) {
          const data = await response.json();
          setMenus(data);
        } else {
          toast.error('Failed to fetch menus');
        }
      } catch (error) {
        toast.error('An error occurred while fetching menus');
      }
    };

    fetchMenus();
  }, []);

  const openModal = (menu = null) => {
    if (menu) {
      setIsEditing(true);
      setCurrentMenuId(menu.id);
      setMenuName(menu.name);
    } else {
      setIsEditing(false);
      setCurrentMenuId(null);
      setMenuName('');
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSaveMenu = async () => {
    try {
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing ? `/api/menus/${currentMenuId}` : '/api/menus';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: menuName }),
      });

      if (response.ok) {
        const updatedMenu = await response.json();
        if (isEditing) {
          setMenus(menus.map(menu => (menu.id === currentMenuId ? updatedMenu : menu)));
        } else {
          setMenus([...menus, updatedMenu]);
        }
        closeModal();
        toast.success(`Menu ${isEditing ? 'updated' : 'created'} successfully`);
      } else {
        toast.error(`Failed to ${isEditing ? 'update' : 'create'} menu`);
      }
    } catch (error) {
      toast.error(`An error occurred while ${isEditing ? 'updating' : 'creating'} menu`);
    }
  };

  const handleDeleteMenu = async (menuId) => {
    try {
      const response = await fetch(`/api/menus/${menuId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMenus(menus.filter(menu => menu.id !== menuId));
        toast.success('Menu deleted successfully');
      } else {
        toast.error('Failed to delete menu');
      }
    } catch (error) {
      toast.error('An error occurred while deleting menu');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">My QR Menus</h1>
      <Button onClick={() => openModal()}>New Menu</Button>
      <div className="mt-4">
        {menus.length > 0 ? (
          menus.map(menu => (
            <Card key={menu.id} className="mb-4 p-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">{menu.name}</h2>
                <p>{new Date(menu.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex space-x-2">
                <Button onClick={() => openModal(menu)}>Edit</Button>
                <Button onClick={() => handleDeleteMenu(menu.id)}>Delete</Button>
              </div>
            </Card>
          ))
        ) : (
          <p>No menus available</p>
        )}
      </div>

      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
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
                    {isEditing ? 'Edit Menu' : 'Create Menu'}
                  </Dialog.Title>
                  <div className="mt-2">
                    <Label htmlFor="menuName" className="block text-sm font-medium text-gray-700">Menu Name</Label>
                    <Input
                      id="menuName"
                      value={menuName}
                      onChange={(e) => setMenuName(e.target.value)}
                      className="mt-1 block w-full"
                    />
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button onClick={handleSaveMenu}>{isEditing ? 'Save' : 'Create'}</Button>
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
