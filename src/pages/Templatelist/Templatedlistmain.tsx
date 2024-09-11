import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useMyContext } from '../../contextapi/MyProvider';
import { TbTrash } from 'react-icons/tb';
import EditcategoryModal from '../Dashboard/EditcategoryModal';
import { NavLink } from 'react-router-dom';

const Templatedlistmain: React.FC = () => {
  const { instance } = useMyContext();
  const [isModalEdit, setIsModalEdit] = useState(false);
  const [categories, setCategories] = useState<any | null>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const closeModalEdit = () => {
    setIsModalEdit(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await instance.get('/template/list');
      setCategories(response.data.results);
    } catch (err) {
      setError('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const DeleteCategory = async (id: number) => {
    try {
      const response = await instance.delete(`/template/delete/${id}`);
      console.log(response, 'dasdfas');
      toast.success('Category Deleted Successfully');
      fetchCategories();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      <div className=" py-5  sticky top-[85px] bg-[#F1F5F9] dark:bg-[#1A222C] border-none">
        <NavLink
          className="inline-flex items-center justify-center rounded-[10px] bg-gradient-to-r from-[#E11D48] to-[#ff7896]  py-2 px-6 text-center font-medium text-white hover:bg-opacity-90 "
          to="/templates"
        >
          Add Template
        </NavLink>
      </div>

      <div className="rounded-[10px] bg-white px-2 pt-2 pb-2.5  shadow-md dark:border-strokedark dark:bg-boxdark  xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <div className="flex justify-between items-center flex-col md:flex-row">
            <div>
              <h4 className=" md:text-xl px-2 py-4   font-semibold text-black dark:text-white">
                Templates List
              </h4>
            </div>

            <div className="flex">
              <div className="mr-2">
                <form className="max-w-md mx-auto flex">
                  <input
                    type="text"
                    id="simple-search"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#E11D48] focus:border-[#ff7896] block w-full p-2.5  dark:bg-[#ff7896] dark:border-[#E11D48] dark:placeholder-gray-400 dark:text-white"
                    placeholder="Search name..."
                    required
                  />

                  <button
                    type="submit"
                    className="p-2.5 ms-2 text-sm font-medium text-white bg-[#E11D48] rounded-lg border border-[#ff7896] hover:bg-[#ff7896]  "
                  >
                    <svg
                      className="w-4 h-4"
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
                  </button>
                </form>
              </div>
            </div>
          </div>
          {loading ? (
            <div className="flex mx-2 py-3 items-center  bg-white dark:bg-boxdark ">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-solid border-[#E11D48] border-t-transparent"></div>
            </div>
          ) : error ? (
            <p className="mx-2 py-3 text-red-500 dark:text-red-500">{error}</p>
          ) : (
            <table className="w-full table-auto">
              <thead className="border-b-[1px] border-[#B5B7C0] ">
                <tr className=" text-left  rounded-lg">
                  <th className="min-w-[71px] md:min-w-[10px] md:w-[10%]  py-4 px-4 font-bold text-[#B5B7C0] dark:text-[#B5B7C0]  rounded-l-lg">
                    Template ID
                  </th>
                  <th className="min-w-[126px] md:min-w-[10px] md:w-[14%] py-4 px-4 font-bold text-[#B5B7C0] dark:text-[#B5B7C0]">
                    Template Thumbnail
                  </th>
                  {/* <th className="min-w-[50px] py-4 px-4 font-bold text-[#B5B7C0] dark:text-[#B5B7C0]">
                  Order No
                </th> */}
                  <th className="md:w-[14%] py-4 px-4 font-bold text-[#B5B7C0] dark:text-[#B5B7C0]">
                    Template BaseURL
                  </th>
                  <th className="py-4 px-4 font-bold text-[#B5B7C0] dark:text-[#B5B7C0]">
                    Status
                  </th>
                  <th className="py-4 px-4 text-end font-bold text-[#B5B7C0] dark:text-[#B5B7C0] rounded-r-lg">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {categories.map((catItem: any) => (
                  <tr>
                    <td className=" font-semibold  py-5 px-4 dark:border-strokedark">
                      <p className="font-semibold text-[#000000] text-[16px] dark:text-white">
                        {catItem.templateID}
                      </p>
                    </td>
                    <td className="  py-5 px-4  dark:border-strokedark ">
                      <img
                        className="rounded-full font-semibold h-[50px] w-[50px] text-[#000000] text-[16px]  dark:text-white"
                        src={`https://collage-maker.trippleapps.com${catItem.templateThumbnailURL}`}
                      />
                    </td>
                    {/* <td className="  py-5 px-4 dark:border-strokedark">
                    <p className="text-[#000000] font-semibold flex items-center text-[16px] dark:text-white">
                      {catItem.category_order}
                    </p>
                  </td> */}
                    <td className="text-end py-5 px-4 dark:border-strokedark">
                      <p
                        className={`font-semibold flex items-center text-start  text-[16px] `}
                      >
                        {catItem.templateBaseURL}
                      </p>
                    </td>
                    <td className="text-end py-5 px-4 dark:border-strokedark">
                      <p
                        className={`font-semibold flex items-center text-center text-[16px]
                      `}
                      >
                        {catItem.status}
                      </p>
                    </td>
                    <td className="  py-5 px-4 flex justify-end items-center dark:border-strokedark ">
                      <div className="flex items-center ">
                        <EditcategoryModal
                          isOpen={isModalEdit}
                          onClose={closeModalEdit}
                        />
                        {/* edit  list item button using there id */}
                        <button
                          className="hover:text-[#E11D48] "
                          onClick={() => DeleteCategory(catItem.templateID)}
                        >
                          <TbTrash className="text-[25px] text-[#000] dark:text-[#fff]" />
                        </button>
                        {/* edit  list item button using there id */}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default Templatedlistmain;
