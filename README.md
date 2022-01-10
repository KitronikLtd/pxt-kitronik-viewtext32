# pxt-kitronik-viewtext32

# Kitronik blocks for micro:bit

Blocks that support [Kitronik kits and shields for the micro:bit](https://www.kitronik.co.uk/microbit.html)
This package is for the [Kitronik :VIEW Text32](https://kitronik.co.uk/5650).

For microPython support see: https://github.com/KitronikLtd/micropython-microbit-kitronik-text32

Show String block will show the inserted string and automatically update the screen if string is more than 32 characters:
```blocks
Kitronik_VIEWTEXT32.showString("Hello!")
```

Scroll String block scrolls the inserted string across the screen till the end of the string:
```blocks
Kitronik_VIEWTEXT32.scrollString(Kitronik_VIEWTEXT32.DisplayLine.Top, "Hello!")

```

Clear Display block will clear what is currently displayed on screen:
```blocks
Kitronik_VIEWTEXT32.clearDisplay()

```

Clear Display Line block will clear what is currently displayed on the selected line:
```blocks
Kitronik_VIEWTEXT32.clearDisplayLine(Kitronik_VIEWTEXT32.DisplayLine.Top)
```

Show Parameter block allows the user to alter the alignment of text, update a single line or double lines of the screen, select time delay between refresh of screen. The block needs to be placed before a show string block for the changes to take effect:
```blocks
Kitronik_VIEWTEXT32.showParameter(Kitronik_VIEWTEXT32.ShowAlign.Left, Kitronik_VIEWTEXT32.ShowPage.Single, 1500)
```

Scroll Parameter block allows the user to alter the direction of the scroll of text, select the start and finish positions of the scrolling test, select time delay between refresh of screen. The block needs to be placed before a scroll string block for the changes to take effect:
```blocks

Kitronik_VIEWTEXT32.scrollParameter(
Kitronik_VIEWTEXT32.ScrollDirection.Left,
Kitronik_VIEWTEXT32.ScrollPosition.Off,
Kitronik_VIEWTEXT32.ScrollPosition.Off,
500
)
```

Emjoicon block gives a list of emojis that can be added into a string of text using join text or displayed on their own:
```blocks
let myString = "Hello" + Kitronik_VIEWTEXT32.displayEmjoicon(Kitronik_VIEWTEXT32.Emoticon.Happy)
```

## License

MIT

## Supported targets

* for PXT/microbit
