
<!-- Universal-tabs component. Posible tab types: component, list, slot -->

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
    items: {
        type: Array,
        required: true
        /*
        [
            {
                label: 'Description',
                component: DescriptionTab
            },
            {
                label: 'Contacts',
                items: [{ name, email }]
            },
            {
                label: 'Custom',
                slot: 'customTab'
            }
        ]
        */
    },
    defaultActive: {
        type: Number,
        default: 0
    }
})

const activeIndex = ref(props.defaultActive)
const activeTab = computed(() => props.items[activeIndex.value])

function setActive(index) {
    activeIndex.value = index
}
</script>

<template>
    <div class="tabs">
        <!-- HEADERS -->
        <div class="tabs-nav">
            <button
                v-for="(tab, index) in items"
                :key="index"
                class="tabs-btn"
                :class="{ active: index === activeIndex }"
                @click="setActive(index)"
            >
                {{ tab.label }}
            </button>
        </div>

        <!-- CONTENT -->
        <div class="tabs-content">
            <transition name="fade" mode="out-in">
                <div :key="activeIndex">

                    <!-- SLOT TAB -->
                    <slot
                        v-if="activeTab.slot"
                        :name="activeTab.slot"
                    />
                    <!-- COMPONENT TAB -->
                    <component
                        v-else-if="activeTab.component"
                        :is="activeTab.component"
                        v-bind="activeTab.props || {}"
                    />

                    <!-- LIST TAB -->
                    <ul
                        v-else-if="activeTab.items"
                        class="tab-list"
                    >
                        <li
                            v-for="(item, i) in activeTab.items"
                            :key="i"
                        >
                            <strong>{{ item.name }}</strong><br>
                            <a :href="`mailto:${item.email}`">
                                {{ item.email }}
                            </a>
                        </li>
                    </ul>
                </div>
            </transition>
        </div>
    </div>
</template>

<style scoped>
.tabs-nav {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 30px;
    /* border-bottom: 1px solid #ddd; */
}

.tabs-btn {
    padding: 10px 20px;
    background: none;
    border: none;
    cursor: pointer;
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-bold);
}

.tabs-btn.active {
    border-bottom: 2px solid #000;
}

.tabs-content {
    margin: 30px auto;
    width: 100%;
    max-width: 800px;
    /* text-align: center; */
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity .2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.tab-list {
    padding: 12px 0;
    list-style: none;
}
</style>
