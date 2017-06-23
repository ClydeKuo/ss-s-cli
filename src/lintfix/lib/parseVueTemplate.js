module.exports = function (childNodes) {
  let processQueue = {}
  for (let node of childNodes) {
    if (node.nodeName === 'script') {
      node.attrs = []
      processQueue.script = node
    } else if (node.nodeName === 'style') {
      const attrs = []

      for (let item of node.attrs) {
        if (item.name === 'scoped') {
          attrs.push({name: 'scoped', value: ''})
        } else if (item.name === 'src') {
          attrs.push({name: 'src', value: item.value})
        } else if (item.name === 'module') {
          attrs.push({name: 'module', value: item.value})
        }
      }
      node.attrs = attrs
      processQueue.style = node
    }
  }
  return processQueue
}
