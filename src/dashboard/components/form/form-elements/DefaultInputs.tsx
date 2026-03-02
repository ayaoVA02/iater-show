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
import { useNavigate } from "react-router-dom";

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

export default function DefaultInputs() {
  const [titleLa, setTitleLa] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [titleKo, setTitleKo] = useState("");
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [contentLa, setContentLa] = useState("");
  const [contentEn, setContentEn] = useState("");
  const [contentKo, setContentKo] = useState("");
  const [previews, setPreviews] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Validation states
  const [touched, setTouched] = useState({
    titleLa: false,
    selectedOption: false,
    contentLa: false,
    files: false,
  });

  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/signin");
    }
  }, [loading, user, navigate]);

  // Show toast notification
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const generateRandomName = (length = 24) => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const uploadImageToStorage = async (file: File) => {
    if (!file || !user) throw new Error("File or user not found");

    const randomName = generateRandomName();
    const fileExt = file.name.split('.').pop();
    const filePath = `blogs/${randomName}.${fileExt}`;

    const { error } = await supabase.storage
      .from('iater2025-storage')
      .upload(filePath, file, { upsert: false });

    if (error) throw error;

    const { data } = supabase.storage
      .from('iater2025-storage')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const serializeImageUrls = (urls: string[]) => {
    if (urls.length === 0) return null;
    return urls.length === 1 ? urls[0] : JSON.stringify(urls);
  };

  const clearSelectedFiles = () => {
    previews.forEach((url) => URL.revokeObjectURL(url));
    setPreviews([]);
    setSelectedFiles([]);
  };

  useEffect(() => {
    localStorage.setItem("blog_title", titleLa);
    localStorage.setItem("blog_title_en", titleEn);
    localStorage.setItem("blog_title_ko", titleKo);
    localStorage.setItem("blog_selectedOption", selectedOption);
    localStorage.setItem("blog_content", contentLa);
    localStorage.setItem("blog_content_en", contentEn);
    localStorage.setItem("blog_content_ko", contentKo);
  }, [titleLa, titleEn, titleKo, selectedOption, contentLa, contentEn, contentKo]);

  const handleDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const newPreviews = acceptedFiles.map((file) => URL.createObjectURL(file));
      setSelectedFiles((prev) => [...prev, ...acceptedFiles]);
      setPreviews((prev) => [...prev, ...newPreviews]);
      setTouched((prev) => ({ ...prev, files: true }));
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: fileTypes,
    multiple: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Mark all fields as touched
    setTouched({
      titleLa: true,
      selectedOption: true,
      contentLa: true,
      files: true,
    });

    if (!titleLa || !selectedOption || !contentLa || selectedFiles.length === 0 || !user?.id) {
      alert("Please fill all required fields and upload at least one image.");
      return;
    }

    setIsLoading(true);


    try {
      if (!user) {
        setError("You must be logged in");
        setIsLoading(false);
        return;
      }

      const uploadedImageUrls = await Promise.all(selectedFiles.map(uploadImageToStorage));
      const imageUrl = serializeImageUrls(uploadedImageUrls);

      const { error } = await supabase
        .from("blogs")
        .insert([
          {
            title: titleLa,
            title_en: titleEn || null,
            title_ko: titleKo || null,
            types: selectedOption,
            content: contentLa,
            content_en: contentEn || null,
            content_ko: contentKo || null,
            view: 0,
            author_id: user.id,
            image_url: imageUrl,
            like: 0
          },
        ]);

      if (error) {
        alert("Failed to submit blog. Please try again.");
        console.error("Error submitting blog:", error);
        return;
      }

      alert("Blog submitted successfully! 🎉");
      console.log("Blog submitted successfully!");

      setSuccess("Blog submitted successfully!");
      setShowToast(true);

      // Reset form
      setTitleLa("");
      setTitleEn("");
      setTitleKo("");
      setSelectedOption("");
      setContentLa("");
      setContentEn("");
      setContentKo("");
      clearSelectedFiles();
      setTouched({
        titleLa: false,
        selectedOption: false,
        contentLa: false,
        files: false,
      });


    } catch (err) {
      alert("Failed to submit blog. Please try again.");
      console.error("Error submitting blog:", err);
      setError("Failed to submit blog.");
    } finally {
      setIsLoading(false);
    }
  };

  // Validation helpers
  const isInvalid = {
    titleLa: touched.titleLa && !titleLa,
    selectedOption: touched.selectedOption && !selectedOption,
    contentLa: touched.contentLa && !contentLa,
    files: touched.files && selectedFiles.length === 0,
  };

  return (
    <>

      <ComponentCard title="New post">
        <form onSubmit={handleSubmit} className="space-y-12">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* File Drop Area */}
          <div>
            <Label>Upload Image(s) <span className="text-red-500">*</span></Label>
            <div
              {...getRootProps()}
              className={`cursor-pointer rounded-xl border-2 border-dashed p-7 lg:p-10 transition ${isDragActive
                ? "border-brand-500 bg-gray-100 dark:bg-gray-800"
                : isInvalid.files
                  ? "border-red-500 bg-red-50 dark:bg-red-900/10"
                  : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
                }`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center">
                {previews.length > 0 ? (
                  <div className="w-full">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                      {previews.map((preview, index) => (
                        <img
                          key={`${preview}-${index}`}
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="h-28 w-full object-cover rounded-lg"
                        />
                      ))}
                    </div>
                    <p className="text-sm text-center text-gray-600 dark:text-gray-300 mb-3">
                      {selectedFiles.length} image(s) selected
                    </p>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        clearSelectedFiles();
                      }}
                      className="mx-auto block rounded-lg border border-gray-300 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      Clear selection
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mb-5 flex justify-center">
                      <div className={`flex h-[68px] w-[68px] items-center justify-center rounded-full ${isInvalid.files
                        ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                        : "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                        }`}>
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
            {isInvalid.files && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">Please upload at least one image</p>
            )}
          </div>

          {/* Lao Title */}
          <div>
            <Label htmlFor="title-la">Title (Lao) <span className="text-red-500">*</span></Label>
            <Input
              type="text"
              id="title-la"
              value={titleLa}
              onChange={(e) => setTitleLa(e.target.value)}
              className={isInvalid.titleLa ? "!border-red-500 focus:!border-red-500 focus:!ring-1 focus:!ring-red-500" : ""}
            />
            {isInvalid.titleLa && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">Lao title is required</p>
            )}
          </div>

          {/* English Title */}
          <div>
            <Label htmlFor="title-en">Title (English)</Label>
            <Input
              type="text"
              id="title-en"
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
            />
          </div>

          {/* Korean Title */}
          <div>
            <Label htmlFor="title-ko">Title (Korean)</Label>
            <Input
              type="text"
              id="title-ko"
              value={titleKo}
              onChange={(e) => setTitleKo(e.target.value)}
            />
          </div>

          {/* Select Dropdown */}
          <div>
            <Label>Select type <span className="text-red-500">*</span></Label>
            <Select
              options={selectOptions}
              placeholder="Select an option"
              onChange={(value: string) => {
                setSelectedOption(value);
                setTouched((prev) => ({ ...prev, selectedOption: true }));
              }}
              className={isInvalid.selectedOption ? "border-red-500" : ""}
            />
            {isInvalid.selectedOption && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">Please select a type</p>
            )}
          </div>

          {/* Lao Content */}
          <div>
            <Label>Description (Lao) <span className="text-red-500">*</span></Label>
            <p className="text-sm text-gray-400 mb-2">Write subtitle with h2 --title--- h2</p>
            <TextArea
              value={contentLa}
              onChange={setContentLa}
              rows={6}
              hint="Please enter a valid message."
              className={isInvalid.contentLa ? "!border-red-500 focus:!border-red-500 focus:!ring-1 focus:!ring-red-500" : ""}
            />
            {isInvalid.contentLa && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">Lao description is required</p>
            )}
          </div>

          {/* English Content */}
          <div>
            <Label>Description (English)</Label>
            <TextArea
              value={contentEn}
              onChange={setContentEn}
              rows={6}
              hint="Optional: English translation."
            />
          </div>

          {/* Korean Content */}
          <div>
            <Label>Description (Korean)</Label>
            <TextArea
              value={contentKo}
              onChange={setContentKo}
              rows={6}
              hint="Optional: Korean translation."
            />
          </div>

          {success && (
            <p className="text-sm text-green-600 dark:text-green-400">
              {success}
            </p>
          )}

          {showToast && (
            <p className="text-sm text-brand-500">Post saved successfully.</p>
          )}

          {/* Submit Button */}
          <Button disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </ComponentCard>


    </>
  );
}
