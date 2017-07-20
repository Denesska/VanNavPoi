let line_nr = 0;
let pointed_nr = 0;
let temp_nr = 0;
let lines = [];
let points = [];
let temporary = [];
let active_id = "nan";
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
    constructor(nr, left, top, type, accepted, classes) {
        this.nr = nr;
        this.id = "pointed_" + this.nr;
        this.x = left;
        this.y = top;
        this.type = type;
        this.line = false;
        this.acceptance = accepted;
        this.classes = classes;
        this.code = random_code();
        this.title = type + " " + nr;
        this.description = "Some description of this mark.";
        this.del = false;
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
$(document).mousedown(ShowMarkerDetails);
$(document).ready(function (event, ui) {
    let div_constructor = $("#div_constructor");
    let svg_constructor = $("#svg_constructor");
    if ("points" in localStorage) {
        let restore_div, filtered;
        points = JSON.parse(localStorage.points);
        for (j = 0; j < points.length; j++) {
            if (points[j].del === false){
                restore_div = $("#destination_marker").clone().appendTo(div_constructor)
                    .css({"position": "absolute", "left": points[j].x, "top": points[j].y})
                    .attr({"id": points[j].id, "class": points[j].classes});
                restore_div.children().html(points[j].nr);
                make_draggable(restore_div);
                make_droppable(restore_div);
            }
        }
        temporary = JSON.parse(localStorage.temp);
        temp_nr = temporary.length;
        filtered = temporary.filter(function (filtered) {
            return filtered.del === false;
        });
        for (j = 0; j < filtered.length; j++) {
            restore_div = $("#line").clone().appendTo(div_constructor)
                .css({"position": "absolute", "left": filtered[j].x, "top": filtered[j].y})
                .attr({"id": filtered[j].id, "class": filtered[j].classes});
            make_draggable(restore_div);
        }
        lines = JSON.parse(localStorage.lines);
        line_nr = lines.length;
        filtered = lines.filter(function (filtered) {
            return filtered.del === false;
        });
        for (j = 0; j < filtered.length; j++) {
            if (lines[j].del === false && lines[j].B.substr(0, 4) === "temp") {
                restore_div = $(".pointA").first().clone().appendTo(div_constructor)
                    .css({"position": "absolute", "left": filtered[j].x2 - 8, "top": filtered[j].y2 - 8})
                    .attr({"id": filtered[j].B, "class": "x2 dragged " + lines[j].typeA});
                make_draggable(restore_div);
            }
            $("#replace_line").clone().appendTo(svg_constructor)
                .attr({
                    "id": filtered[j].id,
                    "x1": filtered[j].x1,
                    "x2": filtered[j].x2,
                    "y1": filtered[j].y1,
                    "y2": filtered[j].y2,
                    stroke: "black",
                    "ondblclick": "remove_line(this)"
                });

        }
        active_id = extNum(localStorage.active_id);
    }
    $(".draggable").draggable({
        start: function (event, ui) {
            ui.helper.css({"z-index": 6});
        },
        revert: "invalid",
        helper: "clone",
        cursor: "move",
    });
    div_constructor.droppable({
        accept: ".draggable, .dragged, .point, .any",
        hoverClass: "highlight",
        tolerance: "intersect",
        containment: "parent",
        drop: function (event, ui) {
            let left = ui.helper.position().left - svg_constructor.offset().left;
            let top = ui.helper.position().top - svg_constructor.offset().top;
            if (ui.draggable.is(".draggable")) {
                if (ui.draggable.attr("id") === "destination_marker") {
                    ui.draggable.clone().appendTo(div_constructor).addClass("dragged destination new");
                    points[pointed_nr] = new Points(pointed_nr, left, top, "destination", ".point, .route", "element marker dragged destination");
                    $(".new p").html(pointed_nr);
                } else if (ui.draggable.attr("id") === "route_marker") {
                    ui.draggable.clone().appendTo(div_constructor).addClass("dragged route new");
                    points[pointed_nr] = new Points(pointed_nr, left, top, "route", ".point, .route, .destination", "element marker dragged route");
                    $(".new p").html(pointed_nr);
                } else if (ui.draggable.attr("id") === "line") {
                    ui.draggable.clone().appendTo(div_constructor).addClass("dragged new");
                    temporary[temp_nr] = new Temp("temp_" + temp_nr, left, top, "not_pointed", "point element line dragged")
                } else {
                    ui.draggable.clone().appendTo(div_constructor).addClass("dragged new");
                }
                let mark_clone = $(".dragged.new");
                mark_clone.css({'left': left, 'top': top, 'position': "absolute"})
                    .removeClass("draggable new")
                    .removeAttr("onmousedown id");
                if (mark_clone.is(".line")) {
                    mark_clone.addClass("point").attr({"id": "temp_" + temp_nr++});
                    make_draggable(mark_clone);
                } else if (mark_clone.is(".marker")) {
                    make_draggable(mark_clone);
                    make_droppable(mark_clone);
                }
                updateLocalStorage();
            }
        }
    });
    if (!isNaN(active_id)){
        replaceMarkerDetails(active_id);
    }
});
function make_draggable(item, id) {
    if (item.hasClass("temporary")) {
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
            let id = $(this).attr("id");
            let x = extNum(id);
            if ($(this).hasClass("marker")) {
                points[x].x = $(this).position().left;
                points[x].y = $(this).position().top;
                for (j = 0; j < lines.length; j++) {
                    if (lines[j].A === id) {
                        lines[j].x1 = $(this).position().left + 35;
                        lines[j].y1 = $(this).position().top + 35;
                    } else if (lines[j].B === id) {
                        lines[j].x2 = $(this).position().left + 35;
                        lines[j].y2 = $(this).position().top + 35;
                    }
                }
            } else if ($(this).hasClass("x2")) {
                if (lines[x].B.substr(0, 4) === "temp") {
                    lines[x].x2 = $(this).position().left + 8;
                    lines[x].y2 = $(this).position().top + 8;
                }
            } else {
                temporary[x].x = $(this).position().left;
                temporary[x].y = $(this).position().top;
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
                lines[x].x2 = left + 35;
                lines[x].y2 = top + 35;

            } else {
                if (item.hasClass("destination")) {
                    lines[line_nr] = new Lines(left, top, $(item).attr("id"), "tempB_" + line_nr, "destination", "route", false);
                    temporary[extNum(ui.draggable.attr("id"))].del = true;
                    updateLocalStorage()
                } else {
                    lines[line_nr] = new Lines(left, top, id, "tempB_" + line_nr, "route", "any", false);
                    temporary[extNum(ui.draggable.attr("id"))].del = true;
                    updateLocalStorage()
                }
                $(".x2.hidden").clone().appendTo("#div_constructor").css({
                    "top": top + 90,
                    "left": left + 90,
                    "position": "absolute"
                }).removeClass("hidden").addClass("temporary dragged " + lines[line_nr].typeA);
                $("#replace_line").clone().appendTo("#svg_constructor").attr(lines[line_nr].initial());
                make_draggable($(".temporary"), id);
            }
            points[extNum($(item).attr("id"))].line = true;
            ui.draggable.remove();
        }
    });
}
function remove_line(item) {
    let x = parseInt($(item).attr("id").substr(6, 7));
    lines[x].del = true;
    item.remove();
    $("#tempB_" + x).remove();
    updateLocalStorage();
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
function show_marker_details(item) {
    let html_block = ""
    $("#p_template").clone().appendTo("#markers_info").html(pointed_nr + " : " + points[pointed_nr].type + " -> <input type='text' id='" + points[pointed_nr].type + "_" + pointed_nr + "' value='marker&quot;s info'/>")
}
function remove_active_class() {
    $(".active").removeClass()
}
function random_code() {
    return Math.floor((Math.random() * 10000) + 99999);
}
function ShowMarkerDetails(e) {
    let target = $(e.target);
    if (target.is(".marker p")) {
        let div = target.closest("div");
        let x = extNum(div.attr("id"));
        replaceMarkerDetails(x);
    } else if (target.is("#svg_constructor")) {
        $("#markers_info").addClass("hidden");
        $(".marker").removeClass("active");
        updateLocalStorageActiveId("nan");

    }
}
function replaceMarkerDetails(x) {
    $(".marker").removeClass("active");
    $("#pointed_" + x).addClass("active");
    $(".connections_link").remove();
    $("#markers_info").removeClass("hidden");
    $("#marker_name").html(points[x].title);
    $("#marker_number").val(points[x].code);
    $("#marker_title").val(points[x].title);
    $("#marker_description").val(points[x].description);
    $("#save_it").attr({"onclick": "saveMarkerDetails(" + x + ")"});
    $("#remove_it").attr({"onclick": "removeMarker(" + x + ")"});
    updateLocalStorageActiveId(x);
    let con;
    let id = points[x].id;
    for (j = 0; j < lines.length; j++) {
        if (lines[j].del === false){
            if (lines[j].A === id) {
                con = $("#marker_connection").clone().appendTo("#marker_connections").attr({"id": "new_connections"});
                $("<a href='#'></a>").text(lines[j].B).appendTo('#new_connections').attr({"onclick": "replaceMarkerDetails(" + extNum(lines[j].B) + ")"});
                con.removeAttr("id").removeClass("hidden").addClass("connections_link");
            } else if (lines[j].B === id) {
                con = $("#marker_connection").clone().appendTo("#marker_connections").attr({"id": "new_connections"});
                $("<a href='#'></a>").text(lines[j].A).appendTo('#new_connections').attr({"onclick": "replaceMarkerDetails(" + extNum(lines[j].A) + ")"});
                con.removeAttr("id").removeClass("hidden").addClass("connections_link");
            }
        }
    }
}
function saveMarkerDetails(x) {
   points[x].code = $("#marker_number").val();
   points[x].title = $("#marker_title").val();
   points[x].description = $("#marker_description").val();
   console.log("details saved for item pointed_"+x);
   updateLocalStorage();
   return false;
}
function removeMarker(x) {
    let r = confirm("Are you sure want to delete this POINT ?");
    if (r === true){
        let id_str = [];
        for (j = 0; j < lines.length; j++) {
            if (lines[j].A === "pointed_" + x || lines[j].B === "pointed_" + x) {
                lines[j].del = true;
                id_str.push("#" + lines[j].id);
            }
        }
        $(id_str.join(",")).remove();
        $("#pointed_" + x).remove();
        points[x].del = true;
        console.log("removed point with id pointed_" + x);
    }
    updateLocalStorage();
    return false;
}
function updateLocalStorageActiveId(x) {
    active_id = x;
    localStorage.setItem("active_id", active_id);
}