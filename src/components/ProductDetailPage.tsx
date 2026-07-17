import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Product } from "../products";
import { ArrowLeft, CheckCircle2, AlertTriangle, MessageSquare, Phone } from "lucide-react";

interface ProductDetailPageProps {
  lang: "en" | "mm";
  t: any;
  formatPrice: (price: string | number, lang: "en" | "mm") => string;
  products: Product[];
}

export default function ProductDetailPage({ 
  lang, 
  t, 
  formatPrice,
  products
}: ProductDetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const product = products.find((p) => p.id === Number(id));

  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);

  // Selected state for size and flavor variants
  const [selectedSize, setSelectedSize] = useState<string>(() => {
    if (product?.variants && product.variants.length > 0) {
      return product.variants[0].size;
    }
    return "";
  });

  const [selectedFlavor, setSelectedFlavor] = useState<string>(() => {
    if (product?.variants && product.variants.length > 0) {
      const firstVariant = product.variants[0];
      if (firstVariant.flavors && firstVariant.flavors.length > 0) {
        return firstVariant.flavors[0];
      }
    }
    return "";
  });

  // Prevent scroll when lightbox modal is active
  useEffect(() => {
    if (fullScreenImage) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [fullScreenImage]);

  // If product not found
  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-2xl font-display font-bold text-slate-800 mb-4">
          {lang === "en" ? "Product Not Found" : "ပစ္စည်းကို ရှာမတွေ့ပါ။"}
        </h2>
        <Link 
          to="/" 
          className="inline-flex items-center space-x-2 bg-brand-500 hover:bg-brand-600 text-white font-bold px-6 py-3 rounded-full transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === "en" ? "Back to Products" : "ပစ္စည်းများစာရင်းသို့ ပြန်သွားရန်"}</span>
        </Link>
      </div>
    );
  }

  const productName = lang === "mm" ? product.nameMm : product.nameEn;
  const productImages = [product.image, product.image2].filter(Boolean) as string[];

  // Resolve current active variant, displayed price, and available flavors
  const currentVariant = product.variants.find((v) => v.size === selectedSize) || product.variants[0];
  const displayedPrice = currentVariant ? currentVariant.price : "0 MMK";
  const formattedPrice = formatPrice(displayedPrice, lang);
  const availableFlavors = currentVariant?.flavors || [];

  // Handle active size selection changes cleanly
  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
    const newVariant = product.variants.find((v) => v.size === size);
    if (newVariant?.flavors && newVariant.flavors.length > 0) {
      // If currently selected flavor is not available in the new size variant, select the first one
      if (!newVariant.flavors.includes(selectedFlavor)) {
        setSelectedFlavor(newVariant.flavors[0]);
      }
    } else {
      setSelectedFlavor("");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Back Button */}
      <div className="mb-8">
        <Link 
          to="/" 
          className="inline-flex items-center space-x-2 text-slate-500 hover:text-slate-800 font-semibold text-sm transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === "en" ? "Back to Products" : "ပစ္စည်းများစာရင်းသို့ ပြန်သွားရန်"}</span>
        </Link>
      </div>

      {/* Main presentation grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm relative overflow-hidden">
        
        {/* Left column: Image gallery representation with thumbnails */}
        <div className="flex flex-col space-y-4">
          {/* Main Active Image Viewer */}
          <div 
            onClick={() => setFullScreenImage(productImages[activeImageIndex] || product.image)}
            className="relative aspect-square overflow-hidden rounded-2xl bg-slate-50 border border-slate-100/60 shadow-sm group cursor-pointer"
          >
            <img 
              src={productImages[activeImageIndex] || product.image} 
              alt={`${productName} view ${activeImageIndex + 1}`} 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-all duration-300 transform scale-100 hover:scale-105"
            />
            
            {/* Stock Status Badge */}
            <div className="absolute top-4 left-4">
              {product.inStock ? (
                <span className="inline-flex items-center gap-1.5 bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-sm uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  {t.inStock}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 bg-rose-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-sm uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4" />
                  {t.outOfStock}
                </span>
              )}
            </div>
          </div>

          {/* Interactive Thumbnails Gallery */}
          {productImages.length > 1 && (
            <div className={`grid gap-3 ${productImages.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
              {productImages.map((imgSrc, index) => {
                const isActive = activeImageIndex === index;
                return (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`relative aspect-square rounded-xl overflow-hidden bg-slate-50 border cursor-pointer transition-all duration-200 group ${
                      isActive 
                        ? "border-brand-500 ring-2 ring-brand-500/20 scale-102 shadow-sm" 
                        : "border-slate-200/60 hover:border-slate-300"
                    }`}
                  >
                    <img 
                      src={imgSrc} 
                      alt={`${productName} thumbnail ${index + 1}`} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    {/* Subtle hover overlay */}
                    <div className={`absolute inset-0 bg-black/5 transition-opacity duration-200 ${isActive ? "opacity-0" : "opacity-0 group-hover:opacity-100"}`} />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right column: Details, interactive variant selections & traditional orders */}
        <div className="flex flex-col justify-between space-y-6">
          
          {/* Title & Price section */}
          <div>
            <span className="text-xs font-mono font-bold text-brand-500 uppercase tracking-widest bg-brand-50 px-3 py-1.5 rounded-full border border-brand-100">
              {product.category}
            </span>
            <h1 className="text-xl sm:text-3xl font-display font-bold text-slate-900 mt-4 leading-tight">
              {productName}
            </h1>
            
            <div className="mt-4 flex items-baseline space-x-2">
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                {t.priceLabel}:
              </span>
              <span className="text-2xl sm:text-3xl font-display font-black text-brand-500">
                {formattedPrice}
              </span>
            </div>
          </div>

          {/* Interactive Variant Selection */}
          <div className="space-y-6 pt-6 border-t border-slate-100">
            
            {/* Size selection */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-3">
                <label className="block text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-widest">
                  {lang === "en" ? "Select Size" : "ဆိုဒ်/ပမာဏ ရွေးချယ်ရန်"}
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => {
                    const isSelected = selectedSize === v.size;
                    return (
                      <button
                        key={v.size}
                        onClick={() => handleSizeChange(v.size)}
                        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer border ${
                          isSelected
                            ? "bg-brand-500 text-white shadow-md shadow-brand-500/10 scale-105 border-brand-500"
                            : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 border border-slate-200/50"
                        }`}
                      >
                        {v.size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Flavor selection */}
            {availableFlavors.length > 0 && (
              <div className="space-y-3">
                <label className="block text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-widest">
                  {lang === "en" ? "Select Flavor" : "အနံ့/အရသာ ရွေးချယ်ရန်"}
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableFlavors.map((flavor) => {
                    const isSelected = selectedFlavor === flavor;
                    return (
                      <button
                        key={flavor}
                        onClick={() => setSelectedFlavor(flavor)}
                        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer border ${
                          isSelected
                            ? "bg-brand-500 text-white shadow-md shadow-brand-500/10 scale-105 border-brand-500"
                            : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 border border-slate-200/50"
                        }`}
                      >
                        {flavor}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

          {/* Checkout section */}
          <div className="pt-6 border-t border-slate-100 space-y-4">
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {lang === "en" ? "Order & Checkout Options" : "မှာယူရန် နည်းလမ်းများ"}
              </h3>
              
              {/* Traditional ordering block */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Viber Order Link */}
                <a 
                  href={`viber://chat?number=%2B959402571785&draft=${encodeURIComponent(
                    `Hi My Protein, I want to order ${productName}${selectedSize ? ` (Size: ${selectedSize})` : ""}${selectedFlavor ? ` (Flavor: ${selectedFlavor})` : ""} for ${formattedPrice}.`
                  )}`}
                  className="inline-flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-3 rounded-2xl shadow-md shadow-purple-600/10 transition-all duration-200"
                >
                  <MessageSquare className="w-4.5 h-4.5 shrink-0" />
                  <span className="text-xs">Order via Viber</span>
                </a>

                {/* Call Order Link */}
                <a 
                  href="tel:+959402571785"
                  className="inline-flex items-center justify-center space-x-2 bg-slate-950 hover:bg-slate-850 text-white font-bold px-4 py-3 rounded-2xl shadow-md transition-all duration-200"
                >
                  <Phone className="w-4.5 h-4.5 shrink-0" />
                  <span className="text-xs">{lang === "en" ? "Call to Order" : "ဖုန်းဖြင့် မှာယူရန်"}</span>
                </a>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Lightbox / Full-screen Image Modal */}
      {fullScreenImage && (
        <div 
          onClick={() => setFullScreenImage(null)}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 sm:p-8"
        >
          {/* Touch-friendly Close Button */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setFullScreenImage(null);
            }}
            className="absolute top-4 right-4 text-white text-3xl sm:text-4xl p-2 cursor-pointer hover:text-slate-300 font-bold transition-colors duration-200"
            aria-label="Close image viewer"
          >
            &times;
          </button>

          {/* Full-screen Responsive Image */}
          <img 
            src={fullScreenImage} 
            alt={productName} 
            referrerPolicy="no-referrer"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
            className="max-h-full max-w-full object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}

    </div>
  );
}
