const { sep } = require('path')
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

  // beforeResolve = (resolveData, callback) => {
  //   const { context, contextInfo, request } = resolveData;
  //   const { issuer } = contextInfo;

  //   callback()
  // }

  afterResolve = (resolveData, callback) => {
    const { resourceResolveData } = resolveData
    let { context: { issuer }, path: packagePath } = resourceResolveData

    const { projectName, packageName, resObj: { dependency } } = this

    if (packagePath.includes(packageName) && (issuer && !issuer.includes(packageName))) {
      console.log(issuer)
      console.log(packagePath)
      console.log('---------------------------------------------')

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
        // nmf.hooks.beforeResolve.tapAsync("ModuleDependency", this.beforeResolve);

        nmf.hooks.afterResolve.tapAsync('ModuleDependency', this.afterResolve)
      }
    )

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

module.exports = ModuleDependency
