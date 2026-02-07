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
  const [inputValue, setInputValue] = useState("");
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Validation states
  const [touched, setTouched] = useState({
    inputValue: false,
    selectedOption: false,
    message: false,
    file: false,
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

  useEffect(() => {
    localStorage.setItem("blog_inputValue", inputValue);
    localStorage.setItem("blog_selectedOption", selectedOption);
    localStorage.setItem("blog_message", message);
  }, [inputValue, selectedOption, message]);

  const handleDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles[0]) {
      setSelectedFile(acceptedFiles[0]);
      setPreview(URL.createObjectURL(acceptedFiles[0]));
      setTouched({ ...touched, file: true });
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: fileTypes,
    multiple: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Mark all fields as touched
    setTouched({
      inputValue: true,
      selectedOption: true,
      message: true,
      file: true,
    });

    if (!inputValue || !selectedOption || !message || !selectedFile || !user?.id) {
      alert("Please fill all required fields and upload an image.");
      return;
    }

    setIsLoading(true);


    try {
      if (!user) {
        setError("You must be logged in");
        setIsLoading(false);
        return;
      }

      let imageUrl: string | null = null;

      if (selectedFile) {
        imageUrl = await uploadImageToStorage(selectedFile);
      }

      const { error, data } = await supabase
        .from("blogs")
        .insert([
          {
            title: inputValue,
            types: selectedOption,
            content: message,
            view: 0,
            author_id: user.id,
            image_url: imageUrl,
            like: 0
          },
        ]);

      if (error) {
        alert("Failed to submit blog. Please try again.");
        setIsLoading(false);
        console.error("Error submitting blog:", error);
        return;
      }

      alert("Blog submitted successfully! 🎉");
      console.log("Blog submitted successfully!");

      setSuccess("Blog submitted successfully!");
      setShowToast(true);

      // Reset form
      setInputValue("");
      setSelectedOption("");
      setMessage("");
      setPreview(null);
      setSelectedFile(null);
      setTouched({
        inputValue: false,
        selectedOption: false,
        message: false,
        file: false,
      });


      setIsLoading(false);


    } catch (err) {
      alert("Failed to submit blog. Please try again.");
      setIsLoading(false);
      console.error("Error submitting blog:", err);
      setError("Failed to submit blog.");
    }
  };

  // Validation helpers
  const isInvalid = {
    inputValue: touched.inputValue && !inputValue,
    selectedOption: touched.selectedOption && !selectedOption,
    message: touched.message && !message,
    file: touched.file && !selectedFile,
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
            <Label>Upload Image <span className="text-red-500">*</span></Label>
            <div
              {...getRootProps()}
              className={`cursor-pointer rounded-xl border-2 border-dashed p-7 lg:p-10 transition ${isDragActive
                ? "border-brand-500 bg-gray-100 dark:bg-gray-800"
                : isInvalid.file
                  ? "border-red-500 bg-red-50 dark:bg-red-900/10"
                  : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
                }`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="mb-4 h-50 object-contain"
                  />
                ) : (
                  <>
                    <div className="mb-5 flex justify-center">
                      <div className={`flex h-[68px] w-[68px] items-center justify-center rounded-full ${isInvalid.file
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
                      PNG, JPG, WebP, SVG files supported. Or click to browse.
                    </span>
                    <span className="text-brand-500 text-theme-sm font-medium underline">
                      Browse File
                    </span>
                  </>
                )}
              </div>
            </div>
            {isInvalid.file && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">Please upload an image</p>
            )}
          </div>

          {/* Text Input */}
          <div>
            <Label htmlFor="input">Title <span className="text-red-500">*</span></Label>
            <Input
              type="text"
              id="input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              // onBlur={() => setTouched({ ...touched, inputValue: true })}
              className={isInvalid.inputValue ? "!border-red-500 focus:!border-red-500 focus:!ring-1 focus:!ring-red-500" : ""}
            />
            {isInvalid.inputValue && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">Title is required</p>
            )}
          </div>

          {/* Select Dropdown */}
          <div>
            <Label>Select type <span className="text-red-500">*</span></Label>
            <Select
              options={selectOptions}
              placeholder="Select an option"
              onChange={(value: string) => {
                setSelectedOption(value);
                setTouched({ ...touched, selectedOption: true });
              }}
              className={isInvalid.selectedOption ? "border-red-500" : ""}
            />
            {isInvalid.selectedOption && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">Please select a type</p>
            )}
          </div>

          {/* TextArea */}
          <div>
            <Label>Description <span className="text-red-500">*</span></Label>
            <p className="text-sm text-gray-400 mb-2">Write subtitle with h2 --title--- h2</p>
            <TextArea
              value={message}
              onChange={setMessage}
              // onBlur={() => setTouched({ ...touched, message: true })}
              rows={6}
              hint="Please enter a valid message."
              className={isInvalid.message ? "!border-red-500 focus:!border-red-500 focus:!ring-1 focus:!ring-red-500" : ""}
            />
            {isInvalid.message && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">Description is required</p>
            )}
          </div>

          {/* Submit Button */}
          <Button disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </ComponentCard>


    </>
  );
}