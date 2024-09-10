import React, { useState, useEffect } from 'react';
import ukflag from './falgicon/united-kingdom.png';
import German from './falgicon/circle.png';
import china from './falgicon/china.png';
import Bangali from './falgicon/bangladesh.png';
import franch from './falgicon/france.png';
import indonesia from './falgicon/indonesia-flag.png';
import iran from './falgicon/iran.png';
import italy from './falgicon/italy (1).png';
import japan from './falgicon/japan.png';
import korea from './falgicon/south-korea.png';
import portugal from './falgicon/portugal.png';
import russia from './falgicon/russia.png';
import saudi from './falgicon/saudi-arabia.png';
import turkey from './falgicon/turkey.png';
import danmark from './falgicon/flag.png';
import malyshian from './falgicon/flag (1).png';
import netherland from './falgicon/flag (3).png';
import thialand from './falgicon/flag (4).png';
import spain from './falgicon/spain.png';
import hindi from './falgicon/flag (6).png';
import sv from './falgicon/sweden-flag.png';
import ku from './falgicon/flag (2).png';
import iw from './falgicon/flag (7).png';
import { useMyContext } from '../../contextapi/MyProvider';
import toast, { Toaster } from 'react-hot-toast';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditcategoryModal: React.FC<AddCategoryModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const { instance, Categoryid, detailedCategory } = useMyContext();

  // Initialize state
  const [isorder, setIsorder] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [isActive, setIsActive] = useState(false); // Change from string to boolean
  const [isFeatured, setIsFeatured] = useState(false);

  // Update state when detailedCategory changes

  const toggleDropdown = () => setIsorder(!isorder);
  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setIsorder(false);
  };

  const ordervalue = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  const options = [
    { value: 'en', label: <img src={ukflag} width="24" alt="UK Flag" /> },
    { value: 'de', label: <img src={German} width="24" alt="German Flag" /> },
    { value: 'zh', label: <img src={china} width="24" alt="China Flag" /> },
    { value: 'bn', label: <img src={Bangali} width="24" alt="Bengali Flag" /> },
    { value: 'fr', label: <img src={franch} width="24" alt="French Flag" /> },
    {
      value: 'in',
      label: <img src={indonesia} width="24" alt="Indonesian Flag" />,
    },
    { value: 'fa', label: <img src={iran} width="24" alt="Iran Flag" /> },
    { value: 'it', label: <img src={italy} width="24" alt="Italy Flag" /> },
    { value: 'ja', label: <img src={japan} width="24" alt="Japan Flag" /> },
    { value: 'ko', label: <img src={korea} width="24" alt="Korea Flag" /> },
    {
      value: 'pt',
      label: <img src={portugal} width="24" alt="Portugal Flag" />,
    },
    { value: 'ru', label: <img src={russia} width="24" alt="Russia Flag" /> },
    {
      value: 'ar',
      label: <img src={saudi} width="24" alt="Saudi Arabia Flag" />,
    },
    { value: 'tr', label: <img src={turkey} width="24" alt="Turkey Flag" /> },
    { value: 'da', label: <img src={danmark} width="24" alt="Denmark Flag" /> },
    {
      value: 'ms',
      label: <img src={malyshian} width="24" alt="Malaysia Flag" />,
    },
    {
      value: 'nl',
      label: <img src={netherland} width="24" alt="Netherlands Flag" />,
    },
    {
      value: 'th',
      label: <img src={thialand} width="24" alt="Thailand Flag" />,
    },
    { value: 'es', label: <img src={spain} width="24" alt="Spain Flag" /> },
    { value: 'hi', label: <img src={hindi} width="24" alt="India Flag" /> },
    { value: 'sv', label: <img src={sv} width="24" alt="Sweden Flag" /> },
    { value: 'ku', label: <img src={ku} width="24" alt="Kurdistan Flag" /> },
    { value: 'iw', label: <img src={iw} width="24" alt="Israel Flag" /> },
  ];

  const [inputs, setInputs] = useState(
    options.map((option) => ({
      lang: option.value,
      langLabel: option.label,
      title: '',
    }))
  );

  useEffect(() => {
    if (detailedCategory) {
      setIsActive(detailedCategory.is_active === '1');
      setIsFeatured(detailedCategory.is_featured === '1');
      setSelectedOption(detailedCategory.category_order || '');
      setInputs((prevInputs) =>
        prevInputs.map((input) => ({
          ...input,
          title: detailedCategory[input.lang] || '',
        }))
      );
    }
  }, [detailedCategory]);

  const handleInputChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newInputs = [...inputs];
    newInputs[index].title = event.target.value;
    setInputs(newInputs);
  };

  const handleAddCategory = async () => {
    if (inputs[0].title.trim() === '') {
      toast.error('The first English language field must be filled.');
      return;
    }

    const body = {
      category_order: selectedOption,
      is_featured: isFeatured ? 1 : 0,
      is_active: isActive ? 1 : 0,
      cat_id: Categoryid,
      ...options.reduce((acc, option) => {
        const input = inputs.find((input) => input.lang === option.value);
        acc[option.value] = input ? input.title : '';
        return acc;
      }, {} as Record<string, string>),
    };

    const payload = { body };

    try {
      const response = await instance.post('/category/addedit', payload);
      console.log('Category added successfully:', response.data);
      toast.success('Category added successfully!');
      onClose();
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="fixed inset-0 z-50 overflow-auto bg-[#414444]  bg-opacity-5 dark:bg-[#13151E] dark:bg-opacity-5 flex ">
        <div className="relative py-4 px-2 bg-white dark:bg-boxdark w-full max-w-md m-auto flex-col flex rounded-lg">
          <div className="flex justify-between px-2 mb-3">
            <div className="flex items-center">
              <h1 className="text-[16px] text-[#000] dark:text-white font-bold mb-4">
                Edit Category
              </h1>
            </div>
            <div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-800"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="px-2 flex items-center">
            <div>
              <label className="inline-flex items-center cursor-pointer">
                <span className="text-[14px] text-[#000] dark:text-white font-bold mr-2 ">
                  is_Active
                </span>
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={isActive}
                  onChange={() => setIsActive(!isActive)}
                />
                <div className="relative w-11 h-6 bg-[#E2E8F0] rounded-full  dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full  after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-[#ff7896]   after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#E11D48]"></div>
              </label>
            </div>
            <div className="ml-3">
              <label className="inline-flex items-center cursor-pointer">
                <span className="text-[14px] text-[#000] dark:text-white font-bold mr-2 ">
                  is_Featured
                </span>
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={isFeatured}
                  onChange={() => setIsFeatured(!isFeatured)}
                />
                <div className="relative w-11 h-6 bg-[#E2E8F0] rounded-full  dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full  after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-[#ff7896]   after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#E11D48]"></div>
              </label>
            </div>
          </div>

          <div className=" mb-4">
            <div className="w-full mt-3 mb-3 px-2">
              <label className="block mb-2 text-sm font-bold text-black dark:text-white">
                Category Order
              </label>
              {/* {isorder && ( */}
              <div className="relative">
                <div
                  className="w-full cursor-pointer resize-none rounded-[10px] border border-[#B8BAC7] bg-white p-2.5 text-[16px] font-normal text-[#1B254B] placeholder-gray-500 dark:border-meta-4 dark:bg-meta-4 dark:text-white dark:placeholder-white flex items-center justify-between"
                  onClick={toggleDropdown}
                >
                  <input
                    className="w-full bg-transparent outline-none"
                    type="text"
                    placeholder="Select an option"
                    value={selectedOption}
                    readOnly
                  />
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 transform-gpu ${
                      isorder ? 'rotate-0' : 'rotate-90'
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
                {isorder && (
                  <ul className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg dark:bg-meta-4">
                    {ordervalue.map((option) => (
                      <li
                        key={option}
                        className="cursor-pointer px-4 py-2 text-[#1B254B] hover:bg-gray-200 hover:bg-gray dark:text-white dark:hover:bg-[#614cbb]"
                        onClick={() => handleOptionClick(option)}
                      >
                        {option}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {/* )} */}
            </div>
          </div>

          <div className="flex flex-col px-2">
            <div className="flex items-center justify-between">
              <h1 className="text-[14px] text-[#000] dark:text-white font-bold">
                Titles
              </h1>
              <h1 className="text-[14px] text-[#000] dark:text-white font-bold mr-[20px]">
                Languages
              </h1>
            </div>
            <div className="max-h-[494px] overflow-y-scroll">
              {inputs.map((input, index) => (
                <div key={index} className="mt-[10px] flex items-center mr-2">
                  <div className="w-4/5 flex flex-col">
                    <input
                      type="text"
                      placeholder="Add Title"
                      value={input.title}
                      onChange={(e) => handleInputChange(index, e)}
                      className="block w-full resize-none rounded-[10px] border border-[#B8BAC7] bg-white p-2.5 text-[16px] font-normal text-[#1B254B] dark:border-meta-4 dark:bg-meta-4 dark:text-white dark:placeholder-[#fff]"
                    />
                  </div>
                  <div className="w-1/5 flex items-center justify-center ml-[10px]">
                    <span className="w-full flex resize-none rounded-[10px] border border-[#B8BAC7] bg-white p-2.5 text-[16px] font-normal text-[#1B254B] dark:border-meta-4 dark:bg-meta-4 dark:text-white dark:placeholder-[#fff]">
                      {input.langLabel}
                      <span className="ml-3">{input.lang}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center mb-2 mt-4">
              <button
                type="submit"
                onClick={handleAddCategory}
                className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-[#E11D48] to-[#ff7896] py-2 px-6 text-center font-medium text-white hover:bg-opacity-90"
              >
                Add Category
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditcategoryModal;
