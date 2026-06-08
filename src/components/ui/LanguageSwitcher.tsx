import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, ChevronDown } from 'lucide-react'

const languages = [
  { 
    code: 'en', 
    name: 'English', 
    native: 'English',
    flag: '🇬🇧' 
  },
  { 
    code: 'ar', 
    name: 'Arabic', 
    native: 'العربية',
    flag: '🇸🇦' 
  },
  { 
    code: 'ur', 
    name: 'Urdu', 
    native: 'اردو',
    flag: '🇵🇰' 
  },
]

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const currentLang = languages.find(
    l => l.code === i18n.language
  ) || languages.find(l => l.code === 'en') || languages[0]

  const handleChange = (code: string) => {
    i18n.changeLanguage(code)
    localStorage.setItem('musaLang', code)
    document.documentElement.dir = ['ar', 'ur'].includes(code) ? 'rtl' : 'ltr'
    document.documentElement.lang = code
    setIsOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)){
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 md:gap-2 px-2.5 py-1.5 md:px-4 md:py-2 rounded-full border border-[rgba(176, 228, 204,0.35)] bg-transparent transition-all duration-300 hover:bg-[rgba(176, 228, 204,0.08)] focus:outline-none"
      >
        <div className="flex items-center gap-1.5 md:gap-2 text-[#B0E4CC]">
          <Globe className="w-3 h-3 md:w-[15px] md:h-[15px]" />
          <span className="text-[11px] md:text-[13px] font-semibold text-white tracking-wide font-body uppercase">
            {currentLang.code}
          </span>
        </div>
        <ChevronDown 
          className={`hidden md:block w-3 h-3 text-[#B0E4CC] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="absolute z-[999] top-[calc(100%+8px)] ltr:right-0 rtl:left-0 bg-[#0F1E1C] border border-[rgba(64,138,113,0.20)] rounded-[14px] md:rounded-2xl p-1.5 md:p-2 shadow-[0_8px_32px_rgba(14, 17, 17,0.4)] w-[150px] md:min-w-[170px]"
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleChange(lang.code)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 md:px-4 md:py-3 rounded-xl transition-all duration-200 hover:bg-[#163026] text-start ${i18n.language === lang.code ? 'bg-[rgba(176, 228, 204,0.08)]' : ''}`}
              >
                <span className="text-lg md:text-xl shrink-0">{lang.flag}</span>
                <div className="flex-1 overflow-hidden">
                  <div className={`text-[13px] md:text-[14px] font-medium font-body truncate ${i18n.language === lang.code ? 'text-[#B0E4CC]' : 'text-[#F0FFF8]'}`}>
                    {lang.name}
                  </div>
                  <div className="text-[10px] md:text-[11px] text-[#7ABFA0] font-body mt-0.5 truncate">
                    {lang.native}
                  </div>
                </div>
                {i18n.language === lang.code && (
                  <div className="w-1.5 h-1.5 rounded-full bg-[#B0E4CC] flex-shrink-0" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
