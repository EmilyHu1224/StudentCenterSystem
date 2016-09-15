$(document).ready(function ()
{
    $('.editableElementI').hide();
    $('#saveBtn').hide();

    getProfile();

    $('#editBtn').click(function ()
    {
        $('.editableElementP').hide();
        $('.editableElementI').show();

        $(this).hide();
        $('#saveBtn').show();
    });
});

function getProfile()
{
    //refer http://www.tuicool.com/m/articles/IJrAna3
    //it is the normal/old method from jquery to pack the form data for sending to server,
    //it does not work at mode of multipart/form-data and can only include data of normal form controls except <input type="file">.
    //var formdata = $('#form1').serialize();

    //the new object-FormData is support by popular browser now, 
    //it works at mode of multipart/form-data and supports <input type="file">
    //var formdata = new FormData($('#profile')[0]);

    //refer http://www.w3school.com.cn/jquery/ajax_ajax.asp
    //an jquery function to post data to server underground;
    //it accept a set of parameter with an object: {}.
    var settings =
        {
            //the url of the handler to process or response the request
            //url: "bin/StudentCGI.exe?profile",
            url: "../ASPXCGI/Profile.aspx?Type=GetProfile",

            //the content type to be sent to the server, it should work with data parameter.
            contentType: "multipart/form-data",

            //HTTP method: GET or POST
            //type: 'POST',
            type: 'GET',

            //don't convert form-data as query string and append to url.
            processData: false,

            //block mode 
            async: true,

            //form data to be sent to the server
            //data: formdata,

            //a callback function called before connect the server 
            beforeRequest: function ()
            {
            },

            //a callback function called after get the response from the server successfully
            success: function (response_data)
            {
                process_ajax_response(response_data);
            },

            //a callback function called after this process complete successully or terminate with error.
            complete: function ()
            {
            }
        };

    $.ajax(settings);
}

function process_ajax_response(data)
{
    if (data)
    {
        //conver string to object.
        //var obj = eval("var tmpvar=" + data + "; tmpvar;");
        var obj = eval('(' + data + ')');

        if (obj.Error)
        {
            alert(obj.Error);
        }
        else
        {
            $('#Name').html(getCookie('Name'));
            $('#PreferredNameP').html(getCookie('PreferredName'));
            $('#EmailAddressP').html(obj.EmailAddress);
            $('#AboutMeP').html(htmlEscape(obj.AboutMe));//<p>

            $('#PreferredNameI').val(getCookie('PreferredName'));
            $('#EmailAddressI').val(obj.EmailAddress);
            $('#AboutMeI').html(obj.AboutMe);//<textarea>
        }
    }
}

//set uploaded image file into image, it is applicable for html5.
function upload_file_to_img(uploader)
{
    if (uploader.files.length > 0)
    {
        var img = document.getElementById('ProfilePicImage');
        var reader = new FileReader();
        reader.readAsDataURL(uploader.files[0]);

        //the onload event happen after the file has been loaded.
        reader.onload = function ()
        {
            //add file had been read into album.
            img.src = this.result;//it is the data read from the file.
            $(img).show();
        }
    }
}

function checkEmailAdd(c)
{
    var regex = /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g;
    return regex.test($('#EmailAddressI').val());
}

function validation()
{
    var ErrorMessage = "";
    if (checkEmailAdd() == false) ErrorMessage += "Invalid Email address. <br />";

    if (ErrorMessage != "")
    {
        alert(ErrorMessage);
        return false;
    }

    return true;
}