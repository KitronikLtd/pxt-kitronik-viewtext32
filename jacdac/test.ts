// tests go here; this will not be compiled when this package is used as an extension.
forever(function() {
    modules.kitronikViewtext32Display.setLineValue(0, `ms`, control.millis())
    modules.kitronikViewtext32Display.setLine(1, `s : ${control.millis() / 1000}`)
    pause(100)
})