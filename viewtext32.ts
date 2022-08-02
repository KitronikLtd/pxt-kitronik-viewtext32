/**
 * Kitronik :VIEW TEXT32 blocks
 * LCD chip ST7070
 **/
//% weight=100 color=#00A654 icon="\uf26c" block=":VIEW Text32"
//% groups='["Show","Format","Characters"]'
namespace Kitronik_VIEWTEXT32 {

    //Useful LCD constants
    const FUNCTION_SET1_CMD = 0x38		//function set1 command
    const FUNCTION_SET2_CMD = 0x3C		//function set2 command
    const DISPLAY_ON = 0x0C				//register value for turning the display on
    const CLEAR_DISPLAY = 0x01          //value for clear bit of LCD function register
    const LCD_LINE1 = 0x80      		//value is address of LCD line 1
    const LCD_LINE2 = 0xC0      		//value is address of LCD line 2
    const LCD_LINE_LENGTH = 16
    const BLANK_SPACE = 0x20			//ascii charector for " "

    //Enums for selection from blocks
    export enum DisplayLine {
        //% block="Top"
        Top,
        //% block="Bottom"
        Bottom
    }

    export enum ScrollDirection {
        //% block="Left"
        Left,
        //% block="Right"
        Right
    }

    export enum ScrollPosition {
        //% block="off screen"
        Off,
        //% block="on screen"
        On
    }

    export enum ShowAlign {
        //% block="Left"
        Left,
        //% block="Centre"
        Centre,
        //% block="Right"
        Right
    }

    export enum ShowPage {
        //% block="Single"
        Single,
        //% block="Double"
        Double
    }

    export enum Emoticon {
        //% block=":)"
        Happy,
        //% block=":("
        Sad,
        //% block=":P"
        Tongue,
        //% block=";)"
        Wink,
        //% block=":o"
        Surpise,
        //% block="|-)"
        Sleeping,
        //% block=":*"
        Kiss,
        //% block=":D"
        Grin,
        //% block=":'("
        Crying
    }

    //Global variables and setting default values
    let initialised = false

    let displayScrollDirection = ScrollDirection.Left
    let displayScrollStartPosition = ScrollPosition.Off
    let displayScrollFinishPosition = ScrollPosition.Off
    let displayScrollTime = 400

    let displayShowAlign = ShowAlign.Left
    let displayShowPage = ShowPage.Single
    let displayShowTime = 1000

    //Function to initialise the LCD and SPI
    function init() {
		displayScrollDirection = ScrollDirection.Left
		displayScrollStartPosition = ScrollPosition.Off
		displayScrollFinishPosition = ScrollPosition.Off
		displayScrollTime = 400

		displayShowAlign = ShowAlign.Left
		displayShowPage = ShowPage.Single
		displayShowTime = 1000
	
        pins.digitalWritePin(DigitalPin.P14, 0)                         //Pin14 used as a reset line from the micro:bit
        basic.pause(500)
        pins.spiPins(DigitalPin.P15, DigitalPin.P14, DigitalPin.P13)    //MOSI set to pin 15, CLK set to pin 13
        pins.spiFrequency(250000)                                       //set the clock frequency to 250kHz
        pins.spiFormat(8, 0)                                            //8 bytes and normal polarity
        pins.digitalWritePin(DigitalPin.P14, 1)                         //set the reset line high to enable to the LCD

        basic.pause(500)                                               //clear display before going to write mode
        pins.spiWrite(FUNCTION_SET1_CMD)//function set1 ext=0
        control.waitMicros(50)
        pins.spiWrite(DISPLAY_ON)//display on
        control.waitMicros(50)
        pins.spiWrite(CLEAR_DISPLAY)//clear display
        control.waitMicros(2000)
        pins.spiWrite(0x06)//entry mode set
        control.waitMicros(50)

        initialised = true
    }

