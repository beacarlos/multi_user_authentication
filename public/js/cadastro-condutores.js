//Variaveis Globais
finalFiles = [];
detalhesFile = [];
counter = 0;
var typingTimer; //timer identifier
var doneTypingInterval = 100;
var contador = 1;

$(document).ready(function () {
    $("#message_veiculos").hide();
    /*Configurações semantic ui (Layout)*/
    // Configuração do select tipo veiculo (modal)
    $('#tipo_veiculo').dropdown({
        maxSelections: 1,
        message: {
            addResult: 'Add <b>{term}</b>',
            count: '{count} selecionado(s).',
            maxSelections: 'Permitido somente {maxCount} seleção.',
            noResults: 'Nada encontrado.'
        }
    });
    $(".selection.cor").dropdown({
        on: "hover"
    });
    //Ativa o menu e sub menu correspondente na navbar. 
    $('#cadastros').addClass('active');
    $('.cadastros').addClass('active');
    $('#cadastrarCondutor').addClass('active');

    //cards especiais (imagem do usuario com preview).
    $('.special.cards .image').dimmer({
        on: 'hover'
    });

    //cards especiais (imagem do veiculo com preview).
    $('.special.cards .image .imagemcardModal').dimmer({
        on: 'hover'
    });

    //função que gera as mascaras do inputs no modal de veiculos.
    mascaraFormulario();


});


$('.ui.search').search({
    apiSettings: {
        url: '/admin/cadastro/autocomplete/{query}'
    },
    fields: {
        results: 'suggestions',
        title: 'nome',
        description: 'identificacao'
    },
    message: {
        addResult: 'Add <b>{term}</b>',
        count: '{count} selecionado(s).',
        maxSelections: 'Permitido somente {maxCount} seleção.',
        noResults: 'Nada encontrado.'
    },
    error: {
        source: 'Nenhum resultado encontrado.',
        noResults: 'Sua busca não retornou resultados.',
        serverError: 'Buscando...'
    },
    searchOnFocus: true,
    transition: "slide down",
    duration: 0,
    minCharacters: 2,
    maxResults: 10,
    cache: true,
    silent: true,
    selectFirstResult: true,
    fullTextSearch: true,
    searchDelay: 0,
    onSelect(result, response) {
        buscarDados(result.identificacao);
    }
});

//Função que busca a pessoa no banco central
function buscarDados(identificacao) {
    //se a identificacao for maior que 5.
    if (identificacao.length > 5) {
        //envio de requisição POST.
        $.ajax({
            type: 'POST',
            url: "/admin/cadastro/condutor/ver",
            data: {
                '_token': $('input[name=_token]').val(),
                'identificacao': identificacao,
            },
            headers: {
                'X-CSRF-Token': $('meta[name=_token]').attr('content')
            },
            success: function (data) {
                console.log(data);
                if (data.length != 0) {
                    setor_curso = ((data[0].nome_curso == "" || data[0].nome_curso == null) ? data[0].nome_setor : data[0].nome_curso);

                    $("#telefone_pessoa").val(data[0].celular);
                    $("#email_pessoa").val(data[0].email);
                    $("#nome_pessoa").val(formatacaoStrings(data[0].nome));
                    $('#identificacao_pessoa').val(data[0].pessoa_identificacao)
                    $("#numero_cartao").val(data[0].numero_cartao);

                    if (formatacaoStrings(data[0].pessoa_tipo) == 'Visitante') {
                        $("#d_curso_pessoa").hide();
                    } else {
                        $("#d_curso_pessoa").show();
                        $("#curso_pessoa").val(formatacaoStrings(setor_curso));
                    }

                    if (formatacaoStrings(data[0].pessoa_tipo) == 'Visitante') {
                        $("#d_cpf_pessoa").hide();
                    } else {
                        $("#d_cpf_pessoa").show();
                        $("#cpf_pessoa").val(formatacaoStrings(data[0].cpf));
                    }

                    $("#imagem_pessoa").attr("src", "http://bd.maracanau.ifce.edu.br/uploads/image/" + data[0].pessoa_identificacao + ".jpg");
                    $("#imagem_pessoa").on("error", function () {
                        $(this).attr("src", "/img/image.png");
                    });

                    $("#tipo_pessoa").val(formatacaoStrings(data[0].pessoa_tipo));

                    if (formatacaoStrings(data[0].pessoa_tipo) == "Visitante") {
                        $("#motivo_visitante_append").html('<div class="field" id="d_motivo"> <label>Motivo:</label> <input type="text" name="motivo" id="motivo"><span id="msg_erros" class="motivo"></span></div>');
                        $("#prazo_final_visitante_append").html('<div class="field" id="d_prazo_final"> <label>Prazo Final:</label> <input type="text" name="prazo_final" id="prazo_final"> <span id="msg_erros" class="prazo_final"></span> </div>');
                        $("#motivo").val(data[0].motivo);
                        $("#prazo_final").val(data[0].prazo_final);
                    } else {
                        $("#motivo_visitante_append").empty();
                        $("#prazo_final_visitante_append").empty();
                    }

                    $("#cadastro_condutor input[type=text").each(function () {
                        if ($(this).val() == "") {
                            $(this).val("");
                            $(this).removeAttr("readonly");
                        } else {
                            $(this).attr("readonly", true);
                        }
                    });

                    $("#campo_pesquisa").val("");
                }
            }
        });
    }
}

