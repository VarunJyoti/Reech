$(document).ready(function() {
    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
    const license = getParameterByName("license");

    $.ajax({
        url: "/license/" + license,
        method: "GET",
        success: function(res) {
            mapValues(res);
        }
    });

    function mapValues(obj) {
        for (var prop in obj) {
            vm[prop](obj[prop]);
            if(obj[prop] = ""){
                vm[prop+"Present"](false);
            }else{
                vm[prop+"Present"](true);
            }
        }
    }

    var states = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        sufficient: 3,
        remote: {
            url: '/mls',
        }
    });

    $('#bloodhound .typeahead').typeahead({
        hint: true,
        highlight: true,
        minLength: 1
    }, {
        name: 'states',
        displayKey: 'value',
        source: states
    });
    /* $('#bloodhound1 .typeahead').typeahead({
        hint: true,
        highlight: true,
        minLength: 1
    }, {
        name: 'states',
        source: states
    });*/

    function viewModel() {
        var runningData = null;
        var model = {
            licenseNumber: ko.observable(getParameterByName("")),
            name: ko.observable(""),
            email: ko.observable(""),
            cell: ko.observable("saa"),
            mls: ko.observable(""),
            officeName: ko.observable("sfdfd"),
            officeLicense: ko.observable(""),
            officeZip: ko.observable(""),
            broker: ko.observable(""),
            brokerEmail: ko.observable(""),
            namePresent: ko.observable(false),
            emailPresent: ko.observable(false),
            cellPresent: ko.observable(true),
            mlsPresent: ko.observable(false),
            officeNamePresent: ko.observable(true),
            officeLicensePresent: ko.observable(false),
            officeZipPresent: ko.observable(false),
            brokerPresent: ko.observable(false),
            brokerEmailPresent: ko.observable(false),
            makeEditable: makeEditable
        };

        return model;
    }

    function makeEditable(m,e){
        m[e.target.parentElement.getAttribute("data-m")](false);
    }
    var serverBusy = function() {
        alert("Server too busy. Please try after some time.");
        $("#overlay").hide();
    }

    function ajaxCall(url, success, failure) {
        $.ajax({
            url: url,
            success: success,
            error: failure,
            timeout: 9000
        })
    }

    var vm = new viewModel();

    ko.applyBindings(vm, document.getElementById("root"));

})
