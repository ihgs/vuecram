<template>
  <div>
    <b-container>
      <b-nav>
        <b-nav-item to="/students">Student</b-nav-item>
        <b-nav-item to="/schools">School</b-nav-item>
      </b-nav>
      <router-view></router-view>
    </b-container>
  </div>
</template>

<script>
export default {
}
</script>
