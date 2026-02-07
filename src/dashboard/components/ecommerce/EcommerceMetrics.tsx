import { useEffect, useState } from "react";
import { BsEye } from "react-icons/bs";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ListIcon,
} from "../../icons";
import Badge from "../ui/badge/Badge";
import { supabase } from "../../../../lib/supabase"; // make sure your path is correct

export default function EcommerceMetrics() {
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [totalViews, setTotalViews] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("blogs")
          .select("id, view, like");

        if (error) throw error;

        setTotalBlogs(data?.length || 0);

        const views = data?.reduce((sum, blog) => sum + (blog.view || 0), 0) || 0;
        const likes = data?.reduce((sum, blog) => sum + (blog.like || 0), 0) || 0;

        setTotalViews(views);
        setTotalLikes(likes);
      } catch (err) {
        console.error("Error fetching metrics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Loading metrics...</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
      {/* Total Blogs */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <ListIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Blogs</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {totalBlogs}
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon /> {/* You can compute % change if needed */}
            11.01%
          </Badge>
        </div>
      </div>

      {/* Total Views */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BsEye className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Views</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {totalViews}
            </h4>
          </div>
          <Badge color="error">
            <ArrowDownIcon /> {/* Compute change if you want */}
            9.05%
          </Badge>
        </div>
      </div>

      {/* Total Likes (Optional) */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          ❤️
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Likes</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {totalLikes}
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon /> {/* Optional: % change */}
            5.23%
          </Badge>
        </div>
      </div>
    </div>
  );
}
