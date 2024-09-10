import React, { useState, useEffect } from 'react';
import { useMyContext } from '../../contextapi/MyProvider';
import toast, { Toaster } from 'react-hot-toast';
import { BsArrowDown } from 'react-icons/bs';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  fontGetlists: any;
}
type Timeout = ReturnType<typeof setTimeout>;
const Uploadfilemodal: React.FC<AddCategoryModalProps> = ({
  isOpen,
  onClose,
  fontGetlists,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fileUploadInitiated, setFileUploadInitiated] =
    useState<boolean>(false);
  const [loadingTimeout, setLoadingTimeout] = useState<Timeout | null>(null);
  const { instance } = useMyContext();

  useEffect(() => {
    if (isLoading) {
      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, 3000);
      setLoadingTimeout(timeout);

      return () => clearTimeout(timeout);
    }
    fontGetlists();
  }, [isLoading]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileName = file.name.toLowerCase();
      const fileSize = file.size;

      // Validate file type by extension
      const validExtensions = ['.ttf', '.otf'];
      const fileExtension = fileName.slice(fileName.lastIndexOf('.'));

      if (!validExtensions.includes(fileExtension)) {
        toast.error('Please select a .ttf or .otf file');
        return;
      }

      // Validate file size
      const maxSizeInBytes = 500 * 1024;
      if (fileSize > maxSizeInBytes) {
        toast.error('File size exceeds 202KB');
        return;
      }

      setSelectedFile(file);
      setFileUploadInitiated(true); // Mark file upload as initiated
      setIsLoading(true); // Start loading animation immediately
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    // Stop the loading animation if it's still running
    if (loadingTimeout) {
      clearTimeout(loadingTimeout);
      setIsLoading(false);
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await instance.post('/font/create/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        toast.success('File uploaded successfully');
        setTimeout(() => {
          onClose();
          fontGetlists();
        }, 1000);
      } else {
        toast.error('File upload failed');
      }
    } catch (error) {
      toast.error('Error uploading file');
    } finally {
      setIsLoading(false); // Ensure loading animation stops
      setFileUploadInitiated(false); // Reset file upload status
      setSelectedFile(null); // Clear the selected file
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="fixed inset-0 z-50 overflow-auto  flex  bg-[#414444] bg-opacity-50 dark:bg-[#13151E] dark:bg-opacity-30">
        <div className="relative py-4 px-2 bg-white dark:bg-boxdark w-full max-w-md m-auto flex-col flex rounded-lg">
          <div className="flex justify-between px-2 mb-3">
            <div className="flex items-center">
              <h1 className="text-[16px] text-[#000] dark:text-white font-bold mb-4">
                Upload file
              </h1>
            </div>
            <div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-800"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="border-2 border-[#B8BAC7] border-dashed h-[155px] my-4 px-3 mx-2 rounded-[10px] flex justify-center items-center">
            {isLoading ? (
              <div className="flex flex-col justify-center items-center">
                <span className="animate-bounce flex justify-center items-center p-2 w-12 h-12 shadow-md rounded-full text-blue-500">
                  <BsArrowDown width={15} height={15} />
                </span>
                <span className="mt-2 text-[#000] dark:text-[#fff] text-[10px] font-bold">
                  Uploading...
                </span>
              </div>
            ) : fileUploadInitiated ? (
              <div className="flex flex-col justify-center items-center">
                <span className="text-[#B8BAC7] border-[1px] border-dashed border-[#B8BAC7] rounded-[10px] p-2 dark:text-[#fff] text-[22px] font-bold">
                  File selected
                </span>
              </div>
            ) : (
              <div className="flex flex-col">
                <label className="inline-flex p-2 items-center justify-center rounded-[10px] bg-gradient-to-r from-[#4623E9] to-[#EAABF0] text-center font-medium text-white hover:bg-opacity-90 cursor-pointer">
                  Upload file
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
                <span className="font-bold text-[#000] text-[13px] mt-2 dark:text-[#fff]">
                  Maximum file size: 500kb
                </span>
              </div>
            )}
          </div>

          <div className="pt-5 mx-2">
            {fileUploadInitiated && !isLoading ? (
              <button
                onClick={handleFileUpload}
                disabled={isLoading}
                className="inline-flex px-3 py-2 items-center justify-center rounded-[10px] bg-gradient-to-r from-[#4623E9] to-[#EAABF0] text-center font-medium text-white hover:bg-opacity-90"
              >
                Save File
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default Uploadfilemodal;
