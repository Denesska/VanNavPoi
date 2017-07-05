/**
 * Created by d.gandzii on 7/5/2017.
 */

$(document).ready(function () {
    $(".draggable").draggable();

    $(".main_side").droppable({
        accept: ".draggable",
        hoverClass: "highlight",
        tolerance: "intersect",
        activate: function (evt, ui) {
            $(this).find(".h3").text("Drag it HERE");
            $(this).find(".h3").css("background-color", "#ddd");
        },
        deactivate: function (evt, ui) {
            $(this).find(".h3").text("Let's drag another Marker");
            $(this).find(".h3").css("background-color", "rgba(215, 215, 215, 0.5)");
        },
        drop: function (evt, ui) {
            $(this).find(".h3").text("Drag it HERE");
        }
    });
});
function drag_marker(item) {
    var id = item.getAttribute("id");
    $(".draggable").css("z-index", 5);
    item.style.zIndex = 6;
    console.log("you dragging : " + id);
}