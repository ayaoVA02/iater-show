import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import ComponentCard from "../../common/ComponentCard.tsx";
import Label from "../Label.tsx";
import Input from "../input/InputField.tsx";
import Select from "../Select.tsx";
import TextArea from "../input/TextArea.tsx";
import Button from "../../ui/button/Button.tsx";
import { useAuth } from "../../../../context/AuthProvider.tsx";
import { supabase } from "../../../../../lib/supabase";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const fileTypes = {
  "image/png": [],
  "image/jpeg": [],
  "image/webp": [],
  "image/svg+xml": [],
};

const selectOptions = [
  { value: "EXTERNAL", label: "External Project" },
  { value: "INTERNAL_ACTIVITY", label: "Internal Activities" },
  { value: "RESEARCH", label: "Research Activities" },
];

const parseImageUrls = (imageValue: string | null | undefined) => {
  if (!imageValue) return [];

  try {
    const parsed = JSON.parse(imageValue);
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (url): url is string => typeof url === "string" && url.trim() !== "",
      );
    }
  } catch {
    // Keep backward compatibility with single URL values.
  }

  return imageValue
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean);
};

const serializeImageUrls = (urls: string[]) => {
  if (urls.length === 0) return null;
  return urls.length === 1 ? urls[0] : JSON.stringify(urls);
};

