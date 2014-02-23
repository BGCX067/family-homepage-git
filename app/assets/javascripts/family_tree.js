function family() {
	this.init = function(data) {
		this.data = data;
	};
	
	var member_width = 94; // self width: 80, padding: 8 * 2, border: 1 * 2, margin: 0 * 2
	var total_width = 500;
	
	var line_member_template = 
		"<div class='line-member'>" +
			"<div class='lines'>#{lines}</div>" + 
			"<div class='members'>#{members}</div>" +
		"</div>";
	
	this.html = function() {
		if (!this.data) {
			return;
		}
		var l = this.data.family_lines.length;
		var span_width = (total_width - l * member_width) / (l + 1);
		var centers;
		var html;
		this.data.family_lines.map(function(line, index) {
			centers = [];
			// for member relationship curves
			var lines = line.map(function() {
				
			}).join();
			// for member display
			var members = line.map(function() {
				
			}).join();
			return line_member_template.replace(/#{lines}/, lines).replace(/#{members}/, members);
		}).join();
	};
}

$(function() {
	var f = new family();
	f.init(family_data);
	var html = f.html();
	$("#family").append(html);
});

var family_data = {
	family_lines: [
		{
			members: [
				{
					name: "顾建华"
				},
				{
					name: "张巧英"
				},
				{
					name: "郑栋成"
				},
				{
					name: "陈建球"
				}
			]
		},
		{
			members: [
				{
					name: "顾俊",
					parent: [1, 2]
				},
				{
					name: "郑艳花",
					parent: [3, 4]
				}
			]
		},
		{
			members: [
				{
					name: "顾伊冉",
					parent: [1, 2]
				},
				{
					name: "？",
					parent: [1, 2]
				}
			]
		}
	]
};
