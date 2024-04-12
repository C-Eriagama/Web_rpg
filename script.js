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
const scene = document.querySelector('#scene')
const player = document.querySelector('#player')

const weapons = [
  {
    name: 'stick',
    power: 5,
    cost: 0
  },
  {
    name: 'blunt dagger',
    power: 12,
    cost: 20
  },
  {
    name: 'spear',
    power: 25,
    cost: 50
  },
  {
    name: 'mace',
    power: 40,
    cost: 90
  },
  {
    name: 'heavy sword',
    power: 60,
    cost: 140
  },
  {
    name: 'dragons blade',
    power: 100,
    cost: 200
  }
]

const monsters = [
  {
    name: 'Slime',
    level: 2,
    health: 10
  },
  {
    name: 'Goblin',
    level: 5,
    health: 25
  },
  {
    name: 'Spirits',
    level: 10,
    health: 55
  },
  {
    name: 'Fanged Beast',
    level: 15,
    health: 90
  },
  {
    name: 'Dragon',
    level: 25,
    health: 500
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
    image: "images/town3.jpeg",
    'button text': ['Go to store', 'Go to cave', 'Go to jungle', 'Fight dragon'],
    'button functions': [goStore, goCave, goJungle, fightDragon],
    text: 'Welcome to Dragon Repeller. You must defeat the dragon that is preventing people from leaving the town.' +
      ' You are in the town square. Where do you want to go? Use the buttons above.'
  },
  {
    name: locationNames.Store,
    image: "images/store1.jpeg",
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
    image: "images/cave2.jpeg",
    'button text': ['Fight slime', 'Fight goblin', 'Go to town square'],
    'button functions': [fightSlime, fightGoblin, goTown],
    text: 'You enter the cave. You see some monsters.'
  },
  {
    name: locationNames.Jungle,
    image: "images/jungle4.jpeg",
    'button text': ['Fight spirit', 'Fight fanged beast', 'Go to town square'],
    'button functions': [fightSpirit, fightFangedBeast, goTown],
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
    image: "images/easter1.jpeg",
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

  //image changing
  if ("image" in location) {
    scene.style.backgroundImage = "url(" + location.image + ")";
  }

  // going to monsters
  if (location.name === locationNames.Cave) {
    scene.style.backgroundImage = "url(" + location.image + ")";
    let killLocation = getLocation(locationNames.Kill)
    killLocation["button text"][0] = "Continue in Cave"
    killLocation["button text"][1] = "Head to Jungle"
  } else if (location.name === locationNames.Jungle) {
    scene.style.backgroundImage = "url(" + location.image + ")";
    let killLocation = getLocation(locationNames.Kill)
    killLocation["button text"][0] = "Head back to Cave"
    killLocation["button text"][1] = "Continue in Jungle"
  }

  easterEggButtons.style.display = "none"
  controls.style.display = "block"
  monsterStats.style.display = 'none'
  player.style.visibility = 'hidden'


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
  if (currentWeapon < weapons.length - 1) {
    button2.innerText = "Buy weapon (" + weapons[currentWeapon + 1].cost + " gold)"
  } else {
    button2.disabled = true
  }
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
  if (currentWeapon < weapons.length - 1) { // current weapon is before last
    let nextWeapon = weapons[currentWeapon + 1]
    if (gold >= nextWeapon.cost) {
      updateGold(gold - nextWeapon.cost)
      currentWeapon++
      updatePower(nextWeapon.power)
      text.innerText = 'You now have a ' + nextWeapon.name + '.'
      inventory.push(nextWeapon.name)
      text.innerText += ' In your inventory you have: a ' + inventory.join(', a ')

      if (currentWeapon === weapons.length - 1) { // buy last weapon
        text.innerText = 'You now have the most powerful weapon!'
        button2.disabled = true
      } else {
        button2.innerText = "Buy weapon (" + weapons[currentWeapon + 1].cost + " gold)"
      }

    } else {
      text.innerText = 'You do not have enough gold to buy a weapon. '
    }
  }
}






function fightSlime() {
  fighting = 0
  goFight()
}

function fightGoblin() {
  fighting = 1
  goFight()
}

function fightSpirit() {
  fighting = 2
  goFight()
}

function fightFangedBeast() {
  fighting = 3
  goFight()
}

function fightDragon() {
  fighting = 4
  scene.style.backgroundImage = "url(images/DragonArea1.jpeg)"
  goFight()
}




function goFight() {
  update(getLocation(locationNames.Fight))
  player.style.visibility = 'visible'
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
    let damageDealt = Math.floor(weapons[currentWeapon].power * (Math.random() * 0.4 + 0.8)) //base damage variance 0.8x to 1.2x

    //crit chance
    if (Math.random() < 0.1) {
      damageDealt = Math.floor(damageDealt * (Math.random() * 0.5 + 1.5)) //1.5x to 2x
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
  let hit = Math.floor(1.94 * level + 2) //base damage
  hit -= Math.floor(Math.random() * xp / 7) //adjust damage based on xp up to -xp/7
  hit = Math.floor(hit * (Math.random() * 0.6 + 0.7)) // random variance in damage 0.7x to 1.3x
  return hit <= 0 ? 1 : hit
}

function isMonsterHit() {
  return Math.random() > 0.1 || hp < 20
}

function dodge() {
  if (Math.random() > 0.1) {
    text.innerText = 'You dodged the attack from the ' + monsters[fighting].name + '.'
    if (Math.random() < 0.95) {
      updateHp(hp + 5) // 95% chance to gain 5 hp on a dodge
    }
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
    fighting === monsters.length - 1 ? winGame() : defeatMonster()
  }
}

function defeatMonster() {
  let monsterLevel = monsters[fighting].level
  let xpGained = Math.floor(monsterLevel * 1.5 - 2) // base xp 
  xpGained = Math.floor(xpGained * (Math.random() * 0.3 + 0.85)) // variance 0.85x to 1.15x
  xpGained = xpGained > 0 ? xpGained : 1
  let goldGained = Math.floor(0.5 * Math.pow(monsterLevel, 2) - 0 / 38 * monsterLevel + 11.07) // base gold 
  goldGained = Math.floor(goldGained * (Math.random() * 0.4 + 0.8)) // variance 0.8x to 1.2x


  getLocation(locationNames.Kill).text = "The monster screams \"Arg!\" As it dies. You gain " + xpGained + " XP and find " + goldGained + " gold."
  updateGold(gold + goldGained)
  updateXp(xp + xpGained)
  update(getLocation(locationNames.Kill))
  nextMonster = fighting === nextMonster ? nextMonster + 1 : nextMonster
  if (nextMonster < 2) {
    button2.disabled = true; // Can't go to jungle until cave is cleared out
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
  scene.style.backgroundImage = "url(" + getLocation(locationNames.EasterEgg).image + ")";
  text.innerText = getLocation(locationNames.EasterEgg).text
  let children = easterEggButtons.childNodes
  //console.log(children)
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
  text.innerText += numbers.join(`, `);


  // count the guesses and provide a reward
  let count = countNumbers(guess, numbers)
  if (count > 0) {
    let value = Math.floor(Math.random() * 20) * count + 10
    text.innerText += "\nCorrect! You win " + value + " gold!"
    updateGold(gold + value)
  } else {
    text.innerText += "\nWrong! You lose 10 health!"
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


