import React, { useState, useEffect } from 'react';
import AddCategoryModal from './AddCategoryModal';
import EditcategoryModal from './EditcategoryModal';
import { useMyContext } from '../../contextapi/MyProvider';
import toast, { Toaster } from 'react-hot-toast';
import { TbTrash } from 'react-icons/tb';
import { FaRegEdit } from 'react-icons/fa';

const CategoriesAdd: React.FC = () => {
  const { instance, setDetailedCategory, setCategoryid, isDarkMode } =
    useMyContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEdit, setIsModalEdit] = useState(false);
  const [categories, setCategories] = useState<any | null>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openModalEdit = () => {
    setIsModalEdit(true);
  };

  const closeModalEdit = () => {
    setIsModalEdit(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await instance.get('/category_list/');
      setCategories(response.data.results);
    } catch (err) {
      setError('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const CategoryDeti = async (id: number) => {
    try {
      const response = await instance.get(`/category_list/${id}`);
      setDetailedCategory(response?.data?.results[0]);
      setCategoryid(response.data.results[0].cat_id);
      console.log(response.data.results[0].is_active, 'dasdfas');
    } catch (err) {
      setError('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const DeleteCategory = async (id: number) => {
    try {
      const response = await instance.delete(`/category/delete/${id}`);
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

      <div className="px-1 py-5   sticky top-[85px] bg-[#F1F5F9] dark:bg-[#1A222C]  border-none">
        <AddCategoryModal
          isOpen={isModalOpen}
          onClose={closeModal}
          fetchCategoriess={fetchCategories}
        />
        <button
          type="button"
          onClick={openModal}
          className="inline-flex items-center justify-center rounded-[10px] bg-gradient-to-r from-[#4623E9] to-[#EAABF0]  py-2 px-6 text-center font-medium text-white hover:bg-opacity-90 "
        >
          Add Categories
        </button>
      </div>
      <div className="rounded-[10px] bg-white px-2 pt-2 pb-2.5  shadow-md dark:border-strokedark dark:bg-boxdark  xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <div className="flex justify-between items-center flex-col md:flex-row">
            <div>
              <h4 className=" md:text-xl px-2 py-4   font-semibold text-black dark:text-white">
                Categories List
              </h4>
            </div>

            <div className="flex">
        
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
                      className="block w-full p-3 ps-10 text-sm text-gray-900 h-[40px] md:w-[216px] dark:bg-meta-4  rounded-[10px] bg-[#F9FBFF]  dark:text-white "
                      placeholder="Search"
                      required
                    />
                  </div>
                </form>
            </div>
          </div>
          {loading ? (
            <div className="flex mx-2 py-3 items-center  bg-white dark:bg-boxdark ">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-solid border-[#4623E9] border-t-transparent"></div>
            </div>
          ) : error ? (
            <p className="mx-2 py-3 text-red-500 dark:text-red-500">{error}</p>
          ) : (
            <table className="w-full table-auto">
              <thead className="border-b-[1px] border-[#B5B7C0] ">
                <tr className=" text-left  rounded-lg">
                  <th className="min-w-[71px] md:min-w-[10px] md:w-[10%]  py-4 px-4 font-bold text-[#B5B7C0] dark:text-[#B5B7C0]  rounded-l-lg">
                    Order No
                  </th>
                  <th className="min-w-[126px] md:min-w-[10px] md:w-[14%] py-4 px-4 font-bold text-[#B5B7C0] dark:text-[#B5B7C0]">
                    Title
                  </th>
                  {/* <th className="min-w-[50px] py-4 px-4 font-bold text-[#B5B7C0] dark:text-[#B5B7C0]">
                  Order No
                </th> */}
                  <th className="md:w-[14%] py-4 px-4 font-bold text-[#B5B7C0] dark:text-[#B5B7C0]">
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
                        {catItem.category_order}
                      </p>
                    </td>
                    <td className="  py-5 px-4  dark:border-strokedark ">
                      <h5 className=" font-semibold text-[#000000] text-[16px]  dark:text-white">
                        {catItem.en}
                      </h5>
                    </td>
                    {/* <td className="  py-5 px-4 dark:border-strokedark">
                    <p className="text-[#000000] font-semibold flex items-center text-[16px] dark:text-white">
                      {catItem.category_order}
                    </p>
                  </td> */}

                    <td className="text-end py-5 px-4 dark:border-strokedark">
                      <p
                        className={`font-semibold flex items-center text-end text-[16px] ${
                          catItem.is_active == 1
                            ? 'text-[#48eb48]'
                            : 'text-[#FF0000] dark:text-[#FF0000]'
                        } dark:text-[#48eb48]`}
                      >
                        {catItem.is_active == 1 ? 'Active' : 'Inactive'}
                      </p>
                    </td>

                    <td className="  py-5 px-4 flex justify-end dark:border-strokedark">
                      <div className="flex items-center ">
                        <EditcategoryModal
                          isOpen={isModalEdit}
                          onClose={closeModalEdit}
                        />
                        {/* edit  list item button using there id */}
                        <button
                          className="hover:text-[#4623E9]"
                          onClick={() => DeleteCategory(catItem.cat_id)}
                        >
                          <TbTrash className="text-[25px] text-[#000] dark:text-[#fff]" />
                        </button>
                        {/* edit  list item button using there id */}

                        {/* edit  list button  */}

                        <button
                          className="hover:text-[#4623E9] mx-2"
                          onClick={() => {
                            CategoryDeti(catItem.cat_id);
                            openModalEdit();
                          }}
                        >
                          <svg
                            width="25px"
                            height="25px"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M13 21H21"
                              className={`stroke-current ${
                                isDarkMode
                                  ? 'text-[#000] dark:text-[#fff]'
                                  : 'text-[#000] dark:text-[#fff]'
                              }`}
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M20.0651 7.39423L7.09967 20.4114C6.72438 20.7882 6.21446 21 5.68265 21H4.00383C3.44943 21 3 20.5466 3 19.9922V18.2987C3 17.7696 3.20962 17.2621 3.58297 16.8873L16.5517 3.86681C19.5632 1.34721 22.5747 4.87462 20.0651 7.39423Z"
                              className={`stroke-current ${
                                isDarkMode
                                  ? 'text-[#000] dark:text-[#fff]'
                                  : 'text-[#000] dark:text-[#fff]'
                              }`}
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M15.3097 5.30981L18.7274 8.72755"
                              className={`stroke-current ${
                                isDarkMode
                                  ? 'text-[#000] dark:text-[#fff]'
                                  : 'text-[#000] dark:text-[#fff]'
                              }`}
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>

                        {/* edit  list button  */}
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

export default CategoriesAdd;
