import React, { useEffect, useRef, useState } from 'react';
import ImageItems from './ImageItems';
import TextItems from './TextItems';
import StickerItems from './StickerItems';
import { useMyContext } from '../../contextapi/MyProvider';
import { IoArrowBackCircle } from 'react-icons/io5';
import { Link } from 'react-router-dom';
// import axios from 'axios';

const Templatesmain: React.FC = () => {
  const { instance, Imagesitem, stickersitems, textsitems } = useMyContext();
  const [categorieslist, setCategorieslist] = useState<any | null>([]);
  const childRefs = {
    textItems: useRef<{ validate: () => boolean }>(null),
    imageItems: useRef<{ validate: () => boolean }>(null),
    stickerItems: useRef<{ validate: () => boolean }>(null),
  };
  const [activeComponent, setActiveComponent] = useState<
    'text' | 'image' | 'sticker'
  >('text');

  const [formData, setFormData] = useState({
    catID: '',
    status: '',
    templateOrder: "",
    isPro: false,
    isNew: false,
    imagesCount: '',
    templateBaseURL: '',
    templateFrameURL: '',
    templateThumbnailURL: '',
    templateSize: '',
    thumbnailWidth: '',
    thumbnailHeight: '',
    templateWidth: '',
    templateHeight: '',
  });

  const handleComponentChange = (component: 'text' | 'image' | 'sticker') => {
    setActiveComponent(component);
  };
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      // Create a FormData object for file upload
      const formData = new FormData();
      formData.append('file', file);

      try {
        // Upload the file to the server
        const response = await fetch(
          'https://collage-maker.trippleapps.com/file/upload/',
          {
            method: 'POST',
            body: formData,
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log(data.results.file_path);

          const fileURL = data.results.file_path;

          // Update the state with the new file URL
          if (type === 'frame') {
            // setSelectedFrameFile(file);
            setFormData((prevData) => ({
              ...prevData,
              templateFrameURL: fileURL,
            }));
          } else if (type === 'thumbnail') {
            // setSelectedThumbnailFile(file);
            setFormData((prevData) => ({
              ...prevData,
              templateThumbnailURL: fileURL,
            }));
          }
        } else {
          console.error('File upload failed', response.statusText);
        }
      } catch (error) {
        console.error('Error uploading file', error);
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const validations = {
      text: childRefs.textItems.current?.validate(),
      image: childRefs.imageItems.current?.validate(),
      sticker: childRefs.stickerItems.current?.validate(),
    };

    if (!validations) {
      console.log(
        `Please fill all required fields in the ${activeComponent} component`
      );
      return;
    }
    const payload = {
      catID: parseInt(formData.catID),
      status: parseInt(formData.status) || '',
      templateOrder: parseInt(formData.templateOrder) || 0,
      isPro: formData.isPro ? '1' : '0',
      isNew: formData.isNew ? '1' : '0',
      imagesCount: parseInt(formData.imagesCount) || 0  ,
      templateBaseURL: formData.templateBaseURL,
      templateFrameURL: formData.templateFrameURL,
      templateThumbnailURL: formData.templateThumbnailURL,
      templateSize: parseInt(formData.templateSize) || '',
      thumbnailWidth: parseInt(formData.thumbnailWidth) || '',
      thumbnailHeight: parseInt(formData.thumbnailHeight) || '',
      templateWidth: parseInt(formData.templateWidth) || '',
      templateHeight: parseInt(formData.templateHeight) || '',
      imageItems: Imagesitem,
      textItems: textsitems,
      stickerItems: stickersitems,
    };

    try {
      const response = await instance.post('/template/addedit', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  useEffect(() => {
    fetchCategorieslist();
  }, []);

  const fetchCategorieslist = async () => {
    try {
      const response = await instance.get('/category_list/');
      setCategorieslist(response.data.results);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (event: any) => {
    setFormData({ ...formData, catID: event.target.value });
  };

  return (
    <>
      <div className="flex items-center">
        <Link to="/templatedlist">
          <IoArrowBackCircle className="h-[54px] w-[57px] text-[#E11D48]" />{' '}
        </Link>
      </div>

      <div className=" py-5  top-[85px] bg-[#F1F5F9] dark:bg-[#1A222C] border-none">
        <span className=" md:text-[20px] px-2 py-4   font-semibold text-black dark:text-white">
          Create Templates
        </span>
      </div>

      <div className="bg-[#fff] mb-4 rounded-[10px] dark:bg-[#24303F] py-4 px-4">
        <div className="flex flex-col px-2">
          <form className="w-full " onSubmit={handleSubmit}>
            <div className="w-full py-4">
              <div>
                <span className="text-lg md:text-[18px] font-semibold text-black dark:text-white">
                  Add New Templates
                </span>
                <div className="w-full mt-4 sm:w-2/5">
                  <label
                    className="block mb-2 text-sm font-bold text-black dark:text-white"
                    htmlFor="tag"
                  >
                    Category Name
                  </label>
                  <div className="relative">
                    <select
                      id="tag"
                      required
                      value={formData.catID}
                      onChange={handleChange}
                      className="block w-full px-3 py-2.5   resize-none rounded-[10px] border border-[#B8BAC7] bg-white text-[16px] font-normal text-[#1B254B] dark:border-meta-4 dark:bg-meta-4 dark:text-white dark:placeholder-[#fff]"
                    >
                      <option value="" selected>
                        Choose a category
                      </option>
                      {categorieslist.map((cate: any) => (
                        <option
                          className=""
                          key={cate.cat_id}
                          value={cate.category_order}
                          data-id={cate.cat_id}
                        >
                          {cate.en}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap -mx-2 md:mt-4">
                <div className="w-full sm:w-1/3 px-2 mt-4">
                  <label
                    className="block mb-2 text-sm font-bold text-black dark:text-white"
                    htmlFor="Status"
                  >
                    Status
                  </label>
                  <div className="relative">
                    <input
                      className="block w-full resize-none rounded-[10px] border border-[#B8BAC7] bg-white px-4 py-2.5  text-[16px] font-normal text-[#1B254B] dark:border-meta-4 dark:bg-meta-4 dark:text-white dark:placeholder-[#fff]"
                      type="number"
                      name="status"
                      id="status"
                      placeholder="Status"
                      required
                      value={formData.status}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="w-full sm:w-1/3 px-2 mt-4">
                  <label
                    className="block mb-2 text-sm font-bold text-black dark:text-white"
                    htmlFor="order"
                  >
                    Order
                  </label>
                  <div className="relative">
                    <input
                      className="block w-full resize-none rounded-[10px] border border-[#B8BAC7] bg-white px-4 py-2.5  text-[16px] font-normal text-[#1B254B] dark:border-meta-4 dark:bg-meta-4 dark:text-white dark:placeholder-[#fff]"
                      type="number"
                      name="templateOrder"
                      id="templateOrder"
                      placeholder="templateOrder"
                      value={formData.templateOrder}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="w-full sm:w-1/3 px-2 mt-4">
                  <label
                    className="block mb-2 text-sm font-bold text-black dark:text-white"
                    htmlFor="imagesCount"
                  >
                    ImagesCount
                  </label>
                  <div className="relative">
                    <input
                      className="block w-full resize-none rounded-[10px] border border-[#B8BAC7] bg-white px-4 py-2.5  text-[16px] font-normal text-[#1B254B] dark:border-meta-4 dark:bg-meta-4 dark:text-white dark:placeholder-[#fff]"
                      type="number"
                      name="imagesCount"
                      id="imagesCount"
                      placeholder="imagesCount"
                      value={formData.imagesCount}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap -mx-2 md:mt-4">
                <div className="w-full sm:w-1/3 px-2 mt-4">
                  <label
                    className="block mb-2 text-sm font-bold text-black dark:text-white"
                    htmlFor="templateSize"
                  >
                    Template Size
                  </label>
                  <div className="relative">
                    <input
                      className="block w-full resize-none rounded-[10px] border border-[#B8BAC7] bg-white px-4 py-2.5  text-[16px] font-normal text-[#1B254B] dark:border-meta-4 dark:bg-meta-4 dark:text-white dark:placeholder-[#fff]"
                      type="number"
                      name="templateSize"
                      id="templateSize"
                      placeholder="templateSize"
                      required
                      value={formData.templateSize}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="w-full sm:w-1/3 px-2 mt-4">
                  <label
                    className="block mb-2 text-sm font-bold text-black dark:text-white"
                    htmlFor="TemplateWidth"
                  >
                    Template Width
                  </label>
                  <div className="relative">
                    <input
                      className="block w-full resize-none rounded-[10px] border border-[#B8BAC7] bg-white px-4 py-2.5  text-[16px] font-normal text-[#1B254B] dark:border-meta-4 dark:bg-meta-4 dark:text-white dark:placeholder-[#fff]"
                      type="number"
                      name="templateWidth"
                      id="templateWidth"
                      placeholder="templateWidth"
                      required
                      value={formData.templateWidth}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="w-full sm:w-1/3 px-2 mt-4">
                  <label
                    className="block mb-2 text-sm font-bold text-black dark:text-white"
                    htmlFor="TemplateHeight"
                  >
                    Template Height
                  </label>
                  <div className="relative">
                    <input
                      className="block w-full resize-none rounded-[10px] border border-[#B8BAC7] bg-white px-4 py-2.5  text-[16px] font-normal text-[#1B254B] dark:border-meta-4 dark:bg-meta-4 dark:text-white dark:placeholder-[#fff]"
                      type="number"
                      name="templateHeight"
                      id="templateHeight"
                      placeholder="templateHeight"
                      required
                      value={formData.templateHeight}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap -mx-2 md:mt-4">
                <div className="w-full sm:w-1/3 px-2 mt-4">
                  <label
                    className="block mb-2 text-sm font-bold text-black dark:text-white"
                    htmlFor="TemplateWidth"
                  >
                    Thumbnail Width
                  </label>
                  <div className="relative">
                    <input
                      className="block w-full resize-none rounded-[10px] border border-[#B8BAC7] bg-white px-4 py-2.5  text-[16px] font-normal text-[#1B254B] dark:border-meta-4 dark:bg-meta-4 dark:text-white dark:placeholder-[#fff]"
                      type="number"
                      name="thumbnailWidth"
                      id="thumbnailWidth"
                      placeholder="thumbnailWidth"
                      required
                      value={formData.thumbnailWidth}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="w-full sm:w-1/3 px-2 mt-4">
                  <label
                    className="block mb-2 text-sm font-bold text-black dark:text-white"
                    htmlFor="ThumbnailHeight"
                  >
                    Thumbnail Height
                  </label>
                  <div className="relative">
                    <input
                      className="block w-full resize-none rounded-[10px] border border-[#B8BAC7] bg-white px-4 py-2.5  text-[16px] font-normal text-[#1B254B] dark:border-meta-4 dark:bg-meta-4 dark:text-white dark:placeholder-[#fff]"
                      type="number"
                      name="thumbnailHeight"
                      id="thumbnailHeight"
                      placeholder="thumbnailHeight"
                      required
                      value={formData.thumbnailHeight}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="w-full sm:w-1/3 px-2 mt-4">
                  <label
                    className="block mb-2 text-sm font-bold text-black dark:text-white"
                    htmlFor="templateBaseURL"
                  >
                    Template Base URL
                  </label>
                  <div className="relative">
                    <input
                      className="block w-full resize-none rounded-[10px] border border-[#B8BAC7] bg-white px-4 py-2.5  text-[16px] font-normal text-[#1B254B] dark:border-meta-4 dark:bg-meta-4 dark:text-white dark:placeholder-[#fff]"
                      type="url"
                      name="templateBaseURL"
                      id="templateBaseURL"
                      required
                      placeholder="templateBaseURL"
                      value={formData.templateBaseURL}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap -mx-2 md:mt-4">
                <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/5 px-2 mt-4">
                  <label
                    className="block mb-2 text-sm font-bold text-black dark:text-white"
                    htmlFor="templateFrameURL"
                  >
                    Template Frame URL
                  </label>
                  <div className="relative mt-[8px]">
                    <div className="w-full sm:w-2/3 lg:w-2/5 mt-4">
                      <input
                        className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        type="file"
                        name="templateFrameFile"
                        required
                        onChange={(e) => handleFileChange(e, 'frame')}
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/3  xl:w-1/5 px-2 mt-4">
                  <label
                    className="block mb-2 text-sm font-bold text-black dark:text-white"
                    htmlFor="templateThumbnailURL"
                  >
                    Template Thumbnail URL
                  </label>
                  <div className="relative mt-[8px]">
                    <div className="w-full sm:w-2/3 lg:w-2/5 mt-4">
                      <input
                        className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        type="file"
                        required
                        name="templateThumbnailFile"
                        onChange={(e) => handleFileChange(e, 'thumbnail')}
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-1/3 lg:w-1/4 flex  xl:w-1/5 items-center px-2 mt-4">
                  <div className="flex flex-wrap w-full">
                    <div className="mb-[0.125rem] md:mt-7  mt-3 block min-h-[1.5rem]">
                      <input
                        className="relative float-left mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-secondary-500 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-checkbox before:shadow-transparent before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:left-[5px] checked:after:top-[-1px] hover:cursor-pointer hover:before:opacity-[0.04] focus:shadow-none focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-black/60 checked:focus:before:scale-100 checked:focus:before:shadow-checkbox"
                        type="checkbox"
                        name="isPro"
                        id="isPro"
                        checked={formData.isPro}
                        onChange={handleCheckboxChange}
                      />
                      <label className="inline-block ps-[0.15rem] hover:cursor-pointer">
                        isPro
                      </label>
                    </div>
                    <div className="mb-[0.125rem] md:mt-7 mt-3 ml-6 block min-h-[1.5rem]">
                      <input
                        className="relative float-left mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-secondary-500 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-checkbox before:shadow-transparent before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:left-[5px] checked:after:top-[-1px] hover:cursor-pointer hover:before:opacity-[0.04] focus:shadow-none focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-black/60 checked:focus:before:scale-100 checked:focus:before:shadow-checkbox"
                        type="checkbox"
                        name="isNew"
                        id="isNew"
                        checked={formData.isNew}
                        onChange={handleCheckboxChange}
                      />
                      <label className="inline-block ps-[0.15rem] hover:cursor-pointer">
                        isNew
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* {activeComponent === 'image' && ( */}
              <div className="mt-6 ">
                <ImageItems ref={childRefs.imageItems} />
              </div>
              {/* // )} */}
              {/* {activeComponent === 'text' && ( */}
              <div className="mt-6 ">
                <TextItems ref={childRefs.textItems} />
              </div>
              {/* // )} */}
              {/* {activeComponent === 'sticker' && ( */}
              <div className="mt-6 ">
                <StickerItems ref={childRefs.stickerItems} />
              </div>
              {/* )} */}
            </div>

            <div className="flex py-4">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-[10px] bg-gradient-to-r from-[#E11D48] to-[#ff7896] py-2 px-6 text-center font-medium text-white hover:bg-opacity-90"
              >
                Add Template
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Templatesmain;
