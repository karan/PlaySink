$('a.signuplink').click(function(e) {
	$('#signupform').dialog('open');
	e.preventDefault();
	return false;
});

$('#signupform').dialog({
	autoOpen: false,
	modal: true,
	resizable: false,
	draggable: false
});