let xp = 0
let hp = 100
let gold = 500
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
const monsterStats = document.querySelector('#monsterStats')
const monsterNameText = document.querySelector('#monsterName')
const monsterHealthText = document.querySelector('#monsterHealth')

const weapons = [
  {
    name: 'Stick',
    power: 5
  },
  {
    name: 'Dagger',
    power: 30
  },
  {
    name: 'Claw Hammer',
    power: 50
  },
  {
    name: 'Sword',
    power: 100
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
  }
]

// initialize buttons
button1.onclick = goStore
button2.onclick = goCave
button3.onclick = fightDragon

function update(location) {
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
    gold -= 10
    hp += 10
    goldText.innerText = gold
    hpText.innerText = hp
    text.innerText = 'You have bought extra 10 health.'
  } else {
    text.innerText = 'You do not have enough gold to buy health.'
  }
}

function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30
      currentWeapon++
      goldText.innerText = gold
      let newWeapon = weapons[currentWeapon].name
      text.innerText = 'You now have a ' + newWeapon + '.'
      inventory.push(newWeapon)
      text.innerText += ' In your inventory you have: ' + inventory
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
    gold += 15
    gold.innerText = gold
    let currentWeapon = inventory.shift()
    text.innerText = "You sold a " + currentWeapon + "."
    text.innerText += " In your inventory you have: " + inventory
  } else {
    text.innerText = "Don't sell your only weapon!"
  }
}

function fightSlime() { }

function fightFangedBeast() { }

function fightDragon() {
  console.log('Fighting Dragon.')
}
