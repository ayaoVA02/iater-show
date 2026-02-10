import React, { useEffect, useState } from 'react';
import { BsEye } from 'react-icons/bs';
import { BiCalendar } from 'react-icons/bi';
import { FaFacebook } from 'react-icons/fa';
import { CiShare2 } from 'react-icons/ci';
import { FcLike, FcLikePlaceholder } from 'react-icons/fc';
import DOMPurify from 'dompurify';

const BlogPostModal = ({ post, isOpen, onClose }) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);

  // Initialize likes when post changes
  useEffect(() => {
    if (post) {
      setLikes(Math.floor(Math.random() * 100) + 10);
      setLiked(false);
    }
  }, [post]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen || isImageViewerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isImageViewerOpen]);

  // Handle ESC key for main modal
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Handle ESC key for image viewer
  useEffect(() => {
    if (!isImageViewerOpen) return;

    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setIsImageViewerOpen(false);
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isImageViewerOpen]);

  // Don't render if not open or no post
  if (!isOpen || !post) return null;

  // Handlers
  const handleLike = () => {
    setLikes(liked ? likes - 1 : likes + 1);
    setLiked(!liked);
  };

  const handleBackdropClick = (e) => {
    // Only close if clicking the backdrop itself
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleImageViewerBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsImageViewerOpen(false);
    }
  };

  // Helper functions
  const formatContent = (rawContent) => {
    if (!rawContent) return '';

    return rawContent.replace(
      /h2 (.*?) h2/g,
      '<hr class="mt-8 border-gray-300" /><h2 class="font-bold text-xl pt-4 my-4 text-gray-800">$1</h2>'
    );
  };

  const formatDate = (dateString) => {
    return dateString?.slice(0, 10) || '';
  };

  return (
    <>
      {/* Main Modal */}
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
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold flex-1 text-center pr-8">
                  {post.title}
                </h1>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold min-w-[32px] min-h-[32px] flex items-center justify-center"
                  aria-label="Close modal"
                >
                  ×
                </button>
              </div>

              {/* Post date */}
              <div className="text-center text-gray-500 mb-6">
                {formatDate(post.created_at)}
              </div>

              {/* Featured image */}
              {post.image_url && (
                <div className="mb-8 relative">
                  {/* Action buttons */}
                  <div className="absolute right-4 bottom-4 flex space-x-4 z-10">
                    <button
                      onClick={handleLike}
                      className="p-2 rounded-full bg-white/90 hover:bg-white transition-colors flex items-center gap-2 shadow-md"
                      aria-label={liked ? "Unlike post" : "Like post"}
                    >
                      {/* <span className="text-sm font-medium">{likes}</span> */}
                      <span className="text-sm font-medium">{post.like}</span>
                      {liked ? <FcLike size={18} /> : <FcLikePlaceholder size={18} />}
                    </button>
                    <button
                      className="p-2 rounded-full bg-white/90 hover:bg-white transition-colors shadow-md"
                      aria-label="Share on Facebook"
                    >
                      <FaFacebook size={18} className="text-blue-600" />
                    </button>
                    <button
                      className="p-2 rounded-full bg-white/90 hover:bg-white transition-colors shadow-md"
                      aria-label="Share"
                    >
                      <CiShare2 size={18} />
                    </button>
                  </div>

                  {/* Image */}
                  <div className="flex justify-center">
                    <button
                      className="w-full max-w-[550px] hover:opacity-90 transition-opacity"
                      onClick={() => setIsImageViewerOpen(true)}
                      title="Click to view full image"
                    >
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="w-full h-full rounded-lg shadow-md object-cover"
                      />
                    </button>
                  </div>
                </div>
              )}

              {/* Post content */}
              <div className="prose max-w-none mb-8">
                <div
                  className="text-lg leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(formatContent(post.content || '')),
                  }}
                />
              </div>

              {/* Post metadata */}
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

      {/* Image Viewer Modal */}
      {isImageViewerOpen && post.image_url && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90"
          onClick={handleImageViewerBackdropClick}
        >
          <div className="relative max-w-[95vw] max-h-[95vh]">
            {/* Close button */}
            <button
              onClick={() => setIsImageViewerOpen(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 text-3xl font-bold z-10"
              aria-label="Close image viewer"
            >
              ×
            </button>

            {/* Full size image */}
            <img
              src={post.image_url}
              alt={post.title}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl cursor-zoom-out"
              onClick={() => setIsImageViewerOpen(false)}
            />

            {/* Image info */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4 rounded-b-lg">
              <p className="text-center font-medium">{post.title}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BlogPostModal;