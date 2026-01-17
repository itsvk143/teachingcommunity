import * as React from "react";

const Card = ({ children, className }) => {
  return (
    <div className={`bg-black shadow-lg rounded-xl p-4 ${className}`}>
      {children}
    </div>
  );
};

const CardContent = ({ children }) => {
  return <div className="p-4">{children}</div>;
};

export { Card, CardContent };