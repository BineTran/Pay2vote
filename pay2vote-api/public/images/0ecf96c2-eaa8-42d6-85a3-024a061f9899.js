// Requiring the module
const reader = require('xlsx')

// Reading our test file
const file = reader.readFile('./test.csv')

// console.log(file)

let data = []

const sheets = file.SheetNames
console.log(sheets)

for (let i = 0; i < sheets.length; i++) {
  const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[0]])

  temp.forEach((res) => {
    data.push(res)
  })
  data.push({'-':'---------------------'})
}

// Printing data
console.log(data)
