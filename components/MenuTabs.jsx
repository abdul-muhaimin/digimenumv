import React from "react";
import { Tab } from "@headlessui/react";

const MenuTabs = ({ menus, selectedMenuId, setSelectedMenuId }) => {
  const handleTabChange = (index) => {
    setSelectedMenuId(menus[index].id);
  };

  return (
    <div className="w-full bg-white dark:bg-gray-900">
      <Tab.Group
        selectedIndex={menus.findIndex((menu) => menu.id === selectedMenuId)}
        onChange={handleTabChange}
      >
        <Tab.List className="flex flex-wrap justify-center space-x-4 px-4 py-2 mb-0">
          {menus.map((menu, index) => (
            <Tab
              key={menu.id}
              className="px-2 py-2 text-sm font-medium rounded-md"
            >
              {({ selected }) => (
                <span className={selected ? "text-blue-600" : "text-gray-600"}>
                  {menu.name}
                </span>
              )}
            </Tab>
          ))}
        </Tab.List>
      </Tab.Group>
      <hr className="border-gray-300 dark:border-gray-700 w-full my-0" />
    </div>
  );
};

export default MenuTabs;
