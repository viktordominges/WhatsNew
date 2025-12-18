<!-- ============================================================================
     OrganizerCard.vue - Карточка организатора
     ============================================================================ -->
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import DeleteOrganizerModal from './DeleteOrganizerModal.vue';

const props = defineProps({
    organizer: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['deleted']);

const router = useRouter();
const showDeleteModal = ref(false);

const goToActivities = () => {
    router.push(`/dashboard/organizers/${props.organizer.slug}/activities`);
};

const goToEdit = () => {
    router.push(`/dashboard/organizers/${props.organizer.slug}/edit`);
};

const handleDeleted = () => {
    emit('deleted', props.organizer.slug);
};
</script>

<template>
    <div class="organizer-card">
        <div class="card-header">
            <h3 class="organizer-name">{{ organizer.name }}</h3>
        </div>

        <div class="card-body">
            <div class="info-row">
                <span class="icon">📧</span>
                <a :href="`mailto:${organizer.email}`" class="info-text">
                    {{ organizer.email }}
                </a>
            </div>

            <div class="info-row">
                <span class="icon">📞</span>
                <a :href="`tel:${organizer.phone}`" class="info-text">
                    {{ organizer.phone }}
                </a>
            </div>

            <div v-if="organizer.website" class="info-row">
                <span class="icon">🌐</span>
                <a :href="organizer.website" target="_blank" class="info-text">
                    {{ organizer.website }}
                </a>
            </div>
        </div>

        <div class="card-footer">
            <button class="btn-action btn-primary" @click="goToActivities">
                📅 События
            </button>
            <button class="btn-action btn-secondary" @click="goToEdit">
                ✏️ Редактировать
            </button>
            <button class="btn-action btn-danger" @click="showDeleteModal = true">
                🗑️ Удалить
            </button>
        </div>

        <DeleteOrganizerModal
            v-if="showDeleteModal"
            :organizer="organizer"
            @close="showDeleteModal = false"
            @deleted="handleDeleted"
        />
    </div>
</template>

<style scoped>
.organizer-card {
    background: var(--color-white);
    border-radius: var(--card-border-radius);
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.organizer-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-header {
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 2px solid var(--color-light-background);
}

.organizer-name {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-bold);
    color: var(--color-dark-text);
    margin: 0;
}

.card-body {
    margin-bottom: 20px;
}

.info-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
}

.icon {
    font-size: 20px;
}

.info-text {
    font-size: var(--font-size-xxs);
    color: var(--color-gray-dark);
    text-decoration: none;
    word-break: break-all;
}

.info-text:hover {
    color: var(--color-blue);
}

.card-footer {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.btn-action {
    flex: 1;
    min-width: fit-content;
    padding: 8px 12px;
    border: none;
    border-radius: var(--btn-border-radius);
    font-size: var(--font-size-xxs);
    font-weight: var(--font-weight-semibold);
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-primary {
    background-color: var(--color-blue);
    color: var(--color-white);
}

.btn-primary:hover {
    background-color: #3aa5c9;
}

.btn-secondary {
    background-color: var(--color-gray-light);
    color: var(--color-white);
}

.btn-secondary:hover {
    background-color: #7a7a7a;
}

.btn-danger {
    background-color: var(--color-error);
    color: var(--color-white);
}

.btn-danger:hover {
    background-color: #8a1515;
}
</style>