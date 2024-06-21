import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FaSearch } from "react-icons/fa";

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  return (
    <div className="flex justify-center mt-2 mb-2 space-x-2 bg-brandWhite dark:bg-brandBlack p-2 rounded-md">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="px-4 py-2 rounded-md border border-brandGray dark:border-brandDarkGray bg-brandWhite dark:bg-brandBlack text-brandBlack dark:text-brandWhite"
        placeholder="Search menu..."
      />
      <Button
        onClick={handleSearch}
        className="px-4 py-2 text-brandBlack dark:text-brandWhite bg-lightBrandOrange hover:bg-brandOrange"
        variant="ghost"
      >
        <FaSearch />
      </Button>
    </div>
  );
};

export default SearchBar;
