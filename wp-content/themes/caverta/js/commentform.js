(function($) {
    "use strict";
	
	var options_comm = { success: showResponseComment, beforeSubmit: showRequestComment}; 
    $('#commentform').on('submit', function() { 
        $(this).ajaxSubmit(options_comm); 
        return false; 
    });
	
	})(jQuery);

function showResponseComment(responseText, statusText)  { 
	if (statusText == 'success') {
		jQuery('#comment-form-holder').html('<h5 class="comm-send">' + commFobject.msg_sent  + '</h5>'); 
	} else {
		alert('status: ' + statusText + '\n\nSomething is wrong here');
	}
}

function showRequestComment(formData, jqForm, options_comm) { 
	var form = jqForm[0];
	var validRegExp = /^[^@]+@[^@]+.[a-z]{2,}$/i;
		
	if (!form.author.value) { 
		jQuery('#output-contact').html('<div class="output2">' + commFobject.name_error  + '</div>'); 
		return false; 
	} else if (!form.email.value) {
		jQuery('#output-contact').html('<div class="output2">' + commFobject.email_error  + '</div>'); 
		return false; 
	} else if (form.email.value.search(validRegExp) == -1) {
		jQuery('#output-contact').html('<div class="output2">' + commFobject.emailvalid_error  + '</div>'); 
		return false; 
	} else if (!form.comment.value) {
		jQuery('#output-contact').html('<div class="output2">' + commFobject.message_error  + '</div>'); 
		return false; 
	}
		
	 else {	   
	 jQuery('#output-contact').html(commFobject.send_msg);  		
		return true;
	}
}