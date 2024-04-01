let xp;
let health;
let gold;
let currentWeapon;
let fighting;
let nextMonster;
let monsterHealth
let inventory = ["stick"];

const controls = document.querySelector('#controls')
const button1 = document.querySelector('#button1')
const button2 = document.querySelector('#button2')
const button3 = document.querySelector('#button3')
const button4 = document.querySelector('#button4')
const buttons = [button1, button2, button3, button4]
const text = document.querySelector('#text')
const xpText = document.querySelector('#xpText')
const hpText = document.querySelector('#healthText')
const goldText = document.querySelector('#goldText')
const powerText = document.querySelector('#powerText')
const monsterStats = document.querySelector('#monsterStats')
const monsterNameText = document.querySelector('#monsterName')
const monsterHealthText = document.querySelector('#monsterHealth')
const easterEggButtons = document.querySelector('#easterEggButtons')

const weapons = [
  {
    name: 'stick',
    power: 5
  },
  {
    name: 'dagger',
    power: 25
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
    level: 1,
    health: 10
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

const locationNames = {
  Town: "Town Square",
  Store: "Store",
  Cave: "Cave",
  Jungle: "Jungle",
  Fight: "Fight",
  Kill: "Kill Monster",
  Lose: "Lose",
  Win: "Win",
  EasterEgg: "Easter Egg"
}

const locations = [
  {
    name: locationNames.Town,
    'button text': ['Go to store', 'Go to cave', 'Go to jungle', 'Fight dragon'],
    'button functions': [goStore, goCave, goJungle, fightDragon],
    text: 'Welcome to Dragon Repeller. You must defeat the dragon that is preventing people from leaving the town.' +
      ' You are in the town square. Where do you want to go? Use the buttons above.'
  },
  {
    name: locationNames.Store,
    'button text': [
      'Buy 10 health (10 gold)',
      'Buy weapon (30 gold)',
      'Go to town square'
    ],
    'button functions': [buyHp, buyWeapon, goTown],
    text: 'You enter the store.'
  },
  {
    name: locationNames.Cave,
    'button text': ['Fight slime', 'Fight fanged beast', 'Go to town square'],
    'button functions': [fightSlime, fightFangedBeast, goTown],
    text: 'You enter the cave. You see some monsters.'
  },
  {
    name: locationNames.Jungle,
    'button text': ['Fight slime', 'Fight fanged beast', 'Go to town square'],
    'button functions': [fightSlime, fightFangedBeast, goTown],
    text: 'You enter the cave. You see some monsters.'
  },
  {
    name: locationNames.Fight,
    'button text': ['Attack', 'Dodge', 'Flee'],
    'button functions': [attack, dodge, goTown],
    text: 'You are fighting a monster'
  },
  {
    name: locationNames.Kill,
    'button text': ['Continue in cave', 'Head to jungle', 'Return to town square'],
    'button functions': [goCave, goJungle, goTown,],
    text: 'The monster screams "Arg!" As it dies. You gain experience and find gold.'
  },
  {
    name: locationNames.Lose,
    'button text': ['Replay?', 'Replay?', 'Replay?'],
    'button functions': [restart, restart, restart],
    text: 'You die...'
  },
  {
    name: locationNames.Win,
    'button text': ['Replay?', 'Replay?', 'Replay?'],
    'button functions': [restart, restart, restart],
    text: 'YOU DEFEAT THE DRAGON! THE TOWN IS SAVED AND YOU WIN THE GAME!'
  },
  {
    name: locationNames.EasterEgg,
    'button text': ['2', '8', 'Go to town square?'],
    'button functions': [goTown, goTown, goTown],
    text: 'You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10.' +
      'If the number you choose matches one of the random numbers, you win!'
  }
]

// initialize button functions
button1.onclick = goStore
button2.onclick = goCave
button3.onclick = goJungle
button4.onclick = fightDragon
restart()

function update(location) {
  // Chance of easter egg when heading to town
  if (location.name === locationNames.Town) {
    if (Math.random() < 0.05) {
      easterEgg()
      return;
    }
  }

  // going to monsters
  if (location.name === locationNames.Cave) {
    let killLocation = getLocation(locationNames.Kill)
    killLocation["button text"][0] = "Continue in Cave"
    killLocation["button text"][1] = "Head to Jungle"
  } else if (location.name === locationNames.Jungle) {
    let killLocation = getLocation(locationNames.Kill)
    killLocation["button text"][0] = "Head back to Cave"
    killLocation["button text"][1] = "Continue in Jungle"
  }

  easterEggButtons.style.display = "none"
  controls.style.display = "block"
  monsterStats.style.display = 'none'

  //buttons
  let i
  for (i = 0; i < location['button text'].length; i++) {
    buttons[i].innerText = location['button text'][i]
    buttons[i].onclick = location['button functions'][i]
    buttons[i].disabled = false;
    buttons[i].style.display = ""
  }
  if (i === 3) {
    button4.style.display = "none"
  }

  text.innerText = location.text
}

function getLocation(locationName) {
  for (let i = 0; i < locations.length; i++) {
    if (locations[i].name === locationName) {
      return locations[i]
    }
  }
}




function goTown() {
  update(getLocation(locationNames.Town))
  if (nextMonster < 2) {
    button3.disabled = true;
  }
}

function goStore() {
  update(getLocation(locationNames.Store))
}

function goCave() {
  update(getLocation(locationNames.Cave))
  if (nextMonster === 0) {
    button2.disabled = true;
  }
}

function goJungle() {
  update(getLocation(locationNames.Jungle))
  if (nextMonster < 2) {
    button1.disabled = true;
  }
  if (nextMonster < 3) {
    button2.disabled = true;
  }
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
  update(getLocation(locationNames.Fight))
  updateMonsterHealth(monsters[fighting].health)
  monsterNameText.innerText = monsters[fighting].name
  monsterStats.style.display = 'block'
}

function monsterAttack() {
  //monster attacks
  text.innerText += ' The ' + monsters[fighting].name + ' attacks '
  let damageTaken = getMonsterAttackValue(monsters[fighting].level)
  //Monster misses
  if (Math.random() < 0.05) {
    damageTaken = 0
    text.innerText += " but you dodged the attack."
  } else {
    updateHp(hp - damageTaken)
    text.innerText += " you for " + damageTaken + " damage."
  }
}

function attack() {
  //attack monster
  text.innerText = 'You attack it with your ' + weapons[currentWeapon].name + ' '
  if (isMonsterHit()) {
    let damageDealt = Math.floor(weapons[currentWeapon].power * (Math.random() * 0.2 + 0.9))

    //crit chance
    if (Math.random() < 0.1) {
      damageDealt = Math.floor(damageDealt * (Math.random() + 1.25))
      text.innerText += " AND CRIT FOR " + damageDealt + " DAMAGE!"
    } else {
      text.innerText += " for " + damageDealt + " damage."
    }

    // weapon breaks
    if (Math.random() <= 0.075 && inventory.length > 2) {
      text.innerText += 'Your ' + inventory.pop() + ' breaks.'
      currentWeapon--
    }

    updateMonsterHealth(monsterHealth - damageDealt)
  } else {
    text.innerText += ' and you miss.'
  }

  monsterAttack()
  fightOutcome()
}

function getMonsterAttackValue(level) {
  let hit = level * 5 - Math.floor(Math.random() * xp / 5) //adjust damage based on xp
  hit = Math.floor(hit * (Math.random() + 0.6)) // random variance in damage 0.6x go 1.6x
  return hit <= 0 ? 1 : hit
}

function isMonsterHit() {
  return Math.random() > 0.1 || hp < 20
}

function dodge() {
  if (Math.random() > 0.1) {
    text.innerText = 'You dodged the attack from the ' + monsters[fighting].name + '.'
  } else {
    text.innerText = "You failed to dodge the attack. "
    monsterAttack()
  }
  fightOutcome()
}

function fightOutcome() {
  if (hp <= 0) {
    lose()
  } else if (monsterHealth <= 0) {
    fighting === 2 ? winGame() : defeatMonster()
  }
}

function defeatMonster() {
  let xpGained = Math.floor(monsters[fighting].level * (Math.random() * + 1) + 2)
  let goldGained = Math.floor(monsters[fighting].level * (Math.random() * 4 + 2) + 10)
  getLocation(locationNames.Kill).text = "The monster screams \"Arg!\" As it dies. You gain " + xpGained + " XP and find " + goldGained + " gold."
  updateGold(gold + goldGained)
  updateXp(xp + xpGained)
  update(getLocation(locationNames.Kill))
  nextMonster = fighting === nextMonster ? nextMonster + 1 : nextMonster
  if (nextMonster < 2) {
    button2.disabled = true;
  }
}




function lose() {
  update(getLocation(locationNames.Lose))
}

function winGame() {
  update(getLocation(locationNames.Win))
}

function restart() {
  updateXp(0)
  updateHp(100)
  updateGold(0)
  currentWeapon = 0
  nextMonster = 0
  updatePower(weapons[currentWeapon].power)
  inventory = ['stick']
  goTown()
}




function easterEgg() {
  easterEggButtons.style.display = "block"
  controls.style.display = "none"
  monsterStats.style.display = 'none'
  text.innerText = getLocation(locationNames.EasterEgg).text
  let children = easterEggButtons.childNodes
  console.log(children)
  for (let i = 0; i < 10; i++) {
    children.item(2 * i + 1).onclick = function () { pick(i) }
  }
  children.item(21).onclick = goTown
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
  easterEggButtons.style.display = "none"
  controls.style.display = "block"
  let location = getLocation(locationNames.Store)

  for (i = 0; i < 3; i++) {
    buttons[i].innerText = location['button text'][2]
    buttons[i].onclick = location['button functions'][2]
    buttons[i].disabled = false;
    buttons[i].style.display = ""
  }
  button4.style.display = "none"
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


