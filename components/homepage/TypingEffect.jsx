"use client";
import React from "react";
import { TypeAnimation } from "react-type-animation";

const TypingEffect = ({ texts }) => {
  const sequence = texts.flatMap((text) => [text, 2000]); // Display each text for 2 seconds

  return (
    <span className="relative h-10 inline-flex items-center whitespace-nowrap">
      <TypeAnimation
        sequence={sequence}
        wrapper="div"
        speed={50}
        repeat={Infinity}
      />
    </span>
  );
};

export default TypingEffect;
