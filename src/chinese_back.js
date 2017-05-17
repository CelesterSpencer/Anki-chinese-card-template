try{
    function fillPinyin() {
        var pinyinElements = document.getElementsByTagName('pinyin');
        for (var i = 0; i < pinyinElements.length; i++) {
            pinyinElements[i].innerHTML = savedPinyin[i];
        }
    }
    function addHRIfHintIsPresent() {
        var content = document.getElementById('aw');
        console.log(content);
        if(content.childNodes.length > 0) {
            console.log("content has elements");
            var hr = document.createElement('hr');
            var aw = document.getElementById('aw');
            var parent = aw.parentNode;
            parent.insertBefore(hr, aw);
        }
    }
    
    var translationText = document.getElementById('tl');
    if (translationText != null) {
        translationText = translationText.innerHTML;			
        processTranslation(translationText,'tl');
    }
    
    fillPinyin();
    addHRIfHintIsPresent();
} catch(err) {
    document.getElementById('db').innerHTML = err;
}