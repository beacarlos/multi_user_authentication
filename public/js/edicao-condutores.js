$(document).ready(function () {
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

    $("#imagem_pessoa").on("error", function () {
        $(this).attr("src", "/img/image.png");
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

//Evento abrir o modal de cadastro de veiculos.
$("#novo_cadastro_veiculo").click(function () {
    var qCards = $("#veiculos .classVeiculos").length;

    if (qCards < 6) {
        $(".ui.form#formulario_veiculos").form('clear');
        $("input[name=_token]").val($('meta[name=csrf-token]').attr('content'));
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

//Update de dados do condutor
$("#edicao_condutor").submit(function (e) {
    e.preventDefault();

    var formData = new FormData(this);

    $.ajax({
        type: "POST",
        url: "/admin/editar/ver",
        data: formData,
        contentType: false,
        cache: false,
        processData: false,
        success: function (response) {
            console.log("deu bom meu jovi");
        }
    });
});

//Função de enviar os dados para inserção no banco de dados
$("#edicao_condutor").submit(function (e) {
    e.preventDefault();
    var formData = new FormData(this);
    
    $.ajax({
        url: '/admin/editar/ver',
        type: 'POST',
        data: formData,
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        success: function (data) {
            console.log(data);
        }
    });
});