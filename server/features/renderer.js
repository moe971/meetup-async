import { createReadStream } from 'fs'
import express from 'express'
import { join as joinPaths } from 'path'

import { STATIC_PATH } from './webpack'

const router = new express.Router()

router.use(express.static(STATIC_PATH))

router.get('*', (req, res) => {
  createReadStream(joinPaths(STATIC_PATH, 'index.html')).pipe(res)
})

// console.log('🖨  Deep-linking SPA renderer configured.'.green)

export default router
