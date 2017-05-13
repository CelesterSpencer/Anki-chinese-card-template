try{
    function debug(text) {
        document.getElementById('db').innerHTML += text+"<br>";
    }
    var savedPinyin = [];

    // define grammers
    var ChunkGrammar = "Chunks = chunk:Chunk+ { return chunk; }; Chunk = chunk:(Divider / Word) (WS)? { return chunk; }; Word = word:[^ ,\\.!?/0-9]+ tone:[1-5]? { var result = ''; for (var i = 0; i < word.length; i++) { result += word[i]; } if(tone) result += tone; return { content: result, type: 'word' }; }; Divider = divider:SYMS+ { var result = ''; for (var i = 0; i < divider.length; i++) { result += divider[i]; } return { content: result, type: 'divider' }; }; SYMS = [,\\.!?/]; WS = [ \\t\\n\\r]*";
    var HanziGrammar = "Chunks = chunk:Chunk+ { return chunk; }; Chunk = chunk:(Divider / Word) (WS)? { return chunk; }; Word = word:[^ ,\\.!?/] { var result = ''; for (var i = 0; i < word.length; i++) { result += word[i]; } return { content: result, type: 'word' }; }; Divider = divider:SYMS+ { var result = ''; for (var i = 0; i < divider.length; i++) { result += divider[i]; } return { content: result, type: 'divider' }; }; SYMS = [,\\.!?/];  WS = [ \\t\\n\\r]*";
    var PinyinGrammar = "Pinyin = chars:Chars tone:(Tone)? { return { chars: chars, tone: (tone) ? tone : 5 }; }; Chars = char:Char+ { var result = ''; for(var i = 0; i < char.length; i++) { result += char[i]; } return result; }; Char = [a-zA-Z]; Tone = [1-5] ";

    // build parsers
    var chunkParser  = peg.generate(ChunkGrammar);
    var hanziParser  = peg.generate(HanziGrammar);
    var pinyinParser = peg.generate(PinyinGrammar);

    // create words from hanzi and pinyin
    function parse(hanziInput, pinyinInput) {
        try {
            var words = [];
            var hanziChunks = hanziParser.parse(hanziInput);
            var pinyinChunks = chunkParser.parse(pinyinInput);
            if(hanziChunks.length != pinyinChunks.length) 
                throw 'Length of hanzi and pinyin chunks do not match';
            for(var i = 0; i < hanziChunks.length; i++) {
                if(hanziChunks[i].type != pinyinChunks[i].type) 
                    throw 'Types of hanzi and pinyin chunk do not match';
                var hanzi = hanziChunks[i];
                var pinyin = (pinyinChunks[i].type === 'word') 
                ? pinyinParser.parse(pinyinChunks[i].content) 
                : {chars: pinyinChunks[i].content, tone: 5};
                words.push({hanzi:hanzi.content, pinyin:pinyin.chars, tone:pinyin.tone});
            }
            return words;
        } catch (e) {
            return undefined;
        }
    }

    function isBackSide() {
        return document.getElementById('answer') != null;
    }

    // utility function to get colors depending on the tone
    function getToneColor(tone) {
        switch(tone) {
            case '1':
                return {
                    hanzi: '#C0392B',
                    pinyin:'#E74C3C'
                }
            case '2':
                return {
                    hanzi: '#27AE60',
                    pinyin:'#2ECC71'
                }
            case '3':
                return {
                    hanzi: '#2980B9',
                    pinyin:'#3498DB'
                }
            case '4':
                return {
                    hanzi: '#8E44AD',
                    pinyin:'#9B59B6'
                }
            default:
                return {
                    hanzi: '#7F8C8D',
                    pinyin:'#95A5A6'
                }
        }
    }

    // get the tone marks over the right vocal
    var vocalMap = {
        "a": { priority: 1, tone: { "1": "&#257;", "2": "&#225;", "3": "&#462;", "4": "&#224;", "5": "a" }},
        "e": { priority: 2, tone: { "1": "&#275;", "2": "&#233;", "3": "&#283;", "4": "&#232;", "5": "e" }},
        "o": { priority: 3, tone: { "1": "&#333;", "2": "&#243;", "3": "&#466;", "4": "&#242;", "5": "o" }},
        "u": { priority: 4, tone: { "1": "&#363;", "2": "&#250;", "3": "&#468;", "4": "&#249;", "5": "u" }},
        "i": { priority: 4, tone: { "1": "&#299;", "2": "&#237;", "3": "&#464;", "4": "&#236;", "5": "i" }},
        "v": { priority: 4, tone: { "1": "&#470;", "2": "&#472;", "3": "&#474;", "4": "&#476;", "5": "&#252;" }}
    }
    function getVocalPriority(char) {
        var priority = vocalMap[char];
        priority = (priority != null) ? priority.priority : 5;
        return priority;
    }
    function getCharWithTone(char, tone) {
        console.log(tone);
        var charWithTone = "";
        var charObj = vocalMap[char];
        if (charObj != null) {
            var toneObj = charObj.tone[tone];
            charWithTone = (toneObj != null) ? toneObj : charObj[5];
        } else {
            charWithTone = char;
        }
        return charWithTone;
    }
    function makeTonemarks(word, tone) {
        console.log(word);
        var wordWithTones = word;

        var smallestPriority = 6;
        var idx = -1;
        for (var i = 0; i < word.length; i++) {
            var char = word.charAt(i);
            var priority = getVocalPriority(char);
            if (priority < smallestPriority) {
                smallestPriority = priority;
                idx = i;
            }
        }

        if (idx !== -1) {
            var char = word.charAt(idx);
            var charWithTone = getCharWithTone(char, tone);
            console.log(charWithTone);
            wordWithTones = word.replace(char,charWithTone);
        }
        return wordWithTones;
    }

    // create the final template for hanzi and pinyin
    function createTemplate(words,resultId,hanziId,pinyinId) {
        if(words) {
            var root = document.getElementById(resultId);
            var wrap = document.createElement('wrap');
            for(var i = 0; i < words.length; i++) {
                var charComp = document.createElement('character');
                var colors = getToneColor(words[i].tone);

                var hanziComp = document.createElement('hanzi');
                hanziComp.innerHTML = words[i].hanzi;
                hanziComp.style.background = colors.hanzi;

                var pinyinComp = document.createElement('pinyin');
                savedPinyin.push(makeTonemarks(words[i].pinyin, words[i].tone));
                pinyinComp.innerHTML = '&zwnj;'; // non printable character to preserve elements size
                pinyinComp.style.background = colors.pinyin;

                charComp.appendChild(hanziComp);
                charComp.appendChild(pinyinComp);
                wrap.appendChild(charComp);
                root.appendChild(wrap);
            }
            document.getElementById(hanziId).outerHTML = '';
            document.getElementById(pinyinId).outerHTML = '';
        }
    }

    // split translations with regards to a semicolon divider
    function processTranslation(text, translationId) {
        var root = document.getElementById(translationId);
        document.getElementById(translationId).innerHTML = '';
        var translations = text.split(';');
        if (translations != null) {
            for (var i = 0; i < translations.length; i++) {
                var translationDiv = document.createElement('div');
                translationDiv.innerHTML = translations[i];
                root.appendChild(translationDiv);
            }   
        }
    }

    // entry point
    var hanziText = document.getElementById('hz').innerHTML;
    var pinyinText = document.getElementById('py').innerHTML;
    var words = parse(hanziText, pinyinText);
    createTemplate(words,'ch','hz','py');
}catch(err) {
    document.getElementById('db').innerHTML = err;
}