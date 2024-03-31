let xp;
let health;
let gold;
let currentWeapon;
let fighting;
let nextMonster;
let monsterHealth
let inventory = ["stick"];

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
    power: 15
  },
  {
    name: 'claw hammer',
    power: 30
  },
  {
    name: 'sword',
    power: 55
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

// initialize button functions
button1.onclick = goStore
button2.onclick = goCave
button3.onclick = fightDragon
restart()

function update(location) {
  // Chance of easter egg when heading to town
  if (location === locations[0]) {
    if (Math.random() < 0.05) {
      easterEgg()
    }
  }
  monsterStats.style.display = 'none'
  button1.innerText = location['button text'][0]
  button2.innerText = location['button text'][1]
  button3.innerText = location['button text'][2]
  button1.onclick = location['button functions'][0]
  button2.onclick = location['button functions'][1]
  button3.onclick = location['button functions'][2]
  button1.disabled = false;
  button2.disabled = false;
  button3.disabled = false;

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
  if (nextMonster === 0) {
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
  update(locations[3])
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
    let damageDealt = weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1

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
  // check fight result
  if (hp <= 0) {
    lose()
  } else if (monsterHealth <= 0) {
    fighting === 2 ? winGame() : defeatMonster()
  }
}

function getMonsterAttackValue(level) {
  let hit = level * 4 - Math.floor(Math.random() * xp)
  hit = Math.floor(hit * (Math.random() + 0.5))
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
}

function defeatMonster() {
  let xpGained = Math.floor(monsters[fighting].level * (Math.random() * 1.5 + 1))
  let goldGained = Math.floor(monsters[fighting].level * (Math.random() * 4 + 2) + 10)
  locations[4].text = "The monster screams \"Arg!\" As it dies. You gain " + xpGained + " XP and find " + goldGained + " gold."
  updateGold(gold + goldGained)
  updateXp(xp + xpGained)
  update(locations[4])
  nextMonster = fighting === nextMonster ? nextMonster + 1 : nextMonster
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
  updateGold(0)
  currentWeapon = 0
  nextMonster = 0
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


