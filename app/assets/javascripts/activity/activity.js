/**
 * @author gu jun
 */

$(function() {

	function initUploader() {
		var inputs = $(".gallery-thumbstrip input[type='file']");
		inputs.on('change', function(e) {
			var input = $(this),
				index = _.indexOf(inputs, input[0]);
			return handleFiles(index, input[0].files);
		});
	}

	function handleFiles(index, files) {
		var imageType = /image.*/,
			file = files[0];

		if (!file.type.match(imageType)) {
			console.log("File \"" + file.name + "\" is not a valid image file, Are you trying to screw me :( :( ");
			return false;
		}

		return uploadFile(index, file);
	}

	function uploadFile(index, file) {
		var formdata;
		if ( typeof FormData !== "undefined") {
			formdata = new FormData();
		} else {
			console.log("no FormData API");
			return false;
		}

		if ( typeof FileReader !== "undefined") {
			reader = new FileReader();
			reader.onload = function(e) {
				console.log("read.onload: ", e.target.result);
			};
			reader.readAsDataURL(file);

			formdata.append("photo", file);
			formdata.append("index", index);

			$.ajax({
				url: '/activities/upload',
				type: 'post',
				headers: {
					'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
				},
				data: formdata,
				xhr: function() {
					var myXhr = $.ajaxSettings.xhr();
					if (myXhr.upload) {
						myXhr.upload.addEventListener('progress', progressHandler, false);
					}
					return myXhr;
				},
				processData: false,
				contentType: false,
			}).done(function(data) {
				// TODO: fill this in
				var url = data.url,
					thumburl = data.thumburl,
					inputs = $(".gallery-thumbstrip input[type='file']"),
					input = inputs[index],
					image = $(".gallery-image");
				image.attr("src", url);
				
				console.log("upload done");
			}).fail(function() {
				// TODO: fill this in
				console.log("upload failed");
			});
		}
	}

	function progressHandler(e) {
		if (e.lengthComputable) {
			// $('progress').attr({value: e.loaded, max: e.total});
		}
	}

	initUploader();

});
