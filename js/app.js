$(document).ready(function (){
    cardapio.eventos.init();
})

var cardapio = {};

var MEU_CARRINHO = [];
var MEU_ENDERECO = null;

var VALOR_CARRINHO = 0;
var VALOR_ENTREGA  = 7.3;

var CELULAR_EMPRESA = '5588988775820'

cardapio.eventos = {

    init: () =>{
        cardapio.metodos.obterItensCardapio();
        cardapio.metodos.carregarBotaoReserva();
        cardapio.metodos.carregarBotaoLigar();
        cardapio.metodos.botaoWhatsApp();

    }

}

cardapio.metodos = {

    //obtem a lista de iten do cardapio
    obterItensCardapio: (categoria = 'burgers', vermais = false) => {

        var filtro = MENU[categoria]
        console.log(filtro);

        if (!vermais) {
            $("#itensCardapio").html('');
            $("#btnVerMais").removeClass('hidden');
        }
        $.each(filtro, (i, e) => {
                   
            let temp = cardapio.templates.item.replace(/\${img}/g, e.img)
            .replace(/\${name}/g, e.name)
            .replace(/\${preco}/g, e.price.toFixed(2).replace('.',','))
            .replace(/\${id}/g, e.id)

            //botão ver mais foi clicado (12 itens)
            if (vermais && i >= 8 && i < 12){
                $("#itensCardapio").append(temp)
            }

            //paginação inicial (8itens)
            if (!vermais && i < 8) {
                $("#itensCardapio").append(temp)
            }

            

        })
        //remove o ativo
        $(".container-menu a").removeClass('active')
        //seta o menu para ativo
        $("#menu-" + categoria).addClass('active')
    },

    //clique no botão ver mais
    verMais: () => {
        var ativo = $(".container-menu a.active").attr('id').split('menu-')[1]; // o split faz uma quebra gerando um array [menu-][burgers]
        cardapio.metodos.obterItensCardapio(ativo, true);
        
        $("#btnVerMais").addClass('hidden');

    },

    //diminuir a quantidade do item no cardápio
    diminuirQuantidade: (id) => {

        let qntdAtual = parseInt($("#qntd-" + id).text());
        if (qntdAtual > 0) {
            $("#qntd-" + id).text(qntdAtual - 1)
        }
        
    },


    //aumentar a quantidade do item no cardápio
    aumentarQuantidade: (id) => {

        let qntdAtual = parseInt($("#qntd-" + id).text());
        $("#qntd-" + id).text(qntdAtual + 1)

    },

    //adicionar ao carrinho o item do cardápo
    adicionarAoCarrinho: (id) => {
        let qntdAtual = parseInt($("#qntd-" + id).text());
        if (qntdAtual > 0) {
            //obter a categoria ativa
            var categoria = $(".container-menu a.active").attr('id').split('menu-')[1];
            
            //obtem a lista de itens
            let filtro = MENU[categoria];

            //obtem o item
            let item = $.grep(filtro, (e, i) => {return e.id ==id});

            if (item.length > 0) {

                //validar se já existe esse item no carriho
                let existe = $.grep(MEU_CARRINHO, (elem, index) => {return elem.id == id});

                //caso já exista item no carrinho, só altera a quantidade
                if (existe.length > 0) {
                let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id));
                MEU_CARRINHO[objIndex].qntd = MEU_CARRINHO[objIndex].qntd + qntdAtual;
                }
                //caso ainda não exista o item no carrinho, adiciona ele
                else {
                item[0].qntd = qntdAtual;
                MEU_CARRINHO.push(item[0])
                }
                cardapio.metodos.mensagem('item adicionado ao carrinho', 'green')
                $("#qntd-" + id).text(0);

                cardapio.metodos.atualizarBadgeTotal();
            }
        }


    },

    //atualiza o badge de totais dos botões "Meu Carrinho"
    atualizarBadgeTotal: () => {

        var total = 0;

        $.each(MEU_CARRINHO, (i, e) => {
            total += e.qntd
        })

        if (total > 0) {
            $(".botao-carrinho").removeClass('hidden');
            $(".container-total-carrinho").removeClass('hidden');
        }
        else {
            $(".botao-carrinho").addClass('hidden');
            $(".container-total-carrinho").addClass('hidden');
        }

            $(".badge-total-carrinho").html(total);

    },

    //abrir a modal de carrinho
    abrirCarrinho: (abrir) => {
        if(abrir) {
            $("#modalCarrinho").removeClass('hidden');
            cardapio.metodos.carregarCarrinho(1);
        }
        else {
            $("#modalCarrinho").addClass('hidden');
        }
    },

    //
    carregarEtapa: (etapa) => {

        if (etapa == 1) {
            //exibição do header body e footer
            $("#lblTituloEtapa").text('Seu Carrinho:');
            $("#itensCarrinho").removeClass('hidden');
            $("#localEntrega").addClass('hidden'); 
            $("#resumoCarrinho").addClass('hidden');
            
            //icones  1, 2 e 3 canto superior
            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');

            //adicionar ou remover botões com classe hidden - quem aparece na tela.
            $("#btnEtapaPedido").removeClass('hidden');
            $("#btnEtapaEndereco").addClass('hidden');
            $("#btnEtapaResumo").addClass('hidden');
            $("#btnVoltar").addClass('hidden');
        }

        if (etapa == 2) {
            $("#lblTituloEtapa").text('Endereço de entrega:');
            $("#itensCarrinho").addClass('hidden');
            $("#localEntrega").removeClass('hidden');
            $("#resumoCarrinho").addClass('hidden');

            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');
            $(".etapa2").addClass('active');

            $("#btnEtapaPedido").addClass('hidden');
            $("#btnEtapaEndereco").removeClass('hidden');
            $("#btnEtapaResumo").addClass('hidden');
            $("#btnVoltar").removeClass('hidden');
        }

        if (etapa == 3) {
            $("#lblTituloEtapa").text('Resumo do pedido:');
            $("#itensCarrinho").addClass('hidden');
            $("#localEntrega").addClass('hidden');
            $("#resumoCarrinho").removeClass('hidden');
            

            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');
            $(".etapa2").addClass('active');
            $(".etapa3").addClass('active');

            $("#btnEtapaPedido").addClass('hidden');
            $("#btnEtapaEndereco").addClass('hidden');
            $("#btnEtapaResumo").removeClass('hidden');
            $("#btnVoltar").removeClass('hidden');
        }

    },

    //botão de voltar etapa
    voltarEtapa: () => {
        let etapa = $(".etapa.active").length;
        cardapio.metodos.carregarEtapa(etapa - 1);
    },

    //carrega a lista de itens do carrinho
    carregarCarrinho: () => {
    
       cardapio.metodos.carregarEtapa(1);

       if (MEU_CARRINHO.length > 0) {

            $("#itensCarrinho").html('');

            $.each(MEU_CARRINHO, (i, e) => {

                let temp = cardapio.templates.itemCarrinho.replace(/\${img}/g, e.img)
                .replace(/\${name}/g, e.name)
                .replace(/\${preco}/g, e.price.toFixed(2).replace('.',','))
                .replace(/\${id}/g, e.id)
                .replace(/\${qntd}/g, e.qntd)

                $("#itensCarrinho").append(temp);

                //último item
                if ((i +1) == MEU_CARRINHO.length) {
                    cardapio.metodos.carregarValores();
                }
            })

       } else {
        $("#itensCarrinho").html('<p class="carrinho-vazio"><i class="fa fa-shopping-bag"></i> Seu carrinho está vazio.</p>');
        cardapio.metodos.carregarValores();
       }


    },

    //diminuir quantidade de item no carrinho
    diminuirQuantidadeCarrinho: (id) => {

        let qntdAtual = parseInt($("#qntd-carrinho-" + id).text());

        if (qntdAtual > 1) {
            $("#qntd-carrinho-" + id).text(qntdAtual - 1);
            cardapio.metodos.atualizarCarrinho(id, qntdAtual - 1);
        } else {
            cardapio.metodos.removerItemCarrinho(id)
        }
    },

    //aumenta quantidade de item no carrinho
    aumentarQuantidadeCarrinho: (id) => {

        let qntdAtual = parseInt($("#qntd-carrinho-" + id).text());
        $("#qntd-carrinho-" + id).text(qntdAtual + 1);
        cardapio.metodos.atualizarCarrinho(id, qntdAtual + 1);
    },

    //botão remover item do carrinho
    removerItemCarrinho: (id) => {

        MEU_CARRINHO = $.grep(MEU_CARRINHO, (e, i) => { return e.id != id });
        cardapio.metodos.carregarCarrinho();

        //atualiza o botão carrinho com a quantidade atualizada
        cardapio.metodos.atualizarBadgeTotal();
    },

    //atualiza o carrinho com a quantidade atual
    atualizarCarrinho: (id, qntd) => {

        let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id));
        MEU_CARRINHO[objIndex].qntd = qntd;

        //atualiza o botão carrinho com a quantidade atualizada
        cardapio.metodos.atualizarBadgeTotal();

        //atualiza os valores (R$) totais do carrinho
        cardapio.metodos.carregarValores();
    },

    //carrega os valores de subtotal de entrega e total
    carregarValores: () => {

        VALOR_CARRINHO = 0;

        $("#lblSubTotal").text('R$ 0,00');
        $("#lblValorEntrega").text('+ R$ 0,00');
        $("#lblValorTotal").text('R$ 0,00');

        $.each(MEU_CARRINHO, (i, e) => { 
        

            VALOR_CARRINHO += parseFloat(e.price * e.qntd)

            if ((i + 1) == MEU_CARRINHO.length) {
                $("#lblSubTotal").text(`R$ ${VALOR_CARRINHO.toFixed(2).replace('.',',')}`);
                $("#lblValorEntrega").text(`+ R$ ${VALOR_ENTREGA.toFixed(2).replace('.',',')}`);
                $("#lblValorTotal").text(`R$ ${(VALOR_CARRINHO + VALOR_ENTREGA).toFixed(2).replace('.',',')}`);
            }
        })

        },
        
        //carregar a etapa endereço
        carregarEndereco: () => {

            if (MEU_CARRINHO.length <= 0) {
                cardapio.metodos.mensagem('Seu carrinho está vazio.')
                return;
            }
            cardapio.metodos.carregarEtapa(2);
        },

        //API VIACEP
        buscarCep: () => {
            //cria a variável com o valor do cep
            var cep = $("#txtCEP").val().trim().replace(/\D/g, '');

            //verifica se o cep ossui valor informado
            if (cep != "") {

                //expressão regular para vaidar o CEP
                var validacep = /^[0-9]{8}$/;

                if (validacep.test(cep)) {

                    $.getJSON("https://viacep.com.br/ws/" + cep + "/json/?callback=?", function (dados) {
                        if (!("erro" in dados)) {
                            //Atualizar os campos com valores retornados
                            $("#txtEndereco").val(dados.logradouro);
                            $("#txtBairro").val(dados.bairro);
                            $("#txtCidade").val(dados.localidade);
                            $("#ddlUf").val(dados.uf);
                            $("#txtNumero").focus();

                        } else {
                            cardapio.metodos.mensagem('CEP não encontrado. Preencha as informações manualmente.');
                            $("#txtEndereo").focus();
                        }


            })
        } 
            else {
                cardapio.metodos.mensagem('formato do CEP inválido.');
                $("#txtCEP").focus();
            }
        } 
        else {
            cardapio.metodos.mensagem('Informe o CEP, por favor.');
            $("#txtCEP").focus(); 
        }  
                
    },

    //validação antes de prosseguir para a etapa 3
    resumoPedido: () => {

        let cep = $("#txtCEP").val().trim();
        let endereco = $("#txtEndereco").val().trim();
        let bairro = $("#txtBairro").val().trim();
        let cidade = $("#txtCidade").val().trim();
        let uf = $("#ddlUf").val().trim();
        let numero = $("#txtNumero").val().trim();
        let complemento = $("#txtComplemento").val().trim();

        if (cep.length <= 0) {
            cardapio.metodos.mensagem('Informe o CEP, por favor.');
            $("#txtCEP").focus();
            return;
        }

        if (endereco.length <= 0) {
            cardapio.metodos.mensagem('Informe o Endereço, por favor.');
            $("#txtEndereco").focus();
            return;
        }

        if (bairro.length <= 0) {
            cardapio.metodos.mensagem('Informe o Bairro, por favor.');
            $("#txtBairro").focus();
            return;
        }

        if (cidade.length <= 0) {
            cardapio.metodos.mensagem('Informe a Cidade, por favor.');
            $("#txtCidade").focus();
            return;
        }

        if (uf == "-1") {
            cardapio.metodos.mensagem('Informe a UF, por favor.');
            $("#ddlUf").focus();
            return;
        }

        if (numero.length <= 0) {
            cardapio.metodos.mensagem('Informe o Número, por favor.');
            $("#txtNumero").focus();
            return;
        }

        MEU_ENDERECO = {

        cep: cep, 
        endereco: endereco,
        bairro: bairro,
        cidade: cidade,
        uf: uf,
        numero: numero,
        complemento: complemento
        }

        cardapio.metodos.carregarEtapa(3);
        cardapio.metodos.carregarResumo();
    },

    carregarResumo: () => {

        $("#listaItensResumo").html('');
        $.each(MEU_CARRINHO, (i, e) => {

            let temp = cardapio.templates.itemResumo.replace(/\${img}/g, e.img)
            .replace(/\${name}/g, e.name)
            .replace(/\${preco}/g, e.price.toFixed(2).replace('.',','))
            .replace(/\${qntd}/g, e.qntd)
        
            $("#listaItensResumo").append(temp);
        

        }),

        $("#resumoEndereco").html(`${MEU_ENDERECO.endereco}, ${MEU_ENDERECO.numero}, ${MEU_ENDERECO.bairro}`);
        $("#cidadeEndereco").html(`${MEU_ENDERECO.cidade}, ${MEU_ENDERECO.uf}, ${MEU_ENDERECO.cep} ${MEU_ENDERECO.complemento}`);

        cardapio.metodos.finalizarPedido();
    },

    //atualizar o link do botão do WhatsApp
    finalizarPedido: () => {

        if (MEU_CARRINHO.length > 0 && MEU_ENDERECO != null) {

            var texto = 'olá! gostaria de fazer um pedido:';
            texto += `\n*Itens do pedido:*\n\n\${itens}`;
            texto += '\n*endereço da entrega:*';
            texto += `\n${MEU_ENDERECO.endereco}, ${MEU_ENDERECO.numero}, ${MEU_ENDERECO.bairro}`;
            texto += `\n${MEU_ENDERECO.cidade}- ${MEU_ENDERECO.uf} / ${MEU_ENDERECO.cep} ${MEU_ENDERECO.complemento}`;
            texto += `\n\n*Total (com entrega): R$ ${(VALOR_CARRINHO + VALOR_ENTREGA).toFixed(2).replace('.',',')}`;

            var itens = '';

            $.each(MEU_CARRINHO, (i,e) => {

                itens += `*${e.qntd}x* ${e.name} ....... R$ ${e.price.toFixed(2).replace('.',',')} \n`;

                //último item
                if ((i + 1) == MEU_CARRINHO.length) {

                texto = texto.replace(/\${itens}/g, itens);

                //converter a URL
                let encode = encodeURI(texto);
                let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encode}`;

                $("#btnEtapaResumo").attr('href', URL);
        }
            })



        }
    
     
    },

    //carrega o link do botão reserva
    carregarBotaoReserva: () => {
        var texto = 'olá! gostaria de fazer uma *reserva.*';

        let encode = encodeURI(texto);
        let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encode}`;

        $("#btnReserva").attr('href', URL);

    },


    carregarBotaoLigar: () => {
$("#btnLigar").attr('href', `tel:$(CELULAR_EMPRESA)`);

    },

    //abrir os depoimentos
    abrirDepoimento: (depoimento) => {

        $("#depoimento-1").addClass('hidden');
        $("#depoimento-2").addClass('hidden');
        $("#depoimento-3").addClass('hidden');

        $("#depoimento-1").removeClass('active');
        $("#depoimento-2").removeClass('active');
        $("#depoimento-3").removeClass('active');

        $("#depoimento-" + depoimento).removeClass('hidden');
        $("#btnDepoimento-" + depoimento).addClass('active');

    },

    botaoWhatsApp: () => {
        var texto = 'Olá! gostaria de fazer um *pedido, pode me ajudar?*';

        let encode = encodeURI(texto);
        let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encode}`;

        $("#btnWhatsApp").attr('href', URL);

    },

    botaoWhatsApp: () => {
        var texto = 'Olá! gostaria de fazer um *pedido, pode me ajudar?*';

        let encode = encodeURI(texto);
        let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encode}`;

        $("#btnWhatsApp2").attr('href', URL);

    },



    


//mensagens
    mensagem: (texto, cor = 'red', tempo = 3500) => {
        
        let id = Math.floor(Date.now() * Math.random()).toString();

        let msg = `<div id="msg-${id}" class="animated fadeInDown toast ${cor}">${texto}</div>`;
        
        $("#container-mensagens").append(msg);

        setTimeout(() => {
            $("#msg-" + id).removeClass('fadeInDown');
            $("#msg-" + id).addClass('fadeOutUp');
            setTimeout(() => {
                $("#msg-" + id).remove();
            },800);
        }, tempo)
    }
},

cardapio.templates = {
    
    item: `
        <div class="col-12 col-lg-3 col-md-3 col-mb-5 animated fadeInUp mb-5">
            <div class="card card-item id="\${id}">
                <div class="img-produto">
                    <img src="\${img}"/>
                </div>
                <p class="title-produto text-center mt-4">
                    <b>\${name}</b>
                </p>
                <p class="price-produto text-center">
                    <b>R$ \${preco}</b>
                </p>
                <div class="add-carrinho">
                    <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidade('\${id}')"><i class="fas fa-minus"></i></span>
                    <span class="add-numero-itens" id="qntd-\${id}">0</span>
                    <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidade('\${id}')"><i class="fas fa-plus"></i></span>
                    <span class="btn btn-add" onclick="cardapio.metodos.adicionarAoCarrinho('\${id}')"><i class="fa fa-shopping-bag"></i></span>
                </div>
            </div>
        </div>
    `,

    itemCarrinho: `
    <div class="col-12 item-carinho">
        <div class="img-produto">
            <img src="\${img}"/>
        </div>
        <div class="dados-produto">
            <p class="title-produto"><b>\${name}</b></p>
            <p class="price-produto"><b>R$ \${preco}</b></p>
        </div>    
        <div class="add-carrinho">
            <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidadeCarrinho('\${id}')"><i class="fas fa-minus"></i></span>
            <span class="add-numero-itens" id="qntd-carrinho-\${id}">\${qntd}</span>
            <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidadeCarrinho('\${id}')"><i class="fas fa-plus"></i></span>
            <span class="btn btn-remove no-mobile" onclick="cardapio.metodos.removerItemCarrinho('\${id}')"><i class="fa fa-times"></i></span>
        </div>
    </div>
    
    `,

    itemResumo: `
        <div class="col-12 item-carinho resumo">
            <div class="img-produto-resumo">
                <img src="\${img}" />
            </div>
            <div class="dados-produto">
                <p class="title-produto-resumo">
                    <b>\${name}</b>
                </p>
                <p class="price-produto-resumo">
                    <b>R$ \${preco}</b>
                </p>
            </div>
                <p class="quantidade-produto-resumo">
                    x <b>\${qntd}</b>
                </p>
        </div>
    `,

}