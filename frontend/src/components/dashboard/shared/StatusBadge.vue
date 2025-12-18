<!-- ============================================================================
     StatusBadge.vue - Бейдж статуса
     ============================================================================ -->
<script setup>
import { computed } from 'vue';

const props = defineProps({
    status: {
        type: String,
        required: true,
        validator: (value) => ['draft', 'published', 'cancelled'].includes(value)
    }
});

const statusConfig = computed(() => {
    const configs = {
        draft: {
            label: 'Черновик',
            icon: '📝',
            class: 'status-draft'
        },
        published: {
            label: 'Опубликовано',
            icon: '✅',
            class: 'status-published'
        },
        cancelled: {
            label: 'Отменено',
            icon: '❌',
            class: 'status-cancelled'
        }
    };
    return configs[props.status];
});
</script>

<template>
    <span class="status-badge" :class="statusConfig.class">
        <span class="status-icon">{{ statusConfig.icon }}</span>
        <span class="status-label">{{ statusConfig.label }}</span>
    </span>
</template>

<style scoped>
.status-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: var(--font-size-xxs);
    font-weight: var(--font-weight-semibold);
    white-space: nowrap;
}

.status-icon {
    font-size: 14px;
}

.status-draft {
    background-color: #fff3cd;
    color: var(--color-warning);
}

.status-published {
    background-color: #d4edda;
    color: var(--color-success);
}

.status-cancelled {
    background-color: #f8d7da;
    color: var(--color-error);
}
</style>