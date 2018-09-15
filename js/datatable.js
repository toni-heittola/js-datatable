// ========================================
// datatable jQuery plug-in
// ========================================
//
// Copyright 2015-2018 Toni Heittola (toni.heittola@gmail.com)
// Released under the MIT license
//
// ========================================
jQuery( document ).ready(function() {
    jQuery('table.datatable').each(function(){
        jQuery(this).datatable();
    });
});

(function ($, window, document, undefined) {
    "use strict";
    var pluginName = 'datatable';
    var pluginVersion = '1.1.0';
    window.datatable_unique_id = 0;

    // Defaults
    var defaults = {
        debug: false
    };

    // Define the commands that can be used in this plugin
    var commands = {
        getRank: getRank,
        updateChart: updateChart
    };

    var Plugin = function (element, options, name) {
        this.init(element, options, name);
    };
    Plugin.prototype = {
        defaults: {
            debug: false,
            rank_mode: 'normal',    // 'normal', 'grouped-muted', 'grouped-empty'
            tag_mode: 'column',     // global, column
            show_chart: false,
            show_toolbar: true,
            show_table_selector: false,
            chart_modes: 'bar',
            chart_default_mode: 'bar',
            table_default_mode: 'show',
            list_separator: ',',
            css: {
                active: 'active'
            },
            animation: {
                duration: 100,
                show_speed: 200,
                hide_speed: 200
            },
            time: {
                valid_formats: [
                    'YYYY-MM-DD HH:mm',
                    'YYYY-MM-DD HH:mm:ss',
                    'YYYY-MM-DD HH:mm:ss.SSS',
                    'YYYY-MM-DD',
                    'YYYY-MM',
                    'YYYY/MM/DD',
                    'MM-DD-YYYY',
                    'MM.DD.YYYY',
                    'DD-MM',

                    'HH:mm',
                    'HH:mm:ss',
                    'HH:mm:ss.SSS'
                ],
                display_formats: {
                    'second': 'hh:mm:ss',
                    'minute': 'hh:mm',
                    'hour': 'hh',
                    'day': 'YYYY-MM-DD',
                    'week': 'll',
                    'month': 'MMM YYYY',
                    'quarter': '[Q]Q - YYYY',
                    'year': 'YYYY'
                }
            },
            table: {
                id_field: 'id',
                row_highlighting: false,

                // bootstrap-table.js specific defaults
                page_list: '[5,10,20,50,all]',
                pagination: true,
                show_header: true,
                show_columns: true,
                show_pagination_switch: true,

                striped: true,
                column_hover: false
            },
            chart: {
                position: 'top'
            },
            bar: {
                height: 240,
                xaxis: {
                    display: true
                },
                yaxis: {
                    display: true,
                    beginatzero: false,
                    label: null,
                    scale: null,
                    gridlines: true
                },
                horizontal_highlights: {
                    enabled: true,
                    data: null,
                    opacity: 0.1,
                    strokeStyle: 'rgba(112, 187, 225 ,1.0)',
                    lineWidth: 2,
                    label: {
                        fillStyle: '#000',
                        fontSize: '12px',
                        font: 'Arial',
                        opacity: 0.2,
                        position: 'bottom-right'
                    }
                },
                horizontal_line: {
                    enabled: false,
                    strokeStyle: 'rgba(112, 187, 225 ,0.5)',
                    lineWidth: 2
                },
                horizontal_indicator_line: {
                    enabled: true,
                    strokeStyle: 'rgba(160,160,160,0.5)',
                    fillStyle: 'rgba(160,160,160,0.2)',
                    lineWidth: 4
                },
                vertical_indicator_line: {
                    enabled: false,
                    strokeStyle: 'rgba(160,160,160,0.5)',
                    lineWidth: 4
                },
                error_bar: {
                    enabled: true,
                    lineWidth: 2.0,
                    tipWidth: null,
                    strokeStyle: null
                },
                colors: {
                    valid: ['active', 'success', 'info', 'warning', 'danger'],
                    default: {
                        border: {
                            normal: 'rgba(233, 144, 2, 0.5)',
                            hover: 'rgba(233, 144, 2, 1)'
                        },
                        bg: {
                            normal: 'rgba(233, 144, 2, 0.2)',
                            hover: 'rgba(233, 144, 2, 0.4)'
                        }
                    },
                    active: {
                        border: {
                            normal: 'rgba(160, 160, 160, 0.5)',
                            hover: 'rgba(160, 160, 160, 1)'
                        },
                        bg: {
                            normal: 'rgba(160, 160, 160, 0.4)',
                            hover: 'rgba(160, 160, 160, 0.6)'
                        }
                    },
                    success: {
                        border: {
                            normal: 'rgba(92, 184, 92, 0.5)',
                            hover: 'rgba(92, 184, 92, 1)'
                        },
                        bg: {
                            normal: 'rgba(92, 184, 92, 0.4)',
                            hover: 'rgba(92, 184, 92, 0.6)'
                        }
                    },
                    info: {
                        border: {
                            normal: 'rgba(112, 187, 225, 0.5)',
                            hover: 'rgba(112, 187, 225, 1)'
                        },
                        bg: {
                            normal: 'rgba(112, 187, 225, 0.4)',
                            hover: 'rgba(112, 187, 225, 0.6)'
                        }
                    },
                    warning: {
                        border: {
                            normal: 'rgba(240, 173, 78, 0.5)',
                            hover: 'rgba(240, 173, 78, 1)'
                        },
                        bg: {
                            normal: 'rgba(240, 173, 78, 0.4)',
                            hover: 'rgba(240, 173, 78, 0.6)'
                        }
                    },
                    danger: {
                        border: {
                            normal: 'rgba(217, 83, 79, 0.5)',
                            hover: 'rgba(217, 83, 79, 1)'
                        },
                        bg: {
                            normal: 'rgba(217, 83, 79, 0.4)',
                            hover: 'rgba(217, 83, 79, 0.6)'
                        }
                    },
                    background: 'rgba(251, 85, 85, 0.8)',
                    datasets: [
                        '#1f77b4',
                        '#aec7e8',
                        '#ff7f0e',
                        '#ffbb78',
                        '#2ca02c',
                        '#98df8a',
                        '#d62728',
                        '#ff9896',
                        '#9467bd',
                        '#c5b0d5',
                        '#8c564b',
                        '#c49c94',
                        '#e377c2',
                        '#f7b6d2',
                        '#7f7f7f',
                        '#c7c7c7',
                        '#bcbd22',
                        '#dbdb8d',
                        '#17becf',
                        '#9edae5'
                    ]
                },
                tooltips: {
                    titleFontSize: 16,
                    bodyFontSize: 12,
                    bodyFontFamily: 'monospace',
                    position: 'average'
                },
                legend: {
                    enabled: false,
                    position: 'top'
                }
            },
            line: {
                height: 240,
                xaxis: {
                    display: true,
                    field: null,
                    sorted: false,
                    timeunit: null,
                    timestepsize: null,
                    gridlines: true
                },
                yaxis: {
                    beginatzero: false,
                    label: null,
                    scale: null,
                    gridlines: true
                },
                fill: false,
                fields: null,
                point: {
                    enabled: true,
                    borderWidth: 1,
                    radius: {
                        normal: 4,
                        hover: 4
                    }
                },
                line: {
                    enabled: true,
                    tension: 0
                },
                vertical_segments: {
                    enabled: true,
                    data: null,
                    opacity: 0.1,
                    label: {
                        fillStyle: '#000',
                        fontSize: '12px',
                        font: 'Arial',
                        opacity: 0.2,
                        position: 'top'
                    }
                },
                horizontal_highlights: {
                    enabled: true,
                    data: null,
                    opacity: 0.1,
                    strokeStyle: 'rgba(112, 187, 225 ,1.0)',
                    lineWidth: 2,
                    label: {
                        fillStyle: '#000',
                        fontSize: '12px',
                        font: 'Arial',
                        opacity: 0.2,
                        position: 'bottom-right'
                    }
                },
                horizontal_line: {
                    enabled: false,
                    strokeStyle: 'rgba(112, 187, 225 ,1.0)',
                    lineWidth: 2
                },
                vertical_indicator_line: {
                    enabled: true,
                    strokeStyle: 'rgba(160,160,160,0.5)',
                    lineWidth: 2
                },
                horizontal_indicator_line: {
                    enabled: true,
                    strokeStyle: 'rgba(160,160,160,0.5)',
                    fillStyle: 'rgba(160,160,160,0.2)',
                    lineWidth: 2
                },
                error_bar: {
                    enabled: false,
                    lineWidth: 1,
                    tipWidth: 0.2,
                    strokeStyle: 'rgba(0,0,0,0.8)'
                },
                interval: {
                    enabled: true,
                    lineWidth: 0.4
                },
                colors: {
                    valid: ['active', 'success', 'info', 'warning', 'danger'],
                    default: {
                        border: {
                            normal: 'rgba(233, 144, 2, 0.5)',
                            hover: 'rgba(233, 144, 2, 1.0)'
                        },
                        bg: {
                            normal: 'rgba(233, 144, 2, 0.5)',
                            hover: 'rgba(233, 144, 2, 1.0)'
                        }
                    },
                    active: {
                        border: {
                            normal: 'rgba(160, 160, 160, 0.6)',
                            hover: 'rgba(160, 160, 160 1.0)'
                        },
                        bg: {
                            normal: 'rgba(160, 160, 160, 0.5)',
                            hover: 'rgba(160, 160, 160 1.0)'
                        }
                    },
                    success: {
                        border: {
                            normal: 'rgba(92, 184, 92, 0.6)',
                            hover: 'rgba(92, 184, 92, 1.0)'
                        },
                        bg: {
                            normal: 'rgba(92, 184, 92, 0.5)',
                            hover: 'rgba(92, 184, 92, 1.0)'
                        }
                    },
                    info: {
                        border: {
                            normal: 'rgba(112, 187, 225, 0.6)',
                            hover: 'rgba(112, 187, 225, 1)'
                        },
                        bg: {
                            normal: 'rgba(112, 187, 225, 0.5)',
                            hover: 'rgba(112, 187, 225, 1.0)'
                        }
                    },
                    warning: {
                        border: {
                            normal: 'rgba(240, 173, 78, 0.6)',
                            hover: 'rgba(240, 173, 78, 1.0)'
                        },
                        bg: {
                            normal: 'rgba(240, 173, 78, 0.5)',
                            hover: 'rgba(240, 173, 78, 1.0)'
                        }
                    },
                    danger: {
                        border: {
                            normal: 'rgba(217, 83, 79, 0.6)',
                            hover: 'rgba(217, 83, 79, 1)'
                        },
                        bg: {
                            normal: 'rgba(217, 83, 79, 0.5)',
                            hover: 'rgba(217, 83, 79, 1.0)'
                        }
                    },
                    background: 'rgba(251, 85, 85, 0.8)',
                    datasets: [
                        '#1f77b4',
                        '#aec7e8',
                        '#ff7f0e',
                        '#ffbb78',
                        '#2ca02c',
                        '#98df8a',
                        '#d62728',
                        '#ff9896',
                        '#9467bd',
                        '#c5b0d5',
                        '#8c564b',
                        '#c49c94',
                        '#e377c2',
                        '#f7b6d2',
                        '#7f7f7f',
                        '#c7c7c7',
                        '#bcbd22',
                        '#dbdb8d',
                        '#17becf',
                        '#9edae5'
                    ]
                },
                tooltips: {
                    titleFontSize: 16,
                    bodyFontSize: 12,
                    bodyFontFamily: 'monospace',
                    position: 'top'
                },
                legend: {
                    enabled: true,
                    position: 'bottom'
                }
            },
            scatter: {
                height: 200,
                point: {
                    borderWidth: 2,
                    radius: {
                        normal: 5,
                        hover: 10
                    }
                },
                vertical_indicator_line: {
                    enabled: false,
                    strokeStyle: 'rgba(0,0,0,0.2)',
                    lineWidth: 4
                },
                horizontal_indicator_line: {
                    enabled: false,
                    strokeStyle: 'rgba(0,0,0,0.2)',
                    fillStyle: 'rgba(0,0,0,0.1)',
                    lineWidth: 4
                },
                error_bar: {
                    enabled: true,
                    lineWidth: 1,
                    tipWidth: 8,
                    strokeStyle: 'rgba(0,0,0,0.05)',
                    fillStyle: 'rgba(0,0,0,0.02)',
                    bounding_box: true
                },
                colors: {
                    valid: ['active', 'success', 'info', 'warning', 'danger'],
                    default: {
                        border: {
                            normal: 'rgba(233,144,2, 0.5)',
                            hover: 'rgba(233,144,2, 1)'
                        },
                        bg: {
                            normal: 'rgba(233,144,2,0.5)',
                            hover: 'rgba(233,144,2,0.8)'
                        }
                    },
                    active: {
                        border: {
                            normal: 'rgba(160, 160, 160, 0.5)',
                            hover: 'rgba(160, 160, 160 1)'
                        },
                        bg: {
                            normal: 'rgba(160, 160, 160, 0.5)',
                            hover: 'rgba(160, 160, 160 0.8)'
                        }
                    },
                    success: {
                        border: {
                            normal: 'rgba(92, 184, 92, 0.5)',
                            hover: 'rgba(92, 184, 92, 1)'
                        },
                        bg: {
                            normal: 'rgba(92, 184, 92, 0.5)',
                            hover: 'rgba(92, 184, 92, 0.8)'
                        }
                    },
                    info: {
                        border: {
                            normal: 'rgba(112, 187, 225, 0.5)',
                            hover: 'rgba(112, 187, 225, 1)'
                        },
                        bg: {
                            normal: 'rgba(112, 187, 225, 0.5)',
                            hover: 'rgba(112, 187, 225, 0.8)'
                        }
                    },
                    warning: {
                        border: {
                            normal: 'rgba(240, 173, 78, 0.5)',
                            hover: 'rgba(240, 173, 78, 1)'
                        },
                        bg: {
                            normal: 'rgba(240, 173, 78, 0.5)',
                            hover: 'rgba(240, 173, 78, 0.8)'
                        }
                    },
                    danger: {
                        border: {
                            normal: 'rgba(217, 83, 79, 0.5)',
                            hover: 'rgba(217, 83, 79, 1)'
                        },
                        bg: {
                            normal: 'rgba(217, 83, 79, 0.5)',
                            hover: 'rgba(217, 83, 79, 0.8)'
                        }
                    },
                    background: 'rgba(251, 85, 85, 0.8)'
                },
                tooltips: {
                    titleFontSize: 18,
                    bodyFontSize: 14
                },
                x: null,
                y: null
            },
            comparison: {
                height: 200,
                sets: null,
                active_set: null,
                a_row: null,
                b_row: null,

                row_id_field: 'name',
                a_color: '#43ac6a',
                b_color: '#f04124',
                error_bar: {
                    enabled: true,
                    lineWidth: 2.0,
                    tipWidth: 8,
                    strokeStyle: 'rgba(0,0,0,0.2)'
                },
                colors: {
                    background: 'rgba(251, 85, 85, 0.8)'
                },
                tooltips: {
                    titleFontSize: 18,
                    bodyFontSize: 14
                }
            },
            element: {
                chart_mode_selector: 'chart_mode_selector',
                table_mode_selector: 'table_mode_selector',
                bar: {
                    div: '#bar_div',
                    canvas: '#bar_canvas'
                },
                line : {
                    div: '#line_div',
                    canvas: '#line_canvas'
                },
                scatter: {
                    div: '#scatter_div',
                    canvas: 'scatter_canvas',
                    selector_x_menu: '#scatter_selector_x_menu',
                    selector_y_menu: '#scatter_selector_y_menu'
                },
                comparison:{
                    div: '#comparison_div',
                    canvas: '#comparison_canvas',

                    selector_set_button: '#comparison_selector_set_button',
                    selector_set_menu: '#comparison_selector_set_menu',

                    selector_a_button: '#comparison_selector_a_button',
                    selector_a_menu: '#comparison_selector_a_menu',

                    selector_b_button: '#comparison_selector_b_button',
                    selector_b_menu: '#comparison_selector_b_menu'
                }
            },
            icon: {
                table: '<span class="glyphicon glyphicon-list-alt"></span>',
                bar: '<span class="glyphicon glyphicon-stats"></span>',
                line: '<span class="glyphicon glyphicon-random"></span>',
                scatter: '<span class="glyphicon glyphicon-th-large"></span>',
                comparison: '<span class="glyphicon glyphicon-align-left"></span>',
                off: '<span class="glyphicon glyphicon-off"></span>',
                caret: '<span class="caret"></span>',
                chartable: '<span class="glyphicon glyphicon-stats text-muted"></span>',
                url: '<span class="glyphicon glyphicon-new-window" aria-hidden="true"></span>',
                ref: '<span class="glyphicon glyphicon-file" aria-hidden="true"></span>',
                anchor: '<span class="glyphicon glyphicon-expand" aria-hidden="true"></span>'
            },
            label: {
                table: '',
                bar: 'Bar',
                line: 'Line',
                scatter: 'Scatter',
                comparison: 'Comparison',
                off: 'Off',
                select_x_axis: 'Select data field for X-axis',
                select_y_axis: 'Select data field for Y-axis',
                select_set: 'Select set',
                select_a_row: 'Select row A',
                select_b_row: 'Select row B'
            },
            button_css:{
                table: 'btn btn-default',
                bar: 'btn btn-info selector-button',
                line: 'btn btn-info selector-button',
                scatter: 'btn btn-info selector-button',
                comparison: 'btn btn-info selector-button',
                off: 'btn btn-default selector-button'
            },
            tags: {
                css: [
                        'label label-tag label-tag1',
                        'label label-tag label-tag2',
                        'label label-tag label-tag3',
                        'label label-tag label-tag4',
                        'label label-tag label-tag5',
                        'label label-tag label-tag6',
                        'label label-tag label-tag7',
                        'label label-tag label-tag8',
                        'label label-tag label-tag9',
                        'label label-tag label-tag10',
                        'label label-tag label-tag11',
                        'label label-tag label-tag12',
                        'label label-tag label-tag13',
                        'label label-tag label-tag14',
                        'label label-tag label-tag15',
                        'label label-tag label-primary',
                        'label label-tag label-success',
                        'label label-tag label-info',
                        'label label-tag label-warning',
                        'label label-tag label-danger',
                        'label label-tag label-tag-default',
                        'label label-tag label-tag-default',
                        'label label-tag label-tag-default',
                        'label label-tag label-tag-default',
                        'label label-tag label-tag-default',
                        'label label-tag label-tag-default',
                        'label label-tag label-tag-default',
                        'label label-tag label-tag-default',
                        'label label-tag label-tag-default',
                        'label label-tag label-tag-default',
                        'label label-tag label-tag-default',
                        'label label-tag label-tag-default',
                        'label label-tag label-tag-default',
                        'label label-tag label-tag-default',
                        'label label-tag label-tag-default',
                        'label label-tag label-tag-default',
                        'label label-tag label-tag-default',
                        'label label-tag label-tag-default',
                        'label label-tag label-tag-default',
                        'label label-tag label-tag-default',
                        'label label-tag label-tag-default',
                        'label label-tag label-default',
                        'label label-tag label-default',
                        'label label-tag label-default',
                        'label label-tag label-default',
                        'label label-tag label-tag-default'
                    ]
            },
            inline_chart: {
                height: 35,
                max_width: 200,
                colors: {
                    default: '#cdcdcd',
                    on: '#008000',
                    off: '#ff514f',
                    positive: '#008000',
                    negative: '#ff514f',
                    equal: '#cdcdcd'
                },
                value_indicator:{
                    html: {
                        css: 'small glyphicon glyphicon-stop'
                    },
                    svg: {
                        type: 'rect',
                        size: 10
                    },
                    data: {
                        binarizationThreshold: 0.0
                    },
                    color: {
                        default: '#cdcdcd',
                        on: '#008000',
                        off: '#ff514f',
                        positive: 'rgba(0, 128, 0, 0.5)',
                        negative: 'rgba(255, 0, 0, 0.5)',
                        equal: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                bar_horizontal:{
                    colors: [
                        "#5cb85c",
                        "#5bc0de",
                        "#f0ad4e",
                        "#d9534f"
                    ]
                },
                bar_vertical: {
                    item_width: 6,
                    hline: {
                        enabled: false,
                        values: null,
                        colors: [
                            'rgba(0, 0, 0, 0.6)'
                        ],
                        width: 0.5
                    },
                    colors:{
                        default: 'rgba(220, 220, 220, 1.0)'
                    },
                    data:{
                        borderWidth: 1,
                        borderColor: 'rgba(160, 160, 160, 1.0)'
                    },
                    options:{
                        responsive: false,
                        maintainAspectRatio: false,
                        legend: {
                            display: false
                        },
                        tooltips:{
                            enabled: true,
                            mode: 'nearest',
                            position: 'line_centered_top',
                            displayColors: false,
                            cornerRadius: 0,
                            caretSize: 0,
                            caretPadding: 0,
                            yPadding: 1,
                            xPadding: 1,
                            titleFontSize: 0,
                            titleSpacing: 0,
                            titleMarginBottom: 0,
                            bodyFontSize: 11,
                            bodySpacing: 0,
                            footerSpacing: 0,
                            footerMarginTop: 0,
                            intersect: false
                        },
                        animation:{
                            duration: 0,
                            animateScale: true
                        },
                        scales: {
                            y_axes_maximize: true,
                            y_axes_begin_at_zero: true,
                            yAxes: [
                                {
                                    display: false,
                                    type: 'linear',
                                    ticks: {}
                                }
                            ],
                            xAxes: [
                                {
                                    display: false,
                                    barThickness : 8
                                }
                            ]
                        }
                    }
                },
                bar_vertical_tristate: {
                    item_width: 6,
                    colors:{
                        positive: 'rgba(0, 128, 0, 0.5)',
                        negative: 'rgba(255, 0, 0, 0.5)',
                        equal: 'rgba(0, 0, 0, 0.5)'
                    },
                    data:{
                        borderWidth: 0,
                        binarizeValues: true,
                        binarizationThreshold: 0.0,
                    },
                    options:{
                        responsive: false,
                        maintainAspectRatio: false,
                        legend: {
                            display: false
                        },
                        tooltips:{
                            enabled: false,
                            mode: 'nearest',
                            position: 'line_centered_top',
                            displayColors: false,
                            cornerRadius: 0,
                            caretSize: 0,
                            caretPadding: 0,
                            yPadding: 1,
                            xPadding: 1,
                            titleFontSize: 0,
                            titleSpacing: 0,
                            titleMarginBottom: 0,
                            bodyFontSize: 11,
                            bodySpacing: 0,
                            footerSpacing: 0,
                            footerMarginTop: 0,
                            intersect: false
                        },
                        animation:{
                            duration: 0,
                            animateScale: true
                        },
                        scales: {
                            y_axes_maximize: true,
                            y_axes_begin_at_zero: true,
                            yAxes: [
                                {
                                    display: false,
                                    type: 'linear',
                                    ticks: {}
                                }
                            ],
                            xAxes: [
                                {
                                    display: false,
                                    barThickness : 8,
                                    ticks: {}
                                }
                            ]
                        }
                    }
                },
                line: {
                    item_width: 6,
                    hline: {
                        enabled: false,
                        values: null,
                        colors: [
                            'rgba(0, 0, 0, 0.6)'
                        ],
                        width: 0.5
                    },
                    data: {
                        borderWidth: 1,
                        borderColor: 'rgba(160, 160, 160, 1.0)',
                        pointRadius: 1,
                        pointBorderWidth: 0,
                        pointBackgroundColor: '#000',
                        backgroundColor: 'rgba(220, 220, 220, 1.0)',
                        lineTension: 0,
                        showLine: true
                    },
                    options:{
                        responsive: false,
                        maintainAspectRatio: false,
                        legend: {
                            display: false
                        },
                        tooltips:{
                            enabled: true,
                            mode: 'nearest',
                            intersect: false,
                            position: 'line_centered_top',

                            cornerRadius: 0,
                            caretSize: 0,
                            caretPadding: 0,
                            yPadding: 1,
                            xPadding: 1,
                            titleFontSize: 0,
                            titleSpacing: 0,
                            titleMarginBottom: 0,
                            titleFontColor: '#FFF',
                            bodyFontColor: '#FFF',
                            footerFontColor: '#FFF',
                            backgroundColor: 'rgba(0,0,0,0.3)',
                            bodyFontSize: 11,
                            bodySpacing: 0,
                            footerSpacing: 0,
                            footerMarginTop: 0,
                            displayColors: false
                        },
                        animation:{
                            duration: 0,
                            animateScale: false
                        },
                        responsiveAnimationDuration: 0,
                        scales: {
                            y_axes_maximize: true,
                            y_axes_begin_at_zero: true,
                            yAxes: [
                                {
                                    display: false,
                                    type: 'linear',
                                    ticks: {}
                                }
                            ],
                            xAxes: [
                                {
                                    display: false,
                                    ticks: {}
                                }
                            ]
                        }
                    }
                },
                line_steps: {
                    item_width: 6,
                    hline: {
                        enabled: false,
                        values: null,
                        colors: [
                            'rgba(0, 0, 0, 0.6)'
                        ],
                        width: 0.5
                    },
                    data: {
                        borderWidth: 1,
                        borderColor: 'rgba(160, 160, 160, 1.0)',
                        pointRadius: 0,
                        pointBorderWidth: 0,
                        pointBackgroundColor: '#000',
                        backgroundColor: 'rgba(220, 220, 220, 1.0)',
                        steppedLine: true,
                        lineTension: 0,
                        showLine: true
                    },
                    options:{
                        responsive: false,
                        maintainAspectRatio: false,
                        legend: {
                            display: false
                        },
                        tooltips:{
                            enabled: true,
                            mode: 'nearest',
                            position: 'line_centered_top',
                            displayColors: false,
                            cornerRadius: 0,
                            caretSize: 0,
                            caretPadding: 0,
                            yPadding: 1,
                            xPadding: 1,
                            titleFontSize: 0,
                            titleSpacing: 0,
                            titleMarginBottom: 0,
                            bodyFontSize: 11,
                            bodySpacing: 0,
                            footerSpacing: 0,
                            footerMarginTop: 0,
                            intersect: false
                        },
                        animation:{
                            duration: 0,
                            animateScale: true
                        },
                        scales: {
                            y_axes_maximize: true,
                            y_axes_begin_at_zero: true,
                            x_axes_show_last: true,
                            x_axes_offset_last: 1.0,
                            yAxes: [
                                {
                                    display: false,
                                    type: 'linear',
                                    ticks: {}
                                }
                            ],
                            xAxes: [
                                {
                                    display: false,
                                    ticks: {}
                                }
                            ]
                        }
                    }
                }
            }
        },
        init: function (element, options, name) {
            var self = this;

            this.name = name;                                             // Name of the plugin
            this.element = element;                                       // The DOM element that called the plugin
            this.$element = $(element);                                   // The DOM element that called the plugin inside jQuery object

            $(element).addClass(this.name);                               // Add plugin name as class

            // Take unique id
            this.uniqueId = window.datatable_unique_id;
            window.datatable_unique_id += 1; // increase id counter

            // Get current options
            this.initOptions(options);

            // Initialization flag
            this.rank_init = true;
            this.comparison_init = true;

            this.table_rank = [];

            // Chart variables
            this.chart_update = false;
            this.chart_init = true;

            this.bar_chart = null;
            this.scatter_chart = null;
            this.comparison_chart = null;
            this.line_chart = null;
            this.line_chart_data = null;

            this.chart_mode = this.options.chart_default_mode;
            this.table_mode = this.options.table_default_mode;

            this.hline_value = [];
            this.hline_index = [];
            this.hline_color = [];

            this.field_meta = [];

            this.log(this.name + '::init');

            // Make sure unique row id are assigned
            if(typeof $(this.element).data('id-field') !== 'undefined'){
                $(this.element).data('unique-id', $(this.element).data('id-field'));
            }

            // Handle ranking
            var th_rank_element = $(this.element).find('thead tr th[data-rank="true"]');
            if(th_rank_element){
                if(this.options.rank_mode.startsWith('grouped')){
                    // Expose datatable rank generation for bootstrap-table.js
                    $(th_rank_element).attr('data-formatter','runningFormatterGrouped'+this.uniqueId);
                    window['runningFormatterGrouped'+this.uniqueId] = function (value, row, index){
                        return $(self.element).datatable('getRank', index);
                    }

                }else if(this.options.rank_mode == 'normal'){
                    $(th_rank_element).attr('data-formatter','runningFormatter');
                }
            }

            // Add default sorter for columns marked sortable
            $(this.element).find('thead tr th[data-sortable="true"]').each(function(){
                window['valueSorter'+self.uniqueId] = function (a, b){
                    return self.valueSorter(a, b, 'asc');
                };
                $(this).attr('data-sorter', 'valueSorter'+self.uniqueId);
            });

            // Add default sorter for columns marked sortable
            $(this.element).find('thead tr th[data-reversed="true"]').each(function(){
                window['valueSorterReverse'+self.uniqueId] = function (a, b){
                    return self.valueSorter(a, b, 'desc');
                };
                $(this).attr('data-sorter', 'valueSorterReverse'+self.uniqueId);
            });

            // Add chartable icon for columns marked chartable
            $(this.element).find('thead tr th[data-chartable="true"]').each(function(){
                $(this).append(' '+self.options.icon.chartable);
            });

            // Initialize value formatters for columns.
            this.initValueFormatters();

            // Add new chart types and tooltip positioners.
            this.extendChartjsLibrary();

            // Add toolbar
            if(this.options.show_chart){
                this.addToolbar();
            }

            // Event handlers
            $(element).on('post-init.datatable', function(e, data) {
                // Datatable is ready to initialize bootstrap table
                self.initBootstrapTable();
            });
            $(element).on('post-body.bs.table', function (e, data) {
                self.chart_mode = $('#'+self.options.element.chart_mode_selector+' .active').first().data('mode');
                self.updateVisualizationVisibility(self.chart_mode);

                $('#'+self.options.element.table_mode_selector).each(function(){
                    if($(this).hasClass('active')){
                        self.table_mode = 'show';
                    }else{
                        self.table_mode = 'hide';
                    }
                    self.updateTableVisibility(self.table_mode);
                    return false;
                });

                if(self.options.rank_mode.startsWith('grouped')){
                    if(self.rank_init){
                        setTimeout(function(){
                            self.updateRank();
                            self.rank_init = false;
                        }, 100);
                    }
                }

                if(self.options.chart_modes.indexOf('comparison') > -1){
                    if(self.comparison_init){
                        setTimeout(function(){
                            self.initComparison();
                        }, 100);
                    }
                }

                if (self.chart_update || self.chart_init){
                    if(self.chart_init){
                        setTimeout(function(){
                            self.updateChart();
                            self.chart_init = false;
                        }, 100);
                    }else{
                        self.updateChart();
                    }
                    self.chart_update = false;
                }

                // Activate bootstrap tooltips for generated content.
                $(element).find('[data-toggle="tooltip"]').tooltip({html:true});

                // Make inline charts
                $(element).find('.datatable-inline-bar-vertical').each(function(){
                    var data = self.parseDataList($(this).data('value'));
                    $(this).attr("width", data.length * (self.options.inline_chart.bar_vertical.item_width + 3) );
                    $(this).attr("height", self.options.inline_chart.height);
                    var values = [];
                    var labels = [];
                    var bg_colors = [];
                    var min_y_value = Infinity;
                    var max_y_value = -Infinity;
                    for (var i = 0; i < data.length; i++) {
                        values.push(parseFloat(data[i]['y_value']));
                        labels.push(i);
                        if(data[i]['color']){
                            bg_colors.push(data[i]['color']);
                        }else{
                            bg_colors.push(self.options.inline_chart.bar_vertical.colors.default);
                        }

                        if(data[i]['y_value'] > max_y_value){
                            max_y_value = data[i]['y_value'];
                        }

                        if(data[i]['y_value'] < min_y_value){
                            min_y_value = data[i]['y_value'];
                        }
                    }
                    var hline = $.extend(true, {}, self.options.inline_chart.bar_vertical.hline, {
                        enabled: false,
                        values: []
                    });
                    var options = self.options.inline_chart.bar_vertical.options;
                    if(self.options.inline_chart.bar_vertical.options.scales.y_axes_maximize) {
                        if (max_y_value > 0 && min_y_value < 0) {
                            hline.enabled = true;
                            hline.values.push(0);
                            options.scales.yAxes[0].ticks.min = min_y_value;
                            options.scales.yAxes[0].ticks.max = max_y_value;
                        }

                        if(self.options.inline_chart.bar_vertical.options.scales.y_axes_begin_at_zero) {
                            if(max_y_value > 0 && min_y_value > 0){
                                options.scales.yAxes[0].ticks.min = 0;
                                options.scales.yAxes[0].ticks.max = max_y_value;

                            }else if(max_y_value < 0 && min_y_value < 0){
                                options.scales.yAxes[0].ticks.min = min_y_value;
                                options.scales.yAxes[0].ticks.max = 0;
                            }

                        }else{
                            options.scales.yAxes[0].ticks.min = min_y_value;
                            options.scales.yAxes[0].ticks.max = max_y_value;
                        }
                    }

                    var inlineChart = new Chart(this, {
                        type: 'barWithLine',
                        data: {
                            labels: labels,
                            datasets: [
                                $.extend(true, {}, self.options.inline_chart.bar_vertical.data, {
                                    data: values,
                                    backgroundColor: bg_colors
                                })
                            ],
                            hline: hline
                        },
                        options: options
                    });
                });
                $(element).find('.datatable-inline-bar-vertical-tristate').each(function(){
                    var data = self.parseDataList($(this).data('value'));
                    $(this).attr("width", data.length * (self.options.inline_chart.bar_vertical.item_width + 3) );
                    $(this).attr("height", self.options.inline_chart.height);

                    var values = [];
                    var values_ = [];
                    var labels = [];
                    var bg_colors = [];
                    var min_y_value = Infinity;
                    var max_y_value = -Infinity;
                    for (var i = 0; i < data.length; i++) {
                        var value = parseFloat(data[i]['y_value']);
                        if(self.options.inline_chart.bar_vertical_tristate.data.binarizeValues){
                            var value_ = null;
                            var label = null;

                            if(value > self.options.inline_chart.bar_vertical_tristate.data.binarizationThreshold){
                                value = 1;
                                label = 'positive';
                            }else if(value < self.options.inline_chart.bar_vertical_tristate.data.binarizationThreshold){
                                value = -1;
                                label = 'negative';
                            }else{
                                value = 0.5;
                                value_ = -0.5;
                                label = 'equal';
                            }

                            values.push(value);
                            values_.push(value_);
                            labels.push(label);

                            if(value == 0.5){
                                bg_colors.push(self.options.inline_chart.bar_vertical_tristate.colors.equal);
                            }else if(value > 0){
                                bg_colors.push(self.options.inline_chart.bar_vertical_tristate.colors.positive);
                            }else if(value < 0){
                                bg_colors.push(self.options.inline_chart.bar_vertical_tristate.colors.negative);
                            }

                        }else{
                            values.push(value);

                            if(value == 0){
                                bg_colors.push(self.options.inline_chart.bar_vertical_tristate.colors.equal);
                            }else if(value > 0){
                                bg_colors.push(self.options.inline_chart.bar_vertical_tristate.colors.positive);
                            }else if(value < 0){
                                bg_colors.push(self.options.inline_chart.bar_vertical_tristate.colors.negative);
                            }
                            labels.push(i);
                        }

                        if(value > max_y_value){
                            max_y_value = value;
                        }
                        if(value < min_y_value){
                            min_y_value = value;
                        }
                    }

                    if(self.options.inline_chart.bar_vertical_tristate.data.binarizeValues){
                        min_y_value = -1;
                        max_y_value = 1;
                    }

                    var options = self.options.inline_chart.bar_vertical_tristate.options;
                    if(self.options.inline_chart.bar_vertical_tristate.options.scales.y_axes_maximize) {
                        if (max_y_value > 0 && min_y_value < 0) {
                            options.scales.yAxes[0].ticks.min = min_y_value;
                            options.scales.yAxes[0].ticks.max = max_y_value;
                        }

                        if(self.options.inline_chart.bar_vertical_tristate.options.scales.y_axes_begin_at_zero) {
                            if(max_y_value > 0 && min_y_value > 0){
                                options.scales.yAxes[0].ticks.min = 0;
                                options.scales.yAxes[0].ticks.max = max_y_value;

                            }else if(max_y_value < 0 && min_y_value < 0){
                                options.scales.yAxes[0].ticks.min = min_y_value;
                                options.scales.yAxes[0].ticks.max = 0;
                            }
                        }else{
                            options.scales.yAxes[0].ticks.min = min_y_value;
                            options.scales.yAxes[0].ticks.max = max_y_value;
                        }
                    }

                    var datasets = [];
                    if(values_.length){
                        datasets = [
                            $.extend(true, {}, self.options.inline_chart.bar_vertical_tristate.data, {
                                data: values,
                                backgroundColor: bg_colors
                            }),
                            $.extend(true, {}, self.options.inline_chart.bar_vertical_tristate.data, {
                                data: values_,
                                backgroundColor: bg_colors
                            })
                        ];
                        options.scales.yAxes[0].stacked = true;
                        options.scales.xAxes[0].stacked = true;

                    }else{
                        datasets = [
                            $.extend(true, {}, self.options.inline_chart.bar_vertical_tristate.data, {
                                data: values,
                                backgroundColor: bg_colors
                            })
                        ]
                    }

                    var inlineChart = new Chart(this, {
                        type: 'bar',
                        data: {
                            labels: labels,
                            datasets: datasets
                        },
                        options: options
                    });
                });
                $(element).find('.datatable-inline-line').each(function(){
                    $(this).attr("height", self.options.inline_chart.height);
                    var data = self.parseDataList($(this).data('value'));
                    var char_data = [];
                    var labels = [];

                    // Detect in what format the data is given
                    var point_format = true;
                    var min_x_value = Infinity;
                    var max_x_value = -Infinity;
                    var min_y_value = Infinity;
                    var max_y_value = -Infinity;

                    for (var i = 0; i < data.length; i++) {
                        if( data[i]['x_value'] === null ){
                            point_format = false;
                        }else{
                            if(data[i]['x_value'] < min_x_value){
                                min_x_value = data[i]['x_value'];
                            }
                            if(data[i]['x_value'] > max_x_value){
                                max_x_value = data[i]['x_value'];
                            }
                        }

                        if(data[i]['y_value'] > max_y_value){
                            max_y_value = data[i]['y_value'];
                        }
                        if(data[i]['y_value'] < min_y_value){
                            min_y_value = data[i]['y_value'];
                        }
                    }

                    var hline = $.extend(true, {}, self.options.inline_chart.line.hline, {
                        enabled: false,
                        values: []
                    });

                    var options = self.options.inline_chart.line.options;

                    // Handle y-axis
                    if(self.options.inline_chart.line.options.scales.y_axes_maximize) {
                        if (max_y_value > 0 && min_y_value < 0) {
                            hline.enabled = true;
                            hline.values.push(0);
                            options.scales.yAxes[0].ticks.min = min_y_value;
                            options.scales.yAxes[0].ticks.max = max_y_value;
                        }

                        if(self.options.inline_chart.line.options.scales.y_axes_begin_at_zero) {
                            if(max_y_value > 0 && min_y_value > 0){
                                options.scales.yAxes[0].ticks.min = 0;
                                options.scales.yAxes[0].ticks.max = max_y_value;

                            }else if(max_y_value < 0 && min_y_value < 0){
                                options.scales.yAxes[0].ticks.min = min_y_value;
                                options.scales.yAxes[0].ticks.max = 0;
                            }
                        }else{
                            options.scales.yAxes[0].ticks.min = min_y_value;
                            options.scales.yAxes[0].ticks.max = max_y_value;
                        }
                    }

                    // Maximize x-axis
                    options.scales.xAxes[0].ticks.min = min_x_value;
                    options.scales.xAxes[0].ticks.max = max_x_value;

                    if(point_format){
                        // Scatter plot

                        // Sort data along x-axis
                        data.sort(function(a, b) {
                            return parseFloat(a.x_value) - parseFloat(b.x_value);
                        });

                        // Create data structure with points
                        for (var i = 0; i < data.length; i++) {
                            char_data.push({
                                x: data[i]['x_value'],
                                y: data[i]['y_value']
                            });
                            labels.push(data[i]['x_value']);
                        }
                        // Set canvas width
                        var width = Math.abs(max_x_value-min_x_value) * (self.options.inline_chart.line.item_width + 1);
                        if(width > self.options.inline_chart.max_width){
                            width = self.options.inline_chart.max_width;
                        }
                        $(this).attr("width", width);

                        var inlineChart = new Chart(this, {
                            type: 'scatterWithLine',
                            data: {
                                datasets: [
                                    $.extend(true, {}, self.options.inline_chart.line.data, {data: char_data})
                                ],
                                hline: hline
                            },
                            options: options
                        });

                    }else{
                        // Set canvas width
                        var width = data.length * (self.options.inline_chart.line.item_width + 1);
                        if(width > self.options.inline_chart.max_width){
                            width = self.options.inline_chart.max_width;
                        }
                        $(this).attr("width", width);

                        // Evenly spaced points
                        for (var i = 0; i < data.length; i++) {
                            var value = parseFloat(data[i]['y_value']);
                            char_data.push(value);
                            labels.push(i);
                        }

                        var inlineChart = new Chart(this, {
                            type: 'lineWithLine',
                            data: {
                                labels: labels,
                                datasets: [
                                    $.extend(true, {}, self.options.inline_chart.line.data, {
                                        data: char_data
                                    })
                                ],
                                hline: hline
                            },
                            options: options
                        });
                    }

                });
                $(element).find('.datatable-inline-line-steps').each(function(){
                    $(this).attr("height", self.options.inline_chart.height);
                    var data = self.parseDataList($(this).data('value'));
                    var char_data = [];
                    var labels = [];

                    // Detect in what format the data is given
                    var point_format = true;
                    var min_x_value = Infinity;
                    var max_x_value = -Infinity;
                    var min_y_value = Infinity;
                    var max_y_value = -Infinity;

                    for (var i = 0; i < data.length; i++) {
                        if( data[i]['x_value'] === null ){
                            point_format = false;
                        }else{
                            if(data[i]['x_value'] < min_x_value){
                                min_x_value = data[i]['x_value'];
                            }
                            if(data[i]['x_value'] > max_x_value){
                                max_x_value = data[i]['x_value'];
                            }
                        }

                        if(data[i]['y_value'] > max_y_value){
                            max_y_value = data[i]['y_value'];
                        }
                        if(data[i]['y_value'] < min_y_value){
                            min_y_value = data[i]['y_value'];
                        }
                    }

                    var hline = $.extend(true, {}, self.options.inline_chart.line_steps.hline, {
                        enabled: false,
                        values: []
                    });
                    var options = self.options.inline_chart.line_steps.options;

                    // Handle y-axis
                    if(self.options.inline_chart.line_steps.options.scales.y_axes_maximize) {
                        if (max_y_value > 0 && min_y_value < 0) {
                            hline.enabled = true;
                            hline.values.push(0);
                            options.scales.yAxes[0].ticks.min = min_y_value;
                            options.scales.yAxes[0].ticks.max = max_y_value;
                        }

                        if(self.options.inline_chart.line_steps.options.scales.y_axes_begin_at_zero) {
                            if(max_y_value > 0 && min_y_value > 0){
                                options.scales.yAxes[0].ticks.min = 0;
                                options.scales.yAxes[0].ticks.max = max_y_value;

                            }else if(max_y_value < 0 && min_y_value < 0){
                                options.scales.yAxes[0].ticks.min = min_y_value;
                                options.scales.yAxes[0].ticks.max = 0;
                            }
                        }else{
                            options.scales.yAxes[0].ticks.min = min_y_value;
                            options.scales.yAxes[0].ticks.max = max_y_value;
                        }
                    }
                    // Maximize x-axis
                    options.scales.xAxes[0].ticks.min = min_x_value;
                    options.scales.xAxes[0].ticks.max = max_x_value;

                    if(point_format){
                        // Scatter plot

                        // Sort data along x-axis
                        data.sort(function(a, b) {
                            return parseFloat(a.x_value) - parseFloat(b.x_value);
                        });

                        // Create data structure with points
                        for (var i = 0; i < data.length; i++) {
                            char_data.push({
                                x: data[i]['x_value'],
                                y: data[i]['y_value']
                            });
                            labels.push(data[i]['x_value']);
                        }
                        if(self.options.inline_chart.line_steps.options.scales.x_axes_show_last) {
                            max_x_value = max_x_value + self.options.inline_chart.line_steps.options.scales.x_axes_offset_last;
                            char_data.push({
                                x: max_x_value,
                                y: data[data.length - 1]['y_value']
                            });
                            labels.push(data[data.length - 1]['x_value']);
                            // Maximize x-axis
                            options.scales.xAxes[0].ticks.min = min_x_value;
                            options.scales.xAxes[0].ticks.max = max_x_value;
                        }

                        // Set canvas width
                        var width = Math.abs(max_x_value-min_x_value) * (self.options.inline_chart.line_steps.item_width + 1);
                        if(width > self.options.inline_chart.max_width){
                            width = self.options.inline_chart.max_width;
                        }
                        $(this).attr("width", width);

                        var inlineChart = new Chart(this, {
                            type: 'scatterWithLine',
                            data: {
                                datasets: [
                                    $.extend(true, {}, self.options.inline_chart.line_steps.data, {data: char_data})
                                ],
                                hline: hline
                            },
                            options: options
                        });

                    }else{
                        // Set canvas width
                        var width = (data.length+1) * (self.options.inline_chart.line_steps.item_width + 1);
                        if(width > self.options.inline_chart.max_width){
                            width = self.options.inline_chart.max_width;
                        }
                        $(this).attr("width", width);

                        // Evenly spaced points
                        for (var i = 0; i < data.length; i++) {
                            var value = parseFloat(data[i]['y_value']);
                            char_data.push(value);
                            labels.push(i);
                        }
                        if(self.options.inline_chart.line_steps.options.scales.x_axes_show_last){
                            char_data.push(value);
                            labels.push(data.length);

                            // Maximize x-axis
                            options.scales.xAxes[0].ticks.min = min_x_value;
                            options.scales.xAxes[0].ticks.max = max_x_value+1;
                        }

                        var inlineChart = new Chart(this, {
                            type: 'lineWithLine',
                            data: {
                                labels: labels,
                                datasets: [
                                    $.extend(true, {}, self.options.inline_chart.line_steps.data, {
                                        data: char_data
                                    })
                                ],
                                hline: hline
                            },
                            options: options
                        });
                    }
                });

                if(self.options.table.column_hover){
                    $(element).find('td').hover(function() {
                        $(this).parents('table').find('tr td').removeClass('hover').removeClass('row-hover');
                        $(this).parents('table').find('tr th').removeClass('hover');

                        $(this).parents('table').find('tr td:nth-child('+($(this).index()+1)+')').addClass('hover');
                        $(this).parents('table').find('tr th:nth-child('+($(this).index()+1)+')').addClass('hover');
                    });
                }

                // Add table row hover
                $(element).find('tr').hover(function() {
                    // Bar chart
                    if(self.bar_chart !== null){
                        // Hide all tooltips
                        self.resetChartTooltip(self.bar_chart, 0);

                        // Get index
                        var index = $(this).index();
                        var table_options = $(self.element).bootstrapTable('getOptions');
                        if(table_options.pagination){
                            index+= table_options.pageSize * (table_options.pageNumber -1);
                        }

                        // Open corresponding tooltip
                        for(var dataset_id=0; dataset_id < self.bar_chart.chart.data.datasets.length; dataset_id++){
                            self.openChartTooltip(self.bar_chart, dataset_id, index);
                        }
                    }

                    // Scatter chart
                    if(self.scatter_chart !== null){
                        // Hide all tooltips
                        self.resetChartTooltip(self.scatter_chart, 0);

                        // Get index
                        var index = $(this).index();
                        var table_options = $(self.element).bootstrapTable('getOptions');
                        if(table_options.pagination){
                            index+= table_options.pageSize * (table_options.pageNumber -1);
                        }

                        // Open corresponding tooltip
                        self.openChartTooltip(self.scatter_chart, 0,  index);
                    }

                    // Line chart
                    if(self.line_chart !== null){
                        // Hide all tooltips
                        self.resetChartTooltip(self.line_chart, 0);

                        // Get index
                        var index = $(this).index();
                        var unique_id = $(this).data('uniqueid');
                        if(typeof unique_id !== 'undefined'){
                            for (var dataset_id = 0; dataset_id < self.line_chart_data.datasets.length; dataset_id++) {
                                for (var item_id = 0; item_id < self.line_chart_data.datasets[dataset_id].data_uniqueid.length; item_id++) {
                                    if(unique_id == self.line_chart_data.datasets[dataset_id].data_uniqueid[item_id]){
                                        self.openChartTooltip(self.line_chart, dataset_id,  item_id);
                                    }
                                }
                            }
                        }
                    }
                });

                $(element).find('tr').mouseleave(function() {
                    // Bar chart
                    if(self.bar_chart !== null) {
                        self.resetChartTooltip(self.bar_chart, 0);
                    }

                    // Scatter chart
                    if(self.scatter_chart !== null){
                        self.resetChartTooltip(self.scatter_chart, 0);
                    }

                    // Line chart
                    if(self.line_chart !== null){
                        self.resetChartTooltip(self.line_chart, 0);
                    }
                });
            });
            $(element).on('sort.bs.table', function (e, name, order) {
                if(self.options.rank_mode.startsWith('grouped')){
                    setTimeout(function(){
                        self.updateRank();
                    },100);
                }
                self.chart_update = true;

            });
            $(element).on('search.bs.table', function (e, name, order) {
                if(self.options.rank_mode.startsWith('grouped')){
                    setTimeout(function(){
                        self.updateRank();
                    },100);
                 }
                self.chart_update = true;

            });

            // Read field meta information, used for tags
            this.initFieldMeta();

            // Load data into table
            this.loadTableData();
        },
        initOptions: function(options){

            var attributes = jQuery.extend(true, {}, this.defaults);

            // Override defaults from data-*
            // Table parameters
            if(typeof this.$element.data('show-chart') !== 'undefined'){
                attributes.show_chart = this.$element.data('show-chart');
            }
            if(typeof this.$element.data('show-toolbar') !== 'undefined'){
                attributes.show_toolbar = this.$element.data('show-toolbar');
            }
            if(typeof this.$element.data('show-table-selector') !== 'undefined') {
                attributes.show_table_selector = this.$element.data('show-table-selector');
            }
            if(typeof this.$element.data('table-default-mode') !== 'undefined'){
                attributes.table_default_mode = this.$element.data('table-default-mode');
            }

            if(typeof this.$element.data('row-highlighting') !== 'undefined'){
                attributes.table.row_highlighting = this.$element.data('row-highlighting');
            }
            if(typeof this.$element.data('id-field') !== 'undefined'){
                attributes.table.id_field = this.$element.data('id-field');
            }
            if(typeof this.$element.data('column-hover') !== 'undefined'){
                attributes.table.column_hover = this.$element.data('column-hover');
            }

            if(typeof this.$element.data('chart-modes') !== 'undefined'){
                attributes.chart_modes = this.$element.data('chart-modes');
            }
            if(typeof this.$element.data('chart-default-mode') !== 'undefined'){
                attributes.chart_default_mode = this.$element.data('chart-default-mode');
            }
            if(typeof this.$element.data('rank-mode') !== 'undefined'){
                attributes.rank_mode = this.$element.data('rank-mode');
            }
            if(typeof this.$element.data('tag-mode') !== 'undefined'){
                attributes.tag_mode = this.$element.data('tag-mode');
            }
            if(typeof this.$element.data('chart-position') !== 'undefined'){
                attributes.chart.position = this.$element.data('chart-position');
            }

            // Bar
            if(typeof this.$element.data('bar-height') !== 'undefined'){
                attributes.bar.height = this.$element.data('bar-height');
            }
            if(typeof this.$element.data('bar-hline') !== 'undefined'){
                attributes.bar.horizontal_line.enabled = this.$element.data('bar-hline');
            }
            if(typeof this.$element.data('bar-show-xaxis') !== 'undefined'){
                attributes.bar.xaxis.display = this.$element.data('bar-show-xaxis');
            }
            if(typeof this.$element.data('bar-show-yaxis') !== 'undefined'){
                attributes.bar.yaxis.display = this.$element.data('bar-show-yaxis');
            }
            if(typeof this.$element.data('bar-yaxis-gridlines') !== 'undefined'){
                attributes.bar.yaxis.gridlines = this.$element.data('bar-yaxis-gridlines');
            }
            if(typeof this.$element.data('bar-horizontal-highlights') !== 'undefined'){
                attributes.bar.horizontal_highlights.data = this.parseDataList(this.$element.data('bar-horizontal-highlights'));
                if(attributes.bar.horizontal_highlights.data.length==0 && attributes.bar.horizontal_highlights.enabled){
                    attributes.bar.horizontal_highlights.enabled = false;
                }
            }
            if(typeof this.$element.data('bar-horizontal-highlight-opacity') !== 'undefined'){
                attributes.bar.horizontal_highlights.opacity = this.$element.data('bar-horizontal-highlight-opacity');
            }
            if(typeof this.$element.data('bar-horizontal-highlight-linewidth') !== 'undefined'){
                attributes.bar.horizontal_highlights.lineWidth = this.$element.data('bar-horizontal-highlight-width');
            }
            if(typeof this.$element.data('bar-horizontal-highlight-stroke') !== 'undefined'){
                attributes.bar.horizontal_highlights.strokeStyle = this.$element.data('bar-horizontal-highlight-stroke');
            }
            if(typeof this.$element.data('bar-horizontal-highlight-label-position') !== 'undefined'){
                attributes.bar.horizontal_highlights.label.position = this.$element.data('bar-horizontal-highlight-label-position');
            }
            if(typeof this.$element.data('bar-horizontal-highlight-label-fill') !== 'undefined'){
                attributes.bar.horizontal_highlights.label.fillStyle = this.$element.data('bar-horizontal-highlight-label-fill');
            }
            if(typeof this.$element.data('bar-horizontal-highlight-label-size') !== 'undefined'){
                attributes.bar.horizontal_highlights.label.fontSize = this.$element.data('bar-horizontal-highlight-label-size');
            }
            if(typeof this.$element.data('bar-horizontal-highlight-label-opacity') !== 'undefined'){
                attributes.bar.horizontal_highlights.label.opacity = this.$element.data('bar-horizontal-highlight-label-opacity');
            }
            if(typeof this.$element.data('bar-show-vertical-indicator') !== 'undefined'){
                attributes.bar.vertical_indicator_line.enabled = this.$element.data('bar-show-vertical-indicator');
            }
            if(typeof this.$element.data('bar-vertical-indicator-linewidth') !== 'undefined'){
                attributes.bar.vertical_indicator_line.lineWidth = this.$element.data('bar-vertical-indicator-width');
            }
            if(typeof this.$element.data('bar-vertical-indicator-stroke') !== 'undefined'){
                attributes.bar.vertical_indicator_line.strokeStyle = this.$element.data('bar-vertical-indicator-stroke');
            }
            if(typeof this.$element.data('bar-show-horizontal-indicator') !== 'undefined'){
                attributes.bar.horizontal_indicator_line.enabled = this.$element.data('bar-show-horizontal-indicator');
            }
            if(typeof this.$element.data('bar-horizontal-indicator-linewidth') !== 'undefined'){
                attributes.bar.horizontal_indicator_line.lineWidth = this.$element.data('bar-horizontal-indicator-width');
            }
            if(typeof this.$element.data('bar-horizontal-indicator-stroke') !== 'undefined'){
                attributes.bar.horizontal_indicator_line.strokeStyle = this.$element.data('bar-horizontal-indicator-stroke');
            }
            if(typeof this.$element.data('bar-horizontal-indicator-fill') !== 'undefined'){
                attributes.bar.horizontal_indicator_line.fillStyle = this.$element.data('bar-horizontal-indicator-fill');
            }
            if(typeof this.$element.data('bar-show-error-bar') !== 'undefined'){
                attributes.bar.error_bar.enabled = this.$element.data('bar-show-error-bar');
            }
            if(typeof this.$element.data('bar-error-bar-linewidth') !== 'undefined'){
                attributes.bar.error_bar.lineWidth = this.$element.data('bar-error-bar-linewidth');
            }
            if(typeof this.$element.data('bar-error-bar-tipwidth') !== 'undefined'){
                attributes.bar.error_bar.tipWidth = this.$element.data('bar-error-bar-tipwidth');
            }
            if(typeof this.$element.data('bar-error-bar-stroke') !== 'undefined'){
                attributes.bar.error_bar.strokeStyle = this.$element.data('bar-error-bar-stroke');
            }
            if(typeof this.$element.data('bar-tooltip-position') !== 'undefined'){
                attributes.bar.tooltips.position = this.$element.data('bar-tooltip-position');
            }
            if(typeof this.$element.data('bar-show-legend') !== 'undefined'){
                attributes.bar.legend.enabled = this.$element.data('bar-show-legend');
            }
            if(typeof this.$element.data('bar-legend-position') !== 'undefined'){
                attributes.bar.legend.position = this.$element.data('bar-legend-position');
            }

            // Line
            if(typeof this.$element.data('line-fields') !== 'undefined'){
                attributes.line.fields = this.$element.data('line-fields').split(',').map(function(item) {
                    return item.trim();
                });
            }
            if(typeof this.$element.data('line-fill') !== 'undefined'){
                attributes.line.fill = this.$element.data('line-fill');
            }
            if(typeof this.$element.data('line-show-xaxis') !== 'undefined'){
                attributes.line.xaxis.display = this.$element.data('line-show-xaxis');
            }
            if(typeof this.$element.data('line-xaxis-field') !== 'undefined'){
                attributes.line.xaxis.field = this.$element.data('line-xaxis-field');
            }
            if(typeof this.$element.data('line-xaxis-sorted') !== 'undefined'){
                attributes.line.xaxis.sorted = this.$element.data('line-xaxis-sorted');
            }
            if(typeof this.$element.data('line-xaxis-timeunit') !== 'undefined'){
                attributes.line.xaxis.timeunit = this.$element.data('line-xaxis-timeunit');
            }
            if(typeof this.$element.data('line-xaxis-timestepsize') !== 'undefined'){
                attributes.line.xaxis.timestepsize = this.$element.data('line-xaxis-timestepsize');
            }
            if(typeof this.$element.data('line-xaxis-gridlines') !== 'undefined'){
                attributes.line.xaxis.gridlines = this.$element.data('line-xaxis-gridlines');
            }
            if(typeof this.$element.data('line-yaxis-beginatzero') !== 'undefined'){
                attributes.line.yaxis.beginatzero = this.$element.data('line-yaxis-beginatzero');
            }
            if(typeof this.$element.data('line-yaxis-label') !== 'undefined'){
                attributes.line.yaxis.label = this.$element.data('line-yaxis-label');
            }
            if(typeof this.$element.data('line-yaxis-scale') !== 'undefined'){
                attributes.line.yaxis.scale = this.$element.data('line-yaxis-scale');
            }
            if(typeof this.$element.data('line-yaxis-gridlines') !== 'undefined'){
                attributes.line.yaxis.gridlines = this.$element.data('line-yaxis-gridlines');
            }
            if(typeof this.$element.data('line-height') !== 'undefined'){
                attributes.line.height = this.$element.data('line-height');
            }
            if(typeof this.$element.data('line-show-point') !== 'undefined'){
                attributes.line.point.enabled = this.$element.data('line-show-point');
            }
            if(typeof this.$element.data('line-point-radius') !== 'undefined'){
                attributes.line.point.radius.normal = this.$element.data('line-point-radius');
            }
            if(typeof this.$element.data('line-point-radius-hover') !== 'undefined'){
                attributes.line.point.radius.hover = this.$element.data('line-point-radius-hover');
            }
            if(typeof this.$element.data('line-show-line') !== 'undefined'){
                attributes.line.line.enabled = this.$element.data('line-show-line');
            }
            if(typeof this.$element.data('line-show-vertical-indicator') !== 'undefined'){
                attributes.line.vertical_indicator_line.enabled = this.$element.data('line-show-vertical-indicator');
            }
            if(typeof this.$element.data('line-vertical-indicator-linewidth') !== 'undefined'){
                attributes.line.vertical_indicator_line.lineWidth = this.$element.data('line-vertical-indicator-width');
            }
            if(typeof this.$element.data('line-vertical-indicator-stroke') !== 'undefined'){
                attributes.line.vertical_indicator_line.strokeStyle = this.$element.data('line-vertical-indicator-stroke');
            }
            if(typeof this.$element.data('line-show-horizontal-indicator') !== 'undefined'){
                attributes.line.horizontal_indicator_line.enabled = this.$element.data('line-show-horizontal-indicator');
            }
            if(typeof this.$element.data('line-horizontal-indicator-linewidth') !== 'undefined'){
                attributes.line.horizontal_indicator_line.lineWidth = this.$element.data('line-horizontal-indicator-width');
            }
            if(typeof this.$element.data('line-horizontal-indicator-stroke') !== 'undefined'){
                attributes.line.horizontal_indicator_line.strokeStyle = this.$element.data('line-horizontal-indicator-stroke');
            }
            if(typeof this.$element.data('line-horizontal-indicator-fill') !== 'undefined'){
                attributes.line.horizontal_indicator_line.fillStyle = this.$element.data('line-horizontal-indicator-fill');
            }
            if(typeof this.$element.data('line-show-horizontal-highlights') !== 'undefined'){
                attributes.line.horizontal_highlights.enabled = this.$element.data('line-show-horizontal-highlights');
            }
            if(typeof this.$element.data('line-horizontal-highlights') !== 'undefined'){
                attributes.line.horizontal_highlights.data = this.parseDataList(this.$element.data('line-horizontal-highlights'));
                if(attributes.line.horizontal_highlights.data.length==0 && attributes.line.horizontal_highlights.enabled){
                    attributes.line.horizontal_highlights.enabled = false;
                }
            }
            if(typeof this.$element.data('line-horizontal-highlight-opacity') !== 'undefined'){
                attributes.line.horizontal_highlights.opacity = this.$element.data('line-horizontal-highlight-opacity');
            }
            if(typeof this.$element.data('line-horizontal-highlight-linewidth') !== 'undefined'){
                attributes.line.horizontal_highlights.lineWidth = this.$element.data('line-horizontal-highlight-width');
            }
            if(typeof this.$element.data('line-horizontal-highlight-stroke') !== 'undefined'){
                attributes.line.horizontal_highlights.strokeStyle = this.$element.data('line-horizontal-highlight-stroke');
            }
            if(typeof this.$element.data('line-horizontal-highlight-label-position') !== 'undefined'){
                attributes.line.horizontal_highlights.label.position = this.$element.data('line-horizontal-highlight-label-position');
            }
            if(typeof this.$element.data('line-horizontal-highlight-label-fill') !== 'undefined'){
                attributes.line.horizontal_highlights.label.fillStyle = this.$element.data('line-horizontal-highlight-label-fill');
            }
            if(typeof this.$element.data('line-horizontal-highlight-label-size') !== 'undefined'){
                attributes.line.horizontal_highlights.label.fontSize = this.$element.data('line-horizontal-highlight-label-size');
            }
            if(typeof this.$element.data('line-horizontal-highlight-label-opacity') !== 'undefined'){
                attributes.line.horizontal_highlights.label.opacity = this.$element.data('line-horizontal-highlight-label-opacity');
            }
            if(typeof this.$element.data('line-show-vertical-segments') !== 'undefined'){
                attributes.line.vertical_segments.enabled = this.$element.data('line-show-vertical-segments');
            }
            if(typeof this.$element.data('line-vertical-segments') !== 'undefined'){
                attributes.line.vertical_segments.data = this.parseSegmentList(this.$element.data('line-vertical-segments'));
                if(attributes.line.vertical_segments.data.length==0 && attributes.line.vertical_segments.enabled){
                    attributes.line.vertical_segments.enabled = false;
                }
            }
            if(typeof this.$element.data('line-vertical-segment-opacity') !== 'undefined'){
                attributes.line.vertical_segments.opacity = this.$element.data('line-vertical-segment-opacity');
            }
            if(typeof this.$element.data('line-vertical-segment-label-position') !== 'undefined'){
                attributes.line.vertical_segments.label.position = this.$element.data('line-vertical-segment-label-position');
            }
            if(typeof this.$element.data('line-vertical-segment-label-fill') !== 'undefined'){
                attributes.line.vertical_segments.label.fillStyle = this.$element.data('line-vertical-segment-label-fill');
            }
            if(typeof this.$element.data('line-vertical-segment-label-size') !== 'undefined'){
                attributes.line.vertical_segments.label.fontSize = this.$element.data('line-vertical-segment-label-size');
            }
            if(typeof this.$element.data('line-vertical-segment-label-opacity') !== 'undefined'){
                attributes.line.vertical_segments.label.opacity = this.$element.data('line-vertical-segment-label-opacity');
            }
            if(typeof this.$element.data('line-show-error-bar') !== 'undefined'){
                attributes.line.error_bar.enabled = this.$element.data('line-show-error-bar');
            }
            if(typeof this.$element.data('line-error-bar-linewidth') !== 'undefined'){
                attributes.line.error_bar.lineWidth = this.$element.data('line-error-bar-linewidth');
            }
            if(typeof this.$element.data('line-error-bar-tipwidth') !== 'undefined'){
                attributes.line.error_bar.tipWidth = this.$element.data('line-error-bar-tipwidth');
            }
            if(typeof this.$element.data('line-error-bar-stroke') !== 'undefined'){
                attributes.line.error_bar.strokeStyle = this.$element.data('line-error-bar-stroke');
            }
            if(typeof this.$element.data('line-show-interval') !== 'undefined'){
                attributes.line.interval.enabled = this.$element.data('line-show-interval');
            }
            if(typeof this.$element.data('line-interval-linewidth') !== 'undefined'){
                attributes.line.interval.lineWidth = this.$element.data('line-interval-linewidth');
            }
            if(typeof this.$element.data('line-hline') !== 'undefined'){
                attributes.line.horizontal_line.enabled = this.$element.data('line-hline');
            }
            if(typeof this.$element.data('line-tooltip-position') !== 'undefined'){
                attributes.line.tooltips.position = this.$element.data('line-tooltip-position');
            }
            if(typeof this.$element.data('line-show-legend') !== 'undefined'){
                attributes.line.legend.enabled = this.$element.data('line-show-legend');
            }
            if(typeof this.$element.data('line-legend-position') !== 'undefined'){
                attributes.line.legend.position = this.$element.data('line-legend-position');
            }

            // Scatter
            if(typeof this.$element.data('scatter-height') !== 'undefined'){
                attributes.scatter.height = this.$element.data('scatter-height');
            }
            if(typeof this.$element.data('scatter-x') !== 'undefined'){
                attributes.scatter.x = this.$element.data('scatter-x');
            }
            if(typeof this.$element.data('scatter-y') !== 'undefined'){
                attributes.scatter.y = this.$element.data('scatter-y');
            }
            if(typeof this.$element.data('scatter-point-radius') !== 'undefined'){
                attributes.scatter.point.normal = this.$element.data('scatter-point-radius');
            }
            if(typeof this.$element.data('scatter-point-radius-hover') !== 'undefined'){
                attributes.scatter.point.hover = this.$element.data('scatter-point-radius-hover');
            }
            if(typeof this.$element.data('scatter-show-vertical-indicator') !== 'undefined'){
                attributes.scatter.vertical_indicator_line.enabled = this.$element.data('scatter-show-vertical-indicator');
            }
            if(typeof this.$element.data('scatter-vertical-indicator-linewidth') !== 'undefined'){
                attributes.scatter.vertical_indicator_line.lineWidth = this.$element.data('scatter-vertical-indicator-width');
            }
            if(typeof this.$element.data('scatter-vertical-indicator-stroke') !== 'undefined'){
                attributes.scatter.vertical_indicator_line.strokeStyle = this.$element.data('scatter-vertical-indicator-stroke');
            }
            if(typeof this.$element.data('scatter-show-horizontal-indicator') !== 'undefined'){
                attributes.scatter.horizontal_indicator_line.enabled = this.$element.data('scatter-show-horizontal-indicator');
            }
            if(typeof this.$element.data('scatter-horizontal-indicator-linewidth') !== 'undefined'){
                attributes.scatter.horizontal_indicator_line.lineWidth = this.$element.data('scatter-horizontal-indicator-width');
            }
            if(typeof this.$element.data('scatter-horizontal-indicator-stroke') !== 'undefined'){
                attributes.scatter.horizontal_indicator_line.strokeStyle = this.$element.data('scatter-horizontal-indicator-stroke');
            }
            if(typeof this.$element.data('scatter-horizontal-indicator-fill') !== 'undefined'){
                attributes.scatter.horizontal_indicator_line.fillStyle = this.$element.data('scatter-horizontal-indicator-fill');
            }
            if(typeof this.$element.data('scatter-show-error-bar') !== 'undefined'){
                attributes.scatter.error_bar.enabled = this.$element.data('line-show-error-bar');
            }
            if(typeof this.$element.data('scatter-error-bar-linewidth') !== 'undefined'){
                attributes.scatter.error_bar.lineWidth = this.$element.data('scatter-error-bar-linewidth');
            }
            if(typeof this.$element.data('scatter-error-bar-tipwidth') !== 'undefined'){
                attributes.scatter.error_bar.tipWidth = this.$element.data('scatter-error-bar-tipwidth');
            }
            if(typeof this.$element.data('scatter-error-bar-stroke') !== 'undefined'){
                attributes.scatter.error_bar.strokeStyle = this.$element.data('scatter-error-bar-stroke');
            }
            if(typeof this.$element.data('scatter-show-error-box') !== 'undefined'){
                attributes.scatter.error_bar.bounding_box = this.$element.data('line-show-error-box');
            }
            if(typeof this.$element.data('scatter-error-box-fill') !== 'undefined'){
                attributes.scatter.error_bar.fillStyle = this.$element.data('scatter-error-box-fill');
            }

            // Comparison
            if(typeof this.$element.data('comparison-height') !== 'undefined'){
                attributes.comparison.height = this.$element.data('comparison-height');
            }
            if(typeof this.$element.data('comparison-row-id-field') !== 'undefined'){
                attributes.comparison.row_id_field = this.$element.data('comparison-row-id-field');
            }
            if(typeof this.$element.data('comparison-sets-json') !== 'undefined'){
                attributes.comparison.sets = this.$element.data('comparison-sets-json');
            }
            if(typeof this.$element.data('comparison-active-set') !== 'undefined'){
                attributes.comparison.active_set = this.$element.data('comparison-active-set');
            }
            if(typeof this.$element.data('comparison-a-row') !== 'undefined'){
                attributes.comparison.a_row = this.$element.data('comparison-a-row');
            }
            if(typeof this.$element.data('comparison-b-row') !== 'undefined'){
                attributes.comparison.b_row = this.$element.data('comparison-b-row');
            }
            if(typeof this.$element.data('comparison-show-error-bar') !== 'undefined'){
                attributes.comparison.error_bar.enabled = this.$element.data('comparison-show-error-bar');
            }
            if(typeof this.$element.data('comparison-error-bar-linewidth') !== 'undefined'){
                attributes.comparison.error_bar.lineWidth = this.$element.data('comparison-error-bar-linewidth');
            }
            if(typeof this.$element.data('comparison-error-bar-tipwidth') !== 'undefined'){
                attributes.comparison.error_bar.tipWidth = this.$element.data('comparison-error-bar-tipwidth');
            }
            if(typeof this.$element.data('comparison-error-bar-stroke') !== 'undefined'){
                attributes.comparison.error_bar.strokeStyle = this.$element.data('comparison-error-bar-stroke');
            }

            // Combine parameters from defaults and given plugin options.
            this.options = $.extend(true, {}, attributes, options);   // Plugin options object

            // Add bootstrap-table.js defaults if not set
            if(typeof this.$element.data('page-list') === 'undefined'){
                this.$element.attr('data-page-list', this.options.table.page_list);
            }
            if(typeof this.$element.data('pagination') === 'undefined'){
                this.$element.attr('data-pagination', this.options.table.pagination);
            }
            if(typeof this.$element.data('show-header') === 'undefined'){
                this.$element.attr('data-show-header', this.options.table.show_header);
            }
            if(typeof this.$element.data('show-column') === 'undefined'){
                this.$element.attr('data-show-column', this.options.table.show_column);
            }
            if(typeof this.$element.data('show-pagination-switch') === 'undefined'){
                if(this.options.show_toolbar){
                    this.$element.attr('data-show-pagination-switch', this.options.table.show_pagination_switch);
                }else{
                    this.$element.attr('data-show-pagination-switch', false);
                }
            }
            if(typeof this.$element.data('striped') === 'undefined'){
                this.$element.attr('data-striped', this.options.table.striped);
            }

            // Post-process options
            this.options.chart_modes = this.options.chart_modes.split(',');
            if(this.options.chart_modes.length == 1 && this.options.chart_modes[0] != this.options.chart_default_mode && this.options.chart_default_mode != 'off'){
                this.options.chart_default_mode = this.options.chart_modes[0];
            }

            if(!this.options.show_toolbar && this.options.table_default_mode === 'hide'){
                this.$element.attr('data-height', 1);
                this.$element.attr('data-page-size', 1);
                this.$element.attr('data-pagination', false);
                this.$element.attr('data-show-pagination-switch', false);
            }
        },
        initValueFormatters: function(){
            var self = this;

            $(this.element).find('thead tr th[data-value-type]').each(function(){
                var value_type = $(this).data('value-type');

                if(value_type.includes('percentage')){
                    $(this).attr('data-postfix','%');
                }

                switch(value_type){
                    case 'int':
                        $(this).attr('data-formatter','valueFormatter_int');
                        break;

                    case 'float1':
                        $(this).attr('data-formatter','valueFormatter_float1');
                        break;
                    case 'float2':
                        $(this).attr('data-formatter','valueFormatter_float2');
                        break;
                    case 'float3':
                        $(this).attr('data-formatter','valueFormatter_float3');
                        break;
                    case 'float4':
                        $(this).attr('data-formatter','valueFormatter_float4');
                        break;

                    // large integers
                    case 'float1-exp':
                        $(this).attr('data-formatter','valueFormatter_float1_exp');
                        break;
                    case 'float2-exp':
                        $(this).attr('data-formatter','valueFormatter_float2_exp');
                        break;
                    case 'float3-exp':
                        $(this).attr('data-formatter','valueFormatter_float3_exp');
                        break;
                    case 'float4-exp':
                        $(this).attr('data-formatter','valueFormatter_float4_exp');
                        break;

                    case 'numeric-unit':
                        window['valueFormatter_numeric_unit'+self.uniqueId] = function (value, row, index){
                            if($.isNumeric(value)){
                                value = parseFloat(value);
                                return self.addNumberPrefix(value);

                            }else{
                                return value;
                            }
                        };

                        $(this).attr('data-formatter', 'valueFormatter_numeric_unit'+self.uniqueId);
                        break;

                    // numeric with interval
                    case 'int-interval':
                        $(this).attr('data-formatter','valueFormatter_int_with_interval');
                        break;
                    case 'int-interval-muted':
                        $(this).attr('data-formatter','valueFormatter_int_with_interval_muted');
                        break;
                    case 'float1-interval':
                        $(this).attr('data-formatter','valueFormatter_float1_with_interval');
                        break;
                    case 'float1-interval-muted':
                        $(this).attr('data-formatter','valueFormatter_float1_with_interval_muted');
                        break;
                    case 'float2-interval':
                        $(this).attr('data-formatter','valueFormatter_float2_with_interval');
                        break;
                    case 'float2-interval-muted':
                        $(this).attr('data-formatter','valueFormatter_float2_with_interval_muted');
                        break;
                    case 'float3-interval':
                        $(this).attr('data-formatter','valueFormatter_float3_with_interval');
                        break;
                    case 'float3-interval-muted':
                        $(this).attr('data-formatter','valueFormatter_float3_with_interval_muted');
                        break;
                    case 'float4-interval':
                        $(this).attr('data-formatter','valueFormatter_float4_with_interval');
                        break;
                    case 'float4-interval-muted':
                        $(this).attr('data-formatter','valueFormatter_float4_with_interval_muted');
                        break;

                    // numeric with plusminus
                    case 'int-plusminus':
                        $(this).attr('data-formatter','valueFormatter_int_plusminus');
                        break;
                    case 'int-plusminus-muted':
                        $(this).attr('data-formatter','valueFormatter_int_plusminus_muted');
                        break;
                    case 'float1-plusminus':
                        $(this).attr('data-formatter','valueFormatter_float1_plusminus');
                        break;
                    case 'float1-plusminus-muted':
                        $(this).attr('data-formatter','valueFormatter_float1_plusminus_muted');
                        break;
                    case 'float2-plusminus':
                        $(this).attr('data-formatter','valueFormatter_float2_plusminus');
                        break;
                    case 'float2-plusminus-muted':
                        $(this).attr('data-formatter','valueFormatter_float2_plusminus_muted');
                        break;
                    case 'float3-plusminus':
                        $(this).attr('data-formatter','valueFormatter_float3_plusminus');
                        break;
                    case 'float3-plusminus-muted':
                        $(this).attr('data-formatter','valueFormatter_float3_plusminus_muted');
                        break;
                    case 'float4-plusminus':
                        $(this).attr('data-formatter','valueFormatter_float4_plusminus');
                        break;
                    case 'float4-plusminus-muted':
                        $(this).attr('data-formatter','valueFormatter_float4_plusminus_muted');
                        break;

                    // percentage
                    case 'int-percentage':
                        $(this).attr('data-formatter','valueFormatter_int_percentage');
                        break;
                    case 'float1-percentage':
                        $(this).attr('data-formatter','valueFormatter_float1_percentage');
                        break;
                    case 'float2-percentage':
                        $(this).attr('data-formatter','valueFormatter_float2_percentage');
                        break;
                    case 'float3-percentage':
                        $(this).attr('data-formatter','valueFormatter_float3_percentage');
                        break;
                    case 'float4-percentage':
                        $(this).attr('data-formatter','valueFormatter_float4_percentage');
                        break;

                    // percentage with interval
                    case 'int-percentage-interval':
                        $(this).attr('data-formatter','valueFormatter_int_percentage_with_interval');
                        break;
                    case 'int-percentage-interval-muted':
                        $(this).attr('data-formatter','valueFormatter_int_percentage_with_interval_muted');
                        break;
                    case 'float1-percentage-interval':
                        $(this).attr('data-formatter','valueFormatter_float1_percentage_with_interval');
                        break;
                    case 'float1-percentage-interval-muted':
                        $(this).attr('data-formatter','valueFormatter_float1_percentage_with_interval_muted');
                        break;
                    case 'float2-percentage-interval':
                        $(this).attr('data-formatter','valueFormatter_float2_percentage_with_interval');
                        break;
                    case 'float2-percentage-interval-muted':
                        $(this).attr('data-formatter','valueFormatter_float2_percentage_with_interval_muted');
                        break;
                    case 'float3-percentage-interval':
                        $(this).attr('data-formatter','valueFormatter_float3_percentage_with_interval');
                        break;
                    case 'float3-percentage-interval-muted':
                        $(this).attr('data-formatter','valueFormatter_float3_percentage_with_interval_muted');
                        break;
                    case 'float4-percentage-interval':
                        $(this).attr('data-formatter','valueFormatter_float4_percentage_with_interval');
                        break;
                    case 'float4-percentage-interval-muted':
                        $(this).attr('data-formatter','valueFormatter_float4_percentage_with_interval_muted');
                        break;

                    // percentage with plusminus
                    case 'int-percentage-plusminus':
                        $(this).attr('data-formatter','valueFormatter_int_percentage_plusminus');
                        break;
                    case 'int-percentage-plusminus-muted':
                        $(this).attr('data-formatter','valueFormatter_int_percentage_plusminus_muted');
                        break;
                    case 'float1-percentage-plusminus':
                        $(this).attr('data-formatter','valueFormatter_float1_percentage_plusminus');
                        break;
                    case 'float1-percentage-plusminus-muted':
                        $(this).attr('data-formatter','valueFormatter_float1_percentage_plusminus_muted');
                        break;
                    case 'float2-percentage-plusminus':
                        $(this).attr('data-formatter','valueFormatter_float2_percentage_plusminus');
                        break;
                    case 'float2-percentage-plusminus-muted':
                        $(this).attr('data-formatter','valueFormatter_float2_percentage_plusminus_muted');
                        break;
                    case 'float3-percentage-plusminus':
                        $(this).attr('data-formatter','valueFormatter_float3_percentage_plusminus');
                        break;
                    case 'float3-percentage-plusminus-muted':
                        $(this).attr('data-formatter','valueFormatter_float3_percentage_plusminus_muted');
                        break;
                    case 'float4-percentage-plusminus':
                        $(this).attr('data-formatter','valueFormatter_float4_percentage_plusminus');
                        break;
                    case 'float4-percentage-plusminus-muted':
                        $(this).attr('data-formatter','valueFormatter_float4_percentage_plusminus_muted');
                        break;

                    // error
                    case 'int-error':
                        $(this).attr('data-formatter','valueFormatter_int_error');
                        break;
                    case 'float1-error':
                        $(this).attr('data-formatter','valueFormatter_float1_error');
                        break;
                    case 'float2-error':
                        $(this).attr('data-formatter','valueFormatter_float2_error');
                        break;
                    case 'float3-error':
                        $(this).attr('data-formatter','valueFormatter_float3_error');
                        break;
                    case 'float4-error':
                        $(this).attr('data-formatter','valueFormatter_float4_error');
                        break;

                    case 'list':
                        $(this).attr('data-formatter','valueFormatter_list');
                        break;

                    case 'url':
                        window['valueFormatter_url'+self.uniqueId] = function (value, row, index){
                            var links = [];
                            if(value.trim()){
                                var items = value.split(',');
                                if(items.length > 0){
                                    for(var i=0;i<items.length;i++){
                                        var current_link = items[i].trim();
                                        var index = current_link.lastIndexOf(';');
                                        if(index != -1){
                                            var link = current_link.substring(0,index);
                                            var link_title = current_link.substring(index+1);
                                            links.push('<a class="datatable-link" href="' + link + '">'+link_title+'</a>');
                                        }else{
                                            links.push('<a class="datatable-icon" href="' + current_link + '">'+self.options.icon.url+'</a>');
                                        }
                                    }
                                }
                            }
                            return links.join('<br>');
                        };
                        $(this).attr('data-formatter','valueFormatter_url'+this.uniqueId);
                        break;

                    case 'ref':
                        window['valueFormatter_ref'+self.uniqueId] = function (value, row, index){
                            var links = [];
                            if(value.trim()){
                                var items = value.split(',');
                                if(items.length > 0){
                                    for(var i=0;i<items.length;i++){
                                        var current_link = items[i].trim();
                                        var index = current_link.lastIndexOf(';');
                                        if(index != -1){
                                            var link = current_link.substring(0,index);
                                            var link_title = current_link.substring(index+1);
                                            links.push('<a class="datatable-link" href="' + link + '">['+link_title+']</a>');
                                        }else{
                                            links.push('<a class="datatable-icon" href="' + current_link + '">'+self.options.icon.ref+'</a>');
                                        }
                                    }
                                }
                            }
                            return links.join('<br>');
                        };
                        $(this).attr('data-formatter','valueFormatter_ref'+self.uniqueId);
                        break;

                    case 'anchor':
                        window['valueFormatter_anchor'+self.uniqueId] = function valueFormatter_anchor(value, row, index){
                            if(value.trim()){
                                return '<a class="datatable-icon" href="javascript:void(0)" onclick="$(\'#collapse-'+value+'\').collapse(\'show\');window.location.hash=\''+value+'\';return false;">'+self.options.icon.anchor+'</a>'
                            }else{
                                return value;
                            }
                        };

                        $(this).attr('data-formatter', 'valueFormatter_anchor'+self.uniqueId);
                        break;

                    case 'inline-bar-horizontal-percentage':
                        window['valueFormatter_inline_bar_horizontal_percentage'+self.uniqueId] = function (value, row, index){
                            var value_formatter = 'valueFormatter_float1_percentage';
                            var header = $(self.element).find('thead tr th[data-field=\"'+this.field+'\"]');

                            var dataset_labels = [];
                            if(typeof header.data('dataset-labels') !== 'undefined'){
                                dataset_labels = header.data('dataset-labels').split(',')
                            }
                            var dataset_colors = [];
                            if(typeof header.data('dataset-colors') !== 'undefined'){
                                dataset_colors = header.data('dataset-colors').split(',')
                            }

                            var data = self.parseDataList(value);

                            var html = '';
                            if(data.length > 0) {
                                var value_sum = 0;
                                for (var i = 0; i < data.length; i++) {
                                    value_sum += data[i]['y_value'];
                                }

                                html += '<div class="progress datatable-horizontal-bar">';
                                for (var i = 0; i < data.length; i++) {
                                    var percentage = data[i]['y_value'];
                                    if(value_sum > 100.0 && value_sum < 101.0){
                                        percentage = percentage/value_sum * 100.0;
                                    }

                                    var value_string = self.stripHTML(window[value_formatter](percentage));

                                    var current_color = null;
                                    if(data[i]['color']){
                                        current_color = data[i]['color'];
                                    }else if(i < dataset_colors.length && dataset_colors[i]){
                                        current_color = dataset_colors[i];
                                    }else{
                                        current_color = self.options.bar.colors.datasets[i % self.options.bar.colors.datasets.length];
                                    }

                                    html += '<div class="progress-bar" role="progressbar" data-percentage="100" aria-valuenow="'+percentage+'" aria-valuemin="0" aria-valuemax="100" style="width: '+percentage+'%;background-color:'+current_color+'" ';

                                    var current_label = null;
                                    if(data[i]['label']){
                                        current_label = data[i]['label'];
                                    }else if(i < dataset_labels.length && dataset_labels[i]){
                                        current_label = dataset_labels[i];
                                    }

                                    if(current_label){
                                        html += 'data-toggle="tooltip" data-placement="bottom" title="' + current_label + ': <strong>'+value_string+'</strong>" ';
                                    }else{
                                        html += 'data-toggle="tooltip" data-placement="bottom" title="<strong>' + value_string + '</strong>" ';
                                    }
                                    html += '>';
                                    html += '</div>';
                                }
                                html += '</div>';
                            }
                            return html;
                        };
                        $(this).attr('data-formatter', 'valueFormatter_inline_bar_horizontal_percentage'+self.uniqueId);
                        break;

                    case 'inline-bar-horizontal-thin-percentage':
                        window['valueFormatter_inline_bar_horizontal_thin_percentage'+self.uniqueId] = function (value, row, index){
                            var value_formatter = 'valueFormatter_float1_percentage';
                            var header = $(self.element).find('thead tr th[data-field=\"'+this.field+'\"]');

                            var dataset_labels = [];
                            if(typeof header.data('dataset-labels') !== 'undefined'){
                                dataset_labels = header.data('dataset-labels').split(',')
                            }
                            var dataset_colors = [];
                            if(typeof header.data('dataset-colors') !== 'undefined'){
                                dataset_colors = header.data('dataset-colors').split(',')
                            }

                            var data = self.parseDataList(value);

                            var html = '';
                            if(data.length > 0) {
                                var value_sum = 0;
                                for (var i = 0; i < data.length; i++) {
                                    value_sum += data[i]['y_value'];
                                }

                                html += '<div class="progress datatable-horizontal-bar-thin">';
                                for (var i = 0; i < data.length; i++) {
                                    var percentage = data[i]['y_value'];

                                    // Normalize percentage
                                    if(value_sum > 100.0 && value_sum < 101.0){
                                        percentage = percentage/value_sum * 100.0;
                                    }

                                    var value_string = self.stripHTML(window[value_formatter](percentage));

                                    var current_color = null;
                                    if(data[i]['color']){
                                        current_color = data[i]['color'];
                                    }else if(i < dataset_colors.length && dataset_colors[i]){
                                        current_color = dataset_colors[i];
                                    }else{
                                        current_color = self.options.bar.colors.datasets[i % self.options.bar.colors.datasets.length];
                                    }

                                    html += '<div class="progress-bar" role="progressbar" data-percentage="100" aria-valuenow="'+percentage+'" aria-valuemin="0" aria-valuemax="100" style="width: '+percentage+'%;background-color:'+current_color+'" ';

                                    if(data[i]['label']){
                                        html += 'data-toggle="tooltip" data-placement="bottom" title="'+data[i]['label']+ ': <strong>'+value_string+'</strong>" ';
                                    }else{
                                        html += 'data-toggle="tooltip" data-placement="bottom" title="<strong>'+value_string+'</strong>" ';
                                    }
                                    html += '>';
                                    html += '</div>';
                                }
                                html += '</div>';
                            }
                            return html;
                        };
                        $(this).attr('data-formatter', 'valueFormatter_inline_bar_horizontal_thin_percentage'+self.uniqueId);
                        break;

                    case 'inline-bar-vertical':
                        $(this).attr('data-formatter', 'valueFormatter_inline_bar_vertical');
                        $(this).addClass('canvas-cell');
                        break;

                    case 'inline-bar-vertical-tristate':
                        $(this).attr('data-formatter', 'valueFormatter_inline_bar_vertical_tristate');
                        $(this).addClass('canvas-cell');
                        break;

                    case 'inline-line':
                        $(this).attr('data-formatter', 'valueFormatter_inline_line');
                        $(this).addClass('canvas-cell');
                        break;

                    case 'inline-line-steps':
                        $(this).attr('data-formatter', 'valueFormatter_inline_line_steps');
                        $(this).addClass('canvas-cell');
                        break;

                    case 'inline-pie':
                        $(this).attr('data-formatter', 'valueFormatter_inline_pie');
                        $(this).addClass('canvas-cell');
                        break;

                    case 'inline-indicator-value':
                        window['valueFormatter_inline_indicator_value_svg'+self.uniqueId] = function (value, row, index){
                            var data = self.parseDataList(value);
                            var html = '';
                            if(data.length > 0) {
                                for (var i = 0; i < data.length; i++) {
                                    var fill_color = 'transparent';
                                    if(!!data[i]['color']){
                                        fill_color = data[i]['color'];
                                    }else{
                                        fill_color = self.options.inline_chart.value_indicator.color.default;
                                    }
                                    html += self.svgElement(
                                        self.options.inline_chart.value_indicator.svg.type,
                                        self.options.inline_chart.value_indicator.svg.size,
                                        fill_color,
                                        data[i]['label'],
                                        false, 0
                                    );
                                }
                            }
                            return html;
                        };

                        $(this).attr('data-formatter', 'valueFormatter_inline_indicator_value_svg'+self.uniqueId);
                        $(this).addClass('canvas-cell');
                        break;

                    case 'inline-indicator-value-html':
                        window['valueFormatter_inline_indicator_value_html'+self.uniqueId] = function (value, row, index){
                            var data = self.parseDataList(value);
                            var html = '';
                            if(data.length > 0) {
                                html = '<div class="">';
                                for (var i = 0; i < data.length; i++) {
                                    var css_class = self.options.inline_chart.value_indicator.html.css;

                                    var fill_color = 'transparent';
                                    if(!!data[i]['color']) {
                                        fill_color = data[i]['color'];
                                    }else{
                                        fill_color = self.options.inline_chart.value_indicator.color.default;
                                    }

                                    html += '<span class="'+css_class+'" aria-hidden="true" ';
                                    if(data[i]['label']){
                                        html += 'data-toggle="tooltip" data-placement="bottom" title="'+data[i]['label']+'"';
                                    }

                                    html += ' style="color:'+fill_color+'"' ;
                                    html += '>';
                                    html += '</span>';
                                }
                                html += '</div>';
                            }
                            return html;
                        };

                        $(this).attr('data-formatter', 'valueFormatter_inline_indicator_value_html'+self.uniqueId);
                        $(this).addClass('canvas-cell');
                        break;

                    case 'inline-indicator-binary':
                        window['valueFormatter_inline_indicator_binary_svg'+self.uniqueId] = function (value, row, index){
                            var data = self.parseDataList(value);
                            var html = '';
                            if(data.length > 0) {
                                for (var i = 0; i < data.length; i++) {
                                    var fill_color = null;
                                    if(data[i]['y_value'] >= self.options.inline_chart.value_indicator.data.binarizationThreshold){
                                        fill_color = self.options.inline_chart.value_indicator.color.positive;
                                    }else{
                                        fill_color = self.options.inline_chart.value_indicator.color.negative;
                                    }

                                    html += self.svgElement(
                                        self.options.inline_chart.value_indicator.svg.type,
                                        self.options.inline_chart.value_indicator.svg.size,
                                        fill_color,
                                        data[i]['label'],
                                        false, 0
                                    );
                                }
                            }
                            return html;
                        };

                        $(this).attr('data-formatter', 'valueFormatter_inline_indicator_binary_svg'+self.uniqueId);
                        $(this).addClass('canvas-cell');
                        break;

                    case 'inline-indicator-binary-html':
                        window['valueFormatter_inline_binary_html'+self.uniqueId] = function (value, row, index){
                            var data = self.parseDataList(value);
                            var html = '';
                            if(data.length > 0) {
                                html = '<div class="">';
                                for (var i = 0; i < data.length; i++) {
                                    var css_class = self.options.inline_chart.value_indicator.html.css;

                                    var fill_color = 'transparent';

                                    if (data[i]['y_value'] > self.options.inline_chart.value_indicator.data.binarizationThreshold) {
                                        fill_color = self.options.inline_chart.value_indicator.color.positive;
                                    } else {
                                        fill_color = self.options.inline_chart.value_indicator.color.negative;
                                    }
                                    html += '<span class="'+css_class+'" aria-hidden="true" ';
                                    if(data[i]['label']){
                                        html += 'data-toggle="tooltip" data-placement="bottom" title="'+data[i]['label']+'"';
                                    }

                                    html += ' style="color:'+fill_color+'"' ;
                                    html += '>';
                                    html += '</span>';
                                }
                                html += '</div>';
                            }
                            return html;
                        };

                        $(this).attr('data-formatter', 'valueFormatter_inline_binary_html'+self.uniqueId);
                        $(this).addClass('canvas-cell');
                        break;

                    case 'inline-indicator-tristate':
                        window['valueFormatter_inline_indicator_tristate_svg'+self.uniqueId] = function (value, row, index){
                            var data = self.parseDataList(value);
                            var html = '';
                            if(data.length > 0) {
                                for (var i = 0; i < data.length; i++) {
                                    var fill_color = 'transparent';
                                    var offset = 0;
                                    if(data[i]['y_value'] > self.options.inline_chart.value_indicator.data.binarizationThreshold){
                                        fill_color = self.options.inline_chart.value_indicator.color.positive;
                                        offset = 0;
                                    }else if(data[i]['y_value'] < self.options.inline_chart.value_indicator.data.binarizationThreshold){
                                        fill_color = self.options.inline_chart.value_indicator.color.negative;
                                        offset = self.options.inline_chart.value_indicator.svg.size;
                                    }else{
                                        fill_color = self.options.inline_chart.value_indicator.color.equal;
                                        offset = self.options.inline_chart.value_indicator.svg.size / 2;
                                    }

                                    html += self.svgElement(
                                        self.options.inline_chart.value_indicator.svg.type,
                                        self.options.inline_chart.value_indicator.svg.size,
                                        fill_color,
                                        data[i]['label'],
                                        true,
                                        offset
                                    );
                                }
                            }
                            return html;
                        };

                        $(this).attr('data-formatter', 'valueFormatter_inline_indicator_tristate_svg'+self.uniqueId);
                        $(this).addClass('canvas-cell');
                        break;

                    case 'inline-indicator-tristate-html':
                        window['valueFormatter_inline_tristate_html'+self.uniqueId] = function (value, row, index){
                            var data = self.parseDataList(value);
                            var html = '';
                            if(data.length > 0) {
                                html = '<div class="">';
                                for (var i = 0; i < data.length; i++) {
                                    var css_class = self.options.inline_chart.value_indicator.html.css;

                                    var fill_color = 'transparent';
                                    var offset = null;
                                    if (data[i]['y_value'] > self.options.inline_chart.value_indicator.data.binarizationThreshold) {
                                        fill_color = self.options.inline_chart.value_indicator.color.positive;
                                        offset = 0;
                                    }else if(data[i]['y_value'] < self.options.inline_chart.value_indicator.data.binarizationThreshold){
                                        fill_color = self.options.inline_chart.value_indicator.color.negative;
                                        offset = 10;
                                    }else{
                                        fill_color = self.options.inline_chart.value_indicator.color.equal;
                                        offset = 5;
                                    }
                                    html += '<span class="'+css_class+'" aria-hidden="true" ';

                                    if(data[i]['label']){
                                        html += 'data-toggle="tooltip" data-placement="bottom" title="'+data[i]['label']+'"';
                                    }

                                    html += ' style="color:'+fill_color+'; height:30px;top:'+offset+'px;"' ;
                                    html += '>';
                                    html += '</span>';
                                }
                                html += '</div>';
                            }
                            return html;
                        };

                        $(this).attr('data-formatter', 'valueFormatter_inline_tristate_html'+self.uniqueId);
                        $(this).addClass('canvas-cell');
                        break;

                    default:
                        window['valueFormatter_hide'+self.uniqueId] = function (value, row, index){
                            return '<div class="text-muted" data-value="'+value+'">Invalid data-value-type</div>';
                        };
                        $(this).attr('data-formatter', 'valueFormatter_hide'+self.uniqueId);
                        break;
                }
            });
        },
        initBootstrapTable: function (){
            // Load bootstrap-table
            $(this.element).bootstrapTable();
            $(this.element).trigger('post-body.bs.table');
        },
        extendChartjsLibrary: function(){
            var self = this;

            // Extend bar plot
            var originalBarDraw = Chart.controllers.bar.prototype.draw;
            Chart.helpers.extend(Chart.controllers.bar.prototype, {
                draw: function() {
                    originalBarDraw.apply(this, arguments);
                    var chart = this.chart;
                    var scale = this.scale;
                    var ctx = chart.chart.ctx;

                    var xaxis = chart.scales['x-axis-0'];
                    var yaxis = chart.scales['y-axis-0'];

                    if(chart.config.options.hasOwnProperty('horizontal_line') && chart.config.options.horizontal_line.enabled){
                        var horizontal_line_value = this.getDataset().horizontal_line_value;
                        var horizontal_line_color = this.getDataset().horizontal_line_color;

                        $.each( horizontal_line_value, function( index, value ) {
                            var y = yaxis.getPixelForValue(value);
                            ctx.save();
                            ctx.beginPath();
                            ctx.strokeStyle = horizontal_line_color[index];

                            var lineWidth = 2;
                            if(chart.config.options.horizontal_line.hasOwnProperty('lineWidth')){
                                lineWidth = chart.config.options.horizontal_line.lineWidth;
                            }
                            ctx.lineWidth = lineWidth;

                            ctx.moveTo(xaxis.left, y);
                            ctx.lineTo(xaxis.right, y);
                            ctx.stroke();
                            ctx.restore();
                        });
                    }
                }
            });

            Chart.defaults.lineWithLine = Chart.helpers.clone(Chart.defaults.line);
            Chart.controllers.lineWithLine = Chart.controllers.line.extend({
                draw: function(ease) {
                    Chart.controllers.line.prototype.draw.call(this, ease);
                    var chart = this.chart;
                    var scale = this.scale;
                    var ctx = chart.chart.ctx;

                    // hline
                    if(chart.config.data.hasOwnProperty('hline') && chart.config.data.hline.enabled && chart.config.data.hline.value !== null){
                        var xaxis = chart.scales['x-axis-0'];
                        var yaxis = chart.scales['y-axis-0'];
                        var values = chart.config.data.hline.values;
                        var colors = chart.config.data.hline.colors;

                        if(values.constructor !== Array){
                            values = [values];
                        }

                        if(colors.constructor !== Array){
                            colors = [colors];
                        }

                        $.each( values, function( index, value ) {
                            var y = yaxis.getPixelForValue(value);
                            ctx.save();
                            ctx.beginPath();
                            if(colors.length > index){
                                ctx.strokeStyle = colors[index];
                            }else{
                                ctx.strokeStyle = colors[0];
                            }

                            ctx.lineWidth = chart.config.data.hline.width;
                            ctx.moveTo(xaxis.left, y);
                            ctx.lineTo(xaxis.right, y);
                            ctx.stroke();
                            ctx.restore();
                        });
                    }

                    if (this.chart.tooltip._active && this.chart.tooltip._active.length) {
                        var current_point = this.chart.tooltip._active[0],
                            ctx = this.chart.ctx,
                            x = current_point.tooltipPosition().x,
                            topY = this.chart.scales['y-axis-0'].top,
                            bottomY = this.chart.scales['y-axis-0'].bottom;

                        // Draw line
                        ctx.save();
                        ctx.beginPath();
                        ctx.moveTo(x, topY);
                        ctx.lineTo(x, bottomY);
                        ctx.lineWidth = 1;
                        ctx.strokeStyle = '#888';
                        ctx.stroke();
                        ctx.restore();
                    }
                }
            });

            var originalLineDraw = Chart.controllers.line.prototype.draw;
            Chart.helpers.extend(Chart.controllers.line.prototype, {
                draw: function(ease) {
                    var result = originalLineDraw.apply(this, arguments);

                    var helpers = Chart.helpers;
                    var chart = this.chart;
                    var ctx = chart.chart.ctx;

                    // Horizontal lines from data
                    if(chart.config.options.hasOwnProperty('horizontal_line') && chart.config.options.horizontal_line.enabled){
                        var xaxis = chart.scales['x-axis-0'];
                        var yaxis = chart.scales['y-axis-0'];
                        var horizontal_line_value = this.getDataset().horizontal_line_value;

                        if(horizontal_line_value.constructor !== Array){
                            horizontal_line_value = [horizontal_line_value];
                        }

                        $.each( horizontal_line_value, function( index, value ) {
                            var y = yaxis.getPixelForValue(value);
                            ctx.save();
                            ctx.beginPath();

                            var strokeStyle = 'rgba(0,0,0,0.2)';
                            if(chart.config.options.horizontal_line.hasOwnProperty('strokeStyle')){
                                strokeStyle = chart.config.options.horizontal_line.strokeStyle;
                            }
                            ctx.strokeStyle = strokeStyle;

                            var lineWidth = 2;
                            if(chart.config.options.horizontal_line.hasOwnProperty('lineWidth')){
                                lineWidth = chart.config.options.horizontal_line.lineWidth;
                            }
                            ctx.lineWidth = lineWidth;
                            ctx.moveTo(xaxis.left, y);
                            ctx.lineTo(xaxis.right, y);
                            ctx.stroke();
                            ctx.restore();
                        });
                    }

                    // Horizontal highlights
                    if(chart.config.options.hasOwnProperty('horizontal_highlights') && chart.config.options.horizontal_highlights.enabled){

                        var data = chart.config.options.horizontal_highlights.data;
                        if(data){
                            var xaxis = chart.scales['x-axis-0'];
                            var yaxis = chart.scales['y-axis-0'];
                            var lineWidth = 2;
                            if(chart.config.options.horizontal_highlights.hasOwnProperty('lineWidth')){
                                lineWidth = chart.config.options.horizontal_highlights.lineWidth;
                            }
                            var strokeStyle = chart.config.options.horizontal_highlights.strokeStyle;

                            for(var line_id=0; line_id < data.length; line_id++){
                                var y = yaxis.getPixelForValue(data[line_id].y_value);

                                if(data[line_id].color){
                                    if(data[line_id].color.startsWith('#')) {
                                        strokeStyle = self.hexToRGB(data[line_id].color, chart.config.options.horizontal_highlights.opacity).css;
                                    }
                                }

                                ctx.save();
                                ctx.beginPath();
                                ctx.strokeStyle = strokeStyle;
                                ctx.lineWidth = lineWidth;
                                ctx.moveTo(xaxis.left, y);
                                ctx.lineTo(xaxis.right, y);
                                ctx.stroke();
                                ctx.restore();

                                if(data[line_id].label){
                                    ctx.save();
                                    ctx.lineWidth = 0;

                                    if(chart.config.options.horizontal_highlights.label.fillStyle){
                                        ctx.fillStyle = self.colorCode(chart.config.options.horizontal_highlights.label.fillStyle, chart.config.options.horizontal_highlights.label.opacity);
                                    }else{
                                        ctx.fillStyle = self.colorCode('#000', chart.config.options.horizontal_highlights.label.opacity);
                                    }

                                    ctx.font = chart.config.options.horizontal_highlights.label.fontSize + ' ' + chart.config.options.horizontal_highlights.label.font;
                                    if(chart.config.options.horizontal_highlights.label.position === 'top-left') {
                                        ctx.textBaseline = 'bottom';
                                        ctx.textAlign = 'left';
                                        ctx.fillText(data[line_id].label, xaxis.left + 3, y);

                                    }else if(chart.config.options.horizontal_highlights.label.position === 'top-right') {
                                        ctx.textBaseline = 'bottom';
                                        ctx.textAlign = 'right';
                                        ctx.fillText(data[line_id].label, xaxis.right - 3, y);

                                    }else if(chart.config.options.horizontal_highlights.label.position === 'bottom-left') {
                                        ctx.textBaseline = 'top';
                                        ctx.textAlign = 'left';
                                        ctx.fillText(data[line_id].label, xaxis.left + 3, y+3);

                                    }else if(chart.config.options.horizontal_highlights.label.position === 'bottom-right') {
                                        ctx.textBaseline = 'top';
                                        ctx.textAlign = 'right';
                                        ctx.fillText(data[line_id].label, xaxis.right - 3, y+3);
                                    }

                                    ctx.restore();
                                }
                            }
                        }
                    }

                    // Vertical segments
                    if(chart.config.options.hasOwnProperty('vertical_segments') && chart.config.options.vertical_segments.enabled){
                        var data = null;
                        if(chart.config.options.vertical_segments.hasOwnProperty('data')){
                            data = chart.config.options.vertical_segments.data;
                            if(data){
                                var ctx = this.chart.ctx;
                                var xaxis = chart.scales['x-axis-0'];
                                var topY = this.chart.scales['y-axis-0'].top;
                                var bottomY = this.chart.scales['y-axis-0'].bottom;

                                for(var segment_id=0; segment_id < data.length; segment_id++){
                                    var x_start = xaxis.getPixelForValue(data[segment_id].start_value);
                                    var x_stop = xaxis.getPixelForValue(data[segment_id].stop_value);

                                    if(data[segment_id].color){
                                        ctx.save();
                                        ctx.lineWidth = 0;
                                        ctx.fillStyle = self.colorCode(data[segment_id].color, chart.config.options.vertical_segments.opacity);

                                        ctx.beginPath();
                                        ctx.fillRect(x_start, topY, (x_stop - x_start), (bottomY - topY));
                                        ctx.stroke();
                                        ctx.restore();
                                    }

                                    if(data[segment_id].label){
                                        ctx.save();
                                        ctx.lineWidth = 0;

                                        if(chart.config.options.vertical_segments.label.fillStyle){
                                            ctx.fillStyle = self.colorCode(chart.config.options.vertical_segments.label.fillStyle, chart.config.options.vertical_segments.label.opacity);
                                        }else{
                                            ctx.fillStyle = self.colorCode('#000', chart.config.options.vertical_segments.label.opacity);
                                        }

                                        ctx.font = chart.config.options.vertical_segments.label.fontSize + ' ' + chart.config.options.vertical_segments.label.font;
                                        if(chart.config.options.vertical_segments.label.position === 'top') {
                                            ctx.textBaseline = 'bottom';
                                            ctx.textAlign = 'left';

                                            ctx.translate(x_start, topY); //(bottomY - topY)/2.0);
                                            ctx.rotate(Math.PI / 2);
                                            ctx.fillText(data[segment_id].label, 3, -3); //x_start,topY + (bottomY - topY)/2.0);

                                        }else if(chart.config.options.vertical_segments.label.position === 'bottom') {
                                            ctx.textBaseline = 'bottom';
                                            ctx.textAlign = 'right';

                                            ctx.translate(x_start, bottomY); //(bottomY - topY)/2.0);
                                            ctx.rotate(Math.PI / 2);
                                            ctx.fillText(data[segment_id].label, -3, -3); //x_start,topY + (bottomY - topY)/2.0);
                                        }else if(chart.config.options.vertical_segments.label.position === 'middle') {
                                            ctx.textBaseline = 'bottom';
                                            ctx.textAlign = 'center';

                                            ctx.translate(x_start, topY + (bottomY - topY)/2.0);
                                            ctx.rotate(Math.PI / 2);
                                            ctx.fillText(data[segment_id].label,0, 0); //, x_start,topY + (bottomY - topY)/2.0);
                                        }
                                        ctx.restore();
                                    }


                                }

                            }
                        }
                    }

                    // Vertical line following the mouse
                    if(chart.config.options.hasOwnProperty('vertical_indicator_line') && chart.config.options.vertical_indicator_line.enabled){
                        if (this.chart.tooltip._active && this.chart.tooltip._active.length) {
                            var ctx = this.chart.ctx;
                            var topY = this.chart.scales['y-axis-0'].top;
                            var bottomY = this.chart.scales['y-axis-0'].bottom;

                            var lineWidth = 4;
                            if(chart.config.options.vertical_indicator_line.hasOwnProperty('lineWidth')){
                                lineWidth = chart.config.options.vertical_indicator_line.lineWidth;
                            }

                            var strokeStyle = 'rgba(0,0,0,0.2)';
                            if(chart.config.options.vertical_indicator_line.hasOwnProperty('strokeStyle')){
                                strokeStyle = chart.config.options.vertical_indicator_line.strokeStyle;
                            }

                            ctx.save();
                            ctx.lineWidth = lineWidth;
                            ctx.strokeStyle = strokeStyle;
                            for (var tooltip_id = 0; tooltip_id < this.chart.tooltip._active.length; tooltip_id++) {
                                var tooltip_x = this.chart.tooltip._active[0].tooltipPosition().x;
                                // Draw line
                                ctx.beginPath();
                                ctx.moveTo(tooltip_x, topY);
                                ctx.lineTo(tooltip_x, bottomY);
                                ctx.stroke();

                            }
                            ctx.restore();
                        }
                    }

                    // Horizontal line following the mouse
                    if(chart.config.options.hasOwnProperty('horizontal_indicator_line') && chart.config.options.horizontal_indicator_line.enabled){
                        if (this.chart.tooltip._active && this.chart.tooltip._active.length) {
                            var lineWidth = 2;
                            if(chart.config.options.horizontal_indicator_line.hasOwnProperty('lineWidth')){
                                lineWidth = chart.config.options.horizontal_indicator_line.lineWidth;
                            }

                            // Draw line
                            ctx.save();
                            ctx.lineWidth = lineWidth;

                            var yaxis = chart.scales['y-axis-0'];
                            for (var tooltip_id = 0; tooltip_id < this.chart.tooltip._active.length; tooltip_id++) {
                                var strokeStyle = 'rgba(160,160,160,0.5)';
                                var current_point = this.chart.tooltip._active[tooltip_id];

                                if(chart.config.options.horizontal_indicator_line.hasOwnProperty('strokeStyle') && chart.config.options.horizontal_indicator_line.strokeStyle){
                                    strokeStyle = self.colorCode(chart.config.options.horizontal_indicator_line.strokeStyle, 0.15);
                                }

                                ctx.strokeStyle = strokeStyle;

                                var ctx = this.chart.ctx;
                                var x = current_point._model.x;
                                var y = current_point._model.y;
                                var y_max = yaxis.getPixelForValue(this.getDataset().data_max[current_point._index]);
                                var y_min = yaxis.getPixelForValue(this.getDataset().data_min[current_point._index]);

                                var left = this.chart.scales['x-axis-0'].left;
                                var right = this.chart.scales['x-axis-0'].right;

                                if (chart.config.options.hasOwnProperty('error_bar') && chart.config.options.error_bar.enabled) {
                                    var fillStyle = 'rgba(0,0,0,0.1)';
                                    if (chart.config.options.horizontal_indicator_line.hasOwnProperty('fillStyle')) {
                                        fillStyle = chart.config.options.horizontal_indicator_line.fillStyle;
                                    }
                                    ctx.fillStyle = fillStyle;

                                    ctx.beginPath();
                                    ctx.fillRect(left, y_min, right - left, (y_max - y_min));
                                    ctx.stroke();
                                }

                                ctx.beginPath();
                                ctx.moveTo(left, y);
                                ctx.lineTo(right, y);
                                ctx.stroke();
                            }
                            ctx.restore();
                        }
                    }

                    // Don't render the stripes till we've finished animating
                    if (!this.rendered && ease !== 1) {
                        return;
                    }
                    this.rendered = true;

                    var meta = this.getMeta();
                    var yScale = this.getScaleForId(meta.yAxisID);
                    var data = this.getDataset().data;
                    var data_min = this.getDataset().data_min;
                    var data_max = this.getDataset().data_max;

                    // Interval
                    if(chart.config.options.hasOwnProperty('interval') && chart.config.options.interval.enabled) {
                        if (data_min && data_max) {
                            ctx.save();
                            ctx.strokeStyle = this.getDataset().backgroundColor;
                            ctx.fillStyle = this.getDataset().backgroundColor;

                            // set line width
                            var lineWidth = 0;
                            if(chart.config.options.interval.hasOwnProperty('lineWidth')){
                                lineWidth = chart.config.options.interval.lineWidth;
                            }
                            ctx.lineWidth = lineWidth;

                            ctx.beginPath();
                            // Initialize the data and bezier control points for the top of the stripe
                            helpers.each(meta.data, function (point, index) {
                                point._view.y = (yScale.getPixelForValue(data_max[index]));
                            });

                            // Draw the top of the stripe
                            helpers.each(meta.data, function (point, index) {
                                if (index === 0)
                                    ctx.moveTo(point._view.x, point._view.y);

                                else {
                                    var previous = helpers.previousItem(meta.data, index);
                                    //var next = helpers.nextItem(meta.data, index);

                                    helpers.canvas.lineTo(ctx, previous._view, point._view);
                                }
                            });

                            // Revert the data for the top of the stripe
                            // Initialize the data and bezier control points for the bottom of the stripe
                            helpers.each(meta.data, function (point, index) {
                                point._view.y = (yScale.getPixelForValue(data_min[index]));
                            });

                            // We are drawing the points in the reverse direction
                            meta.data.reverse();
                            //Chart.controllers.line.prototype.updateBezierControlPoints.apply(this);

                            // Draw the bottom of the stripe
                            helpers.each(meta.data, function (point, index) {
                                if (index === 0)
                                    ctx.lineTo(point._view.x, point._view.y);

                                else {
                                    var previous = helpers.previousItem(meta.data, index);
                                    //var next = helpers.nextItem(meta.data, index);

                                    helpers.canvas.lineTo(ctx, previous._view, point._view);
                                }

                            });

                            // Revert the data for the bottom of the stripe
                            meta.data.reverse();
                            helpers.each(meta.data, function (point, index) {
                                point._view.y = (yScale.getPixelForValue(data[index]));
                            });
                            //Chart.controllers.line.prototype.updateBezierControlPoints.apply(this);

                            ctx.stroke();
                            ctx.closePath();
                            ctx.fill();

                            ctx.restore();

                        }
                    }

                    // Error bars
                    if(chart.config.options.hasOwnProperty('error_bar') && chart.config.options.error_bar.enabled) {
                        var xaxis = chart.scales['x-axis-0'];
                        var yaxis = chart.scales['y-axis-0'];

                        var dataset = this.getDataset();
                        if (data_min && data_max) {
                            var x_tipWidth_pixel = 1.0;
                            var y_tipWidth_pixel = 1.0;

                            $.each( chart.getDatasetMeta(0).data, function( index, item ) {
                                var y = item._model.y;
                                var x = item._model.x;

                                ctx.save();

                                var strokeStyle = 'rgba(0,0,0,0.05)';
                                if(chart.config.options.error_bar.hasOwnProperty('strokeStyle')){
                                    strokeStyle = chart.config.options.error_bar.strokeStyle;
                                }

                                ctx.strokeStyle = strokeStyle;

                                var lineWidth = dataset.borderWidth;
                                if(chart.config.options.error_bar.hasOwnProperty('lineWidth')){
                                    lineWidth = chart.config.options.error_bar.lineWidth;
                                }
                                ctx.lineWidth = lineWidth;

                                var y_max = 0;
                                var y_min = 0;

                                if(typeof data_max[index] === 'object' && typeof data_min[index] === 'object'){
                                    if(data_max[index]){
                                        var x_max = xaxis.getPixelForValue(data_max[index].x);
                                        var x_min = xaxis.getPixelForValue(data_min[index].x);

                                        x_tipWidth_pixel = 10;
                                        y_tipWidth_pixel = 10;
                                        if(chart.config.options.error_bar.hasOwnProperty('tipWidth')) {
                                            x_tipWidth_pixel = chart.config.options.error_bar.tipWidth;
                                            y_tipWidth_pixel = chart.config.options.error_bar.tipWidth;
                                        }

                                        // X
                                        ctx.beginPath();
                                        ctx.moveTo(x_max, y - x_tipWidth_pixel / 2);
                                        ctx.lineTo(x_max, y + x_tipWidth_pixel / 2);
                                        ctx.stroke();

                                        ctx.beginPath();
                                        ctx.moveTo(x_min, y - x_tipWidth_pixel / 2);
                                        ctx.lineTo(x_min, y + x_tipWidth_pixel / 2);
                                        ctx.stroke();

                                        ctx.beginPath();
                                        ctx.moveTo(x_min, y);
                                        ctx.lineTo(x_max, y);
                                        ctx.stroke();

                                        var fillStyle = 'rgba(0,0,0,0.1)';
                                        if(chart.config.options.error_bar.hasOwnProperty('fillStyle')){
                                            fillStyle = chart.config.options.error_bar.fillStyle;
                                        }
                                        ctx.fillStyle = fillStyle;

                                        y_max = yaxis.getPixelForValue(data_max[index].y);
                                        y_min = yaxis.getPixelForValue(data_min[index].y);

                                        if(chart.config.options.error_bar.hasOwnProperty('bounding_box') && chart.config.options.error_bar.bounding_box) {
                                            ctx.beginPath();
                                            ctx.fillRect(x_min, y_min, (x_max - x_min), (y_max - y_min));
                                            ctx.stroke();
                                        }
                                    }


                                }else{
                                    //var tipWidth_ratio = 0.5;
                                    if(chart.config.options.error_bar.hasOwnProperty('tipWidth')){
                                        x_tipWidth_pixel = chart.config.options.error_bar.tipWidth;

                                        // Equally spaced x-axis
                                        y_tipWidth_pixel = (chart.getDatasetMeta(0).data[1]._model.x - chart.getDatasetMeta(0).data[0]._model.x) / 2 * chart.config.options.error_bar.tipWidth;
                                    }

                                    y_max = yaxis.getPixelForValue(data_max[index]);
                                    y_min = yaxis.getPixelForValue(data_min[index]);
                                }

                                // Y
                                ctx.beginPath();
                                ctx.moveTo(x - y_tipWidth_pixel / 2, y_max);
                                ctx.lineTo(x + y_tipWidth_pixel / 2, y_max);
                                ctx.stroke();

                                ctx.beginPath();
                                ctx.moveTo(x - y_tipWidth_pixel / 2, y_min);
                                ctx.lineTo(x + y_tipWidth_pixel / 2, y_min);
                                ctx.stroke();

                                ctx.beginPath();
                                ctx.moveTo(x, y_max);
                                ctx.lineTo(x, y_min);
                                ctx.stroke();

                                ctx.restore();
                            });
                        }
                    }

                    return result;
                }
            });

            /*
            Chart.defaults.stripe = Chart.helpers.clone(Chart.defaults.line);
            Chart.controllers.stripe = Chart.controllers.line.extend({
                draw: function(ease) {
                    var result = Chart.controllers.line.prototype.draw.apply(this, arguments);

                    var helpers = Chart.helpers;
                    var chart = this.chart;
                    var ctx = chart.chart.ctx;

                    // Horizontal lines from data
                    if(chart.config.options.hasOwnProperty('horizontal_line') && chart.config.options.horizontal_line.enabled){
                        var xaxis = chart.scales['x-axis-0'];
                        var yaxis = chart.scales['y-axis-0'];
                        var horizontal_line_value = this.getDataset().horizontal_line_value;

                        if(horizontal_line_value.constructor !== Array){
                            horizontal_line_value = [horizontal_line_value];
                        }

                        $.each( horizontal_line_value, function( index, value ) {
                            var y = yaxis.getPixelForValue(value);
                            ctx.save();
                            ctx.beginPath();

                            var strokeStyle = 'rgba(0,0,0,0.2)';
                            if(chart.config.options.horizontal_line.hasOwnProperty('strokeStyle')){
                                strokeStyle = chart.config.options.horizontal_line.strokeStyle;
                            }
                            ctx.strokeStyle = strokeStyle;

                            var lineWidth = 2;
                            if(chart.config.options.horizontal_line.hasOwnProperty('lineWidth')){
                                lineWidth = chart.config.options.horizontal_line.lineWidth;
                            }
                            ctx.lineWidth = lineWidth;
                            ctx.moveTo(xaxis.left, y);
                            ctx.lineTo(xaxis.right, y);
                            ctx.stroke();
                            ctx.restore();
                        });
                    }

                    // Horizontal highlights
                    if(chart.config.options.hasOwnProperty('horizontal_highlights') && chart.config.options.horizontal_highlights.enabled){

                        var data = chart.config.options.horizontal_highlights.data;
                        if(data){
                            var xaxis = chart.scales['x-axis-0'];
                            var yaxis = chart.scales['y-axis-0'];
                            var lineWidth = 2;
                            if(chart.config.options.horizontal_highlights.hasOwnProperty('lineWidth')){
                                lineWidth = chart.config.options.horizontal_highlights.lineWidth;
                            }
                            var strokeStyle = chart.config.options.horizontal_highlights.strokeStyle;

                            for(var line_id=0; line_id < data.length; line_id++){
                                var y = yaxis.getPixelForValue(data[line_id].y_value);

                                if(data[line_id].color){
                                    if(data[line_id].color.startsWith('#')) {
                                        strokeStyle = self.hexToRGB(data[line_id].color, chart.config.options.horizontal_highlights.opacity).css;
                                    }
                                }

                                ctx.save();
                                ctx.beginPath();
                                ctx.strokeStyle = strokeStyle;
                                ctx.lineWidth = lineWidth;
                                ctx.moveTo(xaxis.left, y);
                                ctx.lineTo(xaxis.right, y);
                                ctx.stroke();
                                ctx.restore();

                                if(data[line_id].label){
                                    ctx.save();
                                    ctx.lineWidth = 0;

                                    if(chart.config.options.horizontal_highlights.label.fillStyle) {
                                        ctx.fillStyle = self.colorCode(chart.config.options.horizontal_highlights.label.fillStyle, chart.config.options.horizontal_highlights.label.opacity);
                                    }else{
                                        ctx.fillStyle = self.colorCode('#000', chart.config.options.horizontal_highlights.label.opacity);
                                    }

                                    ctx.font = chart.config.options.horizontal_highlights.label.fontSize + ' ' + chart.config.options.horizontal_highlights.label.font;
                                    if(chart.config.options.horizontal_highlights.label.position === 'top-left') {
                                        ctx.textBaseline = 'bottom';
                                        ctx.textAlign = 'left';
                                        ctx.fillText(data[line_id].label, xaxis.left + 3, y);

                                    }else if(chart.config.options.horizontal_highlights.label.position === 'top-right') {
                                        ctx.textBaseline = 'bottom';
                                        ctx.textAlign = 'right';
                                        ctx.fillText(data[line_id].label, xaxis.right - 3, y);

                                    }else if(chart.config.options.horizontal_highlights.label.position === 'bottom-left') {
                                        ctx.textBaseline = 'top';
                                        ctx.textAlign = 'left';
                                        ctx.fillText(data[line_id].label, xaxis.left + 3, y+3);

                                    }else if(chart.config.options.horizontal_highlights.label.position === 'bottom-right') {
                                        ctx.textBaseline = 'top';
                                        ctx.textAlign = 'right';
                                        ctx.fillText(data[line_id].label, xaxis.right - 3, y+3);
                                    }

                                    ctx.restore();
                                }
                            }
                        }
                    }

                    // Vertical segments
                    if(chart.config.options.hasOwnProperty('vertical_segments') && chart.config.options.vertical_segments.enabled){
                        var data = null;
                        if(chart.config.options.vertical_segments.hasOwnProperty('data')){
                            data = chart.config.options.vertical_segments.data;
                            if(data){
                                var ctx = this.chart.ctx;
                                var xaxis = chart.scales['x-axis-0'];
                                var topY = this.chart.scales['y-axis-0'].top;
                                var bottomY = this.chart.scales['y-axis-0'].bottom;


                                for(var segment_id=0; segment_id < data.length; segment_id++){
                                    var x_start = xaxis.getPixelForValue(data[segment_id].start_value);
                                    var x_stop = xaxis.getPixelForValue(data[segment_id].stop_value);

                                    if(data[segment_id].color){
                                        ctx.save();
                                        ctx.lineWidth = 0;
                                        ctx.fillStyle = self.colorCode(data[segment_id].color, chart.config.options.vertical_segments.opacity);

                                        ctx.beginPath();
                                        ctx.fillRect(x_start, topY, (x_stop - x_start), (bottomY - topY));
                                        ctx.stroke();
                                        ctx.restore();
                                    }

                                    if(data[segment_id].label){
                                        ctx.save();
                                        ctx.lineWidth = 0;
                                        if(chart.config.options.vertical_segments.label.fillStyle){
                                            ctx.fillStyle = self.colorCode(chart.config.options.vertical_segments.label.fillStyle, chart.config.options.vertical_segments.label.opacity);
                                        }else{
                                            ctx.fillStyle = self.colorCode('#000', chart.config.options.vertical_segments.label.opacity);
                                        }

                                        ctx.font = chart.config.options.vertical_segments.label.fontSize + ' ' + chart.config.options.vertical_segments.label.font;
                                        if(chart.config.options.vertical_segments.label.position === 'top') {
                                            ctx.textBaseline = 'bottom';
                                            ctx.textAlign = 'left';

                                            ctx.translate(x_start, topY); //(bottomY - topY)/2.0);
                                            ctx.rotate(Math.PI / 2);
                                            ctx.fillText(data[segment_id].label, 3, -3); //x_start,topY + (bottomY - topY)/2.0);

                                        }else if(chart.config.options.vertical_segments.label.position === 'bottom') {
                                            ctx.textBaseline = 'bottom';
                                            ctx.textAlign = 'right';

                                            ctx.translate(x_start, bottomY); //(bottomY - topY)/2.0);
                                            ctx.rotate(Math.PI / 2);
                                            ctx.fillText(data[segment_id].label, -3, -3); //x_start,topY + (bottomY - topY)/2.0);
                                        }else if(chart.config.options.vertical_segments.label.position === 'middle') {
                                            ctx.textBaseline = 'bottom';
                                            ctx.textAlign = 'center';

                                            ctx.translate(x_start, topY + (bottomY - topY)/2.0);
                                            ctx.rotate(Math.PI / 2);
                                            ctx.fillText(data[segment_id].label,0, 0); //, x_start,topY + (bottomY - topY)/2.0);
                                        }
                                        ctx.restore();
                                    }


                                }

                            }
                        }
                    }

                    // Vertical line following the mouse
                    if(chart.config.options.hasOwnProperty('vertical_indicator_line') && chart.config.options.vertical_indicator_line.enabled){
                        if (this.chart.tooltip._active && this.chart.tooltip._active.length) {
                            var ctx = this.chart.ctx;
                            var topY = this.chart.scales['y-axis-0'].top;
                            var bottomY = this.chart.scales['y-axis-0'].bottom;

                            var lineWidth = 4;
                            if(chart.config.options.vertical_indicator_line.hasOwnProperty('lineWidth')){
                                lineWidth = chart.config.options.vertical_indicator_line.lineWidth;
                            }

                            var strokeStyle = 'rgba(0,0,0,0.2)';
                            if(chart.config.options.vertical_indicator_line.hasOwnProperty('strokeStyle')){
                                strokeStyle = chart.config.options.vertical_indicator_line.strokeStyle;
                            }

                            ctx.save();
                            ctx.lineWidth = lineWidth;
                            ctx.strokeStyle = strokeStyle;
                            for (var i = 0; i < this.chart.tooltip._active.length; i++) {
                                var current_point = this.chart.tooltip._active[0];
                                var x = current_point.tooltipPosition().x;
                                // Draw line

                                ctx.beginPath();
                                ctx.moveTo(x, topY);
                                ctx.lineTo(x, bottomY);
                                ctx.stroke();

                            }
                            ctx.restore();
                        }
                    }

                    // Horizontal line following the mouse
                    if(chart.config.options.hasOwnProperty('horizontal_indicator_line') && chart.config.options.horizontal_indicator_line.enabled){
                        if (this.chart.tooltip._active && this.chart.tooltip._active.length) {
                            var lineWidth = 2;
                            if(chart.config.options.horizontal_indicator_line.hasOwnProperty('lineWidth')){
                                lineWidth = chart.config.options.horizontal_indicator_line.lineWidth;
                            }

                            var strokeStyle = 'rgba(0,0,0,0.8)';

                            // Draw line
                            ctx.save();
                            ctx.lineWidth = lineWidth;

                            var yaxis = chart.scales['y-axis-0'];
                            for (var i = 0; i < this.chart.tooltip._active.length; i++) {
                                var current_point = this.chart.tooltip._active[i];

                                if(chart.config.options.horizontal_indicator_line.hasOwnProperty('strokeStyle') && chart.config.options.horizontal_indicator_line.strokeStyle){
                                    strokeStyle = chart.config.options.horizontal_indicator_line.strokeStyle;
                                }else{
                                    strokeStyle = self.colorCode(current_point._model.borderColor, 0.15);
                                }
                                ctx.strokeStyle = strokeStyle;

                                var ctx = this.chart.ctx;
                                var x = current_point._model.x;
                                var y = current_point._model.y;
                                var y_max = yaxis.getPixelForValue(this.getDataset().data_max[current_point._index]);
                                var y_min = yaxis.getPixelForValue(this.getDataset().data_min[current_point._index]);

                                var left = this.chart.scales['x-axis-0'].left;
                                var right = this.chart.scales['x-axis-0'].right;


                                if (chart.config.options.hasOwnProperty('error_bar') && chart.config.options.error_bar.enabled) {
                                    var fillStyle = 'rgba(0,0,0,0.1)';
                                    if (chart.config.options.horizontal_indicator_line.hasOwnProperty('fillStyle')) {
                                        fillStyle = chart.config.options.horizontal_indicator_line.fillStyle;
                                    }
                                    ctx.fillStyle = fillStyle;

                                    ctxx.beginPath();
                                    ctx.fillRect(left, y_min, right - left, (y_max - y_min));
                                    ctx.stroke();
                                }

                                ctx.beginPath();
                                ctx.moveTo(left, y);
                                ctx.lineTo(right, y);
                                ctx.stroke();
                            }
                            ctx.restore();
                        }
                    }

                    // Don't render the stripes till we've finished animating
                    if (!this.rendered && ease !== 1) {
                        return;
                    }
                    this.rendered = true;

                    var meta = this.getMeta();
                    var yScale = this.getScaleForId(meta.yAxisID);
                    var data = this.getDataset().data;
                    var data_min = this.getDataset().data_min;
                    var data_max = this.getDataset().data_max;

                    // Interval
                    if(chart.config.options.hasOwnProperty('interval') && chart.config.options.interval.enabled) {
                        if (data_min && data_max) {
                            ctx.save();
                            ctx.fillStyle = this.getDataset().backgroundColor;

                            // set line width
                            var lineWidth = 0.4;
                            if(chart.config.options.interval.hasOwnProperty('lineWidth')){
                                lineWidth = chart.config.options.interval.lineWidth;
                            }
                            ctx.lineWidth = lineWidth;

                            ctx.beginPath();
                            // Initialize the data and bezier control points for the top of the stripe
                            helpers.each(meta.data, function (point, index) {
                                point._view.y = (yScale.getPixelForValue(data_max[index]));
                            });

                            //Chart.controllers.line.prototype.updateBezierControlPoints.apply(this);

                            // Draw the top of the stripe
                            helpers.each(meta.data, function (point, index) {
                                if (index === 0)
                                    ctx.moveTo(point._view.x, point._view.y);

                                else {
                                    var previous = helpers.previousItem(meta.data, index);
                                    //var next = helpers.nextItem(meta.data, index);

                                    helpers.canvas.lineTo(ctx, previous._view, point._view);
                                }
                            });

                            // Revert the data for the top of the stripe
                            // Initialize the data and bezier control points for the bottom of the stripe
                            helpers.each(meta.data, function (point, index) {
                                point._view.y = (yScale.getPixelForValue(data_min[index]));
                            });

                            // We are drawing the points in the reverse direction
                            meta.data.reverse();
                            //Chart.controllers.line.prototype.updateBezierControlPoints.apply(this);

                            // Draw the bottom of the stripe
                            helpers.each(meta.data, function (point, index) {
                                if (index === 0)
                                    ctx.lineTo(point._view.x, point._view.y);

                                else {
                                    var previous = helpers.previousItem(meta.data, index);
                                    //var next = helpers.nextItem(meta.data, index);

                                    helpers.canvas.lineTo(ctx, previous._view, point._view);
                                }

                            });

                            // Revert the data for the bottom of the stripe
                            meta.data.reverse();
                            helpers.each(meta.data, function (point, index) {
                                point._view.y = (yScale.getPixelForValue(data[index]));
                            });
                            //Chart.controllers.line.prototype.updateBezierControlPoints.apply(this);

                            ctx.stroke();
                            ctx.closePath();
                            ctx.fill();
                            ctx.restore();

                        }
                    }

                    // Error bars
                    if(chart.config.options.hasOwnProperty('error_bar') && chart.config.options.error_bar.enabled) {
                        var xaxis = chart.scales['x-axis-0'];
                        var yaxis = chart.scales['y-axis-0'];

                        var dataset = this.getDataset();
                        if (data_min && data_max) {
                            var x_tipWidth_pixel = 1.0;
                            var y_tipWidth_pixel = 1.0;

                            $.each( chart.getDatasetMeta(0).data, function( index, item ) {
                                var y = item._model.y;
                                var x = item._model.x;

                                ctx.save();

                                var strokeStyle = 'rgba(0,0,0,0.2)';
                                if(chart.config.options.error_bar.hasOwnProperty('strokeStyle')){
                                    strokeStyle = chart.config.options.error_bar.strokeStyle;
                                }

                                ctx.strokeStyle = strokeStyle;

                                var lineWidth = dataset.borderWidth;
                                if(chart.config.options.error_bar.hasOwnProperty('lineWidth')){
                                    lineWidth = chart.config.options.error_bar.lineWidth;
                                }
                                ctx.lineWidth = lineWidth;

                                var y_max = 0;
                                var y_min = 0;

                                if(typeof data_max[index] === 'object' && typeof data_min[index] === 'object'){
                                    if(data_max[index]){
                                        var x_max = xaxis.getPixelForValue(data_max[index].x);
                                        var x_min = xaxis.getPixelForValue(data_min[index].x);

                                        x_tipWidth_pixel = 10;
                                        y_tipWidth_pixel = 10;
                                        if(chart.config.options.error_bar.hasOwnProperty('tipWidth')) {
                                            x_tipWidth_pixel = chart.config.options.error_bar.tipWidth;
                                            y_tipWidth_pixel = chart.config.options.error_bar.tipWidth;
                                        }

                                        // X
                                        ctx.beginPath();
                                        ctx.moveTo(x_max, y - x_tipWidth_pixel / 2);
                                        ctx.lineTo(x_max, y + x_tipWidth_pixel / 2);
                                        ctx.stroke();

                                        ctx.beginPath();
                                        ctx.moveTo(x_min, y - x_tipWidth_pixel / 2);
                                        ctx.lineTo(x_min, y + x_tipWidth_pixel / 2);
                                        ctx.stroke();

                                        ctx.beginPath();
                                        ctx.moveTo(x_min, y);
                                        ctx.lineTo(x_max, y);
                                        ctx.stroke();

                                        var fillStyle = 'rgba(0,0,0,0.1)';
                                        if(chart.config.options.error_bar.hasOwnProperty('fillStyle')){
                                            fillStyle = chart.config.options.error_bar.fillStyle;
                                        }
                                        ctx.fillStyle = fillStyle;

                                        y_max = yaxis.getPixelForValue(data_max[index].y);
                                        y_min = yaxis.getPixelForValue(data_min[index].y);

                                        if(chart.config.options.error_bar.hasOwnProperty('bounding_box') && chart.config.options.error_bar.bounding_box) {
                                            ctx.beginPath();
                                            ctx.fillRect(x_min, y_min, (x_max - x_min), (y_max - y_min));
                                            ctx.stroke();
                                        }
                                    }


                                }else{
                                    //var tipWidth_ratio = 0.5;
                                    if(chart.config.options.error_bar.hasOwnProperty('tipWidth')){
                                        x_tipWidth_pixel = chart.config.options.error_bar.tipWidth;

                                        // Equally spaced x-axis
                                        y_tipWidth_pixel = (chart.getDatasetMeta(0).data[1]._model.x - chart.getDatasetMeta(0).data[0]._model.x) / 2 * chart.config.options.error_bar.tipWidth;
                                    }

                                    y_max = yaxis.getPixelForValue(data_max[index]);
                                    y_min = yaxis.getPixelForValue(data_min[index]);
                                }

                                // Y
                                ctx.beginPath();
                                ctx.moveTo(x - y_tipWidth_pixel / 2, y_max);
                                ctx.lineTo(x + y_tipWidth_pixel / 2, y_max);
                                ctx.stroke();

                                ctx.beginPath();
                                ctx.moveTo(x - y_tipWidth_pixel / 2, y_min);
                                ctx.lineTo(x + y_tipWidth_pixel / 2, y_min);
                                ctx.stroke();

                                ctx.beginPath();
                                ctx.moveTo(x, y_max);
                                ctx.lineTo(x, y_min);
                                ctx.stroke();

                                ctx.restore();
                            });
                        }
                    }

                    return result;
                }
            });
            */
            Chart.defaults.scatterWithLine = Chart.defaults.scatter;
            Chart.controllers.scatterWithLine = Chart.controllers.scatter.extend({
                draw: function(ease) {
                    Chart.controllers.line.prototype.draw.call(this, ease);
                    var chart = this.chart;
                    var scale = this.scale;
                    var ctx = chart.chart.ctx;
                    if(chart.config.data.hasOwnProperty('hline') && chart.config.data.hline.enabled && chart.config.data.hline.value !== null){
                        var xaxis = chart.scales['x-axis-1'];
                        var yaxis = chart.scales['y-axis-1'];
                        var values = chart.config.data.hline.values;
                        var colors = chart.config.data.hline.colors;

                        if(values.constructor !== Array){
                            values = [values];
                        }

                        if(colors.constructor !== Array){
                            colors = [colors];
                        }

                        $.each( values, function( index, value ) {
                            var y = yaxis.getPixelForValue(value);
                            ctx.save();
                            ctx.beginPath();
                            if(colors.length > index){
                                ctx.strokeStyle = colors[index];
                            }else{
                                ctx.strokeStyle = colors[0];
                            }

                            ctx.lineWidth = chart.config.data.hline.width;
                            ctx.moveTo(xaxis.left, y);
                            ctx.lineTo(xaxis.right, y);
                            ctx.stroke();
                            ctx.restore();
                        });
                    }

                    if (this.chart.tooltip._active && this.chart.tooltip._active.length) {
                        var current_point = this.chart.tooltip._active[0],
                            ctx = this.chart.ctx,
                            x = current_point.tooltipPosition().x,
                            topY = this.chart.scales['y-axis-1'].top,
                            bottomY = this.chart.scales['y-axis-1'].bottom;

                        // draw line
                        ctx.save();
                        ctx.beginPath();
                        ctx.moveTo(x, topY);
                        ctx.lineTo(x, bottomY);
                        ctx.lineWidth = 1;
                        ctx.strokeStyle = '#888';
                        ctx.stroke();
                        ctx.restore();
                    }
                }
            });

            Chart.defaults.barWithLine = Chart.defaults.bar;
            Chart.controllers.barWithLine = Chart.controllers.bar.extend({
                draw: function(ease) {
                    Chart.controllers.bar.prototype.draw.call(this, ease);
                    var chart = this.chart;
                    var scale = this.scale;
                    var ctx = chart.chart.ctx;

                    if(chart.config.data.hasOwnProperty('hline') && chart.config.data.hline.enabled && chart.config.data.hline.value !== null){
                        var xaxis = chart.scales['x-axis-0'];
                        var yaxis = chart.scales['y-axis-0'];
                        var values = chart.config.data.hline.values;
                        var colors = chart.config.data.hline.colors;

                        if(values.constructor !== Array){
                            values = [values];
                        }

                        if(colors.constructor !== Array){
                            colors = [colors];
                        }

                        $.each( values, function( index, value ) {
                            var y = yaxis.getPixelForValue(value);
                            ctx.save();
                            ctx.beginPath();
                            if(colors.length > index){
                                ctx.strokeStyle = colors[index];
                            }else{
                                ctx.strokeStyle = colors[0];
                            }

                            ctx.lineWidth = chart.config.data.hline.width;
                            ctx.moveTo(xaxis.left, y);
                            ctx.lineTo(xaxis.right, y);
                            ctx.stroke();
                            ctx.restore();
                        });
                    }
                }
            });

            Chart.defaults.barError = Chart.defaults.bar;
            Chart.controllers.barError = Chart.controllers.bar.extend({
                draw: function(ease) {
                    Chart.controllers.bar.prototype.draw.call(this, ease);
                    var chart = this.chart;
                    var scale = this.scale;
                    var ctx = chart.chart.ctx;

                    var helpers = Chart.helpers;
                    var meta = this.getMeta();
                    var dataset = this.getDataset();

                    var yScale = this.getScaleForId(meta.yAxisID);
                    var yScaleZeroPixel = yScale.getPixelForValue(0);

                    var data = this.getMeta().data;

                    var data_min = this.getDataset().data_min;
                    var data_max = this.getDataset().data_max;

                    // Don't render the whiskers till we have finished animating
                    if (!this.rendered && ease !== 1) {
                        return;
                    }

                    var yaxis = chart.scales['y-axis-0'];
                    var barWidth = chart.getDatasetMeta(0).data[0]._model.width;

                    this.rendered = true;

                    // Horizontal lines from data
                    if(chart.config.options.hasOwnProperty('horizontal_indicator_line') && chart.config.options.horizontal_indicator_line.enabled){
                        if (this.chart.tooltip._active && this.chart.tooltip._active.length) {
                            var current_point = this.chart.tooltip._active[0];
                            var ctx = this.chart.ctx;
                            var x = current_point._model.x;
                            var y = current_point._model.y;
                            var y_max = yaxis.getPixelForValue(this.getDataset().data_max[current_point._index]);
                            var y_min = yaxis.getPixelForValue(this.getDataset().data_min[current_point._index]);

                            var left = this.chart.scales['x-axis-0'].left;
                            var right = this.chart.scales['x-axis-0'].right;

                            var lineWidth = 2;
                            if(chart.config.options.horizontal_indicator_line.hasOwnProperty('lineWidth')){
                                lineWidth = chart.config.options.horizontal_indicator_line.lineWidth;
                            }

                            var strokeStyle = 'rgba(0,0,0,0.8)';
                            if(chart.config.options.horizontal_indicator_line.hasOwnProperty('strokeStyle')){
                                strokeStyle = chart.config.options.horizontal_indicator_line.strokeStyle;
                            }

                            // Draw line
                            ctx.save();
                            ctx.lineWidth = lineWidth;
                            ctx.strokeStyle = strokeStyle;

                            if(chart.config.options.hasOwnProperty('error_bar') && chart.config.options.error_bar.enabled) {
                                var fillStyle = 'rgba(0,0,0,0.1)';
                                if(chart.config.options.horizontal_indicator_line.hasOwnProperty('fillStyle')){
                                    fillStyle = chart.config.options.horizontal_indicator_line.fillStyle;
                                }

                                ctx.fillStyle = fillStyle;

                                ctx.beginPath();
                                ctx.fillRect(left, y_min, right - left, (y_max - y_min));
                                ctx.stroke();
                            }

                            ctx.beginPath();
                            ctx.moveTo(left, y);
                            ctx.lineTo(right, y);
                            ctx.stroke();

                            ctx.restore();
                        }
                    }

                    // Horizontal highlights
                    if(chart.config.options.hasOwnProperty('horizontal_highlights') && chart.config.options.horizontal_highlights.enabled){

                        var data = chart.config.options.horizontal_highlights.data;
                        if(data){
                            var xaxis = chart.scales['x-axis-0'];
                            var yaxis = chart.scales['y-axis-0'];
                            var lineWidth = 2;
                            if(chart.config.options.horizontal_highlights.hasOwnProperty('lineWidth')){
                                lineWidth = chart.config.options.horizontal_highlights.lineWidth;
                            }
                            var strokeStyle = chart.config.options.horizontal_highlights.strokeStyle;

                            for(var line_id=0; line_id < data.length; line_id++){
                                var y = yaxis.getPixelForValue(data[line_id].y_value);

                                if(data[line_id].color){
                                    if(data[line_id].color.startsWith('#')) {
                                        strokeStyle = self.hexToRGB(data[line_id].color, chart.config.options.horizontal_highlights.opacity).css;
                                    }
                                }

                                ctx.save();
                                ctx.beginPath();
                                ctx.strokeStyle = strokeStyle;
                                ctx.lineWidth = lineWidth;
                                ctx.moveTo(xaxis.left, y);
                                ctx.lineTo(xaxis.right, y);
                                ctx.stroke();
                                ctx.restore();

                                if(data[line_id].label){
                                    ctx.save();
                                    ctx.lineWidth = 0;
                                    if(chart.config.options.horizontal_highlights.label.fillStyle){
                                        ctx.fillStyle = self.colorCode(chart.config.options.horizontal_highlights.label.fillStyle, chart.config.options.horizontal_highlights.label.opacity);
                                    }else{
                                        ctx.fillStyle = self.colorCode('#000', chart.config.options.horizontal_highlights.label.opacity);
                                    }

                                    ctx.font = chart.config.options.horizontal_highlights.label.fontSize + ' ' + chart.config.options.horizontal_highlights.label.font;
                                    if(chart.config.options.horizontal_highlights.label.position === 'top-left') {
                                        ctx.textBaseline = 'bottom';
                                        ctx.textAlign = 'left';
                                        ctx.fillText(data[line_id].label, xaxis.left + 3, y);

                                    }else if(chart.config.options.horizontal_highlights.label.position === 'top-right') {
                                        ctx.textBaseline = 'bottom';
                                        ctx.textAlign = 'right';
                                        ctx.fillText(data[line_id].label, xaxis.right - 3, y);

                                    }else if(chart.config.options.horizontal_highlights.label.position === 'bottom-left') {
                                        ctx.textBaseline = 'top';
                                        ctx.textAlign = 'left';
                                        ctx.fillText(data[line_id].label, xaxis.left + 3, y+3);

                                    }else if(chart.config.options.horizontal_highlights.label.position === 'bottom-right') {
                                        ctx.textBaseline = 'top';
                                        ctx.textAlign = 'right';
                                        ctx.fillText(data[line_id].label, xaxis.right - 3, y+3);
                                    }

                                    ctx.restore();
                                }
                            }
                        }
                    }

                    // Vertical line following the mouse
                    if(chart.config.options.hasOwnProperty('vertical_indicator_line') && chart.config.options.vertical_indicator_line.enabled){
                        if (this.chart.tooltip._active && this.chart.tooltip._active.length) {
                            var current_point = this.chart.tooltip._active[0];
                            var ctx = this.chart.ctx;
                            var x = current_point.tooltipPosition().x;
                            var topY = this.chart.scales['y-axis-0'].top;
                            var bottomY = this.chart.scales['y-axis-0'].bottom;

                            var lineWidth = 4;
                            if(chart.config.options.vertical_indicator_line.hasOwnProperty('lineWidth')){
                                lineWidth = chart.config.options.vertical_indicator_line.lineWidth;
                            }

                            var strokeStyle = 'rgba(0,0,0,0.2)';
                            if(chart.config.options.vertical_indicator_line.hasOwnProperty('strokeStyle')){
                                strokeStyle = chart.config.options.vertical_indicator_line.strokeStyle;
                            }

                            // Draw line
                            ctx.save();
                            ctx.beginPath();
                            ctx.moveTo(x, topY);
                            ctx.lineTo(x, bottomY);
                            ctx.lineWidth = lineWidth;
                            ctx.strokeStyle = strokeStyle;
                            ctx.stroke();
                            ctx.restore();
                        }
                    }

                    if(chart.config.options.hasOwnProperty('error_bar') && chart.config.options.error_bar.enabled) {
                        if (data_min && data_max) {
                            $.each( data, function( index, item ) {
                                if(item.hasOwnProperty('_model')){
                                    var y = item._model.y;
                                    var x = item._model.x;

                                    var y_max = yaxis.getPixelForValue(data_max[index]);
                                    var y_min = yaxis.getPixelForValue(data_min[index]);

                                    ctx.save();

                                    // Stroke style
                                    var strokeStyle = dataset.borderColor[index];
                                    if(chart.config.options.error_bar.hasOwnProperty('strokeStyle')){
                                        if(chart.config.options.error_bar.strokeStyle !== null ){
                                            strokeStyle = chart.config.options.error_bar.strokeStyle;
                                        }
                                    }
                                    ctx.strokeStyle = strokeStyle;

                                    // Line width
                                    var lineWidth = dataset.borderWidth;
                                    if(chart.config.options.error_bar.hasOwnProperty('lineWidth')){
                                        if(chart.config.options.error_bar.lineWidth !== null ) {
                                            lineWidth = chart.config.options.error_bar.lineWidth;
                                        }
                                    }
                                    ctx.lineWidth = lineWidth;

                                    // Tip width
                                    var tipWidth = barWidth/4 * 2;
                                    if(chart.config.options.error_bar.hasOwnProperty('tipWidth')){
                                        if(chart.config.options.error_bar.tipWidth !== null ) {
                                            tipWidth = chart.config.options.error_bar.tipWidth;
                                        }
                                    }

                                    ctx.beginPath();
                                    ctx.moveTo(x - tipWidth/2, y_max);
                                    ctx.lineTo(x + tipWidth/2, y_max);
                                    ctx.stroke();

                                    ctx.beginPath();
                                    ctx.moveTo(x - tipWidth/2, y_min);
                                    ctx.lineTo(x + tipWidth/2, y_min);
                                    ctx.stroke();

                                    ctx.beginPath();
                                    ctx.moveTo(x, y_max);
                                    ctx.lineTo(x, y_min);
                                    ctx.stroke();

                                    ctx.restore();
                                }
                            });
                        }
                    }
                }
            });

            // Tooltip positioners
            Chart.Tooltip.positioners.line_centered_top = function(elements, eventPosition) {
                return {
                    x: elements[0]._model.x,
                    y: 0
                };
            };
            Chart.Tooltip.positioners.line_centered_bottom = function(elements, eventPosition) {
                return {
                    x: elements[0]._model.x,
                    y: elements[0]._chart.height
                };
            };
            Chart.Tooltip.positioners.inline_centered_bottom = function(elements, eventPosition) {
                return {
                    x: elements[0]._model.x,
                    y: elements[0]._chart.height
                };
            };

        },
        addToolbar: function(){
            var self = this;

            this.options.element.chart_mode_selector += this.uniqueId;
            this.options.element.table_mode_selector += this.uniqueId;

            // Create toolbar html and add it to the DOM
            var toolbar_html = '';

            toolbar_html += '<div id="datatable_toolbar'+this.uniqueId+'" class="datatable-toolbar" ';
            if(!this.options.show_toolbar){
                toolbar_html += ' style="display: none;" ';
            }
            toolbar_html += '>';


            var active = ' ';
            var pressed = 'false';
            if (this.options.table_default_mode === 'show') {
                active = ' active ';
                pressed = 'true';
            }

            toolbar_html += '<button type="button" class="' + this.options.button_css.table + active + '" id="' + this.options.element.table_mode_selector + '" data-toggle="button" aria-pressed="' + pressed + '" autocomplete="off" ';
            if(!this.options.show_table_selector) {
                toolbar_html += ' style="display: none;" ';
            }
            toolbar_html += '>';
            toolbar_html += this.options.icon.table + ' ' + this.options.label.table;
            toolbar_html += '</button>&nbsp;';


            toolbar_html += '<div class="btn-group" data-toggle="buttons" id="'+this.options.element.chart_mode_selector+'">';

            // Bar chart selection button
            if(this.options.chart_modes.indexOf('bar') > -1){
                var active = '';
                if(this.options.chart_default_mode == 'bar'){
                    active = ' active ';
                }
                toolbar_html += '<label class="'+this.options.button_css.bar+active+'" data-mode="bar">';
                toolbar_html += '<input autocomplete="off" data-mode="bar" name="options" type="radio" value="bar">'+this.options.icon.bar+' '+this.options.label.bar+'</input>';
                toolbar_html += '</label>';
            }

            // Line chart selection button
            if(this.options.chart_modes.indexOf('line') > -1){
                var active = '';
                if(this.options.chart_default_mode == 'line'){
                    active = ' active ';
                }
                toolbar_html += '<label class="'+this.options.button_css.line+active+'" data-mode="line">';
                toolbar_html += '<input autocomplete="off" data-mode="line" name="options" type="radio" value="bar">'+this.options.icon.line+' '+this.options.label.line+'</input>';
                toolbar_html += '</label>';
            }

            // Scatter chart selection button
            if(this.options.chart_modes.indexOf('scatter') > -1){
                var active = '';
                if(this.options.chart_default_mode == 'scatter'){
                    active = ' active ';
                }
                toolbar_html += '<label class="'+this.options.button_css.scatter+active+'" data-mode="scatter">';
                toolbar_html += '<input autocomplete="off" data-mode="scatter" name="options" type="radio" value="scatter">'+this.options.icon.scatter+' '+this.options.label.scatter+'</input>';
                toolbar_html += '</label>';
            }

            // Comparison chart selection button
            if(this.options.chart_modes.indexOf('comparison') > -1){
                var active = '';
                if(this.options.chart_default_mode == 'comparison'){
                    active = ' active ';
                }
                toolbar_html += '<label class="'+this.options.button_css.comparison+active+'" data-mode="comparison">';
                toolbar_html += '<input autocomplete="off" data-mode="comparison" name="options" type="radio" value="comparison">'+this.options.icon.comparison+' '+this.options.label.comparison+'</input>';
                toolbar_html += '</label>';
            }

            // Off button
            var active = '';
            if(this.options.chart_default_mode == 'off'){
                active = ' active ';
            }

            toolbar_html += '<label class="'+this.options.button_css.off+active+'" data-mode="off">';
            toolbar_html += '<input autocomplete="off" checked data-mode="off" name="options" type="radio" value="off">'+this.options.icon.off+' '+this.options.label.off+'</input>';
            toolbar_html += '</label>';
            toolbar_html += '</div>';
            toolbar_html += '</div>';

            var $div = $('<div>', {id: 'datatable_visualization'+this.uniqueId, 'class': 'datatable'});

            // Bar
            if(this.options.chart_modes.indexOf('bar') > -1){
                var bar_div = '<div id="bar_div'+this.uniqueId+'" style="display:none;"><canvas id="bar_chart'+this.uniqueId+'"></canvas></div>';
                this.options.element.bar.div = '#bar_div'+this.uniqueId;
                this.options.element.bar.canvas = '#bar_chart'+this.uniqueId;
                $($div).append(bar_div);
            }

            // Line
            if(this.options.chart_modes.indexOf('line') > -1){
                var line_div = '<div id="line_div'+this.uniqueId+'" style="display:none;"><canvas id="line_chart'+this.uniqueId+'"></canvas></div>';
                this.options.element.line.div = '#line_div'+this.uniqueId;
                this.options.element.line.canvas = '#line_chart'+this.uniqueId;
                $($div).append(line_div);
            }

            // Scatter
            if(this.options.chart_modes.indexOf('scatter') > -1){
                var scatter_div = '<div id="scatter_div'+this.uniqueId+'" style="display:none;">';
                scatter_div += '<canvas id="scatter_chart'+this.uniqueId+'"></canvas>';
                scatter_div += '<div class="btn-group">';

                // X-selector
                scatter_div += '<div class="btn-group">';
                scatter_div += '<div class="dropdown">';
                scatter_div += '<button aria-expanded="false" aria-haspopup="true" class="btn btn-default dropdown-toggle" data-toggle="dropdown" id="scatter_selector_x'+this.uniqueId+'" type="button">X '+this.options.icon.caret+'</button>';
                scatter_div += '<ul aria-labelledby="scatter_selector_x'+this.uniqueId+'" class="dropdown-menu" id="scatter_selector_x_menu'+this.uniqueId+'" role="menu">';
                scatter_div += '<li class="dropdown-header">'+this.options.label.select_x_axis+'</li>';
                $(this.element).find('thead tr th[data-chartable="true"]').each(function(){
                    var postfix = '';
                    if(typeof $(this).data('postfix') !== 'undefined'){
                        postfix = $(this).data('postfix');
                    }
                    var reversed = false;
                    if(typeof $(this).data('reversed') !== 'undefined'){
                        reversed = $(this).data('reversed');
                    }
                    if(typeof $(this).data('field') !== 'undefined'){
                        var field = $(this).data('field');
                    }
                    var axis_label = '';
                    if(typeof $(this).data('axis-label') !== 'undefined'){
                        axis_label = $("<div/>").html($(this).data('axis-label')).text();
                    }
                    var active = '';
                    var selected = '0';
                    if(field == self.options.scatter.x){
                        active = ' class="active" ';
                        selected = '1';
                    }
                    scatter_div += '<li'+active+'><a data-field="'+field+'" data-postfix="'+postfix+'" data-reversed="'+reversed+'" data-axis-label="'+axis_label+'" data-selected="'+selected+'" href="#" onclick="return false;">'+$.trim($(this).text())+'</a></li>'
                });
                scatter_div += '</ul>';
                scatter_div += '</div>';
                scatter_div += '</div>';

                // Y-selector
                scatter_div += '<div class="btn-group">';
                scatter_div += '<div class="dropdown">';
                scatter_div += '<button aria-expanded="false" aria-haspopup="true" class="btn btn-default dropdown-toggle" data-toggle="dropdown" id="scatter_selector_y'+this.uniqueId+'" type="button">Y '+this.options.icon.caret+'</button>';
                scatter_div += '<ul aria-labelledby="scatter_selector_y'+this.uniqueId+'" class="dropdown-menu" id="scatter_selector_y_menu'+this.uniqueId+'" role="menu">';
                scatter_div += '<li class="dropdown-header">'+this.options.label.select_y_axis+'</li>';
                $(this.element).find('thead tr th[data-chartable="true"]').each(function(){
                    var postfix = '';
                    if(typeof $(this).data('postfix') !== 'undefined'){
                        postfix = $(this).data('postfix');
                    }
                    var reversed = false;
                    if(typeof $(this).data('reversed') !== 'undefined'){
                        reversed = $(this).data('reversed');
                    }
                    if(typeof $(this).data('field') !== 'undefined'){
                        var field = $(this).data('field');
                    }
                    var axis_label = '';
                    if(typeof $(this).data('axis-label') !== 'undefined'){
                        axis_label = $("<div/>").html($(this).data('axis-label')).text();
                    }
                    var active = '';
                    var selected = '0';
                    if(field == self.options.scatter.y){
                        active = ' class="active" ';
                        selected = '1';
                    }
                    scatter_div += '<li'+active+'><a data-field="'+field+'" data-postfix="'+postfix+'" data-reversed="'+reversed+'" data-axis-label="'+axis_label+'" data-selected="'+selected+'" href="#" onclick="return false;">'+$.trim($(this).text())+'</a></li>'
                });
                scatter_div += '</ul>';
                scatter_div += '</div>';
                scatter_div += '</div>';

                scatter_div += '</div>';

                scatter_div += '</div>';
                this.options.element.scatter.div = '#scatter_div'+this.uniqueId;
                this.options.element.scatter.canvas = '#scatter_chart'+this.uniqueId;
                this.options.element.scatter.selector_x_menu = '#scatter_selector_x_menu'+this.uniqueId;
                this.options.element.scatter.selector_y_menu = '#scatter_selector_y_menu'+this.uniqueId;
                $($div).append(scatter_div);

                // X
                $(document).on("click", this.options.element.scatter.selector_x_menu + ' li a', function() {
                    $(self.options.element.scatter.selector_x_menu + ' li a').each(function(){
                        $(this).data('selected',0);
                        $(this).parent().removeClass('active');
                    });
                    $(this).data('selected', 1);
                    $(this).parent().addClass('active');
                    self.updateScatter();
                });

                // Y
                $(document).on("click", this.options.element.scatter.selector_y_menu + ' li a', function() {
                    $(self.options.element.scatter.selector_y_menu + ' li a').each(function(){
                        $(this).data('selected',0);
                        $(this).parent().removeClass('active');
                    });
                    $(this).data('selected', 1);
                    $(this).parent().addClass('active');
                    self.updateScatter();
                });
            }

            // Comparison
            if(this.options.chart_modes.indexOf('comparison') > -1){
                var comparison_div = '<div id="comparison_div'+this.uniqueId+'" style="display:none;">';
                comparison_div += '<canvas id="comparison_chart'+this.uniqueId+'"></canvas>';
                comparison_div += '<div class="btn-group" style="margin-right:10px;">';

                // Set selector
                comparison_div += '<div class="dropdown">';
                if(this.options.comparison.sets){
                    for (var i = 0; i < this.options.comparison.sets.length; i++) {
                        var set = this.options.comparison.sets[i];
                        if(set.title == self.options.comparison.active_set){
                            comparison_div += '<button aria-expanded="false" aria-haspopup="true" class="btn btn-default dropdown-toggle selector-button-xlarge" data-toggle="dropdown" id="comparison_selector_set'+this.uniqueId+'" type="button">'+set.title+' '+this.options.icon.caret+'</button>';
                            break;
                        }
                    }
                }else{
                    comparison_div += '<button aria-expanded="false" aria-haspopup="true" class="btn btn-default dropdown-toggle selector-button-xlarge" data-toggle="dropdown" id="comparison_selector_set'+this.uniqueId+'" type="button">'+this.options.icon.caret+'</button>';
                }

                comparison_div += '<ul aria-labelledby="comparison_selector_set" class="dropdown-menu" id="comparison_selector_set_menu'+this.uniqueId+'" role="menu">';
                comparison_div += '<li class="dropdown-header">'+this.options.label.select_set+'</li>';
                if(this.options.comparison.sets){
                    for (var i = 0; i < this.options.comparison.sets.length; i++) {
                        var set = this.options.comparison.sets[i];
                        var active = '';
                        var selected = '0';
                        if(set.title == self.options.comparison.active_set){
                            active = ' class="active" ';
                            selected = '1';
                        }
                        comparison_div += '<li'+active+'><a data-selected="'+selected+'" data-set="'+set.title+'" href="#" onclick="return false;">'+set.title+'</a></li>';
                    }
                }
                comparison_div += '</ul>';
                comparison_div += '</div>';
                comparison_div += '</div>';

                comparison_div += '<div class="btn-group" role="group">';
                // Row A
                comparison_div += '<div class="btn-group">';
                comparison_div += '<div class="dropdown">';
                comparison_div += '<button class="btn btn-success dropdown-toggle selector-button-large" data-toggle="dropdown" id="comparison_selector_a'+this.uniqueId+'" type="button" aria-expanded="false" aria-haspopup="true">'+this.options.icon.caret+'</button>';
                comparison_div += '<ul aria-labelledby="comparison_selector_a'+this.uniqueId+'" class="dropdown-menu" id="comparison_selector_a_menu'+this.uniqueId+'" role="menu">';
                comparison_div += '<li class="dropdown-header">'+this.options.label.select_a_row+'</li>';
                comparison_div += '</ul>';
                comparison_div += '</div>';
                comparison_div += '</div>';

                // Row B
                comparison_div += '<div class="btn-group">';
                comparison_div += '<div class="dropdown">';
                comparison_div += '<button class="btn btn-danger dropdown-toggle selector-button-large" data-toggle="dropdown" id="comparison_selector_b'+this.uniqueId+'" type="button" aria-expanded="false" aria-haspopup="true">'+this.options.icon.caret+'</button>';
                comparison_div += '<ul aria-labelledby="comparison_selector_b'+this.uniqueId+'" class="dropdown-menu" id="comparison_selector_b_menu'+this.uniqueId+'" role="menu">';
                comparison_div += '<li class="dropdown-header">'+this.options.label.select_b_row+'</li>';
                comparison_div += '</ul>';
                comparison_div += '</div>';
                comparison_div += '</div>';

                comparison_div += '</div>';

                comparison_div += '</div>';

                this.options.element.comparison.div = '#comparison_div'+this.uniqueId;
                this.options.element.comparison.canvas = '#comparison_chart'+this.uniqueId;

                this.options.element.comparison.selector_set_button = '#comparison_selector_set'+this.uniqueId;
                this.options.element.comparison.selector_set_menu = '#comparison_selector_set_menu'+this.uniqueId;

                this.options.element.comparison.selector_a_button = '#comparison_selector_a'+this.uniqueId;
                this.options.element.comparison.selector_a_menu = '#comparison_selector_a_menu'+this.uniqueId;

                this.options.element.comparison.selector_b_button = '#comparison_selector_b'+this.uniqueId;
                this.options.element.comparison.selector_b_menu = '#comparison_selector_b_menu'+this.uniqueId;

                $($div).append(comparison_div);

                // Set selector
                $(document).on("click", this.options.element.comparison.selector_set_menu + ' li a', function() {
                    $(self.options.element.comparison.selector_set_menu + ' li a').each(function(){
                        $(this).data('selected',0);
                        $(this).parent().removeClass('active');
                    });
                    $(this).data('selected', 1);
                    $(this).parent().addClass('active');
                    $(self.options.element.comparison.selector_set_button).html($(this).text()+' '+self.options.icon.caret);
                    self.updateComparison();
                });

                // Row selector, A
                $(document).on("click", this.options.element.comparison.selector_a_menu + ' li a', function() {
                    $(self.options.element.comparison.selector_a_menu + ' li a').each(function(){
                        $(this).data('selected',0);
                        $(this).parent().removeClass('active');
                    });
                    $(this).data('selected', 1);
                    $(this).parent().addClass('active');
                    $(self.options.element.comparison.selector_a_button).html($(this).text()+' '+self.options.icon.caret);
                    self.updateComparison();
                });

                // Row selector, B
                $(document).on("click", this.options.element.comparison.selector_b_menu + ' li a', function() {
                    $(self.options.element.comparison.selector_b_menu + ' li a').each(function(){
                        $(this).data('selected',0);
                        $(this).parent().removeClass('active');
                    });
                    $(this).data('selected', 1);
                    $(this).parent().addClass('active');
                    $(self.options.element.comparison.selector_b_button).html($(this).text()+' '+self.options.icon.caret);
                    self.updateComparison();
                });
            }

            if(this.options.chart.position === 'top'){
                $(toolbar_html).appendTo($div);
                $div.insertBefore(this.$element);

            }else if(this.options.chart.position === 'bottom'){
                $div.insertAfter(this.$element);
                $(toolbar_html).prependTo($div);
            }

            this.$element.attr('data-toolbar', '#datatable_toolbar'+this.uniqueId);

            // Table selector button
            $('#'+this.options.element.table_mode_selector).on('click', function(){
                if($(this).hasClass('active')){
                    self.table_mode = 'hide';
                }else{
                    self.table_mode = 'show';
                }
                self.updateTableVisibility(self.table_mode);
            });

            $('#'+this.options.element.chart_mode_selector+' label').on('click', function(){
                self.chart_mode = $(this).data('mode');
                self.updateVisualizationVisibility(self.chart_mode);
            });

        },
        loadTableData: function(){
            var self = this;
            // Load data
            if(typeof this.$element.data('json') !== 'undefined'){
                // Populate table from json data file
                var json_datafile = this.$element.data('json');

                jQuery.ajax({
                    type: 'GET',
                    mimeType: "application/json; charset=utf-8",
                    url: json_datafile,
                    dataType: 'json',
                    async: true,
                    success: function(data){
                        var $thead = self.$element.find('thead');
                        var $tbody = $('<tbody></tbody>');

                        $.each( data, function( key, val ) {
                            var $row = $('<tr></tr>');
                            if(val.hline){
                                $row.attr('data-hline',true);
                            }

                            if(self.options.table.row_highlighting){
                                if(val.row_css === 'active'){
                                    $row.addClass('active');

                                }else if(val.row_css === 'success'){
                                    $row.addClass('success');

                                }else if(val.row_css === 'info'){
                                    $row.addClass('info');

                                }else if(val.row_css === 'warning'){
                                    $row.addClass('warning');

                                }else if(val.row_css === 'danger'){
                                    $row.addClass('danger');

                                }
                            }

                            $.each(self.field_meta, function(header_key, header_val){
                                $($row).append($('<td></td>').text(val[header_val.field]));
                            });
                            $($tbody).append($row);
                        });
                        $($tbody).insertAfter($thead);
                        self.updateTags();
                        self.$element.trigger('post-init.datatable');
                    },
                    error: function(){
                        console.log('ERROR reading file:'+json_datafile);
                    }
                });

            }else if(typeof $(element).data('yaml') !== 'undefined'){
                // Populate table from yaml data file
                var yaml_datafile = this.$element.data('yaml');

                jQuery.ajax({
                    type: 'GET',
                    dataType: 'text',
                    mimeType: "application/yaml; charset=utf-8",
                    url: yaml_datafile,
                    async: true,
                    success: function(text){
                        try {
                            var data = jsyaml.safeLoad(text);
                            var $thead = self.$element.find('thead');
                            var $tbody = $('<tbody></tbody>');
                            $.each( data.data, function( key, val ) {
                                var $row = $('<tr></tr>');
                                if(val.hline){
                                    $row.attr('data-hline',true);
                                }
                                if(self.options.table.row_highlighting){
                                    if(val.row_css === 'active'){
                                        $row.addClass('active');

                                    }else if(val.row_css === 'success'){
                                        $row.addClass('success');

                                    }else if(val.row_css === 'info'){
                                        $row.addClass('info');

                                    }else if(val.row_css === 'warning'){
                                        $row.addClass('warning');

                                    }else if(val.row_css === 'danger'){
                                        $row.addClass('danger');

                                    }
                                }
                                $.each(self.field_meta, function(header_key, header_val){
                                    $($row).append($('<td></td>').text(val[header_val.field]));
                                });
                                $($tbody).append($row);
                            });
                            $($tbody).insertAfter($thead);
                            self.updateTags();
                            $(self.element).trigger('post-init.datatable');
                        } catch (e) {
                            console.log(e);
                        }
                    },
                    error: function(){
                        console.log('ERROR reading file:'+yaml_datafile);
                    }
                });

            }else{
                // we are ready
                self.updateTags();
                self.$element.trigger('post-init.datatable');
            }
        },
        initFieldMeta: function(){
            var self = this;
            this.field_meta = [];
            $(this.element).find('thead tr th').each(function(){
                var meta = {
                    field: null,
                    rank: null,
                    chartable: null,
                    sortable: null,
                    visible: null,
                    beginatzero: null,
                    align: null,
                    tag: null,
                    filter_control: null,
                    formatter: null,
                    postfix: null
                };
                if(typeof $(this).data('field') !== 'undefined' ){
                    meta.field = $(this).data('field');
                }
                if(typeof $(this).data('rank') !== 'undefined' ){
                    meta.rank = $(this).data('rank');
                }
                if(typeof $(this).data('chartable') !== 'undefined' ){
                    meta.chartable = $(this).data('chartable');
                }
                if(typeof $(this).data('sortable') !== 'undefined' ){
                    meta.sortable = $(this).data('sortable');
                }
                if(typeof $(this).data('visible') !== 'undefined' ){
                    meta.visible = $(this).data('visible');
                }
                if(typeof $(this).data('beginatzero') !== 'undefined' ){
                    meta.beginatzero = $(this).data('beginatzero');
                }
                if(typeof $(this).data('axis-label') !== 'undefined' ){
                    meta.axis_label = $(this).data('axis-label');
                }
                if(typeof $(this).data('axis-scale') !== 'undefined' ){
                    meta.axis_scale = $(this).data('axis-scale');
                }
                if(typeof $(this).data('align') !== 'undefined' ){
                    meta.align = $(this).data('align');
                }
                if(typeof $(this).data('tag') !== 'undefined' ){
                    meta.tag = $(this).data('tag');
                }
                if(typeof $(this).data('filter-control') !== 'undefined' ){
                    meta.filter_control = $(this).data('filter-control');
                }
                if(typeof $(this).data('formatter') !== 'undefined' ){
                    meta.formatter = $(this).data('formatter');
                }
                if(typeof $(this).data('postfix') !== 'undefined' ){
                    meta.postfix = $(this).data('postfix');
                }
                if(meta.field != null || meta.rank){
                    self.field_meta.push(meta);
                }
            });
        },
        getHeaderOptions: function(field){
            var self = this;
            var header = $(this.element).find('thead tr th[data-field="' + field + '"]').first();
            if(header.length){
                var header_options = {
                    field: field,
                    rank: null,
                    chartable: false,
                    sortable: null,
                    visible: null,
                    beginatzero: null,
                    align: null,
                    tag: null,
                    filter_control: null,
                    text: header.text().trim(),
                    title: this.cleanFieldValue(header.html()),
                    chart_mode: null,
                    value: {
                        formatter: null,
                        postfix: '',
                        label: header.text().trim(),
                        pad: ''
                    },
                    dataset: {
                        labels: [],
                        colors: []
                    },
                    axis: {},
                    bar: {
                        sort_order: 'asc',

                        xaxis: {},
                        yaxis: {},
                        horizontal_highlights: {
                            label: {}
                        },
                        horizontal_line: {},
                        horizontal_indicator_line: {},
                        vertical_indicator_line: {},
                        error_bar: {},
                        tooltips: {},
                        legend: {}
                    },

                    line: {
                        fields: null,
                        xaxis: {},
                        yaxis: {},
                        line: {},
                        point: {},
                        horizontal_highlights: {
                            label: {}
                        },
                        legend: {}
                    }
                };

                if (typeof $(header).data('rank') !== 'undefined') {
                    header_options.rank = $(header).data('rank');
                }

                if (typeof header.data('chartable') !== 'undefined') {
                    header_options.chartable = header.data('chartable');
                }

                if (typeof header.data('sortable') !== 'undefined') {
                    header_options.sortable = header.data('sortable');
                }

                if (typeof header.data('visible') !== 'undefined') {
                    header_options.visible = header.data('visible');
                }

                if (typeof header.data('beginatzero') !== 'undefined') {
                    header_options.beginatzero = header.data('beginatzero');
                }

                if (typeof header.data('align') !== 'undefined') {
                    header_options.align = header.data('align');
                }
                if (typeof header.data('tag') !== 'undefined') {
                    header_options.tag = header.data('tag');
                }
                if (typeof header.data('filter-control') !== 'undefined') {
                    header_options.filter_control = header.data('filter-control');
                }
                // Chart
                if (typeof header.data('chart-mode') !== 'undefined') {
                    header_options.chart_mode = header.data('chart-mode');
                }

                // Axis
                if (typeof header.data('axis-scale') !== 'undefined') {
                    header_options.axis.scale = header.data('axis-scale');
                }
                if (typeof header.data('axis-label') !== 'undefined') {
                    header_options.axis.label = header.data('axis-label');
                }

                // Dataset
                if(typeof header.data('dataset-labels') !== 'undefined'){
                    header_options.dataset.labels = header.data('dataset-labels').split(',')
                }

                if(typeof header.data('dataset-colors') !== 'undefined'){
                    header_options.dataset.colors = header.data('dataset-colors').split(',')
                }

                // Value
                if (typeof header.data('formatter') !== 'undefined') {
                    header_options.value.formatter = header.data('formatter');
                }
                if (typeof header.data('postfix') !== 'undefined') {
                    header_options.value.postfix = header.data('postfix');
                }
                if (header_options.axis.label) {
                    header_options.value.label = $("<div/>").html(header_options.axis.label).text().trim();
                }


                // Bar plot
                if(typeof header.data('bar-sort-field') !== 'undefined'){
                    header_options.bar.sort_field = header.data('bar-sort-field');
                }
                if(typeof header.data('bar-sort-order') !== 'undefined') {
                    header_options.bar.sort_order = header.data('bar-sort-order');
                }
                if(typeof header.data('bar-show-xaxis') !== 'undefined'){
                    header_options.bar.xaxis.display = header.data('bar-show-xaxis');
                }
                if(typeof header.data('bar-show-yaxis') !== 'undefined'){
                    header_options.bar.yaxis.display = header.data('bar-show-yaxis');
                }
                if(typeof header.data('bar-yaxis-gridlines') !== 'undefined'){
                    header_options.bar.yaxis.gridlines = header.data('bar-yaxis-gridlines');
                }
                if(typeof header.data('bar-horizontal-highlights') !== 'undefined'){
                    header_options.bar.horizontal_highlights.data = this.parseDataList(header.data('bar-horizontal-highlights'));
                    if(header_options.bar.horizontal_highlights.data.length==0 && header_options.bar.horizontal_highlights.enabled){
                        header_options.bar.horizontal_highlights.enabled = false;
                    }
                }
                if(typeof header.data('bar-horizontal-highlight-opacity') !== 'undefined'){
                    header_options.bar.horizontal_highlights.opacity = header.data('bar-horizontal-highlight-opacity');
                }
                if(typeof header.data('bar-horizontal-highlight-linewidth') !== 'undefined'){
                    header_options.bar.horizontal_highlights.lineWidth = header.data('bar-horizontal-highlight-width');
                }
                if(typeof header.data('bar-horizontal-highlight-stroke') !== 'undefined'){
                    header_options.bar.horizontal_highlights.strokeStyle = header.data('bar-horizontal-highlight-stroke');
                }
                if(typeof header.data('bar-horizontal-highlight-label-position') !== 'undefined'){
                    header_options.bar.horizontal_highlights.label.position = header.data('bar-horizontal-highlight-label-position');
                }
                if(typeof header.data('bar-horizontal-highlight-label-fill') !== 'undefined'){
                    header_options.bar.horizontal_highlights.label.fillStyle = header.data('bar-horizontal-highlight-label-fill');
                }
                if(typeof header.data('bar-horizontal-highlight-label-size') !== 'undefined'){
                    header_options.bar.horizontal_highlights.label.fontSize = header.data('bar-horizontal-highlight-label-size');
                }
                if(typeof header.data('bar-horizontal-highlight-label-opacity') !== 'undefined'){
                    header_options.bar.horizontal_highlights.label.opacity = header.data('bar-horizontal-highlight-label-opacity');
                }
                if(typeof header.data('bar-show-vertical-indicator') !== 'undefined'){
                    header_options.bar.vertical_indicator_line.enabled = header.data('bar-show-vertical-indicator');
                }
                if(typeof header.data('bar-vertical-indicator-linewidth') !== 'undefined'){
                    header_options.bar.vertical_indicator_line.lineWidth = header.data('bar-vertical-indicator-width');
                }
                if(typeof header.data('bar-vertical-indicator-stroke') !== 'undefined'){
                    header_options.bar.vertical_indicator_line.strokeStyle = header.data('bar-vertical-indicator-stroke');
                }
                if(typeof header.data('bar-show-horizontal-indicator') !== 'undefined'){
                    header_options.bar.horizontal_indicator_line.enabled = header.data('bar-show-horizontal-indicator');
                }
                if(typeof header.data('bar-horizontal-indicator-linewidth') !== 'undefined'){
                    header_options.bar.horizontal_indicator_line.lineWidth = header.data('bar-horizontal-indicator-width');
                }
                if(typeof header.data('bar-horizontal-indicator-stroke') !== 'undefined'){
                    header_options.bar.horizontal_indicator_line.strokeStyle = header.data('bar-horizontal-indicator-stroke');
                }
                if(typeof header.data('bar-horizontal-indicator-fill') !== 'undefined'){
                    header_options.bar.horizontal_indicator_line.fillStyle = header.data('bar-horizontal-indicator-fill');
                }
                if(typeof header.data('bar-show-error-bar') !== 'undefined'){
                    header_options.bar.error_bar.enabled = header.data('bar-show-error-bar');
                }
                if(typeof header.data('bar-error-bar-linewidth') !== 'undefined'){
                    header_options.bar.error_bar.lineWidth = header.data('bar-error-bar-linewidth');
                }
                if(typeof header.data('bar-error-bar-tipwidth') !== 'undefined'){
                    header_options.bar.error_bar.tipWidth = header.data('bar-error-bar-tipwidth');
                }
                if(typeof header.data('bar-error-bar-stroke') !== 'undefined'){
                    header_options.bar.error_bar.strokeStyle = header.data('bar-error-bar-stroke');
                }
                if(typeof header.data('bar-tooltip-position') !== 'undefined'){
                    header_options.bar.tooltips.position = header.data('bar-tooltip-position');
                }
                if(typeof header.data('bar-show-legend') !== 'undefined'){
                    header_options.bar.legend.enabled = header.data('bar-show-legend');
                }
                if(typeof header.data('bar-legend-position') !== 'undefined'){
                    header_options.bar.legend.position = header.data('bar-legend-position');
                }

                // Line plot
                if(typeof header.data('line-extra-fields') !== 'undefined'){
                    header_options.line.fields = header.data('line-extra-fields').split(',').map(function(item) {
                        return item.trim();
                    });
                    header_options.line.fields.unshift(header_options.field);
                }
                if(typeof header.data('line-show-xaxis') !== 'undefined'){
                    header_options.line.xaxis.display = header.data('line-show-xaxis');
                }
                if(typeof header.data('line-xaxis-field') !== 'undefined'){
                    header_options.line.xaxis.field = header.data('line-xaxis-field');
                }
                if(typeof header.data('line-xaxis-sorted') !== 'undefined'){
                    header_options.line.xaxis.sorted = header.data('line-xaxis-sorted');
                }
                if(typeof header.data('line-xaxis-timeunit') !== 'undefined'){
                    header_options.line.xaxis.timeunit = header.data('line-xaxis-timeunit');
                }
                if(typeof header.data('line-xaxis-timestepsize') !== 'undefined'){
                    header_options.line.xaxis.timestepsize = header.data('line-xaxis-timestepsize');
                }
                if(typeof header.data('line-xaxis-gridlines') !== 'undefined'){
                    header_options.line.xaxis.gridlines = header.data('line-xaxis-gridlines');
                }
                if(typeof header.data('line-yaxis-beginatzero') !== 'undefined'){
                    header_options.line.yaxis.beginatzero = header.data('line-yaxis-beginatzero');
                }
                if(typeof header.data('line-yaxis-label') !== 'undefined'){
                    header_options.line.yaxis.label = header.data('line-yaxis-label');
                }
                if(typeof header.data('line-yaxis-scale') !== 'undefined'){
                    header_options.line.yaxis.scale = header.data('line-yaxis-scale');
                }
                if(typeof header.data('line-yaxis-gridlines') !== 'undefined'){
                    header_options.line.yaxis.gridlines = header.data('line-yaxis-gridlines');
                }
                if(typeof header.data('line-height') !== 'undefined'){
                    header_options.line.height = header.data('line-height');
                }
                if(typeof header.data('line-show-point') !== 'undefined'){
                    header_options.line.point.enabled = header.data('line-show-point');
                }
                if(typeof header.data('line-point-radius') !== 'undefined'){
                    header_options.line.point.radius.normal = header.data('line-point-radius');
                }
                if(typeof header.data('line-point-radius-hover') !== 'undefined'){
                    header_options.line.point.radius.hover = header.data('line-point-radius-hover');
                }
                if(typeof header.data('line-show-line') !== 'undefined'){
                    header_options.line.line.enabled = header.data('line-show-line');
                }
                if(typeof header.data('line-show-vertical-indicator') !== 'undefined'){
                    header_options.line.vertical_indicator_line.enabled = header.data('line-show-vertical-indicator');
                }
                if(typeof header.data('line-vertical-indicator-linewidth') !== 'undefined'){
                    header_options.line.vertical_indicator_line.lineWidth = header.data('line-vertical-indicator-width');
                }
                if(typeof header.data('line-vertical-indicator-stroke') !== 'undefined'){
                    header_options.line.vertical_indicator_line.strokeStyle = header.data('line-vertical-indicator-stroke');
                }
                if(typeof header.data('line-show-horizontal-indicator') !== 'undefined'){
                    header_options.line.horizontal_indicator_line.enabled = header.data('line-show-horizontal-indicator');
                }
                if(typeof header.data('line-horizontal-indicator-linewidth') !== 'undefined'){
                    header_options.line.horizontal_indicator_line.lineWidth = header.data('line-horizontal-indicator-width');
                }
                if(typeof header.data('line-horizontal-indicator-stroke') !== 'undefined'){
                    header_options.line.horizontal_indicator_line.strokeStyle = header.data('line-horizontal-indicator-stroke');
                }
                if(typeof header.data('line-horizontal-indicator-fill') !== 'undefined'){
                    header_options.line.horizontal_indicator_line.fillStyle = header.data('line-horizontal-indicator-fill');
                }
                if(typeof header.data('line-show-horizontal-highlights') !== 'undefined'){
                    header_options.line.horizontal_highlights.enabled = header.data('line-show-horizontal-highlights');
                }
                if(typeof header.data('line-horizontal-highlights') !== 'undefined'){
                    header_options.line.horizontal_highlights.data = this.parseDataList(header.data('line-horizontal-highlights'));
                    if(header_options.line.horizontal_highlights.data.length==0 && attributes.line.horizontal_highlights.enabled){
                        header_options.line.horizontal_highlights.enabled = false;
                    }
                }
                if(typeof header.data('line-horizontal-highlight-opacity') !== 'undefined'){
                    header_options.line.horizontal_highlights.opacity = header.data('line-horizontal-highlight-opacity');
                }
                if(typeof header.data('line-horizontal-highlight-linewidth') !== 'undefined'){
                    header_options.line.horizontal_highlights.lineWidth = header.data('line-horizontal-highlight-width');
                }
                if(typeof header.data('line-horizontal-highlight-stroke') !== 'undefined'){
                    header_options.line.horizontal_highlights.strokeStyle = header.data('line-horizontal-highlight-stroke');
                }
                if(typeof header.data('line-horizontal-highlight-label-position') !== 'undefined'){
                    header_options.line.horizontal_highlights.label.position = header.data('line-horizontal-highlight-label-position');
                }
                if(typeof header.data('line-horizontal-highlight-label-fill') !== 'undefined'){
                    header_options.line.horizontal_highlights.label.fillStyle = header.data('line-horizontal-highlight-label-fill');
                }
                if(typeof header.data('line-horizontal-highlight-label-size') !== 'undefined'){
                    header_options.line.horizontal_highlights.label.fontSize = header.data('line-horizontal-highlight-label-size');
                }
                if(typeof header.data('line-horizontal-highlight-label-opacity') !== 'undefined'){
                    header_options.line.horizontal_highlights.label.opacity = header.data('line-horizontal-highlight-label-opacity');
                }
                if(typeof header.data('line-show-vertical-segments') !== 'undefined'){
                    header_options.line.vertical_segments.enabled = header.data('line-show-vertical-segments');
                }
                if(typeof header.data('line-vertical-segments') !== 'undefined'){
                    header_options.line.vertical_segments.data = this.parseSegmentList(header.data('line-vertical-segments'));
                    if(header_options.line.vertical_segments.data.length==0 && attributes.line.vertical_segments.enabled){
                        header_options.line.vertical_segments.enabled = false;
                    }
                }
                if(typeof header.data('line-vertical-segment-opacity') !== 'undefined'){
                    header_options.line.vertical_segments.opacity = header.data('line-vertical-segment-opacity');
                }
                if(typeof header.data('line-vertical-segment-label-position') !== 'undefined'){
                    header_options.line.vertical_segments.label.position = header.data('line-vertical-segment-label-position');
                }
                if(typeof header.data('line-vertical-segment-label-fill') !== 'undefined'){
                    header_options.line.vertical_segments.label.fillStyle = header.data('line-vertical-segment-label-fill');
                }
                if(typeof header.data('line-vertical-segment-label-size') !== 'undefined'){
                    header_options.line.vertical_segments.label.fontSize = header.data('line-vertical-segment-label-size');
                }
                if(typeof header.data('line-vertical-segment-label-opacity') !== 'undefined'){
                    header_options.line.vertical_segments.label.opacity = header.data('line-vertical-segment-label-opacity');
                }
                if(typeof header.data('line-show-error-bar') !== 'undefined'){
                    header_options.line.error_bar.enabled = header.data('line-show-error-bar');
                }
                if(typeof header.data('line-error-bar-linewidth') !== 'undefined'){
                    header_options.line.error_bar.lineWidth = header.data('line-error-bar-linewidth');
                }
                if(typeof header.data('line-error-bar-tipwidth') !== 'undefined'){
                    header_options.line.error_bar.tipWidth = header.data('line-error-bar-tipwidth');
                }
                if(typeof header.data('line-error-bar-stroke') !== 'undefined'){
                    header_options.line.error_bar.strokeStyle = header.data('line-error-bar-stroke');
                }
                if(typeof header.data('line-show-interval') !== 'undefined'){
                    header_options.line.interval.enabled = header.data('line-show-interval');
                }
                if(typeof header.data('line-interval-linewidth') !== 'undefined'){
                    header_options.line.interval.lineWidth = header.data('line-interval-linewidth');
                }
                if(typeof header.data('line-hline') !== 'undefined'){
                    header_options.line.horizontal_line.enabled = header.data('line-hline');
                }
                if(typeof header.data('line-tooltip-position') !== 'undefined'){
                    header_options.line.tooltips.position = header.data('line-tooltip-position');
                }
                if(typeof header.data('line-show-legend') !== 'undefined'){
                    header_options.line.legend.enabled = header.data('line-show-legend');
                }
                if(typeof header.data('line-legend-position') !== 'undefined'){
                    header_options.line.legend.position = header.data('line-legend-position');
                }

                // Post processing
                if(header_options.value.formatter && header_options.value.formatter.startsWith('valueFormatter_inline_bar_')){
                    header_options.value.formatter = 'valueFormatter_float1_percentage';
                    header_options.value.pad = ' '.repeat(6);
                }

                return header_options;

            }else{
                return {}
            }
        },
        updateTableVisibility : function(mode){
            if(mode=='show'){
                $(this.$element[0].closest('.fixed-table-container')).show(this.options.animation.show_speed);
            }else if(mode=='hide'){
                $(this.$element[0].closest('.fixed-table-container')).hide(this.options.animation.show_speed);
            }
        },
        updateVisualizationVisibility: function(mode){
            if(mode==='off'){
                if(this.options.chart_modes.indexOf('bar') > -1){
                    this.hideBarChart();
                }
                if(this.options.chart_modes.indexOf('line') > -1){
                    this.hideLineChart();
                }
                if(this.options.chart_modes.indexOf('scatter') > -1){
                    this.hideScatterChart();
                }
                if(this.options.chart_modes.indexOf('comparison') > -1){
                    this.hideComparisonChart();
                }

            }else if(mode==='bar'){

                if(this.options.chart_modes.indexOf('line') > -1){
                    this.hideLineChart();
                }
                if(this.options.chart_modes.indexOf('scatter') > -1){
                    this.hideScatterChart();
                }
                if(this.options.chart_modes.indexOf('comparison') > -1){
                    this.hideComparisonChart();
                }
                this.showBarChart();

            }else if(mode==='line'){

                if(this.options.chart_modes.indexOf('bar') > -1){
                    this.hideBarChart();
                }
                if(this.options.chart_modes.indexOf('scatter') > -1){
                    this.hideScatterChart();
                }
                if(this.options.chart_modes.indexOf('comparison') > -1){
                    this.hideComparisonChart();
                }
                this.showLineChart();

            }else if(mode==='scatter'){

                if(this.options.chart_modes.indexOf('bar') > -1){
                    this.hideBarChart();
                }
                if(this.options.chart_modes.indexOf('line') > -1){
                    this.hideLineChart();
                }
                if(this.options.chart_modes.indexOf('comparison') > -1){
                    this.hideComparisonChart();
                }
                this.showScatterChart();

            }else if(mode==='comparison'){
                if(this.options.chart_modes.indexOf('bar') > -1){
                    this.hideBarChart();
                }
                if(this.options.chart_modes.indexOf('line') > -1){
                    this.hideLineChart();
                }
                if(this.options.chart_modes.indexOf('scatter') > -1){
                    this.hideScatterChart();
                }
                this.showComparisonChart();
            }
        },
        updateChart: function () {
            if(this.options.show_chart){
                if(this.chart_mode == 'off'){

                }else if(this.chart_mode == 'bar'){
                    this.updateBar();

                }else if(this.chart_mode == 'line'){
                    this.updateLine();

                }else if(this.chart_mode == 'scatter'){
                    this.updateScatter();

                }else if(this.chart_mode == 'comparison'){
                    this.updateComparison();
                }
            }
        },

        // Bar
        validBar: function () {
            var table_options = $(this.element).bootstrapTable('getOptions');
            var header_options = this.getHeaderOptions(table_options.sortName);

            return $(this.element).bootstrapTable('getData').length > 0 && header_options.chartable;
        },
        updateBar: function () {
            var self = this;
            var table_options = this.$element.bootstrapTable('getOptions');
            var header_options = this.getHeaderOptions(table_options.sortName);

            var options = $.extend(true, {}, this.options);

            // Override global options with header wise options.
            options.bar = $.extend(true, {}, options.bar, header_options.bar);

            if (this.bar_chart){
                this.bar_chart.destroy();
            }

            var chart_ctx = document.getElementById(this.options.element.bar.canvas.replace('#',''));
            chart_ctx.width = $(this.options.element.bar.div).innerWidth();
            chart_ctx.height = options.bar.height;

            var table_data = this.$element.bootstrapTable('getData');
            var sort_name = table_options.sortName;
            var id_field = table_options.idField;

            var header = this.$element.find('thead tr th[data-field=\"'+sort_name+'\"]');

            if(header_options.bar.sort_field){
                // Sort data
                table_data.sort(function(a, b){
                    return self.valueSorter(a[header_options.bar.sort_field], b[header_options.bar.sort_field], header_options.bar.sort_order);
                });
            }

            var datasets = [];
            var labels = [];

            for (var row_id = 0; row_id < table_data.length; row_id++) {
                // Go through the table data and collect values and colors for bar plot.
                var label = $("<div/>").html(table_data[row_id][options.table.id_field]).text().trim().replace(/<(?:.|\n)*?>/gm, '').replace('_',' ');

                // Make sure labels are unique, if overlapping labels add whitespaces at the end.
                if(labels.indexOf(label) > -1){
                    var num_of_occurances = 0;
                    for(var label_id = 0; row_id < labels.length; row_id++){
                        if(labels[label_id] === label)
                            num_of_occurances++;
                    }
                    label = label + new Array(num_of_occurances + 1).join(' ');
                }
                labels.push(label);
            }

            var stacked_chart = false;
            var stacked_items = 1;
            for (var row_id = 0; row_id < table_data.length; row_id++) {
                var values = self.parseDataList(table_data[row_id][sort_name]);
                if(values.length > 1){
                    stacked_chart = true;
                    if(values.length > stacked_items){
                        stacked_items = values.length;
                    }
                }
            }

            if(stacked_chart){
                if(header_options.dataset.labels.length == 0){
                    header_options.dataset.labels = new Array(stacked_items);
                    for (var row_id = 0; row_id < table_data.length; row_id++) {
                        var values = self.parseDataList(table_data[row_id][sort_name]);
                        for (var value_id = 0; value_id < values.length; value_id++) {
                            if(values[value_id].label){
                                header_options.dataset.labels[value_id] = values[value_id].label;
                            }
                        }
                    }
                }

                for(var dataset_id = 0; dataset_id < stacked_items; dataset_id++){
                    var dataset = {
                        label: header_options.dataset.labels[dataset_id],

                        data: [],
                        data_min: [],
                        data_max: [],
                        data_string: [],
                        data_uniqueid: [],

                        backgroundColor: [],
                        borderColor: [],
                        borderWidth: 2,
                        hoverBackgroundColor: [],
                        hoverBorderColor: []
                    };

                    var all_value_min = Infinity;
                    var all_value_max = -Infinity;

                    for (var row_id = 0; row_id < table_data.length; row_id++) {
                        var values = self.parseDataList(table_data[row_id][sort_name]);
                        var value_sum = 0;
                        for (var ii = 0; ii < values.length; ii++) {
                            value_sum += values[ii]['y_value'];
                        }

                        var item = {
                            'value': null,
                            'value_max': null,
                            'value_min': null
                        };

                        if(values.length > dataset_id && values[dataset_id]['y_value']){

                            var percentage = values[dataset_id]['y_value'];
                            if(value_sum > 100.0 && value_sum < 101.0){
                                percentage = percentage/value_sum * 100.0;
                            }
                            item.value = percentage;
                        }

                        dataset.data.push(item.value);

                        if(header_options.value.formatter){
                            var value_string = this.stripHTML(window[header_options.value.formatter](item.value));
                            if(header_options.value.pad){
                                value_string = (value_string + header_options.value.pad).substring(0, header_options.value.pad.length);
                            }
                            dataset.data_string.push(value_string);
                        }else{
                            dataset.data_string.push(this.injectValuePostfix(item.value, header_options.value.postfix));
                        }

                        dataset.data_uniqueid.push(table_data[row_id][table_options.idField]);

                        // Make sure lower and upper limits are valid
                        var value_max = item.value_max;
                        var value_min = item.value_min;

                        if(all_value_max < item.value){
                            all_value_max = item.value;
                        }
                        if(all_value_min > item.value){
                            all_value_min = item.value;
                        }
                        if(value_min !== null && value_max !== null){
                            if(value_max < value_min) {
                                // Flip max and min
                                var value_tmp = value_min;
                                var value_min = value_max;
                                var value_max = value_tmp;
                            }

                            if(all_value_max < value_max){
                                all_value_max = value_max;
                            }

                            if(all_value_min > value_min){
                                all_value_min = value_min;
                            }
                        }

                        dataset.data_min.push(value_min);
                        dataset.data_max.push(value_max);

                        var current_color = null;
                        if(item.color){
                            current_color = item.color;
                        }else if(dataset_id < header_options.dataset.colors && header_options.dataset.colors[dataset_id]){
                            current_color = header_options.dataset.colors[dataset_id];
                        }else{
                            current_color = options.bar.colors.datasets[dataset_id % options.bar.colors.datasets.length];
                        }

                        dataset.borderColor.push(current_color);
                        dataset.hoverBorderColor.push(current_color);
                        dataset.hoverBackgroundColor.push(current_color);
                        dataset.backgroundColor.push(current_color);

                        if(item.value > value_max){
                            value_max = item.value;
                        }
                        if(item.value < value_max){
                            value_min = item.value;
                        }

                    }

                    datasets.push(dataset);
                }

            }else{
                var dataset = {
                    label: sort_name,

                    data: [],
                    data_min: [],
                    data_max: [],
                    data_string: [],
                    data_uniqueid: [],

                    horizontal_line_value: [],
                    horizontal_line_color: [],

                    backgroundColor: [],
                    borderColor: [],
                    borderWidth: 2,
                    hoverBackgroundColor: [],
                    hoverBorderColor: []
                };

                var all_value_min = Infinity;
                var all_value_max = -Infinity;

                for (var row_id = 0; row_id < table_data.length; row_id++) {
                    // Convert value to float
                    var item = self.parseNumericValue(table_data[row_id][sort_name]);
                    dataset.data.push(item.value);

                    if(header_options.value.formatter){
                        dataset.data_string.push(this.stripHTML(window[header_options.value.formatter](table_data[row_id][sort_name])));
                    }else{
                        dataset.data_string.push(this.injectValuePostfix(table_data[row_id][sort_name], header_options.value.postfix));
                    }

                    dataset.data_uniqueid.push(table_data[row_id][table_options.idField]);

                    // Make sure lower and upper limits are valid
                    var value_max = item.value_max;
                    var value_min = item.value_min;

                    if(all_value_max < item.value){
                        all_value_max = item.value;
                    }
                    if(all_value_min > item.value){
                        all_value_min = item.value;
                    }
                    if(value_min !== null && value_max !== null){
                        if(value_max < value_min) {
                            // Flip max and min
                            var value_tmp = value_min;
                            var value_min = value_max;
                            var value_max = value_tmp;
                        }

                        if(all_value_max < value_max){
                            all_value_max = value_max;
                        }

                        if(all_value_min > value_min){
                            all_value_min = value_min;
                        }
                    }

                    dataset.data_min.push(value_min);
                    dataset.data_max.push(value_max);

                    if (table_data[row_id].hasOwnProperty('_data') && table_data[row_id]['_data'].hasOwnProperty('hline') && typeof table_data[row_id]['_data']['hline'] !== 'undefined' && table_data[row_id]['_data']['hline']){
                        dataset.horizontal_line_value.push(item.value);

                        if (table_data[row_id].hasOwnProperty('_class') && typeof table_data[row_id]['_class'] !== 'undefined'){
                            dataset.horizontal_line_color.push(options.bar.colors[table_data[row_id]['_class']].bg.normal);

                        }else{
                            dataset.horizontal_line_color.push(options.bar.colors.default.bg.normal);
                        }
                    }

                    if (table_data[row_id].hasOwnProperty('_class') && typeof table_data[row_id]['_class'] !== 'undefined'){ // we have color defined
                        if( options.bar.colors.valid.indexOf(table_data[row_id]['_class']) > -1){
                            dataset.borderColor.push(options.bar.colors[table_data[row_id]['_class']].border.normal);
                            dataset.hoverBorderColor.push(options.bar.colors[table_data[row_id]['_class']].border.hover);
                            dataset.backgroundColor.push(options.bar.colors[table_data[row_id]['_class']].bg.normal);
                            dataset.hoverBackgroundColor.push(options.bar.colors[table_data[row_id]['_class']].bg.hover);

                        }else{
                            dataset.borderColor.push(options.bar.colors.default.border.normal);
                            dataset.hoverBorderColor.push(options.bar.colors.default.border.hover);
                            dataset.backgroundColor.push(options.bar.colors.default.bg.normal);
                            dataset.hoverBackgroundColor.push(options.bar.colors.default.bg.hover);
                        }

                    }else{
                        dataset.borderColor.push(options.bar.colors.default.border.normal);
                        dataset.hoverBorderColor.push(options.bar.colors.default.border.hover);
                        dataset.backgroundColor.push(options.bar.colors.default.bg.normal);
                        dataset.hoverBackgroundColor.push(options.bar.colors.default.bg.hover);
                    }

                    if(item.value > value_max){
                        value_max = item.value;
                    }
                    if(item.value < value_max){
                        value_min = item.value;
                    }
                }

                datasets.push(dataset);
            }

            if(header_options.chartable && datasets.length > 0){
                $(this.options.element.bar.div).show(0);

                // Axis scaling
                var axis_scale = 'linear';
                var axis_scale_type =null;
                if(header_options.axis.scale){

                    if(header_options.axis.scale.startsWith('log')) {
                        axis_scale = 'logarithmic';
                        axis_scale_type = 'log';

                        if(header_options.axis.scale === 'log_unit') {
                            axis_scale_type = 'log_unit';

                        }else if(header_options.axis.scale === 'log_exp'){
                            axis_scale_type = 'log_exp';

                        }else if(header_options.axis.scale === 'log10'){
                            axis_scale_type = 'log10';

                        }else if(header_options.axis.scale === 'log10_unit'){
                            axis_scale_type = 'log10_unit';

                        }else if(header_options.axis.scale === 'log10_exp'){
                            axis_scale_type = 'log10_exp';
                        }
                    }
                }

                var chart_data = {
                    labels: labels,
                    datasets: datasets
                };

                var tooltip_position = 'average';
                var padding = {
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0
                };
                var caretSize = 5;
                var caretPadding = 2;
                if(options.bar.tooltips.position === 'top'){
                    tooltip_position = 'line_centered_top';
                    padding = {
                        left: 0,
                        right: 0,
                        top: 45,
                        bottom: 0
                    };
                    caretSize = 0;
                    caretPadding = 0;

                }else if(options.bar.tooltips.position === 'bottom'){
                    tooltip_position = 'line_centered_bottom';
                    padding = {
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 45
                    };
                    caretSize = 0;
                    caretPadding = 0;
                }

                var chart_options = {
                    layout: {
                        padding: padding
                    },
                    scales: {
                        xAxes: [{
                            display: options.bar.xaxis.display,
                            stacked: stacked_chart,
                            ticks: {
                                autoSkip: false,
                                maxRotation: 90
                            }
                        }],
                        yAxes: [{
                            display: options.bar.yaxis.display,
                            stacked: stacked_chart,
                            type: axis_scale,
                            ticks: {
                                beginAtZero: header_options.beginatzero,
                                suggestedMax: all_value_max,
                                suggestedMin: all_value_min
                            },
                            scaleLabel: {
                                display: true,
                                labelString: header_options.value.label,
                                fontColor: 'black'
                            },
                            gridLines: {
                                display: options.bar.yaxis.gridlines
                            }
                        }]
                    },
                    maintainAspectRatio: true,
                    responsive: true,
                    animation: {
                        duration: options.animation.duration
                    },
                    title:{
                        display: false
                    },
                    legend: {
                        display: stacked_chart ? options.bar.legend.enabled : false,
                        position: options.bar.legend.position
                    },
                    vertical_indicator_line: {
                        enabled: stacked_chart ? false : options.bar.vertical_indicator_line.enabled,
                        lineWidth: options.bar.vertical_indicator_line.lineWidth,
                        strokeStyle: options.bar.vertical_indicator_line.strokeStyle
                    },
                    horizontal_highlights: {
                        enabled: stacked_chart ? false : options.bar.horizontal_highlights.enabled,
                        data: options.bar.horizontal_highlights.data,
                        opacity: options.bar.horizontal_highlights.opacity,
                        lineWidth: options.bar.horizontal_highlights.lineWidth,
                        strokeStyle: options.bar.horizontal_highlights.strokeStyle,
                        label: {
                            fillStyle: options.bar.horizontal_highlights.label.fillStyle,
                            font: options.bar.horizontal_highlights.label.font,
                            fontSize: options.bar.horizontal_highlights.label.fontSize,
                            position: options.bar.horizontal_highlights.label.position,
                            opacity: options.bar.horizontal_highlights.label.opacity
                        }
                    },
                    horizontal_line: {
                        enabled: stacked_chart ? false : options.bar.horizontal_line.enabled
                    },
                    horizontal_indicator_line: {
                        enabled: stacked_chart ? false : options.bar.horizontal_indicator_line.enabled,
                        lineWidth: options.bar.horizontal_indicator_line.lineWidth,
                        strokeStyle: options.bar.horizontal_indicator_line.strokeStyle,
                        fillStyle: options.bar.horizontal_indicator_line.fillStyle
                    },
                    error_bar: {
                        enabled: stacked_chart ? false : options.bar.error_bar.enabled,
                        lineWidth: options.bar.error_bar.lineWidth,
                        tipWidth: options.bar.error_bar.tipWidth,
                        strokeStyle: options.bar.error_bar.strokeStyle
                    },
                    tooltips: {
                        enabled: true,
                        mode: 'label',
                        position: tooltip_position,

                        caretSize: caretSize,
                        caretPadding: caretPadding,

                        titleFontSize: options.bar.tooltips.titleFontSize,
                        bodyFontSize: options.bar.tooltips.bodyFontSize,
                        bodyFontFamily: options.bar.tooltips.bodyFontFamily,
                        callbacks: {
                            title: function(tooltipItem, data){
                                return data.labels[tooltipItem[0].index];
                            }
                        }
                    },
                    chartArea: {
                        backgroundColor: options.bar.colors.background
                    },
                    onHover: function(event, elements){
                        if(event.type == 'mouseout' || event.type == 'touchend'){
                            $(self.element).find('tr td').removeClass('row-hover');

                        }else if(event.type == 'mousemove'){
                            if(elements.length > 0){
                                $(self.element).find('tr td').removeClass('row-hover');

                                var value_index = elements[0]._index;
                                var table_options = $(self.element).bootstrapTable('getOptions');
                                var row_index = value_index;
                                if(table_options.pagination){
                                    var page_number = Math.floor(value_index / table_options.pageSize)+1;
                                    if(page_number == table_options.pageNumber){
                                        row_index = value_index % table_options.pageSize;
                                        $(self.element).find('tbody tr:nth-child('+(row_index+1)+') td').addClass('row-hover');
                                    }

                                }else{
                                    $(self.element).find('tbody tr:nth-child('+(row_index+1)+') td').addClass('row-hover');
                                }
                            }
                        }
                    }
                };

                // Handle tooltip labels
                if(stacked_chart){
                    chart_options.tooltips.callbacks.label = function(tooltipItems, data){
                        var dataset_label = data.datasets[tooltipItems.datasetIndex].label;
                        var data_string = data.datasets[tooltipItems.datasetIndex].data_string[tooltipItems.index];
                        return data_string + ' (' + dataset_label + ')';
                    };

                }else{
                    chart_options.tooltips.callbacks.label = function(tooltipItems, data){
                        var data_string = data.datasets[tooltipItems.datasetIndex].data_string[tooltipItems.index];
                        return header_options.value.label + ': ' + data_string;
                    };
                }

                if(axis_scale === 'logarithmic'){
                    chart_options.scales.yAxes[0].ticks.callback = function (value, index, values) {

                        if(axis_scale_type.startsWith('log10')) {
                            if (!(value === 1e1 || value === 1e2 ||
                                value === 1e3 || value === 1e4 ||
                                value === 1e5 || value === 1e6 ||
                                value === 1e7 || value === 1e8 ||
                                value === 1e9 || value === 1e10)) {
                                return '';
                            }
                        }else if(axis_scale_type.startsWith('log')){
                            if(values.length > 10){
                                if(index % Math.ceil(values.length / 10.0) !== 0){
                                    return '';
                                }
                            }
                        }

                        if(axis_scale_type.endsWith('_unit')){
                            return self.addNumberPrefix(value);

                        }else if(axis_scale_type.endsWith('_exp')){
                            return value.toExponential(2);

                        }else{
                            return value;

                        }
                    }
                }

                this.bar_chart = new Chart(chart_ctx, {
                    type: 'barError',
                    data: chart_data,
                    options: chart_options
                });

            }else{
                if($(this.options.element.bar.div).is(":visible")){
                    $(this.options.element.bar.div).hide(0);
                }

            }
        },
        showBarChart: function (){
            var self = this;
            if(this.validBar()){
                if($(this.options.element.bar.div).is(":hidden")){
                    $(this.options.element.bar.div).show(this.options.animation.show_speed, function(){
                        self.updateBar();
                    });
                }
            }
        },
        hideBarChart: function (){
            if($(this.options.element.bar.div).is(":visible")){
                $(this.options.element.bar.div).hide(this.options.animation.hide_speed, function(){});
            }
        },

        // Line
        validLine: function (){
            var table_options = $(this.element).bootstrapTable('getOptions');

            var header_options = this.getHeaderOptions(table_options.sortName);
            var options = $.extend(true, {}, this.options);
            // Override global options with header wise options.
            options.line = $.extend(true, {}, options.line, header_options.line);

            // If no field is set, add current sort column.
            if(!options.line.fields){
                options.line.fields = [header_options.field];
            }
            if($(this.element).bootstrapTable('getData').length > 0){
                for(var field_id = 0; field_id < options.line.fields.length; field_id++) {
                    var current_header_options = this.getHeaderOptions(options.line.fields[field_id]);

                    if(current_header_options.chartable){
                        return true;
                    }
                }
            }
            return false;
        },
        updateLine: function (){
            var self = this;

            // Destroy existing chart
            if (this.line_chart){
                this.line_chart.destroy();
            }

            // Get table options and data
            var table_options = $(this.element).bootstrapTable('getOptions');
            var table_data = $(this.element).bootstrapTable('getData');
            var sort_name = table_options.sortName;

            // Get header options
            var header_options = this.getHeaderOptions(sort_name);

            // Override global options with header wise options.
            var options = $.extend(true, {}, this.options);
            options.line = $.extend(true, {}, options.line, header_options.line);

            // Get chart ctx
            var chart_ctx = document.getElementById(this.options.element.line.canvas.replace('#',''));
            chart_ctx.width = $(this.options.element.line.div).innerWidth();
            chart_ctx.height = options.line.height;

            // Get xaxis_field
            var xaxis_field = table_options.idField; // Default value
            if(options.line.xaxis.field){
                xaxis_field = options.line.xaxis.field
            }

            if(options.line.xaxis.sorted){
                // Sort data
                table_data.sort(function(a, b){
                    return self.valueSorter(a[xaxis_field], b[xaxis_field], 'asc');
                });
            }

            // Get axis labels
            var labels = [];
            for (var row_id = 0; row_id < table_data.length; row_id++) {
                var label = $("<div/>").html(table_data[row_id][xaxis_field]).text().trim().replace(/<(?:.|\n)*?>/gm, '').replace('_',' ');
                // Make sure labels are unique, if overlapping labels add whitespaces at the end.
                if(labels.indexOf(label) > -1){
                    var num_of_occurances = 0;
                    for (var label_id = 0; label_id < labels.length; label_id++){
                        if(labels[label_id] === label)
                            num_of_occurances++;
                    }
                    label = label + new Array(num_of_occurances + 1).join(' ');
                }
                labels.push(label);
            }

            // Axis scaling
            var axis_scale = 'linear';
            var axis_scale_type = null;

            var time_mode = false;
            if((new Date(labels[0])).getTime() > 0){
                time_mode = true;
            }

            // If no field is set, add current sort column.
            if(!options.line.fields){
                options.line.fields = [header_options.field];
            }

            var stacked_chart = false;
            var stacked_items = 1;
            if(options.line.fields.length == 1) {
                for (var field_id = 0; field_id < options.line.fields.length; field_id++){
                    for (var row_id = 0; row_id < table_data.length; row_id++) {
                        var values = self.parseDataList(table_data[row_id][options.line.fields[field_id]]);
                        if (values.length > 1) {
                            stacked_chart = true;
                            if (values.length > stacked_items) {
                                stacked_items = values.length;
                            }
                        }
                    }
                }
            }

            // Create datasets
            var datasets = [];

            var all_value_max = -Infinity;
            var all_value_min = Infinity;

            var beginAtZero = options.line.yaxis.beginatzero;

            if(stacked_chart) {
                if (header_options.dataset.labels.length == 0) {
                    header_options.dataset.labels = new Array(stacked_items);
                    for (var row_id = 0; row_id < table_data.length; row_id++) {
                        var values = self.parseDataList(table_data[row_id][sort_name]);
                        for (var value_id = 0; value_id < values.length; value_id++) {
                            if (values[value_id].label) {
                                header_options.dataset.labels[value_id] = values[value_id].label;
                            }
                        }
                    }
                }

                var current_header_options = this.getHeaderOptions(options.line.fields[0]);
                if(current_header_options.chartable){
                    if(!beginAtZero){
                        beginAtZero = current_header_options.beginatzero;
                    }
                    if(current_header_options.axis.scale){
                        if(current_header_options.axis.scale.startsWith('log')) {
                            axis_scale = 'logarithmic';
                            axis_scale_type = 'log';

                            if(current_header_options.axis.scale === 'log_unit') {
                                axis_scale_type = 'log_unit';

                            }else if(current_header_options.axis.scale === 'log_exp'){
                                axis_scale_type = 'log_exp';

                            }else if(current_header_options.axis.scale === 'log10'){
                                axis_scale_type = 'log10';

                            }else if(current_header_options.axis.scale === 'log10_unit'){
                                axis_scale_type = 'log10_unit';

                            }else if(current_header_options.axis.scale === 'log10_exp'){
                                axis_scale_type = 'log10_exp';
                            }
                        }
                    }

                    for(var dataset_id = 0; dataset_id < stacked_items; dataset_id++){
                        var dataset = {
                            label: header_options.dataset.labels[dataset_id], //current_header_options.title,
                            value_postfix: current_header_options.value.postfix,

                            data: [],
                            data_uniqueid: [],
                            data_min: [],
                            data_max: [],
                            data_string: [],

                            // Border line
                            borderWidth: 2,
                            borderColor: this.colorCode(options.line.colors.datasets[dataset_id]),
                            //hoverBorderColor: [],
                            lineTension: 0,
                            //spanGaps: true,

                            // Background
                            fill: true, //this.options.line.fill,
                            backgroundColor: this.colorCode(options.line.colors.datasets[dataset_id], 0.6),

                            // Point
                            pointRadius: [],
                            pointHoverRadius: []
                        };

                        for (var row_id = 0; row_id < table_data.length; row_id++) {
                            var values = self.parseDataList(table_data[row_id][sort_name]);
                            var value_sum = 0;
                            for (var ii = 0; ii < values.length; ii++) {
                                value_sum += values[ii]['y_value'];
                            }

                            var item = {
                                'value': null,
                                'value_max': null,
                                'value_min': null
                            };

                            if(values.length > dataset_id && values[dataset_id]['y_value']){

                                var percentage = values[dataset_id]['y_value'];
                                if(value_sum > 100.0 && value_sum < 101.0){
                                    percentage = percentage/value_sum * 100.0;
                                }
                                item.value = percentage;
                            }

                            if(current_header_options.value.formatter){
                                var value_string = this.stripHTML(window[current_header_options.value.formatter](item.value));
                                if(current_header_options.value.pad){
                                    value_string = (value_string + current_header_options.value.pad).substring(0, current_header_options.value.pad.length);
                                }
                                dataset.data_string.push(value_string);
                            }else{
                                dataset.data_string.push(this.injectValuePostfix(item.value, current_header_options.value.postfix));
                            }

                            dataset.data_uniqueid.push(table_data[row_id][table_options.idField]);

                            // Convert value to float
                            if(time_mode){
                                var time_label = $("<div/>").html(table_data[row_id][xaxis_field]).text().trim().replace(/<(?:.|\n)*?>/gm, '').replace('_',' ');
                                dataset.data.push(
                                    {
                                        x: time_label,
                                        y: item.value
                                    }
                                );

                            }else{
                                dataset.data.push(item.value);
                            }
                            if(options.line.point.enabled){
                                dataset.pointRadius.push(options.line.point.radius.normal);
                                dataset.pointHoverRadius.push(options.line.point.radius.hover);
                            }else{
                                dataset.pointRadius.push(0);
                                dataset.pointHoverRadius.push(0);
                            }
                        }

                        datasets.push(dataset);
                    }
                }

            }else{
                var dataset_id = 0;
                for(var field_id = 0; field_id < options.line.fields.length; field_id++){
                    var current_header_options = this.getHeaderOptions(options.line.fields[field_id]);
                    if(current_header_options.chartable){
                        if(!beginAtZero){
                            beginAtZero = current_header_options.beginatzero;
                        }

                        var valid_dataset = false;
                        if(options.line.fields){
                            if(options.line.fields.includes(current_header_options.field)){
                                valid_dataset = true;
                            }
                        }else{
                            valid_dataset = true;
                        }

                        // Include only valid datasets
                        if(valid_dataset){
                            if(current_header_options.axis.scale){
                                if(current_header_options.axis.scale.startsWith('log')) {
                                    axis_scale = 'logarithmic';
                                    axis_scale_type = 'log';

                                    if(current_header_options.axis.scale === 'log_unit') {
                                        axis_scale_type = 'log_unit';

                                    }else if(current_header_options.axis.scale === 'log_exp'){
                                        axis_scale_type = 'log_exp';

                                    }else if(current_header_options.axis.scale === 'log10'){
                                        axis_scale_type = 'log10';

                                    }else if(current_header_options.axis.scale === 'log10_unit'){
                                        axis_scale_type = 'log10_unit';

                                    }else if(current_header_options.axis.scale === 'log10_exp'){
                                        axis_scale_type = 'log10_exp';
                                    }
                                }
                            }
                            var dataset = {
                                label: current_header_options.title,
                                value_postfix: current_header_options.value.postfix,

                                data: [],
                                data_uniqueid: [],
                                data_min: [],
                                data_max: [],
                                data_string: [],

                                horizontal_line_value: [],

                                // Border line
                                borderWidth: 2,
                                borderColor: this.colorCode(options.line.colors.datasets[dataset_id]),
                                lineTension: 0,
                                spanGaps: true,

                                // Background
                                fill: options.line.fill,
                                backgroundColor: this.colorCode(options.line.colors.datasets[dataset_id], 0.10),

                                // Point
                                pointRadius: [],
                                pointHoverRadius: [],

                                pointBorderColor: [],
                                pointHoverBorderColor: [],

                                pointBackgroundColor: [],
                                pointHoverBackgroundColor: []
                            };

                            for (var row_id = 0; row_id < table_data.length; row_id++) {
                                if(current_header_options.value.formatter){
                                    dataset.data_string.push(self.stripHTML(window[current_header_options.value.formatter](table_data[row_id][current_header_options.field])));
                                }else{
                                    dataset.data_string.push(self.injectValuePostfix(table_data[row_id][current_header_options.field], current_header_options.value.postfix));
                                }

                                dataset.data_uniqueid.push(table_data[row_id][table_options.idField]);

                                // Convert value to float
                                var item = self.parseNumericValue(table_data[row_id][current_header_options.field]);
                                if(time_mode){
                                    var time_label = $("<div/>").html(table_data[row_id][xaxis_field]).text().trim().replace(/<(?:.|\n)*?>/gm, '').replace('_',' ');
                                    dataset.data.push(
                                        {
                                            x: time_label, //new Date(time_label),
                                            y: item.value
                                        }
                                    );

                                }else{
                                    dataset.data.push(item.value);
                                }

                                // Make sure lower and upper limits are valid
                                var value_max = item.value_max;
                                var value_min = item.value_min;

                                if(value_min !== null && value_max !== null){
                                    if(value_max < value_min) {
                                        // Flip max and min
                                        var value_tmp = value_min;
                                        value_min = value_max;
                                        value_max = value_tmp;
                                    }

                                    if(all_value_max < value_max){
                                        all_value_max = value_max;
                                    }

                                    if(all_value_min > value_min){
                                        all_value_min = value_min;
                                    }
                                }

                                dataset.data_min.push(value_min);
                                dataset.data_max.push(value_max);

                                if (table_data[row_id].hasOwnProperty('_data') && table_data[row_id]['_data'].hasOwnProperty('hline') && typeof table_data[row_id]['_data']['hline'] !== 'undefined' && table_data[row_id]['_data']['hline']){
                                    dataset.horizontal_line_value.push(item.value);
                                }

                                if (table_data[row_id].hasOwnProperty('_class') && typeof table_data[row_id]['_class'] !== 'undefined'){
                                    if(self.options.line.colors.valid.indexOf(table_data[row_id]['_class']) > -1){
                                        dataset.pointBorderColor.push(self.options.line.colors[table_data[row_id]['_class']].border.normal);
                                        dataset.pointHoverBorderColor.push(self.options.line.colors[table_data[row_id]['_class']].border.hover);
                                        dataset.pointBackgroundColor.push(self.options.line.colors[table_data[row_id]['_class']].bg.normal);
                                        dataset.pointHoverBackgroundColor.push(self.options.line.colors[table_data[row_id]['_class']].border.hover);

                                    }else{
                                        dataset.pointBorderColor.push(
                                            self.hexToRGB(options.line.colors.datasets[dataset_id], 0.5).css
                                        );
                                        dataset.pointHoverBorderColor.push(self.hexToRGB(options.line.colors.datasets[dataset_id], 0.8).css);

                                        dataset.pointBackgroundColor.push(
                                            self.hexToRGB(options.line.colors.datasets[dataset_id], 0.6).css
                                        );
                                        dataset.pointHoverBackgroundColor.push(
                                            self.hexToRGB(options.line.colors.datasets[dataset_id], 1.0).css
                                        );
                                    }

                                }else{
                                    dataset.pointBorderColor.push(
                                        self.hexToRGB(options.line.colors.datasets[dataset_id], 0.5).css
                                    );
                                    dataset.pointHoverBorderColor.push(self.hexToRGB(options.line.colors.datasets[dataset_id], 0.8).css);

                                    dataset.pointBackgroundColor.push(
                                        self.hexToRGB(options.line.colors.datasets[dataset_id], 0.6).css
                                    );
                                    dataset.pointHoverBackgroundColor.push(
                                        self.hexToRGB(options.line.colors.datasets[dataset_id], 1.0).css
                                    );
                                }
                                if(options.line.point.enabled){
                                    dataset.pointRadius.push(options.line.point.radius.normal);
                                    dataset.pointHoverRadius.push(options.line.point.radius.hover);
                                }else{
                                    dataset.pointRadius.push(0);
                                    dataset.pointHoverRadius.push(0);
                                }
                            }

                            datasets.push(dataset);
                            dataset_id++;
                        }
                    }
                }
            }

            if(datasets.length > 0){
                if(!axis_scale_type){
                    // Update y-axis scele
                    if(options.line.yaxis.scale){
                        if(options.line.yaxis.scale.startsWith('log')) {
                            axis_scale = 'logarithmic';
                            axis_scale_type = 'log';

                            if(options.line.yaxis.scale === 'log_unit') {
                                axis_scale_type = 'log_unit';

                            }else if(options.line.yaxis.scale === 'log_exp'){
                                axis_scale_type = 'log_exp';

                            }else if(options.line.yaxis.scale === 'log10'){
                                axis_scale_type = 'log10';

                            }else if(options.line.yaxis.scale === 'log10_unit'){
                                axis_scale_type = 'log10_unit';

                            }else if(options.line.yaxis.scale === 'log10_exp'){
                                axis_scale_type = 'log10_exp';
                            }
                        }
                    }
                }

                $(this.options.element.line.div).show(0);
                var chart_data = {
                    labels: labels,
                    datasets: datasets
                };

                var show_legend = false;
                if(datasets.length > 1){
                    if(options.line.legend.enabled){
                        show_legend = true;
                    }
                }

                // Tooltip position
                var tooltip_position = 'average';
                var padding = {
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0
                };

                if(options.line.tooltips.position === 'top'){
                    tooltip_position = 'line_centered_top';
                    padding = {
                        left: 0,
                        right: 0,
                        top: 40 + datasets.length *12,
                        bottom: 0
                    };
                }else if(options.line.tooltips.position === 'bottom'){
                    tooltip_position = 'line_centered_bottom';
                    padding = {
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 40 + datasets.length *12
                    };
                }

                var chart_options = {
                    showLines: options.line.line.enabled,
                    elements: {
                        line: {
                            tension: options.line.line.tension
                        }
                    },
                    layout: {
                        padding: padding
                    },
                    scales: {
                        xAxes: [{
                            display: options.line.xaxis.display,
                            stacked: false,
                            ticks: {
                                maxRotation: 90
                            },
                            gridLines: {
                                display: options.line.xaxis.gridlines
                            }
                        }],
                        yAxes: [{
                            stacked: stacked_chart,
                            type: axis_scale,
                            ticks: {
                                beginAtZero: beginAtZero,
                                suggestedMin: all_value_min,
                                suggestedMax: all_value_max
                            },
                            gridLines: {
                                display: options.line.yaxis.gridlines
                            }
                        }]

                    },
                    maintainAspectRatio: true,
                    responsive: true,
                    animation: {
                        duration: 0
                    },
                    hover: {
                        animationDuration: 0
                    },
                    responsiveAnimationDuration: 0,
                    title:{
                        display: false
                    },
                    legend: {
                        display: show_legend,
                        position: options.line.legend.position
                    },
                    horizontal_highlights: options.line.horizontal_highlights,
                    horizontal_line: options.line.horizontal_line,
                    vertical_indicator_line: options.line.vertical_indicator_line,
                    vertical_segments: options.line.vertical_segments,
                    horizontal_indicator_line: options.line.horizontal_indicator_line,
                    interval: options.line.interval,
                    error_bar: options.line.error_bar,
                    tooltips: {
                        enabled: true,
                        mode: 'label',
                        position: tooltip_position,
                        intersect: false,
                        caretSize: 0,
                        caretPadding: 0,

                        titleFontSize: options.line.tooltips.titleFontSize,
                        bodyFontSize: options.line.tooltips.bodyFontSize,
                        bodyFontFamily: options.line.tooltips.bodyFontFamily,

                        callbacks: {
                            afterBody: function(tooltipItems, data){
                                $(self.element).find('tr td').removeClass('row-hover');
                                var table_options = $(self.element).bootstrapTable('getOptions');
                                for (var i = 0; i < tooltipItems.length; i++) {
                                    var value_index = tooltipItems[i].index;
                                    $(self.element).find('tbody td:contains('+table_options.data[value_index][table_options.idField]+')').parent('tr').find('td').addClass('row-hover')
                                }
                            },
                            label: function(tooltipItems, data){
                                var data_string = data.datasets[tooltipItems.datasetIndex].data_string[tooltipItems.index];
                                return data_string + ' (' + data.datasets[tooltipItems.datasetIndex].label + ')';
                                //return data.datasets[tooltipItems.datasetIndex].label + ': ' + data_string;
                            }
                        }
                    },
                    chartArea: {
                        backgroundColor: options.line.colors.background
                    },
                    onHover: function(event, elements){
                        // Connect table rows and data points
                        if(event.type == 'mouseout' || event.type == 'touchend'){
                            // Reset row hover
                            $(self.element).find('tr td').removeClass('row-hover');

                        }else if(event.type == 'mousemove'){
                            if(elements.length > 0){
                                // Reset row hover
                                $(self.element).find('tr td').removeClass('row-hover');

                                var value_index = elements[0]._index;
                                var table_options = $(self.element).bootstrapTable('getOptions');

                                $(self.element).find('tbody td:contains('+table_options.data[value_index][table_options.idField]+')').parent('tr').find('td').addClass('row-hover')
                            }
                        }
                    }
                };

                // X-axis is time
                if(time_mode){
                    chart_options.scales.xAxes[0].type = 'time';
                    chart_options.scales.xAxes[0].distribution = 'linear';
                    chart_options.scales.xAxes[0].time = {};
                    chart_options.scales.xAxes[0].time.displayFormats = options.time.display_formats;

                    if(options.line.xaxis.timeunit){
                        chart_options.scales.xAxes[0].time.unit = options.line.xaxis.timeunit;
                    }
                    if(options.line.xaxis.timestepsize){
                        chart_options.scales.xAxes[0].time.stepSize = options.line.xaxis.timestepsize;
                    }
                    chart_options.scales.xAxes[0].ticks = {};
                }

                // Add y-axis label
                if(options.line.yaxis.label){
                    chart_options.scales.yAxes[0].scaleLabel = {
                        display: true,
                        labelString: options.line.yaxis.label,
                        fontColor: 'black'
                    }
                }

                // Handle y-axis scale
                if(axis_scale === 'logarithmic'){
                    chart_options.scales.yAxes[0].ticks.callback = function (value, index, values) {

                        if(axis_scale_type.startsWith('log10')) {
                            if (!(value === 1e1 || value === 1e2 ||
                                value === 1e3 || value === 1e4 ||
                                value === 1e5 || value === 1e6 ||
                                value === 1e7 || value === 1e8 ||
                                value === 1e9 || value === 1e10)) {
                                return '';
                            }
                        }else if(axis_scale_type.startsWith('log')){
                            if(values.length > 10){
                                if(index % Math.ceil(values.length / 10.0) !== 0){
                                    return '';
                                }
                            }
                        }

                        if(axis_scale_type.endsWith('_unit')){
                            return self.addNumberPrefix(value);

                        }else if(axis_scale_type.endsWith('_exp')){
                            return value.toExponential(2);

                        }else{
                            return value;

                        }
                    }
                }

                if(stacked_chart){
                    chart_options.interval.enabled = false;
                    chart_options.horizontal_indicator_line.enabled = false;
                    //chart_options.legend.display = false;
                }

                this.line_chart = new Chart(chart_ctx, {
                    type: 'line', //'stripe',
                    data: chart_data,
                    options: chart_options
                });


                this.line_chart_data = chart_data;

            }else{
                if($(this.options.element.line.div).is(":visible")){
                    $(this.options.element.line.div).hide(0);
                }
            }
        },
        showLineChart: function (){
            var self = this;
            if(this.validLine()) {
                if ($(this.options.element.line.div).is(":hidden")) {
                    $(this.options.element.line.div).show(this.options.animation.show_speed, function () {
                        self.updateLine();
                    });
                }
            }
        },
        hideLineChart: function (){
            if($(this.options.element.line.div).is(":visible")){
                $(this.options.element.line.div).hide(this.options.animation.hide_speed, function(){});
            }
        },

        // Scatter
        updateScatter: function () {
            var self = this;
            if (this.scatter_chart){
                this.scatter_chart.destroy();
            }
            var x_field = '';
            var x_label = '';
            var x_postfix = '';
            var x_scale_reverse = false;
            var y_field = '';
            var y_label = '';
            var y_postfix = '';
            var y_scale_reverse = false;
            $(this.options.element.scatter.selector_x_menu+' li a').each(function(){
                if($(this).data('selected') == 1){
                    x_field = $(this).data('field');
                    x_postfix = ' '+$(this).data('postfix');
                    x_scale_reverse = $(this).data('reversed');

                    if($(this).data('axis-label')){
                        x_label = $(this).data('axis-label');
                    }else{
                        x_label = $(this).text();
                    }
                    return false;
                }
            });
            $(this.options.element.scatter.selector_y_menu+' li a').each(function(){
                if($(this).data('selected') == 1){
                    y_field = $(this).data('field');
                    y_postfix = ' '+$(this).data('postfix');
                    y_scale_reverse = $(this).data('reversed');

                    if($(this).data('axis-label')){
                        y_label = $(this).data('axis-label');
                    }else{
                        y_label = $(this).text();
                    }
                    return false;
                }
            });
            var table_options = $(this.element).bootstrapTable('getOptions');
            var table_data = $(this.element).bootstrapTable('getData');
            var sort_name = table_options.sortName;
            var id_field = table_options.idField;
            var chartable = $(this.element).find('thead tr th[data-field=\"'+sort_name+'\"]').data('chartable');
            var labels = [];
            var data = [];
            var data_uniqueid = [];
            var data_min = [];
            var data_max = [];
            var data_string = [];

            var x_all_value_max = -Infinity;
            var x_all_value_min = Infinity;

            var y_all_value_max = -Infinity;
            var y_all_value_min = Infinity;

            var point_border_colors = [];
            var point_border_hover_colors = [];
            var point_bg_colors = [];
            var point_bg_hover_colors = [];
            var point_radius = [];
            var point_hover_radius = [];

            // value formatters
            var header_x = $(this.element).find('thead tr th[data-field=\"'+x_field+'\"]');
            var header_y = $(this.element).find('thead tr th[data-field=\"'+y_field+'\"]');

            var value_formatter_x = null;
            var value_formatter_y = null;

            if(typeof header_x.data('formatter') !== 'undefined'){
                value_formatter_x = header_x.data('formatter');
            }
            if(typeof header_y.data('formatter') !== 'undefined'){
                value_formatter_y = header_y.data('formatter');
            }

            for (var i = 0; i < table_data.length; i++) {
                labels.push($("<div/>").html(table_data[i][this.options.table.id_field]).text().replace(/<(?:.|\n)*?>/gm, ''));

                if (table_data[i].hasOwnProperty('_class') && typeof table_data[i]['_class'] !== 'undefined'){
                    if(this.options.scatter.colors.valid.indexOf(table_data[i]['_class']) > -1){
                        point_border_colors.push(this.options.scatter.colors[table_data[i]['_class']].border.normal);
                        point_border_hover_colors.push(this.options.scatter.colors[table_data[i]['_class']].border.hover);
                        point_bg_colors.push(this.options.scatter.colors[table_data[i]['_class']].bg.normal);
                        point_bg_hover_colors.push(this.options.scatter.colors[table_data[i]['_class']].border.hover);
                    }else{
                        point_border_colors.push(this.options.scatter.colors.default.border.normal);
                        point_border_hover_colors.push(this.options.scatter.colors.default.border.hover);
                        point_bg_colors.push(this.options.scatter.colors.default.bg.normal);
                        point_bg_hover_colors.push(this.options.scatter.colors.default.bg.hover);
                    }
                }else{
                    point_border_colors.push(this.options.scatter.colors.default.border.normal);
                    point_border_hover_colors.push(this.options.scatter.colors.default.border.hover);
                    point_bg_colors.push(this.options.scatter.colors.default.bg.normal);
                    point_bg_hover_colors.push(this.options.scatter.colors.default.bg.hover);
                }

                // Parse values
                var x_item = self.parseNumericValue(table_data[i][x_field]);
                var y_item = self.parseNumericValue(table_data[i][y_field]);

                data.push({
                    x:x_item.value,
                    y:y_item.value
                });

                var x_string = null;
                var y_string = null;
                if(value_formatter_x) {
                    x_string = this.stripHTML(window[value_formatter_x](table_data[i][x_field]));
                }else{
                    x_string = this.injectValuePostfix(table_data[i][x_field], x_postfix);
                }
                if(value_formatter_y) {
                    y_string = this.stripHTML(window[value_formatter_y](table_data[i][y_field]));
                }else{
                    y_string = this.injectValuePostfix(table_data[i][y_field], y_postfix);
                }

                data_string.push({
                        x: x_string,
                        y: y_string
                    }
                );

                data_uniqueid.push(table_data[i][table_options.idField]);

                // Make sure lower and upper limits are valid
                var x_value_max = x_item.value_max;
                var x_value_min = x_item.value_min;

                if(x_all_value_max < x_item.value){
                    x_all_value_max = x_item.value;
                }
                if(x_all_value_min > x_item.value){
                    x_all_value_min = x_item.value;
                }

                if(x_value_min !== null && x_value_max !== null){
                    if(x_value_max < x_value_min) {
                        // Flip max and min
                        var x_value_tmp = x_value_min;
                        x_value_min = x_value_max;
                        x_value_max = x_value_tmp;
                    }

                    if(x_all_value_max < x_value_max){
                        x_all_value_max = x_value_max;
                    }

                    if(x_all_value_min > x_value_min){
                        x_all_value_min = x_value_min;
                    }
                }

                var y_value_max = y_item.value_max;
                var y_value_min = y_item.value_min;

                if(y_all_value_max < y_item.value){
                    y_all_value_max = y_item.value;
                }
                if(y_all_value_min > y_item.value){
                    y_all_value_min = y_item.value;
                }

                if(y_value_min !== null && y_value_max !== null){
                    if(y_value_max < y_value_min) {
                        // Flip max and min
                        var y_value_tmp = y_value_min;
                        y_value_min = y_value_max;
                        y_value_max = y_value_tmp;
                    }

                    if(y_all_value_max < y_value_max){
                        y_all_value_max = y_value_max;
                    }

                    if(y_all_value_min > y_value_min){
                        y_all_value_min = y_value_min;
                    }
                }

                data_min.push({
                    x: x_value_min,
                    y: y_value_min
                });
                data_max.push({
                    x: x_value_max,
                    y: y_value_max
                });

                point_radius.push(this.options.scatter.point.radius.normal);
                point_hover_radius.push(this.options.scatter.point.radius.hover);
            }

            // Axis scaling
            var axis_x_scale = 'linear';
            var axis_x_scale_type =null;
            if(typeof header_x.data('axis-scale') !== 'undefined'){

                if(header_x.data('axis-scale').startsWith('log')) {
                    axis_x_scale = 'logarithmic';
                    axis_x_scale_type = 'log';

                    if(header_x.data('axis-scale') === 'log_unit') {
                        axis_x_scale_type = 'log_unit';

                    }else if(header_x.data('axis-scale') === 'log_exp'){
                        axis_x_scale_type = 'log_exp';

                    }else if(header_x.data('axis-scale') === 'log10'){
                        axis_x_scale_type = 'log10';

                    }else if(header_x.data('axis-scale') === 'log10_unit'){
                        axis_x_scale_type = 'log10_unit';

                    }else if(header_x.data('axis-scale') === 'log10_exp'){
                        axis_x_scale_type = 'log10_exp';
                    }
                }
            }

            var axis_y_scale = 'linear';
            var axis_y_scale_type =null;
            if(typeof header_y.data('axis-scale') !== 'undefined'){

                if(header_y.data('axis-scale').startsWith('log')) {
                    axis_y_scale = 'logarithmic';
                    axis_y_scale_type = 'log';

                    if(header_y.data('axis-scale') === 'log_unit') {
                        axis_y_scale_type = 'log_unit';

                    }else if(header_y.data('axis-scale') === 'log_exp'){
                        axis_y_scale_type = 'log_exp';

                    }else if(header_y.data('axis-scale') === 'log10'){
                        axis_y_scale_type = 'log10';

                    }else if(header_y.data('axis-scale') === 'log10_unit'){
                        axis_y_scale_type = 'log10_unit';

                    }else if(header_y.data('axis-scale') === 'log10_exp'){
                        axis_y_scale_type = 'log10_exp';
                    }
                }
            }

            var chart_ctx = document.getElementById(this.options.element.scatter.canvas.replace('#',''));
            chart_ctx.width = $(this.options.element.scatter.div).innerWidth();
            chart_ctx.height = this.options.scatter.height;

            var chart_options = {
                maintainAspectRatio: true,
                responsive: true,
                animation: {
                    duration: this.options.animation.duration
                },
                title:{
                    display: false
                },
                legend: {
                    display: false
                },
                vertical_indicator_line: {
                    enabled: this.options.scatter.vertical_indicator_line.enabled,
                    lineWidth: this.options.scatter.vertical_indicator_line.lineWidth,
                    strokeStyle: this.options.scatter.vertical_indicator_line.strokeStyle
                },
                horizontal_indicator_line: {
                    enabled: this.options.scatter.horizontal_indicator_line.enabled,
                    lineWidth: this.options.scatter.horizontal_indicator_line.lineWidth,
                    fillStyle: this.options.scatter.horizontal_indicator_line.fillStyle,
                    strokeStyle: this.options.scatter.horizontal_indicator_line.strokeStyle
                },
                error_bar: {
                    enabled: this.options.scatter.error_bar.enabled,
                    lineWidth: this.options.scatter.error_bar.lineWidth,
                    strokeStyle: this.options.scatter.error_bar.strokeStyle,
                    fillStyle: this.options.scatter.error_bar.fillStyle,
                    tipWidth: this.options.scatter.error_bar.tipWidth,
                    bounding_box: this.options.scatter.error_bar.bounding_box
                },
                tooltips: {
                    enabled: true,
                    mode: 'label',
                    titleFontSize: this.options.scatter.tooltips.titleFontSize,
                    bodyFontSize: this.options.scatter.tooltips.bodyFontSize,

                    callbacks: {
                        title: function(tooltipItem, data){
                            return data.labels[tooltipItem[0].index];
                        },
                        label: function(tooltipItems, data){
                            var data_string = data.datasets[tooltipItems.datasetIndex].data_string[tooltipItems.index];

                            var value = data.datasets[0].data[tooltipItems.index];

                            return ['x: ' + data_string['x'] + ' (' + x_label + ')',
                                    'y: ' + data_string['y'] + ' (' + y_label + ')'
                                    ];
                        }
                    }
                },
                scales: {
                    xAxes: [{
                        position: 'bottom',
                        type: axis_x_scale,
                        ticks: {
                            reverse: x_scale_reverse,
                            suggestedMin: x_all_value_min,
                            suggestedMax: x_all_value_max
                        },
                        scaleLabel: {
                            display: true,
                            labelString: x_label,
                            fontColor: 'black'
                        }
                    }],
                    yAxes: [{
                        position: 'left',
                        type: axis_y_scale,
                        ticks: {
                            reverse: y_scale_reverse,
                            suggestedMin: y_all_value_min,
                            suggestedMax: y_all_value_max
                        },
                        scaleLabel: {
                            display: true,
                            labelString: y_label,
                            fontColor: 'black'
                        }
                    }]
                },
                showLines: false,
                chartArea: {
                    backgroundColor: this.options.scatter.colors.background
                },
                onHover: function(event, elements){
                    if(event.type === 'mouseout' || event.type === 'touchend'){
                        $(self.element).find('tr td').removeClass('row-hover');
                    }else if(event.type === 'mousemove'){
                        if(elements.length > 0){
                            $(self.element).find('tr td').removeClass('row-hover');

                            var value_index = elements[0]._index;
                            var table_options = $(self.element).bootstrapTable('getOptions');
                            var row_index = value_index;
                            if(table_options.pagination){
                                var page_number = Math.floor(value_index / table_options.pageSize)+1;
                                if(page_number === table_options.pageNumber){
                                    row_index = value_index % table_options.pageSize;
                                    $(self.element).find('tbody tr:nth-child('+(row_index+1)+') td').addClass('row-hover');
                                }
                            }else{
                                $(self.element).find('tbody tr:nth-child('+(row_index+1)+') td').addClass('row-hover');
                            }
                        }
                    }
                }
            };

            if(axis_x_scale === 'logarithmic'){
                chart_options.scales.xAxes[0].ticks.callback = function (value, index, values) {

                    if(axis_x_scale_type.startsWith('log10')) {
                        if (!(value === 1e1 || value === 1e2 ||
                            value === 1e3 || value === 1e4 ||
                            value === 1e5 || value === 1e6 ||
                            value === 1e7 || value === 1e8 ||
                            value === 1e9 || value === 1e10)) {
                            return '';
                        }
                    }else if(axis_x_scale_type.startsWith('log')){
                        if(values.length > 10){
                            if(index % Math.ceil(values.length / 10.0) !== 0){
                                return '';
                            }
                        }
                    }

                    if(axis_x_scale_type.endsWith('_unit')){
                        return self.addNumberPrefix(value);
                    }else if(axis_x_scale_type.endsWith('_exp')){
                        return value.toExponential(2);
                    }else{
                        return value;
                    }
                }
            }

            if(axis_y_scale === 'logarithmic'){
                chart_options.scales.yAxes[0].ticks.callback = function (value, index, values) {

                    if(axis_y_scale_type.startsWith('log10')) {
                        if (!(value === 1e1 || value === 1e2 ||
                            value === 1e3 || value === 1e4 ||
                            value === 1e5 || value === 1e6 ||
                            value === 1e7 || value === 1e8 ||
                            value === 1e9 || value === 1e10)) {
                            return '';
                        }
                    }else if(axis_y_scale_type.startsWith('log')){
                        if(values.length > 10){
                            if(index % Math.ceil(values.length / 10.0) !== 0){
                                return '';
                            }
                        }
                    }

                    if(axis_y_scale_type.endsWith('_unit')){
                        return self.addNumberPrefix(value);
                    }else if(axis_y_scale_type.endsWith('_exp')){
                        return value.toExponential(2);
                    }else{
                        return value;
                    }
                }
            }

            var chart_data = {
                labels: labels,
                datasets: [{
                    data: data,
                    data_uniqueid: data_uniqueid,
                    data_min: data_min,
                    data_max: data_max,
                    data_string: data_string,
                    borderWidth: this.options.scatter.point.borderWidth,
                    pointBackgroundColor: point_bg_colors,
                    pointBorderWidth: point_border_colors,
                    pointHoverBackgroundColor: point_bg_hover_colors,
                    pointHoverBorderColor: point_border_hover_colors,
                    pointRadius: point_radius,
                    pointHoverRadius: point_hover_radius
                }]
            };
            this.scatter_chart = new Chart(chart_ctx, {
                type: 'line', //'stripe',
                data: chart_data,
                options: chart_options
            });
        },
        showScatterChart: function (){
            var self = this;
            if($(this.options.element.scatter.div).is(":hidden")){
                $(this.options.element.scatter.div).show(this.options.animation.show_speed, function(){
                    self.updateScatter();
                });
            }
        },
        hideScatterChart: function (){
            if($(this.options.element.scatter.div).is(":visible")){
                $(this.options.element.scatter.div).hide(this.options.animation.hide_speed, function(){});
            }
        },

        // Comparison
        initComparison: function(){
            var table_data = $(this.element).bootstrapTable('getData');
            if(table_data.length > 1 && this.comparison_init){
                for (var i = 0; i < table_data.length; i++) {
                    // Go through the table data and push them to the dropdown menus
                    var field = table_data[i][this.options.table.id_field].trim();
                    var label = table_data[i][this.options.table.id_field].trim().replace('_',' ');
                    // A row
                    var active = '';
                    var selected = '0';
                    if(field == this.options.comparison.a_row){
                        active = ' class="active" ';
                        selected = '1';
                        $(this.options.element.comparison.selector_a_button).html(label+' '+this.options.icon.caret);
                    }
                    $(this.options.element.comparison.selector_a_menu).append(
                        '<li'+active+'><a data-row="'+field+'" data-selected="'+selected+'" href="#" onclick="return false;">'+label+'</a></li>'
                    );

                    // B row
                    var active = '';
                    var selected = '0';
                    if(field == this.options.comparison.b_row){
                        active = ' class="active" ';
                        selected = '1';
                        $(this.options.element.comparison.selector_b_button).html(label+' '+this.options.icon.caret);
                    }
                    $(this.options.element.comparison.selector_b_menu).append(
                        '<li'+active+'><a data-row="'+field+'" data-selected="'+selected+'" href="#" onclick="return false;">'+label+'</a></li>'
                    );
                }
                this.comparison_init = false; // prevent reinitialization
            }
        },
        updateComparison: function () {
            var self = this;
            if (this.comparison_chart){
                this.comparison_chart.destroy();
            }

            var chart_ctx = document.getElementById(this.options.element.comparison.canvas.replace('#',''));
            chart_ctx.width = $(this.options.element.comparison.div).innerWidth();
            chart_ctx.height = this.options.comparison.height;
            var table_options = $(this.element).bootstrapTable('getOptions');
            var table_data = $(this.element).bootstrapTable('getData');

            var sort_name = table_options.sortName;
            var id_field = table_options.idField;

            var a_row = '';
            var a_label = '';
            var b_row = '';
            var b_label = '';
            var set_id = '';
            var set_label = '';

            $(this.options.element.comparison.selector_a_menu+' li a').each(function(){
                if($(this).data('selected') == 1){
                    a_row = $(this).data('row');
                    a_label = $(this).text();
                    return false;
                }
            });
            $(this.options.element.comparison.selector_b_menu+' li a').each(function(){
                if($(this).data('selected') == 1){
                    b_row = $(this).data('row');
                    b_label = $(this).text();
                    return false;
                }
            });
            $(this.options.element.comparison.selector_set_menu+' li a').each(function(){
                if($(this).data('selected') == 1){
                    set_id = $(this).data('set');
                    set_label = $(this).text();
                    return false;
                }
            });
            var set = $.grep(this.options.comparison.sets, function(e){ return e.title == set_label; });
            set = set[0];

            var set_fields = [];
            for (var i = 0; i<set.fields.length; i++){
                var field_name = set.fields[i];
                var chartable = $(this.element).find('thead tr th[data-field=\"'+field_name+'\"]').data('chartable');

                var title;
                if(set.hasOwnProperty('field_titles') && set.field_titles[i]){
                    title = set.field_titles[i];
                }else{
                    title = $(this.element).find('thead tr th[data-field=\"'+field_name+'\"]').text().replace(/(\r\n|\n|\r)/gm,"").trim();
                }

                var value_postfix = $(this.element).find('thead tr th[data-field=\"'+field_name+'\"]').data('postfix');
                set_fields.push({
                    'field': field_name,
                    'title': title,
                    'chartable': chartable,
                    'value_postfix': value_postfix
                });
            }

            var data_a = $.grep(table_data, function(e){
                var id = e[self.options.comparison.row_id_field].replace(/(\r\n|\n|\r)/gm,"").trim();
                return id == a_row;
            });
            if(data_a.length == 1){
                data_a = data_a[0];
            }

            var data_b = $.grep(table_data, function(e){
                var id = e[self.options.comparison.row_id_field].replace(/(\r\n|\n|\r)/gm,"").trim();
                return id == b_row;
            });
            if(data_b.length == 1){
                data_b = data_b[0];
            }

            var labels = [];

            var all_value_min = Infinity;
            var all_value_max = -Infinity;

            var set_a_data = [];
            var set_a_data_string = [];
            var set_a_data_min = [];
            var set_a_data_max = [];

            var set_b_data = [];
            var set_b_data_string = [];
            var set_b_data_min = [];
            var set_b_data_max = [];

            for (var field_id = 0; field_id < set_fields.length; field_id++){
                if(set_fields[field_id].chartable){

                    labels.push(set_fields[field_id].title);

                    var item_a = self.parseNumericValue(data_a[set_fields[field_id].field]);
                    var item_b = self.parseNumericValue(data_b[set_fields[field_id].field]);

                    // Data values
                    set_a_data.push(item_a.value);
                    set_b_data.push(item_b.value);

                    // Data min and max values
                    // Make sure lower and upper limits are valid
                    var value_a_max = item_a.value_max;
                    var value_a_min = item_a.value_min;
                    if(value_a_min !== null && value_a_max !== null){
                        if(value_a_max < value_a_min) {
                            // Flip max and min
                            var value_a_tmp = value_a_min;
                            var value_a_min = value_a_max;
                            var value_a_max = value_a_tmp;
                        }

                        if(all_value_max < item_a.value){
                            all_value_max = item_a.value;
                        }
                        if(all_value_max < value_a_max){
                            all_value_max = value_a_max;
                        }

                        if(all_value_min > item_a.value){
                            all_value_min = item_a.value;
                        }
                        if(all_value_min > value_a_min){
                            all_value_min = value_a_min;
                        }
                    }

                    set_a_data_min.push(value_a_min);
                    set_a_data_max.push(value_a_max);

                    // Make sure lower and upper limits are valid
                    var value_b_max = item_b.value_max;
                    var value_b_min = item_b.value_min;
                    if(value_b_min !== null && value_b_max !== null){
                        if(value_b_max < value_b_min) {
                            // Flip max and min
                            var value_b_tmp = value_b_min;
                            var value_b_min = value_b_max;
                            var value_b_max = value_b_tmp;
                        }

                        if(all_value_max < item_b.value){
                            all_value_max = item_b.value;
                        }
                        if(all_value_max < value_b_max){
                            all_value_max = value_b_max;
                        }

                        if(all_value_min > item_b.value){
                            all_value_min = item_b.value;
                        }
                        if(all_value_min > value_b_min){
                            all_value_min = value_b_min;
                        }
                    }

                    set_b_data_min.push(value_b_min);
                    set_b_data_max.push(value_b_max);

                    // Get headers
                    var header_a = $(this.element).find('thead tr th[data-field=\"'+set_fields[field_id].field+'\"]');
                    var header_b = $(this.element).find('thead tr th[data-field=\"'+set_fields[field_id].field+'\"]');

                    // Get value postfix
                    var value_a_postfix = '';
                    var value_b_postfix = '';
                    if(typeof header_a.data('postfix') !== 'undefined'){
                        value_a_postfix = header_a.data('postfix');
                    }
                    if(typeof header_b.data('postfix') !== 'undefined'){
                        value_b_postfix = header_b.data('postfix');
                    }

                    // Get value formatter
                    var value_a_formatter = null;
                    var value_b_formatter = null;
                    if(typeof header_a.data('formatter') !== 'undefined'){
                        value_a_formatter = header_a.data('formatter');
                    }
                    if(typeof header_b.data('formatter') !== 'undefined'){
                        value_b_formatter = header_b.data('formatter');
                    }

                    // Format values
                    if(value_a_formatter){
                        set_a_data_string.push(this.stripHTML(window[value_a_formatter](data_a[set_fields[field_id].field])));
                    }else{
                        set_a_data_string.push(this.injectValuePostfix(data_a[set_fields[field_id].field], value_a_postfix));
                    }
                    if(value_b_formatter){
                        set_b_data_string.push(this.stripHTML(window[value_b_formatter](data_b[set_fields[field_id].field])));
                    }else{
                        set_b_data_string.push(this.injectValuePostfix(data_b[set_fields[field_id].field], value_b_postfix));
                    }
                }
            }

            var datasets = [
                {
                    label: a_label,

                    data: set_a_data,
                    data_min: set_a_data_min,
                    data_max: set_a_data_max,
                    data_string: set_a_data_string,

                    backgroundColor: this.options.comparison.a_color,
                    borderWidth: 0,
                    borderColor: this.options.comparison.a_color
                },
                {
                    label: b_label,

                    data: set_b_data,
                    data_min: set_b_data_min,
                    data_max: set_b_data_max,
                    data_string: set_b_data_string,

                    backgroundColor: this.options.comparison.b_color,
                    borderWidth: 0,
                    borderColor: this.options.comparison.b_color
                }
            ];

            if(set_a_data.length > 0 && set_b_data.length > 0){
                $(this.options.element.comparison.div).show(0);
                var chart_data = {
                    labels: labels,
                    datasets:datasets
                };
                var chart_options = {
                    maintainAspectRatio: true,
                    responsive: true,
                    animation: {
                        duration: this.options.animation.duration
                    },
                    title:{
                        display: false
                    },
                    legend: {
                        display: false,
                        position: 'bottom'
                    },
                    scales: {
                        xAxes: [{
                            display: true,
                            stacked: false,
                            ticks: {
                                autoSkip: false,
                                maxRotation: 90
                            }
                        }],

                        yAxes: [{
                            stacked: false,
                            type: 'linear',
                            ticks: {
                                beginAtZero: true,
                                suggestedMax: all_value_max,
                                suggestedMin: all_value_min
                            },
                            scaleLabel: {
                                display: true,
                                labelString: set.data_axis_title,
                                fontColor: 'black'
                            }
                        }]
                    },
                    error_bar: {
                        enabled: this.options.comparison.error_bar.enabled,
                        lineWidth: this.options.comparison.error_bar.lineWidth,
                        tipWidth: this.options.comparison.error_bar.tipWidth,
                        strokeStyle: this.options.comparison.error_bar.strokeStyle
                    },
                    tooltips: {
                        enabled: true,
                        mode: 'label',

                        titleFontSize: this.options.comparison.tooltips.titleFontSize,
                        bodyFontSize: this.options.comparison.tooltips.bodyFontSize,
                        callbacks: {
                            title: function(tooltipItem, data){
                                return data.labels[tooltipItem[0].index];
                            },
                            label: function(tooltipItems, data){
                                var data_string = data.datasets[tooltipItems.datasetIndex].data_string[tooltipItems.index];

                                if(tooltipItems.datasetIndex == 0){
                                    return a_label + ': ' + data_string;
                                }else{
                                    return b_label + ': ' + data_string;
                                }
                            }
                        }
                    },
                    chartArea: {
                        backgroundColor: this.options.comparison.colors.background
                    }
                };
                this.comparison_chart = new Chart(chart_ctx, {
                    type: 'barError',
                    data: chart_data,
                    options: chart_options
                });
            }else{
                if($(this.options.element.comparison.div).is(":visible")){
                    $(this.options.element.comparison.div).hide(this.options.animation.hide_speed);
                }
            }
        },
        showComparisonChart: function (){
            var self = this;
            if($(this.options.element.comparison.div).is(":hidden")){
                $(this.options.element.comparison.div).show(this.options.animation.show_speed, function(){
                    self.updateComparison();
                });
            }
        },
        hideComparisonChart: function (){
            if($(this.options.element.comparison.div).is(":visible")){
                $(this.options.element.comparison.div).hide(this.options.animation.hide_speed, function(){});
            }
        },

        updateTags: function(){
            var self = this;
            if(this.options.tag_mode =='global'){
                var map = {};
                var values = {};
                $.each(this.field_meta, function(index, meta){
                    if(meta.tag){
                        $(self.element).find('tbody tr').each(function(){
                            var value = $(this).find('td').eq(index).text().trim();
                            value.split(',').forEach(function (item) {
                                if(!(item.trim() in values)){
                                    values[item.trim()] = 0;
                                }
                                values[item.trim()]++;
                            });
                        });
                    }
                });
                var sortable = [];
                for (var value_group in values){
                    sortable.push([value_group, values[value_group]]);
                    sortable.sort(
                        function(a, b) {
                            return b[1] - a[1]
                        }
                    )
                }
                $.each(sortable, function(i, val){
                    map[val[0]] = i;
                });

                $.each(this.field_meta, function(index, meta){
                    if(meta.tag){
                        $(self.element).find('tbody tr').each(function(){
                            var value = $(this).find('td').eq(index).text().trim();
                            var html = '';
                            value.split(',').forEach(function (item) {
                                var tag_css = self.options.tags.css[map[item.trim()]];
                                if(tag_css == undefined){
                                    var tag_css = self.options.tags.css[self.options.tags.css.length-1];
                                }
                                html += '<span class="'+tag_css+'">'+item.trim()+'</span>';

                            });
                            $(this).find('td').eq(index).html(html);
                        })
                    }
                })

            }else if(this.options.tag_mode =='column'){
                var map = {};
                $.each(this.field_meta, function(index, meta){
                    if(meta.tag){
                        var values = {};
                        $(self.element).find('tbody tr').each(function(){
                            var value = $(this).find('td').eq(index).text().trim();
                            value.split(',').forEach(function (item) {
                                if (!(item.trim() in values)) {
                                    values[item.trim()] = 0;
                                }
                                values[item.trim()]++;
                            });
                        });
                        var sortable = [];
                        for (var value_group in values){
                            sortable.push([value_group, values[value_group]]);
                            sortable.sort(
                                function(a, b) {
                                    return b[1] - a[1]
                                }
                            )
                        }
                        $.each(sortable, function(i, val){
                            map[val[0]] = i;
                        });
                        $(self.element).find('tbody tr').each(function(){
                            var value = $(this).find('td').eq(index).text().trim();
                            var html = '';
                            value.split(',').forEach(function (item) {
                                var tag_css = self.options.tags.css[map[item.trim()]];
                                if(tag_css == undefined){
                                    var tag_css = self.options.tags.css[self.options.tags.css.length-1];
                                }
                                html += '<span class="'+tag_css+'">'+item.trim()+'</span>';
                            });
                            $(this).find('td').eq(index).html(html);
                        })
                    }
                })
            }

        },

        // Ranking
        updateRank: function () {
            // Calculate rank values for whole table while taking account rows with same value
            this.table_rank = [];
            var table_data = $(this.element).bootstrapTable('getData');
            if(table_data.length > 1){
                var table_options = $(this.element).bootstrapTable('getOptions');
                var sort_name = table_options.sortName;
                var rank = 0;
                var prev = table_data[0][sort_name]-1;
                var rank_unique = 1;
                for (var i = 0; i < table_data.length; i++) {
                    var value = parseFloat(table_data[i][sort_name]);
                    if(value != prev){
                        rank++;
                        prev = value;
                        this.table_rank.push(rank);
                    }else{
                        rank_unique = 0;
                        if(this.options.rank_mode == 'grouped_empty'){
                            this.table_rank.push('');
                        }else if(this.options.rank_mode == 'grouped_muted'){
                            this.table_rank.push('<span class=\"text-muted\">'+rank+'</span>')
                        }else{
                            this.table_rank.push(rank);
                        }
                    }
                }
            }
            $(this.element).bootstrapTable('updateCell',{index: 0, field: 'rank', value: '-'});
        },
        getRank: function(index){
            // Get precomputed rank value
            return this.table_rank[index];
        },

        // Tooltip control
        resetChartTooltip: function(chart_object, dataset_index){
            if(chart_object.ctx){
                chart_object.tooltip._active = [];
                chart_object.tooltip.update(true);

                chart_object.draw();
                chart_object.updateHoverStyle(chart_object.getDatasetMeta(dataset_index).data, null, false);
                chart_object.render();
            }
        },
        openChartTooltip: function(chart_object, dataset_index, point_index){
            if(chart_object.ctx){
                if(typeof chart_object.tooltip._active === 'undefined'){
                    chart_object.tooltip._active = [];
                }

                var activeElements = chart_object.tooltip._active;

                var requestedElem = chart_object.getDatasetMeta(dataset_index).data[point_index];
                for(var i = 0; i < activeElements.length; i++) {
                    if(requestedElem._index == activeElements[i]._index && requestedElem._datasetIndex == activeElements[i]._datasetIndex)
                        return;
                }

                activeElements.push(requestedElem);
                chart_object.tooltip._active = activeElements;
                chart_object.tooltip.update(true);

                chart_object.draw();

                chart_object.updateHoverStyle([requestedElem], null, true);
                chart_object.render();
            }
        },
        closeChartTooltip: function(chart_object, dataset_index, point_index){
            if(chart_object.ctx) {
                var activeElements = chart_object.tooltip._active;
                if (typeof activeElements === 'undefined' || activeElements.length == 0) {
                    return;
                }

                var requestedElem = chart_object.getDatasetMeta(dataset_index).data[point_index];
                for (var i = 0; i < activeElements.length; i++) {
                    if (requestedElem._index == activeElements[i]._index) {
                        activeElements.splice(i, 1);
                        break;
                    }
                }
                chart_object.tooltip._active = activeElements;
                chart_object.tooltip.update(true);
                chart_object.draw();
            }
        },

        // Utility functions
        log: function (string) {
            // Console printing for debugging purposes
            if (this.options.debug) {
                console.log(string);
            }
        },
        stripHTML: function(element) {
            return $("<div/>").html(element).text();
        },
        svgElement: function(type, size, fill_color, tooltip, use_vertical_offset, vertical_offset){
            var html = '<svg ';
            var hover_increase = 2;
            if(use_vertical_offset){
                html += 'height="'+(size*2+hover_increase*2)+'" ';
            }else{
                html += 'height="'+(size+hover_increase*2)+'" ';
            }

            html += 'width="'+(size+hover_increase*2)+'" style="padding:0px;" ';

            if(tooltip) {
                html += 'data-toggle="tooltip" data-placement="bottom" title="' + tooltip + '" ';
            }

            html += '>';
            html += '<';
            if(type=='circle'){
                html += 'circle ';
                html += 'cx="' + (size/2 + hover_increase) + '" ';
                if(use_vertical_offset) {
                    html += 'cy="' + (size/2 + hover_increase + vertical_offset) + '" ';
                }else{
                    html += 'cy="' + (size/2 + hover_increase) + '" ';
                }
                html += 'r="'+(size/2)+'" ';
                html += 'onmouseover="evt.target.setAttribute(\'r\', \'' + (size/2 + hover_increase) + '\');" onmouseout="evt.target.setAttribute(\'r\', \'' + (size/2) + '\');" ';

            }else if(type=='rect'){
                html += 'rect rx="'+(size/6)+'" ry="'+(size/6)+'" ';
                html += 'x="' + ( hover_increase) + '" ';
                if(use_vertical_offset) {
                    html += 'y="' + (hover_increase+vertical_offset) + '" ';
                    html += 'onmouseover="evt.target.setAttribute(\'x\', \''+(hover_increase/2)+'\');evt.target.setAttribute(\'y\', \''+(hover_increase/2+vertical_offset)+'\');evt.target.setAttribute(\'width\', \'' + (size + hover_increase) + '\');evt.target.setAttribute(\'height\', \'' + (size + hover_increase) + '\');" ';
                    html += 'onmouseout="evt.target.setAttribute(\'x\', \''+hover_increase+'\');evt.target.setAttribute(\'y\', \''+(hover_increase+vertical_offset)+'\');evt.target.setAttribute(\'width\', \'' + size + '\');evt.target.setAttribute(\'height\', \'' + size + '\');" ';
                }else{
                    html += 'y="' + (hover_increase) + '" ';
                    html += 'onmouseover="evt.target.setAttribute(\'x\', \''+hover_increase/2+'\');evt.target.setAttribute(\'y\', \''+hover_increase/2+'\');evt.target.setAttribute(\'width\', \'' + (size + hover_increase) + '\');evt.target.setAttribute(\'height\', \'' + (size + hover_increase) + '\');" ';
                    html += 'onmouseout="evt.target.setAttribute(\'x\', \''+hover_increase+'\');evt.target.setAttribute(\'y\', \''+hover_increase+'\');evt.target.setAttribute(\'width\', \'' + size + '\');evt.target.setAttribute(\'height\', \'' + size + '\');" ';
                }
                html += 'width="'+(size)+'" ';
                html += 'height="'+(size)+'" ';

            }

            html += 'stroke="black" stroke-width="0" fill="'+fill_color+'" ';
            if(type=='circle') {

            }
            html += '/>';
            html += '</svg>';

            return html;
        },
        htmlDecode: function(input){
            if(input){
                var e = document.createElement('div');
                e.innerHTML = input;
                return e.childNodes[0].nodeValue;

            }else{
                return input;

            }
        },
        parseDataList: function(list_string){
            var data = new Array();
            if(list_string && ( typeof list_string === 'string' || list_string instanceof String )){
                var items = list_string.split(',');
                if(items.length > 0) {
                    for (var i = 0; i < items.length; i++) {
                        var fields = this.htmlDecode(items[i]);
                        if(fields){
                            fields = fields.split(';');
                        }else{
                            fields = [];
                        }

                        var data_item = {
                            'x_value': null,
                            'y_value': null,
                            'label': null,
                            'color': null
                        };

                        if(fields.length >= 1){
                            var field_data = fields[0].trim();
                            if(field_data.charAt(0) == '#' || field_data.startsWith('rgb(') || field_data.startsWith('rgba(') ) {
                                data_item['color'] = field_data;
                            }else {
                                var pattern = new RegExp(/[(](.+)[:](.+)[)]/g);
                                var res = pattern.test(field_data);

                                if(res){
                                    var value_fields = field_data.substring(1,field_data.length-1).split(':');

                                    var numeric_value = parseFloat(value_fields[0]);

                                    if(isNaN(numeric_value)){
                                        data_item['x_value'] = value_fields[0];

                                    }else{
                                        data_item['x_value'] = numeric_value;

                                    }

                                    var numeric_value = parseFloat(value_fields[1]);

                                    if(isNaN(numeric_value)){
                                        data_item['y_value'] = value_fields[1];

                                    }else{
                                        data_item['y_value'] = numeric_value;

                                    }

                                }else{
                                    // Single value given
                                    var numeric_value = parseFloat(field_data);

                                    if(isNaN(numeric_value)){
                                        data_item['y_value'] = field_data;

                                    }else{
                                        data_item['y_value'] = numeric_value;

                                    }
                                }
                            }
                        }

                        if(fields.length >= 2){
                            var field_data = fields[1].trim();
                            if(field_data.charAt(0) == '#' || field_data.startsWith('rgb(') || field_data.startsWith('rgba(') ){
                                data_item['color'] = field_data;
                            }else{
                                // Text label given
                                data_item['label'] = field_data;
                            }
                        }

                        if(fields.length >= 3){
                            var field_data = fields[2].trim();
                            if(!data_item['color'] && ( field_data.charAt(0) == '#' || field_data.startsWith('rgb(') || field_data.startsWith('rgba(') )) {
                                data_item['color'] = field_data;
                            }else if(!data_item['label']){
                                // Text label given
                                data_item['label'] = field_data;
                            }
                        }

                        data.push(data_item);
                    }
                }
            }
            return data;
        },
        parseSegmentList: function(list_string){
            var data = new Array();
            if(list_string){
                var items = list_string.split(',');
                if(items.length > 0) {
                    for (var i = 0; i < items.length; i++) {
                        var fields = this.htmlDecode(items[i]).split(';');

                        var data_item = {
                            'start_value': null,
                            'stop_value': null,
                            'label': null,
                            'color': null
                        };
                        if(fields.length >= 1){
                            var field_data = fields[0].trim();
                            var date_value = new Date(field_data).getTime() > 0;
                            if(date_value){
                                data_item['start_value'] = field_data;
                            }else {
                                var numeric_value = parseFloat(field_data);
                                if (isNaN(numeric_value)) {
                                    data_item['start_value'] = field_data;
                                } else {
                                    data_item['start_value'] = numeric_value;
                                }
                            }
                        }
                        if(fields.length >= 2){
                            var field_data = fields[1].trim();
                            var date_value = new Date(field_data).getTime() > 0;
                            if(date_value){
                                data_item['stop_value'] = field_data;
                            }else {
                                var numeric_value = parseFloat(field_data);
                                if (isNaN(numeric_value)) {
                                    data_item['stop_value'] = field_data;
                                } else {
                                    data_item['stop_value'] = numeric_value;
                                }
                            }
                        }
                        if(fields.length >= 3){
                            var field_data = fields[2].trim();
                            if(field_data.charAt(0) == '#' || field_data.startsWith('rgb(') || field_data.startsWith('rgba(') ){
                                data_item['color'] = field_data;
                            }else{
                                // Text label given
                                data_item['label'] = field_data;
                            }
                        }
                        if(fields.length >= 4){
                            var field_data = fields[3].trim();
                            if(field_data.charAt(0) == '#' || field_data.startsWith('rgb(') || field_data.startsWith('rgba(') ){
                                data_item['color'] = field_data;
                            }else{
                                // Text label given
                                data_item['label'] = field_data;
                            }
                        }
                        data.push(data_item);
                    }
                }
            }
            return data;
        },
        parseNumericValue: function(value){
            var pattern_interval = new RegExp(/([+-]?([0-9]*[.])?[0-9]+)(\s+)[(]([+-]?([0-9]*[.])?[0-9]+)(\s+)[-](\s+)([+-]?([0-9]*[.])?[0-9]+)[)]/);

            var pattern_plusminus = new RegExp(/([+-]?([0-9]*[.])?[0-9]+)(\s+)?[±](\s+)?(([0-9]*[.])?[0-9]+)/);

            var matches;
            if ((matches = pattern_interval.exec(value)) !== null) {
                return {
                    value: this.convertValue(matches[1]),
                    value_min: this.convertValue(matches[4]),
                    value_max: this.convertValue(matches[8])
                }

            }else if ((matches = pattern_plusminus.exec(value)) !== null) {
                return {
                    value: this.convertValue(matches[1]),
                    value_min: this.convertValue(matches[1]) - this.convertValue(matches[5]),
                    value_max: this.convertValue(matches[1]) + this.convertValue(matches[5]),
                }
            }else{
                return {
                    value: this.convertValue(value),
                    value_min: null,
                    value_max: null
                }
            }
        },
        cleanFieldValue: function(value){
            return $("<div/>").html(value).text().trim().replace(/<(?:.|\n)*?>/gm, '').replace('_',' ');
        },
        valueSorter: function (a, b, direction){
            direction = typeof direction !== 'undefined' ? direction : 'asc';

            // Value sorter which makes sure empty cells are last always.
            a = this.convertValue(a, -Infinity);
            b = this.convertValue(b, -Infinity);
            if(direction == 'asc'){
                if(a < b){return -1;}
                if(a > b){return 1;}
                return 0;
            }else{
                if(a < b){return 1;}
                if(a > b){return -1;}
                return 0;
            }
        },
        convertValue: function(value, default_value){
            if (moment(value, this.options.time.valid_formats, true).isValid() && !$.isNumeric(value)){
                // We have date
                value = moment(value).unix();

            }else{
                if(value){
                    if(value.trim()){
                        var float_value = parseFloat(value.replace('%',''));
                        if(!isNaN(float_value)){
                            value = float_value;
                        }
                    }else{
                        value = default_value;
                    }
                }else{
                    value = default_value;
                }
            }
            return value;
        },
        injectValuePostfix: function(value, postfix){
            var pattern_interval = new RegExp(/([+-]?([0-9]*[.])?[0-9]+)(\s+)[(]([+-]?([0-9]*[.])?[0-9]+)(\s+)[-](\s+)([+-]?([0-9]*[.])?[0-9]+)[)]/);

            var pattern_plusminus = new RegExp(/([+-]?([0-9]*[.])?[0-9]+)(\s+)?[±](\s+)?(([0-9]*[.])?[0-9]+)/);

            var matches;
            if ((matches = pattern_interval.exec(value)) !== null) {
                return matches[1] + ' ' + postfix + ' (' + matches[4] + ' - ' + matches[8] +')';

            }else if ((matches = pattern_plusminus.exec(value)) !== null) {
                return matches[1] + ' ' + postfix + ' ±' + matches[5];

            }else{
                return value + ' ' + postfix;
            }
        },
        addNumberPrefix: function(value, min) {
            min = min || 1e3;

            if (value >= min) {
                var units = ["k", "M", "B", "T"];

                var order = Math.floor(Math.log(value) / Math.log(1000));

                return Math.floor(value / Math.pow(1000, order)) + units[(order - 1)];
            }

            // return formatted original number
            return value.toLocaleString();
        },

        // Color utilities
        colorCode: function(color_code, opacity) {
            if(typeof opacity === 'undefined') {
                opacity = 1.0;
            }
            if(color_code.charAt(0) === '#'){
                return this.hexToRGB(color_code, opacity).css;
            }else if(color_code.startsWith('rgb(') || color_code.startsWith('rgba(') ) {
                return this.hexToRGB(this.RGBToHex(color_code), opacity).css;
            }
        },
        hexToRGB: function (hex, opacity) {
            hex = (hex + '').trim();

            var rgb = null;
            var match = hex.match(/^#?(([0-9a-zA-Z]{3}){1,3})$/);

            if(!match) {
                this.log('Unknown color code HEX[' + hex + ']');
                return null;
            }

            rgb = {};
            hex = match[1];

            if (hex.length == 6) {
                rgb.r = parseInt(hex.substring(0, 2), 16);
                rgb.g = parseInt(hex.substring(2, 4), 16);
                rgb.b = parseInt(hex.substring(4, 6), 16);

            } else if (hex.length == 3) {
                rgb.r = parseInt(hex.substring(0, 1) + hex.substring(0, 1), 16);
                rgb.g = parseInt(hex.substring(1, 2) + hex.substring(1, 2), 16);
                rgb.b = parseInt(hex.substring(2, 3) + hex.substring(2, 3), 16);
            }

            rgb.css = 'rgb' + (opacity ? 'a' : '') + '(';
            rgb.css += rgb.r + ',' + rgb.g + ',' + rgb.b;
            rgb.css += (opacity ? ',' + opacity : '') + ')';

            return rgb;
        },
        RGBToHex: function (rgb){
            rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
            return (rgb && rgb.length === 4) ? "#" +
                ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
                ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
                ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
        },
    };

    // Public functions
    function getRank(index){
        if(typeof $(this).data(pluginName) !== 'undefined'){
            return $(this).data(pluginName).getRank(index);
        }else{
            return '';
        }
    }

    function updateChart(){
        $(this).data(pluginName).updateChart();
    }

    $.fn[pluginName] = function (options) {
        var element = $(this);
        var name = pluginName;

        if (options === undefined || typeof options === 'object') {
            // create plugin
            return this.map(function () {
                var $t = $(this);
                var object = $t.data(name);

                if (undefined == object) {
                    // Stores the new `Plugin` object in the calling element's jQuery `data` method
                    var plugin = new Plugin(element, $.extend(true, {}, defaults, options), name);
                    $t.data(name, plugin);
                    //plugin.refreshTable();
                }
            });
        } else if (typeof options === 'string') {
            // Execute string command on plugin
            //var property = arguments[1];
            var args = Array.prototype.slice.call(arguments);
            args.splice(0, 1);
            return commands[arguments[0]].apply(element, args);
        }
    }

}(jQuery, window, document));

// ========================================
// Helper functions for bootstrap-table.js
// ========================================
function valueFormatter_generic_fixed(value, row, index, precision, muted, prefix, postfix){
    if(typeof prefix === 'undefined') {
        prefix = ''
    }
    if(typeof postfix === 'undefined') {
        postfix = ''
    }

    if($.isNumeric(value)){
        value = parseFloat(value);
        if(typeof precision !== 'undefined') {
            value = value.toFixed(precision);
        }
        return prefix + value + postfix;

    }else{
        return value;
    }
}

function percentageFormatter(value, row, index){
    return valueFormatter_generic_fixed(value, row, index, undefined, false, undefined, ' %');
}

function valueFormatter_int(value, row, index){
    return valueFormatter_generic_fixed(value, row, index, 0);
}

function valueFormatter_float1(value, row, index){
    return valueFormatter_generic_fixed(value, row, index, 1);
}
function valueFormatter_float2(value, row, index){
    return valueFormatter_generic_fixed(value, row, index, 2);
}
function valueFormatter_float3(value, row, index){
    return valueFormatter_generic_fixed(value, row, index, 3);
}
function valueFormatter_float4(value, row, index){
    return valueFormatter_generic_fixed(value, row, index, 4);
}

function valueFormatter_generic_exponential(value, row, index, precision, muted, prefix, postfix){
    if(typeof prefix === 'undefined') {
        prefix = ''
    }
    if(typeof postfix === 'undefined') {
        postfix = ''
    }

    if($.isNumeric(value)){
        value = parseFloat(value);
        if(typeof precision !== 'undefined') {
            value = value.toExponential(precision);
        }
        return prefix + value + postfix;

    }else{
        return value;
    }
}

function valueFormatter_float1_exp(value, row, index) {
    return valueFormatter_generic_exponential(value, row, index, 1);
}
function valueFormatter_float2_exp(value, row, index) {
    return valueFormatter_generic_exponential(value, row, index, 2);
}
function valueFormatter_float3_exp(value, row, index) {
    return valueFormatter_generic_exponential(value, row, index, 3);
}
function valueFormatter_float4_exp(value, row, index) {
    return valueFormatter_generic_exponential(value, row, index, 4);
}

// percentage values
function valueFormatter_int_percentage(value, row, index){
    return valueFormatter_generic_fixed(value, row, index, 0, false, undefined, ' %');
}
function valueFormatter_float1_percentage(value, row, index){
    return valueFormatter_generic_fixed(value, row, index, 1, false, undefined, ' %');
}
function valueFormatter_float2_percentage(value, row, index){
    return valueFormatter_generic_fixed(value, row, index, 2, false, undefined, ' %');
}
function valueFormatter_float3_percentage(value, row, index){
    return valueFormatter_generic_fixed(value, row, index, 3, false, undefined, ' %');
}
function valueFormatter_float4_percentage(value, row, index){
    return valueFormatter_generic_fixed(value, row, index, 4, false, undefined, ' %');
}

// error values
function valueFormatter_int_error(value, row, index){
    return valueFormatter_generic_fixed(value, row, index, 0, false, '±');
}
function valueFormatter_float1_error(value, row, index){
    return valueFormatter_generic_fixed(value, row, index, 1, false, '±');
}
function valueFormatter_float2_error(value, row, index){
    return valueFormatter_generic_fixed(value, row, index, 2, false, '±');
}
function valueFormatter_float3_error(value, row, index){
    return valueFormatter_generic_fixed(value, row, index, 3, false, '±');
}
function valueFormatter_float4_error(value, row, index){
    return valueFormatter_generic_fixed(value, row, index, 4, false, '±');
}

function valueFormatter_numeric_with_interval(value, row, index, precision, muted){
    // Cell formatter for percentage values
    if(isNumericWithInterval(value)){
        // We have data in format [value] ([interval1] - [interval2])
        var item = parseNumericErrorInterval(value, precision);
        if(typeof muted !== 'undefined' && muted) {
            return item.value + ' <small class="text-muted">(' + item.value_min + ' - ' + item.value_max + ')</small>';
        }else{
            return item.value + ' (' + item.value_min + ' - ' + item.value_max + ')';
        }

    }else if($.isNumeric(value)){
        return parseFloat(value).toFixed(precision);

    }else{
        return value;
    }
}
function valueFormatter_int_with_interval(value, row, index){
    return valueFormatter_numeric_with_interval(value, row, index, 0, false);
}
function valueFormatter_int_with_interval_muted(value, row, index){
    return valueFormatter_numeric_with_interval(value, row, index, 0, true);
}
function valueFormatter_float1_with_interval(value, row, index){
    return valueFormatter_numeric_with_interval(value, row, index, 1, false);
}
function valueFormatter_float1_with_interval_muted(value, row, index){
    return valueFormatter_numeric_with_interval(value, row, index, 1, true);
}
function valueFormatter_float2_with_interval(value, row, index){
    return valueFormatter_numeric_with_interval(value, row, index, 2, false);
}
function valueFormatter_float2_with_interval_muted(value, row, index){
    return valueFormatter_numeric_with_interval(value, row, index, 2, true);
}
function valueFormatter_float3_with_interval(value, row, index){
    return valueFormatter_numeric_with_interval(value, row, index, 3, false);
}
function valueFormatter_float3_with_interval_muted(value, row, index){
    return valueFormatter_numeric_with_interval(value, row, index, 3, true);
}
function valueFormatter_float4_with_interval(value, row, index){
    return valueFormatter_numeric_with_interval(value, row, index, 4, false);
}
function valueFormatter_float4_with_interval_muted(value, row, index){
    return valueFormatter_numeric_with_interval(value, row, index, 4, true);
}

// Value with plusminus interval
function valueFormatter_plusminus(value, row, index, precision, muted){
    // Cell formatter for percentage values
    if(isNumericWithError(value)) {
        var item = parseNumericErrorPlusminus(value, precision);
        if(typeof muted !== 'undefined' && muted){
            return item.value + ' <small class="text-muted">±' + item.value_plusminus + '</small>';
        }else{
            return item.value + ' ±' + item.value_plusminus;
        }

    }else if($.isNumeric(value)){
        return parseFloat(value).toFixed(precision);

    }else{
        return value;
    }
}
function valueFormatter_int_plusminus(value, row, index){
    return valueFormatter_plusminus(value, row, index, 0, false);
}
function valueFormatter_int_plusminus_muted(value, row, index){
    return valueFormatter_plusminus(value, row, index, 0, true);
}
function valueFormatter_float1_plusminus(value, row, index){
    return valueFormatter_plusminus(value, row, index, 1, false);
}
function valueFormatter_float1_plusminus_muted(value, row, index){
    return valueFormatter_plusminus(value, row, index, 1, true);
}
function valueFormatter_float2_plusminus(value, row, index){
    return valueFormatter_plusminus(value, row, index, 2, false);
}
function valueFormatter_float2_plusminus_muted(value, row, index){
    return valueFormatter_plusminus(value, row, index, 2, true);
}
function valueFormatter_float3_plusminus(value, row, index){
    return valueFormatter_plusminus(value, row, index, 3, false);
}
function valueFormatter_float3_plusminus_muted(value, row, index){
    return valueFormatter_plusminus(value, row, index, 3, true);
}
function valueFormatter_float4_plusminus(value, row, index){
    return valueFormatter_plusminus(value, row, index, 4, false);
}
function valueFormatter_float4_plusminus_muted(value, row, index){
    return valueFormatter_plusminus(value, row, index, 4, true);
}


// Value with interval and unit percentage
function valueFormatter_percentage_with_interval(value, row, index, precision, muted){
    // Cell formatter for percentage values
    if(isNumericWithInterval(value)){
        // We have data in format [value] ([interval1] - [interval2])
        var item = parseNumericErrorInterval(value, precision);
        if(typeof muted !== 'undefined' && muted) {
            return item.value + ' % <small class="text-muted">(' + item.value_min + ' - ' + item.value_max + ')</small>';
        }else{
            return item.value + ' % (' + item.value_min + ' - ' + item.value_max + ')';
        }

    }else if($.isNumeric(value)){
        return parseFloat(value).toFixed(precision) + ' %';

    }else{
        return value;
    }
}


function valueFormatter_int_percentage_with_interval(value, row, index){
    return valueFormatter_percentage_with_interval(value, row, index, 0, false);
}
function valueFormatter_int_percentage_with_interval_muted(value, row, index){
    return valueFormatter_percentage_with_interval(value, row, index, 0, true);
}
function valueFormatter_float1_percentage_with_interval(value, row, index){
    return valueFormatter_percentage_with_interval(value, row, index, 1, false);
}
function valueFormatter_float1_percentage_with_interval_muted(value, row, index){
    return valueFormatter_percentage_with_interval(value, row, index, 1, true);
}
function valueFormatter_float2_percentage_with_interval(value, row, index){
    return valueFormatter_percentage_with_interval(value, row, index, 2, false);
}
function valueFormatter_float2_percentage_with_interval_muted(value, row, index){
    return valueFormatter_percentage_with_interval(value, row, index, 2, true);
}
function valueFormatter_float3_percentage_with_interval(value, row, index){
    return valueFormatter_percentage_with_interval(value, row, index, 3, false);
}
function valueFormatter_float3_percentage_with_interval_muted(value, row, index){
    return valueFormatter_percentage_with_interval(value, row, index, 3, true);
}
function valueFormatter_float4_percentage_with_interval(value, row, index){
    return valueFormatter_percentage_with_interval(value, row, index, 4, false);
}
function valueFormatter_float4_percentage_with_interval_muted(value, row, index){
    return valueFormatter_percentage_with_interval(value, row, index, 4, true);
}

// Value with plusminus interval and unit percentage
function valueFormatter_percentage_plusminus(value, row, index, precision, muted){
    // Cell formatter for percentage values
    if(isNumericWithError(value)) {
        var item = parseNumericErrorPlusminus(value, precision);
        if(typeof muted !== 'undefined' && muted){
            return item.value + ' % <small class="text-muted">±' + item.value_plusminus + '</small>';
        }else{
            return item.value + ' % ±' + item.value_plusminus;
        }

    }else if($.isNumeric(value)){
        return parseFloat(value).toFixed(precision) + ' %';

    }else{
        return value;
    }
}
function valueFormatter_int_percentage_plusminus(value, row, index){
    return valueFormatter_percentage_plusminus(value, row, index, 0, false);
}
function valueFormatter_int_percentage_plusminus_muted(value, row, index){
    return valueFormatter_percentage_plusminus(value, row, index, 0, true);
}
function valueFormatter_float1_percentage_plusminus(value, row, index){
    return valueFormatter_percentage_plusminus(value, row, index, 1, false);
}
function valueFormatter_float1_percentage_plusminus_muted(value, row, index){
    return valueFormatter_percentage_plusminus(value, row, index, 1, true);
}
function valueFormatter_float2_percentage_plusminus(value, row, index){
    return valueFormatter_percentage_plusminus(value, row, index, 2, false);
}
function valueFormatter_float2_percentage_plusminus_muted(value, row, index){
    return valueFormatter_percentage_plusminus(value, row, index, 2, true);
}
function valueFormatter_float3_percentage_plusminus(value, row, index){
    return valueFormatter_percentage_plusminus(value, row, index, 3, false);
}
function valueFormatter_float3_percentage_plusminus_muted(value, row, index){
    return valueFormatter_percentage_plusminus(value, row, index, 3, true);
}
function valueFormatter_float4_percentage_plusminus(value, row, index){
    return valueFormatter_percentage_plusminus(value, row, index, 4, false);
}
function valueFormatter_float4_percentage_plusminus_muted(value, row, index){
    return valueFormatter_percentage_plusminus(value, row, index, 4, true);
}


function valueFormatter_list(value, row, index){
    var items = value.split(',');
    if(items.length > 0){
        return items.join('<br>');
    }else{
        return value;
    }
}

function valueFormatter_inline_bar_vertical(value, row, index){
    var items = value.split(',');
    var html = '';
    if(items.length > 0) {
        html += '<canvas class="datatable-inline-bar-vertical" data-value="'+value+'"></canvas>';
    }
    return html;
}
function valueFormatter_inline_bar_vertical_tristate(value, row, index){
    var items = value.split(',');
    var html = '';
    if(items.length > 0) {
        html += '<canvas class="datatable-inline-bar-vertical-tristate" data-value="'+value+'"></canvas>';
    }
    return html;
}

function valueFormatter_inline_line(value, row, index){
    var items = value.split(',');
    var html = '';
    if(items.length > 0) {
        html += '<canvas class="datatable-inline-line" data-value="'+value+'"></canvas>';
    }
    return html;
}
function valueFormatter_inline_line_steps(value, row, index){
    var items = value.split(',');
    var html = '';
    if(items.length > 0) {
        html += '<canvas class="datatable-inline-line-steps" data-value="'+value+'"></canvas>';
    }
    return html;
}

function valueFormatter_inline_pie(value, row, index){
    var items = value.split(',');
    var html = '';
    if(items.length > 0) {
        html += '<canvas class="datatable-inline-pie" data-value="'+value+'"></canvas>';
    }
    return html;
}

function runningFormatter(value, row, index){
    // Cell formatter for normal ranking
    return (index+1);
}

function isNumericWithInterval(value) {
    // Check if value has format [value] ([interval1] - [interval2])
    var regex = /[+-]?\d+(?:\.\d+)\s+\([+-]?\d+(?:\.\d+)\s+-\s+[+-]?\d+(?:\.\d+)\)/g;
    var pattern = new RegExp(regex);
    return pattern.test(value);
}
function isNumericWithError(value) {
    var pattern_plusminus = new RegExp(/([+-]?([0-9]*[.])?[0-9]+)(\s+)?[±](\s+)?(([0-9]*[.])?[0-9]+)/);
    return pattern_plusminus.test(value);
}
function numericToFloat(value, precision){
    if (typeof value === 'string' || value instanceof String){
        value = value.replace('%','');
    }
    var float_value = parseFloat(value);
    if(!isNaN(float_value)){
        // we have float
        if(typeof precision !== 'undefined'){
            return float_value.toFixed(precision);
        }else {
            return float_value;
        }
    }

    return value;
}

// Value parsers
function parseNumericErrorInterval(value, precision){
    var pattern_interval = new RegExp(/([+-]?([0-9]*[.])?[0-9]+)(\s+)[(]([+-]?([0-9]*[.])?[0-9]+)(\s+)[-](\s+)([+-]?([0-9]*[.])?[0-9]+)[)]/);

    var matches;
    if ((matches = pattern_interval.exec(value)) !== null) {
        return {
            value: numericToFloat(matches[1], precision),
            value_min: numericToFloat(matches[4], precision),
            value_max: numericToFloat(matches[8], precision)
        }

    }else{
        return {
            value: numericToFloat(value, precision),
            value_min: null,
            value_max: null
        }
    }
}
function parseNumericErrorPlusminus(value, precision){
    var pattern_plusminus = new RegExp(/([+-]?([0-9]*[.])?[0-9]+)(\s+)?[±](\s+)?(([0-9]*[.])?[0-9]+)/);

    var matches;
    if ((matches = pattern_plusminus.exec(value)) !== null) {
        return {
            value: numericToFloat(matches[1], precision),
            value_plusminus: numericToFloat(matches[5], precision),
            value_min: numericToFloat(numericToFloat(matches[1]) - numericToFloat(matches[5]), precision),
            value_max: numericToFloat(numericToFloat(matches[1]) + numericToFloat(matches[5]), precision)
        }
    }else{
        return {
            value: numericToFloat(value, precision),
            value_plusminus: null,
            value_min: null,
            value_max: null
        }
    }
}