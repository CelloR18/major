// =====================================
// MAJOR ELETRÔNICA
// SISTEMA DE ORDENS DE SERVIÇO
// =====================================

// LOGIN

const USUARIO = "admin"
const SENHA = "1234"

// BANCO LOCAL

let ordens =
JSON.parse(
localStorage.getItem("ordens")
) || []

// =====================================
// ELEMENTOS
// =====================================

const busca =
document.getElementById("busca")

const cpfInput =
document.getElementById("cpf")

// =====================================
// LOGIN
// =====================================

function fazerLogin(){

    let user =
    document.getElementById("loginUser").value

    let pass =
    document.getElementById("loginPass").value

    let erro =
    document.getElementById("loginErro")

    if(
        user === USUARIO &&
        pass === SENHA
    ){

        localStorage.setItem(
            "logado",
            "sim"
        )

        document.body.classList.add(
            "logado"
        )

    }else{

        erro.innerText =
        "Usuário ou senha inválidos"

    }

}

function verificarLogin(){

    let logado =
    localStorage.getItem("logado")

    if(logado === "sim"){

        document.body.classList.add(
            "logado"
        )

    }

}

function logout(){

    localStorage.removeItem(
        "logado"
    )

    location.reload()

}

// =====================================
// OS AUTOMÁTICA
// =====================================

function gerarOS(){

    let ultimo =

    parseInt(
        localStorage.getItem(
            "ultimoOS"
        ) || 0
    )

    ultimo++

    localStorage.setItem(
        "ultimoOS",
        ultimo
    )

    return String(ultimo)
    .padStart(6,"0")

}

// =====================================
// CPF
// =====================================

cpfInput.addEventListener(
"input",
e => {

    let v =
    e.target.value.replace(
        /\D/g,
        ''
    )

    v = v.replace(
        /(\d{3})(\d)/,
        '$1.$2'
    )

    v = v.replace(
        /(\d{3})(\d)/,
        '$1.$2'
    )

    v = v.replace(
        /(\d{3})(\d{1,2})$/,
        '$1-$2'
    )

    e.target.value = v

})

// =====================================
// NOVA ORDEM
// =====================================

function salvar(){

    let cliente =
    document.getElementById(
        "cliente"
    ).value.trim()

    if(!cliente){

        alert(
        "Digite o nome do cliente"
        )

        return

    }

    let ordem = {

        id: Date.now(),

        numeroOS:
        gerarOS(),

        tipoEntrada:
        document.getElementById(
            "tipoEntrada"
        ).value,

        cliente:
        

        cliente,

        telefone:

        document.getElementById(
            "telefone"
        ).value,

        cpf:

        document.getElementById(
            "cpf"
        ).value,

        email:

        document.getElementById(
            "email"
        ).value,

        marca:

        document.getElementById(
            "marca"
        ).value,

        modelo:

        document.getElementById(
            "modelo"
        ).value,

        defeito:

        document.getElementById(
            "defeito"
        ).value,

    

        tecnico:
document.getElementById("tecnico").value,

        observacoes:

        document.getElementById(
            "observacoes"
        ).value,

        servicoRealizado: "",

        valor: "",

        status:

        document.getElementById(
            "tipoEntrada"
        ).value === "orcamento"

        ?

        "Orçamento"

        :

        "Em Reparo",

        entrada:

        new Date()
        .toLocaleString(
            "pt-BR"
        ),

        entrega: "",

        garantia: "",
        arquivado: false,
    }

    ordens.push(ordem)

    salvarLocal()

    limparCampos()

    atualizar()

    alert(
        "OS cadastrada com sucesso!"
    )

}

// =====================================
// LIMPAR CAMPOS
// =====================================

function limparCampos(){
    document.getElementById(
        "tecnico"
    ).value = ""
    document.getElementById(
        "cliente"
    ).value = ""

    document.getElementById(
        "telefone"
    ).value = ""

    document.getElementById(
        "cpf"
    ).value = ""

    document.getElementById(
        "email"
    ).value = ""

    document.getElementById(
        "marca"
    ).value = ""

    document.getElementById(
        "modelo"
    ).value = ""

    document.getElementById(
        "defeito"
    ).value = ""

    document.getElementById(
        "observacoes"
    ).value = ""

}

// =====================================
// LOCAL STORAGE
// =====================================

function salvarLocal(){

    localStorage.setItem(

        "ordens",

        JSON.stringify(
            ordens
        )

    )

}

