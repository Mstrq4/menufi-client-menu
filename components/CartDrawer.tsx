
import React, { useState } from 'react';
import { CartItem, ServiceType, CustomerDetails, ServiceTypeLabels, Language } from '../lib/types';
import { X, Trash2, ShoppingBag, Send, CreditCard, Banknote } from 'lucide-react';
import { WHATSAPP_NUMBER, TRANSLATIONS, PAYMENT_METHODS } from '../lib/constants';
import { RiyalSymbol } from './Icons';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  serviceType: ServiceType;
  onRemoveItem: (instanceId: string) => void;
  totalPrice: number;
  language: Language;
}

const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  serviceType,
  onRemoveItem,
  totalPrice,
  language
}) => {
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    name: '',
    tableNumber: '',
    notes: ''
  });
  const [selectedPayment, setSelectedPayment] = useState<string>('cash');
  const [errors, setErrors] = useState<{ name?: boolean, table?: boolean }>({});
  const t = TRANSLATIONS[language];

  const handleInputChange = (field: keyof CustomerDetails, value: string) => {
    setCustomerDetails(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field as keyof typeof errors]: false }));
    }
  };

  const validateForm = () => {
    const newErrors: { name?: boolean, table?: boolean } = {};
    if (!customerDetails.name.trim()) newErrors.name = true;
    if (serviceType === 'dine_in' && !customerDetails.tableNumber?.trim()) newErrors.table = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getName = (item: any) => {
    if (language === 'en' && item.nameEn) return item.nameEn;
    if (language === 'tr' && item.nameTr) return item.nameTr;
    return item.name;
  };

  const generateWhatsAppLink = () => {
    if (!validateForm()) return;

    const randomId = Math.floor(1000 + Math.random() * 9000);
    const paymentInfo = PAYMENT_METHODS.find(p => p.id === selectedPayment);
    const paymentLabel = paymentInfo ? paymentInfo[language] : selectedPayment;

    let message = `🔔 *طلب جديد | Order #${randomId}*\n`;
    message += `ــــــــــــــــــــــــــــــــــــــــ\n\n`;

    // Service Type
    const serviceNameAr = ServiceTypeLabels[serviceType].ar;
    const serviceNameEn = ServiceTypeLabels[serviceType].en;
    message += `🍽️ *نوع الطلب:* ${serviceNameAr} (${serviceNameEn})\n`;

    // Location / Table
    if (serviceType === 'dine_in') {
      message += `📍 *طاولة رقم: ${customerDetails.tableNumber}*\n`;
    } else if (serviceType === 'delivery') {
      message += `📍 *توصيل (العنوان في الملاحظات)*\n`;
    } else {
      message += `📍 *استلام من الفرع*\n`;
    }

    message += `\n📋 *الطلبات:*\n`;

    cartItems.forEach(item => {
      const productName = getName(item.product);

      // Format with Size if exists
      let displayName = productName;
      if (item.selectedSize) {
        displayName += ` (${getName(item.selectedSize)})`;
      }

      message += `▪️ ${item.quantity}x ${displayName}\n`;

      // Add Side
      if (item.selectedSide) {
        message += `     └ 🍟 ${getName(item.selectedSide)}\n`;
      }

      // Add Drink
      if (item.selectedDrink) {
        message += `     └ 🥤 ${getName(item.selectedDrink)}\n`;
      }

      // Customizations (e.g. No Garlic)
      if (item.selectedCustomizations && item.selectedCustomizations.length > 0) {
        const customNames = item.selectedCustomizations.map(id => {
          const custom = item.product.customizations?.find(c => c.id === id);
          return custom ? getName(custom) : '';
        }).filter(Boolean).join('، ');

        if (customNames) {
          message += `     └ 🚫 ${customNames}\n`;
        }
      }

      // Add Add-ons
      if (item.selectedAddOns.length > 0) {
        item.selectedAddOns.forEach(addonId => {
          const addon = item.product.addOns?.find(a => a.id === addonId);
          if (addon) {
            message += `     └ 🔸 ${getName(addon)}\n`;
          }
        });
      }
    });

    message += `\nــــــــــــــــــــــــــــــــــــــــ\n`;
    message += `💰 *المجموع: ${totalPrice.toFixed(2)} SAR*\n`;
    message += `💳 *الدفع: ${paymentLabel}*\n`;
    message += `ــــــــــــــــــــــــــــــــــــــــ\n\n`;

    message += `👤 *العميل:* ${customerDetails.name}\n`;
    message += `📝 *ملاحظة:* ${customerDetails.notes ? customerDetails.notes : '-'}\n`;

    message += `\n🔗 https://iskender-efendi.com/menu/`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
  };

  const getPaymentIcon = (id: string) => {
    switch (id) {
      case 'cash': return <Banknote size={24} className="text-green-600" />;
      case 'apple': return (
        <svg className="w-6 h-6 fill-current text-black dark:text-white" viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 52.3-11.4 69.5-34.3z" /></svg>
      );
      case 'google': return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="#4285F4" /><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="#34A853" /></svg>
      );
      case 'visa': return (
        <svg className="w-8 h-8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#1434CB" d="M10.15 16.1L6.75 6.64H4.52l4.63 10.59-4.85-11.41h2.38l2.9 8.21 2.89-8.21h2.2L10.15 16.1z" /><path fill="#1434CB" d="M14.28 6.64l1.37 8.32h2.09l-1.37-8.32h-2.09z" /><path fill="#1434CB" d="M21.16 6.64h-1.63c-0.51 0-0.9.15-1.12.7l-3.96 9.46h2.2l0.44-1.21h2.68l0.25 1.21h1.94l-0.8-10.16zM17.45 13.91l0.69-1.92 0.39-1.09 0.22 1.05 0.44 1.96h-1.74z" /><path fill="#1434CB" d="M4.35 6.64H0.1L0 6.86C2.86 7.6 5.31 9.88 6.47 12.47L5.68 8.61C5.55 7.66 4.97 6.64 4.35 6.64z" /></svg>
      );
      case 'master': return (
        <svg className="w-8 h-8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="7" cy="12" r="7" fill="#EB001B" /><circle cx="17" cy="12" r="7" fill="#F79E1B" fillOpacity="0.8" /></svg>
      );
      case 'mada': return (
        <div className="font-black text-[10px] bg-blue-600 text-white px-1 py-0.5 rounded">mada</div>
      );
      default: return <CreditCard size={24} />;
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end items-center pointer-events-none">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity pointer-events-auto"
        onClick={onClose}
      ></div>

      <div className={`relative w-full max-w-md bg-white dark:bg-dark-900 m-4 h-[95vh] rounded-[2.5rem] shadow-2xl flex flex-col pointer-events-auto overflow-hidden ${language === 'ar' ? 'animate-slide-in-right' : 'animate-slide-in-left'}`}>
        <div className="p-5 bg-maroon text-white flex items-center justify-between shrink-0 shadow-md z-10">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
              <ShoppingBag size={22} className="text-gold" />
            </div>
            <div>
              <h2 className="font-bold text-lg">{t.cart}</h2>
              <p className="text-xs text-white/70">{ServiceTypeLabels[serviceType][language]}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-dark-900">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-600 space-y-4">
              <div className="w-20 h-20 bg-gray-100 dark:bg-dark-800 rounded-full flex items-center justify-center">
                <ShoppingBag size={32} className="opacity-30" />
              </div>
              <p className="font-medium">{t.cartEmpty}</p>
            </div>
          ) : (
            cartItems.map((item) => {
              let unitPrice = item.product.price;
              if (item.selectedSize) unitPrice += item.selectedSize.price;
              if (item.selectedSide) unitPrice += item.selectedSide.price;
              if (item.selectedDrink) unitPrice += item.selectedDrink.price;

              const customsPrice = item.selectedCustomizations?.reduce((acc, id) => {
                const c = item.product.customizations?.find(x => x.id === id);
                return acc + (c ? c.price : 0);
              }, 0) || 0;

              const addOnsPrice = item.selectedAddOns.reduce((acc, addonId) => {
                const addon = item.product.addOns?.find(a => a.id === addonId);
                return acc + (addon ? addon.price : 0);
              }, 0);

              const itemTotal = (unitPrice + addOnsPrice + customsPrice) * item.quantity;

              return (
                <div key={item.instanceId} className="bg-white dark:bg-dark-800 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-700 flex gap-3">
                  <img src={item.product.image} alt={getName(item.product)} className="w-20 h-20 rounded-xl object-cover bg-gray-200 dark:bg-dark-700" />
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-800 dark:text-white text-sm">{getName(item.product)}</h3>

                        <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 space-y-0.5">
                          {item.selectedSize && (
                            <p className="flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>{getName(item.selectedSize)}</p>
                          )}
                          {item.selectedSide && (
                            <p className="flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>{getName(item.selectedSide)}</p>
                          )}
                          {item.selectedDrink && (
                            <p className="flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>{getName(item.selectedDrink)}</p>
                          )}
                          {item.selectedCustomizations && item.selectedCustomizations.length > 0 && (
                            <p className="flex flex-wrap gap-1 text-red-400 dark:text-red-300">
                              <span className="w-1 h-1 rounded-full bg-red-300 dark:bg-red-400 mt-1.5"></span>
                              {item.selectedCustomizations.map(id => {
                                const c = item.product.customizations?.find(x => x.id === id);
                                return c ? <span key={id}>{getName(c)}</span> : null;
                              }).reduce((prev, curr) => [prev, '، ', curr] as any)}
                            </p>
                          )}

                          {item.selectedAddOns.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {item.selectedAddOns.map(id => {
                                const a = item.product.addOns?.find(x => x.id === id);
                                return a ? <span key={id} className="bg-gray-100 dark:bg-dark-700 px-1.5 rounded text-[10px] border border-gray-200 dark:border-dark-600">+ {getName(a)}</span> : null;
                              })}
                            </div>
                          )}
                        </div>

                      </div>
                      <span className="font-bold text-maroon dark:text-gold text-sm flex items-center gap-1">{itemTotal.toFixed(2)} <RiyalSymbol className="w-2.5 h-2.5 fill-current" /></span>
                    </div>

                    <div className="flex justify-between items-end mt-2">
                      <span className="text-xs bg-gray-100 dark:bg-dark-700 px-2 py-1 rounded-lg text-gray-600 dark:text-gray-300 font-medium border border-gray-200 dark:border-dark-600">
                        {t.quantity}: {item.quantity}
                      </span>
                      <button
                        onClick={() => onRemoveItem(item.instanceId)}
                        className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1.5 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-5 bg-white dark:bg-dark-800 border-t border-gray-100 dark:border-dark-700 shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-10">

            <div className="space-y-4 mb-6">

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">{t.selectPayment}</label>
                <div className="grid grid-cols-3 gap-2">
                  {PAYMENT_METHODS.map(method => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id)}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${selectedPayment === method.id
                          ? 'border-maroon bg-maroon/5 dark:border-gold dark:bg-gold/10 text-maroon dark:text-gold'
                          : 'border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 hover:bg-gray-100 dark:hover:bg-dark-600'
                        }`}
                      title={method[language]}
                    >
                      {getPaymentIcon(method.icon)}
                      <span className="text-[10px] mt-1 font-bold whitespace-nowrap overflow-hidden text-ellipsis w-full text-center">
                        {method[language]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">{t.customerName} <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={customerDetails.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full p-3 bg-gray-50 dark:bg-dark-700 border rounded-xl focus:ring-2 focus:ring-maroon/20 dark:focus:ring-gold/20 focus:border-maroon dark:focus:border-gold outline-none transition-all text-sm text-gray-900 dark:text-white placeholder-gray-400 ${errors.name ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-dark-600'}`}
                  placeholder={t.customerName}
                />
              </div>

              {serviceType === 'dine_in' && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">{t.tableNumber} <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    value={customerDetails.tableNumber}
                    onChange={(e) => handleInputChange('tableNumber', e.target.value)}
                    className={`w-full p-3 bg-gray-50 dark:bg-dark-700 border rounded-xl focus:ring-2 focus:ring-maroon/20 dark:focus:ring-gold/20 focus:border-maroon dark:focus:border-gold outline-none transition-all text-sm text-gray-900 dark:text-white placeholder-gray-400 ${errors.table ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-dark-600'}`}
                    placeholder={t.tableNumber}
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">{t.notes}</label>
                <textarea
                  value={customerDetails.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="w-full p-3 bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-dark-600 rounded-xl focus:ring-2 focus:ring-maroon/20 dark:focus:ring-gold/20 focus:border-maroon dark:focus:border-gold outline-none transition-all h-16 resize-none text-sm text-gray-900 dark:text-white placeholder-gray-400"
                  placeholder={t.notes}
                />
              </div>
            </div>

            <div className="flex justify-between items-center mb-4 bg-gray-50 dark:bg-dark-700 p-3 rounded-xl">
              <span className="text-gray-600 dark:text-gray-300 font-medium text-sm">{t.total}</span>
              <span className="text-xl font-black text-maroon dark:text-gold flex items-center gap-1">{totalPrice.toFixed(2)} <RiyalSymbol className="w-3.5 h-3.5 fill-current" /></span>
            </div>

            <button
              onClick={generateWhatsAppLink}
              className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-green-200 dark:shadow-none active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Send size={20} className="rtl:ml-2 ltr:mr-2" />
              <span>{t.sendWhatsapp}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
