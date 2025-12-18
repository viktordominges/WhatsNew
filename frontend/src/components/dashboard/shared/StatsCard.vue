<!-- ============================================================================
     StatsCard.vue - Карточка статистики
     ============================================================================ -->
<script setup>
defineProps({
    title: {
        type: String,
        required: true
    },
    value: {
        type: [String, Number],
        required: true
    },
    icon: {
        type: String,
        default: '📊'
    },
    color: {
        type: String,
        default: 'blue',
        validator: (value) => ['blue', 'green', 'orange', 'purple'].includes(value)
    },
    trend: {
        type: Object,
        default: null
    }
});
</script>

<template>
    <div class="stats-card" :class="`stats-${color}`">
        <div class="stats-icon">{{ icon }}</div>
        
        <div class="stats-content">
            <div class="stats-title">{{ title }}</div>
            <div class="stats-value">{{ value }}</div>
            
            <div v-if="trend" class="stats-trend" :class="trend.direction">
                <span class="trend-icon">
                    {{ trend.direction === 'up' ? '↑' : '↓' }}
                </span>
                <span class="trend-value">{{ trend.value }}</span>
                <span class="trend-label">{{ trend.label }}</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.stats-card {
    background: var(--color-white);
    border-radius: var(--card-border-radius);
    padding: 24px;
    display: flex;
    gap: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    border-left: 4px solid;
}

.stats-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stats-blue {
    border-left-color: var(--color-blue);
}

.stats-green {
    border-left-color: var(--color-green);
}

.stats-orange {
    border-left-color: var(--color-orange);
}

.stats-purple {
    border-left-color: #9b59b6;
}

.stats-icon {
    font-size: 48px;
    line-height: 1;
}

.stats-content {
    flex: 1;
}

.stats-title {
    font-size: var(--font-size-xxs);
    color: var(--color-gray-light);
    text-transform: uppercase;
    font-weight: var(--font-weight-semibold);
    margin-bottom: 8px;
}

.stats-value {
    font-size: var(--font-size-xxl);
    font-weight: var(--font-weight-bold);
    color: var(--color-dark-text);
    margin-bottom: 8px;
}

.stats-trend {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: var(--font-size-xxs);
}

.stats-trend.up {
    color: var(--color-success);
}

.stats-trend.down {
    color: var(--color-error);
}

.trend-icon {
    font-weight: bold;
    font-size: 16px;
}

.trend-value {
    font-weight: var(--font-weight-bold);
}

.trend-label {
    color: var(--color-gray-light);
}
</style>