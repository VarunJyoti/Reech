$(document).ready(function() {
     
    $('#fullpage').fullpage({
        //slideSelector: '.fullslide',
        verticalCentered: false,
        //scrollOverflow: true,
        //scrollBar: false,
        autoScrolling:false
    });

    function viewModel() {
        var runningData = null;
        var model = {
            licenseNumber: ko.observable(),
            getLicenseClick: getLicenseClick.bind(model)
        };
    
        return model;
    }

    var serverBusy = function() {
        alert("Server too busy. Please try after some time.");
        $("#overlay").hide();
    }
    function getLicenseClick(e, h){
        window.location += "details.html?license="+vm.licenseNumber();
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
