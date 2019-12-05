$(document).ready(function () {
    $('#paginaInicial').addClass('active');
    visualizar();
    graficoEstatistica();

    $.ajax({
        type: "GET",
        url: "/admin/dashboard/ver/mes",
        success: function (data) {
            var series = [0,0,0,0,0,0,0,0,0,0,0,0];
            var aux = 0;
            var tamanho_data = data['consultaTransitoPorPeriodo'].length;

            data['consultaTransitoPorPeriodo'].forEach(mes => {
                for (var index = 0; index < tamanho_data; index++) {
                    aux = (mes.mes) - 1;
                    series[aux] = mes.total;
                }
            });
            graficoEstatistica(series);
        }
    });
});

function visualizar() {
    $.getJSON('/admin/ver', function (data) {
        data.tipo_usuario.forEach(element => {
            if (element.tipo == "Aluno") {
                $("#alunos").html(element.total);
            } else
                if (element.tipo == "Visitante") {
                    $("#visitantes").html(element.total);
                } else
                    if (element.tipo == "Servidor") {
                        $("#administrativo").html(element.total);
                    } else if (element.tipo == "Tercerizado") {
                        $("#tercerizados").html(element.total);
                    }
        });
        $("#carros").html(data.quantidade_carro);
        $("#motos").html(data.quantidade_moto);
        if (data.media != null) {
            $("#tempo_medio").html(data.media);
        }
    });
}



//-------------------------------------- GRÁFICOS --------------------------------//
function graficoEstatistica(series) {
    //grafico de estatísticas
    Highcharts.chart('grafico-vertical', {
        chart: {
            type: 'column',
            backgroundColor: '#F2F2F2'
        },
        exporting: { enabled: false },
        title: {
            text: 'Estatísticas',
        },
        subtitle: {
            text: 'DO ÚLTIMO ANO.'
        },
        colors: ['#CE4436'],
        credits: {
            enabled: false
        },
        xAxis: {
            categories: [
                'Jan',
                'Fev',
                'Mar',
                'Abr',
                'Mai',
                'Jun',
                'Jul',
                'Ago',
                'Set',
                'Out',
                'Nov',
                'Dez'
            ],
            crosshair: true
        },
        yAxis: {
            min: 0,
            max: 100,
            title: {
                text: 'Quantidade de veiculos.'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: 'Veiculos',
            data: series,
            showInLegend: false,
        }]
    });
}


//grafico de trânsito por cursos
Highcharts.chart('grafico-horizontal', {
    chart: {
        type: 'bar',
        backgroundColor: '#F2F2F2'
    },
    title: {
        text: 'Trânsito por cursos'
    },
    exporting: { enabled: false },
    colors: ['#21A4D2'],
    xAxis: {
        categories: ['Ciência da computação', 'Engenharia Ambiental e Sanitária', 'Engenharia de Controle e Automação', 'Engenharia Mecânica', 'Licenciatura em Quimica', 'Tecnico em Automação industrial', 'Técnico em infomática', 'Técnico em meio ambiente', 'Técnico em Redes de Computadores'],
        title: {
            text: null
        }
    },

    yAxis: {
        min: 0,
        title: {
            text: 'Quantidade de transitos',
            align: 'high'
        },
        labels: {
            overflow: 'justify'
        }
    },
    tooltip: {
        valueSuffix: '.'
    },
    plotOptions: {
        bar: {
            dataLabels: {
                enabled: true
            }
        }
    },
    credits: {
        enabled: false
    },
    series: [{
        name: 'Transitos',
        data: [10, 5, 3, 7, 11, 20, 14, 4, 8],
        showInLegend: false,
    }]
});

//grafico de Maiores fluxos
Highcharts.chart('donut', {
    chart: {
        renderTo: 'chart',
        type: 'pie',
        backgroundColor: '#F2F2F2',
    },
    credits: {
        enabled: false
    },
    title: {
        text: 'Maiores Fluxos',

    },
    exporting: { enabled: false },
    plotOptions: {
        pie: {
            shadow: false,
            borderWidth: 0
        }
    },
    colors: ['#F19911', '#CD4436', '#29B766'],
    tooltip: {
        enabled: false
    },
    legend: {
        enabled: true,
        align: 'left',
        layout: 'vertical',
        verticalAlign: 'top',
        x: 70,
        y: 30,
        itemMarginTop: 7,
        itemMarginBottom: 5,
        symbolRadius: 0
    },
    series: [{
        data: [
            {
                name: "Bloco 1",
                y: 23,
            },
            {
                name: "Bloco 2",
                y: 8,
            },
            {
                name: "Administrativo",
                y: 11,
            }
        ],
        size: '170%',
        innerSize: '67%',
        showInLegend: true,
        dataLabels: {
            enabled: false
        }
    }]
});