    function displayStringOnLine(lcdLineAddr: number, text: string) {   //display string on a selected line of the LCD
        let charector = 0
        let asciiCharector = 0
        let lengthOfText = text.length
        let rightAlignOfset = 0

        pins.spiWrite(FUNCTION_SET1_CMD)                                //send function set1 command
        pins.spiWrite(lcdLineAddr)                                      //send value for which LCD line to write to
        pins.spiWrite(FUNCTION_SET2_CMD)                                //send function set2 command
        pins.spiWrite(0x8F)                                             //write 16 bytes to the display

        //for loop repeats for the number of LCD charectors on a line
        for (charector = 0; charector < LCD_LINE_LENGTH; charector++) {
            if (displayShowAlign == ShowAlign.Left) {
                if (charector < lengthOfText) {                         //if charector is within the string length and left alignment
                    asciiCharector = text.charCodeAt(charector)         //store the ascii charector to variable
                }
                else {
                    asciiCharector = BLANK_SPACE                        //if not store the ascii charector blank space
                }
            }
            else if (displayShowAlign == ShowAlign.Right) {
                if (charector < (LCD_LINE_LENGTH - lengthOfText)) {     //if alignment is right and charector is less than the length of screen - length of text
                    asciiCharector = BLANK_SPACE                        //store the ascii charector blank space
                    rightAlignOfset = charector + 1                     //increament ofset to know when the blank space ends
                }
                else {
                    asciiCharector = text.charCodeAt((charector - rightAlignOfset))             //take offset from the loop number to get the start of the string and asign the ascii charector
                }
            }
            else if (displayShowAlign == ShowAlign.Centre) {            //if alignment is centre, calculate the number of white space either side of the string
                let centreSpace = (LCD_LINE_LENGTH - lengthOfText) / 2
                if ((charector < centreSpace) || (charector > (lengthOfText + centreSpace))) {  //allocate white space to variable if either side of the string
                    asciiCharector = BLANK_SPACE
                }
                else {
                    asciiCharector = text.charCodeAt((charector - centreSpace))                 //store ascii charector at location of loop minus centre offset 
                }
            }
            pins.spiWrite(asciiCharector)                               //send alicated ascii charector
        }
    }

    /**
    * Show Format block allows to set the alignment of text, line update and delay for each update
    * @param alignmentSelected is the selection of alignment of text on screen
    * @param pageUpdate is the selection of update a one line or two lines
    * @param delaySelected is the time between updating the LCD for show eg: 1500
    */
    //% blockId=kitronik_VIEWTEXT32_show_Parameter
    //% group=Format
    //% block="show format: show alignment %alignmentSelected| page update %pageUpdate| delay(ms) %delaySelected"
    //% delaySelected.min=500 delaySelected.max=4000
    //% weight=100 blockGap=8
    export function showParameter(alignmentSelected: ShowAlign, pageUpdate: ShowPage, delaySelected: number) {
        if (initialised == false) {
            init()
        }
        displayShowAlign = alignmentSelected
        displayShowPage = pageUpdate
        displayShowTime = delaySelected
    }

