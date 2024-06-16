import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FaSearch } from "react-icons/fa";

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  return (
    <div className="flex justify-center mt-2 mb-2 space-x-2 bg-white dark:bg-gray-900 p-2">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white"
        placeholder="Search products..."
      />
      <Button onClick={handleSearch} className="px-4 py-2" variant="ghost">
        <FaSearch />
      </Button>
    </div>
  );
};

export default SearchBar;
