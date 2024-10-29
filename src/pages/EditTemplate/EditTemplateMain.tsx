import React, { useEffect, useState } from 'react';
import { useMyContext } from '../../contextapi/MyProvider';
import { IoArrowBackCircle } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import pluse from '../Templates/images/pulse.svg';
import edit from '../Templates/images/edit.svg';
import defultpdfimg from '../Templates/images/defult.svg';
import EditImgaeitem from './EditImgaeitem';
import Edittextitems from './Edittextitems';
import Editstikeritem from './Editstikeritem';

const EditTemplateMain: React.FC = () => {
  const {
    instance,
    Imagesitem,
    stickersitems,
    textsitems,
    templatedetilaedapidata,
  } = useMyContext();

  const navigate = useNavigate();

  const [categorieslist, setCategorieslist] = useState<any | null>([]);
  console.log('eee', templatedetilaedapidata);

  const [formData, setFormData] = useState({
    catID: '',
    status: '',
    templateOrder: '',
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
    previewFrame: '',
    previewThumbnail: '',
  });

  // Populate formData with templatedetilaedapidata when it changes
  useEffect(() => {
    if (templatedetilaedapidata) {
      setFormData((prevData) => ({
        ...prevData,
        ...templatedetilaedapidata, // Spread the existing state with the new data
      }));
    }
  }, [templatedetilaedapidata]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append('file', file);

      const reader = new FileReader();

      reader.onloadend = async () => {
        const fileURL = reader.result as string;

        try {
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

            const uploadFileURL = data.results.file_path;

            if (type === 'frame') {
              setFormData((prevData) => ({
                ...prevData,
                templateFrameURL: uploadFileURL,
                previewFrame: fileURL,
              }));
            } else if (type === 'thumbnail') {
              setFormData((prevData) => ({
                ...prevData,
                templateThumbnailURL: uploadFileURL,
                previewThumbnail: fileURL,
              }));
            }
          } else {
            console.error('File upload failed', response.statusText);
          }
        } catch (error) {
          console.error('Error uploading file', error);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.templateFrameURL) {
      toast.error('Frame image is required.');
      return;
    }

    if (!formData.templateThumbnailURL) {
      toast.error('Thumbnail image is required.');
      return;
    }

    if (!Imagesitem || !textsitems || !stickersitems) {
      toast.error('Please fill out all required fields');
      return;
    }

    // Validate image items
    for (const item of Imagesitem) {
      if (
        !item.itemWidth ||
        !item.itemHeight ||
        !item.itemLeftMargin ||
        !item.itemTopMargin ||
        !item.itemRightMargin ||
        !item.itemBottomMargin ||
        !item.mask
      ) {
        toast.error('Please fill out all properties for each image item.');
        return;
      }
    }

    for (const item of textsitems) {
      if (
        !item.text ||
        !item.itemLeftMargin ||
        !item.itemTopMargin ||
        !item.itemRightMargin ||
        !item.itemBottomMargin ||
        !item.textColor ||
        !item.textSize ||
        !item.lineHeight ||
        !item.textAlignment ||
        !item.fontId ||
        !item.fontName ||
        !item.fontUrl
      ) {
        toast.error('Please fill out all properties for each text item.');
        return false;
      }
    }

    // Validate sticker items
    for (const item of stickersitems) {
      if (
        !item.sticker_url ||
        !item.itemLeftMargin ||
        !item.itemTopMargin ||
        !item.itemRightMargin ||
        !item.itemBottomMargin
      ) {
        toast.error('Please fill out all properties for each sticker item.');
        return false;
      }
    }

    const payload = {
      catID: parseInt(formData.catID),
      status: parseInt(formData.status) || '',
      templateOrder: parseInt(formData.templateOrder) || 0,
      isPro: formData.isPro ? '1' : '0',
      isNew: formData.isNew ? '1' : '0',
      imagesCount: parseInt(formData.imagesCount) || 0,
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
      templateID: templatedetilaedapidata?.templateID || null,
    };

    try {
      const response = await instance.post('/template/addedit', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Response:', response.data);
      if (response.data) {
        toast.success('Template successfully Edit!');
        setTimeout(() => {
          navigate('/templatedlist');
        }, 1000);
      }
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

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, catID: event.target.value });
  };
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex items-center">
        <Link to="/templatedlist">
          <IoArrowBackCircle className="h-[54px] w-[57px] text-[#E11D48]" />{' '}
        </Link>
      </div>

      <div className=" py-5  top-[85px] bg-[#F1F5F9] dark:bg-[#1A222C] border-none">
        <span className=" md:text-[20px] px-2 py-4   font-semibold text-black dark:text-white">
          Edit Templates
        </span>
      </div>

      <div className="bg-[#fff] mb-4 rounded-[10px] dark:bg-[#24303F] py-4 px-4">
        <div className="flex flex-col px-2">
          <form className="w-full " onSubmit={handleSubmit}>
            <div className="w-full py-4">
              <div>
                <span className="text-lg md:text-[18px] font-semibold text-black dark:text-white">
                  Edit Templates
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
                          value={cate.cat_id}
                          data-id={cate.cat_id}
                        >
                          <span className="text-black">{cate.en}</span>
                          {' ========================= '}

                          <span className="text-red-500">
                            {cate.thumbnilcategory === '0'
                              ? 'Invitation Templates'
                              : 'Greeting Cards'}
                          </span>
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
                <div className="mt-4 flex">
                  <div className="relative flex pb-5 mx-2">
                    <div className="relative">
                      <label htmlFor="templateFrameFile">
                        {formData.previewFrame || formData.templateFrameURL ? (
                          <img
                            src={
                              formData.templateFrameURL
                                ? `https://collage-maker.trippleapps.com/${formData.templateFrameURL}`
                                : formData.previewFrame
                            }
                            alt="Preview"
                            className="accordion-btn relative h-[80px] w-[80px] cursor-pointer rounded-[18px] border-[3.5px] border-[#e3224d] p-2 text-sm text-white"
                          />
                        ) : (
                          <img
                            src={defultpdfimg}
                            alt="Default"
                            className="accordion-btn relative h-[76px] w-[76px] cursor-pointer rounded-[18px] border-[3.5px] border-[#e3224d] p-2 text-sm text-white"
                          />
                        )}
                      </label>
                      <label
                        htmlFor="templateFrameFile"
                        className="absolute -right-3 -top-3 h-[39px] w-[39px] cursor-pointer rounded-3xl border-[#e3224d] p-1 text-white"
                      >
                        <img
                          src={formData.previewFrame ? edit : pluse}
                          alt="Icon"
                        />
                      </label>
                    </div>

                    {/* File input */}
                    <input
                      type="file"
                      id="templateFrameFile"
                      className="hidden"
                      name="templateFrameFile"
                      onChange={(e) => handleFileChange(e, 'frame')}
                    />
                  </div>
                  <label className="ml-4 flex justify-center items-center text-[15px] font-bold text-black dark:text-white">
                    Upload Template Frame Image
                  </label>
                </div>

                <div className="mt-4 flex">
                  <div className="relative flex pb-5 ml-7">
                    <div className="relative">
                      <label htmlFor="templateThumbnailFile">
                        {formData.previewThumbnail || formData.templateThumbnailURL ? (
                          <img
                            src={
                              formData.templateThumbnailURL
                                ? `https://collage-maker.trippleapps.com/${formData.templateThumbnailURL}`
                                : formData.previewThumbnail
                            }
                            alt="Preview"
                            className="accordion-btn relative h-[80px] w-[80px] cursor-pointer rounded-[18px] border-[3.5px] border-[#e3224d] p-2 text-sm text-white"
                          />
                        ) : (
                          <img
                            src={defultpdfimg}
                            alt="Default"
                            className="accordion-btn relative h-[76px] w-[76px] cursor-pointer rounded-[18px] border-[3.5px] border-[#e3224d] p-2 text-sm text-white"
                          />
                        )}
                      </label>
                      <label
                        htmlFor="templateThumbnailFile"
                        className="absolute -right-3 -top-3 h-[39px] w-[39px] cursor-pointer rounded-3xl border-[#e3224d] p-1 text-white"
                      >
                        <img
                          src={formData.previewThumbnail ? edit : pluse}
                          alt="Icon"
                        />
                      </label>
                    </div>

                    {/* File input */}
                    <input
                      type="file"
                      id="templateThumbnailFile"
                      className="hidden"
                      name="templateThumbnailFile"
                      onChange={(e) => handleFileChange(e, 'thumbnail')}
                    />
                  </div>

                  <label className="ml-4 flex justify-center items-center text-[15px] font-bold text-black dark:text-white">
                    Upload Thumbnail Frame Image
                  </label>
                </div>
                <div className="mt-4 flex">
                  <div className="flex flex-wrap w-full ml-7">
                    <div className="mb-[0.125rem] md:mt-[39px]  mt-3 block min-h-[1.5rem]">
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
                    <div className="mb-[0.125rem] md:mt-[39px] mt-3 ml-6 block min-h-[1.5rem]">
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

              <div className="mt-6 ">
                <EditImgaeitem />
              </div>

              <div className="mt-6 ">
                <Edittextitems />
              </div>

              <div className="mt-6 ">
                <Editstikeritem />
              </div>
            </div>

            <div className="flex py-4">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-[10px] bg-[#E11D48] py-2 px-6 text-center font-medium text-white hover:bg-opacity-90"
              >
                Save Template
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditTemplateMain;
