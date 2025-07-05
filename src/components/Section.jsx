import React from "react";

const Section = ({ title, children, className = "" }) => (
  <section className={`mb-6 ${className}`}>
    {title && (
      <h2 className="text-lg font-semibold mb-2 border-b border-gray-200 pb-1">{title}</h2>
    )}
    <div>{children}</div>
  </section>
);

export default Section; 