//Evento abrir o modal de cadastro de veiculos.
$("#novo_cadastro_veiculo").click(function () {
    var qCards = $("#veiculos .classVeiculos").length;

    if (qCards < 6) {
        $(".ui.form#formulario_veiculos").form('clear');
        $("#imagem_veiculo").attr('src','/img/image.png');
        $("input[name=_token]").val($('meta[name=csrf-token]').attr('content'));
        $('.ui.modal').modal('show');
        $(".field#formulario_veiculos").each(function () {
            $(".field").addClass("inputsFormVeiculo");
            $(this).removeClass('error');
        });
        // $("#msg_erros").hide();

    } else {
        $("#msg_erros").hide();
        $('#modalCadastroVeiculos')
            .modal('hide', function () {
                $("#msg_erros").hide();
                $('.ui.modal').modal('hide')
            });
        Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'Excedido o limite de veiculos! (máximo 5 veiculos)'
        })
    }
});

$("#upload_imagem_veiculo").on('change', function (e) {
    $('.imgAChoose').html("");
    var fileNum = this.files.length,
        initial = 0;
    // Lembrar de validação para erro de imagem ao selecionar
    $.each(this.files, function (idx, elm) {
        finalFiles[counter] = elm;
        detalhesFile[counter] = {
            "marca": "",
            "placa": "",
            "veiculo": "",
            "modelo": "",
            "cor": "",
            "ano": ""
        };
    });
    counter++;
});

//Evento que valida o formulário de gerar um card.
$("#salvar_modal").click(function (e) {
    e.preventDefault();
    var marca = $("#marca").val();
    var placa = $("#placa").val();
    var modelo = $("#modelo").val();
    var tipo_veiculo = $("#tipo_veiculo").val();
    var imagem_veiculo = $("#upload_imagem_veiculo").val();
    var cor = $("#cor").val();
    var ano = $("#ano").val();

    // var teste = [];
    // teste['marca'] = marca;
    var countAux = counter - 1;

    //validação da imagem do veiculo
    if ((imagem_veiculo == '' || imagem_veiculo == null)) {
        if ($(".upload_imagem_veiculo").val('')) {
            $(".upload_imagem_veiculo").html("Você tem que inserir uma imagem para o cadastro do veiculo.");
        }
    } else {
        $(".upload_imagem_veiculo").text('');
    }

    //envio de requisição POST (validação).
    $.ajax({
        type: 'POST',
        url: "/admin/cadastro/condutor/validacao",
        data: {
            '_token': $('input[name=_token]').val(),
            'marca': marca,
            'placa': placa,
            'modelo': modelo,
            'cor': cor,
            'ano': ano,
            'tipo_veiculo': tipo_veiculo
        },
        headers: {
            'X-CSRF-Token': $('meta[name=_token]').attr('content')
        },
        success: function (data) {
            if (data.length == 0) {
                $("#msg_erros").hide();
                veiculosCards();
                $('#modalCadastroVeiculos')
                    .modal('hide', function () {
                        detalhesFile[countAux]['marca'] = marca;
                        detalhesFile[countAux]['placa'] = placa;
                        detalhesFile[countAux]['veiculo'] = tipo_veiculo;
                        console.log(tipo_veiculo);
                        detalhesFile[countAux]['cor'] = cor;
                        detalhesFile[countAux]['ano'] = ano;
                        detalhesFile[countAux]['modelo'] = modelo;

                        $("#msg_erros").hide();
                        $('.ui.modal').modal('hide');

                        if ($("#veiculos #cardVeiculos").length == 0) {
                            $("#message_veiculos").removeClass('hidden');
                        } else {
                            $("#message_veiculos").addClass('hidden');
                        }
                    });
            } else {
                //validação do formulário de gerar cards dos veiculos.
                $.each(data.erros, function (key, value) {
                    $(".field").removeClass("inputsFormVeiculo");
                    $("." + key).html(value);
                    $("#d_" + key).addClass('error');

                    $("#d_" + key).click(function () {
                        $(".field").addClass("inputsFormVeiculo");
                        $(this).removeClass('error');
                        $('.' + key).text('');
                    });
                });
            }
        }
    });

});

//Função de gerar card dos veiculos.
function veiculosCards() {
    //dados do formulário do modal de Veiculos.
    var imagem = $("#imagem_veiculo").attr('src');
    var marca = $("#marca").val();
    var placa = $("#placa").val();
    var modelo = $("#modelo").val();
    var tipo_veiculo = $("#tipo_veiculo").val();
    var classe = "cardV_" + contador;

    //chamando função de criar os cards.
    criarCardVeiculos(contador, classe, placa, tipo_veiculo, imagem, marca, modelo);

    contador++;

    //limpar o formulario do modal.
    $('#imagem_veiculo').attr('src', '/img/image.png');
    $('#formulario_veiculos')[0].reset();
    $('#tipo_veiculo').val("");
    // $("#message_veiculos").addClass('hidden');
}

//Função de criar card do veiculo.
function criarCardVeiculos(contador, classe, placa, tipo_veiculo, imagem, marca, modelo) {
    $("#butons").removeClass('butonsCadastro');
    var card = $("#veiculos").prepend('<div class="five wide column classVeiculos" id="cardVeiculosCadastrar" data-id="' + classe + '" style=""><div class="ui  card cardVeiculos" id="cardVeiculos"><div class="image"><img class="ui small rounded image img_veiculo"  src="' + imagem + '"></div> <div class="content ui attached button" style="text-align: center; background-color: gray;"><a class="header">' + marca + '</a><div class="meta"><span style="color:black">' + modelo + '</span></div></div></div><div  id="btn-apagarCard"><button class="ui red icon button" type="button" onclick="removeCardVeiculos(' + contador + ')" id="btnRemoveCardVeiculos"><i class="trash icon"></i></button></div></div>');
    return card;
}

//Função de enviar os dados para inserção no banco de dados
$("#cadastro_condutor").submit(function (e) {
    e.preventDefault();
    var formData = new FormData(this);
    var convertJson = "";

    JSON.stringify(detalhesFile);
    convertJson = JSON.stringify(detalhesFile);

    for (var i = 0; i < finalFiles.length; i++) {
        formData.append('uploadFile[]', finalFiles[i]);
        formData.append('detalhesFile', convertJson);
    }

    formData.append('imagem_pessoa', $("#identificacao_pessoa").val());
    $.ajax({
        url: '/admin/cadastro/condutor/cadastrar/validacao/form',
        type: 'POST',
        data: formData,
        contentType: false,
        cache: false,
        processData: false,
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        success: function (data) {
            if (Object.keys(data) == 'sucesso') {
                limparFormularioCadastro();
                $("#butons").addClass('butonsCadastro');
                $("#veiculos #cardVeiculosCadastrar").each(function () {
                    $(this).remove();
                });
                // $("#message_veiculos").removeClass('hidden');
                Swal.fire({
                    position: 'center',
                    type: 'success',
                    title: 'Condutor cadastrado com sucesso!',
                    showConfirmButton: false,
                    timer: 1500
                });

            } else if (Object.keys(data) == 'condutor_cadastrado') {
                Swal.fire({
                    type: 'info',
                    title: data['condutor_cadastrado'],
                    showConfirmButton: false,
                    timer: 1300
                });
            } else if (Object.keys(data) == 'erro') {
                Swal.fire({
                    type: 'error',
                    title: data['erro'],
                    showConfirmButton: false,
                    timer: 1300
                });
            }
        },
        error: function (errors) {
            $('.errors').empty();
            var erros = $.parseJSON(errors.responseText);
            $.each(erros.errors, function (key, value) {
                    $("#d_" + key).addClass('error');
                    $("." + key).html(value);
                    $("#d_" + key).click(function () {
                        $(this).removeClass('error');
                        $('.' + key).text('');
                    });

            });

            if ($("#veiculos #cardVeiculos").length == 0) {
                $("#message_veiculos").show();
            }
        }
    });
});

