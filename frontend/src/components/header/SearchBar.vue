<script setup>
import loupeIcon from '@/assets/icons/loupe.svg';
import { ref, watch } from 'vue'

const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    placeholder: {
        type: String,
        default: 'Search...'
    },
    debounce: {
        type: Number,
        default: 0 // 0 = нет debounce
    }
})

const emit = defineEmits(['update:modelValue', 'search'])

const inputValue = ref(props.modelValue)

watch(() => props.modelValue, val => {
    inputValue.value = val
})

let timeout = null

const onInput = () => {
    emit('update:modelValue', inputValue.value)

    if (!props.debounce) return
    clearTimeout(timeout)
    timeout = setTimeout(() => emitSearch(), props.debounce)
}

const emitSearch = () => {
    emit('search', inputValue.value)
}
</script>

<template>
    <div class="search-bar">
        <input
            type="search"
            :placeholder="placeholder"
            v-model="inputValue"
            @input="onInput"
            @keyup.enter="emitSearch"
        />

        <button class="search-btn" @click="emitSearch">
            <img :src="loupeIcon" alt="Loupe Icon">
        </button>
    </div>
</template>

<style scoped>
.search-bar {
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 410px;
    border: 2px solid var(--color-white);
    border-radius: 5px;
}

.search-bar input {
    padding: 8px 10px;
    flex: 1;
    border: none;
    outline: none;
    font-size: var(--font-size-xs);
    background: transparent;
    color: var(--color-white);
}

.search-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    cursor: pointer;
    padding: 6px 8px;
    background: var(--color-white);
}
</style>
