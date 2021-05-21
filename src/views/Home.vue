<template>
  <div class="home">
    <h1>This is an home page</h1>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import InfoTable from '@lx-vue-materiel/info-table'
import HelloWorld from '@/components/HelloWorld.vue'

@Component({
  components: {
    InfoTable,
    HelloWorld
  }
})
export default class Home extends Vue {

}
</script>