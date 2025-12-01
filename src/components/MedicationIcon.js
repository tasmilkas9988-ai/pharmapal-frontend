import React from 'react';
import { 
  Pill, Droplets, Wind, Syringe, 
  Package, Box, Heart, Sparkles, 
  Stethoscope, Activity, Beaker, TestTube
} from 'lucide-react';

// Simple icon mapping
const ICON_MAP = {
  // Pills & Tablets
  'tablet': { icon: Pill, color: 'text-blue-600' },
  'capsule': { icon: Pill, color: 'text-purple-600' },
  'softgel': { icon: Pill, color: 'text-orange-600' },
  'blister': { icon: Pill, color: 'text-blue-500' },
  'tablet_container': { icon: Package, color: 'text-blue-600' },
  
  // Liquids
  'syrup': { icon: Beaker, color: 'text-pink-600' },
  'drops': { icon: Droplets, color: 'text-blue-400' },
  'eye_drops': { icon: Droplets, color: 'text-cyan-600' },
  'ear_drops': { icon: Droplets, color: 'text-teal-600' },
  'bottle': { icon: Beaker, color: 'text-amber-600' },
  'suspension': { icon: Beaker, color: 'text-orange-500' },
  'oral_suspension': { icon: Beaker, color: 'text-pink-500' },
  'elixir': { icon: Beaker, color: 'text-purple-500' },
  'dropper_container': { icon: Droplets, color: 'text-blue-500' },
  'single_dose_container': { icon: Droplets, color: 'text-cyan-500' },
  
  // Sprays & Inhalers
  'nasal_spray': { icon: Wind, color: 'text-green-600' },
  'oral_spray': { icon: Wind, color: 'text-teal-600' },
  'topical_spray': { icon: Wind, color: 'text-blue-600' },
  'spray_container': { icon: Wind, color: 'text-emerald-600' },
  'nasal_applicator': { icon: Wind, color: 'text-sky-600' },
  'inhaler': { icon: Wind, color: 'text-blue-700' },
  'pressurised_can': { icon: Wind, color: 'text-indigo-600' },
  'nebulizer_solution': { icon: Wind, color: 'text-cyan-700' },
  
  // Injections
  'injection': { icon: Syringe, color: 'text-red-600' },
  'vial': { icon: TestTube, color: 'text-red-500' },
  'ampoule': { icon: TestTube, color: 'text-pink-600' },
  'prefilled_syringe': { icon: Syringe, color: 'text-rose-600' },
  'injection_syringe': { icon: Syringe, color: 'text-red-500' },
  'prefilled_pen': { icon: Syringe, color: 'text-purple-600' },
  'autoinjector_device': { icon: Syringe, color: 'text-fuchsia-600' },
  'bag_infusion': { icon: Activity, color: 'text-blue-500' },
  'cartridge': { icon: TestTube, color: 'text-gray-600' },
  
  // Topical
  'ointment': { icon: Heart, color: 'text-yellow-600' },
  'cream': { icon: Heart, color: 'text-pink-500' },
  'lotion': { icon: Heart, color: 'text-purple-500' },
  'tube': { icon: Heart, color: 'text-orange-500' },
  'dental_gel': { icon: Heart, color: 'text-cyan-500' },
  'paste': { icon: Heart, color: 'text-blue-400' },
  'patch': { icon: Sparkles, color: 'text-green-600' },
  'transdermal_patch': { icon: Sparkles, color: 'text-emerald-600' },
  
  // Powders & Others
  'sachet': { icon: Package, color: 'text-amber-600' },
  'powder': { icon: Package, color: 'text-yellow-600' },
  'granules': { icon: Package, color: 'text-orange-600' },
  'box': { icon: Box, color: 'text-gray-600' },
  'jar': { icon: Beaker, color: 'text-brown-600' },
  'ovule_vaginal': { icon: Pill, color: 'text-pink-600' },
  'implanter': { icon: Stethoscope, color: 'text-indigo-600' },
  
  // Default
  'default': { icon: Pill, color: 'text-gray-600' }
};

const MedicationIcon = ({ iconType = 'default', size = 'lg', className = '' }) => {
  const config = ICON_MAP[iconType] || ICON_MAP['default'];
  const IconComponent = config.icon;
  
  const sizeMap = {
    'sm': 32,
    'md': 40,
    'lg': 56,
    'xl': 72
  };
  
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <IconComponent 
        size={sizeMap[size]} 
        className={config.color}
        strokeWidth={1.5}
      />
    </div>
  );
};

export default MedicationIcon;
