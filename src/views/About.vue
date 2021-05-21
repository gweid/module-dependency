<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import InfoTable from '@lx-vue-materiel/info-table'

@Component({
  components: {
    InfoTable
  }
})
export default class About extends Vue {

}
</script>