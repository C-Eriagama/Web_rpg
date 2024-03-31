let xp = 0
let hp = 100
let gold = 50
let power = 5
let currentWeapon = 0
let fighting
let monsterHealth
let inventory = ['stick']

const button1 = document.querySelector('#button1')
const button2 = document.querySelector('#button2')
const button3 = document.querySelector('#button3')
const text = document.querySelector('#text')
const xpText = document.querySelector('#xpText')
const hpText = document.querySelector('#healthText')
const goldText = document.querySelector('#goldText')
const powerText = document.querySelector('#powerText')
const monsterStats = document.querySelector('#monsterStats')
const monsterNameText = document.querySelector('#monsterName')
const monsterHealthText = document.querySelector('#monsterHealth')

const weapons = [
  {
    name: 'stick',
    power: 5
  },
  {
    name: 'dagger',
    power: 30
  },
  {
    name: 'claw hammer',
    power: 50
  },
  {
    name: 'sword',
    power: 100
  }
]

const monsters = [
  {
    name: 'Slime',
    level: 2,
    health: 15
  },
  {
    name: 'Fanged Beast',
    level: 8,
    health: 60
  },
  {
    name: 'Dragon',
    level: 20,
    health: 300
  }
]

const locations = [
  {
    name: 'Town Square',
    'button text': ['Go to store', 'Go to cave', 'Fight dragon'],
    'button functions': [goStore, goCave, fightDragon],
    text: 'You are in the town square. You see a sign that says "Store."'
  },
  {
    name: 'Store',
    'button text': [
      'Buy 10 health (10 gold)',
      'Buy weapon (30 gold)',
      'Go to town square'
    ],
    'button functions': [buyHp, buyWeapon, goTown],
    text: 'You enter the store.'
  },
  {
    name: 'Cave',
    'button text': ['Fight slime', 'Fight fanged beast', 'Go to town square'],
    'button functions': [fightSlime, fightFangedBeast, goTown],
    text: 'You enter the cave. You see some monsters.'
  },
  {
    name: 'Fight',
    'button text': ['Attack', 'Dodge', 'Flee'],
    'button functions': [attack, dodge, goTown],
    text: 'You are fighting a monster'
  },
  {
    name: 'Kill Monster',
    'button text': ['Go to town square', 'Go to town square', 'Go to town square'],
    'button functions': [goTown, goTown, goTown],
    text: 'The monster screams "Arg!" As it dies. You gain experience and find gold.'
  },
  {
    name: 'Lose',
    'button text': ['Replay?', 'Replay?', 'Replay?'],
    'button functions': [restart, restart, restart],
    text: 'You die...'
  },
  {
    name: 'Win',
    'button text': ['Replay?', 'Replay?', 'Replay?'],
    'button functions': [restart, restart, restart],
    text: 'You defeat the dragon! YOU WIN THE GAME!'
  },
  {
    name: 'Easter Egg',
    'button text': ['2', '8', 'Go to town square?'],
    'button functions': [pickTwo, pickEight, goTown],
    text: 'You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10.' +
      'If the number you choose matches one of the random numbers, you win!'
  }
]

// initialize buttons
button1.onclick = goStore
button2.onclick = goCave
button3.onclick = fightDragon

function update(location) {
  // Chance of easter egg when heading to town
  if (location === locations[0]) {
    if (Math.random() < 0.1) {
      location = locations[7]
    }
  }
  monsterStats.style.display = 'none'
  button1.innerText = location['button text'][0]
  button2.innerText = location['button text'][1]
  button3.innerText = location['button text'][2]
  button1.onclick = location['button functions'][0]
  button2.onclick = location['button functions'][1]
  button3.onclick = location['button functions'][2]
  text.innerText = location.text
}

function goTown() {
  update(locations[0])
}

function goStore() {
  update(locations[1])
}

function goCave() {
  update(locations[2])
}

function buyHp() {
  if (gold >= 10) {
    updateGold(gold - 10)
    updateHp(hp + 10)
    text.innerText = 'You have bought extra 10 health.'
  } else {
    text.innerText = 'You do not have enough gold to buy health.'
  }
}

function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      updateGold(gold - 30)
      currentWeapon++
      updatePower(weapons[currentWeapon].power)
      let newWeapon = weapons[currentWeapon].name
      text.innerText = 'You now have a ' + newWeapon + '.'
      inventory.push(newWeapon)
      text.innerText += ' In your inventory you have: a ' + inventory.join(', a ')
    } else {
      text.innerText = 'You do not have enough gold to buy a weapon. '
    }
  } else {
    text.innerText = 'You already have the most powerful weapon!'
    button2.innerText = 'Sell weapon for 15 gold.'
    button2.onclick = sellWeapon
  }
}

