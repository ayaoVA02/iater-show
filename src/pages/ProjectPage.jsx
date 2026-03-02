import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { BiCalendar } from "react-icons/bi";
import { BsEye } from "react-icons/bs";
import { supabase } from "../../lib/supabase";
import BlogPostModal from "./BlogPostDetail";
import Noblogs from "../components/Noblogs";
import Skeleton_blogs from "../components/Skeleton_blogs";

const parseImageUrls = (imageValue) => {
  if (!imageValue) return [];

  try {
    const parsed = JSON.parse(imageValue);
    if (Array.isArray(parsed)) {
      return parsed.filter((url) => typeof url === "string" && url.trim() !== "");
    }
  } catch {
    // Keep backward compatibility with single URL string values.
  }

  return String(imageValue)
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean);
};

const getLocalizedField = (post, baseField, language) => {
  if (language === "en") return post[`${baseField}_en`] || post[baseField] || "";
  if (language === "ko") return post[`${baseField}_ko`] || post[baseField] || "";
  return post[baseField] || "";
};

const ProjectPage = () => {
  const { t, i18n } = useTranslation();

  // State management
  const [blogs, setBlogs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Font class based on language
  const fontClass = {
    en: "font-en",
    la: "font-lao",
    ko: "font-kr",
  }[i18n.language];

  // Load blogs from Supabase
  useEffect(() => {
    const loadBlogs = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("blogs")
        .select(`
          id,
          title,
          title_en,
          title_ko,
          content,
          content_en,
          content_ko,
          created_at,
          image_url,
          view,
          profiles(name)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading blogs:", error);
        setError(error.message);
        setBlogs([]);
      } else {
        console.log("Blogs loaded successfully:", data);
        setBlogs(data);
      }

      setLoading(false);
    };

    loadBlogs();
  }, []);

  // Handlers
  const incrementViewCount = async (postId) => {
    console.log("=== Starting incrementViewCount ===");
    console.log("Post ID:", postId);
    
    try {
      // Get current view count
      const { data: currentPost, error: fetchError } = await supabase
        .from("blogs")
        .select("view")
        .eq("id", postId)
        .single();

      console.log("Current post data:", currentPost);
      console.log("Fetch error:", fetchError);

      if (fetchError) {
        console.error("❌ Error fetching view count:", fetchError);
        return;
      }

      // Increment view count
      const newViewCount = (currentPost.view || 0) + 1;
      console.log("Old view count:", currentPost.view);
      console.log("New view count:", newViewCount);
      console.log("postId:", postId);

      // Update in database
      const { data: updateData, error: updateError } = await supabase
        .from("blogs")
        .update({ view: newViewCount })
        .eq("id", postId)
        .select(); // Add .select() to get the updated data back

      console.log("Update response data:", updateData);
      console.log("Update error:", updateError);

      if (updateError) {
        console.error("❌ Error updating view count:", updateError);
        console.error("Update error details:", {
          message: updateError.message,
          details: updateError.details,
          hint: updateError.hint,
          code: updateError.code
        });
        return;
        
      }

      console.log("✅ View count updated successfully in database");

      // Update local state to reflect new view count
      setBlogs((prevBlogs) => {
        const updatedBlogs = prevBlogs.map((blog) =>
          blog.id === postId ? { ...blog, view: newViewCount } : blog
        );
        console.log("Updated local state");
        return updatedBlogs;
      });

      console.log("=== incrementViewCount completed ===");
    } catch (error) {
      console.error("❌ Unexpected error in incrementViewCount:", error);
    }
  };

  const handlePostClick = async (post) => {
    console.log("Blog post clicked:", post.title);
    setSelectedPost(post);
    setIsModalOpen(true);
    
    // Increment view count in background
    await incrementViewCount(post.id);
  };

  const closeModal = () => {
    setSelectedPost(null);
    setIsModalOpen(false);
  };

  // Helper functions
  const formatDate = (iso) => {
    const date = new Date(iso);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
  };

  const stripHtmlTags = (html) => {
    return (html || "").replace(/<[^>]*>?/gm, "");
  };

  // Loading state
  if (loading || error) {
    return (
      <div className={`bg-white ${fontClass}`}>
        <div className="container mx-auto px-4 py-6 w-[1224px]">
          <Skeleton_blogs />
        </div>
      </div>
    );
  }

  // Empty state
  if (!blogs || blogs.length === 0) {
    return <Noblogs />;
  }

  // Main content
  return (
    <div className={`bg-white ${fontClass}`}>
      <div className="container mx-auto px-4 py-6 w-[1224px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {blogs.map((post) => (
            <BlogCard
              key={post.id}
              post={post}
              onClick={() => handlePostClick(post)}
              formatDate={formatDate}
              stripHtmlTags={stripHtmlTags}
              t={t}
              language={i18n.language}
            />
          ))}
        </div>

        <BlogPostModal
          post={selectedPost}
          isOpen={isModalOpen}
          onClose={closeModal}
          allPosts={blogs}
        />
      </div>
    </div>
  );
};

// Extracted Blog Card Component
const BlogCard = ({ post, onClick, formatDate, stripHtmlTags, t, language }) => {
  const title = getLocalizedField(post, "title", language);
  const content = getLocalizedField(post, "content", language);
  const primaryImage = parseImageUrls(post.image_url)[0] || "";

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={primaryImage}
          alt={title}
          className="w-full h-48 object-cover transform transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-bold text-xl mb-3 line-clamp-2 text-gray-900">
          {title}
        </h3>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <BiCalendar size={16} className="mr-1" />
            <span>{formatDate(post.created_at)}</span>
          </div>

          <div className="flex items-center">
            <BsEye size={16} className="mr-1" />
            <span>{post.view || 0}</span>
          </div>
        </div>

        <p className="text-gray-600 line-clamp-3">
          {stripHtmlTags(content).substring(0, 120)}...
        </p>

        <div className="mt-4 flex items-center text-blue-600 font-medium text-sm">
          {t("projectpage.read_more")}
          <svg
            className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
