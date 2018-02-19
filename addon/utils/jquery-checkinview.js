import Ember from 'ember';

const { $ } = Ember;

function checkInView() {
    if ($.fn.checkInView) { return; }

    $.fn.checkInView = function(partial = false) {
        const elem = this;

        if (!elem.length) { return false; }

        const container = elem.parent();
        const contHeight = container.height();
        const contTop = container.scrollTop();
        const contBottom = contTop + contHeight;

        const elemTop = elem.offset().top - container.offset().top;
        const elemBottom = elemTop + elem.height();

        const isTotal = elemTop >= 0 && elemBottom <= contHeight;
        const isPart = (elemTop < 0 && elemBottom > 0 || elemTop > 0 && elemTop <= container.height()) && partial;

        return isTotal || isPart;
    };
}

export { checkInView };
