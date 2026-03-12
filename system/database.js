const fs = require("fs")

// Simple in-memory queue to handle database operations for each file
const queues = {}

async function enqueue(file, operation) {
  if (!queues[file]) {
    queues[file] = Promise.resolve()
  }

  const result = queues[file].then(async () => {
    return await operation()
  })

  queues[file] = result.catch(() => {}) // Prevent queue from breaking on error
  return result
}

function read(file) {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify({}))
  }
  return JSON.parse(fs.readFileSync(file))
}

function write(file, data) {
  const tempPath = `${file}.tmp`
  fs.writeFileSync(tempPath, JSON.stringify(data, null, 2))
  fs.renameSync(tempPath, file)
}

// Helper to perform a read-modify-write operation safely
async function update(file, callback) {
  return await enqueue(file, async () => {
    const data = read(file)
    const result = await callback(data)
    write(file, data)
    return result
  })
}

module.exports = { read, write, update }
