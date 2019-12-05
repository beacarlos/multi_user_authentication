
var identifique_se = new Audio('/audio/syscancela-por-favor-identifique-se.mp3');
var seu_cartao_nao_esta_funcionando = new Audio('/audio/syscancela-seu-cartao-nao-esta-funcionando.mp3');
var sistema_nao_esta_funcionando = new Audio('/audio/syscancela-sistema-nao-esta-funcionando.mp3');
$(document).ready(function () {
    pingRasp();
    setInterval(pingRasp, 10000);
    verificandoAudio();

    function sendMessage(data) {
        return new Promise((resolve, reject) => {
            $.ajax({
                method: 'POST',
                url: 'http://admin:gI6TBRMT@10.50.0.110/video/mjpg.cgi?profileid=3',
                success: resolve,
                error: reject,
                data
            });
        });
    }

    $("#myImg2").attr('src', 'http://admin:gI6TBRMT@10.50.0.104/video/mjpg.cgi?profileid=3');
    $("#myImg").attr('src', 'http://admin:5OE1zAL7@10.50.0.104/video/mjpg.cgi?profileid=3');
});

// function botoes() {
//     $.ajax({
//         dataType: 'json',
//         type: 'POST',
//         url: form_action,
//         data: { title: title, details: details }
//     }).done(function (data) {
//         console.log("deu bom!");
//     });
// }
function sendMessage(data) {
    return new Promise((resolve, reject) => {
        $.ajax({
            method: 'POST',
            url: 'http://admin:gI6TBRMT@10.50.0.110/video/mjpg.cgi?profileid=3',
            success: resolve,
            error: reject,
            data
        });
    });
}
function pingRasp() {
    $.ajax({
        type: 'GET',
        url: "/admin/camera/ver",
        success: function (data) {
            console.log(data);
            var status_cancela_entrada = $("#btn_entrada").attr('name');
            var status_cancela_saida = $("#btn_saida").attr('name');

            if (data.entrada == 1) {
                if (status_cancela_entrada != 'online') {
                    $('.status_entrada').html('Status:<button class="positive ui button" id="btn_entrada" name="online" style="margin-left: 5px; padding-left: 120px; padding-right: 120px;">ESTÁ FUNCIONANDO</button>');
                }
            } else {
                if (status_cancela_entrada != 'offline') {
                    $('.status_entrada').html('Status:<button class="negative ui button" id="btn_entrada" name="offline" style="margin-left: 5px; padding-left: 115px; padding-right: 115px;">NÃO ESTÁ FUNCIONANDO</button>');
                }
            }

            if (data.saida == 1) {
                if (status_cancela_saida != 'online') {
                    $('.status_saida').html('Status:<button class="positive ui button" id="btn_saida" name="online" style="margin-left: 5px; padding-left: 120px; padding-right: 120px;">ESTÁ FUNCIONANDO</button>');
                }
            } else {
                if (status_cancela_saida != 'offline') {
                    $('.status_saida').html('Status:<button class="negative ui button" id="btn_saida" name="offline" style="margin-left: 5px; padding-left: 115px; padding-right: 115px;">NÃO ESTÁ FUNCIONANDO</button>');
                }
            }
        }
    });
}
function verificandoAudio() {
    $(".btn_entrada").click(function (e) {
        e.preventDefault();
        var valorID = $(this).val();
        var valorCancelaTipo = $(this).attr('data-cancela_tipo');
        console.log(valorCancelaTipo);
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
        $.ajax({
            type: 'POST',
            url: "/admin/camera/cancelas",
            data: {
                'valorSom': valorID,
                'valorCancela': valorCancelaTipo
            },
            success: function (valorID) {
                console.log("AGORA DEU CERTO...");
            },
            error: function (valorID) {
                console.log("POR GENTILEZA MEU COMPATRIOTA AJEITA ESTA BAGAÇA");
            }
        });
    });
}


