import React, { useEffect, useState } from 'react';
import { useMyContext } from '../../contextapi/MyProvider';
import pluse from '../Templates/images/pulse.svg';
import edit from '../Templates/images/edit.svg';
import defultpdfimg from '../Templates/images/defult.svg';

interface Item {
  sticker_url: string;
  itemLeftMargin: string;
  itemTopMargin: string;
  itemRightMargin: string;
  itemBottomMargin: string;
  disableSelect: boolean;
}

const Editstikeritem = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [activeItems, setActiveItems] = useState<number>(1);
  const { stickersitems, setStickersitems, templatedetilaedapidata } =
    useMyContext();
  const [validationErrors, setValidationErrors] = useState<{
    [key: number]: boolean;
  }>({});

  const initialItem = {
    sticker_url: '',
    itemLeftMargin: '',
    itemTopMargin: '',
    itemRightMargin: '',
    itemBottomMargin: '',
    disableSelect: false,
    preview: '',
  };

  useEffect(() => {
    if (templatedetilaedapidata && templatedetilaedapidata.stickerItems) {
      setStickersitems(templatedetilaedapidata.stickerItems);
    } else {
      setStickersitems([initialItem]);
    }
  }, [templatedetilaedapidata]);

  const toggleAccordion = (index: number): void => {
    setActiveIndex((prevIndex) => (prevIndex === index ? -1 : index));
  };

  const toggleActiveItems = (index: number): void => {
    validateItem(index);
    setActiveItems((prevIndex) => (prevIndex === index ? -1 : index));
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
    field: keyof Item
  ) => {
    const newItems = [...stickersitems];
    if (field === 'disableSelect') {
      newItems[index][field] = event.target.checked;
    } else {
      newItems[index][field] = event.target.value;
    }
    setStickersitems(newItems);
    validateItem(index);
  };
  const validateItem = (index: number) => {
    const item = stickersitems[index];
    const isValid =
      item.sticker_url &&
      item.itemLeftMargin &&
      item.itemTopMargin &&
      item.itemRightMargin &&
      item.itemBottomMargin;

    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [index]: !isValid,
    }));
  };
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const filePreview = URL.createObjectURL(file);
      const formData = new FormData();
      formData.append('file', file);

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
          const fileUrl = data.results.file_path;

          const newItems = [...stickersitems];
          newItems[index].sticker_url = fileUrl;
          newItems[index].preview = filePreview;
          setStickersitems(newItems);
        } else {
          console.error('File upload failed with status:', response.status);
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const addItem = () => {
    setStickersitems((prevItems) => [...prevItems, { ...initialItem }]);
  };

  const deleteItem = (index: number) => {
    const newItems = stickersitems.filter((_, i) => i !== index);
    setStickersitems(newItems);
  };

  return (
    <div className="space-y-2 ">
      <div className="rounded-[10px]   dark:border-meta-4 dark:bg-meta-4 bg-[#F4F5F6] font-bold px-5 font-dm text-[16px]  dark:text-[#fff]">
        <div
          className="flex h-[50px]  cursor-pointer items-center justify-between"
          onClick={() => toggleAccordion(0)}
        >
          <span className=" md:text-[17.5px]  font-semibold text-black dark:text-white">
            Sticker Items
          </span>
          <svg
            className={`h-3 w-3 transform ${
              activeIndex === 0 ? 'rotate-180' : 'rotate-90'
            }`}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5 5 1 1 5"
            />
          </svg>
        </div>

        {activeIndex === 0 && (
          <div className="mt-4">
            {stickersitems.map((item, index) => (
              <div
                key={index}
                className="rounded-[10px]  bg-white dark:border-strokedark dark:bg-boxdark px-5 font-dm text-[16px] font-semibold  dark:text-[#fff] mb-3"
              >
                <div
                  className="flex h-[48px] cursor-pointer items-center justify-between"
                  onClick={() => toggleActiveItems(index)}
                >
                  <span className="text-[16px] font-semibold text-[#1B254B] dark:text-[#fff]">
                    Sticker Item {index + 1}
                  </span>
                  <svg
                    className={`h-3 w-3 transform ${
                      activeItems === index ? 'rotate-180' : 'rotate-90'
                    }`}
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5 5 1 1 5"
                    />
                  </svg>
                </div>

                {activeItems === index && (
                  <div className="pb-5">
                    <div className="mt-4 flex">
                      <div className="relative flex pb-5">
                        <div className="relative">
                          <label htmlFor={`stickerfileinput-${index}`}>
                            {item.preview ? (
                              <img
                                src={
                                  item.sticker_url
                                    ? `https://collage-maker.trippleapps.com/${item.sticker_url}`
                                    : item.preview
                                }
                                alt="Preview"
                                className="accordion-btn relative h-[80px] w-[80px]  cursor-pointer rounded-[18px] border-[3.5px] border-[#e3224d] p-2 text-sm text-white"
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
                            htmlFor={`stickerfileinput-${index}`}
                            className="absolute -right-3 -top-3 h-[39px] w-[39px] cursor-pointer rounded-3xl border-[#e3224d] p-1 text-white"
                          >
                            <img src={item.preview ? edit : pluse} alt="Icon" />
                          </label>
                        </div>

                        {/* File input */}
                        <input
                          type="file"
                          required
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, index)}
                          className="hidden"
                          id={`stickerfileinput-${index}`}
                        />
                      </div>
                      <label className="ml-7 flex justify-center items-center text-[15px] font-bold text-black dark:text-white">
                        Upload Image
                      </label>
                    </div>
                    {validationErrors[index] && (
                      <div className="text-red-500">
                        Please upload an image and fill all required fields.
                      </div>
                    )}
                    <div className="flex flex-wrap -mx-2 md:mt-4">
                      <div className="w-full sm:w-1/3 px-2">
                        <label
                          className="block mb-2 text-sm font-bold text-black dark:text-white"
                          htmlFor={`itemLeftMargin${index}`}
                        >
                          Item Left Margin
                        </label>
                        <div className="relative">
                          <input
                            className="block w-full resize-none rounded-[10px] border border-[#B8BAC7] bg-white px-3 py-2.5 text-[16px] font-normal text-[#1B254B] dark:border-meta-4 dark:bg-meta-4 dark:text-white dark:placeholder-[#fff]"
                            type="number"
                            id={`itemLeftMargin${index}`}
                            placeholder="item Left Margin"
                            value={item.itemLeftMargin}
                            required
                            onChange={(e) =>
                              handleInputChange(e, index, 'itemLeftMargin')
                            }
                          />
                        </div>
                      </div>
                      <div className="w-full sm:w-1/3 px-2">
                        <label
                          className="block mb-2 text-sm font-bold text-black dark:text-white"
                          htmlFor={`itemTopMargin${index}`}
                        >
                          Item Top Margin
                        </label>
                        <div className="relative">
                          <input
                            className="block w-full resize-none rounded-[10px] border border-[#B8BAC7] bg-white px-3 py-2.5 text-[16px] font-normal text-[#1B254B] dark:border-meta-4 dark:bg-meta-4 dark:text-white dark:placeholder-[#fff]"
                            type="number"
                            id={`itemTopMargin${index}`}
                            placeholder="Item Top Margin"
                            value={item.itemTopMargin}
                            required
                            onChange={(e) =>
                              handleInputChange(e, index, 'itemTopMargin')
                            }
                          />
                        </div>
                      </div>
                      <div className="w-full sm:w-1/3 px-2">
                        <label
                          className="block mb-2 text-sm font-bold text-black dark:text-white"
                          htmlFor={`itemRightMargin${index}`}
                        >
                          Item Right Margin
                        </label>
                        <div className="relative">
                          <input
                            className="block w-full resize-none rounded-[10px] border border-[#B8BAC7] bg-white px-3 py-2.5 text-[16px] font-normal text-[#1B254B] dark:border-meta-4 dark:bg-meta-4 dark:text-white dark:placeholder-[#fff]"
                            type="number"
                            id={`itemRightMargin${index}`}
                            placeholder="Item Right Margin"
                            value={item.itemRightMargin}
                            required
                            onChange={(e) =>
                              handleInputChange(e, index, 'itemRightMargin')
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap -mx-2 md:mt-4">
                      <div className="w-full sm:w-1/3 px-2">
                        <label
                          className="block mb-2 text-sm font-bold text-black dark:text-white"
                          htmlFor={`itemBottomMargin${index}`}
                        >
                          Item Bottom Margin
                        </label>
                        <div className="relative">
                          <input
                            className="block w-full resize-none rounded-[10px] border border-[#B8BAC7] bg-white px-3 py-2.5 text-[16px] font-normal text-[#1B254B] dark:border-meta-4 dark:bg-meta-4 dark:text-white dark:placeholder-[#fff]"
                            type="number"
                            id={`itemBottomMargin${index}`}
                            placeholder="Item Bottom Margin"
                            value={item.itemBottomMargin}
                            required
                            onChange={(e) =>
                              handleInputChange(e, index, 'itemBottomMargin')
                            }
                          />
                        </div>
                      </div>

                      <div className=" px-2">
                        <label
                          className="block  text-sm font-bold text-black dark:text-white"
                          htmlFor={`disableSelect${index}`}
                        >
                          disableSelect
                        </label>
                        <div className="mb-[0.125rem] mt-5 block min-h-[1.5rem] ps-[1.5rem]">
                          <input
                            className="relative float-left -ms-[1.5rem] me-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-secondary-500 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-checkbox before:shadow-transparent before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ms-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-black/60 focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-black/60 focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute  focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-checkbox checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ms-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent rtl:float-right dark:border-neutral-400 dark:checked:border-primary dark:checked:bg-primary"
                            type="checkbox"
                            id={`disableSelect${index}`}
                            checked={item.disableSelect}
                            onChange={(e) =>
                              handleInputChange(e, index, 'disableSelect')
                            }
                          />
                          <label className="inline-block ps-[0.15rem] hover:cursor-pointer">
                            disableSelect
                          </label>
                        </div>
                      </div>
                      <div className="w-full sm:w-1/3 px-2 mt-[28px] ml-10">
                        <button
                          className="rounded-[10px]  bg-red-500 text-white px-4 py-2 mt-[3px]"
                          onClick={() => deleteItem(index)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div className="flex py-4">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-[10px] bg-[#ff6e8d]  py-2 px-6 text-center font-bold text-[#fff] hover:bg-opacity-90"
                onClick={addItem}
              >
                Add Image Item
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Editstikeritem;
