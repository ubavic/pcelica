var word = "";
var points;

var letters = ['У', 'Љ', 'А', 'В', 'Н', 'E', 'Б']

const renderWord = () => {
    const box = document.getElementById('line')

    lettersHTML = word
        .split('')
        .map(v => v !== letters[0] ? v : `<span class='theLetter'>${v}</span>`)
        .reduce((a, b) => a + b, "")

    box.innerHTML = lettersHTML
}

const deleteWord = () => {
    if (word !== "")
        word = word.slice(0, -1)
    
    renderWord()
}

const renderPoints = () => {
    const box = document.getElementById('points')
    box.textContent = points
}

const shake = () => {
    const box = document.getElementById('line')
    box.classList.add('shakeAnimation')

    setTimeout(() => box.classList.remove("shakeAnimation"), 200);
}

const checkWord = () =>
    fetch('/words', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({Word: word})
    }).then(res => {
        if (res.ok) return res.json()

        throw Error()
    }).then(r => {
        if (r.Found = "true") {
            points = 10 * word.length
            renderPoints()
            word = ""
            renderWord()
        } else {
            shake()
        }
    }).catch(r => {})


const setLetters = () => {
    for (i = 0; i < 7; i++) {
        const hex = document.getElementById(`h${i}`)
        hex.children[1].textContent = letters[i]
    }
}

const setup = () => {
    word = ""
    points = 0
    renderPoints()
    setLetters()
    renderWord()

    for (let i = 0; i < 7; i++) {
        let hex = document.getElementById(`h${i}`)
        let j = i
        
        hex.addEventListener("click", () => {
            word = word + letters[j]
            renderWord()
        })
    }

}


window.onload = setup
