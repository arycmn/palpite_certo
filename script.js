//Constantes
const statusMessage = {
    erro: 'Erro',
    menor: 'É menor',
    maior: 'É maior',
    acertou: 'Você acertou!!!!'
}

const ledMap = {
    0: [1, 2, 3, 5, 6, 7],
    1: [1, 7],
    2: [1, 2, 4, 5, 6, 8],
    3: [1, 2, 4, 6, 7, 8],
    4: [1, 3, 4, 7, 8],
    5: [2, 3, 4, 6, 7, 8],
    6: [2, 3, 4, 5, 6, 7, 8],
    7: [1, 2, 7],
    8: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    9: [1, 2, 3, 4, 6, 7, 8]
}

//Variaveis
let number = 0
let userLastGuess

//funções de criação e gerenciamento de tags 

const createTag = (tag) => {
    return document.createElement(tag)
}

const getComponentByID = (id) => {
    return document.getElementById(id)
}

const getComponentByClassName = (className) => {
    return document.getElementsByClassName(className)
}

const appendElement = (target, element) => {
    target.appendChild(element)
}

const setID = (id, element) => {
    element.id = id
}

const addClass = (className, element) => {
    element.classList.add(className)
}

const removeClass = (className, element) => {
    element.classList.remove(className)
}

const changeClass = (oldClass, newClass, element) => {
    addClass(newClass, element)
    removeClass(oldClass, element)
}

const writeText = (element, text) => {
    element.innerHTML = text
}

const setAttribute = (element, name, value) => {
    element.setAttribute(name, value)
}

const removeDisplay = (displayNumber) => {
    const selectedDisplay = getComponentByID(`display-${displayNumber}`)
    const NumberContent = getComponentByID('NumberContent')
    NumberContent.remove(selectedDisplay)
}

const ResetGame = () => {
    getRandomNumber()
    writeText(getComponentByID('statusMessage'), '')
    changeClass('visible', 'hidden', getComponentByID('ButtonReset'))
}

const victoryCondition = () => {
    if (number === userLastGuess) {
        writeText(getComponentByID('statusMessage'), statusMessage.acertou)
        changeClass('hidden', 'visible', getComponentByID('ButtonReset'))
    }
    if (number > userLastGuess) {
        writeText(getComponentByID('statusMessage'), statusMessage.maior)
    }
    if (number < userLastGuess) {
        writeText(getComponentByID('statusMessage'), statusMessage.menor)
    }
}



const handleClick = () => {

    const numberReceived = parseInt(getComponentByID('userInput').value)

    if (typeof numberReceived === 'number' && numberReceived >= 0 && numberReceived < 1000) {
        userLastGuess = numberReceived
        getComponentByID('userInput').value = ''
        victoryCondition()
    }
}

const resetLed = (displayNumber) => {
    for (let i = 1; i <= 8; i++) {
        const segment = getComponentByClassName(`segment-${i}`)[displayNumber - 1]
        segment.style.opacity = 0.1
    }
}

const showNumberOnLed = (number, displayNumber) => {
    ledMap[number].forEach(i => {


        const segment = getComponentByClassName(`segment-${i}`)[displayNumber - 1]
        segment.style.opacity = 1
    })

}

const getRandomNumber = async () => {
    const response = await fetch('https://us-central1-ss-devops.cloudfunctions.net/rand?min=1&max=300')

    if (response.ok) {
        let json = await response.json()

        number = json.value
    } else {
        number = response.status
        writeText(getComponentByID('statusMessage'), statusMessage.erro)
        changeClass('hidden', 'visible', getComponentByID('ButtonReset'))
    }
}



const createPageLayout = () => {

    //atribui a uma variavel a tag Body
    const Body = getComponentByID('Body')

    const Container = createTag('div')
    setID('container', Container)
    appendElement(Body, Container)
    //cria uma tag Header e atribui como filho de Body
    const Header = createTag('header')
    appendElement(Container, Header)

    //cria uma tag Title, escreve seu conteúdo e atribui como filho do Body
    const Title = createTag('h1')
    writeText(Title, 'QUAL É O NÚMERO?')
    appendElement(Header, Title)

    const Content = createTag('div')
    setID('content', Content)
    appendElement(Container, Content)

    const statusMessage = createTag('span')
    setID('statusMessage', statusMessage)
    appendElement(Content, statusMessage)

    //cria uma tag NumberContent, seta um ID e atribui como filho do Body
    const NumberContent = createTag('div')
    setID('NumberContent', NumberContent)
    appendElement(Content, NumberContent)

    const ButtonReset = createTag('button')
    setID('ButtonReset', ButtonReset)
    addClass('hidden', ButtonReset)
    writeText(ButtonReset, 'NOVA PARTIDA')
    setAttribute(ButtonReset, 'onClick', 'ResetGame()')
    appendElement(Content, ButtonReset)

    //cria uma tag Footer e atribui como filho do Body
    const Footer = createTag('footer')
    appendElement(Container, Footer)



    //cria uma tag Input seta type como text, placeholder e atribui como filho do Body
    const Input = createTag('input')
    setID('userInput', Input)
    setAttribute(Input, 'type', 'text')
    setAttribute(Input, 'placeholder', 'Digite o palpite')
    appendElement(Footer, Input)


    const ButtonSend = createTag('button')
    writeText(ButtonSend, 'ENVIAR')
    setAttribute(ButtonSend, 'onClick', 'handleClick()')
    appendElement(Footer, ButtonSend)
}


const createDisplay = (displayNumber) => {
    //cria um display(numeral), adiciona classes e id de referência para alterações
    const display = createTag('div')
    addClass(`display-no-${displayNumber}`, display)
    addClass(`display-container`, display)
    setID(`display-${displayNumber}`, display)

    for (let i = 1; i <= 8; i++) {
        const Segment = createTag('div')
        //adiciona classe de horizontal(segment-x) caso par e vertical(segment-y) caso impar
        if (i % 2 === 0) {
            addClass('segment-x', Segment)
        } else {
            addClass('segment-y', Segment)
        }
        //adiciona classe vinculando o número do segmento
        addClass('segment', Segment)
        addClass(`segment-${i}`, Segment)
        //atribui Segmento como filho do Display
        appendElement(display, Segment)

    }
    return display
}

const StartGame = async () => {
    createPageLayout()
    await getRandomNumber()
    console.log(number)


    document.getElementById('NumberContent').appendChild(createDisplay(1))
    document.getElementById('NumberContent').appendChild(createDisplay(2))
    document.getElementById('NumberContent').appendChild(createDisplay(3))


    resetLed(1)
    showNumberOnLed(0, 1)

}

StartGame()





