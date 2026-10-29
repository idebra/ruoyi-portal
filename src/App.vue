<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { session } from './api'

const router = useRouter()
const loggedIn = computed(() => !!session.token())
const guest = computed(() => session.isGuest())

function logout() {
  session.clear()
  router.push('/')
}
</script>

<template>
  <header class="topbar">
    <div class="topbar-inner">
      <router-link to="/" class="brand"><span class="brand-badge">若</span>若依门户</router-link>
      <nav class="nav">
        <router-link to="/">首页</router-link>
        <router-link to="/me">我的</router-link>
      </nav>
      <div class="topbar-actions">
        <template v-if="loggedIn">
          <button class="btn plain" @click="logout">退出</button>
        </template>
        <template v-else-if="guest">
          <router-link to="/login" class="btn ghost">登录</router-link>
          <router-link to="/register" class="btn">注册</router-link>
        </template>
        <template v-else>
          <router-link to="/login" class="btn ghost">登录</router-link>
          <router-link to="/register" class="btn">注册</router-link>
        </template>
      </div>
    </div>
  </header>
  <main>
    <router-view />
  </main>
  <footer class="footer">
    <div class="wrap">若依门户 · 基于 RuoYi-Vue 的业务前台 — 介绍页数据与账户均来自若依后台。</div>
  </footer>
</template>
