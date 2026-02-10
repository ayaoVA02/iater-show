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

export default function EditPost() {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [inputValue, setInputValue] = useState("");
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [oldImageUrl, setOldImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // Validation states
  const [touched, setTouched] = useState({
    inputValue: false,
    selectedOption: false,
    message: false,
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/signin");
    }
  }, [authLoading, user, navigate]);

  // Fetch post data on mount
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
          setInputValue(data.title || "");
          setSelectedOption(data.types || "");
          setMessage(data.content || "");
          setOldImageUrl(data.image_url || null);
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

  const deleteOldImage = async (imageUrl: string) => {
    try {
      // Extract file path from URL
      const urlParts = imageUrl.split("/");
      const filePath = urlParts.slice(urlParts.indexOf("blogs")).join("/");

      const { error } = await supabase.storage
        .from("iater2025-storage")
        .remove([filePath]);

      if (error) {
        console.error("Error deleting old image:", error);
      }
    } catch (err) {
      console.error("Failed to delete old image:", err);
    }
  };

  const handleDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles[0]) {
      setSelectedFile(acceptedFiles[0]);
      setPreview(URL.createObjectURL(acceptedFiles[0]));
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: fileTypes,
    multiple: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      inputValue: true,
      selectedOption: true,
      message: true,
    });

    if (!inputValue || !selectedOption || !message) {
      toast.error("Please fill all required fields.");
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading("Updating post...");

    try {
      if (!user) {
        toast.error("You must be logged in", { id: loadingToast });
        setIsLoading(false);
        return;
      }

      let imageUrl = oldImageUrl;

      // Upload new image if selected
      if (selectedFile) {
        imageUrl = await uploadImageToStorage(selectedFile);
        
        // Delete old image if it exists
        if (oldImageUrl) {
          await deleteOldImage(oldImageUrl);
        }
      }

      // Update post
      const { error } = await supabase
        .from("blogs")
        .update({
          title: inputValue,
          types: selectedOption,
          content: message,
          image_url: imageUrl,
        })
        .eq("id", id);

      if (error) {
        console.error("Error updating post:", error);
        toast.error("Failed to update post", { id: loadingToast });
        setIsLoading(false);
        return;
      }

      toast.success("Post updated successfully! 🎉", { id: loadingToast });
      
      // Navigate back to dashboard after short delay
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

  // Validation helpers
  const isInvalid = {
    inputValue: touched.inputValue && !inputValue,
    selectedOption: touched.selectedOption && !selectedOption,
    message: touched.message && !message,
  };

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
        {/* File Drop Area */}
        <div>
          <Label>Upload Image</Label>
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
              {preview || oldImageUrl ? (
                <div className="relative">
                  <img
                    src={preview || oldImageUrl || ""}
                    alt="Preview"
                    className="mb-4 h-50 max-w-full object-contain rounded-lg"
                  />
                  <p className="text-sm text-gray-500 text-center">
                    {preview ? "New image selected" : "Current image"}
                  </p>
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
                    PNG, JPG, WebP, SVG files supported. Or click to browse.
                  </span>
                  <span className="text-brand-500 text-theme-sm font-medium underline">
                    Browse File
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ID Display (Read-only) */}
        <div>
          <Label htmlFor="id">Post ID</Label>
          <Input type="text" id="id" value={id || ""} disabled />
        </div>

        {/* Title Input */}
        <div>
          <Label htmlFor="title">
            Title <span className="text-red-500">*</span>
          </Label>
          <Input
            type="text"
            id="title"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            // onBlur={() => setTouched({ ...touched, inputValue: true })}
            className={
              isInvalid.inputValue
                ? "!border-red-500 focus:!border-red-500 focus:!ring-1 focus:!ring-red-500"
                : ""
            }
          />
          {isInvalid.inputValue && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              Title is required
            </p>
          )}
        </div>

        {/* Select Dropdown */}
        <div>
          <Label>
            Select type <span className="text-red-500">*</span>
          </Label>
          <Select
            options={selectOptions}
            placeholder={selectedOption || "Select an option"}
            // value={selectedOption}
            onChange={(value: string) => {
              setSelectedOption(value);
              setTouched({ ...touched, selectedOption: true });
            }}
            className={isInvalid.selectedOption ? "!border-red-500" : ""}
          />
          {isInvalid.selectedOption && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              Please select a type
            </p>
          )}
        </div>

        {/* TextArea */}
        <div>
          <Label>
            Description <span className="text-red-500">*</span>
          </Label>
          <p className="text-sm text-gray-400 mb-2">
            Write subtitle with h2 --title--- h2
          </p>
          <TextArea
            value={message}
            onChange={setMessage}
            // onBlur={() => setTouched({ ...touched, message: true })}
            rows={6}
            hint="Please enter a valid message."
            className={
              isInvalid.message
                ? "!border-red-500 focus:!border-red-500 focus:!ring-1 focus:!ring-red-500"
                : ""
            }
          />
          {isInvalid.message && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              Description is required
            </p>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3">
          <Button disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Post"}
          </Button>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </ComponentCard>
  );
}