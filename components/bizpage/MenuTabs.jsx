import React from "react";
import { Tab } from "@headlessui/react";

const MenuTabs = ({ menus, selectedMenuId, setSelectedMenuId }) => {
  const handleTabChange = (index) => {
    setSelectedMenuId(menus[index].id);
  };

  return (
    <div className="w-full bg-brandWhite dark:bg-brandBlack mt-2">
      <Tab.Group
        selectedIndex={menus.findIndex((menu) => menu.id === selectedMenuId)}
        onChange={handleTabChange}
      >
        <Tab.List className="flex flex-wrap justify-center space-x-4 px-4 py-2 mb-0">
          {menus.map((menu) => (
            <Tab
              key={menu.id}
              className={({ selected }) =>
                `px-2 py-2 text-sm font-medium rounded-md ${
                  selected
                    ? "text-white bg-brandOrange"
                    : "text-brandBlack dark:text-brandWhite"
                }`
              }
            >
              {menu.name}
            </Tab>
          ))}
        </Tab.List>
      </Tab.Group>
      <hr className="border-brandGray dark:border-brandDarkGray w-full my-0" />
    </div>
  );
};

export default MenuTabs;
