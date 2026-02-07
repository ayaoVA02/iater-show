import React from 'react'
import { useTranslation } from 'react-i18next'
import { BiRefresh } from 'react-icons/bi'
import { BsFileText } from 'react-icons/bs'
import useDeviceType from '../hook/useDeviceType';

function Noblogs() {
    const { t, i18n } = useTranslation();

    const fontClass = {
        en: "font-en",
        la: "font-lao",
        ko: "font-kr",
    }[i18n.language]
    const deviceType = useDeviceType();

    const getContentWidth = () => {
        if (deviceType === 'desktop') return 'desktopWidth';
        if (deviceType === 'tablet') return 'templetWidth';
        return 'mobileWidth'; // mobile
    };
    return (
        <div className={`${fontClass} ${getContentWidth()} px-4 w-[1224px] mx-auto`}>

            <div className="flex  flex-col  items-center justify-center min-h-96 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-12">
                {/* Icon */}
                <div className="mb-6">
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                        <BsFileText className="w-10 h-10 text-gray-400" />
                    </div>
                </div>

                {/* Main Content */}
                <div className="text-center max-w-md">
                    <h3 className="text-xl font-semibold text-gray-400 mb-3">
                        {t('noblogs.title')}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-8">
                        {t('noblogs.description')}
                    </p>

                    {/* Action Button */}
                    <div className="flex justify-center">
                        <button className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-md border border-gray-300 transition-colors duration-200" onClick={() => window.location.reload()}>
                            <BiRefresh className="w-4 h-4 mr-2" />
                            {t('noblogs.refreshButton')}
                        </button>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="mt-8 pt-6 border-t border-gray-200 w-full max-w-md">
                    <div className="text-center">
                        <p className="text-xs text-gray-400 mb-2"> {t('noblogs.whatCando.whatCando')}</p>
                        <div className="flex flex-wrap justify-center gap-2">
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                {t('noblogs.whatCando.option1')}
                            </span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                {t('noblogs.whatCando.option2')}
                            </span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                {t('noblogs.whatCando.option3')}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Noblogs