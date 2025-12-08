import data from '@/mock-data.json';
// Хелперы для работы со slug
export const getCategoryBySlug = (slug) => {
    return data.categories.find(cat => cat.slug === slug);
};

export const getCategoryById = (id) => {
    return data.categories.find(cat => cat.id === id);
};

export const getCategoryName = (slug) => {
    return getCategoryBySlug(slug)?.name || '';
};

export const getCategoryId = (slug) => {
    return getCategoryBySlug(slug)?.id || null;
};