
$(document).on('click', '.panel div.clickable', function (e) {
    var $this = $(this);
    if (!$this.hasClass('panel-collapsed')) {
        $this.parents('.panel').find('.panel-body').slideUp();
        $this.addClass('panel-collapsed');
        $this.find('i').removeClass('glyphicon-minus').addClass('glyphicon-plus');
    } else {
        $this.parents('.panel').find('.panel-body').slideDown();
        $this.removeClass('panel-collapsed');
        $this.find('i').removeClass('glyphicon-plus').addClass('glyphicon-minus');
    }
});


$(document).ready(function () {
    $('.panel-heading span.clickable').click();
    $('.panel div.clickable').click();
});

/*
$(document).on('click', "a[name='facetValue']", function (e) {
	var $this = $(this);
		console.log($this.parent().parent().parent());
		$this.removeAttr('ng-click');
});

$("a[name='facetValue']").click(function(e) {
    e.preventDefault();
  console.log("CLICKED");
});
*/