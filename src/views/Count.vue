<template>
  <div class="count">
    <h1>统计页面</h1>
    <div class="content">
      <h3>组件库：{{ dependencyInfo.packageName }}</h3>
      <div v-for="item in dependencyInfo.dependency" :key="item.key" class="once">
        <h4>{{ item.key }}</h4>
        <p class="project">项目：{{ dependencyInfo.projectName }}</p>
        <ul class="once-ul">
          <li v-for="l in item.list" :key="l">{{ l }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import axios from 'axios'

@Component({})
export default class About extends Vue {
  dependencyInfo = {}

  created() {
    this.getDependencyInfo()
  }

  formatDependency(obj: any) {
    const dependency = obj.dependency
    const res = Object.keys(dependency).map((item) => {
      return {
        key: item,
        list: dependency[item]
      }
    })

    return { ...obj, dependency: res }
  }

  async getDependencyInfo() {
    const {
      data: {
        data: { dependencyInfo }
      }
    } = await axios.get('/api/dependency')
    this.dependencyInfo = this.formatDependency(dependencyInfo)
  }
}
</script>
<style lang="less" scoped>
.count {
  display: flex;
  flex-direction: column;
  align-items: center;
  .content {
    text-align: left;
    .project {
      margin-left: 20px;
    }
    .once {
      margin-left: 20px;
      li {
        margin-left: 20px;
        margin-top: 5px;
      }
    }
  }
}
</style>