    /**
	* Show String to display on LCD.
    * @param text Inputted String to display on screen eg: "Hello!"
    */
    //% blockId=kitronik_VIEWTEXT32_show_string
    //% group=Show
    //% block="show string %text"
    //% text.shadowOptions.toString=true
    //% weight=95 blockGap=8
    export function showString(text: string) {
        if (initialised == false) {
            init()
        }
        let lengthOfText = text.length
        let textLoop = 0
        let wordArray: string[] = []
        let wordLengthArray: number[] = []
        let stringArray: string[] = []
        let numberOfWords = 0
        let numberOfStrings = 0
        let startOfNewWord = 0
        let charLength = 0
        let word = 0
        let createString = ""

        //split the string into single words and store in an array, increament the number of words in the string
        if ((displayShowAlign == ShowAlign.Left) || (displayShowAlign == ShowAlign.Centre)) {
            for (textLoop = 0; textLoop <= text.length; textLoop++) {
                if (text.charAt(textLoop) == " ") {
                    let splitStr = text.substr(startOfNewWord, (textLoop - (startOfNewWord - 1)))
                    wordArray[numberOfWords] = splitStr
                    wordLengthArray[numberOfWords] = splitStr.length
                    numberOfWords += 1
                    startOfNewWord = textLoop + 1
                }
                else if (textLoop == text.length) {
                    let splitStr = text.substr(startOfNewWord, (textLoop - (startOfNewWord - 1)))
                    wordArray[numberOfWords] = splitStr + " "
                    wordLengthArray[numberOfWords] = splitStr.length + 1
                    numberOfWords += 1
                }
            }
        }
        else if (displayShowAlign == ShowAlign.Right) {                     //for right alignment the words need to be split with the white space at the beginning of the word
            for (textLoop = 0; textLoop <= text.length; textLoop++) {
                if (text.charAt(textLoop) == " ") {
                    let splitStr = text.substr(startOfNewWord, (textLoop - startOfNewWord))

                    if (numberOfWords == 0) {                               //add a space on to the front of the first word
                        wordArray[numberOfWords] = " " + splitStr           //store string in array
                        wordLengthArray[numberOfWords] = splitStr.length    //store string length in array
                    }
                    else {
                        wordArray[numberOfWords] = splitStr                 //store string in array
                        wordLengthArray[numberOfWords] = splitStr.length    //store string length in array
                    }
                    numberOfWords += 1                                      //increament the number of words found
                    startOfNewWord = textLoop                               //set the position of the next word 
                }
                else if (textLoop == text.length) {                         //if at the end of the length of string, there most likely wont be a space, store the last part in arrays
                    let splitStr = text.substr(startOfNewWord, textLoop)
                    wordArray[numberOfWords] = splitStr
                    wordLengthArray[numberOfWords] = splitStr.length
                    numberOfWords += 1
                }
            }
        }

        textLoop = 0
        let screenLine = 0

        //check the length of words added to string fits on the single line of LCD, if it doesnt start a new line
        for (textLoop = 0; textLoop <= numberOfWords; textLoop++) {

            if (textLoop == numberOfWords) {
                stringArray[numberOfStrings] = createString
                numberOfStrings += 1
            }
            else if ((screenLine + wordLengthArray[textLoop]) <= LCD_LINE_LENGTH) {  //check the current string length plus the next word legnth will fit on the LCD line
                createString = createString + wordArray[textLoop]               //if it does, add it to the string
                screenLine = createString.length                                //increase the displayed string length to check ready for next word
            }
            else {
                stringArray[numberOfStrings] = createString //save the strings to be displayed on the LCD
                numberOfStrings += 1                        //add the total number of lines to be displayed created
                createString = wordArray[textLoop]          //start with next word
                screenLine = wordLengthArray[textLoop]      //start with the next word length
            }
        }

        textLoop = 0

        //if updating single line, show current string on line and next line
        if (displayShowPage == ShowPage.Single) {
			if (numberOfStrings <= 2)
			{
				displayStringOnLine(LCD_LINE1, stringArray[textLoop])
				if (numberOfStrings == 1){
					displayStringOnLine(LCD_LINE2, "")
				}
				else{
					displayStringOnLine(LCD_LINE2, stringArray[textLoop + 1])
				}
				
			}
			else
			{
				for (textLoop = 0; textLoop <= (numberOfStrings - 2); textLoop++) {
					displayStringOnLine(LCD_LINE1, stringArray[textLoop])
					displayStringOnLine(LCD_LINE2, stringArray[textLoop + 1])
					basic.pause(displayShowTime)
				}
			}
        }
        else if (displayShowPage == ShowPage.Double) {      //if updating two lines show both lines, and then update to show next two lines
			if (numberOfStrings <= 2){
					displayStringOnLine(LCD_LINE1, stringArray[textLoop])
					if (numberOfStrings == 1){
						displayStringOnLine(LCD_LINE2, "")
					}
					else{
						displayStringOnLine(LCD_LINE2, stringArray[textLoop + 1])
					}	
				}
			else {
				for (textLoop = 0; textLoop < numberOfStrings; textLoop++) {
					displayStringOnLine(LCD_LINE1, stringArray[textLoop])
					textLoop++
					if (textLoop >= numberOfStrings) {
						displayStringOnLine(LCD_LINE2, "")
					}
					else {
						displayStringOnLine(LCD_LINE2, stringArray[textLoop])
					}

					basic.pause(displayShowTime)
				}
			}
        }
    }


