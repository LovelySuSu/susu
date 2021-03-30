'use strict';

module.exports = core;
const semver = require('semver')
const path = require('path')
const colors = require('colors/safe')
const userHome = require('user-home')
const pathExists = require('path-exists').sync
const log = require('@susu/log')
const pkg = require('../package.json')
const constant = require('./const')
let args,config

function core() {
    try {
        checkPkgVersion()
        checkNodeVersion()
        checkRoot()
        checkUserHome()
        checkInputArgs()
        checkEnv()
        checkGlobalUpdate()
        // log.verbose('debug','test')
    } catch (e) {
        log.error(e.message)
    }

}
function checkPkgVersion() {
    log.info('cli',pkg.version)
}
function checkUserHome() {
    if(!userHome || !pathExists(userHome)) {
        throw new Error(colors.red('当前登录用户主目录不存在'))
    }
}
function checkInputArgs() {
    const minimist = require('minimist')
    args = minimist(process.argv.slice(2))
    checkArgs()
}
function checkArgs() {
    if(args.debug) {
        process.env.LOG_LEVEL = 'verbose'
    } else {
        process.env.LOG_LEVEL = 'info'
    }
    log.level = process.env.LOG_LEVEL
}
function checkEnv() {
    const dotenv = require('dotenv')
    const dotenvPath = path.resolve(userHome,'.env')
    if(pathExists(dotenvPath)) {
        config = dotenv.config({
            path: dotenvPath
        })
        log.verbose('.env中内容',process.env.name)
    }
    config = createDefaultConfig()
    log.verbose('环境变量',process.env.CLI_HOME_PATH)
}
function createDefaultConfig() {
    const cliConfig = {
        home: userHome
    }
    if(process.env.CLI_HOME) {
        cliConfig['cliHome'] = path.join(userHome,process.env.CLI_HOME)
    } else {
        cliConfig['cliHome'] = path.join(userHome,constant.DEFAULT_CLI_HOME)
    }
    process.env.CLI_HOME_PATH = cliConfig.cliHome
}
function checkNodeVersion() {
    // 获取当前Node版本号
    const currentVersion = process.version
    // 比对最低版本号
    const lowestVersion = constant.LOWEST_NODE_VERSION
    if(!semver.gte(currentVersion,lowestVersion)) {
        throw new Error(colors.red(`susu-cli 需要安装 ${lowestVersion} 以上版本的 Node.js`))
    }
}
function checkGlobalUpdate() {
    // 1.获取当前版本号和模块名
    const currentVersion = pkg.version
    const npmName = pkg.name
    // 2.调用npm api,获取所有版本号
    const { getNpmInfo } = require('@susu/get-npm-info')
    getNpmInfo(npmName)
    // 3.提取所有版本号，比对哪些版本号是大于当前版本号
    // 4.获取最新的版本号，提示用户更新到该版本
}
function checkRoot() {
    const rootCheck = require('root-check')
    rootCheck()
    // console.log(process.getuid()) root用户 getuid 为 0， 但 root-check 会自动做降级
}
