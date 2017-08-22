$(document).ready(function() {
     
    $('#fullpage').fullpage({
        verticalCentered: false,
        autoScrolling:false
    });

    function viewModel() {
        var runningData = null;
        var model = {
            licenseNumber: ko.observable(""),
            state: ko.observable(""),
            getLicenseClick: getLicenseClick.bind(model)
        };
    
        return model;
    }

    var serverBusy = function() {
        alert("Server too busy. Please try after some time.");
        $("#overlay").hide();
    }

    function getLicenseClick(e, h) {
        var queryString = "license=" + vm.licenseNumber();
        if (vm.state().replace(/\s/g, "") != "") {
            queryString += "&state=" + vm.state().replace(/\s/g, "");
        }
        window.location.href= window.location.origin+ "/details.html?" + queryString;
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
