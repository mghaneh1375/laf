var dropBoxVisibility = false;
var toggleDropBox;
var logout;

jQuery(document).ready(function ($) {

	$.ajax({
		type: 'get',
		url: 'https://prod.directday.com/api/v2/cm/branches/336766bd-a671-11eb-adaf-54520098a755',
		headers: {
			"Content-Type": "application/json",
			"Accept": "application/json",
			"app-name": "WebSite"
		},
		success: function(res) {
			if(res.data.branch_permissions.WebSite.Booking === 'disable')
				$(".Booking-Menu-In-Nav").remove();
		}
	});

	$(".signInBtn").on("click", function() {
		window.localStorage.refer = window.location.href;
	});

    var user = window.localStorage.UserStorageKey;
    if(user != null && user !== "null" && user !== "undefined") {
        user = JSON.parse(user);
	$("#userInfoNav").removeClass("hidden");
	$(".needAuthMobile").removeClass("hidden");
	$("#menu-nav-dropdown").append('Hi ' + user.full_name);
	$(".menu_title").first().empty().append('Hi ' + user.full_name);
    }
    else {
	$("#signInBtn").removeClass("hidden");
	$(".notNeedAuthMobile").removeClass("hidden");
    }

	$('.signOutBtnMobile').first().on("click", function() {
		logout();
	});

 toggleDropBox = function() {

    if(dropBoxVisibility) {
        dropBoxVisibility = false;
        $(".dropdown-menu").addClass('hidden').removeClass('show');
    }
    else {
        dropBoxVisibility = true;
        $(".dropdown-menu").removeClass('hidden').addClass('show');
    }

}


logout = function() {
		window.localStorage.removeItem("UserStorageKey");
		window.localStorage.removeItem("TokenStorageKey");
    $("#signInBtn").removeClass('hidden');
    $("#userInfoNav").addClass('hidden');
    $(".notNeedAuthMobile").removeClass("hidden");
    $(".needAuthMobile").addClass("hidden");
    $("#menu-nav-dropdown").empty();
	location.reload();
}

});
