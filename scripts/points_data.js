/**
 * Created by d.gandzii on 8/1/2017.
 */
let list;
window.onload = function () {
    let settings = {
        "async": true,
        "crossDomain": true,
        "url": "http://vanillanav.rosoftlab.net/api/v2/venue/5949",
        "method": "GET",
        "headers": {
            "cache-control": "no-cache",
            "postman-token": "cd123e6f-89b0-b653-1f00-28f2734c7880"
        }
    };

    $.ajax(settings).done(function (response) {
        filter_markers(response);
    });
};
function filter_markers(obj) {
    list = obj.Sections[0].Markers;
}