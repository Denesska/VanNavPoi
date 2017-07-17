let line_nr = 0;
let pointed_nr = 0;
let lines = [];
let points = [];
let f = null;
class Lines {
    constructor(left, top, A, B, typeA, typeB, del) {
        this.x1 = left + 35;
        this.x2 = left + 98;
        this.y1 = top + 35;
        this.y2 = top + 98;
        this.A = A;
        this.typeA = typeA;
        this.typeB = typeB;
        this.B = B;
        this.id = "lines_" + lines.length;
        this.del = del;
    }

    initial() {
        return {
            "x1": this.x1,
            "y1": this.y1,
            "x2": this.x2,
            "y2": this.y2,
            "stroke": "black",
            "id": this.id,
            "class": this.A,
            "ondblclick": "remove_line(this)"
        };
    }
}
class Points {
    constructor(id, left, top, type, line_id, accepted) {
        this.id = id;
        this.x = left;
        this.y = top;
        this.type = type;
        this.line = line_id;
        this.acceptance = accepted;
    }
}
$(document).ready(function (event, ui) {
    if ("points" in localStorage){
        points = JSON.parse(localStorage.points);
        for (j = 0; j < points.length; j++) {
            let div = '<div id="' + points[j].id + '" class="element marker dragged"></div>';
            div.appendTo(".div_constructor").css({'left': points[j].x, 'top': points[j].y})
    }
    }
    $(".draggable").draggable({
        start: function (event, ui) {
            ui.helper.css({"z-index": 6});
        },
        revert: "invalid",
        helper: "clone",
        cursor: "move",
    });
    $("#div_constructor").droppable({
        accept: ".draggable, .dragged, .point, .any",
        hoverClass: "highlight",
        tolerance: "intersect",
        containment: "parent",
        drop: function (event, ui) {
            let left = ui.helper.position().left - $("#svg_constructor").offset().left;
            let top = ui.helper.position().top - $("#svg_constructor").offset().top;
            if (ui.draggable.is(".draggable")) {
                if (ui.draggable.attr("id") === "destination_marker") {
                    ui.draggable.clone().appendTo($("#div_constructor")).addClass("dragged destination new");
                    points[pointed_nr] = new Points("pointed_" + pointed_nr, left, top, "destination", "none", ".point, .any");
                } else {
                    ui.draggable.clone().appendTo($("#div_constructor")).addClass("dragged new");
                    points[pointed_nr] = new Points("pointed_" + pointed_nr, left, top, "route", "none", ".point, .any, .only_route");
                }
                let mark_clone = $(".dragged.new");
                mark_clone.css({'left': left, 'top': top, 'position': "absolute"})
                    .removeClass("draggable new")
                    .removeAttr("onmousedown id");
                if (mark_clone.is(".lines")) {
                    mark_clone.addClass("point").draggable({revert: "invalid"});
                } else if (mark_clone.is(".marker")) {
                    make_draggable(mark_clone);
                    make_droppable(mark_clone);
                }
            }
        }
    });
});
function make_draggable(item, id) {
    if (!$(item).hasClass("marker")) {
        if (lines.length > 0 && lines[line_nr].typeB !== "any") {
            $(item).addClass("only_route");
            //  revertable = "invalid";
        } else {
            $(item).addClass("any");
            // revertable = "invalid";
        }
        $(item).removeClass("temporary").attr({"id": "temp_" + line_nr++});
    }
    let top, left, add, str, strA, strB;
    item.draggable({
        revert: "invalid",
        containment: "parent",
        start: function () {
            if ($(this).hasClass("x2")) {
                let id = $(this).attr("id");
                let pointed_lines = lines.filter(function (pointed_lines) {
                    return pointed_lines.A === id || pointed_lines.B === id;
                });
                let pointed = [];
                for (let j = 0; j < pointed_lines.length; j++) {
                    pointed[j] = "#" + pointed_lines[j].id;
                }
                str = pointed.join();
                add = 9;
            } else {
                if (lines.length > 0) {
                    let id = $(this).attr("id");
                    let pointed_lines = lines.filter(function (pointed_lines) {
                        return pointed_lines.A === id || pointed_lines.B === id;
                    });
                    let pointedA = [], pointedB = [];
                    for (let j = 0; j < pointed_lines.length; j++) {

                        if (pointed_lines[j].A === id) {
                            pointedA.push("#" + pointed_lines[j].id);
                        } else {
                            pointedB.push("#" + pointed_lines[j].id);
                        }
                    }
                    strA = pointedA.join();
                    strB = pointedB.join();
                    add = 35;
                }
            }
        },
        drag: function (event, ui) {
            left = $(this).position().left + add;
            top = $(this).position().top + add;
            if ($(this).hasClass("x2")) {
                $(str).attr({"x2": left, "y2": top})
            } else {
                $(strA).attr({"x1": left, "y1": top});
                $(strB).attr({"x2": left, "y2": top})
            }
        },
        stop: function (event, ui) {
            console.log(this);
        }
    });
}
function make_droppable(item) {
    $(item).attr({"id": points[pointed_nr].id});
    let acceptance = points[pointed_nr++].acceptance;
    item.droppable({
        accept: acceptance,
        tolerance: "pointer",
        drop: function (event, ui) {
            let left = $(item).position().left;
            let top = $(item).position().top;
            let id = $(item).attr("id");
            if (ui.helper.hasClass("x2")) {
                let x = parseInt($(ui.helper).attr("id").substr(5, 6));
                lines[x].B = $(this).attr("id");

            } else {
                if (item.hasClass("destination")) {
                    lines[line_nr] = new Lines(left, top, $(item).attr("id"), "temp_" + line_nr, "destination", "only_route", false);
                } else {
                    lines[line_nr] = new Lines(left, top, id, "temp_" + line_nr, "route", "any", false);
                }
                $("#replace_line").clone().appendTo("#svg_constructor").attr(lines[line_nr].initial());
                $(".x2.hidden").clone().appendTo("#div_constructor").css({
                    "top": top + 90,
                    "left": left + 90,
                    "position": "absolute"
                }).removeClass("hidden")
                    .addClass("temporary dragged");
                make_draggable($(".temporary"), id);
            }
            ui.draggable.remove();
        }
    });
}
function remove_line(item) {
    let x = parseInt($(item).attr("id").substr(6, 7));
    lines[x].del = true;
    item.remove();
    $("#temp_" + x).remove();
}
function extNum(str) {
    return parseInt(str.replace(/[^0-9]/g, ''));
}
function active_mark_on_top(item) {
    let id = item.getAttribute("id");
    $(".dragged").css("z-index", 5);
    item.css({"z-index": 6});
}
function updateLocalStorage() {
    localStorage.setItem("points", JSON.stringify(points));
    localStorage.setItem("lines", JSON.stringify(line));
}