//% deprecated
namespace Kitronik_VIEWTEXT32 {
}

namespace modules {
    /**
     * A Jacdac client for the Kitronik ViewText32 Character display
     */
    //% fixedInstance block="kitronik viewtext32 display"
    export const kitronikViewtext32Display = new CharacterScreenClient("kitronik viewtext32 display?device=self")
}

namespace servers {
    class CharacterScreenServer extends jacdac.Server {
        textDirection = jacdac.CharacterScreenTextDirection.LeftToRight
        message: string = ""

        constructor() {
            super(jacdac.SRV_CHARACTER_SCREEN, {
                variant: jacdac.CharacterScreenVariant.OLED,
            })
        }

        handlePacket(pkt: jacdac.JDPacket): void {
            this.textDirection = this.handleRegValue(
                pkt,
                jacdac.CharacterScreenReg.TextDirection,
                jacdac.CharacterScreenRegPack.TextDirection,
                this.textDirection
            )
            this.handleRegFormat(pkt,
                jacdac.CharacterScreenReg.Columns,
                jacdac.CharacterScreenRegPack.Columns, 
                [16]) // NUMBER_OF_CHAR_PER_LINE
            this.handleRegFormat(pkt, 
                jacdac.CharacterScreenReg.Rows, 
                jacdac.CharacterScreenRegPack.Rows, 
                [2]) // NUMBER_OF_CHAR_PER_LINE

            const oldMessage = this.message
            this.message = this.handleRegValue(
                pkt,
                jacdac.CharacterScreenReg.Message,
                jacdac.CharacterScreenRegPack.Message,
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