function sellWeapon() {
  if (inventory.length > 1) {
    updateGold(gold + 15)
    let currentWeapon = inventory.shift()
    text.innerText = 'You sold a ' + currentWeapon + '.'
    text.innerText += ' In your inventory you have: ' + inventory.join(', ')
  } else {
    text.innerText = "Don't sell your only weapon!"
  }
}

function formatInventory() { }

function fightSlime() {
  fighting = 0
  goFight()
}

function fightFangedBeast() {
  fighting = 1
  goFight()
}

function fightDragon() {
  fighting = 2
  goFight()
}

function goFight() {
  update(locations[3])
  updateMonsterHealth(monsters[fighting].health)
  monsterNameText.innerText = monsters[fighting].name
  monsterStats.style.display = 'block'
}

function attack() {
  //monster attacks
  text.innerText = 'The ' + monsters[fighting].name + ' attacks '
  let damageTaken = getMonsterAttackValue(monsters[fighting].level)
  updateHp(hp - damageTaken)
  text.innerText += " you for " + damageTaken + " damage."


  text.innerText += 'You attack it with your ' + weapons[currentWeapon].name + ' '
  //attack monster
  if (isMonsterHit()) {
    let damageDealt = weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1
    updateMonsterHealth(monsterHealth - damageDealt)
    text.innerText += " for " + damageDealt + " damage."
  } else {
    text.innerText += ' and you miss.'
  }



  // check fight result
  if (hp <= 0) {
    lose()
  } else if (monsterHealth <= 0) {
    fighting === 2 ? winGame() : defeatMonster()
  }

  // weapon breaks
  if (Math.random() <= 0.08 && inventory.length !== 1) {
    text.innerText += 'Your ' + inventory.pop() + ' breaks.'
    currentWeapon--
  }
}

function getMonsterAttackValue(level) {
  let hit = level * 5 - Math.floor(Math.random() * xp)
  return hit
}

function isMonsterHit() {
  return Math.random() > 0.2 || hp < 20
}

function dodge() {
  text.innerText =
    'You dodged the attack from the ' + monsters[fighting].name + '.'
}

function defeatMonster() {
  let xpGained = monsters[fighting].level
  let goldGained = Math.floor(monsters[fighting].level * 6.7)
  locations[4].text = "The monster screams \"Arg!\" As it dies. You gain " + xpGained + " XP and find " + goldGained + " gold."
  updateGold(gold + goldGained)
  updateXp(xp + xpGained)
  update(locations[4])
}



function lose() {
  update(locations[5])
}

function winGame() {
  update(locations[6])
}

function restart() {
  updateXp(0)
  updateHp(100)
  updateGold(50)
  currentWeapon = 0
  updatePower(weapons[currentWeapon].power)
  inventory = ['stick']
  goTown()
}

function easterEgg() {
  update(locations[7])
}

function pickTwo() {
  pick(2)
}

function pickEight() {
  pick(8)
}

function pick(guess) {
  // pick random numbers
  let numbers = []
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11))
  }

  // write down numbers
  text.innerText = "You picked " + guess + ". Here are the random numbers: \n"
  for (let i = 0; i < numbers.length; i++) {
    text.innerText += numbers[i] + "\n"
  }

  // count the guesses and provide a reward
  let count = countNumbers(guess, numbers)
  if (count > 0) {
    let value = Math.floor(Math.random() * 20) * count + 10
    text.innerText += "Correct! You win " + value + " gold!"
    updateGold(gold + value)
  } else {
    text.innerText += "Wrong! You lose 10 health!"
    updateHp(hp - 10)
    if (hp <= 0) {
      lose()
    }
  }

  // Change buttons to go to town
  let location = locations[1]
  button1.innerText = location['button text'][2]
  button2.innerText = location['button text'][2]
  button3.innerText = location['button text'][2]
  button1.onclick = location['button functions'][2]
  button2.onclick = location['button functions'][2]
  button3.onclick = location['button functions'][2]
}

function countNumbers(guess, numbers) {
  let count = 0
  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] === guess) {
      count++
    }
  }
  return count
}

function updateHp(value) {
  hp = value
  hpText.innerText = hp
}

function updateGold(value) {
  gold = value
  goldText.innerText = gold
}

function updateXp(value) {
  xp = value
  xpText.innerText = xp
}

function updatePower(value) {
  power = value
  powerText.innerText = power
}

function updateMonsterHealth(value) {
  monsterHealth = value
  monsterHealthText.innerText = monsterHealth
}


