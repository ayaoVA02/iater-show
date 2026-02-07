import { useState, useEffect } from 'react';

import { BiBrain } from 'react-icons/bi';
import { CgPullClear } from 'react-icons/cg';
import useDeviceType from '../hook/useDeviceType';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Types for our data structure
const TABS = {
  EDUCATION: 0,
  RESEARCH: 1,
  CREATIVE: 2
};

// This would typically come from a database
const fetchContentFromDB = async (tabId) => {
  // Simulating API call to database
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(tabContents[tabId]);
    }, 300);
  });
};

// Content data structure (would be in a database in a real application)
const tabContents = {
  [TABS.EDUCATION]: {
    icon: <img src='/webimage/cores1.png' className="w-24 h-24" />,
    title: "AI 전문 인재양성",
    subtitle: "AI and IT Education Programs",
    content: [
      {
        heading: "iATER는 AI 및 IT 분야의 글로벌 인재를 양성하기 위해, 다음과 같은 체계적인 교육 프로그램을 운영하고 있습니다.",
        items: [
          {
            title: "AI 및 머신러닝 전문가 과정",
            description: "머신러닝, 딥러닝, 자연어 처리(NLP), 컴퓨터 비전 등 AI 핵심 기술 교육"
          },
          {
            title: "소프트웨어 개발 및 프로그래밍 교육",
            description: "Python, JavaScript, 클라우드 컴퓨팅, 데이터 엔지니어링 등"
          },
          {
            title: "AI × 분야 융합 교육",
            description: "AI를 다양한 산업과 융합하여 창의적인 문제 해결 능력을 갖춘 인재 육성"
          },
          {
            title: "산업 연계 프로젝트 및 실전 교육",
            description: "기업과 협력하여 실무 중심의 연구 프로젝트 수행"
          }
        ],
        des: '자원이 부족한 국가에서도 AI 및 IT 인재를 양성할 수 있도록, 온라인 및 오프라인을 결합한 하이브리드 교육 시스템을 구축하고 있으며, ChatGPT 및 AI 기반 교육 도구를 활용하여 보다 효율적인 학습 환경을 제공하고 있습니다.'
      },

    ]
  },
  [TABS.RESEARCH]: {
    icon: <CgPullClear className="w-12 h-12" />,
    title: "연구 개발(R&D) 및 핵심 기술 연구",
    subtitle: "Research & Development and Core Technologies",
    content: [
      {
        heading: "iATER는 AI 및 IT 관련 연구개발(R&D)을 통해, 최신 기술을 탐구하고 실용적인 혁신을 창출하는 데 주력하고 있습니다.",
        items: [
          {
            title: "AI 및 머신러닝 연구 ",
            description: "AI 알고리즘 최적화, 자동화 학습 시스템, 강화학습(RL) 연구"
          },
          {
            title: "자연어 처리(NLP) 및 생성형 AI 연구",
            description: "ChatGPT, AI 번역기, 음성 인식, AI 기반 콘텐츠 생성"
          },
          {
            title: "데이터 과학 및 빅데이터 연구",
            description: "데이터 분석, 예측 모델링, 스마트 도시(Smart City) 기술 연구"
          },
          {
            title: "AI+예술 & 엔터테인먼트 연구",
            description: "AI 기반 애니메이션 제작, AI 아트 생성, 실시간 렌더링 기술"
          },
          {
            title: "로보틱스 및 자동화 연구",
            description: "AI 로봇 개발, 자율주행 기술, 스마트 공장(Factories of the Future)"
          }
        ]
        ,
        des: '이러한 연구는 단순한 이론 연구에 그치지 않고, 실제 산업 및 사회적 문제 해결을 위한 응용 연구로 연결되며, 연구 결과는 라오스 및 글로벌 기업과 협력하여 상용화될 수 있도록 지원하고 있습니다.'

      },

    ]
  },
  [TABS.CREATIVE]: {
    icon: <BiBrain className="w-12 h-12" />,
    title: "AI + 창의산업",
    subtitle: "AI + Creative Industries",
    content: [
      {
        heading: "iATER는 AI 기술이 예술 및 창의적인 분야에서도 혁신을 이끌어낼 수 있다는 점에 주목하고 있습니다. AI 기반 애니메이션 제작, 멀티미디어 콘텐츠 개발, 그리고 창의적인 디자인 기술을 활용하여, 라오스의 젊은 예술가들이 디지털 시대에 더욱 창의적인 작업을 할 수 있도록 지원하고 있습니다.",
        items: [
          {
            title: "AI 애니메이션 및 캐릭터 디자인",
            description: "AI 기반 이미지 생성, 가상 캐릭터 애니메이션, 3D 모델링"
          },
          {
            title: "AI 기반 음악 및 사운드 디자인",
            description: "AI 작곡, 음성 합성 기술, AI 기반 오디오 제작$ • 가상현실(VR) 및 증강현실(AR) 연구: AI와 결합된 몰입형경험 개발"
          },
          {
            title: "AI 영상 처리 및 자동화 기술",
            description: "AI 기반 자동 편집, 실시간 그래픽 생성, 딥러닝기반 영상 합성"
          },

        ]
        ,
        des: '특히, 애니메이션과 게임 개발을 위한 AI 활용을 연구하며, AI 기반의 실시간 그래픽 생성, 캐릭터 동작 자동화, 스토리텔링보조 시스템 등을 적극적으로 도입하고 있습니다. 이를 통해, 창작자들은 더 짧은 시간 내에 더욱 창의적이고 몰입감있는 작품을 만들 수 있습니다. '
      },


    ]
  }
};

