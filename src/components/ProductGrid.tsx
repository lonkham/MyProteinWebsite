import { useState } from "react";
import { Link } from "react-router-dom";
import { Product } from "../products";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ProductGridProps {
  lang: "en" | "mm";
  t: any;
  formatPrice: (price: string | number, lang: "en" | "mm") => string;
  products: Product[];
}

// Numerical Digit Translator Utility
function toMyanmarDigits(str: string): string {
  const mmDigits: Record<string, string> = {
    "0": "၀", "1": "၁", "2": "၂", "3": "၃", "4": "၄",
    "5": "၅", "6": "၆", "7": "၇", "8": "၈", "9": "၉"
  };
  return str.replace(/[0-9]/g, (digit) => mmDigits[digit] || digit);
}

export default function ProductGrid({ lang, t, formatPrice, products }: ProductGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 12;

  const categories = ["All", "Protein Powder", "Mass Gainer", "Amino Acids", "Creatine", "Pre-Workout", "Fat-Burner", "Supplement", "Accessories"];

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "All": return t.all;
      case "Protein Powder": return t.protein;
      case "Mass Gainer": return t.massGainer;
      case "Amino Acids": return t.aminoAcids;
      case "Creatine": return t.creatine;
      case "Pre-Workout": return t.preWorkout;
      case "Fat-Burner": return t.fatBurner;
      case "Supplement": return t.supplement;
      case "Accessories": return t.accessories;
      default: return category;
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const filteredProducts = selectedCategory === "All"
    ? products
    : products.filter(p => p.category === selectedCategory);

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Smooth scroll back to top of product list grid
    const element = document.getElementById("product-gallery-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-8" id="product-gallery-section">
      
      {/* Categories Navigation Bar (Inline selection inside the sub-header section) */}
      <div className="flex items-center overflow-x-auto scrollbar-none pb-2 border-b border-slate-100">
        <div className="flex space-x-2 md:space-x-3 py-1">
          {categories.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`relative px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                  isActive 
                    ? "bg-brand-500 text-white shadow-md shadow-brand-500/10 scale-105" 
                    : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 border border-slate-200/50"
                }`}
              >
                {getCategoryLabel(category)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Gallery Title Heading */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-8 pb-4 border-b border-slate-200/60">
        <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 tracking-tight">
          {t.galleryHeading}
        </h2>
        <span className="text-[10px] sm:text-xs font-mono font-medium text-slate-500 mt-2 sm:mt-0 uppercase tracking-widest bg-slate-50 px-3.5 py-1.5 rounded-full border border-slate-200/60">
          {t.showingItems(filteredProducts.length)}
        </span>
      </div>

      {/* Product Grid Layout */}
      <motion.div 
        layout 
        className="grid grid-cols-2 gap-3 sm:gap-6 md:gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        <AnimatePresence mode="popLayout">
          {paginatedProducts.map((p: Product) => {
            const productName = lang === "mm" ? p.nameMm : p.nameEn;
            const defaultPrice = p.variants && p.variants.length > 0 ? p.variants[0].price : "0 MMK";
            const formattedPrice = formatPrice(defaultPrice, lang);

            return (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="h-full"
              >
                <Link
                  to={`/product/${p.id}`}
                  className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-slate-100 hover:border-slate-200/80 transition-all duration-300 flex flex-col justify-between h-full shadow-sm hover:shadow-md cursor-pointer"
                >
                  {/* Image Holder */}
                  <div className="relative aspect-square overflow-hidden bg-slate-50">
                    <img 
                      src={p.image} 
                      alt={productName} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Stock Status Badge */}
                    <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                      {p.inStock ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-500 text-white font-bold text-[9px] sm:text-xs px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-md sm:rounded-lg shadow-sm uppercase tracking-wider">
                          <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          {t.inStock}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-rose-500 text-white font-bold text-[9px] sm:text-xs px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-md sm:rounded-lg shadow-sm uppercase tracking-wider">
                          <AlertTriangle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          {t.outOfStock}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Core Details (STRICTLY name, price, stock badge) */}
                  <div className="p-3 sm:p-4 md:p-5 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="font-display font-bold text-slate-800 text-xs sm:text-sm md:text-base leading-snug group-hover:text-brand-500 transition-colors duration-200 line-clamp-2 h-8 sm:h-10 md:h-12">
                        {productName}
                      </h3>
                    </div>

                    <div className="mt-2 sm:mt-4 pt-2 sm:pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-slate-400 text-[9px] sm:text-[10px] md:text-xs font-semibold uppercase tracking-wider">
                        {t.priceLabel}
                      </span>
                      <span className="font-display font-black text-brand-500 text-xs sm:text-base md:text-lg">
                        {formattedPrice}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Pagination UI Control Bar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 pt-12 pb-6 border-t border-slate-100">
          {/* Previous Button */}
          <button
            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed transition-all duration-200 cursor-pointer flex items-center space-x-1"
          >
            <span>&larr;</span>
            <span>{lang === "en" ? "Previous" : "ရှေ့သို့"}</span>
          </button>

          {/* Page Numbers */}
          <div className="flex items-center space-x-1.5">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              const isPageActive = currentPage === page;
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center transition-all duration-200 cursor-pointer ${
                    isPageActive
                      ? "bg-brand-500 text-white shadow-md shadow-brand-500/10 scale-105"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60"
                  }`}
                >
                  {lang === "mm" ? toMyanmarDigits(page.toString()) : page}
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed transition-all duration-200 cursor-pointer flex items-center space-x-1"
          >
            <span>{lang === "en" ? "Next" : "နောက်သို့"}</span>
            <span>&rarr;</span>
          </button>
        </div>
      )}

      {/* Empty state fallback */}
      {filteredProducts.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-24"
        >
          <p className="text-slate-400 font-medium">No items found matching the selection.</p>
        </motion.div>
      )}
    </div>
  );
}
