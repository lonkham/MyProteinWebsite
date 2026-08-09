import { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Product } from "./products";
import { Dumbbell, MapPin, ExternalLink, Phone, MessageCircle } from "lucide-react";
import ProductGrid from "./components/ProductGrid";
import ProductDetailPage from "./components/ProductDetailPage";

// Translations Dictionary
const translations = {
  en: {
    storeName: "MY",
    storeBrand: "PROTEIN",
    storeSlogan: "FUEL YOUR POTENTIAL",
    galleryHeading: "Premium Supplements",
    all: "All Products",
    protein: "Protein Powder",
    massGainer: "Mass Gainer",
    aminoAcids: "Amino Acids",
    creatine: "Creatine",
    preWorkout: "Pre-Workout",
    fatBurner: "Fat-Burner",
    supplement: "Supplement",
    accessories: "Accessories",
    inStock: "In Stock",
    outOfStock: "Out of Stock",
    priceLabel: "Price",
    chatPrompt: "Message Us",
    addressLabel: "Store Address",
    addressValue: "69street, Between 40x41 Street, Mandalay",
    contactSectionTitle: "Quick Contacts",
    phoneLabel: "Phone",
    viberLabel: "Viber Chat",
    tiktokLabel: "TikTok Contact",
    footerText: "© 2026 My Protein. All rights reserved.",
    showingItems: (count: number) => `Showing ${count} premium items`,
    viberLabelShort: "Viber",
    phoneLabelShort: "Phone",
  },
  mm: {
    storeName: "MY",
    storeBrand: "PROTEIN",
    storeSlogan: "သင့်ခန္ဓာကိုယ်အလှကို စွမ်းအားမြှင့်တင်ပါ",
    galleryHeading: "အဆင့်မြင့် အားကစားဖြည့်စွက်စာများ",
    all: "ပစ္စည်းအားလုံး",
    protein: "ပရိုတင်းမှုန့်",
    massGainer: "အလေးချိန်တိုးစေသော ဖြည့်စွက်စာများ",
    aminoAcids: "အမိုင်နိုအက်ဆစ်များ",
    creatine: "ခရီတီးန်",
    preWorkout: "ပရီဝေါ့အောက်",
    fatBurner: "အဆီလောင်ကျွမ်းစေသော ဖြည့်စွက်စာများ",
    supplement: "ဖြည့်စွက်စာများ",
    accessories: "ပစ္စည်းများ",
    inStock: "အသင့်ရှိသည်",
    outOfStock: "ပစ္စည်းပြတ်နေသည်",
    priceLabel: "ဈေးနှုန်း",
    chatPrompt: "စကားပြောရန်",
    addressLabel: "ဆိုင်လိပ်စာ",
    addressValue: "၆၉ လမ်း၊ ၄၀ x ၄၁ လမ်းကြား၊ မန္တလေးမြို့။",
    contactSectionTitle: "ဆက်သွယ်ရန်လိပ်စာများ",
    phoneLabel: "ဖုန်းနံပါတ်",
    viberLabel: "ဗိုင်ဘာ ဆက်သွယ်ရန်",
    tiktokLabel: "TikTok ဆက်သွယ်ရန်",
    footerText: "© ၂၀၂၆ My Protein. မူပိုင်ခွင့်အားလုံး ရရှိပြီးဖြစ်သည်။",
    showingItems: (count: number) => `ပစ္စည်းပေါင်း ${toMyanmarDigits(count.toString())} မျိုး ပြသနေသည်`,
    viberLabelShort: "Viber",
    phoneLabelShort: "ဖုန်း",
  }
};

// Numerical Digit Translator Utility
function toMyanmarDigits(str: string): string {
  const mmDigits: Record<string, string> = {
    "0": "၀", "1": "၁", "2": "၂", "3": "၃", "4": "၄",
    "5": "၅", "6": "၆", "7": "၇", "8": "၈", "9": "၉"
  };
  return str.replace(/[0-9]/g, (digit) => mmDigits[digit] || digit);
}

// Price Converter Utility based on Language Selection
function formatPrice(price: string | number, lang: "en" | "mm"): string {
  let priceStr = typeof price === "number" ? price.toLocaleString() + " MMK" : price;
  if (lang === "en") return priceStr;
  let translatedPrice = toMyanmarDigits(priceStr);
  return translatedPrice.replace("MMK", "ကျပ်");
}

