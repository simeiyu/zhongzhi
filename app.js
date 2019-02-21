const Koa = require('koa')
const app = new Koa()

const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
// const bodyparser = require('koa-bodyparser')
const koaBody = require('koa-body')
const logger = require('koa-logger')
const debug = require('debug')('koa2:server')
const path = require('path')

const config = require('./config')
const routers = require('./routes')
const middleware = require('./services/middleware')
const { initServerConfig } = require('./server/common')

const port = process.env.PORT || config.port

const isDev = process.env.isDev || 'production'
// console.log('config -->', isDev)
const config_server = require(`./config/${isDev}`)

const getErrorStatusCode = (statusCode) => {
  return {
    404: 404,
    500: 500
  }[statusCode] || 500
}

initServerConfig(config_server)

// error handler
onerror(app)

app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    if (err) {
      if (!isDev) {
        ctx.redirect(`/error/${getErrorStatusCode(err.statusCode)}`)
      }
      console.log('err: ', err)
    }
  }
})

// middlewares
app.use(koaBody({
    multipart: true,
    formidable: {
      maxFileSize: 200 * 1024 * 1024
    }
  }))
  // .use(bodyparser())  
  .use(json())
  .use(logger())
  .use(require('koa-less')(__dirname + '/public'))
  .use(require('koa-static')(__dirname + '/public'))
  .use(views(path.join(__dirname, '/views'), {
    options: {settings: {views: path.join(__dirname, 'views')}},
    map: {'pug': 'pug'},
    extension: 'pug'
  }))
  .use(middleware)
  .use(routers.routes())
  .use(routers.allowedMethods())

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - $ms`)
})

app.on('error', function(err, ctx) {
  console.log('error -->', err)
  logger.error('server error', err, ctx)
  ctx.render('common/error', {error: err})
})

module.exports = app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`)
})
