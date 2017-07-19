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
    /*$('.editable').inputEditable({
        toggleAtRight: true,
    });*/
    var states = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.whitespace,
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        // `states` is an array of state names defined in "The Basics"
        local: ["saad fd", "deddss ds", "ds"]
    });

    $('#bloodhound .typeahead').typeahead({
        hint: true,
        highlight: true,
        minLength: 1
    }, {
        name: 'states',
        source: states
    });
     $('#bloodhound1 .typeahead').typeahead({
        hint: true,
        highlight: true,
        minLength: 1
    }, {
        name: 'states',
        source: states
    });

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
            isNamePresent: ko.observable(false),
            isEmailPresent: ko.observable(false),
            isCellPresent: ko.observable(true),
            isMlsPresent: ko.observable(false),
            isOfficeNamePresent: ko.observable(true),
            isOfficeLicensePresent: ko.observable(false),
            isOfficeZipPresent: ko.observable(false),
            isBrokerPresent: ko.observable(false),
            isBrokerEmailPresent: ko.observable(false),
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
