const grid = document.querySelector('.grid')
const resultsDisplay = document.querySelector('.results')
const levelDisplay = document.querySelector('.level')
let aliensRemoved = []
let goingRight=true
let currentShooterIndex = 202
let baseIndexList = [210,211,212,213,214,215,216,217,218,219,220,221,222,223,224]
let width = 15
let direction = 1
let invadersId
let results = 0
let gameSpeed = 500
let levelCount = 1
let level = `Level: ${levelCount}` 



for(let i = 0; i < 225; i++) {
    const square = document.createElement('div')
    console.dir(square)
    grid.appendChild(square)
}

const squares = Array.from(document.querySelectorAll('.grid div'))
const alienInvaders = [
    0,1,2,3,4,5,6,7,8,9,
    15,16,17,18,19,20,21,22,23,24,
    30,31,32,33,34,35,36,37,38,39
]
// const alienInvaders = [
//     0,1]

const origin = [
    0,1,2,3,4,5,6,7,8,9,
    15,16,17,18,19,20,21,22,23,24,
    30,31,32,33,34,35,36,37,38,39
]
    

function draw() {
    for(let i = 0; i< alienInvaders.length; i++) {
        if(!aliensRemoved.includes(i)){
            squares[alienInvaders[i]].classList.add('invader')
        }
        
    }
}

function remove() {
    for(let i = 0; i< alienInvaders.length; i++) {
        squares[alienInvaders[i]].classList.remove('invader')
    }
}


draw()


squares[currentShooterIndex].classList.add('shooter')

for(i=0;i<baseIndexList.length;i++){
squares[baseIndexList[i]].classList.add('base')}


function moveShooter(e) {
    squares[currentShooterIndex].classList.remove('shooter')
    switch(e.key) {
        case 'ArrowLeft': 
            if(currentShooterIndex % width !==0) currentShooterIndex -=1
            break;
        case 'ArrowRight':
            if(currentShooterIndex % width < width -1) currentShooterIndex +=1
            break;
    }
    squares[currentShooterIndex].classList.add('shooter')
}
document.addEventListener('keydown', moveShooter)

function alienStart() {
    for(i=0; i<alienInvaders.length; i++){
        alienInvaders[i] = origin[i]
    }
}

function moveInvaders(){
    const leftEdge = alienInvaders[0] % width === 0;
    const rightEdge =alienInvaders[alienInvaders.length-1] % width === width -1;
    remove()
    if(rightEdge && goingRight) {
        for(let i=0; i < alienInvaders.length; i++){
            alienInvaders[i] += width+1
            direction = -1
            goingRight = false
        }
    }
    if(leftEdge && !goingRight) {
        for(i=0; i<alienInvaders.length; i++) {
            alienInvaders[i] += width-1
            direction = 1
            goingRight = true
        }
    }

    for(let i=0; i<alienInvaders.length; i++) {
        alienInvaders[i] += direction
    }
    draw()

    if(squares[currentShooterIndex].classList.contains('invader','shooter')) {
        resultsDisplay.innerHTML = 'GAME OVER'
        clearInterval(invadersId)
        restartL()
        
    }

    for(i=0;i<baseIndexList.length;i++){
    if(squares[baseIndexList[i]].classList.contains('invader','base')) {
        resultsDisplay.innerHTML = 'GAME OVER'
        clearInterval(invadersId)
        restartL()}
        
    }

    // for(let i=0; i<alienInvaders.length; i++){
    //     if(alienInvaders[i]>squares.length){
            
    //         resultsDisplay.innerHTML = 'GAME OVER'
    //         clearInterval(invadersId)
    //         restartL()
    //     }
    // }

    if(aliensRemoved.length === alienInvaders.length){
        resultsDisplay.innerHTML = 'You Win PAPI'        
        clearInterval(invadersId)
        restartW()
 
    }
    
}

function restartW() {
    aliensRemoved = []
    gameSpeed -=50
    levelCount +=1
    alienStart()
    draw()
    invadersId = setInterval(moveInvaders, gameSpeed)
    levelDisplay.innerHTML = `level: ${levelCount}`
}

function restartL() {
    remove()
    aliensRemoved = []
    results = 0
    alienStart()
    draw()
    invadersId = setInterval(moveInvaders, gameSpeed)
}

invadersId = setInterval(moveInvaders, gameSpeed)

function shoot(e){
    let laserID
    let currentLaserIndex = currentShooterIndex
    function moveLaser(){
        squares[currentLaserIndex].classList.remove('laser')
        currentLaserIndex -= width
        squares[currentLaserIndex].classList.add('laser')
        
        if(squares[currentLaserIndex].classList.contains('invader')) {
            squares[currentLaserIndex].classList.remove('laser');
            squares[currentLaserIndex].classList.remove('invader');
            squares[currentLaserIndex].classList.add('boom');

            setTimeout(()=>squares[currentLaserIndex].classList.remove('boom'), 300)
            clearInterval(laserID)

            const alienRemoved = alienInvaders.indexOf(currentLaserIndex)
            aliensRemoved.push(alienRemoved)
            results++
            resultsDisplay.innerHTML = results

        }
    }
    
    switch(e.key) {
        case 'ArrowUp':
            laserID = setInterval(moveLaser, 100)
            break;
    }
}

document.addEventListener('keydown', shoot)
