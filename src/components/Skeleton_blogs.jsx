import React from "react";

const Skeleton_blogs = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse"
        >
          {/* Image Skeleton */}
          <div className="h-48 w-full bg-gray-200" />

          {/* Content */}
          <div className="p-5 space-y-4">
            {/* Title */}
            <div className="h-5 bg-gray-200 rounded w-3/4" />

            {/* Meta (date + view) */}
            <div className="flex items-center justify-between">
              <div className="h-4 bg-gray-200 rounded w-24" />
              <div className="h-4 bg-gray-200 rounded w-10" />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
            </div>

            {/* Read more */}
            <div className="h-4 bg-gray-200 rounded w-24 mt-4" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Skeleton_blogs;
