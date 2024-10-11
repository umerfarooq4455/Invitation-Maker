import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useMyContext } from '../../contextapi/MyProvider';
import { TbTrash } from 'react-icons/tb';
import Bgaddmodal from './Bgaddmodal';

const Bglist: React.FC = () => {
  const { instance } = useMyContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [backgoundlist, setbackgoundlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpefilter, setIsDropdownOpefilter] = useState(false);
  const [selectedfileroption, setSelectedfileroption] = useState<string | null>(
    null
  );

  useEffect(() => {
    fetchCategories();
    fetchAllBackgrounds();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await instance.get('/category_list/');
      const categoriesData = response.data.results;
      setCategories(categoriesData);
    } catch (err) {
      setError('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllBackgrounds = async () => {
    setLoading(true);
    try {
      const response = await instance.get('/background/list/');
      const allBackgrounds = response.data.results;
      setbackgoundlist(allBackgrounds);
      if (allBackgrounds.length === 0) {
        setError('No Backgrounds available.');
      } else {
        setError(null);
      }
    } catch (err) {
      setError('Failed to fetch Backgrounds');
    } finally {
      setLoading(false);
    }
  };

  const bglist = async (cat_id?: number) => {
    setLoading(true);
    try {
      const url = cat_id
        ? `/background/list/?cat_id=${cat_id}`
        : '/background/list/';
      const response = await instance.get(url);
      const Backgrounds = response.data.results;
      setbackgoundlist(Backgrounds);
      if (Backgrounds.length === 0) {
        setError('No Background available for the selected category.');
      } else {
        setError(null);
      }
    } catch (err) {
      setError('Failed to fetch Background');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxFilter = (category: any) => {
    setSelectedfileroption(category.en);
    setIsDropdownOpefilter(false);
    bglist(category.cat_id);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const DeleteFont = async (id: number) => {
    try {
      await instance.delete(`/background/delete/${id}`);
      toast.success('Font Deleted Successfully');
      // Fetch the background list again after deletion
      selectedfileroption
        ? bglist(
            categories.find((cat) => cat.en === selectedfileroption)?.cat_id
          )
        : fetchAllBackgrounds();
    } catch (err: any) {
      toast.error('Failed to delete Background');
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Bgaddmodal isOpen={isModalOpen} onClose={closeModal} bglist={bglist} />
      <div className=" py-5 top-[76px] bg-[#F1F5F9] dark:bg-[#1A222C] border-none">
        <button
          className="inline-flex items-center justify-center rounded-[10px] bg-gradient-to-r from-[#E11D48] to-[#ff7896]  py-2 px-6 text-center font-medium text-white hover:bg-opacity-90 "
          type="button"
          onClick={openModal}
        >
          Add New Background
        </button>
      </div>

      <div className="bg-[#fff] mb-4 rounded-[10px] dark:bg-[#24303F] py-4 px-4">
        <div className="max-w-full  overflow-x-auto">
          <div className="flex justify-between items-center flex-col py-3 md:flex-row">
            <div>
              <h4 className="md:text-xl py-2 px-2 font-semibold text-black dark:text-white">
                Background List
              </h4>
            </div>
            <div className="hidden items-center justify-center md:flex relative">
              <div className="relative inline-block text-left">
                <button
                  type="button"
                  className="inline-flex w-75 justify-between border-[#E11D48] rounded-lg border-[2px] border-dashed bg-[#fff] p-2 text-sm font-medium leading-5 transition duration-150 ease-in-out dark:border-[#212430] dark:bg-[#212430] dark:text-[#fff]"
                  onClick={() => setIsDropdownOpefilter(!isDropdownOpefilter)}
                  aria-haspopup="true"
                  aria-expanded={isDropdownOpefilter}
                >
                  <span className="pr-2 font-bold">Filter by category:</span>
                  {selectedfileroption || 'All'}
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
                <div
                  className={`ring-black absolute z-9 right-0 mt-2 w-75 origin-center rounded-md bg-[#fff] shadow-lg dark:border-[#212430] dark:bg-[#212430] dark:text-[#fff] ${
                    isDropdownOpefilter ? 'visible w-100' : 'hidden'
                  }`}
                >
                  <div className="py-1">
                    <label
                      className="flex cursor-pointer items-center bg-[#fff] px-4 py-2 text-sm leading-5 dark:border-[#212430] dark:bg-[#212430] dark:text-[#fff]"
                      onClick={() => {
                        setSelectedfileroption(null);
                        fetchAllBackgrounds();
                      }}
                    >
                      <input
                        type="radio"
                        className="form-checkbox h-5 w-5 rounded text-[#fff]"
                        checked={!selectedfileroption}
                      />
                      <span className="ml-2">All</span>
                    </label>
                    {categories.map((catItem: any) => (
                      <label
                        key={catItem.cat_id}
                        className="flex cursor-pointer items-center bg-[#fff] px-4 py-2 text-sm leading-5 dark:border-[#212430] dark:bg-[#212430] dark:text-[#fff]"
                      >
                        <input
                          type="radio"
                          className="form-checkbox h-5 w-5 rounded text-[#fff]"
                          checked={selectedfileroption === catItem.en}
                          onChange={() => handleCheckboxFilter(catItem)}
                        />
                        <span className="ml-2">{catItem.en}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex mx-2 py-3 items-center bg-white dark:bg-boxdark">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-solid border-[#E11D48] border-t-transparent"></div>
            </div>
          ) : error ? (
            <p className="mx-2 min-h-39 flex items-center text-red-500 dark:text-red-500">
              {error}
            </p>
          ) : (
            <div className="flex flex-wrap min-h-35 gap-10 justify-center md:justify-start p-2 py-4 mb-3">
              {backgoundlist.map((background: any, index: number) => (
                <div
                  key={index}
                  className="relative group sm:mb-3 w-[160px]  md:mb-0"
                >
                  <img
                    className="object-cover  rounded-md transition-opacity duration-200 group-hover:bg-[#EAEAEA] group-hover:opacity-55"
                    src={`https://collage-maker.trippleapps.com${background.background_url}`}
                    alt="Sticker"
                  />
                  <button
                    onClick={() => DeleteFont(background.background_id)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-md opacity-0 backdrop-filter backdrop-blur-sm group-hover:opacity-100"
                  >
                    <TbTrash />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Bglist;
