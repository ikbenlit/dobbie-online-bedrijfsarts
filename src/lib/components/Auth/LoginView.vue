<script setup lang="ts">
import { ref } from 'vue'
import { ElForm, ElFormItem, ElInput, ElButton } from 'element-plus'

const email = ref('')
const password = ref('')

function handleLogin() {
  // Placeholder for login logic
  console.log('Login attempt with:', email.value, password.value) // Added password for logging clarity
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
      <h2 class="text-2xl font-bold text-center text-gray-900">Login</h2>
      <el-form @submit.prevent="handleLogin" class="space-y-6">
        <el-form-item label="Email">
          <el-input v-model="email" type="email" placeholder="jouw@email.com" required />
        </el-form-item>
        <el-form-item label="Wachtwoord">
          <el-input v-model="password" type="password" placeholder="Wachtwoord" show-password required />
        </el-form-item>
        <div>
          <el-button type="primary" native-type="submit" class="w-full">
            Inloggen
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template> 