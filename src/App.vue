<template>
  <main>
    <Sidebar />
    <Header />
    <router-view />
  </main>
  <ToastContainer />
</template>

<script setup>
import { Header } from "@/features/header";
import { Sidebar } from "@/features/sidebar";
import { useThemeStore } from "@/entities/theme/model";
import ToastContainer from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { onMounted } from "vue";

// Initialize theme
const { initializeTheme } = useThemeStore();

// Initialize the theme when component mounts to ensure proper setup
onMounted(() => {
 initializeTheme();
});
</script>

<style>
</style>
