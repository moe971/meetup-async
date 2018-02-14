import DashboardPlugin from 'webpack-dashboard/plugin'
import express from 'express'
import devMiddleware from 'webpack-dev-middleware'
import hotMiddleware from 'webpack-hot-middleware'
import { join as joinPaths } from 'path'
import webpack from 'webpack'

const configFile = joinPaths(__dirname, '../../webpack.config.dev.js')
const config = require(configFile)
const compiler = webpack(config)
compiler.apply(new DashboardPlugin())

const router = new express.Router()

export const STATIC_PATH = joinPaths(__dirname, '../../static')

router.use(devMiddleware(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath,
  contentBase: STATIC_PATH
}))
router.use(hotMiddleware(compiler))

console.log('⚡️  Webpack dev/hot server configured.  Bundle building…'.green)

export default router
