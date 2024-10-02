'use strict';

AFRAME.registerComponent('cursorlistener', {
    init: function() {
        this.el.addEventListener('click', () => {
            var data_type: string = this.el.getAttribute('data-type');

            switch (data_type) {
                case 'post':
                    console.log({
                        'action': 'reply',
                        'post_id': Number(this.el.getAttribute('data-id'))
                    });
                    break;
                case 'topic':
                    console.log({
                        'action': 'post',
                        'topic_id': Number(this.el.getAttribute('data-id')),
                        'topic_name': this.el.getAttribute('data-name')
                    })
                    break;
            }
        });
    }
});
