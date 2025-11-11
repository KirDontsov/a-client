<template>
  <div class="min-h-screen w-full overflow-hidden relative bg-gray-800">
    <!-- Orb background element -->

    <div class="flex items-center justify-center px-8 py-4 mb-4 h-[calc(100vh-20px)] relative">
      <div class="absolute inset-0 w-full h-full z-0">
        <Orb :hoverIntensity="0.5" :rotateOnHover="true" :hue="0" :forceHoverState="false" />
      </div>
      <div class="flex flex-col items-center justify-center p-12 mb-4 gap-4 rounded-sm bg-gray-700 z-11">
        <h1 class="text-white">A-CLIENT</h1>
        <InputField
          id="email"
          v-model="email"
          type="text"
          placeholder="Введите свой email"
          label="Email"
          class="w-[300px]"
          labelClass="text-white"
          inputClass="bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
        />
        <InputField
          id="password"
          v-model="password"
          type="password"
          placeholder="********"
          label="Password"
          class="w-[300px]"
          labelClass="text-white"
          inputClass="bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
        />
        <Button class="w-[300px]" @click="handleSubmit" type="button" color="default" variant="dark">Войти</Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '@/shared/api';
import { InputField } from '@/shared/components/input-field';
import { Button } from '@/shared/components';
import Orb from '@/features/orb/Orb.vue';

const router = useRouter();
const email = ref();
const password = ref();

const handleSubmit = async () => {
  const res = await login(email.value, password.value);

  if (res?.ok) {
    await router.push('/');
  } else {
    console.warn('Ошибка HTTP: ' + res.status);
  }
};
</script>

<style scoped>
/* Add some additional styling to ensure the orbs don't interfere with content */
.min-h-screen {
  min-height: 100vh;
  position: relative;
}
</style>
