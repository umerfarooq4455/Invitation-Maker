import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { useMyContext } from '../../contextapi/MyProvider';

interface Item {
  text: string;
  itemLeftMargin: string;
  itemTopMargin: string;
  itemRightMargin: string;
  itemBottomMargin: string;
  rotated: string;
  fontId?: string;
  fontName?: string;
  fontUrl?: string;
  textColor: string;
  textSize: string;
  textAlignment: string;
  letterSpacing: string;
}

interface Font {
  fontId: string | undefined;
  fontName: string;
  fontPath: string;
}

const TextItems = forwardRef((props, ref) => {
  const { instance, textsitems, setTextsitems } = useMyContext();
  const [fontlist, setFontlist] = useState<Font[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activeItems, setActiveItems] = useState<number | null>(null);

  useImperativeHandle(ref, () => ({
    validate: () => {
      let isValid = true;
      textsitems.forEach((item, index) => {
        if (
          !item.text ||
          !item.itemLeftMargin ||
          !item.itemTopMargin ||
          !item.itemRightMargin ||
          !item.itemBottomMargin ||
          !item.rotated ||
          !item.textColor ||
          !item.textSize ||
          !item.textAlignment ||
          !item.letterSpacing
        ) {
          toggleAccordion(0);
          toggleActiveItems(0);
          document.getElementById(`itemWidth${index}`)?.focus();
          isValid = false;
          return;
        }
      });

      return isValid;
    },
  }));

  const toggleAccordion = (index: number): void => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const toggleActiveItems = (index: number): void => {
    setActiveItems((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    field: keyof Item
  ) => {
    const { value } = e.target;
    const newItems = [...textsitems];
    newItems[index][field] = value;
    setTextsitems(newItems);
  };

  useEffect(() => {
    fontGetlist();
  }, []);

  const fontGetlist = async () => {
    try {
      const response = await instance.get<{ results: Font[] }>('/font/list');
      const fonts = response.data.results.map((font) => ({
        fontId: font.fontId,
        fontName: font.fontName,
        fontPath: font.fontPath,
      }));
      setFontlist(fonts);
    } catch (err) {
      console.error('Error fetching fonts:', err);
    }
  };

  const addItem = () => {
    setTextsitems((prevItems) => [
      ...prevItems,
      {
        text: '',
        itemLeftMargin: '',
        itemTopMargin: '',
        itemRightMargin: '',
        itemBottomMargin: '',
        rotated: '0',
        textColor: '',
        textSize: '',
        textAlignment: '',
        letterSpacing: '',
        fontId: 'defaultFontId', // Provide default or valid values
        fontName: 'defaultFontName',
        fontUrl: 'defaultFontUrl',
      },
    ]);
  };

  const deleteItem = (index: number) => {
    setTextsitems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  // Handle change event for font selection
  const handleFontChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
    index: number
  ) => {
    const selectedFontId = event.target.value;
    const selectedFont = fontlist.find(
      (font) => font.fontId === selectedFontId
    );

    if (selectedFont) {
      const newItems = [...textsitems];
      newItems[index].fontId = selectedFont.fontId;
      newItems[index].fontName = selectedFont.fontName;
      newItems[index].fontUrl = selectedFont.fontPath;
      setTextsitems(newItems);
    }
  };

  return (
    <div className="space-y-2">
      <div className="rounded-[10px]   dark:border-meta-4 dark:bg-meta-4 bg-[#F4F5F6] px-5 font-dm text-[16px] font-semibold  dark:text-[#fff]">
        <div
          className="flex h-[50px] cursor-pointer items-center justify-between"
          onClick={() => toggleAccordion(0)}
        >
          <span className=" md:text-[17.5px]  font-semibold text-black dark:text-white">
            Text Items
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
            {textsitems.map((item, index) => (
              <div
                key={index}
                className="rounded-[10px] bg-[#fff]  dark:border-strokedark dark:bg-boxdark px-5 font-dm text-[16px] font-bold   dark:text-[#fff] mb-4"
              >
                <div
                  className="flex h-[48px] cursor-pointer items-center justify-between"
                  onClick={() => toggleActiveItems(index)}
                >
                  <span className="text-[16px] font-bold text-[#1B254B] dark:text-[#fff]">
                    Text Item {index + 1}
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
                          htmlFor={`text${index}`}
                        >
                          Text
                        </label>
                        <div className="relative">
                          <input
                            className="block w-full resize-none rounded-[10px] border border-[#B8BAC7] bg-white px-3 py-2.5 text-[16px] font-normal text-[#1B254B] dark:border-meta-4 dark:bg-meta-4 dark:text-white dark:placeholder-[#fff]"
                            type="text"
                            id={`text${index}`}
                            placeholder="Text"
                            value={item.text}
                            required
                            onChange={(e) =>
                              handleInputChange(e, index, 'text')
                            }
                          />
                        </div>
                      </div>
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
                            placeholder="Item Left Margin"
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
                    </div>
                    <div className="flex flex-wrap -mx-2 md:mt-4">
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
                      <div className="w-full sm:w-1/3 px-2">
                        <label
                          className="block mb-2 text-sm font-bold text-black dark:text-white"
                          htmlFor={`rotated${index}`}
                        >
                          Rotated
                        </label>
                        <div className="relative">
                          <input
                            className="block w-full resize-none rounded-[10px] border border-[#B8BAC7] bg-white px-3 py-2.5 text-[16px] font-normal text-[#1B254B] dark:border-meta-4 dark:bg-meta-4 dark:text-white dark:placeholder-[#fff]"
                            type="number"
                            id={`rotated${index}`}
                            placeholder="Rotated"
                            value={item.rotated}
                            onChange={(e) =>
                              handleInputChange(e, index, 'rotated')
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap -mx-2 md:mt-4">
                      <div className="w-full sm:w-1/3 px-2">
                        <label
                          className="block mb-2 text-sm font-bold text-black dark:text-white"
                          htmlFor={`textColor${index}`}
                        >
                          Text Color
                        </label>
                        <div className="relative">
                          <input
                            className="block w-full resize-none rounded-[10px] border border-[#B8BAC7] bg-white px-3 py-2.5 text-[16px] font-normal text-[#1B254B] dark:border-meta-4 dark:bg-meta-4 dark:text-white dark:placeholder-[#fff]"
                            type="text"
                            id={`textColor${index}`}
                            placeholder="Text Color"
                            required
                            value={item.textColor}
                            onChange={(e) =>
                              handleInputChange(e, index, 'textColor')
                            }
                          />
                        </div>
                      </div>
                      <div className="w-full sm:w-1/3 px-2">
                        <label
                          className="block mb-2 text-sm font-bold text-black dark:text-white"
                          htmlFor={`textSize${index}`}
                        >
                          Text Size
                        </label>
                        <div className="relative">
                          <input
                            className="block w-full resize-none rounded-[10px] border border-[#B8BAC7] bg-white px-3 py-2.5 text-[16px] font-normal text-[#1B254B] dark:border-meta-4 dark:bg-meta-4 dark:text-white dark:placeholder-[#fff]"
                            type="text"
                            id={`textSize${index}`}
                            placeholder="Text Size"
                            required
                            value={item.textSize}
                            onChange={(e) =>
                              handleInputChange(e, index, 'textSize')
                            }
                          />
                        </div>
                      </div>
                      <div className="w-full sm:w-1/3 px-2">
                        <label
                          className="block mb-2 text-sm font-bold text-black dark:text-white"
                          htmlFor={`textAlignment${index}`}
                        >
                          Text Alignment
                        </label>
                        <div className="relative">
                          <input
                            className="block w-full resize-none rounded-[10px] border border-[#B8BAC7] bg-white px-3 py-2.5 text-[16px] font-normal text-[#1B254B] dark:border-meta-4 dark:bg-meta-4 dark:text-white dark:placeholder-[#fff]"
                            type="text"
                            id={`textAlignment${index}`}
                            placeholder="Text Alignment"
                            required
                            value={item.textAlignment}
                            onChange={(e) =>
                              handleInputChange(e, index, 'textAlignment')
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap -mx-2 md:mt-4">
                      <div className="w-full sm:w-1/3 px-2">
                        <label
                          className="block mb-2 text-sm font-bold text-black dark:text-white"
                          htmlFor={`letterSpacing${index}`}
                        >
                          Letter Spacing
                        </label>
                        <div className="relative">
                          <input
                            className="block w-full resize-none rounded-[10px] border border-[#B8BAC7] bg-white px-3 py-2.5 text-[16px] font-normal text-[#1B254B] dark:border-meta-4 dark:bg-meta-4 dark:text-white dark:placeholder-[#fff]"
                            type="text"
                            id={`letterSpacing${index}`}
                            placeholder=" Letter Spacing"
                            value={item.letterSpacing}
                            onChange={(e) =>
                              handleInputChange(e, index, 'letterSpacing')
                            }
                          />
                        </div>
                      </div>
                      <div className="w-full sm:w-1/3 px-2">
                        <label
                          className="block mb-2 text-sm font-bold text-black dark:text-white"
                          htmlFor={`fontSelect${index}`}
                        >
                          Font
                        </label>
                        <select
                          className="block w-full resize-none rounded-[10px] border border-[#B8BAC7] bg-white px-3 py-2.5 text-[16px] font-normal text-[#1B254B] dark:border-meta-4 dark:bg-meta-4 dark:text-white"
                          id={`fontSelect${index}`}
                          onChange={(e) => handleFontChange(e, index)}
                        >
                          <option value="">Select Font</option>
                          {fontlist.map((font) => (
                            <option key={font.fontId} value={font.fontId}>
                              {font.fontName}
                            </option>
                          ))}
                        </select>
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
                )}
              </div>
            ))}
            <div className="flex py-4">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-[10px] bg-gradient-to-r from-[#E11D48] to-[#ff7896] py-2 px-6 text-center font-medium text-white hover:bg-opacity-90"
                onClick={addItem}
              >
                Add Text Items
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default TextItems;
