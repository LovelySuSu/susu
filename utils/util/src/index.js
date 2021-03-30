#! /usr/bin/env node
const yargs = require('yargs/yargs')
const {hideBin} = require('yargs/helpers')
const dedent = require('dedent')
const arg = hideBin(process.argv)
const pkg = require('../package.json')
const cli = yargs(arg)
const context = {
    ddVersion: pkg.version
}
const argv = process.argv.slice(2)

cli.usage('Usage: lala-cli [command] <options>')
    .demandCommand(1,'A command is required')
    .strict()
    .alias('h','help')
    .alias('v','version')
    .wrap(cli.terminalWidth())
    .epilogue(dedent(`
      When a command fails, all logs are written to lerna-debug.log in the current working directory.

      For more information, find our manual at https://github.com/lerna/lerna
    `))
    .options({
        debug: {
            type: 'boolean',
            describe: 'bootstrap debug mode',
            alias: 'd'
        }
    })
    .option('registry',{
        type: 'string',
        describe: 'Define global registry',
        alias: 'r'
    })
    .group(['debug'],'Dev options:')
    .group(['registry'],'Extra Options:')
    .command('init [name]','创建项目',(yargs) => {
        yargs.option('name',{
            type: 'string',
            describe: '项目名称',
            alias: 'n'
        })
    },(argv) => {
        console.log(argv)
    })
    .command({
        command: 'list',
        aliases: ['ls','ll'],
        describe: 'list local pacakges',
        builder: (yargs) => {

        },
        handler: (argv) => {
            console.log(argv)
        }
    })
    .recommendCommands()
    .fail((err,msg) => {
        console.log('err',err)
        console.log('msg',msg)
    })
    .parse(argv,context)
    // .argv
