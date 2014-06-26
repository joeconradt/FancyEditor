var zoom = 1;
var activeFancyBox = null;
var templates = {};

$(document).ready(function() {
	positionFrames();

	// TODO zoom to optimum size
	pageZoom(-0.3);

	$(window).resize(function() {
		positionFrames();
	});

	$(".js-in").click(function() {
		pageZoom(0.1);
	});

	$(".js-out").click(function() {
		pageZoom(-0.1);
	});

	$(".js-toggle-border").click(function() {
		$(".fancy-box").css("border", "1px dashed #FFA1A1");
	});

	$(".js-add").click(function() {
		$("#new-box-modal").foundation("reveal", "open");
	});

	// fancy box stuff
	$(".fancy-box").hover(function() {
		
	});
	$(".fancy-box").mouseout(function() {
		// $(this).find(".options").remove();
		// $(this).removeClass("active");
	});
	$(".fancy-box").click(function() {
		changeActiveBox($(this));
	});

	// options editor
	$(".option-editor input[type=submit]").click(function() {
		activeFancyBox.html($(this).parent().find("textarea[name=content]").val());
		$(".fancy-box").removeClass("active");
	});

	// forms
	$("form").submit(function() {
		if($(this).attr("close-target").length) {
			$($(this).attr("close-target")).foundation("reveal", "close");
		}
	});

	

	$("#new-box-form").submit(function(e) {
		e.preventDefault();

		var width = $(this).find("select[name=width]").val();
		var type  = $(this).find("select[name=type]").val();
		

		
	});

	// tabs
	$(".js-tab .tab").click(function() {
		$(".js-tab .tab").addClass("secondary");
		$(this).removeClass("secondary");

		$(".js-tab .tab-content").hide();
		$($(this).attr("data-target")).show();
	});
});

function positionFrames() {
	$("#preview-area").height($(window).height());
}
function pageZoom(_zoom) {
	zoom += _zoom;
	$("#page").css('zoom', (zoom * 100) + "%");
}
function changeActiveBox(box) {
	// remove active from any fancy box 
	$(".fancy-box").removeClass("active");
	box.addClass("active");
	activeFancyBox = $(this);
	$(".fancy-box .options").remove();
	box.append("<div class='options'></options>");
}
function createBoxFormModal(type) {
	$.get("type/" + type + "/form.html", function(data) {
		console.log(data);
		$(".js-modal-form").html(data);
		formListen();
	});
	$("#new-box-modal").foundation("reveal", "open");

}
function formListen()
{
	$("form.option-form").submit(function(e) {
		e.preventDefault();

		var options = {};
		$(this).find(".option-control").each(function() {
			var value = $(this).val();
			var key = $(this).attr("name");
			options[key] = value;
		});

		if(options['type'] == undefined) {
			alert("Error: box type missing from form.");
		} else {

			// load template
			$.get("type/" + options['type'] + "/template.html", function(data) {
				templates[options['type']] = data;

				for(var property in options) {
					data = data.replace("{{" + property + "}}", options[property]);
				}

				$("#page").append(data);

				// add event to new fancy box
				$(".fancy-box").click(function() {
					changeActiveBox($(this));
				});
			});

		}

	});
}