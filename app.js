let ordens = JSON.parse(localStorage.getItem("ordens")) || []

const fluxo = [
    "Recebido",
    "Em análise",
    "Em reparo",
    "Pronto",
    "Entregue"
]

const busca = document.getElementById("busca")
const cpfInput = document.getElementById("cpf")

busca.addEventListener("input", filtrar)

cpfInput.addEventListener("input", e => {

    let v = e.target.value.replace(/\D/g, '')

    v = v.replace(/(\d{3})(\d)/, '$1.$2')
    v = v.replace(/(\d{3})(\d)/, '$1.$2')
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2')

    e.target.value = v
})

function salvar(){

    if(!cliente.value){
        alert("Digite o nome do cliente")
        return
    }

    let o = {

        id: Date.now(),

        cliente: cliente.value,

        telefone: telefone.value,

        cpf: cpf.value,

        marca: marca.value,

        modelo: modelo.value,

        defeito: defeito.value,

        valor: valor.value,

        status: "Recebido",

        entrada: new Date().toLocaleDateString(),

        saida: ""

    }

    ordens.push(o)

    limparCampos()

    atualizar()

}

function limparCampos(){

    cliente.value = ""
    telefone.value = ""
    cpf.value = ""
    marca.value = ""
    modelo.value = ""
    defeito.value = ""
    valor.value = ""

}

function filtrar(){

    let termo = busca.value.toLowerCase()

    let filtrados = ordens.filter(o =>

        o.cliente.toLowerCase().includes(termo) ||

        o.telefone.toLowerCase().includes(termo) ||

        o.cpf.toLowerCase().includes(termo) ||

        o.modelo.toLowerCase().includes(termo)

    )

    render(filtrados)

}

function atualizar(){

    localStorage.setItem("ordens", JSON.stringify(ordens))

    render(ordens)

    atualizarStats()

}

function atualizarStats(){

    document.getElementById("totalOrdens").innerText =
    ordens.length

    document.getElementById("totalAndamento").innerText =
    ordens.filter(o => o.status !== "Entregue").length

    document.getElementById("totalFinalizados").innerText =
    ordens.filter(o => o.status === "Entregue").length

}

function render(listaDados){

    let htmlLista = ""
    let htmlHist = ""

    listaDados.forEach(o => {

        let cor = "#22c55e"

        if(o.status === "Em análise") cor = "#eab308"

        if(o.status === "Em reparo") cor = "#f97316"

        if(o.status === "Pronto") cor = "#3b82f6"

        if(o.status === "Entregue") cor = "#10b981"

        let botoes = `
            <button class="orange"
            onclick="mudarStatus(${o.id}, 'Em reparo')">
            Em reparo
            </button>

            <button class="blue"
            onclick="mudarStatus(${o.id}, 'Pronto')">
            Pronto
            </button>

            <button class="green"
            onclick="mudarStatus(${o.id}, 'Entregue')">
            Entregue
            </button>
        `

        let card = `

        <div class="card">

            <div class="top">

                <b>${o.cliente}</b>

                <span class="status"
                style="background:${cor}20;color:${cor}">
                ${o.status}
                </span>

            </div>

            <div class="info">

                📞 ${o.telefone}<br>

                🪪 ${o.cpf}<br>

                📺 ${o.marca} - ${o.modelo}<br>

                🛠 ${o.defeito}<br>

                💰 R$ ${o.valor}<br>

                📅 Entrada: ${o.entrada}

            </div>

            <div class="actions">

                ${botoes}

                <button class="blue"
                onclick="pdf(${o.id})">

                📄 PDF

                </button>

            </div>

        </div>
        `

        if(o.status === "Entregue"){

            htmlHist += card

        }else{

            htmlLista += card

        }

    })

    document.getElementById("lista").innerHTML = htmlLista

    document.getElementById("historico").innerHTML = htmlHist

}

function mudarStatus(id, novo){

    let o = ordens.find(x => x.id === id)

    o.status = novo

    if(novo === "Entregue"){

        o.saida = new Date().toLocaleDateString()

    }

    atualizar()

}

function exportar(){

    let data =
    "data:text/json;charset=utf-8," +

    encodeURIComponent(JSON.stringify(ordens))

    let a = document.createElement("a")

    a.href = data

    a.download = "backup.json"

    a.click()

}

function pdf(id){

    let o = ordens.find(x => x.id === id)

    let w = window.open("", "", "width=800,height=700")

    w.document.write(`

    <html>

    <head>

    <meta charset="UTF-8">

    <title>Comprovante</title>

    <style>

    body{
        margin:0;
        font-family:Arial;
        background:#e2e8f0;
        padding:30px;
    }

    .container{
        max-width:700px;
        margin:auto;
        background:white;
        border-radius:16px;
        overflow:hidden;
    }

    .header{
        background:#0f172a;
        color:white;
        padding:30px;
        text-align:center;
    }

    .content{
        padding:30px;
    }

    .item{
        display:flex;
        justify-content:space-between;
        padding:14px 0;
        border-bottom:1px solid #e2e8f0;
    }

    .highlight{
        margin-top:20px;
        background:#f8fafc;
        padding:20px;
        border-radius:10px;
    }

    .btn{
        display:block;
        margin:30px auto;
        padding:14px 20px;
        border:none;
        background:#22c55e;
        color:white;
        border-radius:10px;
        font-weight:bold;
        cursor:pointer;
    }

    @media print{
        .btn{
            display:none;
        }
    }

    </style>

    </head>

    <body>

    <div class="container">

        <div class="header">

            <h1>MAJOR ELETRÔNICA</h1>

            <p>Comprovante Digital</p>

        </div>

        <div class="content">

            <div class="item">
                <span>Cliente</span>
                <b>${o.cliente}</b>
            </div>

            <div class="item">
                <span>Telefone</span>
                <b>${o.telefone}</b>
            </div>

            <div class="item">
                <span>CPF</span>
                <b>${o.cpf}</b>
            </div>

            <div class="item">
                <span>Equipamento</span>
                <b>${o.marca} ${o.modelo}</b>
            </div>

            <div class="item">
                <span>Valor</span>
                <b>R$ ${o.valor}</b>
            </div>

            <div class="item">
                <span>Entrada</span>
                <b>${o.entrada}</b>
            </div>

            <div class="highlight">

                <b>Defeito relatado:</b>

                <br><br>

                ${o.defeito}

            </div>

        </div>

    </div>

    <button class="btn"
    onclick="window.print()">

    Salvar como PDF

    </button>

    </body>

    </html>

    `)

    w.document.close()

}

if('serviceWorker' in navigator){

    navigator.serviceWorker.register('service-worker.js')

}

atualizar()