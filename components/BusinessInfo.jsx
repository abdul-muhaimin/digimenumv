import React from "react";
import { FaInstagram, FaFacebook, FaTwitter, FaWhatsapp } from "react-icons/fa";

const BusinessInfo = ({ businessName, storeDescription, links }) => {
  return (
    <div className="text-center mt-16 sm:mt-20 md:mt-24">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
        {businessName || "Store"}
      </h1>
      <p className="text-sm sm:text-lg md:text-xl">{storeDescription}</p>
      <div className="flex flex-wrap justify-center space-x-4 mt-4">
        {links?.instagram && (
          <a href={links.instagram} target="_blank" rel="noopener noreferrer">
            <FaInstagram className="text-xl sm:text-2xl" />
          </a>
        )}
        {links?.facebook && (
          <a href={links.facebook} target="_blank" rel="noopener noreferrer">
            <FaFacebook className="text-xl sm:text-2xl" />
          </a>
        )}
        {links?.twitter && (
          <a href={links.twitter} target="_blank" rel="noopener noreferrer">
            <FaTwitter className="text-xl sm:text-2xl" />
          </a>
        )}
        {links?.whatsapp && (
          <a href={links.whatsapp} target="_blank" rel="noopener noreferrer">
            <FaWhatsapp className="text-xl sm:text-2xl" />
          </a>
        )}
      </div>
    </div>
  );
};

export default BusinessInfo;
