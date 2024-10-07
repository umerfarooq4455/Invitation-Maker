import React, { useEffect, useState } from 'react';
import { useMyContext } from '../../contextapi/MyProvider';
import pluse from '../Templates/images/pulse.svg';
import edit from '../Templates/images/edit.svg';
import defultpdfimg from '../Templates/images/defult.svg';

interface Item {
  imageID: string;
  itemWidth: string;
  itemHeight: string;
  itemLeftMargin: string;
  itemTopMargin: string;
  itemRightMargin: string;
  itemBottomMargin: string;
  rotated: string;
  mask: string;
  preview: string;
  templateId: string;
}

const EditImgaeitem = () => {
  const { Imagesitem, setImagesitem, templatedetilaedapidata } = useMyContext();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [activeItems, setActiveItems] = useState<number>(1);
  const [validationErrors, setValidationErrors] = useState<{
    [key: number]: boolean;
  }>({});

  const initialItem: Item = {
    imageID: '',
    itemWidth: '',
    itemHeight: '',
    itemLeftMargin: '',
    itemTopMargin: '',
    itemRightMargin: '',
    itemBottomMargin: '',
    rotated: '',
    mask: '',
    preview: '',
    templateId: '',
  };

  // Initialize the Imagesitem state from templatedetilaedapidata
  useEffect(() => {
    if (templatedetilaedapidata && templatedetilaedapidata.imageItems) {
      setImagesitem(templatedetilaedapidata.imageItems);
    } else {
      setImagesitem([initialItem]);
    }
  }, [templatedetilaedapidata]);

  const toggleAccordion = (index: number): void => {
    setActiveIndex((prevIndex) => (prevIndex === index ? -1 : index));
  };

  const toggleActiveItems = (index: number): void => {
    validateItem(index);
    setActiveItems((prevIndex) => (prevIndex === index ? -1 : index));
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newItems = [...Imagesitem];
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
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

        if (!response.ok) {
          throw new Error('File upload failed');
        }

        const data = await response.json();
        const fileUrl = data.results.file_path;
        newItems[index].mask = fileUrl;
        newItems[index].preview = filePreview;
        setImagesitem(newItems);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const validateItem = (index: number) => {
    const item = Imagesitem[index];
    const isValid =
      item.itemWidth &&
      item.itemHeight &&
      item.itemLeftMargin &&
      item.itemTopMargin &&
      item.mask;
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [index]: !isValid,
    }));
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
    field: keyof Item
  ) => {
    const newItems = [...Imagesitem];
    newItems[index] = { ...newItems[index], [field]: event.target.value };
    setImagesitem(newItems);
    validateItem(index);
  };

  const addItem = () => {
    setImagesitem((prevItems) => [...prevItems, { ...initialItem }]);
  };

  const deleteItem = (index: number) => {
    const newItems = Imagesitem.filter((_, i) => i !== index);
    setImagesitem(newItems);
    if (activeItems === index) {
      setActiveItems(0);
    }
  };

  return (
    <div className="space-y-2">
      <div className="rounded-[10px] bg-[#F4F5F6] font-bold border-gray-300 dark:border-meta-4 dark:bg-meta-4 px-5 font-dm text-[16px] dark:text-[#fff]">
        <div
          className="flex h-[50px] cursor-pointer items-center justify-between"
          onClick={() => toggleAccordion(0)}
        >
          <span className="md:text-[17.5px] font-semibold text-black dark:text-white">
            Image Items
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
            {Imagesitem.map((item, index) => (
              <div
                key={index}
                className="rounded-[10px] bg-white dark:border-strokedark dark:bg-boxdark px-5 font-dm text-[16px] font-semibold dark:text-[#fff] mb-4"
              >
                <div
                  className="flex h-[48px] cursor-pointer items-center justify-between"
                  onClick={() => toggleActiveItems(index)}
                >
                  <span className="text-[16px] font-semibold text-[#1B254B] dark:text-[#fff]">
                    Image Item {index + 1}
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
                  <div className="pb-6">
                    <div className="mt-4 flex">
                      <div className="relative flex pb-5">
                        <div className="relative">
                          <label htmlFor={`coverFileInput-${index}`}>
                            {item.preview && item.mask ? (
                              <img
                                src={
                                  item.preview ||
                                  ` https://collage-maker.trippleapps.com/${item.mask}`
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
                            htmlFor={`coverFileInput-${index}`}
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
                          id={`coverFileInput-${index}`}
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
                      <div className="w-full sm:w-1/3 px-2 mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Item Width
                        </label>
                        <input
                          type="text"
                          required
                          id={`itemWidth${index}`}
                          value={item.itemWidth}
                          onChange={(e) =>
                            handleInputChange(e, index, 'itemWidth')
                          }
                          className="w-full px-3 py-2 text-sm leading-tight text-gray-700 bg-gray-100 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                        />
                      </div>

                      <div className="w-full sm:w-1/3 px-2 mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Item Height
                        </label>
                        <input
                          type="text"
                          required
                          id={`itemHeight${index}`}
                          value={item.itemHeight}
                          onChange={(e) =>
                            handleInputChange(e, index, 'itemHeight')
                          }
                          className="w-full px-3 py-2 text-sm leading-tight text-gray-700 bg-gray-100 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                        />
                      </div>

                      <div className="w-full sm:w-1/3 px-2 mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Item Left Margin
                        </label>
                        <input
                          type="text"
                          required
                          id={`itemLeftMargin${index}`}
                          value={item.itemLeftMargin}
                          onChange={(e) =>
                            handleInputChange(e, index, 'itemLeftMargin')
                          }
                          className="w-full px-3 py-2 text-sm leading-tight text-gray-700 bg-gray-100 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                        />
                      </div>

                      <div className="w-full sm:w-1/3 px-2 mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Item Top Margin
                        </label>
                        <input
                          type="text"
                          required
                          id={`itemTopMargin${index}`}
                          value={item.itemTopMargin}
                          onChange={(e) =>
                            handleInputChange(e, index, 'itemTopMargin')
                          }
                          className="w-full px-3 py-2 text-sm leading-tight text-gray-700 bg-gray-100 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                        />
                      </div>

                      <div className="w-full sm:w-1/3 px-2 mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Item Right Margin
                        </label>
                        <input
                          type="text"
                          required
                          id={`itemRightMargin${index}`}
                          value={item.itemRightMargin}
                          onChange={(e) =>
                            handleInputChange(e, index, 'itemRightMargin')
                          }
                          className="w-full px-3 py-2 text-sm leading-tight text-gray-700 bg-gray-100 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                        />
                      </div>

                      <div className="w-full sm:w-1/3 px-2 mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Item Bottom Margin
                        </label>
                        <input
                          type="text"
                          required
                          id={`itemBottomMargin${index}`}
                          value={item.itemBottomMargin}
                          onChange={(e) =>
                            handleInputChange(e, index, 'itemBottomMargin')
                          }
                          className="w-full px-3 py-2 text-sm leading-tight text-gray-700 bg-gray-100 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                        />
                      </div>

                      <div className="w-full sm:w-1/3 px-2 mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Rotated
                        </label>
                        <input
                          type="text"
                          required
                          id={`rotated${index}`}
                          value={item.rotated}
                          onChange={(e) =>
                            handleInputChange(e, index, 'rotated')
                          }
                          className="w-full px-3 py-2 text-sm leading-tight text-gray-700 bg-gray-100 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                        />
                      </div>
                    </div>

                    <button
                      className="mt-4 bg-red-500 text-white py-2 px-4 rounded"
                      onClick={() => deleteItem(index)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
            <button
              className="mt-4 bg-green-500 text-white py-2 px-4 rounded"
              onClick={addItem}
            >
              Add New Image Item
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditImgaeitem;
