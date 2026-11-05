
import React from 'react';
import { ServiceType, Language, ServiceTypeLabels } from '../lib/types';
import { MapPin, ShoppingBag, UtensilsCrossed, ArrowRight } from 'lucide-react';
import { LANDING_BG, TRANSLATIONS } from '../lib/constants';
import { Logo } from './Icons';

interface ServiceSelectionProps {
  onSelect: (type: ServiceType) => void;
  language: Language;
}

const ServiceSelection: React.FC<ServiceSelectionProps> = ({ onSelect, language }) => {
  const t = TRANSLATIONS[language];

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Background with strong blur */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] hover:scale-110"
        style={{ backgroundImage: `url(${LANDING_BG})` }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-b from-maroon-dark/80 to-black/90 backdrop-blur-md"></div>

      <div className="relative z-10 w-full max-w-4xl px-4 grid md:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Branding */}
        <div className="text-center md:text-start flex flex-col items-center md:items-start animate-slide-up">
           <div className="w-56 md:w-64 mb-8 drop-shadow-2xl text-white">
              <Logo className="w-full h-auto fill-white" />
           </div>
           <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight drop-shadow-lg">
             {t.title}
           </h1>
           <p className="text-xl text-gold font-medium tracking-wide opacity-90 drop-shadow-md max-w-md">
             {t.slogan}
           </p>
        </div>

        {/* Right Side: Selection Cards */}
        <div className="flex flex-col gap-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <p className="text-center md:text-start text-white/60 text-sm mb-2 uppercase tracking-widest font-bold">{t.howToOrder}</p>
          
          <ServiceCard 
            icon={<UtensilsCrossed size={28} />}
            title={ServiceTypeLabels.dine_in[language]}
            desc={t.dineinDesc}
            onClick={() => onSelect('dine_in')}
            delay="0.2s"
          />

          <ServiceCard 
            icon={<ShoppingBag size={28} />}
            title={ServiceTypeLabels.pickup[language]}
            desc={t.pickupDesc}
            onClick={() => onSelect('pickup')}
            delay="0.3s"
          />

          <ServiceCard 
            icon={<MapPin size={28} />}
            title={ServiceTypeLabels.delivery[language]}
            desc={t.deliveryDesc}
            onClick={() => onSelect('delivery')}
            delay="0.4s"
          />
        </div>
      </div>
      
      <div className="absolute bottom-6 text-white/30 text-xs font-medium">
        &copy; {new Date().getFullYear()} Iskandar Efendi.
      </div>
    </div>
  );
};

interface ServiceCardProps {
    icon: React.ReactNode;
    title: string;
    desc: string;
    onClick: () => void;
    delay: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, desc, onClick, delay }) => {
    return (
        <button
            onClick={onClick}
            className="group relative overflow-hidden bg-white/10 hover:bg-white/15 backdrop-blur-xl border border-white/10 hover:border-gold/50 rounded-3xl p-1 transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-maroon-dark/50 w-full text-start animate-slide-up"
            style={{ animationDelay: delay, animationFillMode: 'backwards' }}
        >
            <div className="flex items-center p-4">
                <div className="w-16 h-16 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl flex items-center justify-center text-gold shadow-inner border border-white/5 group-hover:scale-110 transition-transform duration-300 shrink-0">
                    {icon}
                </div>
                <div className="px-5 flex-1">
                    <h3 className="text-xl font-bold text-white group-hover:text-gold transition-colors">{title}</h3>
                    <p className="text-sm text-gray-300 mt-1 opacity-80 font-light">{desc}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 group-hover:bg-gold group-hover:text-maroon transition-all transform rtl:rotate-180">
                    <ArrowRight size={18} />
                </div>
            </div>
        </button>
    );
}

export default ServiceSelection;
