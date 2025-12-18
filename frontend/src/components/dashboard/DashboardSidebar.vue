<!-- ============================================================================
     DashboardSidebar.vue - Боковое меню
     ============================================================================ -->
<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const props = defineProps({
    open: {
        type: Boolean,
        default: true
    }
});

const emit = defineEmits(['toggle']);

const route = useRoute();
const authStore = useAuthStore();

const menuItems = [
    {
        name: 'Главная',
        path: '/dashboard',
        icon: '🏠',
        exact: true
    },
    {
        name: 'Мои организаторы',
        path: '/dashboard/organizers',
        icon: '🏢'
    },
    {
        name: 'События',
        path: '/dashboard/activities',
        icon: '🎉'
    },
    {
        name: 'Настройки',
        path: '/dashboard/settings',
        icon: '⚙️'
    }
];

const isActive = (item) => {
    if (item.exact) {
        return route.path === item.path;
    }
    return route.path.startsWith(item.path);
};
</script>

<template>
    <aside class="sidebar" :class="{ 'sidebar-closed': !open }">
        <div class="sidebar-header">
            <router-link to="/" class="logo">
                <span v-if="open">Quoi de neuf</span>
                <span v-else>QN</span>
            </router-link>
        </div>

        <nav class="sidebar-nav">
            <router-link
                v-for="item in menuItems"
                :key="item.path"
                :to="item.path"
                class="nav-item"
                :class="{ active: isActive(item) }"
            >
                <span class="nav-icon">{{ item.icon }}</span>
                <span v-if="open" class="nav-text">{{ item.name }}</span>
            </router-link>
        </nav>

        <div class="sidebar-footer">
            <div v-if="open" class="user-info">
                <div class="user-avatar">
                    {{ authStore.username?.[0]?.toUpperCase() || 'U' }}
                </div>
                <div class="user-details">
                    <div class="user-name">{{ authStore.username }}</div>
                    <div class="user-email">{{ authStore.email }}</div>
                </div>
            </div>
            <button 
                class="toggle-btn"
                @click="emit('toggle')"
                :title="open ? 'Свернуть' : 'Развернуть'"
            >
                {{ open ? '◀' : '▶' }}
            </button>
        </div>
    </aside>
</template>

<style scoped>
.sidebar {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    width: 280px;
    background-color: var(--color-dark-background);
    color: var(--color-light-text);
    display: flex;
    flex-direction: column;
    transition: width 0.3s ease;
    z-index: 100;
}

.sidebar-closed {
    width: 80px;
}

.sidebar-header {
    padding: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
    font-size: var(--font-size-md);
    font-weight: var(--font-weight-bold);
    color: var(--color-light-text);
    text-decoration: none;
    text-transform: uppercase;
}

.sidebar-nav {
    flex: 1;
    padding: 20px 0;
    overflow-y: auto;
}

.nav-item {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px 20px;
    color: var(--color-light-text);
    text-decoration: none;
    transition: all 0.3s ease;
    position: relative;
}

.nav-item:hover {
    background-color: rgba(255, 255, 255, 0.05);
}

.nav-item.active {
    background-color: var(--color-blue);
    color: var(--color-white);
}

.nav-item.active::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 4px;
    background-color: var(--color-orange);
}

.nav-icon {
    font-size: 24px;
    min-width: 24px;
    text-align: center;
}

.nav-text {
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-medium);
    white-space: nowrap;
}

.sidebar-closed .nav-text {
    display: none;
}

.sidebar-footer {
    padding: 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.user-info {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 15px;
}

.user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--color-blue);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: var(--font-weight-bold);
    font-size: var(--font-size-sm);
}

.user-details {
    flex: 1;
    min-width: 0;
}

.user-name {
    font-weight: var(--font-weight-semibold);
    font-size: var(--font-size-xs);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.user-email {
    font-size: var(--font-size-xxs);
    color: var(--color-gray-light);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.toggle-btn {
    width: 100%;
    padding: 10px;
    background-color: rgba(255, 255, 255, 0.1);
    border: none;
    color: var(--color-light-text);
    border-radius: var(--btn-border-radius);
    cursor: pointer;
    transition: all 0.3s ease;
}

.toggle-btn:hover {
    background-color: rgba(255, 255, 255, 0.2);
}

@media (max-width: 1024px) {
    .sidebar {
        transform: translateX(-100%);
    }
    
    .sidebar:not(.sidebar-closed) {
        transform: translateX(0);
    }
}
</style>