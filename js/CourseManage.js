var ProfessorListFilled = false;
var EditingTDS;

$(document).ready(function ()
{
    $('#deleteSuccess').hide();
    $('#deleteFail').hide();
    $('#editorForm').hide();
    $('#updateSuccess').hide();
    $('#updateFail').hide();
    $('#addSuccess').hide();
    $('#addFail').hide();

    GetCourseList();
    //the following statements should be placed in the "success" section in GetCourseList's ajax settings:
    //$('.editBtn').click(UpdateCourse());
    //$('.deleteBtn').click(DeleteCourse(this));
});

function GetCourseList()
{
    var settings =
        {
            url: "../ASPXCGI/CourseManage.aspx?Type=GetCourseList",
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
                    var html;
                    for (var i = 0; i < courses.length; i++)
                    {
                        html += '<tr>';

                        html += '<td CourseID="' + courses[i].CourseID + '">' + courses[i].Code + '</td>';
                        html += '<td>' + courses[i].Title + '</td>';
                        html += '<td>' + courses[i].Grade + '</td>';
                        html += '<td>' + courses[i].Term + '</td>';;
                        html += '<td ProfessorID="' + courses[i].ProfessorID + '">' + courses[i].ProfessorName + '</td>';
                        html += '<td>' + courses[i].Credits + '</td>';
                        html += '<td><button type="button" class="btn btn-primary editBtn" onclick="EditCourse(this)">Edit</button>';
                        html += '<button type="button" class="btn btn-warning deleteBtn" onclick="DeleteCourse(this, ' + courses[i].CourseID + ')">Delete</button></td>';

                        html += '</tr>';
                    }

                    $('#table1').append(html);
                    //$('#table1').html($('#table1').html() + html);
                }
            }
        };
    $.ajax(settings);
}

function GetProfessorList()
{
    var settings =
        {
            url: "../ASPXCGI/CourseManage.aspx?Type=GetProfessorList",
            contentType: "multipart/form-data",
            type: 'GET',
            processData: false,
            async: false,
            success: function (data)
            {
                var professors = eval('(' + data + ')');

                if (professors.Error)
                {
                    alert(professors.Error);
                }
                else
                {
                    for (var i = 0; i < professors.length; i++)
                    {
                        var option = $("<option>").val(professors[i][0]).text(professors[i][1]);
                        $("#ProfessorID").append(option);
                    }
                }

                ProfessorListFilled = true;
            }
        };
    $.ajax(settings);
}

function GetCourseTimes(CourseID)
{
    var settings =
        {
            url: "../ASPXCGI/CourseManage.aspx?Type=GetCourseTimes&CourseID=" + CourseID,
            contentType: "multipart/form-data",
            type: 'GET',
            processData: false,
            async: true,
            success: function (data)
            {
                var CourseTimes = eval('(' + data + ')');

                if (CourseTimes.Error)
                {
                    alert(CourseTimes.Error);
                }
                else
                {
                    for (var i = 0; i < CourseTimes.length; i++)
                    {
                        var CourseTimeID = CourseTimes[i].CourseTimeID,
                            id = "#" + CourseTimes[i].Time;
                        $(id).attr("checked", "checked");
                    }
                }
            }
        };
    $.ajax(settings);
}

function EditCourse(btn)
{
    $("#table2").find("input").removeAttr("checked");
    $("#alerts").children().hide();

    if (!ProfessorListFilled) GetProfessorList();

    EditingTDS = $(btn).parent().parent().children();
    $('#Code').val(EditingTDS[0].innerText);
    $('#Title').val(EditingTDS[1].innerText);
    $('#Grade').val(EditingTDS[2].innerText);
    $('#Term').val(EditingTDS[3].innerText);
    $('#Credits').val(EditingTDS[5].innerText);
    $('#ProfessorID').val(EditingTDS[4].getAttribute('ProfessorID'));
    $('#CourseID').val(EditingTDS[0].getAttribute('CourseID'));

    GetCourseTimes(EditingTDS[0].getAttribute('CourseID'));

    //var html = document.getElementById("editorForm");

    //var d = dialog(
    //    {
    //        content: html,
    //        width: '500px',
    //    });

    //d.showModal();
    //OpenedDialog = d;

    if (typeof (OpenedDialog) == "undefined")
    {
        //variable with var-declare in function will be treated as global variable.
        //no title/buttons configured here
        OpenedDialog = $("#editorForm").dialog({
            autoOpen: false,
            //height: 200,
            width: 560,
            modal: true
        });

        //hide the title
        $(".ui-dialog-titlebar").hide();
    }

    OpenedDialog.dialog("open");
    return false;
}

