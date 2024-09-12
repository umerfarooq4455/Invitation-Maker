import React, { useState, useEffect } from 'react';
import { useMyContext } from '../../contextapi/MyProvider';
import toast, { Toaster } from 'react-hot-toast';
import { BsArrowDown } from 'react-icons/bs';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  //   fontGetlists: any;
}
type Timeout = ReturnType<typeof setTimeout>;
const StikeraddModal: React.FC<AddCategoryModalProps> = ({
  isOpen,
  onClose,
  //   fontGetlists,
}) => {
  const { instance } = useMyContext();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fileUploadInitiated, setFileUploadInitiated] =
    useState<boolean>(false);
  const [loadingTimeout, setLoadingTimeout] = useState<Timeout | null>(null);
  const [categories, setCategories] = useState<any | null>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedfileroption, setSelectedfileroption] = useState();
  const [isDropdownOpefilter, setIsDropdownOpefilter] = useState(false);

  const toggleDropdownsort = () => {
    setIsDropdownOpefilter(!isDropdownOpefilter);
  };

  const handleCheckboxFilter = (value: any) => {
    setSelectedfileroption(value);
    setIsDropdownOpefilter(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await instance.get('/category_list/');
      setCategories(response.data.results);
      setSelectedfileroption(response.data.results[0].en);
    } catch (err) {
      setError('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoading) {
      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, 3000);
      setLoadingTimeout(timeout);

      return () => clearTimeout(timeout);
    }
    // fontGetlists();
  }, [isLoading]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileName = file.name.toLowerCase();
      const fileSize = file.size;

      // Validate file type by extension
      const validExtensions = ['.webp', '.png', '.jpeg'];
      const fileExtension = fileName.slice(fileName.lastIndexOf('.'));

      if (!validExtensions.includes(fileExtension)) {
        toast.error('Please select a .png or .webp , jpeg file');
        return;
      }

      // Validate file size
      const maxSizeInBytes = 1500 * 1024;
      if (fileSize > maxSizeInBytes) {
        toast.error('File size exceeds 1500KB');
        return;
      }

      setSelectedFile(file);
      setFileUploadInitiated(true);
      setIsLoading(true);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }
    if (loadingTimeout) {
      clearTimeout(loadingTimeout);
      setIsLoading(false);
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await instance.post('/font/crssseate/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        toast.success('File uploaded successfully');
        setTimeout(() => {
          onClose();
          //   fontGetlists();
        }, 1000);
      } else {
        toast.error('File upload failed');
      }
    } catch (error) {
      toast.error('Error uploading file');
    } finally {
      setIsLoading(false);
      setFileUploadInitiated(false);
      setSelectedFile(null);
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="fixed inset-0 z-50 overflow-auto  flex  bg-[#414444] bg-opacity-50 dark:bg-[#13151E] dark:bg-opacity-30">
        <div className="relative py-4 px-2 bg-white dark:bg-boxdark w-full max-w-md m-auto flex-col flex rounded-lg">
          <div className="flex justify-between px-2">
            <div className="flex items-center">
              <h1 className="text-[16px] text-[#000] dark:text-white font-bold mb-4">
                Add New Sticker
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
          <div className="items-center justify-start  flex mx-4 py-3">
            <label className="flex text-black font-semibold">
              Select Category
            </label>
          </div>
          <div className="hidden items-center w-full justify-center md:flex ">
            <div className="relative inline-block text-left">
              <div>
                <button
                  type="button"
                  className="inline-flex w-100 justify-between py-2  rounded-lg border-[1px]  bg-[#fff] p-2 text-sm font-medium leading-5 transition duration-150 ease-in-out dark:border-[#212430] dark:bg-[#212430] dark:text-[#fff]"
                  onClick={toggleDropdownsort}
                  aria-haspopup="true"
                  aria-expanded={isDropdownOpefilter}
                >
                  {selectedfileroption}
                  <svg
                    className={`h-5 w-5 px-0 transition-transform duration-200 ${
                      isDropdownOpefilter ? '-rotate-90' : '-rotate-180'
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="512"
                    height="512"
                  >
                    <path d="M10.957,12.354a.5.5,0,0,1,0-.708l4.586-4.585a1.5,1.5,0,0,0-2.121-2.122L8.836,9.525a3.505,3.505,0,0,0,0,4.95l4.586,4.586a1.5,1.5,0,0,0,2.121-2.122Z" />
                  </svg>
                </button>
              </div>

              <div
                className={`ring-black absolute right-0 mt-2 w-100 origin-center rounded-md bg-[#fff] shadow-lg dark:border-[#212430] dark:bg-[#212430] dark:text-[#fff] ${
                  isDropdownOpefilter ? 'visible w-100' : 'hidden'
                }`}
              >
                <div className="py-1">
                  {categories.map((catItem: any) => (
                    <label
                      key={catItem.cat_id}
                      className="flex cursor-pointer  items-center bg-[#fff] px-4 py-2 text-sm leading-5 dark:border-[#212430] dark:bg-[#212430] dark:text-[#fff]"
                    >
                      <input
                        type="radio"
                        className="form-checkbox h-5 w-5 rounded text-[#fff]"
                        checked={selectedfileroption === catItem.en}
                        onChange={() => handleCheckboxFilter(catItem.en)}
                      />
                      <span className="ml-2"> {catItem.en}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="items-center justify-start  flex mx-4 py-3">
            <label className="flex text-black font-semibold">
              Upload Sticker
            </label>
          </div>
          <div className="border-2 border-[#B8BAC7] border-dashed h-[155px]  px-3 mx-4 rounded-[10px] flex justify-center items-center">
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
                <label className="inline-flex p-2 items-center justify-center rounded-[10px] bg-gradient-to-r from-[#E11D48] to-[#ff7896] text-center font-medium text-white hover:bg-opacity-90 cursor-pointer">
                  Upload Sticker
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
                <span className="font-bold text-[#000] text-[13px] mt-2 dark:text-[#fff]">
                  Maximum file size: 1500kb
                </span>
              </div>
            )}
          </div>

          <div className="pt-5 mx-4">
            {fileUploadInitiated && !isLoading ? (
              <button
                onClick={handleFileUpload}
                disabled={isLoading}
                className="inline-flex px-3 py-2 items-center justify-center rounded-[10px] bg-gradient-to-r from-[#E11D48] to-[#ff7896] text-center font-medium text-white hover:bg-opacity-90"
              >
                Save Sticker
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default StikeraddModal;
