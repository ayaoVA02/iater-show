import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BsEye } from "react-icons/bs";
import { BiCalendar } from "react-icons/bi";
import { FaFacebook } from "react-icons/fa";
import { CiShare2 } from "react-icons/ci";
import { FcLike, FcLikePlaceholder } from "react-icons/fc";
import DOMPurify from "dompurify";

const parseImageUrls = (imageValue) => {
  if (!imageValue) return [];

  try {
    const parsed = JSON.parse(imageValue);
    if (Array.isArray(parsed)) {
      return parsed.filter((url) => typeof url === "string" && url.trim() !== "");
    }
  } catch {
    // Keep backward compatibility with single URL values.
  }

  return String(imageValue)
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean);
};

const getLocalizedField = (post, baseField, language) => {
  if (language === "en") return post?.[`${baseField}_en`] || post?.[baseField] || "";
  if (language === "ko") return post?.[`${baseField}_ko`] || post?.[baseField] || "";
  return post?.[baseField] || "";
};

const BlogPostModal = ({ post, isOpen, onClose }) => {
  const { i18n } = useTranslation();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const imageUrls = parseImageUrls(post?.image_url);

  useEffect(() => {
    if (post) {
      setLikes(Math.floor(Math.random() * 100) + 10);
      setLiked(false);
      setActiveImageIndex(0);
    }
  }, [post]);

  useEffect(() => {
    if (isOpen || isImageViewerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, isImageViewerOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isImageViewerOpen) return;

    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setIsImageViewerOpen(false);
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isImageViewerOpen]);

  useEffect(() => {
    if (!isOpen || imageUrls.length <= 1) return;

    const interval = setInterval(() => {
      setActiveImageIndex((prev) =>
        prev === imageUrls.length - 1 ? 0 : prev + 1,
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [isOpen, imageUrls.length]);

  useEffect(() => {
    if (!isOpen || imageUrls.length <= 1) return;

    const handleArrowKeys = (e) => {
      if (e.key === "ArrowLeft") {
        setActiveImageIndex((prev) =>
          prev === 0 ? imageUrls.length - 1 : prev - 1,
        );
      } else if (e.key === "ArrowRight") {
        setActiveImageIndex((prev) =>
          prev === imageUrls.length - 1 ? 0 : prev + 1,
        );
      }
    };

    window.addEventListener("keydown", handleArrowKeys);
    return () => window.removeEventListener("keydown", handleArrowKeys);
  }, [isOpen, imageUrls.length]);

  if (!isOpen || !post) return null;

  const title = getLocalizedField(post, "title", i18n.language);
  const content = getLocalizedField(post, "content", i18n.language);
  const activeImage = imageUrls[activeImageIndex] || "";

  const handleLike = () => {
    setLikes(liked ? likes - 1 : likes + 1);
    setLiked(!liked);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleImageViewerBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsImageViewerOpen(false);
    }
  };

  const formatContent = (rawContent) => {
    if (!rawContent) return "";

    return rawContent.replace(
      /h2 (.*?) h2/g,
      '<hr class="mt-8 border-gray-300" /><h2 class="font-bold text-xl pt-4 my-4 text-gray-800">$1</h2>',
    );
  };

  const formatDate = (dateString) => {
    return dateString?.slice(0, 10) || "";
  };

  const showPreviousImage = () => {
    setActiveImageIndex((prev) =>
      prev === 0 ? imageUrls.length - 1 : prev - 1,
    );
  };

  const showNextImage = () => {
    setActiveImageIndex((prev) =>
      prev === imageUrls.length - 1 ? 0 : prev + 1,
    );
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        onClick={handleBackdropClick}
      >
        <div
          className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="overflow-y-auto max-h-[90vh]">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold flex-1 text-center pr-8">
                  {title}
                </h1>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold min-w-[32px] min-h-[32px] flex items-center justify-center"
                  aria-label="Close modal"
                >
                  x
                </button>
              </div>

              <div className="text-center text-gray-500 mb-6">
                {formatDate(post.created_at)}
              </div>

              {imageUrls.length > 0 && (
                <div className="mb-8 relative">
                  <div className="absolute right-4 bottom-4 flex space-x-4 z-10">
                    <button
                      onClick={handleLike}
                      className="p-2 rounded-full bg-white/90 hover:bg-white transition-colors flex items-center gap-2 shadow-md"
                      aria-label={liked ? "Unlike post" : "Like post"}
                    >
                      <span className="text-sm font-medium">{post.like}</span>
                      {liked ? <FcLike size={18} /> : <FcLikePlaceholder size={18} />}
                    </button>
                    <a
                      href="https://www.facebook.com/profile.php?id=100076123785189"
                      target="_blank"
                      className="p-2 rounded-full bg-white/90 hover:bg-white transition-colors shadow-md"
                      aria-label="Share on Facebook"
                      rel="noreferrer"
                    >
                      <FaFacebook size={18} className="text-blue-600" />
                    </a>
                    <button
                      className="p-2 rounded-full bg-white/90 hover:bg-white transition-colors shadow-md"
                      aria-label="Share"
                    >
                      <CiShare2 size={18} />
                    </button>
                  </div>

                  <div className="flex justify-center">
                    <div className="relative w-full max-w-[550px]">
                      {imageUrls.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={showPreviousImage}
                            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/60 text-white px-3 py-2 hover:bg-black/80"
                            aria-label="Previous image"
                          >
                            {"<"}
                          </button>
                          <button
                            type="button"
                            onClick={showNextImage}
                            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/60 text-white px-3 py-2 hover:bg-black/80"
                            aria-label="Next image"
                          >
                            {">"}
                          </button>
                        </>
                      )}
                      <button
                        className="w-full hover:opacity-90 transition-opacity"
                        onClick={() => setIsImageViewerOpen(true)}
                        title="Click to view full image"
                      >
                        <img
                          src={activeImage}
                          alt={title}
                          className="w-full h-full rounded-lg shadow-md object-cover"
                        />
                      </button>
                    </div>
                  </div>

                  {imageUrls.length > 1 && (
                    <div className="mt-4 grid grid-cols-3 md:grid-cols-5 gap-2">
                      {imageUrls.map((url, index) => (
                        <button
                          key={`${url}-${index}`}
                          onClick={() => setActiveImageIndex(index)}
                          className={`rounded-lg overflow-hidden border-2 ${
                            activeImageIndex === index
                              ? "border-brand-500"
                              : "border-transparent"
                          }`}
                        >
                          <img
                            src={url}
                            alt={`${title} ${index + 1}`}
                            className="h-16 w-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="prose max-w-none mb-8">
                <div
                  className="text-lg leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(formatContent(content)),
                  }}
                />
              </div>

              <div className="flex items-center justify-between text-gray-500 border-t pt-4">
                <div className="flex items-center">
                  <BiCalendar size={16} className="mr-2" />
                  <span>{formatDate(post.created_at)}</span>
                </div>
                <div className="flex items-center">
                  <BsEye size={16} className="mr-2" />
                  <span>{post.view || 0} views</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isImageViewerOpen && activeImage && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90"
          onClick={handleImageViewerBackdropClick}
        >
          <div className="relative max-w-[95vw] max-h-[95vh]">
            <button
              onClick={() => setIsImageViewerOpen(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 text-3xl font-bold z-10"
              aria-label="Close image viewer"
            >
              x
            </button>

            {imageUrls.length > 1 && (
              <>
                <button
                  onClick={showPreviousImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 text-white px-3 py-2 hover:bg-black/80"
                  aria-label="Previous image"
                >
                  {"<"}
                </button>
                <button
                  onClick={showNextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 text-white px-3 py-2 hover:bg-black/80"
                  aria-label="Next image"
                >
                  {">"}
                </button>
              </>
            )}

            <img
              src={activeImage}
              alt={title}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl cursor-zoom-out"
              onClick={() => setIsImageViewerOpen(false)}
            />

            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4 rounded-b-lg">
              <p className="text-center font-medium">{title}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BlogPostModal;
