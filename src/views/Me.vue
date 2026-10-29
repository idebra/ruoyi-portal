<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api, session, adminUrl } from '../api'

const router = useRouter()
const state = ref('loading') // loading | user | guest | anon
const info = ref(null)

async function load() {
  const t = session.token()
  if (t) {
    try {
      const r = await api.getInfo(t)
      if (r.code === 200) {
        info.value = r
        state.value = 'user'
        return
      }
    } catch (e) { /* fall through */ }
    session.clear()
  }
  state.value = session.isGuest() ? 'guest' : 'anon'
}

function doLogout() {
  const t = session.token()
  if (t) api.logout(t).catch(() => {})
  session.clear()
  router.push('/')
}

onMounted(load)
</script>

<template>
  <div class="wrap">
    <section class="section" v-if="state === 'loading'">
      <p class="desc">正在向后台确认你的身份…</p>
    </section>

    <section class="section" v-else-if="state === 'user' && info">
      <h2>我的账号</h2>
      <p class="desc">以下信息实时来自若依后台（/getInfo），不是门户本地编的。</p>
      <div class="card" style="max-width:560px">
        <dl class="kv">
          <dt>用户名</dt><dd>{{ info.user.userName }}</dd>
          <dt>昵称</dt><dd>{{ info.user.nickName }}</dd>
          <dt>部门</dt><dd>{{ info.user.dept ? info.user.dept.deptName : '—' }}</dd>
          <dt>角色</dt><dd>{{ info.roles && info.roles.length ? info.roles.join('、') : '普通注册用户' }}</dd>
          <dt>账号状态</dt><dd>{{ info.user.status === '0' ? '正常' : '停用' }}</dd>
        </dl>
      </div>
      <div style="margin-top:18px; display:flex; gap:10px">
        <a class="btn" :href="adminUrl()" target="_blank" rel="noopener">进入管理后台</a>
        <button class="btn plain" @click="doLogout">退出登录</button>
      </div>
    </section>

    <section class="section" v-else-if="state === 'guest'">
      <h2>匿名访问</h2>
      <p class="desc">你正在以游客身份浏览。公开介绍可以随便看；账号信息、后台入口等功能需要注册或登录后使用。</p>
      <div style="display:flex; gap:10px">
        <router-link to="/register" class="btn">注册账号</router-link>
        <router-link to="/login" class="btn ghost">登录</router-link>
        <router-link to="/" class="btn plain">继续逛逛</router-link>
      </div>
    </section>

    <section class="section" v-else>
      <h2>尚未登录</h2>
      <p class="desc">登录或注册后，这里会显示从若依后台取到的你的账号信息；也可以先以游客身份进入。</p>
      <div style="display:flex; gap:10px">
        <router-link to="/login" class="btn">登录</router-link>
        <router-link to="/register" class="btn ghost">注册</router-link>
      </div>
    </section>
  </div>
</template>
