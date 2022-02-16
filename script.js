//---------------CONSTANTES--------------------

//essa constante representa cada tipo de mensagem exibida ao usuário ao submeter um valor
const statusMessage = {
    error: 'Erro',
    smaller: 'É menor',
    larger: 'É maior',
    win: 'Você acertou!!!!'
}


//essa constante mapeia quais leds precisam ser acesos para representar cada número
const ledMap = {
    0: [1, 2, 3, 5, 6, 7],
    1: [1, 7],
    2: [1, 2, 4, 5, 6, 8],
    3: [1, 2, 4, 6, 7, 8],
    4: [1, 3, 4, 7, 8],
    5: [2, 3, 4, 6, 7, 8],
    6: [2, 3, 4, 5, 6, 7, 8],
    7: [1, 2, 7],
    8: [1, 2, 3, 4, 5, 6, 7, 8],
    9: [1, 2, 3, 4, 6, 7, 8]
}


//---------------------VARIAVEIS--------------------------

//variável que armazena o número sorteado pela API, ou código de erro caso a requisição falhe
let number = 0

//variável que armazena o último palpite do usuário
let userLastGuess

//----------------------FUNÇÕES DE CRIAÇÃO E GERENCIAMENTO DE TAGS----------------

//cria uma tag
const createTag = (tag) => {
    return document.createElement(tag)
}

//retorna uma tag efetuando a busca pelo ID
const getComponentByID = (id) => {
    return document.getElementById(id)
}

//retorna um array de tags filtrando pela className
const getComponentByClassName = (className) => {
    return document.getElementsByClassName(className)
}

//atribui como filho uma tag a outra
const appendElement = (target, element) => {
    target.appendChild(element)
}

//seta um ID a uma tag
const setID = (id, element) => {
    element.id = id
}

//adiciona uma classe a uma tag 
const addClass = (className, element) => {
    element.classList.add(className)
}

//remove uma classe de uma tag
const removeClass = (className, element) => {
    element.classList.remove(className)
}

//substitui uma classe vinculada a uma tag por outra
const changeClass = (oldClass, newClass, element) => {
    addClass(newClass, element)
    removeClass(oldClass, element)
}

//atribui texto a uma tag
const writeText = (element, text) => {
    element.innerHTML = text
}

//seta um atributo a uma tag , caso não seja passado valor é automáticamente atribuido como true
const setAttribute = (element, name, value) => {
    element.setAttribute(name, value)
}

//remove um atributo de uma tag
const removeAttribute = (element, name) => {
    element.removeAttribute(name)
}


//----------------------------GERENCIAMENTO DOS LEDS-------------------------------------------

//display: é um conjunto de leds que formam uma numeração de um único algarismo( 0-9 )

//cria um display configurado com seus 7 segmentos
const createDisplay = (displayNumber) => {

    const display = createTag('div')

    addClass(`display-no-${displayNumber}`, display)
    addClass(`display-container`, display)
    setID(`display-${displayNumber}`, display)

    for (let i = 1; i <= 8; i++) {
        const Segment = createTag('div')

        if (i % 2 === 0) {
            addClass('segment-x', Segment)
        } else {
            addClass('segment-y', Segment)
        }

        addClass('segment', Segment)
        addClass(`segment-${i}`, Segment)
        appendElement(display, Segment)

    }
    return display
}

//define quais displays devem ser exibídos de acordo com a numeração recebida
const ManageLed = (number, status) => {
    const string = number.toString()

    changeClass('visible', 'hidden', getComponentByID('display-1'))
    changeClass('visible', 'hidden', getComponentByID('display-2'))
    changeClass('visible', 'hidden', getComponentByID('display-3'))

    for (let i = 0; i < string.length; i++) {
        resetLed(i + 1)
        showNumberOnLed(parseInt(string[i]), i + 1, status)
        changeClass('hidden', 'visible', getComponentByID(`display-${i + 1}`))
    }

}

//apaga todos os leds e volta ao padrão de cores
const resetLed = (displayNumber) => {
    for (let i = 1; i <= 8; i++) {
        const segment = getComponentByClassName(`segment-${i}`)[displayNumber - 1]
        removeClass(`winnerColor-${i}`, segment)
        removeClass(`errorColor-${i}`, segment)
        segment.style.opacity = 0.1
    }
}

//acende os leds de cada display para representar uma numeração, podendo alterar as cores de acordo com o status
const showNumberOnLed = (number, displayNumber, status) => {
    ledMap[number].forEach((n) => {
        const segment = getComponentByClassName(`segment-${n}`)[displayNumber - 1]
        segment.style.opacity = 1

        if (status === 'winner') addClass(`winnerColor-${n}`, segment)
        if (status === 'error') addClass(`errorColor-${n}`, segment)
        if (!status) {
            removeClass(`winner-${n}`, segment)
            removeClass(`error-${n}`, segment)
        }
    })

}
//-------------------------CRIAÇÃO DE LAYOUT---------------------------------

