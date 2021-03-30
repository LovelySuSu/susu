'use strict';
const axios = require('axios')
const urljoin = require('url-join')
const semver = require('semver')
function getNpmInfo(npmName,registry) {
    if(!npmName) return
    const registryUrl = registry || getDefaultRegistry()
    const npmInfoUrl = urljoin(registryUrl,npmName)
    console.log(npmInfoUrl)
}
function getDefaultRegistry(isOriginal = true) {
    return isOriginal ? 'https://registry.npmjs.org' : 'https://registry.npm.taobao.org'
}
module.exports = {
    getNpmInfo
}
