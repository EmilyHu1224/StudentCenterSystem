$(document).ready(function ()
{
    var settings =
    {
        url: "../ASPXCGI/ProfessorSchedule.aspx?ID=" + getCookie("ID"),
        contentType: "multipart/form-data",
        type: 'GET',
        processData: false,
        async: true,
        success: function (data)
        {
            var courses = eval('(' + data + ')');

            if (courses.Error)
            {
                alert(courses.Error);
            }
            else
            {
                for (var i = 0; i < courses.length; i++)
                {
                    for (var j = 0; j < courses[i][4].length; j++)
                    {
                        var content = '<button type="button" class="btn btn-primary editBtn">' + courses[i][1] + ' (' + courses[i][0] + ')' + '</button><br/><br/>'

                        var id = "#" + courses[i][4][j];
                        $(id).append(content);
                    }
                }
            }
        }
    };
    $.ajax(settings);
});