//cria layout do html por manipulação do DOM
const createPageLayout = () => {

    const Body = getComponentByID('Body')

    const Container = createTag('div')
    setID('container', Container)
    appendElement(Body, Container)
    const Header = createTag('header')
    setID('header', Header)
    appendElement(Container, Header)

    const Title = createTag('h1')
    writeText(Title, 'QUAL É O NÚMERO?')
    appendElement(Header, Title)

    const Underline = createTag('div')
    addClass('underline', Underline)
    appendElement(Header, Underline)

    const Content = createTag('div')
    setID('content', Content)
    appendElement(Container, Content)

    const statusMessage = createTag('span')
    setID('statusMessage', statusMessage)
    appendElement(Content, statusMessage)

    const NumberContent = createTag('div')
    setID('NumberContent', NumberContent)
    appendElement(Content, NumberContent)

    for (let i = 1; i <= 3; i++) {

        const display = createDisplay(i)
        appendElement(NumberContent, display)
        resetLed(i)
        showNumberOnLed(0, i)

    }

    changeClass('visible', 'hidden', getComponentByID('display-2'))
    changeClass('visible', 'hidden', getComponentByID('display-3'))

    const ButtonReset = createTag('button')
    setID('ButtonReset', ButtonReset)
    addClass('hidden', ButtonReset)
    setAttribute(ButtonReset, 'onClick', 'ResetGame()')
    appendElement(Content, ButtonReset)

    const RefreshIcon = createTag('img')
    setAttribute(RefreshIcon, 'src', './assets/refresh-icon.svg')
    appendElement(ButtonReset, RefreshIcon)

    const ButtonText = createTag('span')
    addClass('button-new-run', ButtonText)
    writeText(ButtonText, 'NOVA PARTIDA')
    appendElement(ButtonReset, ButtonText)

    const Footer = createTag('footer')
    appendElement(Container, Footer)

    const Input = createTag('input')
    setID('userInput', Input)
    setAttribute(Input, 'type', 'text')
    setAttribute(Input, 'placeholder', 'Digite o palpite')
    setAttribute(Input, 'oninput', 'validateInput()')
    appendElement(Footer, Input)

    const ButtonSend = createTag('button')
    setID('buttonSend', ButtonSend)
    writeText(ButtonSend, 'ENVIAR')
    setAttribute(ButtonSend, 'disabled')
    setAttribute(ButtonSend, 'onClick', 'handleClick()')
    appendElement(Footer, ButtonSend)
}

//----------------------------------MECÂNICAS DO GAME----------------------------------

// requisição feita a API , em caso de sucesso um número é retornado, caso contrário é armazenado o código do erro 
// da requisição
const getRandomNumber = async () => {
    const response = await fetch('https://us-central1-ss-devops.cloudfunctions.net/rand?min=1&max=300')

    if (!response.ok) {

        number = response.status
        ManageLed(number, 'error')
        writeText(getComponentByID('statusMessage'), statusMessage.error)
        changeClass('hidden', 'visible', getComponentByID('ButtonReset'))

        return
    }

    let json = await response.json()

    number = json.value




    //esse console.log() foi deixado de propósito para facilitar encontrar o número sorteado pela API
    console.log('Número sorteado:', number)
}

//verifica se o palpite do usuário esta correto, caso não indica se o número é maior ou menor
const victoryCondition = () => {
    if (number === userLastGuess) {
        const StatusMessage = getComponentByID('statusMessage')
        writeText(StatusMessage, statusMessage.win)
        addClass('winnerColor', StatusMessage)
        changeClass('hidden', 'visible', getComponentByID('ButtonReset'))
        return 'winner'
    }
    if (number > userLastGuess) {
        writeText(getComponentByID('statusMessage'), statusMessage.larger)
    }
    if (number < userLastGuess) {
        writeText(getComponentByID('statusMessage'), statusMessage.smaller)
    }
}

//após um erro ou o usuário vencer é chamado essa função quando clicado no botão 'NOVA PARTIDA' a fim de reiniciar o 
// game, sendo sorteado um novo número
const ResetGame = () => {
    getRandomNumber()
    const StatusMessage = getComponentByID('statusMessage')
    writeText(StatusMessage, '')
    removeClass('winnerColor', StatusMessage)
    removeClass('errorColor', StatusMessage)

    ManageLed('0')
    changeClass('visible', 'hidden', getComponentByID('ButtonReset'))
}

//valida se o valor que o usuário colocou é um número entre 1 e 
const validateInput = () => {

    if (/^[0-9]{1,3}$/.test(getComponentByID('userInput').value)) {
        removeAttribute(getComponentByID('buttonSend'), 'disabled')
        return
    }


    setAttribute(getComponentByID('buttonSend'), 'disabled')

}

//função iniciada ao submeter um palpite pelo usuário
const handleClick = () => {

    const numberReceived = parseInt(getComponentByID('userInput').value)

    userLastGuess = numberReceived
    getComponentByID('userInput').value = ''
    const status = victoryCondition()
    ManageLed(numberReceived, status)
    setAttribute(getComponentByID('buttonSend'), 'disabled')
}

//função de inicio do game
const StartGame = async () => {
    createPageLayout()
    await getRandomNumber()

}

StartGame()