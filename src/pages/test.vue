<template>
  <div class="mt-40">
    <!--    <router-link-->
    <!--        to="/test"-->
    <!--        class="btn">-->
    <!--      {{msg}}-->
    <!--    </router-link>-->
  </div>
</template>

<script setup>
let msg = 'hello';
import {getTest} from "src/request/api/test";

const res = await getTest()
console.log(res.data)

</script>

<style scoped>
.btn {
  @apply rounded-md
  border
  border-transparent
  bg-indigo-600
  px-5
  py-3
  text-base
  font-medium
  text-white
  hover:bg-indigo-500;
  background: red;
}
</style>
