/**
 * Created by d.gandzii on 7/11/2017.
 */
/*$(window).ready(function () {
 var canvas = document.getElementById('canvasConstructor');
 var can = $('#canvasConstructor')[0];
 var ctx = can.getContext('2d');
 ctx.fillStyle = 'Red';
 ctx.fillRect(10, 10, 300, 100);
 ctx.fillStyle = 'Blue';
 ctx.arc(100, 100, 50, 0, 270, false);
 ctx.fill();
 });*/
/*window.onload = function () {
 var canvas = document.getElementById('canvasConstructor');
 var ctx = canvas.getContext('2d');
 ctx.fillRect(10, 10, 300, 100);
 }*/
$(document).ready(function (event, ui) {
    $(".point").draggable({
        start: function (event, ui) {
            ui.helper.css({"z-index": 6});
        },
        revert: "invalid",
        containment: "parent"
    });
    $(".draggable").draggable({
        start: function (event, ui) {
            ui.helper.css({"z-index": 6});
        },
        revert: "invalid",
        helper: "clone",
        cursor: "move",
    });
    $(".marker").droppable({
        accept: ".pointA, .pointB",
        tolerance: "fit",
        drop: function (event, ui) {
            if (ui.draggable.is(".pointA") || ui.draggable.is(".pointB")) {
                console.log("done");
            }
        }
    });

    $(".constructor").droppable({
        accept: ".draggable",
        hoverClass: "highlight",
        tolerance: "intersect",
        activate: function (event, ui) {
            $(this).find(".h3").text("Drag it HERE");
            $(this).find(".h3").css("background-color", "#ddd");
        },
        drop: function (event, ui) {
            if (ui.draggable.is(".draggable")) {
                let left = ui.helper.position().left - $("svg.constructor").offset().left;
                let top = ui.helper.position().top - $("svg.constructor").offset().top;
                ui.draggable.clone().appendTo($(".constructor")).addClass("dragged new");
                let mark_clone = $(".dragged.new");
                mark_clone.css({'left': left, 'top': top, 'position': "absolute"});
                mark_clone.removeClass("draggable new");
                mark_clone.removeAttr("onmousedown id");
                draggable_el_construct(mark_clone);
            } else {
                let parentOffsetLeft = $(".constructor").offset().left;
                let parentOffsetTop = $(".constructor").offset().top;
                let left = ui.helper.position().left - parentOffsetLeft;
                let top = ui.helper.position().top - parentOffsetTop;
                ui.draggable.clone().appendTo($(".constructor")).addClass("dragged new");
                let mark_clone = $(".dragged.new");
                mark_clone.css({'left': left, 'top': top, 'position': "absolute"});
                mark_clone.removeClass("draggable new");
                mark_clone.removeAttr("onmousedown id");
                if(mark_clone.is(""))
                draggable_el_construct(mark_clone);
            }
        },
        deactivate: function (event, ui) {
            $(this).find(".h3").text("Let's drag Marker");
            $(this).find(".h3").css("background-color", "rgba(215, 215, 215, 0.5)");
        }
    });
});
function draggable_el_construct(item) {
    item.draggable();
    if (item.is("marker")) {
        item.droppable();
    }
}
$(window).resize(function () {
    console.log("resized")
});
function active_mark_on_top(item) {
    let id = item.getAttribute("id");
    $(".dragged").css("z-index", 5);
    item.css({"z-index": 6});
}
