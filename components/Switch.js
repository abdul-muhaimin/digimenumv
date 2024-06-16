import React from 'react';

const Switch = ({ isChecked, onChange, label }) => {
  return (
    <label className="flex items-center cursor-pointer">
      <span className="mr-2">{label}</span>
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={isChecked}
          onChange={onChange}
        />
        <div className={`block w-14 h-8 rounded-full transition ${isChecked ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <div
          className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${isChecked ? 'transform translate-x-6' : ''}`}
        ></div>
      </div>
    </label>
  );
};


export default Switch;
