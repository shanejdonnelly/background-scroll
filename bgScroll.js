;(function ( $, window, document, undefined ) {

		// Create the defaults once
		var 
            pluginName = "bgScroll",
			defaults = {

                    wrap_div: '#wrapper',
                    first_section: 0,
                    spacer_height: 'auto',
                    images: true,
                    images_src: [
                        'http://lorempixel.com/1500/723/nature/',
                            'http://lorempixel.com/1500/723/abstract/', 
                                'http://lorempixel.com/1500/723/sports/',
                                    'http://lorempixel.com/1500/723/nightlife/' 
                    ],
                    tag_name: 'section',
                    analytics: false,
                    img_height: 723,
                    img_width: 1500,
				    first_image:                         'http://lorempixel.com/1500/723/nature/'
                };

                // The actual plugin constructor
                function Plugin ( element, options ) {
                    this.element = element;
                    this.settings = $.extend( {}, defaults, options );
                    this._defaults = defaults;
                    this._name = pluginName; 
                    this.init(this.settings.first_image, this.settings.first_section);
                }

                Plugin.prototype = {
                    init: function (first_image, current_section) {
                        var 
                        base = this, $wrap = $(this.settings.wrap_div);

                        $wrap.css('visibility', 'hidden');
                        //DOM Manipulation
                        //adding bg_wraps, etc

                        $(this.settings.tag_name).each(function(index){
                            var 
                            $bg_wrap = $('<div class="bg_wrap" id="bg_wrap_'+ index +'" style="width:100%; top:0; left:0; z-index:'+ ((index+1) * -1) +'; overflow:hidden;">'),
                            $img = $('<img src="'+ base.settings.images_src[index] +'" class="bg" id="bg_'+ index +'" style="position:relative; z-index:'+ ((index+1) * -1) +';  display:block;"/>'),
                            $top_spacer = $('<div class="top-spacer"></div>'),
                            $top_marker = $('<div class="marker top-marker">&nbsp;</div>'),
                            $bottom_spacer = $('<div class="bottom-spacer" style="height:1px;"></div>'),
                            $bottom_marker = $('<div class="marker bottom-marker" style="height:1px;">&nbsp;</div>');

                            //wrap all in supawrap - or give the this.element those responsibilities
                            //
                            //add top and bottom spacers
                            $(this).prepend($top_marker).prepend($top_spacer);
                            $(this).append($bottom_marker).append($bottom_spacer);
                            //put image into .bg_wrap
                            $bg_wrap.append($img);
                            $(this).after($bg_wrap);
                        });
                        //

                        this.cacheElements(); 
                        this.current_section = parseInt(current_section);
                        this.prev_section = (this.current_section !== 0) ? (this.current_section - 1) : this.current_section ; 
                        this.next_section = this.current_section + 1;
                        this.$current_section = $(this.settings.tag_name).eq(this.current_section);

                        //set up initial background image
                        $('<img/>').attr('src', first_image).load(function() {
                            $(this).remove(); // prevent memory leaks as suggested on Stackoverflow

                            base.$bg_images.eq(base.current_section).css('position', 'fixed');
                            base.$bg_images.eq(base.next_section).css('position', 'fixed');               

                            //get all DOM bits sized to window
                            base.sizeStuff(); 



                            //now that images are loading, show, but give a second to find height of product images so page doesn't jump much
                            setTimeout(function(){ 
                                //defeat Chrome refresh auto scroll
                                if(base.current_section == 0){ 
                                    window.scrollTo(0,0) 
                                }
                                else{
                                    var cur_top = base.$sections.eq(base.current_section).offset().top; 
                                    $('html,body').animate({scrollTop: cur_top + (base.win_height * 0.8)}, 50);
                                }

                                $wrap.css('visibility', 'visible'); 
                                $('#loader').hide(); 

                                //bind all events now, so we're not trying to findSection while moving to current_section
                                base.events();
                                base.start_scroll_pos = base.$window.scrollTop();
                                base.scroll_pos; 

                                //good place to call analytics...
                                if(base.settings.analytics){ base.trackPageview(); }
                                
                            },1500);               
                        }); 

                    },

                    cacheElements: function(){
                        this.$window = $(window);
                        this.$bg_wraps = $('.bg_wrap');
                        this.$bg_images = $('.bg');
                        this.$top_spacers = $('.top-spacer');
                        this.$bottom_spacers = $('.bottom-spacer');
                        this.$sections = $(this.settings.tag_name); 

                        this.win_height = this.$window.height();
                        this.win_width = this.$window.width();
                    },

                    changeSection: function(direction){ 
                        var 
                        $visible_bg = this.$bg_images.eq(this.current_section).add(this.$bg_images.eq(this.prev_section)).add(this.$bg_images.eq(this.next_section)),
                        $visible_section = this.$sections.eq(this.current_section).add(this.$sections.eq(this.prev_section)).add(this.$sections.eq(this.next_section)),
                        $invisible_bg = this.$bg_images.not($visible_bg),
                        $invisible_section = this.$sections.not($visible_section);

                        if(direction === 'down'){ 
                            this.$current_section = this.$sections.eq(this.current_section);
                            $visible_bg.css('visibility', 'visible');
                            $visible_section.css('visibility', 'visible'); 

                            //first set all bg images to relative
                            this.$bg_images.eq(this.current_section).css('position', 'fixed');
                            this.$bg_images.eq(this.prev_section).css('position', 'relative');
                            this.$bg_images.eq(this.next_section).css('position', 'fixed');

                            $invisible_bg.css('visibility', 'hidden');
                            $invisible_section.css('visibility', 'hidden');

                        }
                        else{ //direction === 'up'

                            this.$current_section = this.$sections.eq(this.current_section);
                            $visible_bg.css('visibility', 'visible');
                            $visible_section.css('visibility', 'visible');

                            this.$bg_images.eq(this.current_section).css({ 'position':'fixed' });
                            this.$bg_images.eq(this.next_section);

                            $invisible_bg.css('visibility', 'hidden');
                            $invisible_section.css('visibility', 'hidden');

                        }

                        //track page view...  
                        if(this.settings.analytics){ base.trackPageview(); }
                    },

                    findCurrentSection: function(direction){
                        var $section = $(this.settings.tag_name + ':in-viewport'),
                        cur_section = this.$sections.index($section),
                        base = this;

                        if(this.current_section !== cur_section && cur_section !== -1){

                            this.current_section = cur_section;
                            this.next_section = cur_section + 1;
                            this.prev_section = cur_section - 1; 

                            this.changeSection(direction);
                        }

                    },

                    events: function(){
                        var base = this;

                        //RESIZE
                        this.$window.on('resize', function(){ base.sizeStuff();});

                        //SCROLL
                        this.$window.on('scroll', onScroll); 

                        //TOUCH
                        this.$window.on('touchmove', onScroll);

                        //CLICKS
                        $('#scroll-down-btn').on('click', function(){
                            var next_top = base.$sections.eq(base.next_section).offset().top;

                            if(Modernizr.touch){ $('body').animate({scrollTop: next_top + (base.win_height * 0.9)}, 50); }
                            else{
                                $('html, body').animate({scrollTop: next_top + (base.win_height * 0.9)}, 1750);
                            }

                        });

                        function onScroll(){
                            base.scroll_pos = base.$window.scrollTop();
                            //CHANGING BGS
                            if(base.scrollingDown()){
                                if(!base.$current_section.find('.bottom-marker').is(":in-viewport") && (base.current_section < base.$sections.length -1)){
                                    base.findCurrentSection('down');
                                }
                            }
                            else{ //scrollingUp
                                if(!base.$current_section.find('.top-spacer').is(":in-viewport") && (base.current_section > 0)){
                                    base.findCurrentSection('up');
                                }
                            } 

                        }
                    },

                    scrollingDown: function(){
                        var 
                        current_scroll_pos = this.scroll_pos,
                        scrollingDirection = current_scroll_pos > this.start_scroll_pos ? true : false;

                        this.start_scroll_pos = current_scroll_pos;
                        return scrollingDirection;
                    },

                    sizeStuff: function(){ 
                        var base = this, 
                        img_height = this.settings.img_height,
                        img_width = this.settings.img_width,
                        window_width = base.$window.width(),
                        window_height = base.$window.height(),
                        spacer_height = this.settings.spacer_height !== 'auto' ? this.settings.spacer_height : this.win_height,
                        width_ratio = window_width/img_width,
                        height_ratio = window_height/img_height,
                        temp_height = 0,
                        temp_width = 0;

                        this.win_height = window_height;
                        this.win_width = window_width;

                        this.$top_spacers.height(spacer_height);

                        this.$bg_wraps.height(this.win_height);

                        this.$bg_images.css('height',window_height);
                        temp_width = img_width * height_ratio;
                        this.$bg_images.css('width',temp_width);

                        left = (temp_width - window_width)/2;
                        this.$bg_images.css('left','-'+ left + 'px');

                    },

                    trackPageView: function(){ 
                        _gaq.push(['_trackPageview', this.current_chapter + '/' + this.current_section]); 
                    }

                };

                // A really lightweight plugin wrapper around the constructor,
                // preventing against multiple instantiations
                $.fn[ pluginName ] = function ( options ) {
                    return this.each(function() {
                        if ( !$.data( this, "plugin_" + pluginName ) ) {
                            $.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
                        }
                    });
                };

})( jQuery, window, document );
