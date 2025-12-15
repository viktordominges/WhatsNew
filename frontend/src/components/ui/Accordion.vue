<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
    items: {
        type: Array,
        required: true,
        default: () => []
    },
    defaultOpenIndex: {
        type: Number,
        default: null
    }
})

const openIndex = ref(props.defaultOpenIndex)

watch(
    () => props.defaultOpenIndex,
    (newValue) => {
        openIndex.value = newValue
    }
)

function toggle(index) {
    openIndex.value = openIndex.value === index ? null : index
}
</script>

<template>
    <section class="faq">
        <slot name="title">
            <h2 class="faq-title">QUESTIONS FRÉQUEMMENT POSÉES</h2>
        </slot>

        <div
        v-for="(item, index) in items"
        :key="index"
        class="faq-item"
        >
            <button class="faq-question" @click="toggle(index)">
                <span class="icon">
                {{ openIndex === index ? '×' : '+' }}
                </span>
                {{ item.question }}
            </button>

            <transition name="accordion">
                <div
                    v-if="openIndex === index"
                    class="faq-answer"
                >
                    <p>{{ item.answer }}</p>
                </div>
            </transition>
        </div>
    </section>
</template>

<style scoped>
    .faq {
        margin: 0 auto;
        width: 70%;
    }

    .faq h2 {
        margin: 60px 0;
    }

    .faq-item {
        /* padding: 20px 0; */
        border-bottom: 1px solid var(--color-text);
    }

    .faq-question {
        border: none;
        background-color: transparent;
        padding: 20px 0;
        display: flex;
        align-items: center;
        gap: 20px;
        font-size: var(--font-size-xs);
        font-weight: var(--font-weight-bold);
        color: var(--color-text);
        cursor: pointer;
    }

    .faq-answer {
        padding: 20px;
        background-color: var(--color-white);
        color: var(--color-text);
    }

    /* enter / leave */
    .accordion-enter-active,
    .accordion-leave-active {
        transition: 
            max-height 0.1s ease,
            opacity 0.25s ease,
            padding 0.25s ease;
        overflow: hidden;
    }

    /* initial state */
    .accordion-enter-from,
    .accordion-leave-to {
        max-height: 0;
        opacity: 0;
        padding-top: 0;
        padding-bottom: 0;
    }

    /* final state */
    .accordion-enter-to,
    .accordion-leave-from {
        max-height: 300px; /* достаточно большое значение */
        opacity: 1;
    }

    
    .faq-question .icon {
        font-size: var(--font-size-xl);
        font-weight: var(--font-weight-medium);
    }

    .faq-question .icon {
        transition: transform 0.5s ease;
    }

    .faq-question .icon {
        transform: rotate(0deg);
    }

    .faq-question:has(+ .accordion-enter-active) .icon {
        transform: rotate(20deg);
    }

</style>