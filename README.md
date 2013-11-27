Background Scroll
=================
### About 
As opposed to parallax scrolling backgrounds, this plugin allows you to have background images that scroll with the natural flow of the page. 

[Demo](http://shane3.com/background-scroll/)

### How To Use
#### Scripts
Background Scroll depends on Modernizr, jQuery, and LazyLoad
```
<script src="modernizr.min.js"></script>
<script src="jquery-1.10.2-min.js"></script>
<script src="lazyload.js"></script>
<script src="jquery-bgScroll.js"></script>

```
#### Script Options
Change the default options as necessary to fit your html structure, etc.

```
defaults = {
    analytics: false,
    first_image: 'http://lorempixel.com/1500/723/nature/'
    first_section: 0,
    images: true,
    images_src: [
        'http://lorempixel.com/1500/723/nature/',
        'http://lorempixel.com/1500/723/abstract/', 
        'http://lorempixel.com/1500/723/sports/',
        'http://lorempixel.com/1500/723/nightlife/' 
    ],
    img_height: 723,
    img_width: 1500,
    spacer_height: 'auto',
    tag_name: 'section',
    wrap_div: '#wrapper',
};

```
Call the script

```
$('#wrapper').bgScroll({
    tag_name: 'div.section'
});

```

#### HTML
Here's a basic page setup
```
<img src="loading.gif" id="loader" alt="Loading" />
<div id="wrapper">
    <section>
        <p class="content">Lorem ipsum dolor, sed amet num agricula.</p>
    </section>
    <section>
        <p class="content">Lorem ipsum dolor, sed amet num agricula.</p>
    </section>
</div><!-- end #wrapper -->

```
#### CSS
Style the html 
```
#wrapper{ max-width:100%; margin-left:0; visibility:hidden;}
#loader{ display:block; position:fixed; top:50%; left:50%; margin-left:-45px; margin-top:-45px; }
.container{ position:relative; }
.top-spacer{ height:300px; }
.bottom-spacer{ height:0; }
.marker{ height:1px; }
section{ position:relative;overflow:hidden; }
.content-block{ max-width:1250px; position:relative; margin:0 auto; } 
.bg_wrap{ width:100%; top:0; left:0; z-index:-1; overflow:hidden; }
.bg{ position:relative; top:0;  z-index:-1;  display:block; }
.content{ width:400px; background:white; font-size:25px; line-height:40px; padding:20px; }
/************************************************************************** 
 *
 * Backgrounds - set Z-Index 
 *
 *************************************************************************/ 
#bg_0{ z-index:-1; background:transparent no-repeat; }
#bg_1{  z-index:-2; background:transparent no-repeat; }
#bg_2{  z-index:-3; background:transparent no-repeat; }
#bg_3{  z-index:-4; background:transparent no-repeat; }
#bg_4{  z-index:-5; background:transparent no-repeat;  }

```
