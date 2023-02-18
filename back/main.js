const fs = require('fs')

const findUnique = str => {
    let uniq = []
    for(let i = 0; i < str.length; i++){
      if(!uniq.includes(str[i])){
        uniq = [...uniq, str[i]]
      }
    }
    return uniq;
}

const eq = (a1, a2) => {
  var i = a1.length;
  while (i--) {
    if (a1[i] !== a2[i]) return false;
  }
  return true
}

fs.readFile('./dic.json', 'utf8', (err, data) => {
    if (err) {
      console.log(`Error reading file from disk: ${err}`)
    } else {
      const words = JSON.parse(data)
      const word = [ "Ј", "В", "Д", "И", "К", "Н", "О"]
      
      const a = words.filter(w => eq(findUnique(w).sort(), word))
    
      a.map((v) =>console.log(v))
    }

    

  })
  