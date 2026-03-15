import { useState, useEffect } from 'react';
import useDeviceType from '../hook/useDeviceType';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const TABS = { EDUCATION: 0, RESEARCH: 1, CREATIVE: 2 };

const TAB_KEYS = {
  [TABS.EDUCATION]: 'education',
  [TABS.RESEARCH]: 'research',
  [TABS.CREATIVE]: 'creative',
};

const ITEM_COUNTS = {
  [TABS.EDUCATION]: 4,
  [TABS.RESEARCH]: 5,
  [TABS.CREATIVE]: 3,
};


const AIResearchTabs = () => {
  const [searchParam] = useSearchParams();
  const initialTab = parseInt(searchParam.get('tab')) || TABS.EDUCATION;
  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(false);
  const { t, i18n } = useTranslation();
  const deviceType = useDeviceType();
  const isMobileDevice = deviceType === 'mobile';

  // Simulate async tab switch (for loading spinner UX)
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const tabKey = TAB_KEYS[activeTab];
  const itemCount = ITEM_COUNTS[activeTab];

  const navIcons = [
    { id: TABS.EDUCATION, src: '/webimage/cores1.png' },
    { id: TABS.RESEARCH,  src: '/webimage/cores2.png' },
    { id: TABS.CREATIVE,  src: '/webimage/cores3.png' },
  ];

  const getContentWidth = () => {
    if (deviceType === 'desktop') return 'desktopWidth';
    if (deviceType === 'tablet') return 'templetWidth';
    return 'mobileWidth';
  };
  const fontClass = {
    en: "font-en",
    la: "font-lao",
    ko: "font-kr",
  }[i18n.language];
  return (
    <div className={`${getContentWidth()} mx-auto rounded-lg mt-[1rem] mb-[4rem] ${isMobileDevice ? 'px-2' : 'px-6'} ${fontClass}` }>
      <h1 className={`${isMobileDevice ? 'text-2xl' : 'text-5xl'} font-bold mb-8 text-[#105691]`}>
        {t('home.aboutMenuItems3')}
      </h1>

      <div className={`flex flex-col md:flex-row ${isMobileDevice ? 'items-center' : ''}`}>
        {/* Sidebar */}
        <div className={`p-4 flex md:flex-col justify-center md:justify-start items-center space-y-0 md:space-y-6 space-x-3 md:space-x-0 border-b ${isMobileDevice ? 'w-full' : ''}`}>
          {navIcons.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`${isMobileDevice ? 'p-2' : 'p-3'} rounded-lg transition-all duration-300 ${
                activeTab === item.id
                  ? 'bg-blue-100'
                  : 'border border-gray-300 hover:bg-gray-100'
              }`}
              aria-label={`Tab ${item.id}`}
            >
              <img
                src={item.src}
                className={
                  activeTab === item.id
                    ? isMobileDevice ? 'w-16 h-16' : 'w-32 h-32'
                    : isMobileDevice ? 'w-8 h-8' : 'w-10 h-10'
                }
                alt=""
              />
            </button>
          ))}
        </div>

        {/* Content */}
        <div className={`flex-1 ${isMobileDevice ? 'w-full' : ''}`}>
          {loading ? (
            <div className="flex items-center justify-center min-h-[220px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
            </div>
          ) : (
            <div className={`space-y-6 ${isMobileDevice ? 'px-2' : 'px-4'}`}>
              <div className={`space-y-6 bg-blue-50 rounded-lg p-4 w-full max-w-[900px] ${isMobileDevice ? 'mx-auto' : ''}`}>
                {/* Heading */}
                <p className="text-gray-800 mb-6">
                  {t(`ai_research.${tabKey}.heading`)}
                </p>

                {/* Items list */}
                <ul className="space-y-3 pl-5 list-disc">
                  {Array.from({ length: itemCount }, (_, i) => i + 1).map((num) => (
                    <li key={num} className="space-y-1 text-gray-700">
                      <span className="font-semibold text-gray-800">
                        {t(`ai_research.${tabKey}.item${num}_title`)}:
                      </span>{' '}
                      {t(`ai_research.${tabKey}.item${num}_desc`)}
                    </li>
                  ))}
                </ul>

                {/* Description */}
                <p className="text-gray-800 mt-6">
                  {t(`ai_research.${tabKey}.description`)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIResearchTabs;