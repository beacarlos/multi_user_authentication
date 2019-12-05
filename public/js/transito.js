//função principal
$(document).ready(function () {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $('#transito').addClass('active');
    $("#veiculos").hide();



    carregarCondutor();
    ultimosTransitos();
    setInterval(carregarCondutor, 1000);
    setInterval(ultimosTransitos, 1000);
    $('#table_condutor_nome').removeAttr('display');
});

//carregar condutor
function carregarCondutor() {
    //Variáveis para armazena tags HTML
    var html = "";
    var htmlAlertVeiculo = "";
    $.getJSON('/admin/transitos/ver', function (data) {
        //Variável que vai conter o valor do veiculo transitado
        var valorDoVeiculo = 0;
        //Verificando se o arquivo está limpo
        if (data['arquivo_limpo'] == 1) {
            //Verificando se o check esta ativo
            if ($("#checkbox_veiculos").is(':checked')) {
                $('#h2_veiculos').text('Veículo transitado');
                //Dados do condutor
                data.consultaUltimoCondutor.forEach(elementoCondutor => {
                    //Atribuindo o valor do veiculo transitado
                    valorDoVeiculo = elementoCondutor.veiculo_id_fk;
                    $("#condutor_id").val(elementoCondutor.condutor_id);
                    $("#nome_transito").val(elementoCondutor.condutor_nome);
                    $("#img_transito_condutor").attr('src', 'http://bd.maracanau.ifce.edu.br/uploads/image/' + elementoCondutor.identificacao + '.jpg');
                    $("#img_transito_condutor").on("error", function () {
                        $(this).attr("src", "/img/image.png");
                        console.clear();
                    });
                    $("#matricula_transito").val(elementoCondutor.identificacao);
                    $("#tipo_pessoa_transito").val(elementoCondutor.tipo_pessoa);
                    $("#curso_setor_transito").val(elementoCondutor.curso_setor);
                    $("#telefone_transito").val(elementoCondutor.contato);
                    $("#form_transito  #nome_transito, #matricula_transito, #tipo_pessoa_transito, #curso_setor_transito, #telefone_transito").each(function () {
                        $(this).attr("readonly", true);
                        $(this).attr("disabled", true);
                    });
                });
                if (data['dadosVeiculos'] != 0) {
                    //forEach para percorrer todos os veiculos referente a consulta feita. 
                    data.dadosVeiculos.forEach(elementoVeiculo => {
                        //Verificando se o veiculo transitado tem o mesmo "ID" do veiculo trasito pela consulta,
                        //se sim ele pega o veiculo transitado a atribui ao "if" que tem um card personalizado com o check;
                        //Depois de ele entrar no if, vai pro else trazer os outros veiculos se tiver.
                        if (valorDoVeiculo == elementoVeiculo.veiculo_id) {
                            $("#veiculo_id").val(elementoVeiculo.veiculo_id);
                            //HTML com o check(para o veiculo que tem o mesmo "ID" refente ao veiculo transitado)
                            html += '<div class="four wide column classVeiculos" id="cardVeiculosCadastrar" data-veiculo_id="' + elementoVeiculo.veiculo_id + '" ><input type="hidden" id="id_veiculo" value="' + elementoVeiculo.veiculo_id + '"><div class="ui  card centered auto_veiculo" id="cardVeiculos" ><div class="image"><img src="/img/iconCheck.png" id="imgIconVeiculo"><img class="ui small rounded image img_veiculo " id="veiculo1" src="' + /images/ + elementoVeiculo.img_veiculo + '"></div><div class="content ui attached button" style="text-align: center; background-color: grey; "><a class="header">' + elementoVeiculo.marca + '</a><div class="meta"><span style="color:black">' + elementoVeiculo.modelo + '</span></div></div></div></div>';

                        } else {
                            //HTML sem o check(para os veiculos que não tem o "ID" referente ao veiculo que transitou)
                            html += '<div class="four wide column classVeiculos" id="cardVeiculosCadastrar" data-veiculo_id="' + elementoVeiculo.veiculo_id + '" ><input type="hidden" id="id_veiculo" value="' + elementoVeiculo.veiculo_id + '"><div class="ui  card centered auto_veiculo" id="cardVeiculos" ><div class="image"><img class="ui small rounded image img_veiculo " id="veiculo1" src="' + /images/ + elementoVeiculo.img_veiculo + '"></div><div class="content ui attached button" style="text-align: center; background-color: gray; "><a class="header">' + elementoVeiculo.marca + '</a><div class="meta"><span style="color:black">' + elementoVeiculo.modelo + '</span></div></div></div></div>';

                        }

                    });
                    //HTML de veiculo não cadastrado
                    html += '<div class="five wide column classVeiculos" id="cardVeiculosNaoCadastrado"  ><div class="ui  card" id="cardVeiculos"><div class="image"><img class="ui small rounded image img_veiculo" src="/img/image.png" id="valorDoVeiculo"></div><div class="content ui bottom attached button" style="background-color: red; height: 61px !important;"><font style="vertical-align: inherit;"><font style="vertical-align: inherit; color: white; padding-top: 3px;">Não cadastrado </font></font></div></div></div>';
                } else {
                    //HTML para mostrar um alert, quando o transito estiver sido no Automático ou Veiculo não cadastrado
                    htmlAlertVeiculo += '<div class="ui  floating red message" id="TransitomessageVeiculos"><p>Veículo não cadastrado ou não identificado</p><div>';


                }
                //Verificando se o transito tem um veiculo
                //Se sim, vai atribuir ao if, que irá mostrar os cards dos veiculos.
                //se não, vai mostar o alert que o veiculos foi passado no automático ou no veiculo não cadastrado.
                if (data['dadosVeiculos'] != 0) {
                    $("#veiculos").empty();
                    $("#veiculos").html(html);
                    $("#veiculos").show();

                } else {
                    $("#veiculos").empty();
                    $("#veiculos").html(htmlAlertVeiculo);
                    $("#veiculos").show();
                }

            } else {
                $("#veiculos").hide();
                $("#veiculos").empty();
                $('#h2_veiculos').text('Veículos cadastrados');
                data.consultaUltimoCondutor.forEach(elementoCondutor => {
                    $("#condutor_id").val(elementoCondutor.condutor_id);
                    $("#nome_transito").val(elementoCondutor.condutor_nome);
                    $("#img_transito_condutor").attr('src', 'http://bd.maracanau.ifce.edu.br/uploads/image/' + elementoCondutor.identificacao + '.jpg');
                    $("#img_transito_condutor").on("error", function () {
                        $(this).attr("src", "/img/image.png");
                        console.clear();
                    });
                    $("#matricula_transito").val(elementoCondutor.identificacao);
                    $("#tipo_pessoa_transito").val(elementoCondutor.tipo_pessoa);
                    $("#curso_setor_transito").val(elementoCondutor.curso_setor);
                    $("#telefone_transito").val(elementoCondutor.contato);
                    $("#form_transito  #nome_transito, #matricula_transito, #tipo_pessoa_transito, #curso_setor_transito, #telefone_transito").each(function () {
                        $(this).attr("readonly", true);
                        $(this).attr("disabled", true);
                    });
                });
            }
            //se o cartão passado não estiver cadastrado mostrar esse alert
        } else if (data['condutor_n_cadastrado'] == 1) {
            Swal.fire({
                position: 'center',
                type: 'error',
                title: 'Condutor não cadastrado! <br>Contate o setor de TI do campus!',
                showConfirmButton: false,
                timer: 2500
            });
        } else {
            html = "";
            data.dadosCondutor.forEach(elementoCondutor => {
                $("#condutor_id").val(elementoCondutor.condutor_id);
                $("#nome_transito").val(elementoCondutor.nome);
                $("#img_transito_condutor").attr('src', 'http://bd.maracanau.ifce.edu.br/uploads/image/' + elementoCondutor.identificacao + '.jpg');
                $("#img_transito_condutor").on("error", function () {
                    $(this).attr("src", "/img/image.png");
                    console.clear();
                });
                $("#matricula_transito").val(elementoCondutor.identificacao);
                $("#tipo_pessoa_transito").val(elementoCondutor.tipo);
                $("#curso_setor_transito").val(elementoCondutor.setor_curso);
                $("#telefone_transito").val(elementoCondutor.telefone);
                $("#form_transito  #nome_transito, #matricula_transito, #tipo_pessoa_transito, #curso_setor_transito, #telefone_transito").each(function () {
                    $(this).attr("readonly", true);
                    $(this).attr("disabled", true);
                });
            });

            data.dadosVeiculos.forEach(elementoVeiculo => {
                $("#veiculo_id").val(elementoVeiculo.veiculo_id);
                html += '<div class="four wide column classVeiculos" id="cardVeiculosCadastrar" data-veiculo_id="' + elementoVeiculo.veiculo_id + '" onclick="clickVeiculo(' + elementoVeiculo.veiculo_id + ')"><input type="hidden" id="id_veiculo" value="' + elementoVeiculo.veiculo_id + '"><div class="ui  card centered auto_veiculo" id="cardVeiculos" ><div class="image"><img class="ui small rounded image img_veiculo " id="veiculo1" src="' + /images/ + elementoVeiculo.img_veiculo + '"></div><div class="content ui attached button" style="text-align: center; background-color: gray; "><a class="header">' + elementoVeiculo.marca + '</a><div class="meta"><span style="color:black">' + elementoVeiculo.modelo + '</span></div></div></div></div>';

            });

            html += '<div class="five wide column classVeiculos" id="cardVeiculosNaoCadastrado" onclick="clickVeiculoNaoCadastrado()" ><div class="ui  card" id="cardVeiculos"><div class="image"><img class="ui small rounded image img_veiculo" src="/img/image.png" id="teste"></div><div class="content ui bottom attached button" style="background-color: red; height: 60px !important;"><font style="vertical-align: inherit;"><font style="vertical-align: inherit; color: white; padding-top: 3px;">Não cadastrado </font></font></div></div></div>';
            $("#veiculos").html(html);
            $("#veiculos").show();
            $('#tipo_cancela').val(data.tipo_cancela);

            if (data.tipo_cancela == 2) {
                $("#btnEntrada").css("display", "block");
                $("#btnSaida").css("display", "none");

            } else if (data.tipo_cancela == 3) {
                $("#btnSaida").css("display", "block");
                $("#btnEntrada").css("display", "none");

            }

            //verificação se a passagem é automática ou manual
            if (!$("#checkbox_veiculos").is(':checked')) {
                passagemAutomatica($("#condutor_id").val(), $("#tipo_cancela").val());
                $("#veiculos").empty();

            }

        }
    });
}

