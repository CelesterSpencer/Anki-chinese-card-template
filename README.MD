# Anki chinese card template

The idea of this template is to make it easier to associate hanzi with pinyin and the corresponding tone.
Hanzi and pinyin are wrapped in a box with a color that corresponds to a tone.

The card template contains 4 fields
* Hanzi
* Pinyin
* Translation
* Hint

To create the layout the number of *chunks* for pinyin and hanzi have to fit. For hanzi every character is a chunk. Also an array of symbols ended by a whitespace <span style="border: solid 1px gray; border-radius:3px;">.,;!?</span> is a chunk. For pinyin letters that may or may not be followed by a number are considered as a chunk.

#### Example
```
	我是从 ... 來的.
    wo3 shi4 cong2 ... lai2 de.
```
| 我 | 是 | 从 | ... | 來 | 的 | . |
|----|---|----|-----|----|---|---|
| wo3 | shi4 | cong2 | ... | lai2 | de | . |

## Colors

This template has a custom color coding. But can be changed to fit color codings of other programs.

| tone 		| color 	|
|-----------|-----------|
| first  	| red 		|
| second 	| green 	|
| third 	| blue 		|
| forth 	| purple 	|
| fifth/no 	| gray 		|