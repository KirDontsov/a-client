<template>
  <main>
    <Sidebar />
    <Header />
    <router-view />
  </main>
</template>

<script setup>
import Header from "@/features/header";
import Sidebar from "@/features/sidebar";
</script>

<style>
</style>
