try{
    function fillPinyin() {
        var pinyinElements = document.getElementsByTagName('pinyin');
        for (var i = 0; i < pinyinElements.length; i++) {
            pinyinElements[i].innerHTML = savedPinyin[i];
        }
    }
    
    var translationText = document.getElementById('tl');
    if (translationText != null) {
        translationText = translationText.innerHTML;			
        processTranslation(translationText,'tl');
    }
    fillPinyin();
} catch(err) {
    document.getElementById('db').innerHTML = err;
}