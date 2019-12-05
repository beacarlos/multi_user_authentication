var typingTimer;
var doneTypingInterval = 1000;
var audioBomDia = new Audio('/audio/bom-dia.mp3');
var audioBoaTarde = new Audio('/audio/boatarde.mp3');
var audioBoaNoite = new Audio('/audio/boanoite.mp3');
var identifique_se = new Audio('/audio/syscancela-por-favor-identifique-se.mp3');
var seu_cartao_nao_esta_funcionando = new Audio('/audio/syscancela-seu-cartao-nao-esta-funcionando.mp3');
var sistema_nao_esta_funcionando = new Audio('/audio/syscancela-sistema-nao-esta-funcionando.mp3');

$(document).ready(function () {
    $(".ui.sidebar").toggleClass("very thin icon");
    $(".asd").toggleClass("marginlefting");
    $(".sidebar z").toggleClass("displaynone");
    $(".ui.accordion").toggleClass("displaynone");
    $(".ui.dropdown.item").toggleClass("displayblock");
    $(".logo").find('img').toggle();
    
    $('#barreira').addClass('active');
    $('.barreiras').addClass('active');
    $('#saida').addClass('active');
    $("#formProd").bind("keyup blur focus submit", function (e) {
        e.preventDefault();
        var expre = /[^\d]/g;
        $(this).val($(this).val().replace(expre, ''));
    });
    
    setInterval(emitirSons, 1000);
    setInterval(emitirMensagem, 1000);
});

$('#numero_cartao').bind('keyup blur focus submit', function () {
    clearTimeout(typingTimer);
    if ($('#numero_cartao').val != '') {
        typingTimer = setTimeout(validandoCondutor, doneTypingInterval);
    }
});

function validandoCondutor() {
    var numero_cartao = $('#numero_cartao').val();
    numero_cartao = numero_cartao.replace(/^0+/, '');

    if (numero_cartao.length > 0 && numero_cartao.length >= 3) {
        $.ajax({
            type: 'POST',
            url: "/admin/transitos/cancelas",
            cache: false,
            data: {
                '_token': $('input[name=_token]').val(),
                'numero_cartao': numero_cartao,
                'cancela': 1
            },
            success: function (data) {
                $('#numero_cartao').val("");
            }
        });
    } else {
        $('#numero_cartao').val("");
    }
}


function emitirMensagem() {
    $.getJSON('/admin/transitos/ver/emitir-som', function (data) {
        var d = new Date;
        var data = new Date(d), hora = data.getHours();
        if (hora <= 11) {
            audioBomDia.play();
        } else if (hora >= 12 && hora <= 18) {
            audioBoaTarde.play();
        } else {
            audioBoaNoite.play();
        }
        
    });
}
function emitirSons() {
    $.getJSON('/admin/camera/emitir-som-saida', function (audio) {
        console.log(audio);
        if (audio == 4) {
            identifique_se.play();
        } else if (audio == 5) {
            sistema_nao_esta_funcionando.play();
        } else if (audio == 6) {
            seu_cartao_nao_esta_funcionando.play();
        }
    });
}