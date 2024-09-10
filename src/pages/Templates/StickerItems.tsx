import React, { useState } from 'react';
import { useMyContext } from '../../contextapi/MyProvider';

interface Item {
  name: string;
  itemLeftMargin: string;
  itemTopMargin: string;
  itemRightMargin: string;
  itemBottomMargin: string;
  disableSelect: boolean;
}

const StickerItems: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activeItems, setActiveItems] = useState<number | null>(null);
  const { stickersitems, setStickersitems } = useMyContext();

  console.log('Sticker Items', stickersitems);

  const toggleAccordion = (index: number): void => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const toggleActiveItems = (index: number): void => {
    setActiveItems((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
    field: keyof Item
  ) => {
    const newItems = [...stickersitems];
    if (field === 'disableSelect') {
      newItems[index][field] = event.target.checked; // Update boolean value for checkbox
    } else {
      newItems[index][field] = event.target.value;
    }
    setStickersitems(newItems);
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = event.target.files?.[0];
    if (file) {
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
          newItems[index].name = fileUrl; // Assign the file URL to the name property
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
    setStickersitems([
      ...stickersitems,
      {
        name: '',
        itemLeftMargin: '',
        itemTopMargin: '',
        itemRightMargin: '',
        itemBottomMargin: '',
        disableSelect: false,
      },
    ]);
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
                className="rounded-[10px]  bg-white dark:border-strokedark dark:bg-boxdark px-5 font-dm text-[16px] font-semibold  dark:text-[#fff] mb-4"
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
                  <div className="pb-4">
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
                            onChange={(e) =>
                              handleInputChange(e, index, 'itemBottomMargin')
                            }
                          />
                        </div>
                      </div>
                      <div className="w-full sm:w-1/3 px-2">
                        <label
                          className="block mb-2 text-sm font-bold text-black dark:text-white"
                          htmlFor={`name${index}`}
                        >
                          Upload Image
                        </label>
                        <div className="relative mt-[8px] flex items-center">
                          <input
                            className="block mt-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            type="file"
                            required
                            id={`name${index}`}
                            onChange={(e) => handleFileChange(e, index)}
                          />
                        </div>
                      </div>
                      <div className="w-full sm:w-1/3 px-2">
                        <label
                          className="block mb-2 text-sm font-bold text-black dark:text-white"
                          htmlFor={`disableSelect${index}`}
                        >
                          disableSelect
                        </label>
                        <div className="mb-[0.125rem] mt-4 block min-h-[1.5rem] ps-[1.5rem]">
                          <input
                            className="relative float-left -ms-[1.5rem] me-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-secondary-500 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-checkbox before:shadow-transparent before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ms-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-black/60 focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-black/60 focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-checkbox checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ms-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent rtl:float-right dark:border-neutral-400 dark:checked:border-primary dark:checked:bg-primary"
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
                      <div className="w-full flex justify-end items-end mt-4">
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
                className="inline-flex items-center justify-center rounded-[10px] bg-gradient-to-r from-[#4623E9] to-[#EAABF0] py-2 px-6 text-center font-medium text-white hover:bg-opacity-90"
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

export default StickerItems;
