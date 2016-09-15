var MaxNewsID, MinNewsID, TopNewsID, BottomNewsID;
var CurrentPage, TotalPage;

$(document).ready(function ()
{
    //initialize the whole News page
    var settings =
        {
            //url: "bin/StudentCGI.exe?InitializeNewsPage=0&PageSize=" + SCSettings.PageSize,
            url: "../ASPXCGI/InitializeNewsPage.aspx?PageSize=" + SCSettings.PageSize,
            type: 'GET',
            processData: false,
            async: true,
            success: function (data)
            {
                var obj = eval('(' + data + ')');

                if (obj.Error)
                {
                    alert(obj.Error);
                }
                else
                {
                    MaxNewsID = obj.MaxNewsID;
                    MinNewsID = obj.MinNewsID;
                    TotalPage = obj.TotalPage;

                    setCookie('LastReadNewsID', MaxNewsID, 365);
                    setCookie('UnreadNewsCount', 0, 365);

                    CurrentPage = 0;
                    BottomNewsID = MaxNewsID + 1;
                    TopNewsID = MaxNewsID;

                    FetchNews(1);
                }
            }
        };
    $.ajax(settings);
});

function InsertNews(obj)
{
    var html =
        "<div class=\"news\"><h5>"
        + obj.NewsTitle
        + "<button type=\"button\" class=\"flip btn btn-primary\">Expand/Collapse</button></h5>"
        + "<div class=\"content\"><p>Posted "
        + obj.PostDateTime
        + "</p><div class=\"well\"><p>"
        + htmlEscape(obj.NewsContent)
        + "</p></div></div></div>";

    $('#NewsHolder').append(html);

}

function FetchNews(next)
{
    var settings =
      {
          url: "../ASPXCGI/FetchNews.aspx?&TopNewsID=" + TopNewsID + "&BottomNewsID=" + BottomNewsID + "&Next=" + next + "&PageSize=" + SCSettings.PageSize,
          type: 'GET',
          processData: false,
          async: true,
          success: function (ResponseData)
          {
              $('#NewsHolder').children().remove();

              var obj = eval("var tempData = " + ResponseData + "; tempData;");

              if (obj.Error)
              {
                  alert(obj.Error);
              }
              else
              {
                  var count = obj.length;

                  if (count == 0) return;

                  if (next == 1)//next
                  {
                      for (var i = 0; i < count; i++) InsertNews(obj[i]);


                      TopNewsID = obj[0].NewsID;
                      BottomNewsID = obj[count - 1].NewsID;
                  }
                  else//previous
                  {
                      for (var i = count - 1; i >= 0; i--) InsertNews(obj[i]);

                      TopNewsID = obj[count - 1].NewsID;
                      BottomNewsID = obj[0].NewsID;
                  }

                  if (next == 1) CurrentPage++;
                  else CurrentPage--;

                  $('#PageNumber').text(CurrentPage + '/' + TotalPage);

                  if (CurrentPage <= 1)
                  {
                      $('#Previous').addClass('disabled');
                      $('#Previous').attr('disabled', 'disabled');
                  }
                  else $('#Previous').removeAttr('disabled');

                  if (CurrentPage >= TotalPage)
                  {
                      $('#Next').addClass('disabled');
                      $('#Next').attr('disabled', 'disabled');
                  }
                  else $('#Next').removeAttr('disabled');

                  $(".news .flip").click(function ()
                  {
                      $(this).parents(".news").children(".content").toggle("slow");
                  });
              }
          }
      };

    $.ajax(settings);
}