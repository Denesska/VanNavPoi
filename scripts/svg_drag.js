let i = 0;
var blabla = null;
$(document).ready(function (event, ui) {
    $(".draggable").draggable({
        start: function (event, ui) {
            ui.helper.css({"z-index": 6});
            ui.helper.addClass("transport_svg");

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
            let svg_offset = $("svg.constructor").offset()
            let left = ui.helper.position().left - svg_offset.left;
            let top = ui.helper.position().top - svg_offset.top;
            if (ui.draggable.is(".draggable")) {
                $("#svg_constructor").append(ui.draggable.clone().children().addClass("new"));
                let new_obj = $(".new");
                new_obj.attr({"id": new_obj.attr("id") + "_" + i++});
                if (new_obj.attr("id").substring(0, 4) === "lines") {
                    new_obj.find(".pointA").attr({"cx": left + 11, "cy": top + 11, "onmousedown": "dragObject(this)"});
                    new_obj.find(".pointB").attr({"cx": left + 89, "cy": top + 89, "onmousedown": "dragObject(this)"});
                    new_obj.find("lines").attr({"x1": left + 11, "y1": top + 11, "x2": left + 89, "y2": top + 89});

                } else {
                    new_obj.children().attr({"onmousedown": "dragObject(this)", "cx": left + 50, "cy": top + 50});
                }
                new_obj.removeClass("new");
                if(new_obj.find("lines").length === 0){
                    new_obj.mouseenter(function () {
                        blabla = this;
                    });
                }

                new_obj.mouseup(function () {
                    debugger;
                })
            }
        },
        deactivate: function (event, ui) {
            $(this).find(".h3").text("Let's drag Marker");
            $(this).find(".h3").css("background-color", "rgba(215, 215, 215, 0.5)");
        }
    });

});

function dragObject(item) {
    const DIV = $(".constructor");
    $(document).mousemove(function (event) {
        let a_mouseX = event.pageX;
        let a_mouseY = event.pageY;
        let r_mouseX = a_mouseX - DIV.offset().left;
        let r_mouseY = a_mouseY - DIV.offset().top;
        if (r_mouseX < 11) {
            r_mouseX = 11;
        }
        if (r_mouseX > $("svg.constructor").width()) {
            r_mouseX = $("svg.constructor").width() - 11;
        }
        if (r_mouseY < 11) {
            r_mouseY = 11;
        }
        if (r_mouseY > $("svg.constructor").height()) {
            r_mouseY = $("svg.constructor").height() - 11
        }
        let point = $(item).attr("class");
        if (point === "pointA") {
            let line = $(item).next();
            line.attr({"x1": r_mouseX, "y1": r_mouseY});
        } else if (point === "pointB") {
            let line = $(item).prev();
            line.attr({"x2": r_mouseX, "y2": r_mouseY});
        }
        $(item).attr({"cx": r_mouseX, "cy": r_mouseY});/*
        $(point.substring(0, 5) === "point").on("mouseup", function () {
            hover_item_id = $(this).attr("id")
        })*/

    });
    $(document).mouseup(function () {
        $(document).off("mousemove");
    });
}

// marius was here
