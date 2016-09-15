$(document).ready(function ()
{
    $('#loginFail').hide();
});

function InitPage()
{
    var Username = getCookie('Username');
    if (Username != null) document.getElementById('Username').value = Username;

    var LoginPass = getCookie('LoginPass');
    if (LoginPass != null)
    {
        document.getElementById('LoginPass').value = LoginPass;
        document.getElementById('RememberPass').checked = true;
    }

    if (getCookie('LoginStatus') == '-1') $('#loginFail').show();

    //if (getCookie('LoginStatus') == "-1") document.getElementById('alert').style.display = "block";
    //else document.getElementById('alert').style.display = "none";
}