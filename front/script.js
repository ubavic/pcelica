var word = "";
var usedWords = [];

var letters = ['Н', 'И', 'Ј', 'Д', 'К', 'В', 'О']

const ranks =
    [
        {points: 0, rank: "Почетник"},
        {points: 50, rank: "Добар"},
        {points: 100, rank: "Солидан"},
        {points: 150, rank: "Врло добар"},
        {points: 200, rank: "Одличан"},
        {points: 300, rank: "Изузетан"},
        {points: 500, rank: "Геније"},
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
    const points = usedWords.reduce((s, w) => 10 * w.length + s, 0)
    const box = document.getElementById('points')
    const rank = ranks.filter(r => r.points <= points).at(-1)?.rank
    if (!!rank) {
        box.classList.add('faded-text')
        setTimeout(() => box.innerHTML = `<div>${rank}</div><div>${points}</div>`, 200)
        setTimeout(() => box.classList.remove('faded-text'), 200)    
    }
}

const renderUsedWords = () => {
    usedWordsHTML = usedWords.map(v => `<div>${v}</div>`).reduce((a, b) => a + b, "")
    document.getElementById('words').innerHTML = usedWordsHTML
}

const shake = () => {
    const box = document.getElementById('line')
    box.classList.add('shakeAnimation')

    setTimeout(() => box.classList.remove("shakeAnimation"), 200);
}

const checkWord = () => {
    if (word === "") return shake()

    const nl = word.split('').filter(l => l === letters[0])
    if (nl.length === 0) return shake()

    const uw = usedWords.filter(w => w === word)
    if(uw.length !== 0) return shake()

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
            usedWords = [...usedWords, word]
            renderPoints()
            renderUsedWords()
            word = ""
            renderWord()
            colorDots()
            updateStorage()

            if (usedWords.length > 15) end()

        } else {
            return shake()
        }
    }).catch(console.log)
}

const end = () => {
    document.getElementById('end').style.display = 'flex'
    usedWordsHTML = usedWords.map(v => `<div>${v}</div>`).reduce((a, b) => a + b, "")
    document.getElementById('end-words').innerHTML = usedWordsHTML
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

const closeBackdrop = () => {
    document.getElementById('words').classList.add('moved')
    setTimeout(() => document.getElementById('backdrop').style.display = 'none', 200)
}

const openBackdrop = () => {
    document.getElementById('backdrop').style.display = 'flex'
    setTimeout(()=>document.getElementById('words').classList.remove('moved'), 10)
}

const colorDots = () => {
    const dots = [...document.getElementById('dots').children]
    dots.forEach((dot, index) => {
        if (index < usedWords.length)
            dot.style.backgroundColor = `#000`
    })
}

const loadStorage = () => {
    const state = JSON.parse(localStorage.getItem('state'))

    if (!state) return
    
    const date = new Date(state?.date ?? 0)
    const now = new Date()

    const sameDate = date.getDate() === now.getDate()

    if (!sameDate) return

    if (!!state.usedWords && !!state.points) {
        usedWords = state.usedWords
        points = state.points
    }
}

const updateStorage = () => {
    const date = new Date()
    localStorage.setItem('state', JSON.stringify({date, usedWords, points}))
}

const setup = () => {
    word = ""
    points = 0
    loadStorage()
    setLetters()
    renderWord()
    colorDots()
    renderUsedWords()
    renderPoints()

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
