$(document).ready()
{
    $.ajax({
        url: "../ASPXCGI/StudentGrade.aspx",
        contentType: "multipart/form-data",
        type: 'GET',
        processData: false,
        async: true,
        success: function (data)
        {
            var response = eval('(' + data + ')');

            if (response.Error)
            {
                alert(response.Error);
            }
            else
            {
                $('#GradeBar').css('width', response.Grade);
                $('#GradeBar').text(response.Grade);
            }
        }
    });
}