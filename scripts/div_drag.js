let line_nr = 0;
let pointed_nr = 0;
let temp_nr = 0;
let lines = [];
let points = [];
let temporary = [];
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
    constructor(id, left, top, type, line_id, accepted, classes) {
        this.id = id;
        this.x = left;
        this.y = top;
        this.type = type;
        this.line = line_id;
        this.acceptance = accepted;
        this.classes = classes;
    }
}
class Temp {
    constructor(id, left, top, type, classes) {
        this.id = id;
        this.x = left;
        this.y = top;
        this.type = type;
        this.classes = classes;
        this.del = false;
    }
}
$(document).ready(function (event, ui) {
    if ("points" in localStorage) {
        let restore_div, filtered;
        points = JSON.parse(localStorage.points);
        for (j = 0; j < points.length; j++) {
            restore_div = $("#destination_marker").clone().appendTo($("#div_constructor"))
                .css({"position": "absolute", "left": points[j].x, "top": points[j].y})
                .attr({"id": points[j].id, "class": points[j].classes});
            make_draggable(restore_div);
            make_droppable(restore_div);
        }
        temporary = JSON.parse(localStorage.temp);
        filtered = temporary.filter(function (filtered) {
            return filtered.del === false;
        });
        for (j = 0; j < filtered.length; j++) {
             restore_div = $("#line").clone().appendTo($("#div_constructor"))
                .css({"position": "absolute", "left": filtered[j].x, "top": filtered[j].y})
                .attr({"id": filtered[j].id, "class": filtered[j].classes});
            make_draggable(restore_div);
        }
        lines = JSON.parse(localStorage.lines);
        filtered = lines.filter(function (filtered) {
            return filtered.del === false;
        });
        for (j = 0; j < filtered.length; j++) {
            restore_div = $(".pointA").first().clone().appendTo($("#div_constructor"))
                .css({"position": "absolute", "left": filtered[j].x2-8, "top": filtered[j].y2-8})
                .attr({"id": filtered[j].B, "class":"x2 dragged"});
              $("#replace_line").clone().appendTo($("#svg_constructor"))
                .attr({"id": filtered[j].id, "x1": filtered[j].x1, "x2": filtered[j].x2, "y1": filtered[j].y1, "y2": filtered[j].y2, stroke:"black", });
            make_draggable(restore_div);
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
                    points[pointed_nr] = new Points("pointed_" + pointed_nr, left, top, "destination", "none", ".point, .any", "element marker dragged destination");
                } else  if (ui.draggable.attr("id") === "route_marker"){
                    ui.draggable.clone().appendTo($("#div_constructor")).addClass("dragged new");
                    points[pointed_nr] = new Points("pointed_" + pointed_nr, left, top, "route", "none", ".point, .any, .only_route", "element marker dragged");
                }else if (ui.draggable.attr("id") === "line"){
                    ui.draggable.clone().appendTo($("#div_constructor")).addClass("dragged new");
                    temporary[temp_nr] = new Temp("temp_" + temp_nr, left, top, "not_pointed", "point element line dragged")
                }else {
                    ui.draggable.clone().appendTo($("#div_constructor")).addClass("dragged new");
                }
                let mark_clone = $(".dragged.new");
                mark_clone.css({'left': left, 'top': top, 'position': "absolute"})
                    .removeClass("draggable new")
                    .removeAttr("onmousedown id");
                if (mark_clone.is(".line")) {
                    mark_clone.addClass("point").attr({"id":"temp_" + temp_nr++});
                    make_draggable(mark_clone);
                   } else if (mark_clone.is(".marker")) {
                    make_draggable(mark_clone);
                    make_droppable(mark_clone);
                }
                updateLocalStorage();
            }
        }
    });
});
function make_draggable(item, id) {
    if ($(item).hasClass("marker")) {
        $(item).addClass("any");
            //  revertable = "invalid";
        } else if ($(item).hasClass("point")) {
        $(item).addClass("any");
            //  revertable = "invalid";
        } else {
        if (lines.length > 0 && lines[line_nr].typeB !== "any") {
            $(item).addClass("only_route");
            // revertable = "invalid";
        }
        $(item).removeClass("temporary").attr({"id": "tempB_" + line_nr++});
    }
    let top, left, add, str, strA, strB;
    item.draggable({
        revert: "invalid",
        containment: "parent",
        start: function () {
            let id = $(this).attr("id");
            if ($(this).hasClass("point")) {
                str = "#" + $(item).attr("id");
                add = 0;
            } else if ($(this).hasClass("x2")) {
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
            } else if ($(this).hasClass("marker")) {
                $(strA).attr({"x1": left, "y1": top});
                $(strB).attr({"x2": left, "y2": top})
            }
        },
        stop: function (event, ui) {
            if ($(this).hasClass("marker")) {
                points[extNum($(this).attr("id"))].x = $(this).position().left;
                points[extNum($(this).attr("id"))].y = $(this).position().top;
            } else if ($(this).hasClass("x2")) {

            } else {
                temporary[extNum($(this).attr("id"))].x = $(this).position().left;
                temporary[extNum($(this).attr("id"))].y = $(this).position().top;
            }
            updateLocalStorage()
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
                let x = extNum($(ui.helper).attr("id"));
                lines[x].B = $(this).attr("id");
                lines[x].x2 = left;
                lines[x].y2 = top;

            } else {
                if (item.hasClass("destination")) {
                    lines[line_nr] = new Lines(left, top, $(item).attr("id"), "tempB_" + line_nr, "destination", "only_route", false);
                    temporary[extNum(ui.draggable.attr("id"))].del = true;
                    updateLocalStorage()
                } else {
                    lines[line_nr] = new Lines(left, top, id, "tempB_" + line_nr, "route", "any", false);
                    temporary[extNum(ui.draggable.attr("id"))].del = true;
                    updateLocalStorage()
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
    $("#tempB_" + x).remove();
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
    localStorage.setItem("temp", JSON.stringify(temporary));
    localStorage.setItem("lines", JSON.stringify(lines));
    console.log("updated local Storage")
    //   localStorage.setItem("lines", JSON.stringify(line));
}