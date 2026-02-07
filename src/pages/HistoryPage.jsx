import { useTranslation } from "react-i18next";
import useDeviceType from "../hook/useDeviceType";

const HistoryPage = () => {
  const { t, i18n } = useTranslation();
  const fontClass = {
    en: "font-en",
    la: "font-lao",
    ko: "font-kr",
  }[i18n.language];
  const historyItems = [
    {
      year: 2025,
      events: [
        `${t("history.2025_line3")}`,
        `${t("history.2025_line2")}`,
        `${t("history.2025_line1")}`,

      ],
    },
    {
      year: 2024,
      events: [
        `${t("history.2024_line6")}`,
        `${t("history.2024_line5")}`,
        `${t("history.2024_line4")}`,
        `${t("history.2024_line3")}`,
        `${t("history.2024_line2")}`,
        `${t("history.2024_line1")}`,
      ],
    },
    {
      year: 2023,
      events: [
        `${t("history.2023_line4")}`,
        `${t("history.2023_line3")}`,
        `${t("history.2023_line2")}`,
        `${t("history.2023_line1")}`,
      ],
    },
    {
      year: 2020,
      events: [
        `${t("history.2020_line3")}`,
        `${t("history.2020_line2")}`,
        `${t("history.2020_line1")}`
      ],
    },
  ]

    const deviceType = useDeviceType();
  const getContentWidth = () => {
    if (deviceType === 'desktop') return 'desktopWidth';
    if (deviceType === 'tablet') return 'templetWidth';
    return 'mobileWidth'; // mobile
  };

  return (
    <div className={`bg-white ${fontClass}`}>
      <div className={`${getContentWidth()} ${deviceType === 'mobile' ? 'w-full' : ''} widthfixed mx-auto px-4 py-6`}>
        {/* <h1 className="text-center text-xl mb-8">{t("about.history")}</h1> */}
        <br />
        <div className="space-y-12 mb-12">
          {/* {historyItems.map((item, index) => (
            <div key={index} className="flex">
              <div className="w-1/4 pr-6">
                <h2 className="text-3xl font-bold text-blue-500">{item.year}</h2>
              </div>
              <div className="w-3/4 space-y-4">
                {item.events.map((event, eventIndex) => (
                  <div key={eventIndex} className="flex">
                    <div className="mr-2">•</div>
                    <div className="text-sm">{event}</div>
                  </div>
                ))}
              </div>
            </div>
          ))} */}

          <img src="../webimage/history.png" alt="iater history" className="" />
        </div>


      </div>
    </div>
  )
}

export default HistoryPage
