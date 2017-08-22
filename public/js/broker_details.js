$(document).ready(function() {
    // bind 'myForm' and provide a simple callback function
    $('#myForm').ajaxForm(function() {
        alert("Thank you for your comment!");
    });

    $('#myModal1,#myModal').on('hidden.bs.modal', function () {
        $(this).find("input").val('').end();
    });

    $.uploadPreview({
        input_field: "#image-upload", // Default: .image-upload
        preview_box: "#image-preview", // Default: .image-preview
        label_field: "#image-label", // Default: .image-label
        label_default: "Choose File", // Default: Choose File
        label_selected: "Change File", // Default: Change File
        no_label: false // Default: false
    });

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
    const state = {"state": getParameterByName("state")||""};


    $.ajax({
        url: "/license/" + license,
        data: state,
        method: "GET",
        success: function(res) {
            mapValues(res);
        }
    });

    function mapValues(obj) {
        for (var prop in obj) {
            var prop1 = prop.replace(/\s/g, "");
            if (vm[prop1]) {
                vm[prop1](obj[prop]);
            }
            if (vm[prop1 + "Present"]) {
                vm[prop1 + "Present"](!obj[prop] == "");
            }
        }
    }

    var states = new Bloodhound({
        datumTokenizer: function(datum) {
            return Bloodhound.tokenizers.whitespace(datum.association_name);
        },
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
            wildcard: '%QUERY',
            url: '/mls?query=%QUERY'
        }
    });

    $('#bloodhound .typeahead').typeahead({
        hint: true,
        highlight: true,
        minLength: 1
    }, {
        displayKey: 'association_name',
        source: states
    });

    var offices = new Bloodhound({
        datumTokenizer: function(datum) {
            return Bloodhound.tokenizers.whitespace(datum.empl_name);
        },
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
            wildcard: '%QUERY',
            url: '/officeName?query=%QUERY'
        }
    });
    $('#bloodhound1 .typeahead').typeahead({
        hint: true,
        highlight: true,
        minLength: 1
    }, {
        display: 'empl_name',
        source: offices
    });


    function viewModel() {
        var brokerage = {
            empl_name: ko.observable(""),
            emp_lic_number: ko.observable(""),
            brokerEmail: ko.observable(""),
            Zip: ko.observable(""),
            OfficeName: ko.observable("")
        }

        var model = {
            licenseNumber: ko.observable(getParameterByName("license")),
            FirstName: ko.observable(""),
            LastName: ko.observable(""),
            PriEmail: ko.observable(""),
            PriPhone: ko.observable(""),
            mls: ko.observable(""),
            OfficeName: ko.observable(""),
            emp_lic_number: ko.observable(""),
            Zip: ko.observable(""),
            empl_name: ko.observable(""),
            brokerEmail: ko.observable(""),
            FirstNamePresent: ko.observable(false),
            LastNamePresent: ko.observable(false),
            PriEmailPresent: ko.observable(false),
            PriPhonePresent: ko.observable(false),
            mlsPresent: ko.observable(false),
            OfficeNamePresent: ko.observable(false),
            emp_lic_numberPresent: ko.observable(false),
            ZipPresent: ko.observable(false),
            empl_namePresent: ko.observable(false),
            brokerEmailPresent: ko.observable(false),
            association_name:ko.observable(""),
            brokerage:brokerage,
            makeEditable: makeEditable,
            saveAssociation:saveAssociation,
            saveOfficeDetails:saveOfficeDetails,
            goBack:goBack
        };
        return model;
    }

    function goBack(){
        window.location = document.referrer;
    }
    function saveAssociation(m, e) {
        var data = {}
        data["association_name"] = m.association_name().replace(/\s/g, "");
        ajaxCall("/saveAssociation", "POST",
            function (res) {
                _hideModel("myModal");
                if (res.status == "ok") {
                    m.mls(m.association_name());
                    m.association_name("");
                }
            },
            serverBusy,
            data);
    }

    function saveOfficeDetails(m, e) {
        var data = {}
        data["emp_lic_number"] = m.brokerage.emp_lic_number().replace(/\s/g, "");
        data["empl_name"] = m.brokerage.empl_name().replace(/\s/g, "");
        ajaxCall("/saveOfficeDetails",
            "POST",
            function (res) {
                if (res.status == "ok") {
                    copyAddedOfficeDetails(m);
                    _hideModel("myModal1");
                }
            },
            serverBusy,
            data);
    }

    function copyAddedOfficeDetails(m) {
        for (var prop in m.brokerage) {
            m[prop](m.brokerage[prop]());
        }
    }

    function _hideModel(modalId) {
        $('#' + modalId).modal('toggle');
    }
    
    function makeEditable(m,e){
        m[e.target.parentElement.getAttribute("data-m")](false);
    }
    
    var serverBusy = function() {
        alert("Server too busy. Please try after some time.");
        $("#overlay").hide();
    }

    function ajaxCall(url, method, success, failure, data) {
        $.ajax({
            url: url,
            method: method,
            data: data,
            success: success,
            error: failure,
            timeout: 9000
        })
    }

    var vm = new viewModel();

    ko.applyBindings(vm, document.getElementById("root"));

})