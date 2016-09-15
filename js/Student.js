$(document).ready(function ()
{
    if (getCookie('LoginStatus') != "1" || getCookie('Role') != '1') window.location.href = "../Login.html";
    var DisplayName = getCookie('PreferredName');
    if (DisplayName == null || DisplayName == '') DisplayName = getCookie('Name');
    $('#signedIn').html('signed in as ' + DisplayName);
});

var LastReadNews = 0;
var UnreadNewsCount = 0;

$(document).ready(function ()
{
    LastReadNewsID = getCookie('LastReadNewsID');
    UnreadNewsCount = getCookie('UnreadNewsCount');

    UnreadNewsCount = CountUnreadNews(LastReadNewsID);

    if (UnreadNewsCount == '0') $('#NewsCount').hide();
    else $('#NewsCount').text(UnreadNewsCount);
});

function CountUnreadNews(LastReadNewsID)
{
    var UnreadNewsCount = '0';

    if (LastReadNewsID == '0' || LastReadNewsID == null)
    {
        UnreadNewsCount = '0';
    }
    else
    {
        var settings =
            {
                //url: "bin/StudentCGI.exe?InitializeNewsCount=0&LastReadNewsID=" + LastReadNewsID,
                url: "../ASPXCGI/InitializeNewsCount.aspx?LastReadNewsID=" + LastReadNewsID,
                type: 'GET',
                processData: false,
                async: false,
                success: function (ResponseData)
                {
                    var obj = eval("var tempData = " + ResponseData + "; tempData;");
                    if (obj.Error) alert(obj.Error);
                    else UnreadNewsCount = obj.UnreadNewsCount;
                }
            };
        $.ajax(settings);
    }

    setCookie('UnreadNewsCount', UnreadNewsCount, 365);
    return UnreadNewsCount;
}