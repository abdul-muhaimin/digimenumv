import React from "react";
import { Button } from "@/components/ui/button";
import { FaTh, FaList, FaSearch } from "react-icons/fa";

const CategoryBar = ({
  categories,
  categoryRefs,
  showCategories,
  setShowCategories,
  view,
  setView,
  showSearch,
  setShowSearch,
}) => {
  return (
    <div className="w-full bg-gray-100 dark:bg-gray-800">
      <div className="flex justify-center mt-2 mb-0 space-x-2">
        <Button
          onClick={() => setShowCategories(!showCategories)}
          className="px-4 py-2"
          variant="ghost"
        >
          {showCategories ? "Hide Categories" : "Show Categories"}
        </Button>
        <Button
          onClick={() => setShowSearch(!showSearch)}
          className="px-4 py-2"
          variant="ghost"
        >
          <FaSearch />
        </Button>
        <Button
          onClick={() => setView(view === "grid" ? "list" : "grid")}
          className="px-4 py-2"
          variant="ghost"
        >
          {view === "grid" ? <FaList /> : <FaTh />}
        </Button>
      </div>
      {showCategories && (
        <div className="overflow-x-auto">
          <div className="flex flex-wrap justify-center space-x-4 px-4 py-2">
            {categories.map((category, index) => (
              <Button
                key={category.id}
                onClick={() =>
                  categoryRefs.current[index]?.scrollIntoView({
                    behavior: "smooth",
                  })
                }
                className="px-2 py-2 text-sm font-medium rounded-md"
                variant="ghost"
              >
                {category.name}
              </Button>
            ))}
          </div>
          <hr className="border-gray-300 dark:border-gray-700 w-full my-0" />
        </div>
      )}
    </div>
  );
};

export default CategoryBar;
