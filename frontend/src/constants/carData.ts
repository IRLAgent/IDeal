/**
 * Comprehensive list of car makes and models popular in Ireland
 * This list is used for the create listing form
 */

export const CAR_MAKES_MODELS: Record<string, string[]> = {
  'Audi': ['A1', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q2', 'Q3', 'Q5', 'Q7', 'Q8', 'TT', 'R8', 'e-tron'],
  'BMW': ['1 Series', '2 Series', '3 Series', '4 Series', '5 Series', '6 Series', '7 Series', '8 Series', 'X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7', 'Z4', 'i3', 'i4', 'iX'],
  'Citroën': ['C1', 'C3', 'C3 Aircross', 'C4', 'C4 Cactus', 'C5 Aircross', 'Berlingo'],
  'Dacia': ['Sandero', 'Duster', 'Logan'],
  'Fiat': ['500', '500X', 'Panda', 'Tipo', 'Punto'],
  'Ford': ['Fiesta', 'Focus', 'Mondeo', 'Kuga', 'Puma', 'EcoSport', 'Mustang', 'Ranger', 'Transit'],
  'Honda': ['Civic', 'CR-V', 'HR-V', 'Jazz', 'Accord'],
  'Hyundai': ['i10', 'i20', 'i30', 'Tucson', 'Kona', 'Santa Fe', 'Ioniq', 'Ioniq 5'],
  'Kia': ['Picanto', 'Rio', 'Ceed', 'Sportage', 'Niro', 'Sorento', 'Stonic', 'EV6'],
  'Mazda': ['2', '3', '6', 'CX-3', 'CX-5', 'CX-30', 'MX-5'],
  'Mercedes-Benz': ['A-Class', 'B-Class', 'C-Class', 'E-Class', 'S-Class', 'CLA', 'CLS', 'GLA', 'GLB', 'GLC', 'GLE', 'GLS', 'EQA', 'EQC'],
  'Nissan': ['Micra', 'Juke', 'Qashqai', 'X-Trail', 'Leaf', 'Navara'],
  'Opel': ['Corsa', 'Astra', 'Insignia', 'Crossland', 'Grandland', 'Mokka'],
  'Peugeot': ['108', '208', '308', '508', '2008', '3008', '5008', 'Rifter'],
  'Renault': ['Clio', 'Megane', 'Captur', 'Kadjar', 'Koleos', 'Zoe'],
  'SEAT': ['Ibiza', 'Leon', 'Arona', 'Ateca', 'Tarraco'],
  'Skoda': ['Fabia', 'Octavia', 'Superb', 'Kamiq', 'Karoq', 'Kodiaq', 'Enyaq'],
  'Toyota': ['Aygo', 'Yaris', 'Corolla', 'Camry', 'C-HR', 'RAV4', 'Highlander', 'Land Cruiser', 'Prius'],
  'Volkswagen': ['Polo', 'Golf', 'Passat', 'Tiguan', 'T-Roc', 'T-Cross', 'Touareg', 'Arteon', 'ID.3', 'ID.4'],
  'Volvo': ['V40', 'V60', 'V90', 'S60', 'S90', 'XC40', 'XC60', 'XC90'],
};

export const CAR_MAKES = Object.keys(CAR_MAKES_MODELS).sort();

export const FUEL_TYPES = ['Petrol', 'Diesel', 'Hybrid', 'Electric', 'Plug-in Hybrid'];

export const TRANSMISSIONS = ['Manual', 'Automatic'];

/**
 * Get models for a specific make
 */
export function getModelsForMake(make: string): string[] {
  return CAR_MAKES_MODELS[make] || [];
}
