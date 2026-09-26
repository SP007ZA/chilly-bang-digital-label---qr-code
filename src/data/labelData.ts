export interface IngredientItem {
  number: number;
  name: string;
}

export interface SpecItem {
  label: string;
  value: string;
}

export const CHILLY_BANG_INFO = {
  name: "Chilly Bang - Homemade Chillie by OG",
  shortTitle: "Chilly Bang",
  subtitle: "Homemade Chillie by OG",
  tagline: "Bold, aromatic South African artisan chilli condiment & cooking sauce",
  netVolume: "260ml",
  netVolumeDetails: "260ml jar",
  usage: "Condiment or cooking sauce.",
  storage: "Refrigerate after opening.",
  bestBefore: "8 months from the date packaged",
  manufacturer: "OG · Chilly Bang",
  country: "Product of South Africa",
  location: "Centurion, South Africa",
  whatsappNumber: "+27795184779",
  whatsappDisplayNumber: "+27 79 518 4779",
  whatsappDefaultMsg: "Hi Chilly Bang, I'd like to order a jar 🌶️",
  whatsappLink: "https://wa.me/27795184779?text=Hi%20Chilly%20Bang%2C%20I%27d%20like%20to%20order%20a%20jar%20%F0%9F%8C%B6",
  
  specs: [
    { label: "Product", value: "Chilly Bang - Homemade Chillie by OG" },
    { label: "Net contents", value: "260ml" },
    { label: "Usage", value: "Condiment or cooking sauce." },
    { label: "Storage", value: "Refrigerate after opening." },
    { label: "Best before", value: "8 months from the date packaged" },
    { label: "Manufacturer", value: "OG · Chilly Bang" },
    { label: "Country", value: "Product of South Africa" },
  ] as SpecItem[],

  ingredients: [
    { number: 1, name: "Selected Chilli" },
    { number: 2, name: "Garlic & Peppers" },
    { number: 3, name: "Sweetened Chilli Blend" },
    { number: 4, name: "Aromatic Herbs & Spices" },
    { number: 5, name: "Permitted Presevatives" },

  ] as IngredientItem[],

  ingredientNote: "As listed on the jar label.",

  allergen: {
    title: "May contain declared allergens",
    description:
      "This sauce includes a commercially produced sweetened chilli blend, which may contain allergens such as gluten, soy or sulphites depending on the manufacturer's formulation. If you have a known food allergy, please contact us before consuming."
  },

  footerText: "Chilly Bang · Homemade by OG · Centurion, South Africa"
};
