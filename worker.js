'use strict'

const worker = require('worker_threads')

const Application = require('./lib/application.js')

const application = new Application(worker)

application.on('started', () => {
  application.logger.log(`Application started in worker ${worker.threadId}`)
})

worker.parentPort.on('message', async message => {
  if (message.name === 'stop') {
    if (application.finalization) return
    console.log()
    application.logger.log('Graceful shutdown')
    await application.shutdown()
    process.exit(0)
  }
})

const logError = err => {
  application.logger.error(err.stack)
}

process.on('uncaughtException', logError)
process.on('warning', logError)
process.on('unhandledRejection', logError)
