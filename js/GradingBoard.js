$(document).ready(function ()
{
    $('.GradingItem').onclick(LoadingGradingList(this));
});

function LoadGradingList(obj)
{
    alert(obj);
    //var CourseID = $(obj).attr('CourseID');

    //var settings =
    //    {
    //        url: '../ASPXCGI/ProfessorGrading.aspx?Type=LoadGradingList&ID=' + getCookie("ID"),
    //        contentType: 'multipart/form-data',
    //        type: 'GET',
    //        processData: false,
    //        async: true,
    //        success: function (data)
    //        {
    //            var courses = eval('(' + data + ')');
    //            for (var i = 0; i < courses.length; i++)
    //            {
    //                var CourseTitle = courses[i].CourseTitle,
    //                    CourseCode = courses[i].CourseCode,
    //                    CourseID = courses[i].CourseID;

    //                //<li><a href="ProfessorSchedule.html">Schedule</a></li>
    //            }
    //        }
    //    };
}