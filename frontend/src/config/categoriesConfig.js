let cachedCategories = null;

async function loadCategories() {
    if (cachedCategories) {
        return cachedCategories;
    }

    const response = await fetch('/mock-data.json');

    if (!response.ok) {
        throw new Error('Failed to load mock-data.json');
    }

    const data = await response.json();

    cachedCategories = data.categories || [];

    console.log(cachedCategories);
    

    return cachedCategories;
}

// ==============================
// Public API
// ==============================

export async function getAllCategories() {
    return await loadCategories();
}

export async function getCategoryById(id) {
    const categories = await loadCategories();
    return categories.find(cat => cat.id === id) || null;
}

export async function getCategoryBySlug(slug) {
    const categories = await loadCategories();
    return categories.find(cat => cat.slug === slug) || null;
}

export async function getCategoryName(slug) {
    const category = await getCategoryBySlug(slug);
    return category?.name || '';
}

export async function getCategoryId(slug) {
    const category = await getCategoryBySlug(slug);
    return category?.id || null;
}
