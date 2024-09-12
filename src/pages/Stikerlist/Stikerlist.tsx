import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useMyContext } from '../../contextapi/MyProvider';
import { NavLink } from 'react-router-dom';
import { TbTrash } from 'react-icons/tb';
import StikeraddModal from './StikeraddModal';

interface Image {
  id: number;
  src: string;
  alt: string;
}

const Stikerlist: React.FC = () => {
  const { instance } = useMyContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState<any | null>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedfileroption, setSelectedfileroption] = useState();
  const [isDropdownOpefilter, setIsDropdownOpefilter] = useState(false);

  const toggleDropdownsort = () => {
    setIsDropdownOpefilter(!isDropdownOpefilter);
  };

  const handleCheckboxFilter = (value: any) => {
    setSelectedfileroption(value);
    setIsDropdownOpefilter(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const [images, setImages] = useState<Image[]>([
    {
      id: 1,
      src: 'https://cdn-icons-png.flaticon.com/256/7824/7824096.png',
      alt: 'Sticker 1',
    },
    {
      id: 2,
      src: 'https://cdn-icons-png.flaticon.com/256/5442/5442567.png',
      alt: 'Sticker 2',
    },
    {
      id: 3,
      src: 'https://cdn-icons-png.flaticon.com/256/10296/10296203.png',
      alt: 'Sticker 2',
    },
    {
      id: 4,
      src: 'https://cdn-icons-png.flaticon.com/256/8096/8096058.png',
      alt: 'Sticker 2',
    },
    {
      id: 5,
      src: 'https://cdn-icons-png.flaticon.com/256/5483/5483644.png',
      alt: 'Sticker 2',
    },
    {
      id: 6,
      src: 'https://cdn-icons-png.flaticon.com/256/5784/5784122.png',
      alt: 'Sticker 2',
    },
    {
      id: 7,
      src: 'https://cdn-icons-png.flaticon.com/256/7836/7836913.png',
      alt: 'Sticker 2',
    },
    {
      id: 8,
      src: 'https://cdn-icons-png.flaticon.com/256/7824/7824096.png',
      alt: 'Sticker 2',
    },
    {
      id: 9,
      src: 'https://cdn-icons-png.flaticon.com/256/7824/7824096.png',
      alt: 'Sticker 2',
    },
    {
      id: 10,
      src: 'https://cdn-icons-png.flaticon.com/256/7824/7824096.png',
      alt: 'Sticker 2',
    },
    {
      id: 11,
      src: 'https://cdn-icons-png.flaticon.com/256/7824/7824096.png',
      alt: 'Sticker 2',
    },
    {
      id: 12,
      src: 'https://cdn-icons-png.flaticon.com/256/7824/7824096.png',
      alt: 'Sticker 2',
    },
    {
      id: 13,
      src: 'https://cdn-icons-png.flaticon.com/256/7824/7824096.png',
      alt: 'Sticker 2',
    },
    {
      id: 14,
      src: 'https://cdn-icons-png.flaticon.com/256/7824/7824096.png',
      alt: 'Sticker 2',
    },
    {
      id: 15,
      src: 'https://cdn-icons-png.flaticon.com/256/7824/7824096.png',
      alt: 'Sticker 2',
    },
    {
      id: 16,
      src: 'https://cdn-icons-png.flaticon.com/256/7824/7824096.png',
      alt: 'Sticker 2',
    },
    {
      id: 17,
      src: 'https://cdn-icons-png.flaticon.com/256/7824/7824096.png',
      alt: 'Sticker 2',
    },
    {
      id: 18,
      src: 'https://cdn-icons-png.flaticon.com/256/5784/5784119.png',
      alt: 'Sticker 2',
    },
    {
      id: 19,
      src: 'https://cdn-icons-png.flaticon.com/256/7824/7824096.png',
      alt: 'Sticker 2',
    },
    {
      id: 20,
      src: 'https://cdn-icons-png.flaticon.com/256/5389/5389958.png',
      alt: 'Sticker 2',
    },
    {
      id: 21,
      src: 'https://cdn-icons-png.flaticon.com/256/5784/5784119.png',
      alt: 'Sticker 2',
    },
    {
      id: 22,
      src: 'https://cdn-icons-png.flaticon.com/256/5784/5784122.png',
      alt: 'Sticker 2',
    },

    // Add more images as needed
  ]);

  const handleDelete = (id: number) => {
    const updatedImages = images.filter((image) => image.id !== id);
    setImages(updatedImages);
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

  //   const DeleteFont = async (id: number) => {
  //     try {
  //       const response = await instance.delete(`/font/delete/${id}`);
  //       console.log(response);
  //       toast.success('Font Deleted Successfully');
  //       fontGetlist();
  //     } catch (err: any) {
  //       toast.error(err.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <StikeraddModal
        isOpen={isModalOpen}
        onClose={closeModal}
        // fontGetlists={fontGetlist}
      />
      <div className="sticky py-5 top-[76px] bg-[#F1F5F9] dark:bg-[#1A222C] border-none z-30">
        <button
          className="inline-flex items-center justify-center rounded-[10px] bg-gradient-to-r from-[#E11D48] to-[#ff7896]  py-2 px-6 text-center font-medium text-white hover:bg-opacity-90 "
          type="button"
          onClick={openModal}
        >
          Add New Sticker
        </button>
      </div>

      <div className="rounded-[10px] bg-white px-2 pt-2 pb-2.5   shadow-md dark:border-strokedark dark:bg-boxdark  xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <div className="flex justify-between items-center flex-col py-3 md:flex-row">
            <div>
              <h4 className="md:text-xl py-2 px-2 font-semibold text-black dark:text-white">
                Stickers List
              </h4>
            </div>
            <div className="hidden items-center justify-center md:flex relative">
              <div className="relative inline-block text-left">
                <div>
                  <button
                    type="button"
                    className="inline-flex w-75 justify-between border-[#E11D48] rounded-lg border-[2px] border-dashed bg-[#fff] p-2 text-sm font-medium leading-5 transition duration-150 ease-in-out dark:border-[#212430] dark:bg-[#212430] dark:text-[#fff]"
                    onClick={toggleDropdownsort}
                    aria-haspopup="true"
                    aria-expanded={isDropdownOpefilter}
                  >
                    <span className="pr-2 font-bold">
                      Filter by category :{' '}
                    </span>{' '}
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
                  className={`ring-black w-75 absolute right-0 mt-2  z-20 origin-center rounded-md bg-[#fff] shadow-lg dark:border-[#212430] dark:bg-[#212430] dark:text-[#fff] ${
                    isDropdownOpefilter ? 'visible' : 'hidden'
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
                          className="form-checkbox  h-5 w-5 rounded text-[#fff]"
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
          </div>

          {/* {loading ? (
            <div className="flex mx-2 py-3 items-center  bg-white dark:bg-boxdark ">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-solid border-[#E11D48] border-t-transparent"></div>
            </div>
          ) : error ? (
            <p className="mx-2 py-3 text-red-500 dark:text-red-500">{error}</p>
          ) : ( */}
          <div className="flex flex-wrap xl:gap-13 gap-10 justify-center md:justify-start p-2 py-4 mb-3">
            {images.map((image) => (
              <div
                key={image.id}
                className="relative group  sm:mb-3 w-[135px]  h-[100px]  sm:w-[110px]  sm:h-[150px] md:w-[110px] md:h-[100px]  lg:w-[130px] lg:h-[100px]  xl:w-[122px] md:mb-0 "
              >
                <img
                  className=" object-cover p-2 rounded-md transition-opacity duration-200 group-hover:bg-[#EAEAEA] group-hover:opacity-55"
                  src={image.src}
                  alt={image.alt}
                />
                {/* Delete Icon */}
                <button
                  onClick={() => handleDelete(image.id)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-md opacity-0 backdrop-opacity-95 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <TbTrash className="text-[25px] text-[#000] dark:text-[#fff]" />
                </button>
              </div>
            ))}
          </div>

          {/* )} */}
        </div>
      </div>
    </>
  );
};

export default Stikerlist;