export default function EditPost() {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [titleLa, setTitleLa] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [titleKo, setTitleKo] = useState("");
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [contentLa, setContentLa] = useState("");
  const [contentEn, setContentEn] = useState("");
  const [contentKo, setContentKo] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [oldImageUrls, setOldImageUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const [touched, setTouched] = useState({
    titleLa: false,
    selectedOption: false,
    contentLa: false,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/signin");
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;

      setIsFetching(true);
      const loadingToast = toast.loading("Loading post...");

      try {
        const { data, error } = await supabase
          .from("blogs")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          console.error("Error fetching post:", error);
          toast.error("Failed to load post", { id: loadingToast });
          navigate("/admin");
          return;
        }

        if (data) {
          setTitleLa(data.title || "");
          setTitleEn(data.title_en || "");
          setTitleKo(data.title_ko || "");
          setSelectedOption(data.types || "");
          setContentLa(data.content || "");
          setContentEn(data.content_en || "");
          setContentKo(data.content_ko || "");
          setOldImageUrls(parseImageUrls(data.image_url));
          toast.success("Post loaded successfully", { id: loadingToast });
        }
      } catch (err) {
        console.error("Failed to load post", err);
        toast.error("Failed to load post", { id: loadingToast });
      } finally {
        setIsFetching(false);
      }
    };

    fetchPost();
  }, [id, navigate]);

  const generateRandomName = (length = 24) => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const uploadImageToStorage = async (file: File) => {
    if (!file || !user) throw new Error("File or user not found");

    const randomName = generateRandomName();
    const fileExt = file.name.split(".").pop();
    const filePath = `blogs/${randomName}.${fileExt}`;

    const { error } = await supabase.storage
      .from("iater2025-storage")
      .upload(filePath, file, { upsert: false });

    if (error) throw error;

    const { data } = supabase.storage
      .from("iater2025-storage")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const deleteImageFromStorage = async (imageUrl: string) => {
    try {
      const urlParts = imageUrl.split("/");
      const blogsIndex = urlParts.indexOf("blogs");
      if (blogsIndex === -1) return;

      const filePath = urlParts.slice(blogsIndex).join("/");
      const { error } = await supabase.storage
        .from("iater2025-storage")
        .remove([filePath]);

      if (error) {
        console.error("Error deleting image:", error);
      }
    } catch (err) {
      console.error("Failed to delete image:", err);
    }
  };

  const clearSelectedFiles = () => {
    previews.forEach((url) => URL.revokeObjectURL(url));
    setPreviews([]);
    setSelectedFiles([]);
  };

  const handleDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const newPreviews = acceptedFiles.map((file) => URL.createObjectURL(file));
      setSelectedFiles((prev) => [...prev, ...acceptedFiles]);
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: fileTypes,
    multiple: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({
      titleLa: true,
      selectedOption: true,
      contentLa: true,
    });

    if (!titleLa || !selectedOption || !contentLa) {
      toast.error("Please fill all required fields.");
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading("Updating post...");

    try {
      if (!user) {
        toast.error("You must be logged in", { id: loadingToast });
        return;
      }

      let finalImageUrls = [...oldImageUrls];

      // If new files are selected, replace all current images with the new list.
      if (selectedFiles.length > 0) {
        const uploadedImageUrls = await Promise.all(
          selectedFiles.map(uploadImageToStorage),
        );

        await Promise.all(oldImageUrls.map(deleteImageFromStorage));
        finalImageUrls = uploadedImageUrls;
      }

      const { error } = await supabase
        .from("blogs")
        .update({
          title: titleLa,
          title_en: titleEn || null,
          title_ko: titleKo || null,
          types: selectedOption,
          content: contentLa,
          content_en: contentEn || null,
          content_ko: contentKo || null,
          image_url: serializeImageUrls(finalImageUrls),
        })
        .eq("id", id);

      if (error) {
        console.error("Error updating post:", error);
        toast.error("Failed to update post", { id: loadingToast });
        return;
      }

      setOldImageUrls(finalImageUrls);
      clearSelectedFiles();
      toast.success("Post updated successfully!", { id: loadingToast });

      setTimeout(() => {
        navigate("/admin");
      }, 1500);
    } catch (err) {
      console.error("Error updating post:", err);
      toast.error("Failed to update post", { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  const isInvalid = {
    titleLa: touched.titleLa && !titleLa,
    selectedOption: touched.selectedOption && !selectedOption,
    contentLa: touched.contentLa && !contentLa,
  };

  const displayedImages = previews.length > 0 ? previews : oldImageUrls;

  if (isFetching) {
    return (
      <ComponentCard title="Edit Post">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
        </div>
      </ComponentCard>
    );
  }

  return (
    <ComponentCard title="Edit Post">
      <form onSubmit={handleSubmit} className="space-y-12">
        <div>
          <Label>Upload Image(s)</Label>
          <div
            {...getRootProps()}
            className={`cursor-pointer rounded-xl border border-dashed p-7 lg:p-10 transition ${
              isDragActive
                ? "border-brand-500 bg-gray-100 dark:bg-gray-800"
                : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center">
              {displayedImages.length > 0 ? (
                <div className="w-full">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                    {displayedImages.map((url, index) => (
                      <img
                        key={`${url}-${index}`}
                        src={url}
                        alt={`Post image ${index + 1}`}
                        className="h-28 w-full object-cover rounded-lg"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-center text-gray-500">
                    {previews.length > 0
                      ? "New image list selected (will replace current images)"
                      : "Current image list"}
                  </p>
                  {previews.length > 0 && (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        clearSelectedFiles();
                      }}
                      className="mt-3 mx-auto block rounded-lg border border-gray-300 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      Clear new selection
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className="mb-5 flex justify-center">
                    <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                      <svg
                        className="fill-current"
                        width="29"
                        height="28"
                        viewBox="0 0 29 28"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M14.5 3.92c-.22 0-.42.09-.55.24L8.57 9.53a.667.667 0 0 0 .07.99c.26.24.68.23.93-.01l4.18-4.11v12.19c0 .41.33.75.75.75s.75-.34.75-.75V6.48l4.11 4.11c.26.24.68.23.93-.01a.667.667 0 0 0-.01-.93l-5.34-5.34a.75.75 0 0 0-.55-.24ZM5.92 18.67c0-.41-.34-.75-.75-.75s-.75.34-.75.75v3.17c0 1.24 1 2.25 2.25 2.25h15.67c1.24 0 2.25-1.01 2.25-2.25v-3.17c0-.41-.34-.75-.75-.75s-.75.34-.75.75v3.17c0 .41-.34.75-.75.75H6.67c-.41 0-.75-.34-.75-.75v-3.17Z"
                        />
                      </svg>
                    </div>
                  </div>
                  <h4 className="mb-3 font-semibold text-gray-800 text-theme-xl dark:text-white/90">
                    {isDragActive ? "Drop Files Here" : "Drag & Drop Files Here"}
                  </h4>
                  <span className="mb-5 block w-full max-w-[290px] text-center text-sm text-gray-700 dark:text-gray-400">
                    PNG, JPG, WebP, SVG files supported. Select one or many images.
                  </span>
                  <span className="text-brand-500 text-theme-sm font-medium underline">
                    Browse Files
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="id">Post ID</Label>
          <Input type="text" id="id" value={id || ""} disabled />
        </div>

        <div>
          <Label htmlFor="title-la">
            Title (Lao) <span className="text-red-500">*</span>
          </Label>
          <Input
            type="text"
            id="title-la"
            value={titleLa}
            onChange={(e) => setTitleLa(e.target.value)}
            className={
              isInvalid.titleLa
                ? "!border-red-500 focus:!border-red-500 focus:!ring-1 focus:!ring-red-500"
                : ""
            }
          />
          {isInvalid.titleLa && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              Lao title is required
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="title-en">Title (English)</Label>
          <Input
            type="text"
            id="title-en"
            value={titleEn}
            onChange={(e) => setTitleEn(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="title-ko">Title (Korean)</Label>
          <Input
            type="text"
            id="title-ko"
            value={titleKo}
            onChange={(e) => setTitleKo(e.target.value)}
          />
        </div>

        <div>
          <Label>
            Select type <span className="text-red-500">*</span>
          </Label>
          <Select
            key={selectedOption || "empty"}
            options={selectOptions}
            placeholder="Select an option"
            defaultValue={selectedOption}
            onChange={(value: string) => {
              setSelectedOption(value);
              setTouched((prev) => ({ ...prev, selectedOption: true }));
            }}
            className={isInvalid.selectedOption ? "!border-red-500" : ""}
          />
          {isInvalid.selectedOption && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              Please select a type
            </p>
          )}
        </div>

        <div>
          <Label>
            Description (Lao) <span className="text-red-500">*</span>
          </Label>
          <p className="text-sm text-gray-400 mb-2">
            Write subtitle with h2 --title--- h2
          </p>
          <TextArea
            value={contentLa}
            onChange={setContentLa}
            rows={6}
            hint="Please enter a valid message."
            className={
              isInvalid.contentLa
                ? "!border-red-500 focus:!border-red-500 focus:!ring-1 focus:!ring-red-500"
                : ""
            }
          />
          {isInvalid.contentLa && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              Lao description is required
            </p>
          )}
        </div>

        <div>
          <Label>Description (English)</Label>
          <TextArea
            value={contentEn}
            onChange={setContentEn}
            rows={6}
            hint="Optional: English translation."
          />
        </div>

        <div>
          <Label>Description (Korean)</Label>
          <TextArea
            value={contentKo}
            onChange={setContentKo}
            rows={6}
            hint="Optional: Korean translation."
          />
        </div>

        <div className="flex gap-3">
          <Button disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Post"}
          </Button>
          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </ComponentCard>
  );
}
