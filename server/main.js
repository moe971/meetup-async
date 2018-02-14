import express from 'express'
import { createServer } from 'http'
import { json as apiRequestParser } from 'body-parser'
import fileUpload from 'express-fileupload'

import 'colors'

import renderer from './features/renderer'
import webpackServer from './features/webpack'

const app = express()
const server = createServer(app)

app.use(webpackServer)
app.use(renderer)

app.use(fileUpload())

app.post('/upload', function(req, res) {
  if (!req.files) return res.status(400).send('No files were uploaded.')

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.sampleFile
  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(`./bin/uploaded/${sampleFile.name}`, function(err) {
    if (err) return res.status(500).send(err)
    res.json({
      name: sampleFile.name
    })
  })
})

server.listen(process.env.PORT || 3000, () => {
  console.log(
    '👍  Development server listening on'.green,
    `http://localhost:${server.address().port}`.yellow.underline,
    '\n'
  )
})
