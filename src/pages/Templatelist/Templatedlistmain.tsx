import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useMyContext } from '../../contextapi/MyProvider';
import { TbTrash } from 'react-icons/tb';
import EditcategoryModal from '../Dashboard/EditcategoryModal';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Templatedlistmain: React.FC = () => {
  const { instance, isDarkMode, setTemplatedetilaedapidata } = useMyContext();
  const navigate = useNavigate();
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

  const handleButtonClick = async (id: number) => {
    try {
      const response = await instance.get(`/get/template/${id}`);
      console.log("umer",response.data.results[0]);
      setTemplatedetilaedapidata(response.data.results[0]);
      navigate(`/templatedlist/Edittemplate`);
    } catch (error) {
      console.error('Error fetching details:', error);
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      <div className=" py-5  sticky top-[85px] bg-[#F1F5F9] dark:bg-[#1A222C] border-none">
        <NavLink
          className="inline-flex items-center justify-center rounded-[10px] bg-gradient-to-r from-[#E11D48] to-[#ff7896]  py-2 px-6 text-center font-medium text-white hover:bg-opacity-90 "
          to="/templatedlist/createtemplate"
        >
          Create New Template
        </NavLink>
      </div>

      <div className="bg-[#fff] mb-4 rounded-[10px] dark:bg-[#24303F] py-4 px-4">
        <div className="max-w-full overflow-x-auto">
          <div className="flex justify-between items-center flex-col md:flex-row">
            <div>
              <h4 className=" md:text-xl px-2 py-4   font-semibold text-black dark:text-white">
                Templates List
              </h4>
            </div>

            <div className="flex">
              {/* <div className="mr-2">
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
              </div> */}
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
                  <th className="py-4 px-4  font-bold text-[#B5B7C0] dark:text-[#B5B7C0]">
                    Status
                  </th>
                  <th className="py-4 px-4 font-bold text-[#B5B7C0] dark:text-[#B5B7C0]">
                    Thumbnail Category
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
                    <td className="text-end py-5 px-4 dark:border-strokedark">
                      <p
                        className={`font-semibold flex items-center text-center text-[16px] ${
                          catItem.Categories[0]?.thumbnilcategory === '0'
                            ? 'text-blue-500'
                            : 'text-green-500'
                        }`}
                      >
                        {catItem.Categories[0]?.thumbnilcategory === '0'
                          ? 'Invitation Templates'
                          : 'Greeting Cards'}
                      </p>
                    </td>
                    <td className="  py-5 px-4 flex justify-end items-center dark:border-strokedark ">
                      <button
                        className="hover:text-[#E11D48] mx-4"
                        onClick={() => {
                          handleButtonClick(catItem.templateID);
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
                      <div className="flex items-center ">
                        <EditcategoryModal
                          isOpen={isModalEdit}
                          onClose={closeModalEdit}
                        />
                        <button
                          className="hover:text-[#E11D48] "
                          onClick={() => DeleteCategory(catItem.templateID)}
                        >
                          <TbTrash className="text-[25px] text-[#000] dark:text-[#fff]" />
                        </button>
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