// Main component
const AIResearchTabs = () => {
  const [searchParam] = useSearchParams();
  const initialTab = parseInt(searchParam.get('tab')) || TABS.EDUCATION;
  const [activeTab, setActiveTab] = useState(initialTab);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();

  // Icons for navigation
  const navIcons = [
    { id: TABS.EDUCATION, icon: <img src='/webimage/cores1.png' className={` ${activeTab === TABS.EDUCATION ? 'w-32 h-32' : 'w-10 h-10'} `} /> },
    { id: TABS.RESEARCH, icon: <img src='/webimage/cores2.png' className={` ${activeTab === TABS.RESEARCH ? 'w-32 h-32' : 'w-10 h-10'} `} /> },
    { id: TABS.CREATIVE, icon: <img src='/webimage/cores3.png' className={` ${activeTab === TABS.CREATIVE ? 'w-32 h-32' : 'w-10 h-10'} `} /> }
  ];

  // Fetch content when tab changes (simulating database fetch)
  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      const data = await fetchContentFromDB(activeTab);
      setContent(data);
      setLoading(false);
    };

    loadContent();
  }, [activeTab]);


  const deviceType = useDeviceType();
  const getContentWidth = () => {
    if (deviceType === 'desktop') return 'desktopWidth';
    if (deviceType === 'tablet') return 'templetWidth';
    return 'mobileWidth'; // mobile
  };

  return (
    <div className={`${getContentWidth()} mx-auto rounded-lg  mt-[1rem] mb-[4rem] px-6 `}>
      {/* Main content area with sidebar */}
      <h1 className="text-5xl font-bold mb-8 text-[#105691]">{t("home.aboutMenuItems3")}</h1>

      <div className="flex flex-col md:flex-row ">
        {/* Sidebar navigation */}
        <div className={` p-4 flex md:flex-col justify-center md:justify-start items-center space-y-0 md:space-y-6 space-x-4 md:space-x-0 border-b `}>
          {navIcons.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`p-3 rounded-lg transition-all duration-300 ${activeTab === item.id
                ? 'bg-blue-100 '
                : 'border border-gray-300 hover:bg-gray-100'
                }`}
              aria-label={`Tab ${item.id}`}
            >
              {item.icon}
            </button>
          ))}
        </div>

        {/* Content area */}
        <div className="flex-1 ">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : content ? (
            <div className={` space-y-6 px-4`}>


              <div className="space-y-6 bg-blue-50 rounded-lg p-4 w-[900px]">
                {content.content.map((section, idx) => (
                  <div key={idx} className="space-y-4">
                    <p className="text-gray-800  mb-12">{section.heading}</p>

                    <ul className="space-y-3 pl-5 list-disc">
                      {section.items.map((item, itemIdx) => (
                        <li key={itemIdx} className="space-y-1 text-gray-700">
                          <span className="font-semibold text-gray-800">{item.title}:</span> {item.description}
                        </li>
                      ))}
                    </ul>


                    <p className='text-gray-800  mt-12'>{section.des}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">No content available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIResearchTabs;