finalFiles = [];
counter = 0;
$(document).ready(function () {
    $('select#tipo_veiculo').dropdown({
        maxSelections: 1
    });

    //deixa oculto todos os inputs do formulário do visitante.
    $("[name=visitante]").hide();
    //ativa o menu e sub menu correspondente na navbar. 
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
    //função que verifica se o checkbox do visitante foi ativado.
    checkVisitante();
    //função que realiza o preview da foto que foi escolhida pelo usuário.
    previewPessoa();
    //função que realiza o preview da foto do carro que foi escolhida pelo usuário.
    previewVeiculo();
    // dataPiker()
    //função de limpar formulários.
    $("#limpartela").click(limparForm());
});

var typingTimer; //timer identifier
var doneTypingInterval = 500; //time in ms, 1 second for example

//acessa o input, valida o que o usúario escrever e chama a função.
$("#identificacao_pessoa").bind("keyup", function (e) {
    clearTimeout(typingTimer);
    var expre = /[^\d]/g;
    $(this).val($(this).val().replace(expre, ''));
    if ($(this).val) {
        typingTimer = setTimeout(buscarDados, doneTypingInterval);
    }

    if ($(this).val() == "") {
        $("#nome_visitante").val("");
        $("#tipo_visitante").val("");
        $("#identidade_visitante").val("");
        $("#cpf_visitante").val("");
        $("#telefone_visitante").val("");
        $("#email_visitante").val("");

        $('#imagem_pessoa').attr('src', '/img/image.png');

        $("#nome_pessoa").val("");
        $("#tipo_pessoa").val("");
        $("#identidade_pessoa").val("");
        $("#cpf_pessoa").val("");
        $("#telefone_pessoa").val("");
        $("#email_pessoa").val("");
        $("#matricula_pessoa").val("");
        $("#curso_pessoa").val("");
    }
});


//abrir o modal de cadastro de veiculos.
$("#novo_cadastro_veiculo").click(function () {
    var qCards = $("#veiculos .classVeiculos").length;

    if (qCards < 6) {
        $('.ui.modal').modal('show');
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

    $.each(this.files, function (idx, elm) {
        finalFiles[counter] = elm;
    });
    counter++;
});

//Função que valida o formulário de gerar um card.
$("#salvar_modal").click(function () {
    // var imagem = $("#imagem-veiculo").attr('src');
    var marca = $("#marca").val();
    var placa = $("#placa").val();
    var modelo = $("#modelo").val();
    var tipo_veiculo = $("#tipo_veiculo").val();
    var imagem_veiculo = $("#upload_imagem_veiculo").val();

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
                        $("#msg_erros").hide();
                        $('.ui.modal').modal('hide')
                    });
            } else {
                //validação do formulário de gerar cards dos veiculos.
                $.each(data.erros, function (key, value) {
                    console.log(key);
                    $("." + key).html(value);
                    $("#d_" + key).addClass('error');

                    $("#d_" + key).click(function () {
                        $(this).removeClass('error');
                        $('.' + key).text('');
                    });
                });
            }
        },
        statusCode: {
            // caso der erro de requisição.
            500: function () {
                console.clear();
            }
        }
    });

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

//Função checa se o checkbox foi ativado, alterna os campos de pessoa e visitante.
function checkVisitante() {
    $("[id=check-visitante]").change(function () {
        //caso for visitante.
        if ($(this).prop("checked")) {
            //mostra os campos de visitante.
            $("[name=visitante]").show();
            //oculta os campos de pessoa.
            $("[name=pessoa]").hide();

            //adiciona os texto nos inputs do formulário.
            $("#nome_visitante").val("");
            $("#tipo_visitante").val("");
            $("#identidade_visitante").val("");
            $("#cpf_visitante").val("");
            $("#telefone_visitante").val("");
            $("#email_visitante").val("");

            $('#imagem_pessoa').attr('src', '/img/image.png');
        }
        //caso for pessoa.
        else {
            //mostra os campos de pessoa.
            $("[name=pessoa]").show();
            //oculta os campos de visitante.
            $("[name=visitante]").hide();

            //adiciona os texto nos inputs do formulário.
            $("#nome_pessoa").val("");
            $("#tipo_pessoa").val("");
            $("#identidade_pessoa").val("");
            $("#cpf_pessoa").val("");
            $("#telefone_pessoa").val("");
            $("#email_pessoa").val("");
            $("#matricula_pessoa").val("");
            $("#curso_pessoa").val("");

            $('#imagem_pessoa').attr('src', '/img/image.png');
        }
    });
}

//Função que formata as strings vindo do banco central.
function formatacaoStrings(texto) {
    var palavras = texto.toLowerCase().split(" ");
    for (var a = 0; a < palavras.length; a++) {
        var w = palavras[a];
        palavras[a] = w[0].toUpperCase() + w.slice(1);
    }
    return palavras.join(" ");
}

//Função que busca os dados do usuário no banco de dados central.
function buscarDados() {
    var identificacao = $('#identificacao_pessoa').val();
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
                //caso tiver dados que veio no banco.
                if (data.length != 0) {
                    var pessoa_tipo_id = parseInt(data[0].pessoa_tipo_id);

                    $("#nome_pessoa").val(formatacaoStrings(data[0].nome));
                    $("#numero_cartao").val(data[0].numero_cartao);
                    $("#curso_pessoa").val(formatacaoStrings(data.curso_setor));
                    $("#identidade_pessoa").val(data[0].identidade);
                    $("#email_pessoa").val(data[0].email);
                    $("#cpf_pessoa").val(data[0].cpf);
                    $("#telefone_pessoa").val(data[0].celular);

                    switch (pessoa_tipo_id) {
                        case 1:
                            $("#tipo_pessoa").val('Aluno');
                            break;
                        case 2:
                            $("#tipo_pessoa").val('Estagiário');
                            break;
                        case 3:
                            $("#tipo_pessoa").val('Servidor');
                            break;
                        case 4:
                            $("#tipo_pessoa").val('Terceirizado');
                            break;
                        case 5:
                            $("#tipo_pessoa").val('Visitante');
                            break;
                        case 6:
                            $("#tipo_pessoa").val('Mestrado');
                            break;
                    }

                    $('#cadastro_condutor input[type=text]').each(function () {
                        if (((this.value.length > 3) && this.id != "identificacao-pessoa") && (this.value != null)) {
                            $(this).attr('readonly', 'readonly');
                        }
                    });

                    $("#imagem_pessoa").attr("src", "http://10.50.13.3:82/a9603eec66f6f55210693b0ef1f315ad/" + data[0].identificacao + ".jpg");

                } else if (data.length == 0) {
                    limparFormularioCadastro();
                }
            },
            statusCode: {
                //caso der erro de requisição.
                500: function () {
                    limparFormularioCadastro();
                }
            }
        });
    }
}

//Função de limpar o formulário
function limparFormularioCadastro() {
    //limpando campos do visitante.
    $("#nome_visitante").val('');
    $("#tipo_visitante").val('');
    $("#identidade_visitante").val('');
    $("#cpf_visitante").val('');
    $("#telefone_visitante").val('');
    $("#email_visitante").val('');

    //limpando campos de pessoa.
    $("#nome_pessoa").val('');
    $("#tipo_pessoa").val('');
    $("#identidade_pessoa").val('');
    $("#cpf_pessoa").val('');
    $("#telefone_pessoa").val('');
    $("#curso_pessoa").val('');
    $("#email_pessoa").val('');

    $('#cadastro_condutor input[type=text]').each(function () {
        $(this).removeAttr("readonly");
    });

    $("#imagem_pessoa").attr("src", "/img/image.png");
    console.clear();
}

//Função de remover o card do veiculo quando clicado no botão.
function removeCardVeiculos(id) {
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
            $("#cardV_" + id).remove();
        }
    });
}

//Função de gerar card dos veiculos.
var contador = 1;

function veiculosCards() {
    //dados do formulário do modal de Veiculos.
    var imagem = $("#imagem_veiculo").attr('src');
    var marca = $("#marca").val();
    var placa = $("#placa").val();
    var modelo = $("#modelo").val();
    var tipo_veiculo = $("#tipo_veiculo").val();
    var classe = "cardV_" + contador;

    //chamando função de criar os cards.
    criarCardVeiculos(classe, placa, tipo_veiculo, imagem, marca, modelo);

    contador++;

    //limpar o formulario do modal.
    $('#imagem_veiculo').attr('src', '/img/image.png');
    $('#formulario_veiculos')[0].reset();
    $('#tipo_veiculo').val("");
}

//Função de criar card do veiculo.
function criarCardVeiculos(classe, placa, tipo_veiculo, imagem, marca, modelo) {
    var card = $("#veiculos").prepend('<div class="five wide column classVeiculos" id="' + classe + '" style=""><input type="hidden" name="placa" value="' + placa + '"><input type="hidden" name="tipo_veiculo" value="' + tipo_veiculo + '"><div class="ui link card" id="cardCustomer"><div class="image"><img class="ui small rounded image" style="height: 240.46px;object-fit: cover; width: 290px;max-width: 100%;" src="' + imagem + '"></div> <div class="content ui attached button" style="text-align: center; background-color: gray;"><a class="header">' + marca + '</a><div class="meta"><span style="color:black">' + modelo + '</span></div></div></div><div style="text-align: center;"><button class="ui red icon button" type="button" onclick="removeCardVeiculos(1)" id="btnRemoveCardVeiculos"><i class="trash icon"></i></button></div></div>');

    return card;
}

//Função de limpar os formulários.
function limparForm() {
    $('form').each(function () {
        this.reset();
    });
}

//Função de preview da imagem pessoa que o usúario escolheu.
function previewPessoa() {
    $("#upload_imagem_pessoa").change(function () {
        const file = $(this)[0].files[0]
        console.log(file);
        const fileReader = new FileReader()

        fileReader.onloadend = function () {
            $("#imagem_pessoa").attr('src', fileReader.result)
        }
        fileReader.readAsDataURL(file)
    });
}

//Função de preview da imagem veiculo que o usúario escolheu.
function previewVeiculo() {
    $("#upload_imagem_veiculo").change(function () {
        $(".upload_imagem_veiculo").text('');
        const file = $(this)[0].files[0]
        const fileReader = new FileReader()

        fileReader.onloadend = function () {
            $("#imagem_veiculo").attr('src', fileReader.result)
        }
        fileReader.readAsDataURL(file)
    });
}

//Função de enviar os dados para inserção no banco de dados
$("#cadastro_condutor").submit(function (e) {
    e.preventDefault();
    var checado = $("#check-visitante").prop("checked");
    var formData = new FormData(this);

    for (var i = 0; i < finalFiles.length; i++) {
        formData.append('uploadFile[]', finalFiles[i]);
    }

    formData.append('imagem_pessoa', $("#identificacao_pessoa").val());

    if (!checado) {
        formData.append('tipo_pesssoa1', 0);
    } else {
        formData.append('tipo_pesssoa1', 1);
    }

    $.ajax({
        url: '/admin/cadastro/condutor/cadastrar/validacao',
        type: 'POST',
        data: formData,
        contentType: false,
        cache: false,
        processData: false,
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        success: function (data) {
            if (Object.keys(data) == 'erro') {
                Swal.fire({
                    type: 'info',
                    title: data['erro'],
                    showConfirmButton: false,
                    timer: 1300
                })
            } else {
                Swal.fire({
                    type: 'success',
                    title: data['sucesso'],
                    showConfirmButton: false,
                    timer: 1300
                })
            }
        }
    });
});

//Função do calendário.
function dataPiker() {
    $('#rangestart').calendar({
        text: {
            days: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
            months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
            monthsShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            today: 'Hoje',
            now: 'Agora',
            am: 'AM',
            pm: 'PM'
        },
        type: 'date',
        endCalendar: $('#rangeend')
    });
    $('#rangeend').calendar({
        text: {
            days: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
            months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
            monthsShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            today: 'Hoje',
            now: 'Agora',
            am: 'AM',
            pm: 'PM'
        },
        type: 'date',
        startCalendar: $('#rangestart')
    });
}