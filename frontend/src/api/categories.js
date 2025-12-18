// api/categories.js

let cachedCategories = null;

export async function fetchCategories() {
    if (cachedCategories) return cachedCategories;

    const res = await fetch('/mock-data.json');
    const data = await res.json();
    cachedCategories = data.categories || [];

    return cachedCategories;
}
