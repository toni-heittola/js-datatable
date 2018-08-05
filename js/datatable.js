// ========================================
// datatable jQuery plug-in
// ========================================
//
// datatable.js
// Version: 0.2.6
//
// Copyright 2015-2017 Toni Heittola (toni.heittola@gmail.com)
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
    window.datatable_uniqId = 0;

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
            chart_modes: 'bar',
            chart_default_mode: 'bar',
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
                ]
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
                show_xaxis: true,
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
                    background: 'rgba(251, 85, 85, 0.8)'
                },
                tooltips: {
                    titleFontSize: 18,
                    bodyFontSize: 14,
                    position: 'average'
                }
            },
            line: {
                height: 240,
                xaxis: null,
                xaxis_field: null,
                xaxis_sorted: false,
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
                horizontal_line: {
                    enabled: false,
                    strokeStyle: 'rgba(112, 187, 225 ,1.0)',
                    lineWidth: 2
                },
                vertical_indicator_line: {
                    enabled: true,
                    strokeStyle: 'rgba(160,160,160,0.5)',
                    lineWidth: 4
                },
                horizontal_indicator_line: {
                    enabled: true,
                    strokeStyle: 'rgba(160,160,160,0.5)',
                    fillStyle: 'rgba(160,160,160,0.2)',
                    lineWidth: 4
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
                            normal: 'rgba(233,144,2, 0.5)',
                            hover: 'rgba(233,144,2, 1)'
                        },
                        bg: {
                            normal: 'rgba(233,144,2,0.2)',
                            hover: 'rgba(233,144,2,0.4)'
                        }
                    },
                    active: {
                        border: {
                            normal: 'rgba(160, 160, 160, 0.5)',
                            hover: 'rgba(160, 160, 160 1)'
                        },
                        bg: {
                            normal: 'rgba(160, 160, 160, 0.4)',
                            hover: 'rgba(160, 160, 160 0.8)'
                        }
                    },
                    success: {
                        border: {
                            normal: 'rgba(92, 184, 92, 0.5)',
                            hover: 'rgba(92, 184, 92, 1)'
                        },
                        bg: {
                            normal: 'rgba(92, 184, 92, 0.4)',
                            hover: 'rgba(92, 184, 92, 0.8)'
                        }
                    },
                    info: {
                        border: {
                            normal: 'rgba(112, 187, 225, 0.5)',
                            hover: 'rgba(112, 187, 225, 1)'
                        },
                        bg: {
                            normal: 'rgba(112, 187, 225, 0.4)',
                            hover: 'rgba(112, 187, 225, 0.8)'
                        }
                    },
                    warning: {
                        border: {
                            normal: 'rgba(240, 173, 78, 0.5)',
                            hover: 'rgba(240, 173, 78, 1)'
                        },
                        bg: {
                            normal: 'rgba(240, 173, 78, 0.4)',
                            hover: 'rgba(240, 173, 78, 0.8)'
                        }
                    },
                    danger: {
                        border: {
                            normal: 'rgba(217, 83, 79, 0.5)',
                            hover: 'rgba(217, 83, 79, 1)'
                        },
                        bg: {
                            normal: 'rgba(217, 83, 79, 0.4)',
                            hover: 'rgba(217, 83, 79, 0.8)'
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
                    titleFontSize: 18,
                    bodyFontSize: 14,
                    position: 'top'
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
                    strokeStyle: 'rgba(0,0,0,0.2)',
                    fillStyle: 'rgba(0,0,0,0.05)',
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
                chart_mode_selector: '#chart_selector',
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
            this.name = name;                                             // Name of the plugin
            this.element = element;                                       // The DOM element that called the plugin
            this.$element = $(element);                                   // The DOM element that called the plugin inside jQuery object

            $(element).addClass(this.name);                               // Add plugin name as class

            // Take unique id
            this.uniqueId = window.datatable_uniqId;
            window.datatable_uniqId += 1; // increase id counter

            var attributes = jQuery.extend(true, {}, this.defaults);

            // Override defaults from data-*
            // Table parameters
            if(typeof $(element).data('show-chart') !== 'undefined'){
                attributes.show_chart = $(element).data('show-chart');
            }
            if(typeof $(element).data('row-highlighting') !== 'undefined'){
                attributes.table.row_highlighting = $(element).data('row-highlighting');
            }
            if(typeof $(element).data('id-field') !== 'undefined'){
                attributes.table.id_field = $(element).data('id-field');
            }
            if(typeof $(element).data('column-hover') !== 'undefined'){
                attributes.table.column_hover = $(element).data('column-hover');
            }

            if(typeof $(element).data('chart-modes') !== 'undefined'){
                attributes.chart_modes = $(element).data('chart-modes');
            }
            if(typeof $(element).data('chart-default-mode') !== 'undefined'){
                attributes.chart_default_mode = $(element).data('chart-default-mode');
            }
            if(typeof $(element).data('rank-mode') !== 'undefined'){
                attributes.rank_mode = $(element).data('rank-mode');
            }
            if(typeof $(element).data('tag-mode') !== 'undefined'){
                attributes.tag_mode = $(element).data('tag-mode');
            }
            if(typeof $(element).data('chart-position') !== 'undefined'){
                attributes.chart.position = $(element).data('chart-position');
            }

            // Bar
            if(typeof $(element).data('bar-height') !== 'undefined'){
                attributes.bar.height = $(element).data('bar-height');
            }
            if(typeof $(element).data('bar-hline') !== 'undefined'){
                attributes.bar.horizontal_line.enabled = $(element).data('bar-hline');
            }
            if(typeof $(element).data('bar-show-xaxis') !== 'undefined'){
                attributes.bar.show_xaxis = $(element).data('bar-show-xaxis');
            }
            if(typeof $(element).data('bar-show-vertical-indicator') !== 'undefined'){
                attributes.bar.vertical_indicator_line.enabled = $(element).data('bar-show-vertical-indicator');
            }
            if(typeof $(element).data('bar-vertical-indicator-linewidth') !== 'undefined'){
                attributes.bar.vertical_indicator_line.lineWidth = $(element).data('bar-vertical-indicator-width');
            }
            if(typeof $(element).data('bar-vertical-indicator-stroke') !== 'undefined'){
                attributes.bar.vertical_indicator_line.strokeStyle = $(element).data('bar-vertical-indicator-stroke');
            }
            if(typeof $(element).data('bar-show-horizontal-indicator') !== 'undefined'){
                attributes.bar.horizontal_indicator_line.enabled = $(element).data('bar-show-horizontal-indicator');
            }
            if(typeof $(element).data('bar-horizontal-indicator-linewidth') !== 'undefined'){
                attributes.bar.horizontal_indicator_line.lineWidth = $(element).data('bar-horizontal-indicator-width');
            }
            if(typeof $(element).data('bar-horizontal-indicator-stroke') !== 'undefined'){
                attributes.bar.horizontal_indicator_line.strokeStyle = $(element).data('bar-horizontal-indicator-stroke');
            }
            if(typeof $(element).data('bar-horizontal-indicator-fill') !== 'undefined'){
                attributes.bar.horizontal_indicator_line.fillStyle = $(element).data('bar-horizontal-indicator-fill');
            }
            if(typeof $(element).data('bar-show-error-bar') !== 'undefined'){
                attributes.bar.error_bar.enabled = $(element).data('bar-show-error-bar');
            }
            if(typeof $(element).data('bar-error-bar-linewidth') !== 'undefined'){
                attributes.bar.error_bar.lineWidth = $(element).data('bar-error-bar-linewidth');
            }
            if(typeof $(element).data('bar-error-bar-tipwidth') !== 'undefined'){
                attributes.bar.error_bar.tipWidth = $(element).data('bar-error-bar-tipwidth');
            }
            if(typeof $(element).data('bar-error-bar-stroke') !== 'undefined'){
                attributes.bar.error_bar.strokeStyle = $(element).data('bar-error-bar-stroke');
            }
            if(typeof $(element).data('bar-tooltip-position') !== 'undefined'){
                attributes.bar.tooltips.position = $(element).data('bar-tooltip-position');
            }

            // Line
            if(typeof $(element).data('line-fields') !== 'undefined'){
                attributes.line.fields = $(element).data('line-fields').split(',');
            }
            if(typeof $(element).data('line-xaxis-field') !== 'undefined'){
                attributes.line.xaxis_field = $(element).data('line-xaxis-field');
            }
            if(typeof $(element).data('line-xaxis-sorted') !== 'undefined'){
                attributes.line.xaxis_sorted = $(element).data('line-xaxis-sorted');
            }
            if(typeof $(element).data('line-height') !== 'undefined'){
                attributes.line.height = $(element).data('line-height');
            }
            if(typeof $(element).data('line-show-point') !== 'undefined'){
                attributes.line.point.enabled = $(element).data('line-show-point');
            }
            if(typeof $(element).data('line-point-radius') !== 'undefined'){
                attributes.line.point.radius.normal = $(element).data('line-point-radius');
            }
            if(typeof $(element).data('line-point-radius-hover') !== 'undefined'){
                attributes.line.point.radius.hover = $(element).data('line-point-radius-hover');
            }
            if(typeof $(element).data('line-show-line') !== 'undefined'){
                attributes.line.line.enabled = $(element).data('line-show-line');
            }
            if(typeof $(element).data('line-show-vertical-indicator') !== 'undefined'){
                attributes.line.vertical_indicator_line.enabled = $(element).data('line-show-vertical-indicator');
            }
            if(typeof $(element).data('line-vertical-indicator-linewidth') !== 'undefined'){
                attributes.line.vertical_indicator_line.lineWidth = $(element).data('line-vertical-indicator-width');
            }
            if(typeof $(element).data('line-vertical-indicator-stroke') !== 'undefined'){
                attributes.line.vertical_indicator_line.strokeStyle = $(element).data('line-vertical-indicator-stroke');
            }
            if(typeof $(element).data('line-show-horizontal-indicator') !== 'undefined'){
                attributes.line.horizontal_indicator_line.enabled = $(element).data('line-show-horizontal-indicator');
            }
            if(typeof $(element).data('line-horizontal-indicator-linewidth') !== 'undefined'){
                attributes.line.horizontal_indicator_line.lineWidth = $(element).data('line-horizontal-indicator-width');
            }
            if(typeof $(element).data('line-horizontal-indicator-stroke') !== 'undefined'){
                attributes.line.horizontal_indicator_line.strokeStyle = $(element).data('line-horizontal-indicator-stroke');
            }
            if(typeof $(element).data('line-horizontal-indicator-fill') !== 'undefined'){
                attributes.line.horizontal_indicator_line.fillStyle = $(element).data('line-horizontal-indicator-fill');
            }
            if(typeof $(element).data('line-show-error-bar') !== 'undefined'){
                attributes.line.error_bar.enabled = $(element).data('line-show-error-bar');
            }
            if(typeof $(element).data('line-error-bar-linewidth') !== 'undefined'){
                attributes.line.error_bar.lineWidth = $(element).data('line-error-bar-linewidth');
            }
            if(typeof $(element).data('line-error-bar-tipwidth') !== 'undefined'){
                attributes.line.error_bar.tipWidth = $(element).data('line-error-bar-tipwidth');
            }
            if(typeof $(element).data('line-error-bar-stroke') !== 'undefined'){
                attributes.line.error_bar.strokeStyle = $(element).data('line-error-bar-stroke');
            }
            if(typeof $(element).data('line-show-interval') !== 'undefined'){
                attributes.line.interval.enabled = $(element).data('line-show-interval');
            }
            if(typeof $(element).data('line-interval-linewidth') !== 'undefined'){
                attributes.line.interval.lineWidth = $(element).data('line-interval-linewidth');
            }
            if(typeof $(element).data('line-hline') !== 'undefined'){
                attributes.line.horizontal_line.enabled = $(element).data('line-hline');
            }
            if(typeof $(element).data('line-tooltip-position') !== 'undefined'){
                attributes.line.tooltips.position = $(element).data('line-tooltip-position');
            }

            // Scatter
            if(typeof $(element).data('scatter-height') !== 'undefined'){
                attributes.scatter.height = $(element).data('scatter-height');
            }
            if(typeof $(element).data('scatter-x') !== 'undefined'){
                attributes.scatter.x = $(element).data('scatter-x');
            }
            if(typeof $(element).data('scatter-y') !== 'undefined'){
                attributes.scatter.y = $(element).data('scatter-y');
            }
            if(typeof $(element).data('scatter-point-radius') !== 'undefined'){
                attributes.scatter.point.normal = $(element).data('scatter-point-radius');
            }
            if(typeof $(element).data('scatter-point-radius-hover') !== 'undefined'){
                attributes.scatter.point.hover = $(element).data('scatter-point-radius-hover');
            }
            if(typeof $(element).data('scatter-show-vertical-indicator') !== 'undefined'){
                attributes.scatter.vertical_indicator_line.enabled = $(element).data('scatter-show-vertical-indicator');
            }
            if(typeof $(element).data('scatter-vertical-indicator-linewidth') !== 'undefined'){
                attributes.scatter.vertical_indicator_line.lineWidth = $(element).data('scatter-vertical-indicator-width');
            }
            if(typeof $(element).data('scatter-vertical-indicator-stroke') !== 'undefined'){
                attributes.scatter.vertical_indicator_line.strokeStyle = $(element).data('scatter-vertical-indicator-stroke');
            }
            if(typeof $(element).data('scatter-show-horizontal-indicator') !== 'undefined'){
                attributes.scatter.horizontal_indicator_line.enabled = $(element).data('scatter-show-horizontal-indicator');
            }
            if(typeof $(element).data('scatter-horizontal-indicator-linewidth') !== 'undefined'){
                attributes.scatter.horizontal_indicator_line.lineWidth = $(element).data('scatter-horizontal-indicator-width');
            }
            if(typeof $(element).data('scatter-horizontal-indicator-stroke') !== 'undefined'){
                attributes.scatter.horizontal_indicator_line.strokeStyle = $(element).data('scatter-horizontal-indicator-stroke');
            }
            if(typeof $(element).data('scatter-horizontal-indicator-fill') !== 'undefined'){
                attributes.scatter.horizontal_indicator_line.fillStyle = $(element).data('scatter-horizontal-indicator-fill');
            }
            if(typeof $(element).data('scatter-show-error-bar') !== 'undefined'){
                attributes.scatter.error_bar.enabled = $(element).data('line-show-error-bar');
            }
            if(typeof $(element).data('scatter-error-bar-linewidth') !== 'undefined'){
                attributes.scatter.error_bar.lineWidth = $(element).data('scatter-error-bar-linewidth');
            }
            if(typeof $(element).data('scatter-error-bar-tipwidth') !== 'undefined'){
                attributes.scatter.error_bar.tipWidth = $(element).data('scatter-error-bar-tipwidth');
            }
            if(typeof $(element).data('scatter-error-bar-stroke') !== 'undefined'){
                attributes.scatter.error_bar.strokeStyle = $(element).data('scatter-error-bar-stroke');
            }
            if(typeof $(element).data('scatter-show-error-box') !== 'undefined'){
                attributes.scatter.error_bar.bounding_box = $(element).data('line-show-error-box');
            }
            if(typeof $(element).data('scatter-error-box-fill') !== 'undefined'){
                attributes.scatter.error_bar.fillStyle = $(element).data('scatter-error-box-fill');
            }

            // Comparison
            if(typeof $(element).data('comparison-height') !== 'undefined'){
                attributes.comparison.height = $(element).data('comparison-height');
            }
            if(typeof $(element).data('comparison-row-id-field') !== 'undefined'){
                attributes.comparison.row_id_field = $(element).data('comparison-row-id-field');
            }
            if(typeof $(element).data('comparison-sets-json') !== 'undefined'){
                attributes.comparison.sets = $(element).data('comparison-sets-json');
            }
            if(typeof $(element).data('comparison-active-set') !== 'undefined'){
                attributes.comparison.active_set = $(element).data('comparison-active-set');
            }
            if(typeof $(element).data('comparison-a-row') !== 'undefined'){
                attributes.comparison.a_row = $(element).data('comparison-a-row');
            }
            if(typeof $(element).data('comparison-b-row') !== 'undefined'){
                attributes.comparison.b_row = $(element).data('comparison-b-row');
            }
            if(typeof $(element).data('comparison-show-error-bar') !== 'undefined'){
                attributes.comparison.error_bar.enabled = $(element).data('comparison-show-error-bar');
            }
            if(typeof $(element).data('comparison-error-bar-linewidth') !== 'undefined'){
                attributes.comparison.error_bar.lineWidth = $(element).data('comparison-error-bar-linewidth');
            }
            if(typeof $(element).data('comparison-error-bar-tipwidth') !== 'undefined'){
                attributes.comparison.error_bar.tipWidth = $(element).data('comparison-error-bar-tipwidth');
            }
            if(typeof $(element).data('comparison-error-bar-stroke') !== 'undefined'){
                attributes.comparison.error_bar.strokeStyle = $(element).data('comparison-error-bar-stroke');
            }

            // Combine parameters from defaults and given plugin options.
            this.options = $.extend(true, {}, attributes, options);   // Plugin options object

            // Add bootstrap-table.js defaults if not set
            if(typeof $(element).data('page-list') === 'undefined'){
                $(this.element).attr('data-page-list', this.options.table.page_list);
            }
            if(typeof $(element).data('pagination') === 'undefined'){
                $(this.element).attr('data-pagination', this.options.table.pagination);
            }
            if(typeof $(element).data('show-header') === 'undefined'){
                $(this.element).attr('data-show-header', this.options.table.show_header);
            }
            if(typeof $(element).data('show-column') === 'undefined'){
                $(this.element).attr('data-show-column', this.options.table.show_column);
            }
            if(typeof $(element).data('show-pagination-switch') === 'undefined'){
                $(this.element).attr('data-show-pagination-switch', this.options.table.show_pagination_switch);
            }
            if(typeof $(element).data('striped') === 'undefined'){
                $(this.element).attr('data-striped', this.options.table.striped);
            }

            // Post-process options
            this.options.chart_modes = this.options.chart_modes.split(',');
            if(this.options.chart_modes.length == 1 && this.options.chart_modes[0] != this.options.chart_default_mode && this.options.chart_default_mode != 'off'){
                this.options.chart_default_mode = this.options.chart_modes[0];
            }

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

            this.hline_value = [];
            this.hline_index = [];
            this.hline_color = [];

            this.field_meta = [];
            var self = this;

            this.log(this.name + '::init');

            // Make sure unique row id are assigned
            if(typeof $(this.element).data('id-field') !== 'undefined'){
                $(this.element).data('unique-id', $(this.element).data('id-field'));
            }

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
                window['valueSorter'+this.uniqueId] = function (a, b){
                    return self.valueSorter(a, b, 'asc');
                };
                $(this).attr('data-sorter', 'valueSorter'+this.uniqueId);
            });

            // Add default sorter for columns marked sortable
            $(this.element).find('thead tr th[data-reversed="true"]').each(function(){
                window['valueSorterReverse'+this.uniqueId] = function (a, b){
                    return self.valueSorter(a, b, 'desc');
                };
                $(this).attr('data-sorter', 'valueSorterReverse'+this.uniqueId);
            });

            // Add chartable icon for columns marked chartable
            $(this.element).find('thead tr th[data-chartable="true"]').each(function(){
                $(this).append(' '+self.options.icon.chartable);
            });

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
                        window['valueFormatter_url'+this.uniqueId] = function (value, row, index){
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
                        window['valueFormatter_ref'+this.uniqueId] = function (value, row, index){
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
                        $(this).attr('data-formatter','valueFormatter_ref'+this.uniqueId);
                        break;

                    case 'anchor':
                        window['valueFormatter_anchor'+this.uniqueId] = function valueFormatter_anchor(value, row, index){
                            if(value.trim()){
                                return '<a class="datatable-icon" href="javascript:void(0)" onclick="$(\'#collapse-'+value+'\').collapse(\'show\');window.location.hash=\''+value+'\';return false;">'+self.options.icon.anchor+'</a>'
                            }else{
                                return value;
                            }
                        };

                        $(this).attr('data-formatter', 'valueFormatter_anchor'+this.uniqueId);
                        break;

                    case 'inline-bar-horizontal-percentage':
                        window['valueFormatter_inline_bar_horizontal_percentage'+this.uniqueId] = function (value, row, index){
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
                                    if(value_sum > 100){
                                        percentage = percentage/value_sum * 100.0;
                                    }
                                    var current_color = self.options.inline_chart.bar_horizontal.colors[i % 4];
                                    if(data[i]['color']){
                                        var current_color = data[i]['color'];
                                    }

                                    html += '<div class="progress-bar" role="progressbar" data-percentage="100" aria-valuenow="'+percentage+'" aria-valuemin="0" aria-valuemax="100" style="width: '+percentage+'%;background-color:'+current_color+'" ';

                                    if(data[i]['label']){
                                        html += 'data-toggle="tooltip" data-placement="bottom" title="'+data[i]['label']+ ': <strong>'+data[i]['y_value']+'%</strong>" ';
                                    }else{
                                        html += 'data-toggle="tooltip" data-placement="bottom" title="<strong>'+data[i]['y_value']+'%</strong>" ';
                                    }
                                    html += '>';
                                    html += '</div>';
                                }
                                html += '</div>';
                            }
                            return html;
                        };
                        $(this).attr('data-formatter', 'valueFormatter_inline_bar_horizontal_percentage'+this.uniqueId);
                        break;

                    case 'inline-bar-horizontal-thin-percentage':
                        window['valueFormatter_inline_bar_horizontal_thin_percentage'+this.uniqueId] = function (value, row, index){
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
                                    if(value_sum > 100){
                                        percentage = percentage/value_sum * 100.0;
                                    }
                                    var current_color = self.options.inline_chart.bar_horizontal.colors[i % 4];
                                    if(data[i]['color']){
                                        var current_color = data[i]['color'];
                                    }

                                    html += '<div class="progress-bar" role="progressbar" data-percentage="100" aria-valuenow="'+percentage+'" aria-valuemin="0" aria-valuemax="100" style="width: '+percentage+'%;background-color:'+current_color+'" ';

                                    if(data[i]['label']){
                                        html += 'data-toggle="tooltip" data-placement="bottom" title="'+data[i]['label']+ ': <strong>'+data[i]['y_value']+'%</strong>" ';
                                    }else{
                                        html += 'data-toggle="tooltip" data-placement="bottom" title="<strong>'+data[i]['y_value']+'%</strong>" ';
                                    }
                                    html += '>';
                                    html += '</div>';
                                }
                                html += '</div>';
                            }
                            return html;
                        };
                        $(this).attr('data-formatter', 'valueFormatter_inline_bar_horizontal_thin_percentage'+this.uniqueId);
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
                        window['valueFormatter_inline_indicator_value_svg'+this.uniqueId] = function (value, row, index){
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

                        $(this).attr('data-formatter', 'valueFormatter_inline_indicator_value_svg'+this.uniqueId);
                        $(this).addClass('canvas-cell');
                        break;

                    case 'inline-indicator-value-html':
                        window['valueFormatter_inline_indicator_value_html'+this.uniqueId] = function (value, row, index){
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

                        $(this).attr('data-formatter', 'valueFormatter_inline_indicator_value_html'+this.uniqueId);
                        $(this).addClass('canvas-cell');
                        break;

                    case 'inline-indicator-binary':
                        window['valueFormatter_inline_indicator_binary_svg'+this.uniqueId] = function (value, row, index){
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

                        $(this).attr('data-formatter', 'valueFormatter_inline_indicator_binary_svg'+this.uniqueId);
                        $(this).addClass('canvas-cell');
                        break;

                    case 'inline-indicator-binary-html':
                        window['valueFormatter_inline_binary_html'+this.uniqueId] = function (value, row, index){
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

                        $(this).attr('data-formatter', 'valueFormatter_inline_binary_html'+this.uniqueId);
                        $(this).addClass('canvas-cell');
                        break;

                    case 'inline-indicator-tristate':
                        window['valueFormatter_inline_indicator_tristate_svg'+this.uniqueId] = function (value, row, index){
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

                        $(this).attr('data-formatter', 'valueFormatter_inline_indicator_tristate_svg'+this.uniqueId);
                        $(this).addClass('canvas-cell');
                        break;

                    case 'inline-indicator-tristate-html':
                        window['valueFormatter_inline_tristate_html'+this.uniqueId] = function (value, row, index){
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

                        $(this).attr('data-formatter', 'valueFormatter_inline_tristate_html'+this.uniqueId);
                        $(this).addClass('canvas-cell');
                        break;

                    default:
                        window['valueFormatter_hide'+this.uniqueId] = function (value, row, index){
                            return '<div class="text-muted" data-value="'+value+'">Invalid data-value-type</div>';
                        };
                        $(this).attr('data-formatter', 'valueFormatter_hide'+this.uniqueId);
                        break;
                }
            });

            // Extend bar plot to have horizontal line
            var originalLineDraw = Chart.controllers.bar.prototype.draw;
            Chart.helpers.extend(Chart.controllers.bar.prototype, {
                draw: function() {
                    originalLineDraw.apply(this, arguments);
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

            // Add extra chart types
            Chart.defaults.lineWithLine = Chart.helpers.clone(Chart.defaults.line);
            Chart.controllers.lineWithLine = Chart.controllers.line.extend({
                draw: function(ease) {
                    Chart.controllers.line.prototype.draw.call(this, ease);
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

            Chart.defaults.stripe = Chart.helpers.clone(Chart.defaults.line);
            Chart.controllers.stripe = Chart.controllers.line.extend({
                draw: function(ease) {
                    var result = Chart.controllers.line.prototype.draw.apply(this, arguments);
                    var chart = this.chart;
                    var scale = this.scale;
                    var ctx = chart.chart.ctx;

                    // Fixed horizontal lines
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

                    // Horizontal line following the mouse
                    if(chart.config.options.hasOwnProperty('horizontal_indicator_line') && chart.config.options.horizontal_indicator_line.enabled){
                        if (this.chart.tooltip._active && this.chart.tooltip._active.length) {
                            var yaxis = chart.scales['y-axis-0'];
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

                            if(chart.config.options.hasOwnProperty('error_bar') && chart.config.options.error_bar.enabled){
                                var fillStyle = 'rgba(0,0,0,0.1)';
                                if(chart.config.options.horizontal_indicator_line.hasOwnProperty('fillStyle')){
                                    fillStyle = chart.config.options.horizontal_indicator_line.fillStyle;
                                }
                                ctx.fillStyle = fillStyle;

                                ctx.beginPath();
                                ctx.fillRect(left,y_min,right-left,(y_max-y_min));
                                ctx.stroke();
                                /*
                                ctx.beginPath();
                                ctx.moveTo(left, y_min);
                                ctx.lineTo(right, y_min);
                                ctx.stroke();

                                ctx.beginPath();
                                ctx.moveTo(left, y_max);
                                ctx.lineTo(right, y_max);
                                ctx.stroke();
                                */
                            }

                            ctx.beginPath();
                            ctx.moveTo(left, y);
                            ctx.lineTo(right, y);
                            ctx.stroke();

                            ctx.restore();
                        }
                    }

                    // Don't render the stripes till we've finished animating
                    if (!this.rendered && ease !== 1) {
                        return;
                    }

                    this.rendered = true;

                    var helpers = Chart.helpers;
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

                    if(chart.config.options.hasOwnProperty('error_bar') && chart.config.options.error_bar.enabled) {
                        if (data_min && data_max) {
                            $.each( data, function( index, item ) {
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
                            });
                        }
                    }
                }
            });

            // Tooltip positioners
            Chart.Tooltip.positioners.line_centered_top = function(elements, eventPosition) {
                //var tooltip = this;
                return {
                    x: elements[0]._model.x,
                    y: 0
                };
            };
            Chart.Tooltip.positioners.line_centered_bottom = function(elements, eventPosition) {
                //var tooltip = this;
                return {
                    x: elements[0]._model.x,
                    y: self.options.line.height
                };
            };
            Chart.Tooltip.positioners.inline_centered_bottom = function(elements, eventPosition) {
                //var tooltip = this;
                return {
                    x: elements[0]._model.x,
                    y: self.options.inline_chart.height
                };
            };

            if(this.options.show_chart){
                // Create toolbar html and add it to the DOM
                var toolbar_html = '';

                toolbar_html += '<div id="datatable_toolbar'+this.uniqueId+'" class="datatable-toolbar">';
                toolbar_html += '<div class="btn-group" data-toggle="buttons" id="chart_mode_selector'+this.uniqueId+'">';

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

                if(this.options.chart.position == 'top'){
                    $(toolbar_html).appendTo($div);
                    $div.insertBefore(this.$element);

                }else if(this.options.chart.position == 'bottom'){
                    $div.insertAfter(this.$element);
                    $(toolbar_html).prependTo($div);
                }

                this.$element.attr('data-toolbar', '#datatable_toolbar'+this.uniqueId);
                this.options.element.chart_mode_selector = '#chart_mode_selector'+this.uniqueId;
            }

            // Event handlers
            $(element).on('post-init.datatable', function(e, data) {
                // Datatable is ready to initialize bootstrap table
                self.initBootstrapTable();
            });
            $(element).on('post-body.bs.table', function (e, data) {

                $(self.options.element.chart_mode_selector+' .active').each(function(){
                    self.chart_mode = $(this).data('mode');
                    self.updateVisualizationVisibility(self.chart_mode);
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
                        ]
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

                    /*
                    $(this).attr("width", data.length * (self.options.inline_chart.line_steps.item_width + 1));

                    var values = [];
                    var labels = [];
                    for (var i = 0; i < data.length; i++) {
                        var value = parseFloat(data[i]['y_value']);
                        values.push(value);
                        labels.push(i);
                    }

                    var inlineChart = new Chart(this, {
                        type: 'lineWithLine',
                        data: {
                            labels: labels,
                            datasets: [
                                $.extend(true, {}, self.options.inline_chart.line_steps.data, {data: values})
                            ],
                        },
                        options: self.options.inline_chart.line_steps.options
                    });
                    */
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
                        self.openChartTooltip(self.bar_chart, 0,  index);
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

            // Visualization selector buttons
            $(this.options.element.chart_mode_selector+' label').on('click', function(){
                self.chart_mode = $(this).data('mode');
                self.updateVisualizationVisibility(self.chart_mode);
            });

            this.updateFieldMeta();

            if(typeof $(element).data('json') !== 'undefined'){
                // Populate table from json data file
                var json_datafile = $(element).data('json');
                jQuery.ajax({
                    type: 'GET',
                    mimeType: "application/json; charset=utf-8",
                    url: json_datafile,
                    dataType: 'json',
                    async: true,
                    success: function(data){
                        var $thead = $(self.element).find('thead');
                        var $tbody = $('<tbody></tbody>');

                        $.each( data, function( key, val ) {
                            var $row = $('<tr></tr>');
                            if(val.hline){
                                $row.attr('data-hline',true);
                            }

                            if(self.options.table.row_highlighting){
                                if(val.row_css == 'active'){
                                    $row.addClass('active');
                                }else if(val.row_css == 'success'){
                                    $row.addClass('success');
                                }else if(val.row_css == 'info'){
                                    $row.addClass('info');
                                }else if(val.row_css == 'warning'){
                                    $row.addClass('warning');
                                }else if(val.row_css == 'danger'){
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
                    },
                    error: function(){
                        console.log('ERROR reading file:'+json_datafile);
                    }
                });

            }else if(typeof $(element).data('yaml') !== 'undefined'){
                // Populate table from yaml data file
                var yaml_datafile = $(element).data('yaml');

                jQuery.ajax({
                    type: 'GET',
                    dataType: 'text',
                    mimeType: "application/yaml; charset=utf-8",
                    url: yaml_datafile,
                    async: true,
                    success: function(text){
                        try {
                            var data = jsyaml.safeLoad(text);
                            var $thead = $(self.element).find('thead');
                            var $tbody = $('<tbody></tbody>');
                            $.each( data.data, function( key, val ) {
                                var $row = $('<tr></tr>');
                                if(val.hline){
                                    $row.attr('data-hline',true);
                                }
                                if(self.options.table.row_highlighting){
                                    if(val.row_css == 'active'){
                                        $row.addClass('active');
                                    }else if(val.row_css == 'success'){
                                        $row.addClass('success');
                                    }else if(val.row_css == 'info'){
                                        $row.addClass('info');
                                    }else if(val.row_css == 'warning'){
                                        $row.addClass('warning');
                                    }else if(val.row_css == 'danger'){
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
                $(self.element).trigger('post-init.datatable');
            }
        },
        updateFieldMeta: function(){
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

        updateVisualizationVisibility: function(mode){
            if(mode=='off'){
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

            }else if(mode=='bar'){

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

            }else if(mode=='line'){

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

            }else if(mode=='scatter'){

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

            }else if(mode=='comparison'){
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
        initBootstrapTable: function (){
            // Load bootstrap-table
            $(this.element).bootstrapTable();
            $(this.element).trigger('post-body.bs.table');
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
        validBar: function () {
            var table_options = $(this.element).bootstrapTable('getOptions');
            var sort_name = table_options.sortName;
            var header = $(this.element).find('thead tr th[data-field=\"'+sort_name+'\"]');
            var chartable = false;
            if(typeof header.data('chartable') !== 'undefined'){
                chartable = header.data('chartable');
            }
            var table_data = $(this.element).bootstrapTable('getData');
            if(table_data.length > 0 && chartable){
                return true;
            }else{
                return false;
            }
        },

        updateBar: function () {
            var self = this;
            if (this.bar_chart){
                this.bar_chart.destroy();
            }

            var chart_ctx = document.getElementById(this.options.element.bar.canvas.replace('#',''));
            chart_ctx.width = $(this.options.element.bar.div).innerWidth();
            chart_ctx.height = this.options.bar.height;
            var table_options = $(this.element).bootstrapTable('getOptions');
            var table_data = $(this.element).bootstrapTable('getData');
            var sort_name = table_options.sortName;
            var id_field = table_options.idField;

            var header = $(this.element).find('thead tr th[data-field=\"'+sort_name+'\"]');

            // Chartable field
            var chartable = false;
            if(typeof header.data('chartable') !== 'undefined'){
                chartable = header.data('chartable');
            }

            // value postfix
            var value_postfix = '';
            if(typeof header.data('postfix') !== 'undefined'){
                value_postfix = header.data('postfix');
            }

            // value label
            var value_label = header.text().trim();
            if(typeof header.data('axis-label') !== 'undefined'){
                value_label = $("<div/>").html(header.data('axis-label')).text().trim();
            }

            // value formatter
            var value_formatter = null;
            if(typeof header.data('formatter') !== 'undefined'){
                value_formatter = header.data('formatter');
            }

            var labels = [];
            var data = [];
            var data_uniqueid = [];
            var data_min = [];
            var data_max = [];
            var data_string = [];

            var all_value_min = Infinity;
            var all_value_max = -Infinity;

            var border_colors = [];
            var border_hover_colors = [];
            var bg_colors = [];
            var bg_hover_colors = [];

            var horizontal_line_value = [];
            var horizontal_line_color = [];

            for (var i = 0; i < table_data.length; i++) {
                // Go through the table data and collect values and colors for bar plot.
                //var label = this.stripHTML(table_data[i][this.options.table.id_field]).trim().replace(/<(?:.|\n)*?>/gm, '').replace('_',' ');
                var label = $("<div/>").html(table_data[i][this.options.table.id_field]).text().trim().replace(/<(?:.|\n)*?>/gm, '').replace('_',' ');

                // Make sure labels are unique, if overlapping labels add whitespaces at the end.
                if(labels.indexOf(label) > -1){
                    var num_of_occurances = 0;
                    for(var i=0; i<labels.length; i++){
                        if(labels[i] === label)
                           num_of_occurances++;
                    }
                    label = label + new Array(num_of_occurances + 1).join(' ');
                }
                labels.push(label);

                // Convert value to float
                var item = self.parseNumericValue(table_data[i][sort_name]);
                data.push(item.value);

                if(value_formatter){
                    data_string.push(this.stripHTML(window[value_formatter](table_data[i][sort_name])));
                }else{
                    data_string.push(this.injectValuePostfix(table_data[i][sort_name], value_postfix));
                }

                data_uniqueid.push(table_data[i][table_options.idField]);

                // Make sure lower and upper limits are valid
                var value_max = item.value_max;
                var value_min = item.value_min;
                if(value_min !== null && value_max !== null){
                    if(value_max < value_min) {
                        // Flip max and min
                        var value_tmp = value_min;
                        var value_min = value_max;
                        var value_max = value_tmp;
                    }

                    if(all_value_max < item.value){
                        all_value_max = item.value;
                    }
                    if(all_value_max < value_max){
                        all_value_max = value_max;
                    }

                    if(all_value_min > item.value){
                        all_value_min = item.value;
                    }
                    if(all_value_min > value_min){
                        all_value_min = value_min;
                    }
                }

                data_min.push(value_min);
                data_max.push(value_max);

                if (table_data[i].hasOwnProperty('_data') && table_data[i]['_data'].hasOwnProperty('hline') && typeof table_data[i]['_data']['hline'] !== 'undefined' && table_data[i]['_data']['hline']){
                    horizontal_line_value.push(item.value);

                    if (table_data[i].hasOwnProperty('_class') && typeof table_data[i]['_class'] !== 'undefined'){
                        horizontal_line_color.push(this.options.bar.colors[table_data[i]['_class']].bg.normal);

                    }else{
                        horizontal_line_color.push(this.options.bar.colors.default.bg.normal);
                    }
                }

                if (table_data[i].hasOwnProperty('_class') && typeof table_data[i]['_class'] !== 'undefined'){ // we have color defined
                    if( this.options.bar.colors.valid.indexOf(table_data[i]['_class']) > -1){
                        border_colors.push(this.options.bar.colors[table_data[i]['_class']].border.normal);
                        border_hover_colors.push(this.options.bar.colors[table_data[i]['_class']].border.hover);
                        bg_colors.push(this.options.bar.colors[table_data[i]['_class']].bg.normal);
                        bg_hover_colors.push(this.options.bar.colors[table_data[i]['_class']].bg.hover);

                    }else{
                        border_colors.push(this.options.bar.colors.default.border.normal);
                        border_hover_colors.push(this.options.bar.colors.default.border.hover);
                        bg_colors.push(this.options.bar.colors.default.bg.normal);
                        bg_hover_colors.push(this.options.bar.colors.default.bg.hover);
                    }

                }else{
                    border_colors.push(this.options.bar.colors.default.border.normal);
                    border_hover_colors.push(this.options.bar.colors.default.border.hover);
                    bg_colors.push(this.options.bar.colors.default.bg.normal);
                    bg_hover_colors.push(this.options.bar.colors.default.bg.hover);
                }

                if(item.value > value_max){
                    value_max = item.value;
                }
                if(item.value < value_max){
                    value_min = item.value;
                }
            }

            if(chartable && data.length > 0){
                $(this.options.element.bar.div).show(0);
                var begin_at_zero = $(this.element).find('thead tr th[data-field=\"'+sort_name+'\"]').data('beginatzero');

                var chart_data = {
                    labels: labels,
                    datasets: [
                        {
                            label: sort_name,

                            data: data,
                            data_min: data_min,
                            data_max: data_max,
                            data_string: data_string,
                            data_uniqueid: data_uniqueid,

                            horizontal_line_value: horizontal_line_value,
                            horizontal_line_color: horizontal_line_color,

                            backgroundColor: bg_colors,
                            borderColor: border_colors,
                            borderWidth: 2,
                            hoverBackgroundColor: bg_hover_colors,
                            hoverBorderColor: border_hover_colors
                        }
                    ]
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
                if(this.options.bar.tooltips.position == 'top'){
                    tooltip_position = 'line_centered_top';
                    padding = {
                        left: 0,
                        right: 0,
                        top: 45,
                        bottom: 0
                    };
                    caretSize = 0;
                    caretPadding = 0;

                }else if(this.options.bar.tooltips.position == 'bottom'){
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
                            display: this.options.bar.show_xaxis,
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
                                beginAtZero: begin_at_zero,
                                suggestedMax: all_value_max,
                                suggestedMin: all_value_min
                            },
                            scaleLabel: {
                                display: true,
                                labelString: value_label,
                                fontColor: 'black'
                            }
                        }]
                    },
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
                    horizontal_line: {
                        enabled: this.options.bar.horizontal_line.enabled
                    },
                    horizontal_indicator_line: {
                        enabled: this.options.bar.horizontal_indicator_line.enabled,
                        lineWidth: this.options.bar.horizontal_indicator_line.lineWidth,
                        strokeStyle: this.options.bar.horizontal_indicator_line.strokeStyle,
                        fillStyle: this.options.bar.horizontal_indicator_line.fillStyle
                    },
                    error_bar: {
                        enabled: this.options.bar.error_bar.enabled,
                        lineWidth: this.options.bar.error_bar.lineWidth,
                        tipWidth: this.options.bar.error_bar.tipWidth,
                        strokeStyle: this.options.bar.error_bar.strokeStyle
                    },
                    tooltips: {
                        enabled: true,
                        mode: 'label',
                        position: tooltip_position,

                        caretSize: caretSize,
                        caretPadding: caretPadding,

                        titleFontSize: this.options.bar.tooltips.titleFontSize,
                        bodyFontSize: this.options.bar.tooltips.bodyFontSize,
                        callbacks: {
                            title: function(tooltipItem, data){
                                return data.labels[tooltipItem[0].index];
                            },
                            label: function(tooltipItems, data){
                                var data_string = data.datasets[tooltipItems.datasetIndex].data_string[tooltipItems.index];
                                return value_label + ': ' + data_string;
                            }
                        }
                    },
                    chartArea: {
                        backgroundColor: this.options.bar.colors.background
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
        updateLine: function (){
            var self = this;

            // Destroy existing chart
            if (this.line_chart){
                this.line_chart.destroy();
            }

            var chart_ctx = document.getElementById(this.options.element.line.canvas.replace('#',''));
            chart_ctx.width = $(this.options.element.line.div).innerWidth();
            chart_ctx.height = this.options.line.height;

            // Get table options and data
            var table_options = $(this.element).bootstrapTable('getOptions');
            var table_data = $(this.element).bootstrapTable('getData');

            // Get xaxis_field
            var xaxis_field = table_options.idField;
            if(this.options.line.xaxis_field){
                xaxis_field = this.options.line.xaxis_field
            }

            if(this.options.line.xaxis_sorted){
                // Sort data
                table_data.sort(function(a, b){
                    a = self.convertValue(a[xaxis_field], -Infinity);
                    b = self.convertValue(b[xaxis_field], -Infinity);
                    if(a < b){return -1;}
                    if(a > b){return 1;}
                    return 0;
                });
            }

            // Get axis labels
            var labels = [];
            for (var i = 0; i < table_data.length; i++) {
                var label = $("<div/>").html(table_data[i][xaxis_field]).text().trim().replace(/<(?:.|\n)*?>/gm, '').replace('_',' ');
                // Make sure labels are unique, if overlapping labels add whitespaces at the end.
                if(labels.indexOf(label) > -1){
                    var num_of_occurances = 0;
                    for (var label_id=0; label_id<labels.length; label_id++){
                        if(labels[label_id] === label)
                            num_of_occurances++;
                    }
                    label = label + new Array(num_of_occurances + 1).join(' ');
                }
                labels.push(label);
            }

            // Create datasets
            var datasets = [];
            var dataset_id = 0;
            var all_value_max = -Infinity;
            var all_value_min = Infinity;
            $(this.element).find("thead tr th[data-field!=''][data-field]").each(function(index, header) {
                if(typeof $(this).data('chartable') !== 'undefined' && $(this).data('chartable')){
                    var dataset_name = self.cleanFieldValue($(this).html());
                    var field_name = $(this).data('field');

                    var valid_dataset = false;
                    if(self.options.line.fields){
                        if(self.options.line.fields.includes(field_name)){
                            valid_dataset = true;
                        }

                    }else{
                        valid_dataset = true;
                    }

                    // Include only valid datasets
                    if(valid_dataset){
                        // value formatter
                        var value_formatter = null;
                        if(typeof $(this).data('formatter') !== 'undefined'){
                            value_formatter = $(this).data('formatter');
                        }

                        var data = [];
                        var data_uniqueid = [];
                        var data_min = [];
                        var data_max = [];
                        var data_string = [];

                        var horizontal_line_value = [];

                        var point_border_colors = [];
                        var point_border_hover_colors = [];
                        var point_bg_colors = [];
                        var point_bg_hover_colors = [];
                        var point_radius = [];
                        var point_hover_radius = [];

                        for (var i = 0; i < table_data.length; i++) {
                            if(value_formatter){
                                data_string.push(self.stripHTML(window[value_formatter](table_data[i][field_name])));
                            }else{
                                data_string.push(self.injectValuePostfix(table_data[i][field_name], value_postfix));
                            }

                            data_uniqueid.push(table_data[i][table_options.idField]);

                            // Convert value to float
                            var item = self.parseNumericValue(table_data[i][field_name]);

                            data.push(item.value);

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

                            data_min.push(value_min);
                            data_max.push(value_max);

                            if (table_data[i].hasOwnProperty('_data') && table_data[i]['_data'].hasOwnProperty('hline') && typeof table_data[i]['_data']['hline'] !== 'undefined' && table_data[i]['_data']['hline']){
                                horizontal_line_value.push(item.value);
                            }

                            if (table_data[i].hasOwnProperty('_class') && typeof table_data[i]['_class'] !== 'undefined'){
                                if(self.options.line.colors.valid.indexOf(table_data[i]['_class']) > -1){
                                    point_border_colors.push(self.options.line.colors[table_data[i]['_class']].border.normal);
                                    point_border_hover_colors.push(self.options.line.colors[table_data[i]['_class']].border.hover);
                                    point_bg_colors.push(self.options.line.colors[table_data[i]['_class']].bg.normal);
                                    point_bg_hover_colors.push(self.options.line.colors[table_data[i]['_class']].border.hover);
                                }else{
                                    point_border_colors.push(self.options.line.colors.default.border.normal);
                                    point_border_hover_colors.push(self.options.line.colors.default.border.hover);
                                    point_bg_colors.push(self.options.line.colors.default.bg.normal);
                                    point_bg_hover_colors.push(self.options.line.colors.default.bg.hover);
                                }
                            }else{
                                point_border_colors.push(self.options.line.colors.default.border.normal);
                                point_border_hover_colors.push(self.options.line.colors.default.border.hover);
                                point_bg_colors.push(self.options.line.colors.default.bg.normal);
                                point_bg_hover_colors.push(self.options.line.colors.default.bg.hover);
                            }

                            point_radius.push(self.options.line.point.radius.normal);
                            point_hover_radius.push(self.options.line.point.radius.hover);
                        }

                        var value_postfix = '';
                        if(typeof $(this).data('postfix') !== 'undefined'){
                            value_postfix = $(this).data('postfix');
                        }

                        datasets.push({
                            label: dataset_name,

                            data: data,
                            data_uniqueid: data_uniqueid,
                            data_min: data_min,
                            data_max: data_max,
                            data_string: data_string,

                            horizontal_line_value: horizontal_line_value,

                            borderWidth: 2,
                            borderColor: self.options.line.colors.datasets[dataset_id],
                            backgroundColor: self.hexToRGB(self.options.line.colors.datasets[dataset_id], 0.20).css, //self.options.line.colors.datasets[dataset_id],
                            fill: false,
                            value_postfix: value_postfix,
                            lineTension: 0,
                            spanGaps: true,

                            pointBackgroundColor: point_bg_colors,
                            pointBorderWidth: point_border_colors,
                            pointHoverBackgroundColor: point_bg_hover_colors,
                            pointHoverBorderColor: point_border_hover_colors,
                            pointRadius: point_radius,
                            pointHoverRadius: point_hover_radius
                        });
                        dataset_id++;
                    }
                }
            });

            $(this.options.element.line.div).show(0);

            var chart_data = {
                labels: labels,
                datasets: datasets
                //hline_index: this.hline_index,
                //hline_value: this.hline_value,
                //hline_color: this.hline_color,
                //hline_enabled: this.options.line.horizontal_line.enabled
            };

            var show_legend = false;
            if(datasets.length > 1){
                show_legend = true;
            }

            var tooltip_position = 'average';
            var padding = {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            };
            if(this.options.line.tooltips.position == 'top'){
                tooltip_position = 'line_centered_top';
                padding = {
                    left: 0,
                    right: 0,
                    top: 45,
                    bottom: 0
                };
            }else if(this.options.line.tooltips.position == 'bottom'){
                tooltip_position = 'line_centered_bottom';
                padding = {
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 45
                };
            }

            var chart_options = {
                showLines: this.options.line.line.enabled,
                elements: {
                    line: {
                        tension: this.options.line.line.tension
                    }
                },
                layout: {
                    padding: padding
                },
                scales: {
                    xAxes: [{
                        //display: this.options.line.show_chart_xaxis,
                        stacked: false,
                        //type: 'time',
                        ticks: {
                            //autoSkip: false,
                            maxRotation: 90
                        },
                        distribution: 'linear'
                    }],
                    yAxes: [{
                        stacked: false,
                        type: 'linear',
                        ticks: {
                            beginAtZero: true,
                            suggestedMin: all_value_min,
                            suggestedMax: all_value_max
                        },
                        scaleLabel: {
                            display: true,
                            //labelString: value_label,
                            fontColor: 'black'
                        }
                    }]
                },
                maintainAspectRatio: true,
                responsive: true,
                /*animation: {
                    duration: 100
                },*/

                animation: {
                    duration: 0 // general animation time
                },
                hover: {
                    animationDuration: 0 // duration of animations when hovering an item
                },
                responsiveAnimationDuration: 0, // animation duration after a resize

                title:{
                    display: false
                },
                legend: {
                    display: show_legend,
                    position: 'right'
                },
                horizontal_line: {
                    enabled: this.options.line.horizontal_line.enabled,
                    lineWidth: this.options.line.horizontal_line.lineWidth,
                    strokeStyle: this.options.line.horizontal_line.strokeStyle
                },
                vertical_indicator_line: {
                    enabled: this.options.line.vertical_indicator_line.enabled,
                    lineWidth: this.options.line.vertical_indicator_line.lineWidth,
                    strokeStyle: this.options.line.vertical_indicator_line.strokeStyle
                },
                horizontal_indicator_line: {
                    enabled: this.options.line.horizontal_indicator_line.enabled,
                    lineWidth: this.options.line.horizontal_indicator_line.lineWidth,
                    fillStyle: this.options.line.horizontal_indicator_line.fillStyle,
                    strokeStyle: this.options.line.horizontal_indicator_line.strokeStyle
                },
                interval: {
                    enabled: this.options.line.interval.enabled,
                    lineWidth: this.options.line.interval.lineWidth
                },
                error_bar: {
                    enabled: this.options.line.error_bar.enabled,
                    lineWidth: this.options.line.error_bar.lineWidth,
                    strokeStyle: this.options.line.error_bar.strokeStyle,
                    tipWidth: this.options.line.error_bar.tipWidth
                },
                tooltips: {
                    enabled: true,
                    mode: 'label',
                    position: tooltip_position,
                    intersect: false,
                    caretSize: 0,
                    caretPadding: 0,

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

                            return data.datasets[tooltipItems.datasetIndex].label +': ' + data_string;
                        }
                    }
                },
                chartArea: {
                    backgroundColor: this.options.line.colors.background
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
                            //var row_index = value_index;
                            $(self.element).find('tbody td:contains('+table_options.data[value_index][table_options.idField]+')').parent('tr').find('td').addClass('row-hover')
                        }
                    }
                }
            };

            if((new Date(labels[0])).getTime() > 0){
                chart_options.scales.xAxes[0].type = 'time';
                chart_options.scales.xAxes[0].time = {
                    displayFormats: {
                        hour: 'hh:mm:ss'
                    },
                    unit: 'hour'
                };
            }

            this.line_chart = new Chart(chart_ctx, {
                type: 'stripe', //'lineWithLine',
                data: chart_data,
                options: chart_options
            });

            this.line_chart_data = chart_data;
        },
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

                            return [x_label + ': ' + data_string['x'],
                                    y_label + ': ' + data_string['y']
                                    ];
                        }
                    }
                },
                scales: {
                    xAxes: [{
                        position: 'bottom',
                        type: 'linear',
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
                        type: 'linear',
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
                type: 'stripe',
                data: chart_data,
                options: chart_options
            });
        },

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
            var self = this;
            if($(this.options.element.bar.div).is(":visible")){
                $(this.options.element.bar.div).hide(this.options.animation.hide_speed, function(){});
            }
        },

        showLineChart: function (){
            var self = this;
            if(this.validBar()){
                if($(this.options.element.line.div).is(":hidden")){
                    $(this.options.element.line.div).show(this.options.animation.show_speed, function(){
                        self.updateLine();
                    });
                }
            }
        },
        hideLineChart: function (){
            var self = this;
            if($(this.options.element.line.div).is(":visible")){
                $(this.options.element.line.div).hide(this.options.animation.hide_speed, function(){});
            }
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
            var self = this;
            if($(this.options.element.scatter.div).is(":visible")){
                $(this.options.element.scatter.div).hide(this.options.animation.hide_speed, function(){});
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
            var self = this;
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
                            })
                            $(this).find('td').eq(index).html(html);
                        })
                    }
                })
            }

        },
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
            if(list_string){
                var items = list_string.split(',');
                if(items.length > 0) {
                    for (var i = 0; i < items.length; i++) {
                        var fields = this.htmlDecode(items[i]).split(';');

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
                                var patt = new RegExp(/[(](.+)[:](.+)[)]/g);
                                var res = patt.test(field_data);
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
                                    // Singel value given
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
        cleanFieldValue: function(value){
            var label = $("<div/>").html(value).text().trim().replace(/<(?:.|\n)*?>/gm, '').replace('_',' ');
            return label;
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

        resetChartTooltip: function(chart_object, dataset_index){
            chart_object.tooltip._active = [];
            chart_object.tooltip.update(true);
            chart_object.draw();
            chart_object.updateHoverStyle(chart_object.getDatasetMeta(dataset_index).data, null, false);
            chart_object.render();
        },
        openChartTooltip: function(chart_object, dataset_index, point_index){
            if(typeof chart_object.tooltip._active === 'undefined'){
                chart_object.tooltip._active = [];
            }

            var activeElements = chart_object.tooltip._active;
            var requestedElem = chart_object.getDatasetMeta(dataset_index).data[point_index];
            for(var i = 0; i < activeElements.length; i++) {
                if(requestedElem._index == activeElements[i]._index)
                    return;
            }

            activeElements.push(requestedElem);
            chart_object.tooltip._active = activeElements;
            chart_object.tooltip.update(true);
            chart_object.draw();

            chart_object.updateHoverStyle([requestedElem], null, true);
            chart_object.render();
        },
        closeChartTooltip: function(chart_object, dataset_index, point_index){
            var activeElements = chart_object.tooltip._active;
            if(typeof activeElements === 'undefined' || activeElements.length == 0){
                return;
            }

            var requestedElem = chart_object.getDatasetMeta(dataset_index).data[point_index];
            for(var i = 0; i < activeElements.length; i++) {
                if(requestedElem._index == activeElements[i]._index)  {
                    activeElements.splice(i, 1);
                    break;
                }
            }
            chart_object.tooltip._active = activeElements;
            chart_object.tooltip.update(true);
            chart_object.draw();
        },

        hexToRGB: function (hex, opacity) {
            hex = (hex + '').trim();

            var rgb = null;
            var match = hex.match(/^#?(([0-9a-zA-Z]{3}){1,3})$/);

            if(!match) {
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
        }
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
function valueFormatter_generic(value, row, index, precision, muted, prefix, postfix){
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
    return valueFormatter_generic(value, row, index, undefined, false, undefined, ' %');
}

function valueFormatter_int(value, row, index){
    return valueFormatter_generic(value, row, index, 0);
}
function valueFormatter_float1(value, row, index){
    return valueFormatter_generic(value, row, index, 1);
}
function valueFormatter_float2(value, row, index){
    return valueFormatter_generic(value, row, index, 2);
}
function valueFormatter_float3(value, row, index){
    return valueFormatter_generic(value, row, index, 3);
}
function valueFormatter_float4(value, row, index){
    return valueFormatter_generic(value, row, index, 4);
}

// percentage values
function valueFormatter_int_percentage(value, row, index){
    return valueFormatter_generic(value, row, index, 0, false, undefined, ' %');
}
function valueFormatter_float1_percentage(value, row, index){
    return valueFormatter_generic(value, row, index, 1, false, undefined, ' %');
}
function valueFormatter_float2_percentage(value, row, index){
    return valueFormatter_generic(value, row, index, 2, false, undefined, ' %');
}
function valueFormatter_float3_percentage(value, row, index){
    return valueFormatter_generic(value, row, index, 3, false, undefined, ' %');
}
function valueFormatter_float4_percentage(value, row, index){
    return valueFormatter_generic(value, row, index, 4, false, undefined, ' %');
}

// error values
function valueFormatter_int_error(value, row, index){
    return valueFormatter_generic(value, row, index, 0, false, '±');
}
function valueFormatter_float1_error(value, row, index){
    return valueFormatter_generic(value, row, index, 1, false, '±');
}
function valueFormatter_float2_error(value, row, index){
    return valueFormatter_generic(value, row, index, 2, false, '±');
}
function valueFormatter_float3_error(value, row, index){
    return valueFormatter_generic(value, row, index, 3, false, '±');
}
function valueFormatter_float4_error(value, row, index){
    return valueFormatter_generic(value, row, index, 4, false, '±');
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
    var patt = new RegExp(regex);
    if (patt.test(value)) {
        return true;
    }else{
        return false;
    }
}
function isNumericWithError(value) {
    var pattern_plusminus = new RegExp(/([+-]?([0-9]*[.])?[0-9]+)(\s+)?[±](\s+)?(([0-9]*[.])?[0-9]+)/);
    if (pattern_plusminus.test(value)) {
        return true;
    }else{
        return false;
    }
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