function passagemAutomatica(id_condutor, tipo_cancela) {
    $.ajax({
        type: "POST",
        url: "/admin/transitos/ver/cadastro-transito",
        data: { tipo_transito: "automatico", condutor_id: id_condutor, tipo_cancela: tipo_cancela },
        success: function (data) {
            Swal.fire({
                position: 'center',
                type: 'success',
                title: 'Transito autorizado!',
                showConfirmButton: false,
                timer: 1500
            });
            $("#veiculos").hide();
        }
    });
}

//Mostrando os ultimos condutores passado nas cancelas.
function ultimosTransitos() {
    $.getJSON('/admin/transitos/ver/ultimos-transitos', function (data) {
        data.forEach(ultimosTransitos => {
            html += '<tr><td>' + ultimosTransitos.condutor_nome + ' - ' + ultimosTransitos.tipo_transito + '</td></tr>';
        });
        $("#table_condutor_nome").html(html);
    });
    var html = "";
}
function clickVeiculoNaoCadastrado() {
    Swal.fire({
        title: 'Você tem certeza?',
        text: "Você não poderá reverter isso!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim, autorizar!'
    }).then((result) => {
        if (result.value) {
            //Se o campo veiculo não cadastrado for selecionado ele deve ja vim com o veiculo_id 0
            var veiculo_id = 0;
            var condutor_id = $("#condutor_id").val();
            var tipo_cancela = $('#tipo_cancela').val();
            if ((veiculo_id != null || veiculo_id != "") && (condutor_id != null || condutor_id != "") && (tipo_cancela != null || tipo_cancela != "")) {
                if (result.value) {
                    $.ajax({
                        type: "POST",
                        url: "/admin/transitos/ver/cadastro-transito",
                        data: { tipo_transito: "manual", veiculo_id: veiculo_id, condutor_id: condutor_id, tipo_cancela: tipo_cancela },
                        cache: false,
                        success: function (response) {
                            Swal.fire('Transito autorizado!', 'O transito foi autorizado com sucesso.', 'success');
                            // $("#veiculos").remove();

                        }
                    });
                }
            }
        }
    });
}
//switch alert para 
function clickVeiculo(veiculo_id) {
    Swal.fire({
        title: 'Você tem certeza?',
        text: "Você não poderá reverter isso!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim, autorizar!'
    }).then((result) => {
        var veiculo_id_ = $("#veiculo_id").val();
        var condutor_id = $("#condutor_id").val();
        var tipo_cancela = $('#tipo_cancela').val();
        if ((veiculo_id != null || veiculo_id != "") && (condutor_id != null || condutor_id != "") && (tipo_cancela != null || tipo_cancela != "")) {
            if (result.value) {
                $.ajax({
                    type: "POST",
                    url: "/admin/transitos/ver/cadastro-transito",
                    data: { tipo_transito: "manual", veiculo_id: veiculo_id, condutor_id: condutor_id, tipo_cancela: tipo_cancela },
                    cache: false,
                    success: function (response) {
                        Swal.fire(
                            'Transito autorizado!',
                            'O transito foi autorizado com sucesso.',
                            'success'
                        );
                        $("#veiculos").hide();
                    }
                });

            }
        }
    });
}



