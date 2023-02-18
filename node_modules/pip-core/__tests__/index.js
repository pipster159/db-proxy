const Core = require("../")
const util = Core()

const failed = `${util.consoleColors.BgRed}${util.consoleColors.FgWhite}Failure!${util.consoleColors.Reset}${util.consoleColors.FgRed} - Core Load Failed.\n`
const success = `${util.consoleColors.BgGreen}${util.consoleColors.FgWhite}Success!${util.consoleColors.Reset}${util.consoleColors.FgGreen} - Core loaded, all tests passed.\n`

/** Check Testing **/

/** Date Testing **/

/** File Testing **/

/** Format Testing **/

/** Log Testing **/
try {
    process.stdout.write(`${util.consoleColors.BgCyan}${util.consoleColors.FgBlack}${util.consoleColors.Blink}Starting Pip Core tests${util.consoleColors.Reset}\n`)

    const log = util.logger({
        "logPath": __dirname,
        "logTo": ['file','console'],
        "devLogTags": [],
        "logVerbosity": "vvv"
    })
    process.stdout.write(`\n\n${util.consoleColors.BgCyan}${util.consoleColors.FgBlack}Development Logging:${util.consoleColors.Reset}\n`)
    log.d("A Dev Log entry",'','v')
    process.stdout.write(`\n\n${util.consoleColors.BgCyan}${util.consoleColors.FgBlack}Audit Logging:${util.consoleColors.Reset}\n`)
    log.a("An Audit Log entry")
    process.stdout.write(`\n\n${util.consoleColors.BgCyan}${util.consoleColors.FgBlack}Polish Logging:${util.consoleColors.Reset}\n`)
    log.p("A Polish Log entry")
    process.stdout.write(`\n\n${util.consoleColors.BgCyan}${util.consoleColors.FgBlack}Error Logging:${util.consoleColors.Reset}\n`)
    let error = new Error("Our Testing Error")
    log.e(error,'v','Verbosity = v')
    log.e(error,'vv','Verbosity = vv')
    process.stdout.write(`\n\n${util.consoleColors.BgCyan}${util.consoleColors.FgBlack}Recovery Logging:${util.consoleColors.Reset}\n`)
    log.r("A Recovery Log entry", "User Journey Details")
    process.stdout.write(`\n\n`)
}
catch (e) {
    process.stderr.write(failed)
    console.error(e)
    process.stderr.write(util.consoleColors.Reset)
    process.exit(1)
}

/** Random Testing **/

/** Request Testing **/

/** Time Testing **/

util.wait5Seconds(10000).then(() => {
    process.stdout.write(success)
    process.exit()
}).catch(e => {
    process.stderr.write(failed)
    console.error(e)
    process.stderr.write(util.consoleColors.Reset)
    process.exit(1)
})