//Função que formata as strings vindo do banco central.
function formatacaoStrings(texto) {
    var palavras = (texto == null || texto == "") ? null : texto.toLowerCase().split(" ");

    if (palavras != null) {
        for (var a = 0; a < palavras.length; a++) {
            var w = palavras[a];
            palavras[a] = w[0].toUpperCase() + w.slice(1);
        }
        return palavras.join(" ");
    }
}

//Função de limpar o formulário
function limparFormularioCadastro() {
    $('.ui.form#cadastro_condutor').form('clear');
    $('#cadastro_condutor input[type=text]').each(function () {
        $(this).removeAttr("readonly");
    });
    $("#imagem_pessoa").attr("src", "/img/image.png");
}

//Evento onclick de limpar o formulario de cadastro de veiculos
$("#limpar_modal_veiculo").click(function () {
    //limpar o formulario do modal.
    $('#imagem_veiculo').attr('src', '/img/image.png');
    $('#tipo_veiculo').val("");
    $("#formulario_veiculos")[0].reset();
    $("#msg_erros").hide();
});

//Evento do butão limpar formulário
$("#limpar_tela").click(function (e) {
    e.preventDefault();

    $("#veiculos #cardVeiculosCadastrar").each(function () {
        $(this).remove();
    });
    $("#butons").addClass('butonsCadastro');

    $("#campo_pesquisa").val("");
    limparFormularioCadastro();
});

//Função utiliza o maskInput do Jquery e faz a validação de alguns campos.
function mascaraFormulario() {
    //validação de cpf's.
    $('#cpf_pessoa').mask('000.000.000-00', {
        reverse: true
    });
    $('#cpf_visitante').mask('000.000.000-00', {
        reverse: true
    });
    //validação de telefones.
    $('#telefone_visitante').mask('(00) 00000-0000');
    $('#telefone_pessoa').mask('(00) 00000-0000');
    //validação de placa de carro.
    $("#placa").mask('AAA-9999');
}

//Eventos de preview de imagens.
$("#upload_imagem_pessoa").change(function () {
    const file = $(this)[0].files[0]
    console.log(file);
    const fileReader = new FileReader()

    fileReader.onloadend = function () {
        $("#imagem_pessoa").attr('  src', fileReader.result)
    }
    fileReader.readAsDataURL(file)
});

$("#upload_imagem_veiculo").change(function () {
    $(".upload_imagem_veiculo").text('');
    const file = $(this)[0].files[0]
    const fileReader = new FileReader()

    fileReader.onloadend = function () {
        $("#imagem_veiculo").attr('src', fileReader.result)
    }
    fileReader.readAsDataURL(file)
});



//Função de remover o card do veiculo quando clicado no botão.
function removeCardVeiculos(id) {
    $("#butons").addClass('butonsCadastro');
    Swal.fire({
        title: 'Você tem certeza?',
        text: "Você não poderá reverter isso!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim, delete!',
        cancelButtonText: 'Cancelar!',
    }).then((result) => {
        if (result.value == true) {
            for (var i = 0; i < finalFiles.length; ++i) {
                if (i == (id - 1)) {
                    finalFiles.splice(i, 1);
                }
            }
            Swal.fire(
                'Deletado!',
                'O veiculo foi excluído',
                'success'
            );
            $("#cardVeiculosCadastrar[data-id=cardV_" + id + "]").remove();
        }
    });
}