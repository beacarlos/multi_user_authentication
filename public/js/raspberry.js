$.ajaxSetup({
  headers: {
    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
  }
});
$(document).ready(function () {
  listarRaspBerry();
  $('#ipDoRasp').mask('0ZZ.0ZZ.0ZZ.0ZZ', {
    translation: {
      'Z': {
        pattern: /[0-9]/, optional: true
      }
    }
  });
  $('#ipDoRasp').mask('099.099.099.099');



});
//Função para listar dados para a Tabela
function listarRaspBerry() {
  //moment biblioteca para converter DATAS
  moment.locale('pt-br');
  //Criando tabela via DataTables
  var table = $('#tabRasp').DataTable({
    processing: true,
    searching: false,
    serverSide: true,
    bLengthChange: false,
    bInfo: false,
    //Rota para onde os dados será mandado.   
    ajax: "/admin/configuracoes/ver",
    //Informando quais dados vão ser listado 
    columns: [
      { data: 'raspberry_id', name: 'raspberry_id' },
      { data: 'nome', name: 'nome' },
      { data: 'ip', name: 'ip' },
      { data: 'tipo_raspberry', name: 'tipo_raspberry' },
      
      { data: 'action', name: 'action', orderable: false, searchable: false }
    ],
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
  return table;
}
//Função para chamar modal onde será Registrado um novo RaspBerry
function adicionarRaspberry(id) {
  console.log(id);
  $('#modalCadastroRasp form')[0].reset();
  $('.dropdown').dropdown('restore defaults');
  save_method = "adicionar";
  $('#adicionarRasp').show();
  $('#btn_limpar').show();
  $('#column_select-tipo').show();
  $('#column_ipRasp').show();
  $('#row_datas').hide();
  $('#column_tipo-view').hide();
  $('#column_ip-view').hide();
  $('#btn_cancelar').hide();
  $('#adicionarRasp').val('Salvar');
  $('input[name=_method').val('POST');
  $('#modalCadastroRasp').modal('show')
  $('#modal-title').text('Adicionar Raspberry');
  $("#formulario_rasp  #nomeRasp, #ipDoRasp ").each(function () {
    $(this).attr("readonly", false);
    $(this).attr("disabled", false);

  });
}

//Função para chamar o modal de editar RaspBerry pegando o ID do dado
function editarRaspberry(id) {
  console.log(id);
  save_method = "editar";
  $('#idRasp').val(id);
  $('#row_datas').show();
  $('#adicionarRasp').show();
  $('#column_select-tipo').show();
  $('#btn_limpar').show();
  $('#column_ip-view').hide();
  $('#column_ipRasp').show();
  $('#column_tipo-view').hide();
  $('#btn_cancelar').hide();
  $('input[name=_method]').val('PATCH');
  $('#modal-title').text('Editar Raspberry');
  $('#adicionarRasp').val('Editar');
  $('#modalCadastroRasp').modal('show')
  $("#formulario_rasp  #nomeRasp, #ipDoRasp ").each(function () {
    $(this).attr("readonly", false);
    $(this).attr("disabled", false);

  });

  $.ajax({
    url: "/admin/configuracoes" + '/' + id + "/editar",
    type: "GET",
    dataType: "JSON",
    success: function (data) {
      $('select#tipoRasp').dropdown('set selected', data.tipo_id_fk );
      $('#nomeRasp').val(data.nome);
      $('#ipDoRasp').val(data.ip);
      $('#data_de_criacao').val(moment(data.data_de_criacao).format('LL'));
      $('#data_atualizacao').val(moment(data.ultima_atualizacao).format('LL'));
      $("#formulario_rasp  #data_de_criacao, #data_atualizacao").each(function () {
        $(this).attr("readonly", true);
        $(this).attr("disabled", true);

      });

    },
    error: function (data) {
      swal({
        title: 'Oops...',
        text: data.message,
        type: 'error',
        timer: '1500'
      })
    }
  });
}
//Função para chamar o modal de editar RaspBerry pegando o ID do dado
function statusRaspBerry(id) {
  save_method = "listar";
  $('#idRasp').val(id);
  $('#row_datas').show();
  $('#modalCadastroRasp').modal('show')
  $('#column_ip-view').show();
  $('#column_tipo-view').show();
  $('#btn_cancelar').show();
  $('#column_select-tipo').hide();
  $('#column_ipRasp').hide();
  $('#adicionarRasp').hide();
  $('#btn_limpar').hide();
  $('#modal-title').text('Dados do Raspberry');
  $('input[name=_method]').val('PATCH');


  $.ajax({
    url: "/admin/configuracoes" + '/' + id + "/listar",
    type: "GET",
    dataType: "JSON",
    success: function (data) {
      $('#nomeRasp').val(data.nome);
      $('#ipDoRasp_view').val(data.ip);
      $('#tipo_rasp_view').val(data.nome_tipo_rasp);
      $('#data_de_criacao').val(moment(data.data_de_criacao).format('LL'));
      $('#data_atualizacao').val(moment(data.ultima_atualizacao).format('LL'));
      $("#formulario_rasp  #data_de_criacao, #data_atualizacao, #nomeRasp, #ipDoRasp_view, #tipo_rasp_view ").each(function () {
        $(this).attr("readonly", true);
        $(this).attr("disabled", true);

      });

    },
    error: function (data) {
      swal({
        title: 'Oops...',
        text: data.message,
        type: 'error',
        timer: '1500'
      })
    }
  });
}

function deletaRaspBerry(id) {
  $('#idRasp').val(id);
  var csrf_token = $('meta[name="csrf-token"]').attr('content');
  swal({
    title: 'Você tem certeza?',
    text: "Você não poderá reverter isso!",
    type: 'warning',
    showCancelButton: true,
    cancelButtonColor: '#d33',
    confirmButtonColor: '#3085d6',
    confirmButtonText: 'Sim, exclua!'
  }).then((result) => {
    if (result.value) {
      $.ajax({
        url: "/admin/configuracoes" + '/' + id + "/apagar",
        type: "POST",
        data: { '_method': 'DELETE', 'csrf-token': csrf_token },
        success: function (data) {
          $('#tabRasp').DataTable().ajax.reload();
          swal({
            title: 'Success!',
            type: 'success',
            timer: '1500'
          })
        },
        error: function (data) {
          swal({
            title: 'Oops...',
            type: 'error',
            timer: '1500'
          })
        }
      });
    }
  });
}
//Função para gerenciar o submit da pagina...
$(function () {
  $('#modalCadastroRasp form').on('submit', function (e) {
    e.preventDefault();
    var id = $('#idRasp').val();
    var url = '';
    //Condição para fazer a verificação para qual função acima o submit vai responder
    if (save_method == 'adicionar') {
      //URL para as ações, caso o submit seja para "novo dados"
      url = "/admin/configuracoes/cadastrar";
    }
    else {
      //URL para informar que o submit vai para a função de EditarRaspBerry
      url = "/admin/configuracoes/atualizar";
    }
    $.ajaxSetup({
      headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
      }
    });
    $.ajax({
      url: url,
      type: "POST",
      data: new FormData($("#modalCadastroRasp form")[0]),
      contentType: false,
      processData: false,
      success: function (data) {
        $('#modalCadastroRasp').modal('hide');
        $('#tabRasp').DataTable().ajax.reload();
        swal({
          title: 'Sucesso!',
          text: data.message,
          type: 'success',
          timer: '1500'
        })
      },
      error: function (data) {
        swal({
          title: 'Oops...',
          text: data.message,
          type: 'error',
          // timer: '1500'
        })
      }
    });

  });
});
