<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../api'

const router = useRouter()
const username = ref('')
const password = ref('')
const confirm = ref('')
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
  msgOk.value = false
  if (username.value.trim().length < 2) { msg.value = '用户名至少 2 个字符'; return }
  if (password.value.length < 5) { msg.value = '密码至少 5 个字符'; return }
  if (password.value !== confirm.value) { msg.value = '两次输入的密码不一致'; return }
  busy.value = true
  try {
    const r = await api.register(username.value.trim(), password.value, code.value.trim(), uuid.value)
    if (r.code === 200) {
      msgOk.value = true
      msg.value = '注册成功，正在前往登录页…'
      setTimeout(() => router.push('/login'), 900)
    } else {
      msg.value = r.msg || '注册失败'
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
      <h1>注册</h1>
      <p class="sub">注册后即可用同一账号登录门户与管理后台。</p>
      <div class="field">
        <label>用户名</label>
        <input v-model="username" autocomplete="username" placeholder="2-20 个字符" />
      </div>
      <div class="field">
        <label>密码</label>
        <input v-model="password" type="password" autocomplete="new-password" placeholder="至少 5 个字符" />
      </div>
      <div class="field">
        <label>确认密码</label>
        <input v-model="confirm" type="password" autocomplete="new-password" placeholder="再次输入密码" />
      </div>
      <div class="field">
        <label>验证码</label>
        <div class="captcha-row">
          <input v-model="code" placeholder="请输入验证码" />
          <img v-if="img" :src="img" class="captcha-img" alt="验证码" title="点击刷新" @click="loadCaptcha" />
        </div>
      </div>
      <p class="msg" :class="msgOk ? 'ok' : 'err'">{{ msg }}</p>
      <button class="btn wfull" :disabled="busy" type="submit">注 册</button>
      <div class="form-foot">
        <router-link to="/login">已有账号？去登录</router-link>
        <router-link to="/">返回首页</router-link>
      </div>
    </form>
  </div>
</template>
