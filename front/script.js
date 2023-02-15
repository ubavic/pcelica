var word = "";
var points;

var letters = ['У', 'Т', 'Р', 'В', 'Њ', 'А', 'Е']

const ranks =
    [
        {points: 0, rank: "Почетник"},
        {points: 5, rank: "Добар"},
        {points: 10, rank: "Солидан"},
        {points: 20, rank: "Врло добар"},
        {points: 30, rank: "Одличан"},
        {points: 50, rank: "Изузетан"},
        {points: 80, rank: "Геније"},
    ]

const renderWord = () => {
    const box = document.getElementById('line')

    lettersHTML = word
        .split('')
        .map(v => v !== letters[0] ? v : `<span class='theLetter'>${v}</span>`)
        .reduce((a, b) => a + b, "")

    box.innerHTML = lettersHTML + '<span id="blink"></span>'
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

const checkWord = () => {
    if (word === "") return shake()

    const nl = word.split('').filter(l => l == letters[0])
    if (nl === 0) return shake()

    return fetch('/words', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({Word: word.toLowerCase()})
    }).then(res => {
        if (res.ok) return res.json()

        throw Error()
    }).then(r => {
        if (r.Found === "true") {
            points = points + 10 * word.length
            renderPoints()
            word = ""
            renderWord()
        } else {
            return shake()
        }
    }).catch(r => {})
}

const setLetters = () => {
    for (i = 0; i < 7; i++) {
        const hex = document.getElementById(`h${i}`)
        hex.children[1].textContent = letters[i]
    }
}

const shuffleWord = () => {
    for (i = 1; i < 7; i++) {
        const hex = document.getElementById(`h${i}`)
        hex.children[1].classList.add('faded-text')
    }

    setTimeout(() => {
        const xs = letters.slice(1).map(l => ({l, n: Math.random()})).sort((a, b) => a.n - b.n > 0).map(s => s.l)
        letters = [letters[0], ...xs]
        setLetters()
    }, 200)

    setTimeout(() => {
        for (i = 1; i < 7; i++) {
            const hex = document.getElementById(`h${i}`)
            hex.children[1].classList.remove('faded-text')
        }
    }, 400)
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
