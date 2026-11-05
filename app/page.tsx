"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { CartItem, Product, ServiceType, Language, ProductOption } from '../lib/types';
import { MENU_ITEMS, CATEGORIES, TRANSLATIONS, LANDING_BG, CUSTOMER_REVIEWS } from '../lib/constants';
import ServiceSelection from '../components/ServiceSelection';
import ProductModal from '../components/ProductModal';
import CartDrawer from '../components/CartDrawer';
// Dashboard component removed as it will be a separate app/route
import { ShoppingCart, Search, Globe, Sparkles, Moon, Sun, MapPin, Clock, Star, Facebook, Instagram, Twitter, Phone, Mail } from 'lucide-react';
import { Logo, RiyalSymbol } from '../components/Icons';

export default function MenuPage() {
    const [screen, setScreen] = useState<'landing' | 'menu'>('landing');
    const [serviceType, setServiceType] = useState<ServiceType | null>(null);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [activeCategoryId, setActiveCategoryId] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [language, setLanguage] = useState<Language>('ar');
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Dynamic Data State
    const [products, setProducts] = useState<Product[]>(MENU_ITEMS);
    const [categories, setCategories] = useState(CATEGORIES);

    const t = TRANSLATIONS[language];

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    const handleServiceSelect = (type: ServiceType) => {
        setServiceType(type);
        setScreen('menu');
    };

    const toggleLanguage = () => {
        setLanguage(prev => {
            if (prev === 'ar') return 'en';
            if (prev === 'en') return 'tr';
            return 'ar';
        });
    };

    const toggleDarkMode = () => {
        setIsDarkMode(prev => !prev);
    };

    const addToCart = (
        product: Product,
        quantity: number,
        selectedAddOns: string[],
        selectedCustomizations: string[],
        selectedSize?: ProductOption,
        selectedSide?: ProductOption,
        selectedDrink?: ProductOption
    ) => {
        const newItem: CartItem = {
            instanceId: Math.random().toString(36).substr(2, 9),
            product,
            quantity,
            selectedAddOns,
            selectedCustomizations,
            selectedSize,
            selectedSide,
            selectedDrink
        };
        setCart(prev => [...prev, newItem]);
    };

    const removeFromCart = (instanceId: string) => {
        setCart(prev => prev.filter(item => item.instanceId !== instanceId));
    };

    const cartTotal = useMemo(() => {
        return cart.reduce((total, item) => {
            let unitPrice = item.product.price;

            if (item.selectedSize) unitPrice += item.selectedSize.price;
            if (item.selectedSide) unitPrice += item.selectedSide.price;
            if (item.selectedDrink) unitPrice += item.selectedDrink.price;

            const customsPrice = item.selectedCustomizations.reduce((sum, id) => {
                const custom = item.product.customizations?.find(c => c.id === id);
                return sum + (custom ? custom.price : 0);
            }, 0);

            const addOnsPrice = item.selectedAddOns.reduce((sum, id) => {
                const addon = item.product.addOns?.find(a => a.id === id);
                return sum + (addon ? addon.price : 0);
            }, 0);

            return total + ((unitPrice + addOnsPrice + customsPrice) * item.quantity);
        }, 0);
    }, [cart]);

    // Updated Helper Functions for Trilingual Support
    const getName = (item: Product) => {
        if (language === 'en' && item.nameEn) return item.nameEn;
        if (language === 'tr' && item.nameTr) return item.nameTr;
        return item.name;
    };

    const getDesc = (item: Product) => {
        if (language === 'en' && item.descriptionEn) return item.descriptionEn;
        if (language === 'tr' && item.descriptionTr) return item.descriptionTr;
        return item.description;
    };

    const getCatName = (catId: string) => {
        const cat = categories.find(c => c.id === catId);
        if (!cat) return '';
        if (language === 'en') return cat.en;
        if (language === 'tr') return cat.tr;
        return cat.ar;
    };

    const filteredProducts = useMemo(() => {
        return products.filter(item => {
            const catObj = categories.find(c => c.id === activeCategoryId);
            // For category matching, we use the Arabic name stored in product.category to match category.ar
            // In a real app with dynamic dashboard, relationships should be ID based. 
            // Here we assume product.category stores the Arabic string.
            const matchesCategory = activeCategoryId === 'all' || item.category === catObj?.ar;

            const name = getName(item).toLowerCase();
            const matchesSearch = name.includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [activeCategoryId, searchQuery, language, products, categories]);

    const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    if (screen === 'landing') {
        return (
            <div dir={language === 'ar' ? 'rtl' : 'ltr'}>
                <div className="absolute top-6 left-6 rtl:left-6 ltr:right-6 z-50 flex gap-3">
                    <button
                        onClick={toggleLanguage}
                        className="bg-white/10 backdrop-blur-xl text-white px-4 py-2 rounded-full font-bold border border-white/10 hover:bg-white/20 transition-all flex items-center gap-2 text-sm shadow-lg"
                    >
                        <Globe size={16} />
                        {language === 'ar' ? 'English' : (language === 'en' ? 'Türkçe' : 'العربية')}
                    </button>
                    <button
                        onClick={toggleDarkMode}
                        className="bg-white/10 backdrop-blur-xl text-white p-2 rounded-full border border-white/10 hover:bg-white/20 transition-all flex items-center justify-center shadow-lg"
                    >
                        {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                </div>
                <ServiceSelection onSelect={handleServiceSelect} language={language} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-900 pb-24 font-sans transition-colors duration-300" dir={language === 'ar' ? 'rtl' : 'ltr'}>

            {/* Announcement Bar (Marquee) */}
            <div className="bg-maroon text-white py-2 relative overflow-hidden z-50">
                <div className="absolute inset-0 bg-gradient-to-r from-maroon via-maroon-light to-maroon opacity-50"></div>
                <div className="marquee-container relative z-10">
                    <div className={`marquee-content ${language === 'ar' ? 'rtl-marquee' : 'ltr-marquee'} flex items-center gap-8 px-4`}>
                        <span className="flex items-center gap-2 text-sm font-bold"><Sparkles size={14} className="text-gold" /> {t.announcement}</span>
                        <span className="flex items-center gap-2 text-sm font-bold text-gold/50">|</span>
                        <span className="flex items-center gap-2 text-sm font-bold"><Sparkles size={14} className="text-gold" /> {t.announcement}</span>
                        <span className="flex items-center gap-2 text-sm font-bold text-gold/50">|</span>
                        <span className="flex items-center gap-2 text-sm font-bold"><Sparkles size={14} className="text-gold" /> {t.announcement}</span>
                    </div>
                </div>
            </div>

            {/* HERO CONTAINER WITH FLOATING NAVBAR */}
            <div className="relative w-full h-[320px] sm:h-[380px] md:h-[450px] rounded-b-[2.5rem] sm:rounded-b-[3.5rem] overflow-hidden shadow-2xl z-0 group">

                {/* Floating Glass Navbar (Absolute Positioned) */}
                <nav className="absolute top-4 left-0 right-0 z-30 px-4">
                    <div className="max-w-5xl mx-auto bg-black/40 backdrop-blur-2xl border border-white/10 rounded-full px-6 h-20 flex items-center justify-between shadow-2xl transition-all hover:bg-black/50">
                        {/* Logo */}
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setScreen('landing')}>
                            <div className="h-10 w-auto text-white flex items-center drop-shadow-md">
                                <Logo className="h-full w-auto fill-current" />
                            </div>
                        </div>

                        {/* Search Bar (Desktop) */}
                        <div className="flex-1 max-w-md mx-6 hidden sm:block">
                            <div className="relative group">
                                <Search className="absolute rtl:left-3 ltr:right-3 top-1/2 transform -translate-y-1/2 text-white/60 group-focus-within:text-gold transition-colors" size={18} />
                                <input
                                    type="text"
                                    placeholder={t.search}
                                    className="w-full bg-white/10 border border-white/10 rounded-full py-2.5 rtl:pl-10 rtl:pr-5 ltr:pr-10 ltr:pl-5 text-sm text-white focus:bg-white/20 focus:ring-2 focus:ring-gold/20 focus:border-gold/50 outline-none transition-all placeholder-white/50 backdrop-blur-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            {/* WhatsApp Button */}
                            <button
                                onClick={() => window.open(`https://wa.me/967779113958`, '_blank')}
                                className="hidden sm:flex p-2.5 text-white/80 hover:text-green-400 transition-colors bg-white/10 hover:bg-white/20 rounded-full items-center border border-white/10"
                                title={t.sendWhatsapp}
                            >
                                <Phone size={18} />
                            </button>

                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="sm:hidden p-2 text-white/80 hover:text-white"
                            >
                                <Search size={22} />
                            </button>

                            <button
                                onClick={toggleDarkMode}
                                className="hidden sm:flex p-2.5 text-white/80 hover:text-gold transition-colors bg-white/10 hover:bg-white/20 rounded-full items-center border border-white/10"
                            >
                                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                            </button>

                            <button
                                onClick={toggleLanguage}
                                className="hidden sm:flex p-2.5 text-white/80 hover:text-gold transition-colors bg-white/10 hover:bg-white/20 rounded-full items-center gap-1 font-bold text-xs border border-white/10 uppercase"
                            >
                                {language === 'ar' ? 'EN' : (language === 'en' ? 'TR' : 'AR')}
                            </button>

                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="relative p-3 text-white hover:text-gold transition-colors bg-gold/20 hover:bg-gold/30 rounded-full border border-gold/30"
                            >
                                <ShoppingCart size={20} />
                                {cartItemCount > 0 && (
                                    <span className="absolute -top-0.5 -left-0.5 bg-maroon text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-sm border border-white">
                                        {cartItemCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </nav>

                {/* Hero Image & Overlay */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10 pointer-events-none"></div>
                <img
                    src={LANDING_BG}
                    alt="Restaurant Ambience"
                    className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-[20s]"
                />

                {/* Hero Text */}
                <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 sm:p-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none">
                    <div className="transform translate-y-0 transition-transform duration-500 pb-8">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-2 drop-shadow-lg">
                            {t.title}
                        </h1>
                        <p className="text-gold text-lg sm:text-xl font-medium mb-4 max-w-xl drop-shadow-md">
                            {t.slogan}
                        </p>
                        <div className="flex items-center gap-4 text-white/90 text-sm font-medium">
                            <span className="flex items-center gap-1 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                                <Clock size={16} className="text-gold" /> 20-30 min
                            </span>
                            <span className="flex items-center gap-1 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                                <Star size={16} className="text-gold" /> 4.9 (1.2k+)
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-5xl mx-auto">

                {/* Categories Bar - Sticky with Glass Effect */}
                <div className="sticky top-4 z-40 px-4 -mt-12 mb-8">
                    <div className="bg-white/60 dark:bg-dark-800/60 backdrop-blur-xl rounded-full shadow-lg border border-white/20 dark:border-white/5 p-2.5 flex items-center justify-between transition-all">
                        <div className="flex items-center space-x-2 space-x-reverse rtl:space-x-reverse ltr:space-x-reverse overflow-x-auto no-scrollbar w-full px-2">
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategoryId(cat.id)}
                                    className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all transform active:scale-95 border ${activeCategoryId === cat.id
                                        ? 'bg-maroon text-white shadow-lg shadow-maroon/30 border-maroon'
                                        : 'bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 hover:text-maroon dark:hover:text-white border-transparent'
                                        }`}
                                >
                                    {language === 'en' ? cat.en : (language === 'tr' ? cat.tr : cat.ar)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Menu Grid */}
                <div className="px-4 pb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1.5 h-8 bg-gold rounded-full"></div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white">{getCatName(activeCategoryId)}</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProducts.map((product, index) => (
                            <div
                                key={product.id}
                                onClick={() => setSelectedProduct(product)}
                                className="bg-white dark:bg-dark-800 rounded-[2rem] shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-gray-100 dark:border-dark-700 overflow-hidden cursor-pointer transition-all duration-300 group flex flex-col animate-slide-up"
                                style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}
                            >
                                <div className="relative h-48 w-full bg-gray-50 dark:bg-dark-700 overflow-hidden">
                                    <img
                                        src={product.image}
                                        alt={getName(product)}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="absolute bottom-3 rtl:left-3 ltr:right-3 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                        <div className="w-10 h-10 rounded-full bg-white dark:bg-dark-800 text-maroon dark:text-white flex items-center justify-center shadow-lg">
                                            <span className="text-xl font-bold">+</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight group-hover:text-maroon dark:group-hover:text-gold transition-colors">{getName(product)}</h3>
                                        <span className="text-maroon dark:text-gold font-black text-lg whitespace-nowrap flex items-center gap-1">
                                            {product.price} <RiyalSymbol className="w-4 h-4 fill-current mt-1" />
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 mb-4 flex-1">{getDesc(product)}</p>
                                    <div className="mt-auto pt-3 border-t border-gray-50 dark:border-dark-700 flex justify-between items-center">
                                        <span className="text-xs font-bold text-gold uppercase tracking-wider">{t.details}</span>
                                        <span className="text-xs text-gray-400 dark:text-gray-500 font-medium group-hover:text-maroon dark:group-hover:text-white transition-colors">
                                            {product.calories ? `${product.calories} ${t.calories}` : ''}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredProducts.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-20 h-20 bg-gray-100 dark:bg-dark-800 rounded-full flex items-center justify-center mb-4">
                                <Search size={32} className="text-gray-300 dark:text-gray-600" />
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium mb-2">{t.noResults}</p>
                            <button onClick={() => { setSearchQuery(''); setActiveCategoryId('all') }} className="text-maroon dark:text-gold font-bold hover:underline">{t.viewAll}</button>
                        </div>
                    )}
                </div>

                {/* CUSTOMER REVIEWS SECTION */}
                <div className="px-4 mb-16 max-w-5xl mx-auto">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1.5 h-8 bg-maroon rounded-full"></div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white">{t.customerReviews}</h2>
                    </div>

                    <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar">
                        {CUSTOMER_REVIEWS.map((review) => (
                            <div key={review.id} className="min-w-[280px] md:min-w-[320px] bg-white dark:bg-dark-800 p-5 rounded-2xl border border-gray-100 dark:border-dark-700">
                                <div className="flex items-center gap-1 mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} className={i < review.rating ? "text-gold fill-gold" : "text-gray-300 dark:text-gray-600"} />
                                    ))}
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">"{review.comment}"</p>
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-gray-900 dark:text-white text-sm">{review.name}</span>
                                    <span className="text-xs text-gray-400 dark:text-gray-500">{review.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </main>

            {/* FOOTER */}
            <footer className="bg-white dark:bg-dark-800 border-t border-gray-100 dark:border-dark-700 pt-16 pb-8 px-4">
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <div className="h-12 w-auto text-maroon dark:text-white mb-6">
                            <Logo className="h-full w-auto fill-current" />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
                            نقدم أشهى المأكولات التركية والعربية بأعلى معايير الجودة والضيافة. تجربة طعام لا تنسى في قلب المدينة.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-dark-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-maroon hover:text-white transition-all">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-dark-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-maroon hover:text-white transition-all">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-dark-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-maroon hover:text-white transition-all">
                                <Twitter size={18} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-6 text-lg">{t.menu}</h4>
                        <ul className="space-y-3">
                            {categories.slice(0, 5).map(cat => (
                                <li key={cat.id}>
                                    <button onClick={() => setActiveCategoryId(cat.id)} className="text-gray-500 dark:text-gray-400 hover:text-maroon dark:hover:text-gold transition-colors text-sm">
                                        {language === 'en' ? cat.en : (language === 'tr' ? cat.tr : cat.ar)}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-6 text-lg">تواصل معنا</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-gray-500 dark:text-gray-400 text-sm">
                                <MapPin size={18} className="text-maroon dark:text-gold shrink-0 mt-0.5" />
                                <span>شارع المطاعم، وسط المدينة، إسطنبول، تركيا</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-500 dark:text-gray-400 text-sm">
                                <Phone size={18} className="text-maroon dark:text-gold shrink-0" />
                                <span dir="ltr">+90 555 123 4567</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-500 dark:text-gray-400 text-sm">
                                <Mail size={18} className="text-maroon dark:text-gold shrink-0" />
                                <span>info@iskandarefendi.com</span>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-6 text-lg">ساعات العمل</h4>
                        <ul className="space-y-3">
                            <li className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                                <span>الإثنين - الخميس</span>
                                <span className="font-bold text-gray-900 dark:text-white">10:00 ص - 11:00 م</span>
                            </li>
                            <li className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                                <span>الجمعة - السبت</span>
                                <span className="font-bold text-gray-900 dark:text-white">10:00 ص - 12:00 ص</span>
                            </li>
                            <li className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                                <span>الأحد</span>
                                <span className="font-bold text-gray-900 dark:text-white">12:00 م - 11:00 م</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-100 dark:border-dark-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 text-sm text-center md:text-right">
                        © 2024 مطعم إسكندر أفندي. جميع الحقوق محفوظة.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span>Powered by</span>
                        <span className="font-bold text-maroon dark:text-gold">MenuFi</span>
                    </div>
                </div>
            </footer>

            <ProductModal
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
                product={selectedProduct}
                onAddToCart={addToCart}
                language={language}
            />

            <CartDrawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cartItems={cart}
                onRemoveItem={removeFromCart}
                totalPrice={cartTotal}
                language={language}
                serviceType={serviceType ?? 'pickup'}
            />
        </div>
    );
}
