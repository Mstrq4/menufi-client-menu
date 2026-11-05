
import React, { useState, useEffect } from 'react';
import { Product, Language, ProductOption, Allergen } from '../lib/types';
import { X, Plus, Minus, Flame, Check, Ban, Wheat, Milk, Nut, Egg, Bean, Circle, ChevronDown } from 'lucide-react';
import { TRANSLATIONS } from '../lib/constants';
import { RiyalSymbol } from './Icons';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, selectedAddOns: string[], selectedCustomizations: string[], selectedSize?: ProductOption, selectedSide?: ProductOption, selectedDrink?: ProductOption) => void;
  language: Language;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose, onAddToCart, language }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [selectedCustomizations, setSelectedCustomizations] = useState<string[]>([]);
  
  // New Selection States
  const [selectedSize, setSelectedSize] = useState<ProductOption | undefined>(undefined);
  const [selectedSide, setSelectedSide] = useState<ProductOption | undefined>(undefined);
  const [selectedDrink, setSelectedDrink] = useState<ProductOption | undefined>(undefined);

  const [isClosing, setIsClosing] = useState(false);
  const [animateTotal, setAnimateTotal] = useState(false);
  const t = TRANSLATIONS[language];

  useEffect(() => {
    if (isOpen && product) {
      setQuantity(1);
      setSelectedAddOns([]);
      setSelectedCustomizations([]);
      setIsClosing(false);
      
      // Default Selections
      if (product.sizes && product.sizes.length > 0) {
        const defaultSize = product.sizes.find(s => s.id === 'medium' || s.id === 'regular') || product.sizes[0];
        setSelectedSize(defaultSize);
      } else {
        setSelectedSize(undefined);
      }

      if (product.sideOptions && product.sideOptions.length > 0) {
        setSelectedSide(product.sideOptions[0]);
      } else {
        setSelectedSide(undefined);
      }

      if (product.drinkOptions && product.drinkOptions.length > 0) {
         setSelectedDrink(product.drinkOptions[0]);
      } else {
        setSelectedDrink(undefined);
      }

      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen, product]);

  useEffect(() => {
    setAnimateTotal(true);
    const timer = setTimeout(() => setAnimateTotal(false), 300);
    return () => clearTimeout(timer);
  }, [quantity, selectedAddOns, selectedSize, selectedSide, selectedDrink, selectedCustomizations]);

  if (!product || !isOpen) return null;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  const toggleAddOn = (id: string) => {
    setSelectedAddOns(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleCustomization = (id: string) => {
    setSelectedCustomizations(prev => 
        prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const calculateTotal = () => {
    let total = product.price;
    
    if (selectedSize) total += selectedSize.price;
    if (selectedSide) total += selectedSide.price;
    if (selectedDrink) total += selectedDrink.price;

    const addOnsTotal = product.addOns?.reduce((sum, addon) => {
      return selectedAddOns.includes(addon.id) ? sum + addon.price : sum;
    }, 0) || 0;
    
    const customsTotal = product.customizations?.reduce((sum, custom) => {
        return selectedCustomizations.includes(custom.id) ? sum + custom.price : sum;
    }, 0) || 0;

    return (total + addOnsTotal + customsTotal) * quantity;
  };

  const getName = (item: any) => language === 'en' && item.nameEn ? item.nameEn : item.name;
  const getDesc = (item: Product) => language === 'en' && item.descriptionEn ? item.descriptionEn : item.description;

  const AllergenIcon = ({ type }: { type: Allergen }) => {
    const icons = {
      gluten: <Wheat size={16} />,
      dairy: <Milk size={16} />,
      nuts: <Nut size={16} />,
      eggs: <Egg size={16} />,
      soy: <Bean size={16} />,
      sesame: <Circle size={16} className="dotted" />,
      mustard: <Ban size={16} />,
    };
    return icons[type] || <Ban size={16} />;
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}>
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      ></div>

      <div 
        className={`bg-white dark:bg-dark-900 w-full max-w-2xl sm:rounded-[2rem] rounded-t-[2rem] shadow-2xl overflow-hidden transform transition-all duration-300 flex flex-col h-[90vh] sm:h-auto sm:max-h-[90vh] ${isClosing ? 'translate-y-full sm:scale-95 opacity-0' : 'animate-slide-up'}`}
      >
        {/* Header Image Area */}
        <div className="relative h-56 sm:h-64 shrink-0">
            <img 
                src={product.image} 
                alt={getName(product)} 
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            
            <button 
              onClick={handleClose}
              className="absolute top-4 rtl:left-4 ltr:right-4 bg-black/30 hover:bg-black/50 text-white p-2.5 rounded-full backdrop-blur-md transition-colors z-10"
            >
              <X size={24} />
            </button>

            {/* Product Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-black mb-2 shadow-black drop-shadow-md">{getName(product)}</h2>
                        <div className="flex items-center gap-3">
                            <span className="bg-gold text-maroon font-bold px-3 py-1 rounded-full text-sm shadow-lg flex items-center gap-1">
                                {product.price} <RiyalSymbol className="w-3 h-3 fill-current" />
                            </span>
                            {product.calories && (
                                <div className="flex items-center text-white text-xs font-bold bg-black/40 px-3 py-1 rounded-full backdrop-blur-md">
                                    <Flame size={14} className="mr-1 fill-orange-500 text-orange-500" />
                                    {product.calories} {t.calories}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar bg-gray-50 dark:bg-dark-900 relative -mt-4 rounded-t-[2rem]">
          <div className="p-6 space-y-8">
            
            {/* Description */}
            <div className="bg-white dark:bg-dark-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-700">
                 <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{getDesc(product)}</p>
            </div>

            {/* 1. Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-maroon rounded-full"></span>
                    {t.chooseSize}
                  </h3>
                  <span className="text-xs text-white bg-red-500 font-bold px-2 py-1 rounded-md">{t.required}</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {product.sizes.map(size => {
                    const isSelected = selectedSize?.id === size.id;
                    return (
                      <button
                        key={size.id}
                        onClick={() => setSelectedSize(size)}
                        className={`relative flex flex-col items-center p-3 rounded-2xl border-2 transition-all duration-200 ${
                            isSelected 
                            ? 'border-maroon bg-white dark:bg-dark-800 shadow-md scale-[1.02]' 
                            : 'border-transparent bg-white dark:bg-dark-800 shadow-sm hover:bg-gray-50 dark:hover:bg-dark-700'
                        }`}
                      >
                        {isSelected && (
                           <div className="absolute top-2 rtl:left-2 ltr:right-2 w-5 h-5 bg-maroon text-white rounded-full flex items-center justify-center shadow-sm"><Check size={12} strokeWidth={4} /></div>
                        )}
                        {/* Optional: Show size specific image if different, otherwise maybe just icon or text */}
                        <div className="text-sm font-bold text-gray-900 dark:text-white mt-2">{getName(size)}</div>
                        {size.price > 0 && <span className="text-xs text-maroon font-bold mt-1">+{size.price}</span>}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* 4. Side Options (Moved up for flow) */}
            {product.sideOptions && product.sideOptions.length > 0 && (
              <div className="animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-maroon rounded-full"></span>
                    {t.chooseSide}
                  </h3>
                  <span className="text-xs text-white bg-red-500 font-bold px-2 py-1 rounded-md">{t.required}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.sideOptions.map(side => {
                    const isSelected = selectedSide?.id === side.id;
                    return (
                      <button
                        key={side.id}
                        onClick={() => setSelectedSide(side)}
                        className={`relative flex items-center p-3 rounded-2xl border-2 transition-all duration-200 ${
                            isSelected 
                            ? 'border-maroon bg-white dark:bg-dark-800 shadow-md' 
                            : 'border-transparent bg-white dark:bg-dark-800 shadow-sm hover:bg-gray-50 dark:hover:bg-dark-700'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 rtl:ml-3 ltr:mr-0 ${isSelected ? 'border-maroon bg-maroon' : 'border-gray-300 dark:border-gray-600'}`}>
                            {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                        </div>
                        <div className="w-14 h-14 rounded-xl shadow-sm bg-white dark:bg-white p-1 flex items-center justify-center border border-gray-100 overflow-hidden">
                             <img src={side.image} className="w-full h-full object-contain" alt={getName(side)} />
                        </div>
                        <div className="flex flex-col items-start px-3">
                          <span className="text-sm font-bold text-gray-900 dark:text-white">{getName(side)}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{side.price > 0 ? `+${side.price} ${t.currency}` : ''}</span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* 5. Drink Options */}
            {product.drinkOptions && product.drinkOptions.length > 0 && (
              <div className="animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-maroon rounded-full"></span>
                    {t.chooseDrink}
                  </h3>
                  <span className="text-xs text-white bg-red-500 font-bold px-2 py-1 rounded-md">{t.required}</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {product.drinkOptions.map(drink => {
                    const isSelected = selectedDrink?.id === drink.id;
                    return (
                      <button
                        key={drink.id}
                        onClick={() => setSelectedDrink(drink)}
                        className={`relative flex flex-col items-center p-2 sm:p-3 rounded-2xl border-2 transition-all duration-200 ${
                            isSelected 
                            ? 'border-maroon bg-white dark:bg-dark-800 shadow-md scale-[1.02]' 
                            : 'border-transparent bg-white dark:bg-dark-800 shadow-sm hover:bg-gray-50 dark:hover:bg-dark-700'
                        }`}
                      >
                        <div className="w-14 h-14 rounded-xl bg-white p-1 mb-2 flex items-center justify-center">
                           <img src={drink.image} className="w-full h-full object-contain" alt={getName(drink)} />
                        </div>
                        <span className="text-xs font-bold text-gray-800 dark:text-gray-200 text-center leading-tight">{getName(drink)}</span>
                        {drink.price > 0 && <span className="text-[10px] text-maroon font-bold mt-1">+{drink.price}</span>}
                        
                        {isSelected && (
                           <div className="absolute top-2 right-2 bg-maroon text-white rounded-full p-0.5 shadow"><Check size={10} strokeWidth={4} /></div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

             {/* 2. Customizations (Preferences) */}
             {product.customizations && product.customizations.length > 0 && (
              <div className="animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-gold rounded-full"></span>
                    {t.preferences}
                  </h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium bg-gray-100 dark:bg-dark-700 px-2 py-1 rounded-md">{t.optional}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                   {product.customizations.map(custom => {
                     const isSelected = selectedCustomizations.includes(custom.id);
                     return (
                       <button key={custom.id} 
                            onClick={() => toggleCustomization(custom.id)}
                            className={`flex items-center p-2 rounded-xl border transition-all cursor-pointer group ${
                                isSelected 
                                ? 'border-maroon bg-maroon/5 dark:bg-maroon/10' 
                                : 'border-transparent bg-white dark:bg-dark-800 shadow-sm'
                            }`}
                       >
                           <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${isSelected ? 'bg-maroon border-maroon' : 'border-gray-300 dark:border-gray-600 group-hover:border-maroon'}`}>
                               {isSelected && <Check size={12} className="text-white" strokeWidth={4} />}
                           </div>
                           <div className="mx-3 w-10 h-10 shrink-0 bg-white dark:bg-white rounded-lg p-1 border border-gray-100 shadow-sm">
                                <img src={custom.image} className="w-full h-full object-contain" alt={getName(custom)} />
                           </div>
                           <span className={`font-bold text-xs text-start ${isSelected ? 'text-maroon' : 'text-gray-700 dark:text-gray-300'}`}>{getName(custom)}</span>
                       </button>
                     )
                   })}
                </div>
              </div>
            )}

            {/* 3. Add-ons (Paid) */}
            {product.addOns && product.addOns.length > 0 && (
              <div className="animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-gold rounded-full"></span>
                    {t.addons}
                  </h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium bg-gray-100 dark:bg-dark-700 px-2 py-1 rounded-md">{t.optional}</span>
                </div>
                <div className="space-y-3">
                   {product.addOns.map(addon => {
                     const isSelected = selectedAddOns.includes(addon.id);
                     return (
                       <button key={addon.id} 
                            onClick={() => toggleAddOn(addon.id)}
                            className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                                isSelected 
                                ? 'border-maroon bg-maroon/5 dark:bg-maroon/10 shadow-inner' 
                                : 'border-transparent bg-white dark:bg-dark-800 shadow-sm hover:bg-gray-50 dark:hover:bg-dark-700'
                            }`}
                       >
                          <div className="flex items-center gap-4">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-maroon bg-maroon' : 'border-gray-300 dark:border-gray-600'}`}>
                              {isSelected && <Check size={14} className="text-white" strokeWidth={3} />}
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-white dark:bg-white flex items-center justify-center p-1 border border-gray-100 shadow-sm">
                                <img src={addon.image} className="w-full h-full object-contain" alt={getName(addon)} />
                            </div>
                            <span className="font-bold text-gray-800 dark:text-gray-200 text-sm">{getName(addon)}</span>
                          </div>
                          <span className="text-sm font-bold text-maroon bg-maroon/5 px-3 py-1 rounded-lg">+{addon.price} <span className="text-[10px]">{t.currency}</span></span>
                       </button>
                     )
                   })}
                </div>
              </div>
            )}

            {/* 6. Allergens */}
            {product.allergens && product.allergens.length > 0 && (
               <div className="py-6 border-t border-gray-100 dark:border-dark-700 mt-4">
                  <h3 className="font-bold text-gray-800 dark:text-gray-200 text-sm mb-3 flex items-center gap-2">
                      <div className="bg-gray-200 dark:bg-dark-700 p-1 rounded-md"><Ban size={14} /></div>
                      {t.allergens}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                     {product.allergens.map((allergen) => (
                       <div key={allergen} className="flex items-center gap-1.5 bg-gray-100 dark:bg-dark-700 border border-gray-200 dark:border-dark-600 px-3 py-1.5 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300">
                          <AllergenIcon type={allergen} />
                          <span>{t[allergen] || allergen}</span>
                       </div>
                     ))}
                  </div>
               </div>
            )}
            
            <div className="h-24"></div>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-dark-800 border-t border-gray-100 dark:border-dark-700 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-4 pb-6 z-20">
          <div className="flex gap-4 max-w-2xl mx-auto">
            <div className="flex items-center bg-gray-100 dark:bg-dark-700 rounded-2xl px-1 h-14 shrink-0">
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 bg-white dark:bg-dark-600 rounded-xl text-gray-800 dark:text-white shadow-sm flex items-center justify-center hover:bg-gray-50 dark:hover:bg-dark-500 active:scale-95 transition-all"
              >
                <Plus size={20} />
              </button>
              <span className="w-10 text-center font-black text-xl text-gray-800 dark:text-white">{quantity}</span>
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-all active:scale-95 ${quantity === 1 ? 'bg-gray-200 dark:bg-dark-800 text-gray-400' : 'bg-white dark:bg-dark-600 text-gray-800 dark:text-white hover:bg-gray-50'}`}
                disabled={quantity === 1}
              >
                <Minus size={20} />
              </button>
            </div>
            
            <button
              onClick={() => {
                onAddToCart(product, quantity, selectedAddOns, selectedCustomizations, selectedSize, selectedSide, selectedDrink);
                handleClose();
              }}
              className="flex-1 bg-maroon hover:bg-maroon-light text-white rounded-2xl font-bold text-lg shadow-lg shadow-maroon/30 active:scale-[0.98] transition-all flex items-center justify-between px-6 h-14 overflow-hidden relative group"
            >
              <span className="relative z-10 group-hover:translate-x-1 transition-transform">{t.addToCart}</span>
              <span className={`relative z-10 bg-white/20 px-3 py-1.5 rounded-xl backdrop-blur-sm transition-transform duration-300 font-black flex items-center gap-1 ${animateTotal ? 'scale-110 text-gold' : 'scale-100'}`}>
                {calculateTotal().toFixed(2)} <RiyalSymbol className="w-3.5 h-3.5 fill-current mt-0.5" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
