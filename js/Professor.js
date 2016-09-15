$(document).ready(function ()
{
    AuthenticationCheck();
    DisplayName();
    LoadGradingList();
});

function AuthenticationCheck()
{
    if (getCookie('LoginStatus') != "1" || getCookie('Role') != '2') window.location.href = "../Login.html";
}

function DisplayName()
{
    var DisplayName = getCookie('PreferredName');
    if (DisplayName == null || DisplayName == '') DisplayName = getCookie('Name');
    $('#signedIn').html('signed in as ' + DisplayName);
}

function LoadGradingList()
{
    var settings =
        {
            url: '../ASPXCGI/ProfessorGrading.aspx?Type=LoadCourseList&ID=' + getCookie("ID"),
            contentType: 'multipart/form-data',
            type: 'GET',
            processData: false,
            async: true,
            success: function (data)
            {
                var courses = eval('(' + data + ')');
                for (var i = 0; i < courses.length; i++)
                {
                    var CourseTitle = courses[i].CourseTitle,
                        CourseCode = courses[i].CourseCode,
                        CourseID = courses[i].CourseID;

                    //<li><a href="ProfessorSchedule.html">Schedule</a></li>
                }
            }
        };
}