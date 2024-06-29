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
    <div className="w-full bg-brandWhite dark:bg-brandBlack">
      <div className="flex justify-center mt-2 mb-0 space-x-2">
        <Button
          onClick={() => setShowCategories(!showCategories)}
          className="px-4 py-2"
          variant="ghost"
          style={{ color: "brandBlack", backgroundColor: "lightBrandOrange" }}
        >
          {showCategories ? "Hide Categories" : "Show Categories"}
        </Button>
        <Button
          onClick={() => setShowSearch(!showSearch)}
          className="px-4 py-2"
          variant="ghost"
          style={{ color: "brandBlack", backgroundColor: "lightBrandOrange" }}
        >
          <FaSearch />
        </Button>
        <Button
          onClick={() => setView(view === "grid" ? "list" : "grid")}
          className="px-4 py-2"
          variant="ghost"
          style={{ color: "brandBlack", backgroundColor: "lightBrandOrange" }}
        >
          {view === "grid" ? <FaList /> : <FaTh />}
        </Button>
      </div>
      {showCategories && (
        <div className="overflow-x-auto">
          <div className="flex flex-wrap justify-center space-x-4 px-4 py-2">
            {categories.map((category, index) => (
              <Button
                key={index}
                onClick={() =>
                  categoryRefs.current[index]?.scrollIntoView({
                    behavior: "smooth",
                  })
                }
                className="px-2 py-2 text-sm font-medium rounded-md"
                variant="ghost"
                style={{
                  color: "brandBlack",
                  backgroundColor: "lightBrandOrange",
                }}
              >
                {category.name}
              </Button>
            ))}
          </div>
          <hr className="border-brandGray dark:border-brandDarkGray w-full my-0" />
        </div>
      )}
    </div>
  );
};

export default CategoryBar;
