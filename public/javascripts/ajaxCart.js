function ttInputCounter() {
    blocks.ttInputCounter.find('.minus-btn, .plus-btn').on('click', function(e) {
        if (isProcessing) return;
        isProcessing = true;
        var $input = $(this)
            .parent()
            .find('input');
        var count = parseInt($input.val(), 10) + parseInt(e.currentTarget.className === 'plus-btn' ? 1 : -1, 10);
        if (count < 0) count = 0;
        if (count > 20) count = 20;
        $input.val(count).change();
        const id = $input.parents().attr('data-id');

        $.ajax({
            url: '/modify-cart',
            method: 'GET',
            data: { id: id, qty: count },
            success: data => {
                isProcessing = false;
                $('.box-cart').load(' .box-cart > *');
                $('.box-pricei' + id).load(' .box-pricei' + id + ' > *');
                $('.box-pricett').load(' .box-pricett > *');
            }
        });
    });
    blocks.ttInputCounter
        .find('input')
        .change(function() {
            var _ = $(this);
            var min = 1;
            var val = parseInt(_.val(), 10);
            var max = parseInt(_.attr('size'), 10);
            val = Math.min(val, max);
            val = Math.max(val, min);
            _.val(val);
        })
        .on('keypress', function(e) {
            let count = parseInt($(this).val(), 10);
            if (count < 0) count = 0;
            if (count > 20) count = 20;
            if (e.keyCode === 13) {
                e.preventDefault();
                const id = $(this)
                    .parents()
                    .attr('data-id');
                $.ajax({
                    url: '/modify-cart',
                    method: 'GET',
                    data: { id: id, qty: count },
                    success: data => {
                        $('.box-cart').load(' .box-cart > *');
                    }
                });
            }
        });
}