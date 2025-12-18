<!-- ============================================================================
     DashboardLayout.vue - Основной Layout для ЛК
     ============================================================================ -->
<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar.vue';
import DashboardHeader from '@/components/dashboard/DashboardHeader.vue';

const authStore = useAuthStore();
const sidebarOpen = ref(true);

const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value;
};

onMounted(async () => {
    if (!authStore.user) {
        await authStore.checkAuth();
    }
});
</script>

<template>
    <div class="dashboard-layout">
        <DashboardSidebar 
            :open="sidebarOpen" 
            @toggle="toggleSidebar"
        />
        
        <div class="dashboard-main" :class="{ 'sidebar-closed': !sidebarOpen }">
            <DashboardHeader 
                :sidebar-open="sidebarOpen"
                @toggle-sidebar="toggleSidebar"
            />
            
            <main class="dashboard-content">
                <RouterView />
            </main>
        </div>
    </div>
</template>

<style scoped>
.dashboard-layout {
    display: flex;
    min-height: 100vh;
    background-color: var(--color-light-background);
}

.dashboard-main {
    flex: 1;
    margin-left: 280px;
    transition: margin-left 0.3s ease;
}

.dashboard-main.sidebar-closed {
    margin-left: 80px;
}

.dashboard-content {
    padding: 30px;
    max-width: 1400px;
    margin: 0 auto;
}

@media (max-width: 1024px) {
    .dashboard-main {
        margin-left: 0;
    }
    
    .dashboard-main.sidebar-closed {
        margin-left: 0;
    }
}
</style>