    /**
	* Display on line string will show the text on the selected line with no scrolling.
    * String is automatically cut to 16 charectors
    * @param text Inputted String to display on screen eg: "Hello!"
    */
    //% blockId=kitronik_VIEWTEXT32_display_single_line
    //% group=Show
    //% block="display on %selectedLine| line string %text"
    //% text.shadowOptions.toString=true
    //% weight=95 blockGap=8
    export function displaySingleLineString(selectedLine: DisplayLine, text: string) {
        if (initialised == false) {
            init()
        }
        let lengthOfText = text.length

        // Check whether the string is longer or shorter than 16 and make adjustments if necessary 
        // Ignore this section if string is exactly 16 characters
        if (lengthOfText > 16) {
            text = text.substr(0, 16)
        }
        else if (lengthOfText <=15) {
            while (text.length <= 15) {
                text = text + " "
            }
        }

        if (selectedLine == DisplayLine.Top) {
            displayStringOnLine(LCD_LINE1, text)
        }
        else if (selectedLine == DisplayLine.Bottom) {
            displayStringOnLine(LCD_LINE2, text)
        }
    }



    /**
    * Scroll Format block allows to set direction of scroll, start and finish position of scroll, and speed adjustment in a delay time
    * @param directionSelected is the direction of scrolling on the display
    * @param formatStart is the selection where the scroll position starts
    * @param formatFinish is the selection where the scroll position finish
    * @param delaySelected is the time between updating the LCD for scrolling eg: 500
    */
    //% blockId=kitronik_VIEWTEXT32_scroll_Parameter
    //% group=Format
    //% block="scroll format: scroll direction %directionSelected| position start %formatStart| position finish %formatFinish| delay(ms) %delaySelected"
    //% delaySelected.min=100 delaySelected.max=1000
    //% weight=75 blockGap=8
    export function scrollParameter(directionSelected: ScrollDirection, formatStart: ScrollPosition, formatFinish: ScrollPosition, delaySelected: number) {
        if (initialised == false) {
            init()
        }
        displayScrollDirection = directionSelected
        displayScrollStartPosition = formatStart
        displayScrollFinishPosition = formatFinish
        displayScrollTime = delaySelected
    }

	/**
    * Scroll String across the display on LCD.
    * @param selectedLine is the choice of which line to scroll the string across
    * @param text to scroll across the display eg: "Hello!"
    */
    //% blockId=kitronik_VIEWTEXT32_scroll_string
    //% group=Show
    //% block="on %selectedLine| scroll text string %text"
    //% text.shadowOptions.toString=true
    //% weight=75 blockGap=8
    export function scrollString(selectedLine: DisplayLine, text: string) {
        if (initialised == false) {
            init()
        }
        let startOfString = 0
        let endOfString = 0
        let textScroll = 0
        let lengthOfText = text.length
        let whiteSpace = "                 "    //this is 16 charectors of whitespace to match the length of the display
        let numberOfWhiteSpace = 0

        //depending on the combination of the start and finish points, add whitespace to the beginning or end of the string
        if ((displayScrollStartPosition == ScrollPosition.Off) && (displayScrollFinishPosition == ScrollPosition.Off)) {
            text = whiteSpace + text + whiteSpace
        }
        else if ((displayScrollStartPosition == ScrollPosition.Off) && (displayScrollFinishPosition == ScrollPosition.On)) {
            if (text.length < 16) {
                while (text.length < 16) {
                    text = text + " "
                }
            }

            if (displayScrollDirection == ScrollDirection.Left) {
                text = whiteSpace + text
            }
            else if (displayScrollDirection == ScrollDirection.Right) {
                text = text + whiteSpace
            }
        }
        else if ((displayScrollStartPosition == ScrollPosition.On) && (displayScrollFinishPosition == ScrollPosition.Off)) {

            if (text.length < 16) {
                while (text.length < 16) {
                    text = text + " "
                }
            }

            if (displayScrollDirection == ScrollDirection.Left) {
                text = text + whiteSpace
            }
            else if (displayScrollDirection == ScrollDirection.Right) {
                text = whiteSpace + text
            }
        }
        else if ((displayScrollStartPosition == ScrollPosition.On) && (displayScrollFinishPosition == ScrollPosition.On)) {
            if (text.length < 16) {
                for (numberOfWhiteSpace = 16 - text.length; numberOfWhiteSpace != 0; numberOfWhiteSpace--) {
                    text = " " + text + " "
                }
            }
        }

        //set the start and end points of the string that is going to be shown on the LCD
        if (displayScrollDirection == ScrollDirection.Left) {
            startOfString = 0
            endOfString = 15
        }
        else if (displayScrollDirection == ScrollDirection.Right) {
            startOfString = (text.length - 16)
            endOfString = text.length
        }

        //loop through the number of times for the length of the string displayed
        //increase or decrease the points of the string, then display the new string till reached the end of the string
        for (textScroll = 0; textScroll <= (lengthOfText + 1); textScroll++) {

            let scrollStr = text.substr(startOfString, endOfString)

            if (selectedLine == DisplayLine.Top) {
                displayStringOnLine(LCD_LINE1, scrollStr)
            }
            else if (selectedLine == DisplayLine.Bottom) {
                displayStringOnLine(LCD_LINE2, scrollStr)
            }

            if (displayScrollDirection == ScrollDirection.Left) {
                if (endOfString <= text.length) {
                    endOfString += 1
                    startOfString += 1
                }
            }
            else if (displayScrollDirection == ScrollDirection.Right) {
                if (startOfString >= 0) {
                    endOfString -= 1
                    startOfString -= 1
                }
            }
            basic.pause(displayScrollTime)
        }
    }

