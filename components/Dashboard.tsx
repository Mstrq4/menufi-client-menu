
import React, { useState } from 'react';
import { Product, Language } from '../lib/types';
import { TRANSLATIONS } from '../lib/constants';
import { LayoutDashboard, Plus, Edit, Trash2, Save, X, Image, Tag, DollarSign, Utensils } from 'lucide-react';
import { Logo } from './Icons';

interface DashboardProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  categories: { id: string; ar: string; en: string; tr: string }[];
  setCategories: React.Dispatch<React.SetStateAction<{ id: string; ar: string; en: string; tr: string }[]>>;
  language: Language;
  onBack: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  products, 
  setProducts, 
  categories, 
  setCategories, 
  language, 
  onBack 
}) => {
  const t = TRANSLATIONS[language];
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Categories State
  const [newCategory, setNewCategory] = useState({ ar: '', en: '', tr: '' });

  // Handlers for Products
  const handleEditProduct = (product: Product) => {
    setEditingProduct({ ...product });
    setIsEditing(true);
  };

  const handleCreateProduct = () => {
    setEditingProduct({
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      nameEn: '',
      nameTr: '',
      description: '',
      descriptionEn: '',
      descriptionTr: '',
      price: 0,
      image: 'https://placehold.co/600x400/EEE/31343C?text=New+Product',
      category: categories[1]?.ar || '',
      calories: 0,
      sizes: [],
      addOns: [],
    });
    setIsEditing(true);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm(language === 'ar' ? 'هل أنت متأكد من الحذف؟' : 'Are you sure you want to delete?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleSaveProduct = () => {
    if (!editingProduct?.name || !editingProduct.price) return;

    if (products.find(p => p.id === editingProduct.id)) {
      // Update
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? editingProduct as Product : p));
    } else {
      // Create
      setProducts(prev => [...prev, editingProduct as Product]);
    }
    setIsEditing(false);
    setEditingProduct(null);
  };

  // Handlers for Categories
  const handleAddCategory = () => {
    if (!newCategory.ar || !newCategory.en) return;
    const id = newCategory.en.toLowerCase().replace(/\s+/g, '_');
    setCategories(prev => [...prev, { id, ar: newCategory.ar, en: newCategory.en, tr: newCategory.tr || newCategory.en }]);
    setNewCategory({ ar: '', en: '', tr: '' });
  };

  const handleDeleteCategory = (id: string) => {
     if (id === 'all') return; // Cannot delete 'all'
     if (window.confirm(language === 'ar' ? 'هل أنت متأكد من الحذف؟' : 'Are you sure you want to delete?')) {
        setCategories(prev => prev.filter(c => c.id !== id));
     }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark-900 p-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
       {/* Header */}
       <div className="max-w-7xl mx-auto mb-8 flex justify-between items-center">
          <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-maroon text-white rounded-2xl flex items-center justify-center shadow-lg">
                  <LayoutDashboard size={32} />
              </div>
              <div>
                  <h1 className="text-3xl font-black text-gray-900 dark:text-white">{t.dashboard}</h1>
                  <p className="text-gray-500 dark:text-gray-400">{t.dashboardWelcome}</p>
              </div>
          </div>
          <button onClick={onBack} className="bg-white dark:bg-dark-800 px-6 py-3 rounded-xl shadow-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
              {t.close}
          </button>
       </div>

       <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
              <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-sm p-4 overflow-hidden">
                  <button 
                    onClick={() => setActiveTab('products')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors mb-2 ${activeTab === 'products' ? 'bg-maroon text-white shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-700'}`}
                  >
                      <Utensils size={20} />
                      <span className="font-bold">{t.products}</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('categories')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'categories' ? 'bg-maroon text-white shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-700'}`}
                  >
                      <Tag size={20} />
                      <span className="font-bold">{t.categories}</span>
                  </button>
              </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
              {activeTab === 'products' ? (
                  <div className="space-y-6">
                     <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t.products}</h2>
                        <button onClick={handleCreateProduct} className="bg-gold hover:bg-gold-dark text-maroon font-bold px-4 py-2 rounded-xl shadow-lg shadow-gold/20 flex items-center gap-2 transition-colors">
                            <Plus size={20} />
                            {t.addProduct}
                        </button>
                     </div>

                     {isEditing && editingProduct ? (
                         <div className="bg-white dark:bg-dark-800 rounded-[2rem] shadow-lg p-6 animate-slide-up border border-gray-200 dark:border-dark-700">
                             <h3 className="text-xl font-bold mb-6 pb-4 border-b border-gray-100 dark:border-dark-700">{t.editProduct}</h3>
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                 <div>
                                     <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{t.productNameAr}</label>
                                     <input 
                                        type="text" 
                                        value={editingProduct.name} 
                                        onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                                        className="w-full p-3 bg-gray-50 dark:bg-dark-700 rounded-xl border border-gray-200 dark:border-dark-600 focus:border-maroon outline-none"
                                     />
                                 </div>
                                 <div>
                                     <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{t.productNameEn}</label>
                                     <input 
                                        type="text" 
                                        value={editingProduct.nameEn} 
                                        onChange={(e) => setEditingProduct({...editingProduct, nameEn: e.target.value})}
                                        className="w-full p-3 bg-gray-50 dark:bg-dark-700 rounded-xl border border-gray-200 dark:border-dark-600 focus:border-maroon outline-none text-left"
                                        dir="ltr"
                                     />
                                 </div>
                                  <div>
                                     <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{t.productNameTr}</label>
                                     <input 
                                        type="text" 
                                        value={editingProduct.nameTr} 
                                        onChange={(e) => setEditingProduct({...editingProduct, nameTr: e.target.value})}
                                        className="w-full p-3 bg-gray-50 dark:bg-dark-700 rounded-xl border border-gray-200 dark:border-dark-600 focus:border-maroon outline-none text-left"
                                        dir="ltr"
                                     />
                                 </div>

                                 <div className="md:col-span-3">
                                     <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{t.image}</label>
                                     <div className="flex gap-4">
                                        <input 
                                            type="text" 
                                            value={editingProduct.image} 
                                            onChange={(e) => setEditingProduct({...editingProduct, image: e.target.value})}
                                            className="flex-1 p-3 bg-gray-50 dark:bg-dark-700 rounded-xl border border-gray-200 dark:border-dark-600 focus:border-maroon outline-none text-left"
                                            dir="ltr"
                                        />
                                        <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-dark-700 overflow-hidden shrink-0 border border-gray-200 dark:border-dark-600">
                                            <img src={editingProduct.image} className="w-full h-full object-cover" alt="Preview" />
                                        </div>
                                     </div>
                                 </div>
                                 <div>
                                     <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{t.price}</label>
                                     <input 
                                        type="number" 
                                        value={editingProduct.price} 
                                        onChange={(e) => setEditingProduct({...editingProduct, price: Number(e.target.value)})}
                                        className="w-full p-3 bg-gray-50 dark:bg-dark-700 rounded-xl border border-gray-200 dark:border-dark-600 focus:border-maroon outline-none"
                                     />
                                 </div>
                                 <div>
                                     <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{t.category}</label>
                                     <select 
                                        value={editingProduct.category} 
                                        onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                                        className="w-full p-3 bg-gray-50 dark:bg-dark-700 rounded-xl border border-gray-200 dark:border-dark-600 focus:border-maroon outline-none"
                                     >
                                         {categories.filter(c => c.id !== 'all').map(cat => (
                                             <option key={cat.id} value={cat.ar}>{cat.ar} / {cat.en}</option>
                                         ))}
                                     </select>
                                 </div>
                                 <div className="md:col-span-3">
                                     <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{t.descriptionAr}</label>
                                     <textarea 
                                        value={editingProduct.description} 
                                        onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                                        className="w-full p-3 bg-gray-50 dark:bg-dark-700 rounded-xl border border-gray-200 dark:border-dark-600 focus:border-maroon outline-none h-24 resize-none"
                                     />
                                 </div>
                                 <div className="md:col-span-3">
                                     <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{t.descriptionEn}</label>
                                     <textarea 
                                        value={editingProduct.descriptionEn} 
                                        onChange={(e) => setEditingProduct({...editingProduct, descriptionEn: e.target.value})}
                                        className="w-full p-3 bg-gray-50 dark:bg-dark-700 rounded-xl border border-gray-200 dark:border-dark-600 focus:border-maroon outline-none h-24 resize-none text-left"
                                        dir="ltr"
                                     />
                                 </div>
                                 <div className="md:col-span-3">
                                     <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{t.descriptionTr}</label>
                                     <textarea 
                                        value={editingProduct.descriptionTr} 
                                        onChange={(e) => setEditingProduct({...editingProduct, descriptionTr: e.target.value})}
                                        className="w-full p-3 bg-gray-50 dark:bg-dark-700 rounded-xl border border-gray-200 dark:border-dark-600 focus:border-maroon outline-none h-24 resize-none text-left"
                                        dir="ltr"
                                     />
                                 </div>
                             </div>
                             <div className="flex justify-end gap-3 mt-8">
                                 <button 
                                    onClick={() => setIsEditing(false)}
                                    className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                                 >
                                     {t.cancel}
                                 </button>
                                 <button 
                                    onClick={handleSaveProduct}
                                    className="bg-maroon text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-maroon/30 hover:bg-maroon-light transition-colors"
                                 >
                                     {t.save}
                                 </button>
                             </div>
                         </div>
                     ) : (
                         <div className="bg-white dark:bg-dark-800 rounded-[2rem] shadow-sm border border-gray-100 dark:border-dark-700 overflow-hidden">
                             <div className="overflow-x-auto">
                                 <table className="w-full">
                                     <thead className="bg-gray-50 dark:bg-dark-700 border-b border-gray-100 dark:border-dark-600">
                                         <tr>
                                             <th className="px-6 py-4 text-start text-sm font-bold text-gray-600 dark:text-gray-300">#</th>
                                             <th className="px-6 py-4 text-start text-sm font-bold text-gray-600 dark:text-gray-300">{t.productNameAr}</th>
                                             <th className="px-6 py-4 text-start text-sm font-bold text-gray-600 dark:text-gray-300">{t.price}</th>
                                             <th className="px-6 py-4 text-start text-sm font-bold text-gray-600 dark:text-gray-300">{t.category}</th>
                                             <th className="px-6 py-4 text-start text-sm font-bold text-gray-600 dark:text-gray-300">{t.actions}</th>
                                         </tr>
                                     </thead>
                                     <tbody className="divide-y divide-gray-100 dark:divide-dark-700">
                                         {products.map((product) => (
                                             <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors">
                                                 <td className="px-6 py-4">
                                                     <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100">
                                                         <img src={product.image} alt="" className="w-full h-full object-cover" />
                                                     </div>
                                                 </td>
                                                 <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                                                     {language === 'en' && product.nameEn ? product.nameEn : (language === 'tr' && product.nameTr ? product.nameTr : product.name)}
                                                 </td>
                                                 <td className="px-6 py-4 text-maroon dark:text-gold font-bold">
                                                     {product.price}
                                                 </td>
                                                 <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                     {product.category}
                                                 </td>
                                                 <td className="px-6 py-4">
                                                     <div className="flex items-center gap-2">
                                                         <button onClick={() => handleEditProduct(product)} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                                                             <Edit size={18} />
                                                         </button>
                                                         <button onClick={() => handleDeleteProduct(product.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                                                             <Trash2 size={18} />
                                                         </button>
                                                     </div>
                                                 </td>
                                             </tr>
                                         ))}
                                     </tbody>
                                 </table>
                             </div>
                         </div>
                     )}
                  </div>
              ) : (
                  <div className="space-y-6">
                     <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t.categories}</h2>
                     
                     <div className="bg-white dark:bg-dark-800 rounded-[2rem] shadow-sm p-6 border border-gray-100 dark:border-dark-700 mb-8">
                         <h3 className="font-bold mb-4 text-gray-700 dark:text-gray-300">{t.addCategory}</h3>
                         <div className="flex flex-col gap-4">
                            <div className="flex gap-4 items-end">
                                 <div className="flex-1">
                                     <label className="block text-xs font-bold text-gray-500 mb-1">{t.categoryNameAr}</label>
                                     <input 
                                        type="text" 
                                        value={newCategory.ar}
                                        onChange={(e) => setNewCategory({...newCategory, ar: e.target.value})}
                                        className="w-full p-3 bg-gray-50 dark:bg-dark-700 rounded-xl border border-gray-200 dark:border-dark-600 focus:border-maroon outline-none"
                                     />
                                 </div>
                                 <div className="flex-1">
                                     <label className="block text-xs font-bold text-gray-500 mb-1">{t.categoryNameEn}</label>
                                     <input 
                                        type="text" 
                                        value={newCategory.en}
                                        onChange={(e) => setNewCategory({...newCategory, en: e.target.value})}
                                        className="w-full p-3 bg-gray-50 dark:bg-dark-700 rounded-xl border border-gray-200 dark:border-dark-600 focus:border-maroon outline-none text-left"
                                        dir="ltr"
                                     />
                                 </div>
                             </div>
                             <div className="flex gap-4 items-end">
                                  <div className="flex-1">
                                     <label className="block text-xs font-bold text-gray-500 mb-1">{t.categoryNameTr}</label>
                                     <input 
                                        type="text" 
                                        value={newCategory.tr}
                                        onChange={(e) => setNewCategory({...newCategory, tr: e.target.value})}
                                        className="w-full p-3 bg-gray-50 dark:bg-dark-700 rounded-xl border border-gray-200 dark:border-dark-600 focus:border-maroon outline-none text-left"
                                        dir="ltr"
                                     />
                                 </div>
                                 <button onClick={handleAddCategory} className="bg-maroon text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-maroon/30 hover:bg-maroon-light transition-colors">
                                     <Plus size={20} />
                                 </button>
                             </div>
                         </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {categories.map(cat => (
                             <div key={cat.id} className="bg-white dark:bg-dark-800 p-4 rounded-2xl border border-gray-100 dark:border-dark-700 flex justify-between items-center shadow-sm">
                                 <div>
                                     <h4 className="font-bold text-gray-900 dark:text-white">{cat.ar}</h4>
                                     <span className="text-sm text-gray-500 dark:text-gray-400">{cat.en} / {cat.tr}</span>
                                 </div>
                                 {cat.id !== 'all' && (
                                     <button onClick={() => handleDeleteCategory(cat.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                                         <Trash2 size={18} />
                                     </button>
                                 )}
                             </div>
                         ))}
                     </div>
                  </div>
              )}
          </div>
       </div>
    </div>
  );
};

export default Dashboard;
