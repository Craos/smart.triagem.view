dhtmlxEvent(window, "load", function () {

    let layout = new dhtmlXLayoutObject({
        parent: document.body,
        pattern: '2E',
        offsets: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        },
        cells: [
            {
                id: 'a',
                text: 'Informações de cadastro',
                header: true,
                height: 170
            },
            {
                id: 'b',
                text: 'Histórico de passagem',
                header: true
            }
        ]
    }), list = layout.cells('a').attachList({
        container: "data_container",
        type: {
            template:"http->./html/veiculo.html",
            height: 'auto'
        }
    }), grid = layout.cells('b').attachGrid();

    grid.setImagePath("./img/grid/");
    grid.setHeader("Data,Horário,Usuário,ID,CNH,Nome,Placa,Bloco,Unidade,Autenticação,Tipo de acesso,Estacionamento,Vaga");
    grid.init();

    let toolbar = layout.attachToolbar({
        icon_path: "./img/toolbar/",
        items: [
            {id: "placa", type: "buttonInput"},
            {id: "sep", type: "separator"},
            {id: "pesquisar", type: "button", img: "pesquisar.png"},
        ],
        onClick: function (id) {
            if (id !== 'pesquisar')
                return;

            let placa = toolbar.getInput("placa").value.toUpperCase();

            layout.cells('a').progressOn();

            $.ajax({
                type: 'GET',
                url: 'http://localhost:6070/pesquisa_veiculo?placa=eq.' + placa,
                dataType: 'json',
                success: function (response) {
                    layout.cells('a').progressOff();

                    list.clearAll();
                    list.add(response[0]);

                    $.ajax({
                        type: 'GET',
                        url: 'http://localhost:6070/passagem?placa=eq.' + placa,
                        dataType: 'json',
                        success: function (response) {
                            grid.clearAll();
                            response.filter(function (item) {

                                grid.addRow(item.id, [
                                    item.filedate,
                                    item.timerg,
                                    item.uidins,
                                    item.id,
                                    item.cnh,
                                    item.nome,
                                    item.placa,
                                    item.bloco,
                                    item.unidade,
                                    item.autenticacao,
                                    item.tipo_acesso,
                                    item.estacionamento,
                                    item.vaga
                                ]);
                            })
                        }
                    }).fail(function (jqXHR) {
                        dhtmlx.alert({
                            title: 'Atenção',
                            type: 'alert-error',
                            text: jqXHR.responseJSON.message
                        });

                    });

                }
            }).fail(function (jqXHR) {
                dhtmlx.alert({
                    title: 'Atenção',
                    type: 'alert-error',
                    text: jqXHR.responseJSON.message
                });
            });

        }
    });
});