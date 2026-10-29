<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api, session } from '../api'

const router = useRouter()
const username = ref('')
const password = ref('')
const code = ref('')
const uuid = ref('')
const img = ref('')
const msg = ref('')
const msgOk = ref(false)
const busy = ref(false)

async function loadCaptcha() {
  const r = await api.captcha()
  if (r.code === 200) {
    uuid.value = r.uuid
    img.value = 'data:image/jpeg;base64,' + r.img
  }
}

async function submit() {
  msg.value = ''
  busy.value = true
  try {
    const r = await api.login(username.value.trim(), password.value, code.value.trim(), uuid.value)
    if (r.code === 200 && r.token) {
      session.setToken(r.token)
      localStorage.removeItem('portal_guest')
      router.push('/me')
    } else {
      msg.value = r.msg || '登录失败'
      loadCaptcha()
      code.value = ''
    }
  } catch (e) {
    msg.value = '网络异常，请稍后再试'
  } finally {
    busy.value = false
  }
}

onMounted(loadCaptcha)
</script>

<template>
  <div class="wrap">
    <form class="form-card" @submit.prevent="submit">
      <h1>登录</h1>
      <p class="sub">使用若依后台的同一组账号口令。</p>
      <div class="field">
        <label>用户名</label>
        <input v-model="username" autocomplete="username" placeholder="请输入用户名" />
      </div>
      <div class="field">
        <label>密码</label>
        <input v-model="password" type="password" autocomplete="current-password" placeholder="请输入密码" />
      </div>
      <div class="field">
        <label>验证码</label>
        <div class="captcha-row">
          <input v-model="code" placeholder="请输入验证码" />
          <img v-if="img" :src="img" class="captcha-img" alt="验证码" title="点击刷新" @click="loadCaptcha" />
        </div>
      </div>
      <p class="msg" :class="msgOk ? 'ok' : 'err'">{{ msg }}</p>
      <button class="btn wfull" :disabled="busy" type="submit">登 录</button>
      <div class="form-foot">
        <router-link to="/register">没有账号？去注册</router-link>
        <router-link to="/">返回首页</router-link>
      </div>
    </form>
  </div>
</template>
