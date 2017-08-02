$(document).ready(function() {
    // bind 'myForm' and provide a simple callback function
    $('#myForm').ajaxForm(function() {
        alert("Thank you for your comment!");
    });

    $.uploadPreview({
        input_field: "#image-upload",   // Default: .image-upload
        preview_box: "#image-preview",  // Default: .image-preview
        label_field: "#image-label",    // Default: .image-label
        label_default: "Choose File",   // Default: Choose File
        label_selected: "Change File",  // Default: Change File
        no_label: false                 // Default: false
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

    $.ajax({
        url: "/license/" + license,
        method: "GET",
        success: function(res) {
            mapValues(res);
        }
    });

    function mapValues(obj) {
        for (var prop in obj) {
            var prop1 = prop.replace(/\s/g, "");
            if(vm[prop1]){
                vm[prop1](obj[prop]);
            }
            if (vm[prop1 + "Present"]) {
                vm[prop1 + "Present"](obj[prop] = "");
            }
        }
    }

    var states = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('association_name'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        prefetch: '/mls'
        
    });


    $('#bloodhound .typeahead').typeahead({
        hint: true,
        highlight: true,
        minLength: 1
    }, {
        displayKey: 'association_name',
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
            licenseNumber: ko.observable(getParameterByName("license")),
            FirstName: ko.observable(""),
            LastName: ko.observable(""),
            PriEmail: ko.observable(""),
            PriPhone: ko.observable(""),
            mls: ko.observable(""),
            OfficeName: ko.observable(""),
            OfficeLic: ko.observable(""),
            Zip: ko.observable(""),
            broker: ko.observable(""),
            brokerEmail: ko.observable(""),
            FirstNamePresent: ko.observable(false),
            LastNamePresent: ko.observable(false),
            PriEmailPresent: ko.observable(false),
            PriPhonePresent: ko.observable(false),
            mlsPresent: ko.observable(false),
            OfficeNamePresent: ko.observable(false),
            OfficeLicPresent: ko.observable(false),
            ZipPresent: ko.observable(false),
            brokerPresent: ko.observable(false),
            brokerEmailPresent: ko.observable(false),
            association_name:ko.observable(""),
            makeEditable: makeEditable,
            saveAssociation:saveAssociation,
            saveOfficeDetails:saveOfficeDetails
        };
        return model;
    }

    function saveAssociation(m, e) {
        var data = {}
        data["association_name"] = m.association_name().replace(/\s/g, "");
        ajaxCall("/saveAssociation", "POST",
            this._hideModel("myModal"),
            () = > {alert("failure");},
            data);
    }

    function saveOfficeDetails(m, e) {
        alert("in progress...");
        return;

        var data = {}
        data["association_name"] = m.association_name().replace(/\s/g, "");
        ajaxCall("/saveOfficeDetails", "POST",
            this._hideModel("myModal1"),
            () = > {alert("failure");},
        data);
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
