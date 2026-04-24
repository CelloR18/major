let ordens = JSON.parse(localStorage.getItem("ordens")) || []

const fluxo = ["Recebido","Em análise","Em reparo","Pronto","Entregue"]

function salvar(){
    let o = {
        id: Date.now(),
        cliente: cliente.value,
        telefone: telefone.value,
        marca: marca.value,
        modelo: modelo.value,
        defeito: defeito.value,
        valor: valor.value,
        status: "Recebido",
        entrada: new Date().toLocaleDateString(),
        saida: ""
    }
    ordens.push(o)
    atualizar()
}

function avancar(id){
    let o = ordens.find(x=>x.id===id)
    let i = fluxo.indexOf(o.status)

    if(i < fluxo.length-1){
        o.status = fluxo[i+1]
        if(o.status==="Entregue"){
            o.saida = new Date().toLocaleDateString()
        }
    }
    atualizar()
}

function filtrar(){
    let termo = document.getElementById("busca").value.toLowerCase()

    let filtrados = ordens.filter(o =>
        o.cliente.toLowerCase().includes(termo)
    )

    render(filtrados)
}

function atualizar(){
    localStorage.setItem("ordens", JSON.stringify(ordens))
    render(ordens)
    
}

function render(listaDados){
    let htmlLista = ""
    let htmlHist = ""

    listaDados.forEach(o => {

        let cor = "#22c55e"
        if(o.status==="Em reparo") cor="#f97316"
        if(o.status==="Pronto") cor="#3b82f6"
        if(o.status==="Entregue") cor="#10b981"

        let botoes = `
        <button onclick="mudarStatus(${o.id}, 'Em reparo')">Em reparo</button>
        <button onclick="mudarStatus(${o.id}, 'Pronto')">Pronto</button>
        <button onclick="mudarStatus(${o.id}, 'Entregue')">Entregue</button>
        `

        let card = `
        <div class="card">
            <div class="top">
                <b>${o.cliente}</b>
                <span style="color:${cor}">${o.status}</span>
            </div>

            <div class="info">
                ${o.marca} - ${o.modelo}
            </div>

            <div class="actions">
                ${botoes}
                <button class="blue" onclick="pdf(${o.id})">📄 PDF</button>
            </div>
        </div>
        `

        if(o.status === "Entregue"){
            htmlHist += card
        } else {
            htmlLista += card
        }
    })

    document.getElementById("lista").innerHTML = htmlLista
    document.getElementById("historico").innerHTML = htmlHist
}



function exportar(){
    let data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(ordens))
    let a = document.createElement("a")
    a.href = data
    a.download = "backup.json"
    a.click()
}

if('serviceWorker' in navigator){
    navigator.serviceWorker.register('service-worker.js')
}

atualizar()
function pdf(id){
    let o = ordens.find(x => x.id === id)

    let w = window.open("", "", "width=800,height=700")

    w.document.write(`
    <html>
    <head>
    <meta charset="UTF-8">
    <title>Comprovante</title>

    <style>
        body {
            margin: 0;
            font-family: 'Segoe UI', sans-serif;
            background: #f1f5f9;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .container {
            width: 100%;
            max-width: 600px;
            background: white;
            margin: 20px;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }

        .header {
            background: #0f172a;
            color: white;
            padding: 20px;
            text-align: center;
        }

        .header h1 {
            margin: 0;
            font-size: 22px;
        }

        .sub {
            font-size: 13px;
            opacity: 0.8;
        }

        .content {
            padding: 20px;
        }

        .item {
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #e2e8f0;
            padding: 10px 0;
            font-size: 14px;
        }

        .item span:first-child {
            color: #64748b;
        }

        .highlight {
            margin-top: 15px;
            background: #f8fafc;
            padding: 15px;
            border-radius: 8px;
            font-size: 14px;
        }

        .footer {
            text-align: center;
            padding: 15px;
            font-size: 12px;
            color: #64748b;
        }

        .btn {
            display: block;
            margin: 20px auto;
            padding: 12px;
            background: #22c55e;
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: bold;
            cursor: pointer;
        }

        @media print {
            .btn { display: none; }
            body { background: white; }
        }
    </style>

    </head>

    <body>

    <div class="container">

        <div class="header">
            <h1>MAJOR ELETRÔNICA</h1>
            <div class="sub">Comprovante Digital de Serviço</div>
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
                <span>Equipamento</span>
                <b>${o.marca} ${o.modelo}</b>
            </div>

            <div class="item">
                <span>Data de Entrada</span>
                <b>${o.entrada}</b>
            </div>

            <div class="highlight">
                <b>Defeito relatado:</b><br>
                ${o.defeito}
            </div>

        </div>

        <div class="footer">
            Guarde este comprovante para retirada do equipamento<br>
            Major Eletrônica
        </div>

    </div>

    <button class="btn" onclick="window.print()">Salvar como PDF</button>

    </body>
    </html>
    `)

    w.document.close()
}
function mudarStatus(id, novo){
    let o = ordens.find(x => x.id === id)
    o.status = novo

    if(novo === "Entregue"){
        o.saida = new Date().toLocaleDateString()
    }

    atualizar()
}
