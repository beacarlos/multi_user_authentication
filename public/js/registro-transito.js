//Chamando o TOKEN Via ajax
var dataDeInicio;
var dataDeFim;
var table = null;

$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});
//função principal
$(document).ready(function () {

    listarDados();


    //-----------------------------------------------------------------------------------//
    //Gerando tabela de REGISTRO e adicionado as funções e botão de PDF,EXCEL E PRINT   //
    //---------------------------------------------------------------------------------//

    table = $('#tabRegistro').DataTable({
        bServerSide: false,
        bDestroy: true,
        order: [0, "desc"],
        processing: true,
        dom: 'Bfrtip',
        ajax: "/admin/registros/ver",
        //Fazendo a listagem dos seguintes dados
        columns: [


            {
                'data': 'dataDoTransito',
                "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                    $(nTd).html(moment(sData).format('DD/MM/YYYY'));
                }
            },
            { data: 'nome', },
            { data: 'identificacao' },
            { data: 'curos_setor' },
            { data: 'descricao_tipo_transito' },
            { data: 'marca', "defaultContent": "<i>Não possui</i>" },
            { data: 'telefone' },
            { data: 'action', name: 'action', orderable: false, searchable: false }

        ],


        buttons: [


            //Adicionando BOTÃO DE PRINT
            {

                init: function (api, node, config) {
                    $(node).removeClass('dt-button')
                },
                extend: 'print', className: 'ui primary button',
                customize: function (win) {
                    $(win.document.body).find('table').css('text-align', 'center');
                    $(win.document.body)
                        // .css( 'margin', '150 0 0 0' )
                        .prepend(
                            '<img src="https://ifce.edu.br/maracanau/menu/uploads/marcas-campus-maracanau/logo_ifce_maracanau_horizontal_cor.jpg" style="margin: 0 auto; text-align: center; display: block;" />'
                        );

                },
                title: '',
                orientation: '',
                //Determinando quais colunas sairar quando o PRINT for gerado
                exportOptions: {
                    columns: [':visible']
                }
            },


            //Adicionando BOTÃO DE EXCEL
            {
                init: function (api, node, config) {
                    $(node).removeClass('dt-button')
                },
                extend: 'excel', className: 'ui primary button',
                //Determinando quais colunas sairar quando o EXCEL for gerado
                exportOptions: {
                    // columns: [0, 1, 2, 3, 4]
                }
            },
            //Adicionando BOTÃO DE COLVIS selecionar quais colunas sairão da ação que for executada
            {

                init: function (api, node, config) {
                    $(node).removeClass('dt-button')
                },
                text: 'Selecionar columns',
                extend: 'colvis', className: 'ui primary button',

            },


        ],
        columnDefs: [{
            targets: [5],
            visible: false
        }],

        //Traduzindo a Tabela para o PORTUGUÊS
        "bJQueryUI": true,
        "oLanguage": {
            "lengthChange": false,
            "pageLength": 10,
            "sProcessing": "Processando...",
            "sLengthMenu": "Mostrar _MENU_ registros",
            "sZeroRecords": "Não foram encontrados resultados",
            "sInfo": "Mostrando de _START_ até _END_ de _TOTAL_ registros",
            "sInfoEmpty": "Mostrando de 0 até 0 de 0 registros",
            "sInfoFiltered": "",
            "sInfoPostFix": "",
            "sSearch": "Pesquisar: ",
            "sUrl": "",
            "oPaginate": {
                "sFirst": "Primeiro",
                "sPrevious": "Anterior",
                "sNext": "Próximo",
                "sLast": "Último"
            }
        }

    });
    $('#min, #max').keyup(function () {
        table.draw();
    });
    $('#search_dataTables').keyup(function () {
        table.search($(this).val()).draw();
    });
    carregarTipoRegistro();

    $("#tabRegistro_paginate").removeClass('dataTables_paginate');


});


