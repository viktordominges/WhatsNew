// frontend/src/config/categoriesConfig.js

export const CATEGORIES = [
  {
    id: 1,
    slug: 'concerts',
    name: 'Concerts',
    icon: 'concert'
  },
  {
    id: 2,
    slug: 'festivals',
    name: 'Festivals',
    icon: 'fest'
  },
  {
    id: 3,
    slug: 'enfants',
    name: 'Enfants',
    icon: 'teddy'
  },
  {
    id: 4,
    slug: 'theatre',
    name: 'Théâtre',
    icon: 'theatre'
  },
  {
    id: 5,
    slug: 'expositions',
    name: 'Expositions',
    icon: 'expo'
  },
  {
    id: 6,
    slug: 'cinema',
    name: 'Cinéma',
    icon: 'cinema'
  }
];

// Хелперы для работы со slug
export const getCategoryBySlug = (slug) => {
  return CATEGORIES.find(cat => cat.slug === slug);
};

export const getCategoryById = (id) => {
  return CATEGORIES.find(cat => cat.id === id);
};

export const getCategoryName = (slug) => {
  return getCategoryBySlug(slug)?.name || '';
};

export const getCategoryId = (slug) => {
  return getCategoryBySlug(slug)?.id || null;
};