export default function App() {
  const [lang, setLang] = useState<"en" | "mm">("en");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const t = translations[lang];

  useEffect(() => {
    let active = true;
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://script.google.com/macros/s/AKfycbwrhzuxIDOnqELm_FrdY9-HvVrzbP04hp99et358m8gsA8uISyNQ-7OF4KuOCfOjCkEZg/exec");
        if (!response.ok) {
          throw new Error("Failed to fetch products from Google Sheets");
        }
        const data = await response.json();
        if (active) {
          setProducts(data);
          setLoading(false);
        }
      } catch (err: any) {
        if (active) {
          setError(err.message || "Something went wrong");
          setLoading(false);
        }
      }
    };
    fetchProducts();
    return () => {
      active = false;
    };
  }, []);

  return (
    <Router>
      <div className="bg-white text-slate-800 min-h-screen flex flex-col font-sans relative selection:bg-brand-500 selection:text-white">
        
        {/* Immersive subtle ambient green glow background */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-brand-500/3 rounded-full blur-[100px] pointer-events-none" />

        {/* Sticky Premium Header / Navbar */}
        <header className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/90 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            
            {/* Logo & Slogan */}
            <div className="flex items-center space-x-3">
              <div className="bg-brand-500 text-white p-2.5 rounded-xl shadow-md shadow-brand-500/10 flex items-center justify-center">
                <Dumbbell className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-display font-black tracking-tighter leading-none text-slate-900">
                  {t.storeName}<span className="text-brand-500">{t.storeBrand}</span>
                </h1>
                <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 tracking-widest uppercase mt-1">
                  {t.storeSlogan}
                </p>
              </div>
            </div>

            {/* Controls (Bilingual Switcher) */}
            <div className="flex items-center space-x-3">
              {/* Bilingual Support Button Switcher */}
              <div className="relative bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200/50 shadow-inner">
                {/* Sliding Indicator */}
                <div 
                  className={`absolute top-1 bottom-1 w-[44px] bg-brand-500 rounded-lg shadow transition-all duration-300 ${
                    lang === "mm" ? "left-[49px]" : "left-1"
                  }`} 
                />
                
                <button 
                  onClick={() => setLang("en")}
                  className={`relative z-10 w-11 h-8 text-xs font-bold uppercase transition-colors duration-200 rounded-lg focus:outline-none cursor-pointer ${
                    lang === "en" ? "text-white" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  EN
                </button>
                <button 
                  onClick={() => setLang("mm")}
                  className={`relative z-10 w-11 h-8 text-xs font-bold uppercase transition-colors duration-200 rounded-lg focus:outline-none cursor-pointer ${
                    lang === "mm" ? "text-white" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  MM
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 z-10">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-100 border-t-brand-500"></div>
              <p className="text-slate-500 font-semibold text-sm animate-pulse">
                {lang === "en" ? "Loading products..." : "ပစ္စည်းများ ရယူနေပါသည်..."}
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
              <div className="bg-red-50 text-red-500 p-4 rounded-full">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                {lang === "en" ? "Failed to Load Products" : "ပစ္စည်းများ ရယူရန် မအောင်မြင်ပါ"}
              </h3>
              <p className="text-xs text-slate-500 max-w-md leading-relaxed">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs rounded-xl shadow-md shadow-brand-500/10 cursor-pointer transition-all duration-200"
              >
                {lang === "en" ? "Try Again" : "ထပ်လုပ်ကြည့်ပါ"}
              </button>
            </div>
          ) : (
            <Routes>
              <Route 
                path="/" 
                element={<ProductGrid lang={lang} t={t} formatPrice={formatPrice} products={products} />} 
              />
              <Route 
                path="/product/:id" 
                element={
                  <ProductDetailPage 
                    lang={lang} 
                    t={t} 
                    formatPrice={formatPrice} 
                    products={products}
                  />
                } 
              />
            </Routes>
          )}
        </main>

        {/* Immersive Footer */}
        <footer className="bg-slate-50 text-slate-500 py-12 border-t border-slate-200/80 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            
            {/* Column 1: Brand details */}
            <div className="flex flex-col items-center md:items-start space-y-3">
              <div className="flex items-center space-x-2">
                <div className="bg-brand-500 text-white p-1.5 rounded-lg flex items-center justify-center">
                  <Dumbbell className="w-4 h-4" />
                </div>
                <span className="font-display font-black text-slate-900 tracking-tight text-sm">
                  {t.storeName}<span className="text-brand-500">{t.storeBrand}</span>
                </span>
              </div>
              <p className="text-[10px] sm:text-xs font-bold text-slate-400 tracking-wider uppercase">
                {t.storeSlogan}
              </p>
            </div>

            {/* Column 2: Address */}
            <div className="flex flex-col items-center md:items-start space-y-2 text-center md:text-left">
              <div className="flex items-center space-x-2 text-slate-700">
                <MapPin className="w-4 h-4 text-brand-500 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-widest">{t.addressLabel}</span>
              </div>
              <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                {t.addressValue}
              </p>
            </div>

            {/* Column 3: TikTok and Social Links */}
            <div className="flex flex-col items-center md:items-start space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-700">{t.contactSectionTitle}</span>
              <div className="flex flex-col space-y-2 w-full max-w-xs">
                {/* Phone Link */}
                <a 
                  href="tel:+959402571785" 
                  className="inline-flex items-center space-x-2 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 hover:border-slate-300 shadow-sm transition-all duration-200"
                >
                  <Phone className="w-4 h-4 text-brand-500 shrink-0" />
                  <span className="truncate">{t.phoneLabel}: +959402571785</span>
                </a>

                {/* Viber Link */}
                <a 
                  href="viber://chat?number=%2B959402571785" 
                  className="inline-flex items-center space-x-2 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 hover:border-slate-300 shadow-sm transition-all duration-200"
                >
                  <MessageCircle className="w-4 h-4 text-purple-600 shrink-0" />
                  <span className="truncate">{t.viberLabel}: +959402571785</span>
                </a>

                {/* TikTok Link */}
                <a 
                  href="https://www.tiktok.com/@myproteinmdy?_r=1&_t=ZS-97zOaEmd4Sr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 hover:border-slate-300 shadow-sm transition-all duration-200"
                >
                  {/* TikTok Icon Svg */}
                  <svg className="w-4 h-4 fill-current shrink-0 text-slate-800" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.09-1.47-.77-.56-1.44-1.27-1.93-2.11-.01 2.92.01 5.84-.02 8.75-.06 1.65-.54 3.34-1.57 4.65-1.4 1.83-3.67 2.86-5.94 2.76-2.31-.1-4.56-1.37-5.71-3.39-1.28-2.22-1.22-5.18.16-7.33 1.25-1.97 3.55-3.08 5.85-2.87.01 1.45.01 2.91.01 4.36-.94-.28-2 .03-2.61.8-.75.95-.51 2.45.51 3.12.98.66 2.45.24 2.88-.87.14-.36.17-.76.17-1.15.02-4.57.01-9.14.02-13.71z"/>
                  </svg>
                  <span className="truncate">@myproteinmdy</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-60 ml-auto shrink-0" />
                </a>
              </div>
            </div>

          </div>

          {/* Legal copyright footer portion */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-6 border-t border-slate-200/60 text-center">
            <p className="text-xs text-slate-400">
              {t.footerText}
            </p>
          </div>
        </footer>

        {/* Floating Action Button (FAB): Facebook Messenger Icon */}
        <a 
          href="https://m.me/100063802520545" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="fixed bottom-6 right-6 z-50 group flex items-center" 
          aria-label="Contact us on Messenger"
        >
          {/* Pulsing Back Ring */}
          <span className="absolute inline-flex h-full w-full rounded-full bg-[#0084FF] opacity-30 animate-ping -z-10"></span>
          
          {/* Sliding tooltip (visible on desktop hover) */}
          <span className="mr-3 bg-[#0084FF] text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xl opacity-0 translate-x-4 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 hidden md:inline-block">
            {t.chatPrompt}
          </span>
          
          {/* Floating icon body */}
          <div className="bg-[#0084FF] hover:bg-[#0072db] active:scale-95 transition-all duration-200 text-white p-4 rounded-2xl shadow-xl shadow-[#0084FF]/20 flex items-center justify-center">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C6.36 2 2 6.13 2 11.7c0 3.22 1.41 6.07 3.65 7.91V23l3.22-1.77c1 .28 2.05.42 3.13.42 5.64 0 10-4.13 10-9.7C22 6.13 17.64 2 12 2zm1.24 12.57l-2.45-2.61-4.79 2.61 5.27-5.59 2.5 2.61 4.74-2.61-5.27 5.59z"/>
            </svg>
          </div>
        </a>
      </div>
    </Router>
  );
}
