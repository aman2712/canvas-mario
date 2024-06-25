const platformImgSrc = './img/platform.png'
const hillsImgSrc = './img/hills.png'
const bgSrc = './img/background.png'
const platformSmallTallSrc = './img/platformSmallTall.png'
const marioSrc = './img/mario.png'

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const gravity = 0.5

// player class
class Player{
    constructor() {
        this.position = {
            x: 100,
            y: 100
        }
        this.velocity = {
            x: 0,
            y: 0
        }
        this.width = 30
        this.height = 30
        this.speed = 5
    }

    draw(){
        // c.fillStyle = 'red'
        // c.fillRect(this.position.x, this.position.y, this.width, this.height)
        c.drawImage(mario, this.position.x, this.position.y, this.width, this.height)
    }

    update(){
        this.draw()
        this.position.y += this.velocity.y
        this.position.x += this.velocity.x

        if(this.position.y + this.height + this.velocity.y <= canvas.height){
            this.velocity.y += gravity
        }
    }
}

// platform class
class Platform {
    constructor({x, y, image}) {
        this.position = {x, y}

        this.image = image
        this.width = image.width
        this.height = image.height
    }

    draw(){
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

// scene setting class
class GenericObjects {
    constructor({x, y, image}) {
        this.position = {x, y}

        this.image = image
        this.width = image.width
        this.height = image.height
    }

    draw(){
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

function createImage(imgSrc){
    const image = new Image()
    image.src = imgSrc
    return image
}

// initalise player and platform
let player = new Player()
let platforms = []
let genericObjects = []

// track left and right movement
const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
}

let scrollOffset = 0

const platformImage = createImage(platformImgSrc)
const platformSmallTallImage = createImage(platformSmallTallSrc)
const mario = createImage(marioSrc)

function init(){
player = new Player()
platforms = [
    new Platform({
        x: platformImage.width * 4 + 300 - 5 + platformImage.width - platformSmallTallImage.width,
        y: 270,
        image: platformSmallTallImage
    }),
    new Platform({
        x: -1,
        y: 470,
        image: platformImage
    }),
    new Platform({
        x: platformImage.width - 5,
        y: 470,
        image: platformImage
    }),
    new Platform({
        x: platformImage.width * 2 + 100 - 5,
        y: 470,
        image: platformImage
    }),
    new Platform({
        x: platformImage.width * 3 + 300 - 5,
        y: 470,
        image: platformImage
    }),
    new Platform({
        x: platformImage.width * 4 + 300 - 5,
        y: 470,
        image: platformImage
    }),
    new Platform({
        x: platformImage.width * 5 + 700 - 5,
        y: 470,
        image: platformImage
    }),
    ]
genericObjects = [
    new GenericObjects({
        x: -1,
        y: -1,
        image: createImage(bgSrc)
    }),
    new GenericObjects({
        x: -1,
        y: -1,
        image: createImage(hillsImgSrc)
    }),
]
}

init()

// animate the screen
function animate() {
    requestAnimationFrame(animate)
    c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height)
    genericObjects.forEach(genericObject => {
        genericObject.draw()
    })
    platforms.forEach(platform => {
        platform.draw()
    })
    player.update()

    // move right upto a certain value then scroll screen horizontally
    if(keys.right.pressed && player.position.x < 400){
        player.velocity.x = player.speed
    }else if ((keys.left.pressed && player.position.x > 100) ||
                (keys.left.pressed && scrollOffset === 0 && player.position.x > 0)){
        player.velocity.x = -player.speed
    }else{
        player.velocity.x = 0

        if(keys.right.pressed){
            scrollOffset += player.speed
            platforms.forEach(platform => {
                platform.position.x -= player.speed
            })
            genericObjects.forEach(genericObject => {
                genericObject.position.x -= player.speed * 0.6
            })
        }else if(keys.left.pressed && scrollOffset > 0){
            scrollOffset -= player.speed
            platforms.forEach(platform => {
                platform.position.x += player.speed
            })
            genericObjects.forEach(genericObject => {
                genericObject.position.x += player.speed * 0.6
            })
        }
    }

    // platform colllision detection
    platforms.forEach(platform => {
        if(player.position.y + player.height <= platform.position.y &&
            player.position.y + player.height + player.velocity.y >= platform.position.y &&
            player.position.x + player.width >= platform.position.x &&
            player.position.x <= platform.position.x + platform.width)
        {
            player.velocity.y = 0
        }
    })

    // win condition
    if(scrollOffset > 5000){
        console.log('you win')
    }

    // lose condition
    if(player.position.y > canvas.height){
        init()
    }
}

animate()

// adding W-A-S-D controls
window.addEventListener('keydown', ({ key }) => {
    switch (key){
        case 'w':
            console.log('up');
            player.velocity.y -= 20
            break
        case 'a':
            console.log('left');
            keys.left.pressed = true
            break
        case 's':
            console.log('down');
            break
        case 'd':
            console.log('right');
            keys.right.pressed = true
            break
    }
})

window.addEventListener('keyup', ({ key }) => {
    switch (key){
        case 'w':
            console.log('up');
            player.velocity.y = 0
            break
        case 'a':
            console.log('left');
            keys.left.pressed = false
            break
        case 's':
            console.log('down');
            break
        case 'd':
            console.log('right');
            keys.right.pressed = false
            break
    }
})