// =====================================
// BUSCA
// =====================================

function filtrar(){

    let termo =

    busca.value
    .toLowerCase()
    .trim()

    if(!termo){

        atualizar()

        return

    }

    let resultado =

    ordens.filter(o =>

        o.numeroOS
        .toLowerCase()
        .includes(termo)

        ||

        o.cliente
        .toLowerCase()
        .includes(termo)

        ||

        o.telefone
        .toLowerCase()
        .includes(termo)

        ||

        o.cpf
        .toLowerCase()
        .includes(termo)

        ||

        o.modelo
        .toLowerCase()
        .includes(termo)

    )

    render(resultado)

}

busca.addEventListener(
    "input",
    filtrar
)

// =====================================
// ESTATÍSTICAS
// =====================================

function atualizarStats(){

    document.getElementById(
        "totalOrdens"
    ).innerText =
    ordens.length

    document.getElementById(
        "totalOrcamentos"
    ).innerText =

    ordens.filter(o =>
        o.status === "Orçamento"
    ).length

    document.getElementById(
        "totalReparos"
    ).innerText =

    ordens.filter(o =>
        o.status === "Em Reparo"
    ).length

    document.getElementById(
        "totalProntos"
    ).innerText =

    ordens.filter(o =>
        o.status === "Pronto"
    ).length

    document.getElementById(
        "totalEntregues"
    ).innerText =

    ordens.filter(o =>
        o.status === "Entregue"
    ).length

}

// =====================================
// INICIALIZAÇÃO
// =====================================

verificarLogin()
atualizarStats()
// =====================================
// ATUALIZAR TELA
// =====================================

function atualizar(){

    salvarLocal()

    atualizarStats()

    render(ordens)

}

// =====================================
// RENDER
// =====================================

function render(lista){

    let htmlOrcamentos = ""
    let htmlReparos = ""
    let htmlProntos = ""
    let htmlEntregues = ""
    let htmlHistorico = ""

    lista.forEach(o => {

        let statusClass = ""

        switch(o.status){

            case "Orçamento":
                statusClass = "status-orcamento"
                break

            case "Em Reparo":
                statusClass = "status-reparo"
                break

            case "Pronto":
                statusClass = "status-pronto"
                break

            case "Entregue":
                statusClass = "status-entregue"
                break

        }

        let botoes = ""

        // ORÇAMENTO

        if(o.status === "Orçamento"){

            botoes += `

            <button
            class="warning"
            onclick="aprovarOrcamento(${o.id})">

            Aprovar Orçamento

            </button>

            `
        }

        // EM REPARO

        if(o.status === "Em Reparo"){

            botoes += `

            <button
            class="blue"
            onclick="mudarStatus(${o.id}, 'Pronto')">

            Marcar como Pronto

            </button>

            `
        }

        // PRONTO

        if(o.status === "Pronto"){

            botoes += `

            <button
            class="green"
            onclick="mudarStatus(${o.id}, 'Entregue')">

            Entregar

            </button>

            `
        }

        botoes += `

        <button
        class="blue"
        onclick="pdf(${o.id})">

        PDF

        </button>

        ${
    o.status === "Entregue"
    ?

    `<button
    class="danger"
    onclick="arquivar(${o.id})">

    Arquivar

    </button>`

    :

    `<button
    class="danger"
    onclick="excluir(${o.id})">

    Excluir

    </button>`
}

        `

        let card = `

<div class="card">

    <div class="os">

        OS #${o.numeroOS}

    </div>

    <div class="top">

        <b>${o.cliente}</b>

        <span class="status ${statusClass}">

            ${o.status}

        </span>

    </div>

    <div class="info">

        ${
            o.status === "Orçamento" ||
            o.status === "Pronto" ||
            o.status === "Entregue"
            ?
            `
            👨‍🔧 <strong>Recebido Por:</strong> ${o.tecnico || o.Técnico || "-"}
            <br>
            `
            :
            ""
        }

        📞 ${o.telefone || "-"}

        <br>

        🪪 ${o.cpf || "-"}

        <br>

        📺 ${o.marca || "-"} - ${o.modelo || "-"}

        <br>

        🛠 ${o.defeito || "-"}

        <br>

        💰 ${
            o.valor
            ?
            "R$ " + o.valor
            :
            "Não informado"
        }

        <br>

        📅 Entrada: ${o.entrada}

    </div>

    <div class="actions">

        ${botoes}

    </div>

</div>

`

        // ORGANIZAÇÃO

        if(o.status === "Orçamento"){

            htmlOrcamentos += card

        }

        if(o.status === "Em Reparo"){

            htmlReparos += card

        }

        if(o.status === "Pronto"){

            htmlProntos += card

        }

        if(
    o.status === "Entregue" &&
    !o.arquivado
){

    htmlEntregues += card

}
        

        let cardHistorico = card

htmlHistorico += cardHistorico

    })

    document.getElementById(
        "orcamentos"
    ).innerHTML =
    htmlOrcamentos

    document.getElementById(
        "reparos"
    ).innerHTML =
    htmlReparos

    document.getElementById(
        "prontos"
    ).innerHTML =
    htmlProntos

    document.getElementById(
        "entregues"
    ).innerHTML =
    htmlEntregues

    document.getElementById(
        "historico"
    ).innerHTML =
    htmlHistorico

}

