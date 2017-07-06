/**
 * Created by d.gandzii on 7/5/2017.
 */
var test = {};
$(document).ready(function () {
    let position;
    $(".draggable").draggable({
        revert: "invalid",
        helper: "clone",
        cursor: "move",
    });

    $(".main_side").droppable({
        accept: ".draggable",
        hoverClass: "highlight",
        tolerance: "intersect",
        activate: function (event, ui) {
            $(this).find(".h3").text("Drag it HERE");
            $(this).find(".h3").css("background-color", "#ddd");
        },
        deactivate: function (event, ui) {
            $(this).find(".h3").text("Let's drag Marker");
            $(this).find(".h3").css("background-color", "rgba(215, 215, 215, 0.5)");
        },
        drop: function (event, ui) {
            if (ui.draggable.is(".draggable")) {
                position = $(".ui-draggable-dragging").offset();
                position['position'] = "absolute";
            test = position;
                ui.draggable.clone().appendTo($(".constructor")).addClass("dragged new");
                let mark_clone = $(".dragged");
                mark_clone.css(position);
                mark_clone.removeClass("draggable new");
                mark_clone.removeAttr("onmousedown");
                mark_clone.draggable();
            }
        }
    });
});
function drag_marker(item) {
    let id = item.getAttribute("id");
    $(".dragged").css("z-index", 5);
    item.style.zIndex = 6;
    console.log("you dragging : " + id);
}
function detect_pos_relative(position) {

    position = $(".ui-draggable-dragging").offset();
    position['position'] = "absolute";
    ui.draggable.clone().appendTo($(".constructor")).addClass("dragged");
    let mark_clone = $(".dragged");
    mark_clone.css(position);
}