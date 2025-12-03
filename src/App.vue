<template>
  <main>
    <Sidebar />
    <Header />
    <router-view />
  </main>
</template>

<script setup>
import { Header } from "@/features/header";
import { Sidebar } from "@/features/sidebar";
import { useTheme } from "@/shared/composables/useTheme";
import { onMounted } from "vue";

// Initialize theme
const { initializeTheme } = useTheme();

// Initialize the theme when component mounts to ensure proper setup
onMounted(() => {
  initializeTheme();
});
</script>

<style>
</style>
