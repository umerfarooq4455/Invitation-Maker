import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import Uploadfilemodal from './Uploadfilemodal';
import { TbTrash } from 'react-icons/tb';
import { useMyContext } from '../../contextapi/MyProvider';
import toast, { Toaster } from 'react-hot-toast';

interface Font {
  fontId: number;
  fontName: string;
  fontUrl: string;
}

const Addfont: React.FC = () => {
  const { instance } = useMyContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fontlist, setFontlist] = useState<Font[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    fontGetlist();
  }, []);

  const fontGetlist = async () => {
    try {
      const response = await instance.get<{ results: Font[] }>('/font/list');
      const fonts = response.data.results;
      setFontlist(fonts);
    } catch (err) {
      setError('Failed to fetch Fonts');
    } finally {
      setLoading(false);
    }
  };

  const DeleteFont = async (id: number) => {
    try {
      const response = await instance.delete(`/font/delete/${id}`);
      console.log(response);
      toast.success('Font Deleted Successfully');
      fontGetlist();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Uploadfilemodal
        isOpen={isModalOpen}
        onClose={closeModal}
        fontGetlists={fontGetlist}
      />
      <div className="py-5 flex justify-between items-center  sticky top-[85px] bg-[#F1F5F9] dark:bg-[#1A222C] -z-20 lg:z-9 border-none">
        <div className="flex justify-center items-center">
          <button
            type="button"
            onClick={openModal}
            className="inline-flex p-2 mr-4 items-center justify-center rounded-full bg-gradient-to-r from-[#E11D48] to-[#ff7896]  text-center font-medium text-white hover:bg-opacity-90 "
          >
            <FaPlus />
          </button>
          <span className="md:text-[20px]  py-4 font-semibold text-black dark:text-white">
            Add Font
          </span>
        </div>
      </div>

      <div>
        <div className="pb-4 flex justify-between items-center">
          <span className="md:text-[25px]  font-semibold text-black dark:text-white">
            Fonts List
          </span>
          <div className="mr-2">
            <form className="max-w-md mx-auto">
              <label
                htmlFor="default-search"
                className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
              >
                Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </div>
                <input
                  type="search"
                  id="default-search"
                  className="block w-full p-3 ps-10 text-sm text-gray-900 h-[40px] md:w-[216px] dark:bg-meta-4  rounded-[10px] bg-[#fff]  dark:text-white "
                  placeholder="Search"
                  required
                />
              </div>
            </form>
          </div>
        </div>
        {loading ? (
          <div className="flex mx-2 py-3 items-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-solid border-[#E11D48] border-t-transparent"></div>
          </div>
        ) : error ? (
          <p className="mx-2 py-3 text-red-500 dark:text-red-500">{error}</p>
        ) : (
          <>
            {fontlist.map((itmes: Font) => (
              <div
                key={itmes.fontId}
                className="min-h-[158px] bg-[#fff] mb-4 rounded-[10px] dark:bg-[#24303F] py-4 px-4"
              >
                <div className="flex mb-4 mt-4 font-medium justify-between text-[#000] dark:text-white">
                  <span className="font-bold text-[#000] dark:text-white">
                    {itmes.fontName}
                  </span>
                  <button
                    className="hover:text-[#E11D48]"
                    onClick={() => DeleteFont(itmes.fontId)}
                  >
                    <TbTrash className="text-[25px] text-[#000] dark:text-[#fff]" />
                  </button>
                </div>
                <div className="flex py-3">
                  <span
                    style={{ fontFamily: itmes.fontName }}
                    className="text-[40px] text-[#000] dark:text-white text-start leading-[initial] opacity-100 transition-opacity duration-[350ms] block sm:hidden"
                  >
                    Everyone has the right...
                  </span>
                  <div className="hidden sm:block lg:hidden w-full">
                    <details className="group">
                      <summary
                        style={{ fontFamily: itmes.fontName }}
                        className="cursor-pointer text-[40px] text-[#000] dark:text-white text-start leading-[initial] opacity-100 transition-opacity duration-[350ms]"
                      >
                        Everyone has the right to freedom of thought...
                      </summary>
                      <p
                        style={{ fontFamily: itmes.fontName }}
                        className="text-[40px] text-[#000] dark:text-white text-start leading-[initial] opacity-100 transition-opacity duration-[350ms]"
                      >
                        Everyone has the right to freedom of thought...
                      </p>
                    </details>
                  </div>
                  <span
                    style={{ fontFamily: itmes.fontName }}
                    className="hidden lg:block text-[40px] text-[#000] dark:text-white text-start leading-[initial] opacity-100 transition-opacity duration-[350ms]"
                  >
                    Everyone has the right to freedom of thought, conscience and
                    religion; this right includes
                  </span>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
};

export default Addfont;
