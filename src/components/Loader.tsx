import React from "react";

const Loader: React.FC = () => {

  const placeholders = Array.from({ length: 16 });

  return (
    <div className="max-w-7xl mx-auto px-4 pb-16">
      <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
        {placeholders.map((_, idx) => (
          <div
            key={idx}
            className="break-inside-avoid mb-6 rounded-2xl overflow-hidden"
          >
            <div className="w-full h-60 bg-gray-200 animate-pulse rounded-2xl"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loader;
