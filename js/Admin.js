$(document).ready(function ()
{
    if (getCookie('LoginStatus') != "1" || getCookie('Role') != '3') window.location.href = "../Login.html";
    var DisplayName = getCookie('PreferredName');
    if (DisplayName == null || DisplayName == '') DisplayName = getCookie('Name');
    $('#signedIn').html('signed in as ' + DisplayName);
});