function AddCourse()
{
    $("#alerts").children().hide();

    if (!ProfessorListFilled) GetProfessorList();

    $('#Code').val(null);
    $('#Title').val(null);
    $('#Grade').val(null);
    $('#Term').val(null);
    $('#Credits').val(null);
    $('#ProfessorID').val(null);
    $('#CourseID').val(null);

    //$('#table2').find('input').each(function ()
    //{
    //    this.checked = false;
    //});
    $('#table2').find('input').removeAttr('checked');

    var html = document.getElementById("editorForm");

    var d = dialog(
        {
            content: html,
            width: '500px',
        });

    d.showModal();
    OpenedDialog = d;

    return false;
}

function DeleteCourse(btn, CourseID)
{
    $("#alerts").children().hide();

    if (confirm("Are you sure to delete this course?") == false) return false;

    var settings =
    {
        url: "../ASPXCGI/CourseManage.aspx?Type=DeleteCourse&CourseID=" + CourseID,
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
            else if (response.Success)
            {
                $(btn).parent().parent().remove();
                //the above statement is not the same as the following one,
                //because "this" here is no longer the deleteBtn,
                //it becomes the caller of the success function
                //$(this).parent().parent().remove();
                $('#deleteSuccess').show();
            }
            else
            {
                $('#deleteFail').show();
            }
        }
    }

    $.ajax(settings);
    return false;
}

function SubmitForm()
{
    if ($('#CourseID').val().length == 0) SubmitAddedCourse();
    else SubmitUpdatedCourse();
}

function SubmitUpdatedCourse()
{
    //var formdata = new FormData($('#editorForm')[0]);
    var formdata = $("#editorForm").serialize();
    var settings =
        {
            //Firefox does not support the two parameters, contentType and processData
            url: "../ASPXCGI/CourseManage.aspx?Type=UpdateCourse",
            type: 'POST',
            async: true,
            data: formdata,
            success: function (data)
            {
                var response = eval('(' + data + ')');

                if (response.Error)
                {
                    alert(response.Error);
                }

                if (response.Success)
                {
                    $('#updateSuccess').show();

                    //In this scenario, JQuery object does not work.
                    //can only use DOM.
                    //$(EditingTDS[0]).innerText = $('#Code').val();
                    //$(EditingTDS[1]).innerText = $('#Title').val();
                    //$(EditingTDS[2]).innerText = $('#Grade').val();
                    //$(EditingTDS[3]).ProfessorID = $('#ProfessorID').val();
                    //$(EditingTDS[4]).innerText = $('#Credits').val();
                    EditingTDS[0].innerText = document.getElementById("Code").value;
                    EditingTDS[1].innerText = document.getElementById("Title").value;
                    EditingTDS[2].innerText = document.getElementById("Grade").value;
                    EditingTDS[3].innerText = document.getElementById("Term").value;

                    var select = document.getElementById("ProfessorID");
                    var selectedIndex = select.selectedIndex;
                    var selectedText = select.options[selectedIndex].text;
                    var selectedValue = select.options[selectedIndex].value;

                    EditingTDS[4].setAttribute("ProfessorID", selectedValue);
                    EditingTDS[4].innerText = selectedText;

                    EditingTDS[5].innerText = document.getElementById("Credits").value;
                }
                else
                {
                    $('#updateFail').show();
                }

                closeDialog();
            }
        }

    $.ajax(settings);
}

function SubmitAddedCourse()
{
    var formdata = $("#editorForm").serialize();
    var settings =
        {
            //Firefox does not support these two parameters: contentType and processData
            url: "../ASPXCGI/CourseManage.aspx?Type=AddNewCourse",
            type: 'POST',
            async: true,
            data: formdata,
            success: function (data)
            {
                var response = eval('(' + data + ')');

                if (response.Error)
                {
                    alert(response.Error);
                }

                if (response.Success)
                {

                    $('#addSuccess').show();

                    var html;

                    html += '<tr>';

                    html += '<td CourseID="' + response.CourseID + '">' + document.getElementById("Code").value + '</td>';
                    html += '<td>' + document.getElementById("Title").value + '</td>';
                    html += '<td>' + document.getElementById("Grade").value + '</td>';
                    html += '<td>' + document.getElementById("Term").value + '</td>';

                    var select = document.getElementById("ProfessorID");
                    var selectedIndex = select.selectedIndex;
                    var selectedText = select.options[selectedIndex].text;
                    var selectedValue = select.options[selectedIndex].value;
                    html += '<td ProfessorID="' + selectedValue + '">' + selectedText + '</td>';
                    html += '<td>' + document.getElementById("Credits").value + '</td>';

                    html += '<td><button type="button" class="btn btn-primary editBtn" onclick="EditCourse(this)">Edit</button>';
                    html += '<button type="button" class="btn btn-warning deleteBtn" onclick="DeleteCourse(this, ' + response.CourseID + ')">Delete</button></td>';

                    html += '</tr>';

                    $('#table1').append(html);
                }
                else
                {
                    $('#addFail').show();
                }

                closeDialog();
            }
        }

    $.ajax(settings);
}

function closeDialog()
{
    //OpenedDialog.close().remove();
    OpenedDialog.dialog("close");
}