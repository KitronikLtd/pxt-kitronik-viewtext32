//% deprecated
namespace Kitronik_VIEWTEXT32 {
}

namespace servers {
    class CharacterScreenServer extends jacdac.Server {
        textDirection = jacdac.CharacterScreenTextDirection.LeftToRight
        message: string = ""

        constructor() {
            super("screen", jacdac.SRV_CHARACTER_SCREEN, {
                variant: jacdac.CharacterScreenVariant.OLED,
            })
        }

        handlePacket(pkt: jacdac.JDPacket): void {
            this.textDirection = this.handleRegValue(
                pkt,
                jacdac.CharacterScreenReg.TextDirection,
                "u8",
                this.textDirection
            )
            this.handleRegUInt32(pkt, jacdac.CharacterScreenReg.Columns, 16) // NUMBER_OF_CHAR_PER_LINE
            this.handleRegUInt32(pkt, jacdac.CharacterScreenReg.Rows, 2) // NUMBER_OF_CHAR_PER_LINE

            const oldMessage = this.message
            this.message = this.handleRegValue(
                pkt,
                jacdac.CharacterScreenReg.Message,
                "s",
                this.message
            )
            if (this.message != oldMessage) this.syncMessage()
        }

        private syncMessage() {
            if (!this.message) Kitronik_VIEWTEXT32.clearDisplay()
            else
                Kitronik_VIEWTEXT32.showString(this.message)
        }
    }

    function start() {
        jacdac.startSelfServers(() => [
            new CharacterScreenServer()
        ])
    }
    start()
}

namespace modules {
    /**
     * A Jacdac client for the Kitronik ViewText32 Character display
     */
    //% fixedInstance block="kitronik viewtext32"
    export const kitronikViewtext32 = new CharacterScreenClient("kitronik viewtext32?device=self")
}