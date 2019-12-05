var oTable;
 
 
$(document).ready(function () {
    'use strict';
 
    function myCustomFilterFunction(filterVal, columnVal) {
        var found;
        if (columnVal === '') {
            return true;
        }
        switch (filterVal) {
        case 'happy':
            found = columnVal.search(/:-\]|:\)|Happy|JOY|:D/g);
            break;
        case 'sad':
            found = columnVal.search(/:\(|Sad|:'\(/g);
            break;
        case 'angry':
            found = columnVal.search(/!!!|Arr\.\.\./g);
            break;
        case 'lucky':
            found = columnVal.search(/777|Bingo/g);
            break;
        case 'january':
            found = columnVal.search(/01|Jan/g);
            break;
        default:
            found = 1;
            break;
        }
 
        if (found !== -1) {
            return true;
        }
        return false;
    }
                         
    oTable = $('#example').dataTable({
        "sScrollY": "300px",
        "iDisplayLength": 25,
        "bJQueryUI": true,
        "bStateSave": true
    }).yadcf([
        {
            column_number : 0, 
            filter_container_id: 'external_filter_container_0',
            filter_type: 'custom_func', 
            custom_func: myCustomFilterFunction, 
            data: [{ value: 'happy', label: 'Happy'}, { value: 'sad', label: 'Sad'}, { value: 'angry', label: 'Angry'}, { value: 'lucky', label: 'Lucky'}, { value: 'january', label: 'January'}], 
            filter_default_label: "Custom func filter"},
        {
            column_number : 1,
            filter_container_id: 'external_filter_container_1',
            filter_type: 'range_number_slider'
        },
        {
            column_number : 2,
            filter_container_id: 'external_filter_container_2',
            filter_type: 'range_date'
        },
        {
            column_number : 3,
            filter_container_id: 'external_filter_container_3',
            filter_type: "auto_complete", 
            text_data_delimiter: ","
        },
        {
            column_number : 4,
            filter_container_id: 'external_filter_container_4',
            column_data_type: "html", 
            html_data_type: "text", 
            filter_default_label: "Select tag"
        }],
        {   externally_triggered: true});
 
});