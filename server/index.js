const express = require('express')
const bodyParser = require('body-parser')

let dependencyInfo = {}

const app = express()

app.use(bodyParser.json())

app.get('/api/dependency', (req, res) => {
  res.send({
    code: 0,
    data: {
      dependencyInfo
    },
    message: 'success'
  })
})

app.post('/api/dependency', (req, res) => {
  console.log(req.body);
  dependencyInfo = req.body

  res.send({
    code: 0,
    message: 'success'
  })
})

app.listen(9000, () => {
  console.log('服务已经启动: 0.0.0.0:9000');
})