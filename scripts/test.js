/**
 * Created by d.gandzii on 7/5/2017.
 */
$(document).ready(function (event, ui) {
    $(".draggable").draggable({
        start: function (event, ui) {
          ui.helper.css({"z-index": 6});
        },
        revert: "invalid",
        helper: "clone",
        cursor: "move",
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
                let parentOffsetLeft = $(".constructor").offset().left;
                let parentOffsetTop = $(".constructor").offset().top;
                let left = ui.helper.position().left - parentOffsetLeft;
                let top = ui.helper.position().top - parentOffsetTop;
                ui.draggable.clone().appendTo($(".constructor")).addClass("dragged new");
                let mark_clone = $(".dragged.new");
                mark_clone.css({'left': left, 'top': top, 'position': "absolute"});
                mark_clone.removeClass("draggable new");
                mark_clone.removeAttr("onmousedown id");
                draggable_el_construct(mark_clone);
            }else {
                let parentOffsetLeft = $(".constructor").offset().left;
                let parentOffsetTop = $(".constructor").offset().top;
                let left = ui.helper.position().left - parentOffsetLeft;
                let top = ui.helper.position().top - parentOffsetTop;
                ui.draggable.clone().appendTo($(".constructor")).addClass("dragged new");
                let mark_clone = $(".dragged.new");
                mark_clone.css({'left': left, 'top': top, 'position': "absolute"});
                mark_clone.removeClass("draggable new");
                mark_clone.removeAttr("onmousedown id");
                draggable_el_construct(mark_clone);
            }
        },
        deactivate: function (event, ui) {
            $(this).find(".h3").text("Let's drag Marker");
            $(this).find(".h3").css("background-color", "rgba(215, 215, 215, 0.5)");
        }
    });
});
$(window).resize(function() {console.log("resized")});
function active_mark_on_top(item) {
    let id = item.getAttribute("id");
    $(".dragged").css("z-index", 5);
    item.css({"z-index": 6});
}
function draggable_el_construct(item) {
    item.draggable({
        drag: function (event, ui) {
            $(item).css({"position": "fixed"});
            $(".dragged").css("z-index", 5);
            item.css("z-index", 6);
        },
        containment: "parent"
    });
}