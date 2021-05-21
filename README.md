## 业务组件依赖统计

主要是为了统计出组件被哪些项目的哪些页面所引用，好处：在后续组件库维护的过程中，修改一个组件可以很直观地知道影响的范围，降低维护人员心里压力



### 统计方案

- 组件库埋点
- 项目打包，扫描依赖



#### 组件库埋点

在组件的生命周期进行埋点，统计上报

如果仅仅是为了统计出组件被哪些项目的哪些页面所引用，埋点方案就不断地收集上报，过于重复；但是如果想要连带统计组件使用率，埋点是一个很好的选择

时效性问题，如果当前组件功能在一个时间段内没有用户使用到，那么就会统计不到



#### 项目打包，扫描依赖

利用 webpack，在打包过程中找出项目中依赖业务组件的页面，统计上报。

主要的一个过程：

![](/imgs/img1.png)



##### 统计依赖

通过写一个 webpack plugin：在模块分析，递归依赖的过程进行统计

```js
class ModuleDependency {
  constructor(options) {
    const { projectName, packageName } = options

    // 项目名
    this.projectName = projectName
    // 业务组建仓库名
    this.packageName = packageName

    // 依赖结果
    this.resObj = {
      projectName,
      packageName,
      dependency: {}
    }
  }

  afterResolve = (resolveData, callback) => {
    const { resourceResolveData } = resolveData
    let { context: { issuer }, path: packagePath } = resourceResolveData

    const { projectName, packageName, resObj: { dependency } } = this

    if (packagePath.includes(packageName) && (issuer && !issuer.includes(packageName))) {
      // console.log(issuer)
      // console.log(packagePath)
      // console.log('---------------------------------------------')

      packagePath = `${packageName}${packagePath.split(packageName)[1].split(sep).join('/')}`
      issuer = `${projectName}${issuer.split(projectName)[1].split(sep).join('/')}`

      if (dependency[packagePath]) {
        dependency[packagePath].push(issuer)
      } else {
        dependency[packagePath] = [issuer]
      }
    }

    callback()
  }

  apply(compiler) {
    compiler.hooks.normalModuleFactory.tap('ModuleDependency', nmf => {
        nmf.hooks.afterResolve.tapAsync('ModuleDependency', this.afterResolve)
      }
    )
  }
}
```



##### 数据上报

在打包完成阶段，进行数据上报：

```js
const axios = require('axios')

function request({ baseUrl, url, method, header, data }) {
  baseUrl = baseUrl || 'http://127.0.0.1:9000'
  url = `${baseUrl}${url}`
  header = header || { 'Content-Type': 'application/json' }

  return axios.request({
    url,
    method: method || 'POST',
    header,
    data
  })
}

class ModuleDependency {
  constructor(options) {
    const { projectName, packageName } = options

    // 项目名
    this.projectName = projectName
    // 业务组建仓库名
    this.packageName = packageName

    // 依赖结果
    this.resObj = {
      projectName,
      packageName,
      dependency: {}
    }
  }

  apply(compiler) {

    compiler.hooks.done.tapAsync('ModuleDependency', (stats, callback) => {
      // console.log(this.resObj)

      request({
        url: '/api/dependency',
        method: 'POST',
        data: this.resObj
      })

      callback()
    })
  }
}
```



