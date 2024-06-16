import React from "react";

const BannerAvatar = ({ bannerImageUrl, avatarImageUrl }) => {
  return (
    <div>
      {bannerImageUrl && (
        <img
          src={bannerImageUrl}
          alt="Banner"
          className="w-full h-32 sm:h-48 md:h-64 object-cover"
        />
      )}
      <div className="relative">
        {avatarImageUrl && (
          <img
            src={avatarImageUrl}
            alt="Avatar"
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 object-cover rounded-full border-4 border-white dark:border-gray-800"
          />
        )}
      </div>
    </div>
  );
};

export default BannerAvatar;
