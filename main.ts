function check () {
    if (temperature >= 33) {
        for (let index = 0; index < 10; index++) {
            alarm()
            blink()
            fan()
        }
        strip.showColor(neopixel.colors(NeoPixelColors.Black))
    } else {
        strip.clear()
        music.stopAllSounds()
        edubitMotors.brakeMotor(MotorChannel.M1)
    }
}
input.onButtonPressed(Button.A, function () {
    inside = true
    basic.showLeds(`
        . . . . .
        . . . . .
        # # # # #
        . . . . .
        . . . . .
        `)
})
function blink () {
    strip.showColor(neopixel.colors(NeoPixelColors.Blue))
    basic.pause(100)
    strip.showColor(neopixel.colors(NeoPixelColors.Red))
    basic.pause(100)
}
function alarm () {
    music.playTone(988, music.beat(BeatFraction.Whole))
    music.playTone(932, music.beat(BeatFraction.Whole))
    basic.pause(500)
    edubitMotors.brakeMotor(MotorChannel.M1)
}
function initESP () {
    esp8266.init(SerialPin.P12, SerialPin.P8, BaudRate.BaudRate115200)
    esp8266.connectWiFi("A71", "Robowis7332")
    basic.showString("" + (esp8266.isWifiConnected()))
    basic.pause(1000)
}
function fan () {
    edubitMotors.runMotor(MotorChannel.M1, MotorDirection.Forward, 128)
}
function send () {
    basic.showIcon(IconNames.Happy)
    basic.pause(500)
    esp8266.uploadThingspeak(
    "770O0NYVLRTXDBEV",
    temperature
    )
    basic.pause(500)
    if (esp8266.isThingspeakUploaded()) {
        basic.showIcon(IconNames.Yes)
    } else {
        basic.showIcon(IconNames.No)
    }
    basic.pause(500)
}
input.onButtonPressed(Button.AB, function () {
    check()
    led.plotBarGraph(
    Math.map(signal, -95, -42, 0, 9),
    0
    )
})
radio.onReceivedString(function (receivedString) {
    signal = radio.receivedPacket(RadioPacketProperty.SignalStrength)
})
input.onButtonPressed(Button.B, function () {
    inside = false
    basic.showIcon(IconNames.Chessboard)
})
let signal = 0
let inside = false
let temperature = 0
let strip: neopixel.Strip = null
strip = neopixel.create(DigitalPin.P2, 4, NeoPixelMode.RGB)
temperature = pins.analogReadPin(AnalogPin.P1)
music.setVolume(255)
radio.setGroup(88)
basic.showIcon(IconNames.SmallHeart)
initESP()
basic.forever(function () {
    strip.clear()
    temperature = Math.round(pins.analogReadPin(AnalogPin.P1) / 17.836)
    basic.showString("" + (temperature))
    send()
    basic.pause(200)
    if (inside == true) {
        basic.showLeds(`
            . . # . .
            . . # . .
            . . # . .
            . . . . .
            . . # . .
            `)
        if (Math.map(signal, -95, -42, 0, 9) <= 8) {
            check()
            basic.showIcon(IconNames.Surprised)
        }
    }
})
