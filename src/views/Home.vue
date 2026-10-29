<script setup>
import { useRouter } from 'vue-router'
import { session, adminUrl } from '../api'

const router = useRouter()

const features = [
  { t: '用户与权限', d: '用户、角色、部门、岗位四级组织，菜单与按钮级权限控制，数据权限按部门范围隔离。' },
  { t: '菜单管理', d: '目录、菜单、按钮三类节点统一维护，前端路由与权限标识都从这里生长出来。' },
  { t: '代码生成', d: '读表结构一键生成前后端 CRUD 代码与菜单 SQL，把重复劳动留给机器。' },
  { t: '定时任务', d: 'Quartz 调度：cron 表达式、 misfire 策略、执行日志，任务启停在线管理。' },
  { t: '系统监控', d: '在线用户、登录与操作日志、服务与缓存监控，运行状态一屏看清。' },
  { t: '数据字典', d: '枚举与配置集中维护，前端下拉、标签回显都走同一份字典数据。' }
]

const stack = [
  ['后端', 'Spring Boot 3 · Spring Security · MyBatis'],
  ['前端', 'Vue 3 · Vite · Element Plus'],
  ['数据', 'MySQL 8.4 · Redis 8'],
  ['部署', 'Docker Compose 四容器编排']
]

function enterGuest() {
  session.asGuest()
  router.push('/me')
}
</script>

<template>
  <div class="wrap">
    <section class="hero">
      <h1>若依管理系统</h1>
      <p class="lead">
        一套前后端分离的快速开发平台：后端 Spring Boot，前端 Vue 3，
        权限、代码生成、定时任务、监控开箱即用。本门户是它的业务前台 —
        在这里了解它、注册账号，并直接用同一个账号登录管理后台。
      </p>
      <div class="hero-actions">
        <router-link to="/register" class="btn">注册账号</router-link>
        <router-link to="/login" class="btn ghost">已有账号，登录</router-link>
        <button class="btn plain" @click="enterGuest">匿名进入</button>
      </div>
      <p class="hero-meta">账号体系与若依后台共用（注册即开通）；匿名进入只能浏览公开介绍，不产生账号数据。本站由 Jenkins 流水线自动构建部署（Docker 与原生双套）。</p>
    </section>

    <section class="section">
      <h2>功能一览</h2>
      <p class="desc">以下模块均来自若依后台的真实菜单 — 不是愿景图，是现在就能登录进去用的东西。</p>
      <div class="grid">
        <div v-for="f in features" :key="f.t" class="card">
          <h3>{{ f.t }}</h3>
          <p>{{ f.d }}</p>
        </div>
      </div>
    </section>

    <section class="section">
      <h2>技术栈</h2>
      <p class="desc">整套系统跑在 Docker 里：MySQL、Redis、后端、前端四个容器一份 Compose 管。</p>
      <div class="stack-row">
        <span v-for="[k, v] in stack" :key="k" class="stack-tag"><b>{{ k }}</b>　{{ v }}</span>
      </div>
    </section>

    <section class="section">
      <h2>进入后台</h2>
      <p class="desc">门户账号与管理后台互通。注册完成后，用同一组用户名口令即可进入后台；在门户「我的」页面也能看到你的账号信息。</p>
      <a class="btn ghost" :href="adminUrl()" target="_blank" rel="noopener">打开管理后台</a>
    </section>
  </div>
</template>