//Função que inicia o DataTable
function listarDados() {
    moment.locale('pt-br');
    //Passando o TOKEN para a tabela
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    //Alert da pesquisa da tabela
    $('button').click(function () {
        var data = table.$('input, select').serialize();
        alert(
            "The following data would have been submitted to the server: \n\n" +
            data.substr(0, 120) + '...'
        );
        return false;
    });
}
//Busca dados para a Datatables
function carregarTipoRegistro() {
    $("#registro_tipo").change(function () {
        //Pegando o valor da input para fazer o select com o tipo de transito.
        var valorTipoTranstio = $(this).val();
        //Destruindo a tabela quando houver mudança na input.
        table.destroy();
        table = $('#tabRegistro').DataTable({
            order: [0, "desc"],
            processing: true,
            serverSide: true,
            dom: 'Bfrtip',
            ajax: {
                url: "/admin/registros/tipo-registro",
                data: {
                    "valorTipoTranstio": valorTipoTranstio
                },
                cache: true,
                type: "POST"
            },
            //Fazendo a listagem dos seguintes dados
            columns: [
                {
                    'data': 'dataDoTransito',
                    "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                        $(nTd).html(moment().subtract(10, 'days').calendar());
                    }
                },
                { data: 'nome', },
                { data: 'identificacao', },
                { data: 'curos_setor', },
                { data: 'descricao_tipo_transito', },
                { data: 'marca', "defaultContent": "<i>Não possui</i>" },

                { data: 'telefone', },

                { data: 'action', name: 'action', orderable: false, searchable: false }
            ],
            buttons: [
                //Adicionando BOTÃO DE EXCEL
                {
                    init: function (api, node, config) {
                        $(node).removeClass('dt-button')
                    },
                    extend: 'excel', className: 'ui primary button',
                    //Determinando quais colunas sairar quando o EXCEL for gerado
                    exportOptions: {
                        // columns: [0, 1, 2, 3, 4]
                    }
                },
                //Adicionando BOTÃO DE PRINT
                {
                    extend: 'print', className: 'ui primary button',
                    customize: function (win) {
                        $(win.document.body).find('table').css('text-align', 'center');
                        $(win.document.body)
                            // .css( 'margin', '150 0 0 0' )
                            .prepend(
                                '<img src="https://ifce.edu.br/maracanau/menu/uploads/marcas-campus-maracanau/logo_ifce_maracanau_horizontal_cor.jpg" style="margin: 0 auto; text-align: center; display: block;" />'
                            );

                    },
                    init: function (api, node, config) {
                        $(node).removeClass('dt-button')
                    },
                    title: '',
                    orientation: '',
                    //Determinando quais colunas sairar quando o PRINT for gerado
                    exportOptions: {
                        columns: [':visible']
                    }
                },
                //Adicionando BOTÃO DE COLVIS selecionar quais colunas sairão da ação que for executada
                {
                    init: function (api, node, config) {
                        $(node).removeClass('dt-button')
                    },
                    extend: 'colvis', className: 'ui primary button',

                },


            ],
            columnDefs: [{
                targets: [5],
                visible: false
            }],

            //Traduzindo a Tabela para o PORTUGUÊS
            "bJQueryUI": true,
            "oLanguage": {
                "lengthChange": false,
                "pageLength": 10,
                "sProcessing": "Processando...",
                "sLengthMenu": "Mostrar _MENU_ registros",
                "sZeroRecords": "Não foram encontrados resultados",
                "sInfo": "Mostrando de _START_ até _END_ de _TOTAL_ registros",
                "sInfoEmpty": "Mostrando de 0 até 0 de 0 registros",
                "sInfoFiltered": "",
                "sInfoPostFix": "",
                "sSearch": "Pesquisar: ",
                "sUrl": "",
                "oPaginate": {
                    "sFirst": "Primeiro",
                    "sPrevious": "Anterior",
                    "sNext": "Próximo",
                    "sLast": "Último"
                }
            }

        });
        $("#tabRegistro_paginate").removeClass('dataTables_paginate');

    });

};


//Dados do condutor e veiculo
function dadosDoCondutor(transito_id, veiculo_id) {
    $('.ui.form#formModalVizualizar').form('clear');
    $.ajax({
        url: "/admin/registros/listar",
        type: "GET",
        data:
        {
            id_transito: transito_id
        },
        dataType: "JSON",
        success: function (elemento) {
            var html = "";
            if (veiculo_id != null) {
                console.log(elemento);
                $(".ui.modal").modal('show');
                $("#imgTransitoModal").attr('src', 'http://bd.maracanau.ifce.edu.br/uploads/image/' + elemento[0]['identificacao'] + '.jpg');
                $("#nomeTransitoModal").val(elemento[0]['nome']);
                $("#matriculaTransitoModal").val(elemento[0]['identificacao']);
                $("#TipoTransitoModal").val(elemento[0]['tipo']);
                $("#cursoSetorTransitoModal").val(elemento[0]['curos_setor']);
                $("#telefoneTransitoModal").val(elemento[0]['telefone']);
                $("#TipoTransitoESModal").val(elemento[0]['descricao_tipo_transito']);
                $("#dataTransitoModal").val(moment(elemento[0]['dataDoTransito']).format('DD/MM/YYYY - HH:MM:SS'));
                $("#placaTransitoModal").val(elemento[0]['placa']);
                $("#marcaTransitoModal").val(elemento[0]['marca']);
                $("#modeloTransitoModal").val(elemento[0]['modelo']);



                html += '<div class="field"><div class="ui card" id="cardFotoVeiculoModal"><div class="image"><img id="imgTransitoVeiculoModal" src="' + /images/ + elemento[0]['img_veiculo'] + '" /></div></div></div> ';
                $("#veiculoTransitoModal").html(html);


            } else {
                console.log(elemento);
                $(".ui.modal").modal('show');
                $("#imgTransitoModal").attr('src', 'http://bd.maracanau.ifce.edu.br/uploads/image/' + elemento[0]['identificacao'] + '.jpg');
                $("#nomeTransitoModal").val(elemento[0]['nome']);
                $("#matriculaTransitoModal").val(elemento[0]['identificacao']);
                $("#TipoTransitoModal").val(elemento[0]['tipo']);
                $("#cursoSetorTransitoModal").val(elemento[0]['curos_setor']);
                $("#telefoneTransitoModal").val(elemento[0]['telefone']);
                $("#TipoTransitoESModal").val(elemento[0]['descricao_tipo_transito']);
                $("#dataTransitoModal").val(moment(elemento[0]['dataDoTransito']).format('DD/MM/YYYY - HH:MM:SS'));
                $("#placaTransitoModal").val("Não possui");
                $("#marcaTransitoModal").val("Não possui");
                $("#modeloTransitoModal").val("Não possui");


                html += '<div class="field"><div class="ui card" id="cardFotoVeiculoModal"><div class="image"><img id="imgTransitoVeiculoModal"  src="/img/image.png" /></div></div></div> ';
                $("#veiculoTransitoModal").html(html);

            }

        },
        error: function () {
            console.log("deu erro");
        }
    });
}