    /**
    * Clear display
    */
    //% blockId=kitronik_VIEWTEXT32_clear_Display
    //% group=Show
    //% block="clear display"
    //% weight=75 blockGap=8
    export function clearDisplay() {
        if (initialised == false) {
            init()
        }
        pins.spiWrite(FUNCTION_SET1_CMD)//function set1 ext=0
        control.waitMicros(40)
        pins.spiWrite(DISPLAY_ON)//display on
        control.waitMicros(40)
        pins.spiWrite(CLEAR_DISPLAY)//clear display
        control.waitMicros(2000)
        pins.spiWrite(0x06)//entry mode set
        control.waitMicros(40)
    }



	/**
    * Clear display Line
    * @param selectedLine is the choice of which line to be cleared
    */
    //% blockId=kitronik_VIEWTEXT32_clear_Display_Line
    //% group=Show
    //% block="clear display line %selectedLine"
    //% weight=75 blockGap=8
    export function clearDisplayLine(selectedLine: DisplayLine) {
        if (initialised == false) {
            init()
        }
        if (selectedLine == DisplayLine.Top)
            displayStringOnLine(LCD_LINE1, "")
        else if (selectedLine == DisplayLine.Bottom)
            displayStringOnLine(LCD_LINE2, "")
    }

	/**
    * Display Emoticon :)
    * @param selectedEmoticon of which Emoticon
    */
    //% blockId=kitronik_VIEWTEXT32_display_Emoticon
    //% group=Characters
    //% block="%selectedEmoticon"
    //% weight=75 blockGap=8
    export function displayEmjoicon(selectedEmoticon: Emoticon): string {
        let emoticon = ""
        if (selectedEmoticon == Emoticon.Happy)
            emoticon = " :) "
        else if (selectedEmoticon == Emoticon.Sad)
            emoticon = " :( "
        else if (selectedEmoticon == Emoticon.Tongue)
            emoticon = " :P "
        else if (selectedEmoticon == Emoticon.Wink)
            emoticon = " ;) "
        else if (selectedEmoticon == Emoticon.Surpise)
            emoticon = " :O "
        else if (selectedEmoticon == Emoticon.Sleeping)
            emoticon = " |-) "
        else if (selectedEmoticon == Emoticon.Kiss)
            emoticon = " :* "
        else if (selectedEmoticon == Emoticon.Grin)
            emoticon = " :D "
        else if (selectedEmoticon == Emoticon.Crying)
            emoticon = " :'( "

        return emoticon
    }
} 
