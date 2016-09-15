//SPA
//SPA model - the page is never reloaded, but the data (both display and the database) is updated
//- maximize the use of global variables:
// * always keep a set of fresh and updated data
// * when any changes occur, always change the global variable first, and then render to HTML
// * when posting data to the server, always use data from the global variable instead of the HTML

//even in browser or client end, it is better to seperate the view (webpage display) and the data (processed by the js)
//thus, do not go the opposite way - such as collecting data from the webpage
//this is much easier for js to process the data
//it is also due to the different paces of updating:
//UI changes much more often than the script

//global variables:
var SelectableCourses;
var SelectedCourseIDs = [];

$(document).ready(function ()
{
    HideAllAlerts();
    GetSelectableCourses();
});

function GetSelectedCourses()
{
    var settings =
        {
            url: "../ASPXCGI/StudentCourse.aspx?Type=GetSelectedCourses&ID=" + getCookie("ID"),
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
                        for (var j = 0; j < courses[i][7].length; j++)
                        {
                            var content = '<table><tr><td style="border: none">' + courses[i][2]
                            + '</td><td style="border: none" rowspan="2">'
                            + '<button type="button" class="btn btn-warning editBtn" onclick="RemoveCourse(this)">-</button></td></tr>'
                            + '<tr><td style="border: none"><i>' + courses[i][4] + '</i></td></tr></table>';

                            var id = "#" + courses[i][7][j];
                            $(id).attr("CourseID", courses[i][0]);
                            $(id).attr("ScheduleID", courses[i][6]);
                            //$(id).attr("ProfessorID", courses[i][3]);
                            $(id).append(content);
                        }

                        SelectedCourseIDs.push(courses[i][0]);
                        DisableCourse(courses[i][0]);
                    }
                }
            }
        };
    $.ajax(settings);
}

function GetSelectableCourses()
{
    var settings =
        {
            url: "../ASPXCGI/StudentCourse.aspx?Type=GetSelectableCourses&ID=" + getCookie("ID"),
            contentType: "multipart/form-data",
            type: 'GET',
            processData: false,
            async: true,
            success: function (data)
            {
                SelectableCourses = eval('(' + data + ')');

                if (SelectableCourses.Error)
                {
                    alert(SelectableCourses.Error);
                }
                else
                {
                    var html;
                    for (var i = 0; i < SelectableCourses.length; i++)
                    {
                        html += '<tr>';

                        html += '<td CourseID="' + SelectableCourses[i][0] + '">' + SelectableCourses[i][1] + '</td>';
                        html += '<td>' + SelectableCourses[i][2] + '</td>';
                        html += '<td ProfessorID="' + SelectableCourses[i][3] + '">' + SelectableCourses[i][4] + '</td>';
                        html += '<td>' + SelectableCourses[i][5] + '</td>';

                        html += '<td>';
                        for (var j = 0; j < SelectableCourses[i][6].length; j++)
                        {
                            var st = '';
                            switch (SelectableCourses[i][6][j].substr(3, 1))
                            {
                                case "1":
                                    st = "9:00";
                                    break;
                                case "2":
                                    st = "10:40";
                                    break;
                                case "3":
                                    st = "13:00";
                                    break;
                                case "4":
                                    st = "14:40";
                                    break;
                            }

                            if (j > 0) html += ', ';
                            html += SelectableCourses[i][6][j].substr(0, 3) + st;
                        }
                        html += '</td>';

                        html += '<td><button type="button" class="btn btn-primary editBtn" onclick="AddCourse(this)">+</button>';

                        html += '</tr>';
                    }

                    $('#selectableCourses').append(html);
                    GetSelectedCourses();
                }
            }
        };
    $.ajax(settings);
}

function DisableCourse(CourseID)
{
    $("#selectableCourses").find("tr").each(function ()
    {
        var tds = $(this).find("td");
        if (tds.length > 0 && $(tds[0]).attr("CourseID") == CourseID)
        {
            //alert(CourseID);
            $(tds[tds.length - 1]).find('button').attr("disabled", "disabled");
        }
    });
}

function RemoveCourse(btn)
{
    HideAllAlerts();

    if (confirm("Are you sure to remove this course?") == true)
    {
        var ID = getCookie("ID");

        var CourseID = $(btn).parent().parent().parent().parent().parent().attr("courseID"),
            ScheduleID = $(btn).parent().parent().parent().parent().parent().attr("ScheduleID");

        var settings =
            {
                url: "../ASPXCGI/StudentCourse.aspx?Type=DropCourse&ID=" + ID + "&ScheduleID=" + ScheduleID,
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
                    else if (response.Fail)
                    {
                        Alert("dropFail");
                    }
                    else
                    {
                        Alert("dropSuccess");

                        $("#selectableCourses").find("tr").each(function ()
                        {
                            var tds = $(this).find("td");
                            if (tds.length > 0 && $(tds[0]).attr("CourseID") == CourseID)
                            {
                                $(tds[tds.length - 1]).find('button').removeAttr("disabled");
                            }
                        });

                        $('#table2').find('td').each(function ()
                        {
                            if ($(this).attr("ScheduleID") == ScheduleID) $(this).empty();
                        });

                        for (var i = 0; i < SelectedCourseIDs.length; i++)
                        {
                            if (SelectedCourseIDs[i] == CourseID)
                            {
                                //SelectedCourseIDs[i] = 0;
                                SelectedCourseIDs.splice(i, 1);
                                break;
                            }
                        }
                    }
                }
            }

        $.ajax(settings);
    }
}

function TimeConflict(t)
{
    var st;

    switch (t.substr(3, 1))
    {
        case "1":
            st = "9:00";
            break;
        case "2":
            st = "10:40";
            break;
        case "3":
            st = "13:00";
            break;
        case "4":
            st = "14:40";
            break;
    }

    var message = "There is a time conflict at " + t.substr(0, 3) + st + ", please verify your selection:(";

    $("#timeConflict").children('p:last').text(message);
    Alert("timeConflict");
}

function HideAllAlerts()
{
    $("#alerts").children("div").hide();
}

function Alert(alertId)
{
    alertId = "#" + alertId;
    $(alertId).show();
    $("body").scrollTop(0);
}

function GetCourseTimes(CourseID)
{
    for (var i = 0; i < SelectableCourses.length; i++)
    {
        if (SelectableCourses[i][0] == CourseID)
        {
            return SelectableCourses[i][6];
        }
    }
}

function AddCourse(btn)
{
    HideAllAlerts();

    var CourseID = $($(btn).parent().parent().children()[0]).attr("CourseID");
    var ID = getCookie("ID");
    var Times1 = GetCourseTimes(CourseID);

    //this way is more complicated
    //but it follows the rule of the seperation of view and data
    for (var i = 0; i < Times1.length; i++)
    {
        var t1 = Times1[i];

        for (var j = 0; j < SelectedCourseIDs.length; j++)
        {
            var Times2 = GetCourseTimes(SelectedCourseIDs[j]);

            for (var k = 0; k < Times2.length; k++)
            {
                var t2 = Times2[k];

                if (t1 == t2)
                {
                    TimeConflict(t1);
                    return;
                }
            }
        }

        //var time = SelectableCourses[i][6][j];
        //var id = "#" + time;
        //if ($(id).children().length > 0)
        //{
        //    TimeConflict(time);
        //    return;
        //}
    }

    var settings =
           {
               url: "../ASPXCGI/StudentCourse.aspx?Type=SelectCourse&ID=" + ID + "&CourseID=" + CourseID,
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
                       var ScheduleID = response.ScheduleID,
                           Title = $($(btn).parent().parent().children()[1]).text(),
                           ProfessorName = $($(btn).parent().parent().children()[2]).text();

                       if (ScheduleID != 0)
                       {
                           Alert("addSuccess");

                           for (var i = 0; i < response.CourseTimesList.length; i++)
                           {
                               var id = "#" + response.CourseTimesList[i];
                               $(id).attr("ScheduleID", ScheduleID);

                               var content = '<table><tr><td style="border: none">' + Title
                            + '</td><td style="border: none" rowspan="2">'
                            + '<button type="button" class="btn btn-warning editBtn" onclick="RemoveCourse(this)">-</button></td></tr>'
                            + '<tr><td style="border: none"><i>' + ProfessorName + '</i></td></tr></table>';

                               $(id).addClass("CourseID", CourseID);
                               $(id).addClass("ScheduleID", ScheduleID);
                               $(id).append(content);
                           }

                           SelectedCourseIDs.push(CourseID);
                           $(btn).attr("disabled", "disabled");
                       }
                       else
                       {
                           Alert("addFail");
                       }
                   }
               }
           }
    $.ajax(settings);
}