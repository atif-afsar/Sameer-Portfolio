import React from 'react';

const StackingLayout = ({ children }) => {
  return (
    <div className="relative w-full">
      {React.Children.map(children, (child, index) => {
        return (
          <div 
            key={index}
            className="sticky top-0 w-full h-screen overflow-hidden bg-inherit"
            style={{ 
              zIndex: index + 1,
            }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
};

export default StackingLayout;
