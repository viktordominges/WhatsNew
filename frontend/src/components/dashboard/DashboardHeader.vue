<!-- ============================================================================
     DashboardHeader.vue - Шапка ЛК
     ============================================================================ -->
<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import Breadcrumbs from './Breadcrumbs.vue';

defineProps({
    sidebarOpen: {
        type: Boolean,
        default: true
    }
});

const emit = defineEmits(['toggle-sidebar']);

const router = useRouter();
const authStore = useAuthStore();

const logout = async () => {
    await authStore.logout();
    router.push('/login');
};
</script>

<template>
    <header class="dashboard-header">
        <div class="header-left">
            <button 
                class="mobile-menu-btn"
                @click="emit('toggle-sidebar')"
            >
                ☰
            </button>
            <Breadcrumbs />
        </div>

        <div class="header-right">
            <button class="icon-btn" title="Уведомления">
                🔔
            </button>
            <button class="btn orange-btn" @click="logout">
                Выйти
            </button>
        </div>
    </header>
</template>

<style scoped>
.dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 30px;
    background-color: var(--color-white);
    border-bottom: 1px solid #e0e0e0;
    position: sticky;
    top: 0;
    z-index: 90;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 20px;
}

.mobile-menu-btn {
    display: none;
    padding: 10px;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: var(--color-dark-text);
}

.header-right {
    display: flex;
    align-items: center;
    gap: 15px;
}

.icon-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: none;
    background-color: var(--color-light-background);
    font-size: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.icon-btn:hover {
    background-color: #d0d0d0;
}

@media (max-width: 1024px) {
    .mobile-menu-btn {
        display: block;
    }
}

@media (max-width: 768px) {
    .dashboard-header {
        padding: 15px 20px;
    }
}
</style>