// =====================================
// APROVAR ORÇAMENTO
// =====================================

function aprovarOrcamento(id){

    let ordem =

    ordens.find(
        x => x.id === id
    )

    if(!ordem) return

    let valor = prompt(
        "Digite o valor aprovado:"
    )

    if(valor === null)
    return

    let servico = prompt(
        "Serviço realizado:"
    )

    if(servico === null)
    return

    ordem.valor = valor

    ordem.servicoRealizado =
    servico

    ordem.status =
    "Em Reparo"

    atualizar()

}

// =====================================
// ALTERAR STATUS
// =====================================

function mudarStatus(
    id,
    novoStatus
){

    let ordem =

    ordens.find(
        x => x.id === id
    )

    if(!ordem) return

    ordem.status =
    novoStatus

    atualizar()
if(novoStatus === "Entregue"){

    let dataEntrega = prompt(
        "Data da entrega (dd/mm/aaaa):",
        new Date().toLocaleDateString("pt-BR")
    )

    ordem.entrega = dataEntrega

    let garantia = new Date()

    garantia.setDate(
        garantia.getDate() + 90
    )

    ordem.garantia =
    garantia.toLocaleDateString("pt-BR")

}
}

// =====================================
// EXCLUIR ORDEM
// =====================================

function excluir(id){

    let confirmar =
    confirm(

    "Deseja excluir esta OS?"

    )

    if(!confirmar)
    return

    ordens =

    ordens.filter(
        x => x.id !== id
    )

    atualizar()

}

// =====================================
// PRIMEIRA RENDERIZAÇÃO
// =====================================

render(ordens)
// =====================================
// GARANTIA 90 DIAS
// =====================================

function gerarGarantia90Dias(){

    let data = new Date()

    data.setDate(
        data.getDate() + 90
    )

    return data.toLocaleDateString(
        "pt-BR"
    )

}

// =====================================
// SOBRESCREVE MUDAR STATUS
// COM GARANTIA AUTOMÁTICA
// =====================================



// =====================================
// PDF PROFISSIONAL
// =====================================

