const path = require('path')
const { glob } = require('glob')
const { factoryDir } = require('./config')

/**
 * Get a listing of factory locations
 */
const factoryList = () => {
  const list = []
  const factories = glob.sync(`${factoryDir}/*`)
  factories.forEach(f => {
    list.push({
      name: path.basename(f),
      value: f
    })
  })
  return list
}

module.exports.factoryList = factoryList()