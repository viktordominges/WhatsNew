<!-- ============================================================================
DashboardView.vue - Главная страница ЛК
============================================================================ -->
<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useAuthStore } from '@/stores/authStore';
import StatsCard from '@/components/dashboard/shared/StatsCard.vue';

const router = useRouter();
const dashboardStore = useDashboardStore();
const authStore = useAuthStore();

onMounted(() => {
    dashboardStore.fetchStats();
});
</script>

<template>
    <div class="dashboard-view">
        <div class="page-header">
            <div>
                <h1>Добро пожаловать, {{ authStore.username }}!</h1>
                <p>Управляйте своими организаторами и событиями</p>
            </div>
            <button class="btn orange-btn" @click="router.push('/dashboard/activities/create')">
                + Создать событие
            </button>
        </div>

        <div v-if="dashboardStore.loading" class="loading">
            <div class="spinner"></div>
            <p>Загрузка данных...</p>
        </div>

        <div v-else class="dashboard-content">
            <!-- Статистика -->
            <div class="stats-grid">
                <StatsCard
                    title="Организаторы"
                    :value="dashboardStore.stats.totalOrganizers"
                    icon="🏢"
                    color="blue"
                />
                <StatsCard
                    title="Всего событий"
                    :value="dashboardStore.stats.totalActivities"
                    icon="🎉"
                    color="green"
                />
                <StatsCard
                    title="Опубликовано"
                    :value="dashboardStore.stats.publishedActivities"
                    icon="✅"
                    color="orange"
                />
                <StatsCard
                    title="Черновики"
                    :value="dashboardStore.stats.draftActivities"
                    icon="📝"
                    color="purple"
                />
            </div>

            <!-- Быстрые действия -->
            <div class="quick-actions">
                <h2>Быстрые действия</h2>
                <div class="actions-grid">
                    <button class="action-card" @click="router.push('/dashboard/organizers/create')">
                        <div class="action-icon">🏢</div>
                        <div class="action-title">Добавить организатора</div>
                    </button>
                    <button class="action-card" @click="router.push('/dashboard/activities/create')">
                        <div class="action-icon">🎉</div>
                        <div class="action-title">Создать событие</div>
                    </button>
                    <button class="action-card" @click="router.push('/dashboard/organizers')">
                        <div class="action-icon">📋</div>
                        <div class="action-title">Мои организаторы</div>
                    </button>
                    <button class="action-card" @click="router.push('/dashboard/settings')">
                        <div class="action-icon">⚙️</div>
                        <div class="action-title">Настройки</div>
                    </button>
                </div>
            </div>

            <!-- Последние события -->
            <div v-if="dashboardStore.recentActivities.length > 0" class="recent-section">
                <h2>Последние события</h2>
                <div class="recent-list">
                    <div
                        v-for="activity in dashboardStore.recentActivities"
                        :key="activity.id"
                        class="recent-item"
                        @click="router.push(`/dashboard/activities/${activity.slug}/edit`)"
                    >
                        <div class="activity-info">
                            <h4>{{ activity.name }}</h4>
                            <p>{{ new Date(activity.date).toLocaleDateString('ru-RU') }}</p>
                        </div>
                        <StatusBadge :status="activity.status" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.dashboard-view {
    max-width: 1200px;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 40px;
}

.page-header h1 {
    font-size: var(--font-size-xxl);
    font-weight: var(--font-weight-bold);
    color: var(--color-dark-text);
    margin-bottom: 8px;
}

.page-header p {
    font-size: var(--font-size-xs);
    color: var(--color-gray-light);
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 40px;
}

.quick-actions h2,
.recent-section h2 {
    font-size: var(--font-size-md);
    font-weight: var(--font-weight-bold);
    color: var(--color-dark-text);
    margin-bottom: 20px;
}

.actions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 40px;
}

.action-card {
    background: var(--color-white);
    border: 2px solid var(--color-light-background);
    border-radius: var(--card-border-radius);
    padding: 30px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
}

.action-card:hover {
    border-color: var(--color-blue);
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.action-icon {
    font-size: 48px;
    margin-bottom: 12px;
}

.action-title {
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-semibold);
    color: var(--color-dark-text);
}

.recent-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.recent-item {
    background: var(--color-white);
    border-radius: var(--card-border-radius);
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s ease;
}

.recent-item:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.activity-info h4 {
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-semibold);
    color: var(--color-dark-text);
    margin-bottom: 4px;
}

.activity-info p {
    font-size: var(--font-size-xxs);
    color: var(--color-gray-light);
}

.loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px;
    color: var(--color-gray-light);
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid var(--color-light-background);
    border-top-color: var(--color-blue);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin-bottom: 15px;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
    .page-header {
        flex-direction: column;
        gap: 20px;
    }

    .page-header .btn {
        width: 100%;
    }
}
</style>