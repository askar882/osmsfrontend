<template>
  <div class="errPage-container">
    <h3>请点击右上角BUG小图标</h3>
    <aside>
      现在的管理后台基本都是spa的形式了，它增强了用户体验，但同时也会增加页面出问题的可能性，可能一个小小的疏忽就导致整个页面的死锁。好在Vue官网提供了一个方法来捕获处理异常，你可以在其中进行错误处理或者异常上报。
      <a target="_blank" class="link-type" href="https://panjiachen.github.io/vue-element-admin-site/guide/advanced/error.html">
        文档介绍
      </a>
    </aside>
  </div>
</template>

<script>
export default {
  name: 'ErrorLog'
}
</script>

<style scoped>
  .errPage-container {
    padding: 30px;
  }
</style>
