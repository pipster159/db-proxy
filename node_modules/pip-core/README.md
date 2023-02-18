A collection of utility functions and a logger

Logger - 
- File or Console
- Event Emitter based

Usage:
```
const config = {
    "logPath": __dirname,
    "logTo": ['file','console'],
    "devLogTags": [],
    "logVerbosity": "v"
}
const util = require("pip-core")
const log = util.logger(config)
```