/** global: Craft */
/** global: Garnish */
/**
 * Base Element Index View
 */
Craft.ElementThumbLoader = Garnish.Base.extend(
    {
        queue: null,
        workers: [],

        init: function() {
            this.queue = [];

            for (var i = 0; i < 3; i++) {
                this.workers.push(new Craft.ElementThumbLoader.Worker(this));
            }
        },

        load: function($elements) {
            // Only immediately load the visible images
            let $thumbs = $elements.find('.elementthumb');
            for (let i = 0; i < $thumbs.length; i++) {
                let $thumb = $thumbs.eq(i);
                let $scrollParent = $thumb.scrollParent();
                if (this.isVisible($thumb, $scrollParent)) {
                    this.addToQueue($thumb[0]);
                } else {
                    let rand = Math.floor(Math.random() * 1000000);
                    $scrollParent.on(`scroll.${rand}`, {
                        $thumb: $thumb,
                        $scrollParent: $scrollParent,
                        rand: rand,
                    }, (ev) => {
                        if (this.isVisible(ev.data.$thumb, ev.data.$scrollParent)) {
                            $scrollParent.off(`scroll.${ev.data.rand}`);
                            this.addToQueue(ev.data.$thumb[0]);
                        }
                    });
                }
            }
        },

        addToQueue: function(thumb) {
            this.queue.push(thumb);

            // See if there are any inactive workers
            for (var i = 0; i < this.workers.length; i++) {
                if (!this.workers[i].active) {
                    this.workers[i].loadNext();
                }
            }
        },

        isVisible: function($thumb, $scrollParent) {
            let thumbOffset = $thumb.offset().top;
            let scrollParentOffset, scrollParentHeight;
            if ($scrollParent[0] === document) {
                scrollParentOffset = $scrollParent.scrollTop();
                scrollParentHeight = Garnish.$win.height();
            } else {
                scrollParentOffset = $scrollParent.offset().top;
                scrollParentHeight = $scrollParent.height();
            }
            return thumbOffset > scrollParentOffset && thumbOffset < scrollParentOffset + scrollParentHeight + 1000;
        },

        destroy: function() {
            for (var i = 0; i < this.workers.length; i++) {
                this.workers[i].destroy();
            }

            this.base();
        }
    }
);

Craft.ElementThumbLoader.Worker = Garnish.Base.extend(
    {
        loader: null,
        active: false,

        init: function(loader) {
            this.loader = loader;
        },

        loadNext: function() {
            var container = this.loader.queue.shift();
            if (typeof container === 'undefined') {
                this.active = false;
                return;
            }

            this.active = true;
            var $container = $(container);
            if ($container.find('img').length) {
                this.loadNext();
                return;
            }
            var $img = $('<img/>', {
                sizes: $container.attr('data-sizes'),
                srcset: $container.attr('data-srcset'),
                alt: ''
            });
            this.addListener($img, 'load,error', 'loadNext');
            $img.appendTo($container);
            picturefill({
                elements: [$img[0]]
            });
        }
    }
);
