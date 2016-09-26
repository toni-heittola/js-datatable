js-datatable - Dynamic table with data visualization
====================================================

js-datatable is an open source JQuery plugin to produce dynamic HTML tables with data visualization capabilities. The plugins was originally developed for the need of academic data visualization ([DCASE2016 evaluation campaign results](http://www.cs.tut.fi/sgn/arg/dcase2016/task-results-acoustic-scene-classification)), and to be used with [Pelican](https://github.com/getpelican/pelican) static page generation framework. For integration with Pelican, see [pelican-datatable]() project.

The plugin is designed to be used with [Bootstrap 3 framework](http://getbootstrap.com/). Dynamic table handling is implemented with [bootstrap-table.js](http://bootstrap-table.wenzhixin.net.cn/) and data visualizations with [chart.js](http://www.chartjs.org/).

To see plugin in action check [DCASE2016 challenge results page](http://www.cs.tut.fi/sgn/arg/dcase2016/task-results-acoustic-scene-classification).

Detailed instructions and demos see [docs](https://toni-heittola.github.io/js-datatable/).

**Author**

Toni Heittola (toni.heittola@gmail.com),
[GitHub](https://github.com/toni-heittola), [Home page](http://www.cs.tut.fi/~heittolt/)

Installation instructions
=========================

To use plugin, following javascripts and css files are required:

    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
    <script type="text/javascript" src="js.min/bootstrap-table.min.js"></script>
    <script type="text/javascript" src="js.min/Chart.bundle.min.js"></script>
    <script type="text/javascript" src="js.min/datatable.min.js"></script>
    <link rel="stylesheet" href="css.min/bootstrap-table.mim.css">
    <link rel="stylesheet" href="css.min/datatable.min.css">

You can use also non-minified versions in case debugging is required:

    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
    <script type="text/javascript" src="js/bootstrap-table.js"></script>
    <script type="text/javascript" src="js/Chart.bundle.js"></script>
    <script type="text/javascript" src="js/datatable.js"></script>
    <link rel="stylesheet" href="css/bootstrap-table.css">
    <link rel="stylesheet" href="css/datatable.css">

Plugin is initialized automatically for `<table>` elements having class `datatable` set on them. Most of the parametrization is done through data-fields either inside `<table>`-tag or in header `<th>`-tags.

Usage
=====

## Via data attributes

*This is the simplest way to use the plugin.*

Plugin is initialized automatically for `<table>` elements having class `datatable` set on them.. Parameters to the plugin are given with attributes to table element.

### Simple example table without visualizations

    <table class="table datatable"
       data-id-field="code"
       data-sort-name="value1"
       data-sort-order="desc"
       data-pagination="false"
       data-show-pagination-switch="false">
        <thead>
            <tr>
                <th data-field="code" data-sortable="true">Name</th>
                <th data-field="value1" data-sortable="true">Value 1</th>
                <th data-field="value2" data-sortable="true">Value 2</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>item 1</td>
                <td>40.4</td>
                <td>6.5344</td>
            </tr>
            <tr>
                <td>item 2</td>
                <td>60.2</td>
                <td>3.232</td>
            </tr>
            <tr>
                <td>item 3</td>
                <td>20.6</td>
                <td>9.32</td>
            </tr>
        </tbody>
    </table>

### Simple example table without visualizations, loading data from a data file  

#### JSON

*HTML*

    <table class="table datatable"
           data-json="data2.json"
           data-id-field="name"
           data-sort-name="value1"
           data-sort-order="desc"
           data-pagination="false"
           data-show-pagination-switch="false">
        <thead>
            <tr>
                <th data-field="code" data-sortable="true">Name</th>
                <th data-field="value1" data-sortable="true">Value 1</th>
                <th data-field="value2" data-sortable="true">Value 2</th>
            </tr>
        </thead>
    </table>

*JSON-datafile*

    [
        {
            "code": "Red",
            "value1": "12",
            "value2": "22",
            "value3": "5",
            "value4": "34",
            "feature1": "square",
            "feature2": "triangle",
            "row_css": "danger"
        },
        {
            "code": "Blue",
            "value1": "62",
            "value2": "42",
            "value3": "8",
            "value4": "64",
            "feature1": "circle",
            "feature2": "triangle",
            "row_css": "warning"
        }
    ]

#### YAML

*HTML*

    <table class="table datatable"
           data-yaml="data2.yaml"
           data-id-field="name"
           data-sort-name="value1"
           data-sort-order="desc"
           data-pagination="false"
           data-show-pagination-switch="false">
        <thead>
            <tr>
                <th data-field="code" data-sortable="true">Name</th>
                <th data-field="value1" data-sortable="true">Value 1</th>
                <th data-field="value2" data-sortable="true">Value 2</th>
            </tr>
        </thead>
    </table>

*YAML-datafile*

    data:
      - code: Red
        value1: 12
        value2: 22
        feature1: square
        feature2: triangle
        row_css: danger

      - code: Blue
        value1: 62
        value2: 42
        feature1: circle
        feature2: triangle
        row_css: warning

## Via JavaScript

*In case you need customization.*

In case an extensive customization is required, the datatable can be created with javascript.

*HTML*

    <table id="dynamic-table-1" class="table"
           data-id-field="code"
           data-sort-name="value1"
           data-sort-order="desc"
           data-chart="false"
           data-pagination="false"
           data-show-pagination-switch="false">
        <thead>
            <tr>
                <th data-field="code" data-sortable="true">Name</th>
                <th data-field="value1" data-sortable="true">Value 1</th>
                <th data-field="value2" data-sortable="true">Value 2</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>item 1</td>
                <td>40.4</td>
                <td>6.5344</td>
            </tr>
        </tbody>
    </table>

*Javascript*

    <script type="text/javascript">
            $( document ).ready(function() {
                $('#dynamic-table-1').datatable({});
            });
    </script>


## Parameters

### Table options

| Attribute              | Default              | Description                                                                   |
| ---------------------- |--------------------- | ----------------------------------------------------------------------------- |
| data-bar-hline         | false                | Show horizontal line, value got from data file. Use hline field to set.    |
| data-bar-height	     | 200	                | Height of a visualization canvas.                                             |
| data-chart	         | false	            | Controls chart visualization.                                                 |
| data-chart-default-mode | 'bar'               | Default visualization mode: bar, scatter, comparison                          |
| data-chart-modes       | 'bar'                | Comma separated list of visualization modes: bar, scatter, comparison         |
| data-comparison-a-row | undefined     | Preselected row A                                                             |
| data-comparison-b-row | undefined     | Preselected row B                                                             |
| data-comparison-active-set | undefined       | Preselected set.                                                              |
| data-comparison-height | 240                  | Height of a visualization canvas.                                             |
| data-comparison-row-id-field | undefined      | Id of a column used to populate selection dropdown.                           |
| data-comparison-sets-json | undefined         | Comparison sets in JSON format.                                               |
| data-id-field	            | undefined	        | Column name to be used to identify rows.                                      |
| data-json	                | undefined	        | JSON file to populate the table from.                                         |
| data-rank-mode            | 'normal'          | Dynamic ranking mode: normal, grouped_muted, grouped_empty                    |
| data-row-highlighting	    | false	            | Use row_css field in the data file to have row colors.                        |
| data-scatter-height	    | 240	            | Height of a visualization canvas.                                             |
| data-scatter-x	        | undefined	        | Id of a column used as default data source for a scatter plot.                |
| data-scatter-y	        | undefined	        | Id of a column used as default data source for a scatter plot.                |
| data-show-bar-chart-xaxis	| 'true'	        | Show x-axis in bar visualization.                                             |
| data-tag-mode             | 'global'          | Dynamic tagging, column values are grouped and groups are assigned a color: global, column |
| data-yaml 	            | undefined	        | YAML file to populate the table from.                                         |


#### Comparison sets json-format

    {
        "title": "title of a set",
        "data_axis_title": "custom value for axis",
        "fields": ["column_field1", "column_field1"],
        "field_titles": ["custom title 1","custom title 2"]
    }

`field_titles` is an optional field.

### Header options

| Attribute              | Default              | Description                                                                   |
| ---------------------- |--------------------- | ----------------------------------------------------------------------------- |
| data-tag	             | undefined	        | Groups values in the column and colors them.                                  |
| data-postfix	         | ''	                | String to be added at the end of all values. Use for units.                   |
| data-chartable	     | undefined	        | Can the column be select for visualization.                                   |
| data-beginatzero	     | undefined	        | 0 is included in when values from column are visualized.                      |
| data-value-type        | undefined	        | Value formatter: int, int-percentage, float1, float1-percentage, float2, float2-percentage, float3, float3-percentage, float4, float4-percentage, list, url, ref, anchor |

### Row options

| Attribute              | Default              | Description                                                                   |
| ---------------------- |--------------------- | ----------------------------------------------------------------------------- |
| data-hline          | undefined	        | Indicate row to be used draw horizontal line in bar chart.                    |

## Bootstrap parameters

Essential Bootstraptable specific parameters are collected here for completeness. For full reference, see Bootstraptable.js documentation.

### Table options

| Attribute              | Default              | Description                                                                   |
| ---------------------- |--------------------- | ----------------------------------------------------------------------------- |
| data-page-list	     | [10, 25, 50, 100]	| When set pagination property, initialize the page size selecting list. If you include the 'All' option, all the records will be shown in your table. |
| data-pagination	     | true	                | True to show a pagination toolbar on table bottom.                            |
| data-show-columns	     | false	            | True to show the columns drop down list.                                      |
| data-show-pagination-switch | true	        | True to show the pagination switch button.                                    |
| data-show-toggle	     | false	            | True to show the toggle button to toggle table / card view.                   |
| data-sort-name	     | undefined	        | Defines which column will be sorted.                                          |
| data-sort-order	     | 'asc'	            | Defines the column sort order, can only be 'asc' or 'desc'.                   |
| data-sort-order	     | 'asc'	            | Defines the column sort order, can only be 'asc' or 'desc'.                   |
| data-striped	         | true	                | True to stripe the rows.                                                      |

### Header options

| Attribute              | Default              | Description                                                                   |
| ---------------------- |--------------------- | ----------------------------------------------------------------------------- |
| data-visible	         | true	                | False to hide the columns item.                                               |
| data-sortable	         | false	            | True to allow the column can be sorted.                                       |
| data-formatter	     | undefined	        | The context (this) is the column Object. The cell formatter function, take three parameters: value: the field value. row: the row record data. index: the row index. |
| data-field	         | undefined	        | The column field name.                                                        |