function pdf(id){

    let o =

    ordens.find(
        x => x.id === id
    )

    if(!o) return

    let w =
    window.open(
        "",
        "",
        "width=900,height=800"
    )

    w.document.write(`

    <html>

    <head>

    <meta charset="UTF-8">

    <title>
    Ordem de Serviço
    </title>

    <style>

    *{
        box-sizing:border-box;
    }

    body{

        margin:0;

        background:#f1f5f9;

        font-family:
        Arial,sans-serif;

        padding:40px;

    }

    .container{

        max-width:850px;

        margin:auto;

        background:white;

        border-radius:20px;

        overflow:hidden;

        box-shadow:
        0 10px 30px rgba(0,0,0,.15);

    }

    .header{

        background:#0f172a;

        color:white;

        padding:30px;

    }

    .header h1{

        margin:0;

    }

    .header p{

        margin-top:6px;

        opacity:.8;

    }

    .content{

        padding:30px;

    }

    .os{

        display:inline-block;

        padding:8px 14px;

        border-radius:999px;

        background:#dbeafe;

        color:#2563eb;

        font-weight:bold;

        margin-bottom:20px;

    }

    .item{

        display:flex;

        justify-content:space-between;

        gap:20px;

        padding:14px 0;

        border-bottom:
        1px solid #e2e8f0;

    }

    .titulo{

        color:#64748b;

    }

    .bloco{

        margin-top:20px;

        background:#f8fafc;

        padding:20px;

        border-radius:14px;

    }

    .garantia{

        margin-top:20px;

        background:#ecfdf5;

        border:
        1px solid #86efac;

        padding:20px;

        border-radius:14px;

    }

    .print{

        display:block;

        margin:30px auto;

        padding:15px 25px;

        border:none;

        border-radius:12px;

        background:#22c55e;

        color:white;

        font-weight:bold;

        cursor:pointer;

    }

    @media print{

        .print{
            display:none;
        }

    }

    </style>

    </head>

    <body>

    <div class="container">

        <div class="header">

            <h1>
            ELETRÔNICA MAJOR
            
            </h1>
            <br/>
            <p>
            TEL: (21) 98070-3495
            CNPJ: 45.601.712/0001-02
            </p>

        </div>

        <div class="content">

            <div class="os">

                OS #${o.numeroOS}

            </div>

            <div class="item">

                <span class="titulo">
                Cliente
                </span>

                <strong>
                ${o.cliente}
                </strong>

            </div>

            <div class="item">

                <span class="titulo">
                Telefone
                </span>

                <strong>
                ${o.telefone || "-"}
                </strong>

            </div>

            <div class="item">

                <span class="titulo">
                CPF
                </span>

                <strong>
                ${o.cpf || "-"}
                </strong>

            </div>

            <div class="item">

                <span class="titulo">
                Equipamento
                </span>

                <strong>

                ${o.marca}
                -
                ${o.modelo}

                </strong>

            </div>

            <div class="item">

                <span class="titulo">
                Valor
                </span>

                <strong>

                ${
                    o.valor
                    ?
                    "R$ " + o.valor
                    :
                    "-"
                }

                </strong>

            </div>

            <div class="item">

                <span class="titulo">
                Entrada
                </span>

                <strong>

                ${o.entrada}

                </strong>

            </div>

            ${
                o.entrega
                ?

                `
                <div class="item">

                <span class="titulo">
                Entrega
                </span>

                <strong>

                ${o.entrega}

                </strong>

                </div>
                `

                :

                ""
            }

            <div class="bloco">

                <b>
                Defeito Informado
                </b>

                <br><br>

                ${o.defeito || "-"}

            </div>

            <div class="bloco">

                <b>
                Serviço Realizado
                </b>

                <br><br>

                ${o.servicoRealizado || "-"}

            </div>

            ${
                o.garantia

                ?

                `

                <div class="garantia">

                <h3>

                Garantia de Serviço

                </h3>

                <br>

                Garantia válida até:

                <strong>

                ${o.garantia}

                </strong>

                <br><br>

                ATENÇÃO! De acordo com a Cláusula e de Artigo do Direito e Códigos Penais, Garantia de 90 Dias. Artigo 1275 e 1278, nos Serviços Executados e também objetos não procurados no Prazo de 90 dias serão vendidos para a reposição de peças mais mão de Obra Dentro dos Direitos. CNPJ: 45.601.712//0001-02.

                </div>

                `

                :

                ""

            }

        </div>

    </div>

    <button
    class="print"
    onclick="window.print()">

    Salvar como PDF

    </button>

    </body>

    </html>

    `)

    w.document.close()

}

// =====================================
// BACKUP JSON
// =====================================

function exportarBackup(){

    let dados =

    "data:text/json;charset=utf-8," +

    encodeURIComponent(

        JSON.stringify(
            ordens,
            null,
            2
        )

    )

    let a =
    document.createElement("a")

    a.href = dados

    a.download =

    "backup-major-eletronica.json"

    a.click()

}

// =====================================
// PWA
// =====================================

if(
    "serviceWorker"
    in navigator
){

    navigator
    .serviceWorker
    .register(
        "service-worker.js"
    )

}

// =====================================
// INICIALIZAÇÃO FINAL
// =====================================

verificarLogin()

atualizar()

console.log(
"Eletrônica Major carregado com sucesso."
)
function arquivar(id){

    let ordem =
    ordens.find(x => x.id === id)

    if(!ordem) return

    ordem.arquivado = true

    atualizar()

}
let historicoVisivel = true

function toggleHistorico(){

    historicoVisivel =
    !historicoVisivel

    document.getElementById(
        "historico"
    ).style.display =

    historicoVisivel
    ? "block"
    : "none"

}
