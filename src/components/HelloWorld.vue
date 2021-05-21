<template>
  <div class="hello">
    <h1>hello compoment</h1>
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
</script>>
