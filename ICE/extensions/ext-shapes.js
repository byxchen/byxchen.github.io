/*
 * ext-shapes.js
 *
 * Licensed under the Apache License, Version 2
 *
 * Copyright(c) 2010 Christian Tzurcanu
 * Copyright(c) 2010 Alexis Deveria
 *
 */

methodDraw.addExtension("shapes", function() {


  var current_d, cur_shape_id;
  var canv = methodDraw.canvas;
  var cur_shape;
  var start_x, start_y;
  var svgroot = canv.getRootElem();
  var lastBBox = {};

  // This populates the category list
  var categories = {
    basic: '[a-z]',
    symbols: 'Symbols',
    greek: 'Greek',
    numerical: '[0-9]+-()',
//    arrow: 'Arrows',
//    flowchart: 'Flowchart',
//    nature: 'Nature',
//    game: 'Cards & Chess',
//    dialog_balloon: 'Dialog balloons',
//    music: 'Music',
//    weather: 'Weather &amp; Time',
//    ui: 'User Interface',
//    social: 'Social Web'
  };

  var library = {
    'basic': {
      data: {
        "a": "a,N,250,75,225", //**MDP char, Resizeable, height, x, y
        "b": "b,N,250,75,225",
        "c": "c,N,250,75,225",
        "d": "d,N,250,75,225",
        "e": "e,N,250,75,225",
        "f": "f,N,250,75,225",
        "g": "g,N,250,75,225",
        "h": "h,N,250,75,225",
        "i": "i,N,250,75,225",
        "j": "j,N,250,75,225",
        "k": "k,N,250,75,225",
        "l": "l,N,250,75,225",
        "m": "m,N,250,75,225",
        "n": "n,N,250,75,225",
        "o": "o,N,250,75,225",
        "p": "p,N,250,75,225",
        "q": "q,N,250,75,225",
        "r": "r,N,250,75,225",
        "s": "s,N,250,75,225",
        "t": "t,N,250,75,225",
        "u": "u,N,250,75,225",
        "v": "v,N,250,75,225",
        "w": "w,N,250,75,225",
        "x": "x,N,250,75,225",
        "y": "y,N,250,75,225",
        "z": "z,N,250,75,225",
        "+": "\u21e6,N,250,75,225",
        "-": "\u21e7,N,250,75,225",
        "=": "\u21e8,N,250,75,225",
        ".": "\u21e9,N,250,75,225",
        "U": "\u238c,N,250,75,225",


      },
      buttons: []
    },
    'symbols': {
      data: {
        "i40": "\u2200,R,300,10,300", //**MDP char, Resizeable, height, x, y
        "i42": "\u2202,R,300,10,300",
        "i43": "\u2203,R,300,10,300",
        "i44": "\u2204,R,300,10,300",
        "i45": "\u2205,R,300,10,300",
        "i46": "\u2206,R,300,10,300", //**MDP char, Resizeable, height, x, y
        "i47": "\u2207,R,300,10,300",
        "i48": "\u2208,R,300,10,300",
        "i49": "\u2209,R,300,10,300",
        "i50": "\u220A,R,300,10,300",
        "i51": "\u220B,R,300,10,300",
        "i52": "\u220C,R,300,10,300", //**MDP char, Resizeable, height, x, y
        "i53": "\u220D,R,300,10,300",
        "i55": "\u220F,R,200,10,200",
        "i56": "\u2210,R,200,10,200",
        "i57": "\u2211,R,200,10,200",
        "i58": "\u2212,R,300,10,300", //**MDP char, Resizeable, height, x, y
        "i59": "\u2213,R,300,10,300",
        "i60": "\u2214,R,300,10,300",
        "i61": "\u2229,R,300,10,300",
        "i62": "\u222A,R,300,10,300",
        "i63": "\u222B,R,200,10,200",
        "i64": "\u2218,R,300,10,300", //**MDP char, Resizeable, height, x, y
        "i65": "\u2219,R,300,10,300",
        "i66": "\u221A,R,300,10,300",
        "i67": "\u221B,R,300,10,300",
        "i68": "\u221C,R,300,10,300",
        "i69": "\u221D,R,300,10,300",
        "i70": "\u221E,R,300,10,300",
        "i71": "\u221F,R,300,10,300",
        "i72": "\u2220,R,300,10,300", //**MDP char, Resizeable, height, x, y
        "i73": "\u2221,R,300,10,300",
        "i74": "\u2222,R,300,10,300",
        "i75": "\u2223,R,300,10,300",
        "i76": "\u2224,R,300,10,300",
        "i77": "\u2225,R,300,10,300"

      },
      buttons: []
    },
    'greek': {
      data: {
        "alpha": "\u03B1,R,300,10,300", //**MDP char, Resizeable, height, x, y
        "beta": "\u03B2,R,300,10,300",
        "gamma": "\u03B3,R,300,10,300",
        "delta": "\u03B4,R,300,10,300",
        "epsilon": "\u03B5,R,300,10,300", //**MDP char, Resizeable, height, x, y
        "zeta": "\u03B6,R,300,10,300",
        "eta": "\u03B7,R,300,10,300",
        "theta": "\u03B8,R,300,10,300",
        "iota": "\u03B9,R,300,10,300", //**MDP char, Resizeable, height, x, y
        "kappa": "\u03Ba,R,300,10,300",
        "lamda": "\u03Bb,R,300,10,300",
        "mu": "\u03Bc,R,300,10,300",
        "nu": "\u03Bd,R,300,10,300", //**MDP char, Resizeable, height, x, y
        "xi": "\u03Be,R,300,10,300",
        "omicron": "\u03Bf,R,300,10,300",
        "pi": "\u03c0,R,300,10,300",
        "rho": "\u03c1,R,300,10,300",
        "sigma": "\u03c3,R,300,10,300", //**MDP char, Resizeable, height, x, y
        "tau": "\u03c4,R,300,10,300",
        "upsilon": "\u03c5,R,300,10,300",
        "phi": "\u03c6,R,300,10,300",
        "chi": "\u03c7,R,300,10,300", //**MDP char, Resizeable, height, x, y
        "psi": "\u03c8,R,300,10,300",
        "omega": "\u03c9,R,300,10,300",

      },
      buttons: []
    },
    'numerical': {
      data: {
        "0": "0,N,250,75,225", //**MDP char, Resizeable, height, x, y
        "1": "1,N,250,75,225",
        "2": "2,N,250,75,225",
        "3": "3,N,250,75,225",
        "4": "4,N,250,75,225",
        "5": "5,N,250,75,225",
        "6": "6,N,250,75,225",
        "7": "7,N,250,75,225",
        "8": "8,N,250,75,225",
        "9": "9,N,250,75,225",
        "0": "0,N,250,75,225",
        "+": "+,N,250,75,225",
        "-": "-,N,250,75,225",
        ".": ".,N,250,75,225",
        "(": "(,N,250,75,225",
        ")": "),N,250,75,225",
        "[": "[,N,250,75,225",
        "]": "],N,250,75,225",

      },
      buttons: []
    },
  };

  var cur_lib = library.basic;

  var mode_id = 'shapelib';

  function loadIcons() {
    $('#shape_buttons').empty();

    // Show lib ones
    $('#shape_buttons').append(cur_lib.buttons);
  }

  function loadLibrary(cat_id) {

    var lib = library[cat_id];

    // if(!lib) {
    //   $('#shape_buttons').html('Loading...');
    //   $.getJSON('extensions/shapelib/' + cat_id + '.json', function(result, textStatus) {
    //     cur_lib = library[cat_id] = {
    //       data: result.data,
    //       size: result.size,
    //       fill: result.fill
    //     }
    //     makeButtons(cat_id, result);
    //     loadIcons();
    //   });
    //   return;
    // }

    cur_lib = lib;
    if(!lib.buttons.length) makeButtons(cat_id, lib);
    loadIcons();
  }

  function makeButtons(cat, shapes) {
    var size = cur_lib.size || 300;
    var fill = cur_lib.fill || false;
    var off = size * .05;
    var vb = [-off, -off, size + off*2, size + off*2].join(' ');
    var stroke = fill ? 0: (size/30);

    //  var shape_icon = new DOMParser().parseFromString(
    //    '<svg xmlns="http://www.w3.org/2000/svg"><svg viewBox="' + vb + '"><path fill="#333" stroke="transparent" stroke-width="' + stroke + '" /><\/svg><\/svg>',
    //    'text/xml');

     var shape_icon = new DOMParser().parseFromString(
       '<svg xmlns="http://www.w3.org/2000/svg"><svg viewBox="' + vb + '"><text id="mb" font-family="monospace" font-size="300" y="300" x="20" fill-opacity="null" stroke-opacity="null" stroke-width="0" stroke="#000" fill="#000000">O</text><\/svg><\/svg>',
       'text/xml');

    var width = 40;
    var height = 40;
    shape_icon.documentElement.setAttribute('width', width);
    shape_icon.documentElement.setAttribute('height', height);
    var svg_elem = $(document.importNode(shape_icon.documentElement,true));

    //alert(shape_icon.getElementById('mb').textContent); //**MDP

    var data = shapes.data;

    cur_lib.buttons = [];

    for(var id in data) {
      var path_d = data[id];
      var icon = svg_elem.clone();
      var char_d = data[id].split(",");
      //icon.find('path').attr('d', path_d); //**MDP
      icon.find('text').text(char_d[0]); //**MDP
      icon.find('text').attr('font-size', char_d[2]); //**MDP
      icon.find('text').attr('x', char_d[3]); //**MDP
      icon.find('text').attr('y', char_d[4]); //**MDP

      var icon_btn = icon.wrap('<div class="tool_button">').parent().attr({
        id: mode_id + '_' + id,
        title: id
      });

      icon_btn[0].mathchar = id;
      icon_btn[0].mathdata = path_d;

      // Store for later use
      cur_lib.buttons.push(icon_btn[0]);
    }

  }


  return {
    svgicons: "extensions/ext-shapes.xml",
    buttons: [{
      id: "tool_shapelib",
      type: "mode_flyout", // _flyout
      position:       3,
      title: "Shape library",
      icon: "extensions/ext-shapes.png",
      events: {
        "click": function() {
          $('.tools_flyout').show(); //**MDP avoids delay in panel appearing
          //canv.setMode(mode_id); //**MDP
          //lert("hello");
          //canv.setMode('select'); //
        }
      }
    }],
    callback: function() {
      $('.tools_flyout').hide();
      $("#tools_shapelib").hide();
      $("#tools_mathlib").hide();

      var btn_div = $('<div id="shape_buttons">');
      $('#tools_shapelib > *').wrapAll(btn_div);

      var shower = $('#tools_shapelib_show');


      loadLibrary('basic');

      // Do mouseup on parent element rather than each button
      $('#shape_buttons').mouseup(function(evt) {
        var btn = $(evt.target).closest('div.tool_button');

        if(!btn.length) return;

        var copy = btn.children().clone().attr({width: 24, height: 24});
        //shower.children(':not(.flyout_arrow_horiz)').remove();
        //shower
        //  .append(copy)
        //  .attr('data-curopt', '#' + btn[0].id) // This sets the current mode
        //  .mouseup();
        //canv.setMode(mode_id);

        cur_shape_id = btn[0].id.substr((mode_id+'_').length);
        current_d = cur_lib.data[cur_shape_id];
        //alert(cur_shape_id);
   		//alert(btn[0].data);
      //alert(cur_lib.id);
      //alert(btn[0].mathdata);
      canv.keyPressed(btn[0].mathdata.charAt(0));
    //  methodDraw.clickSelect();
    //  canv.setMode('select');
      document.getElementById("tool_select").click();


//        $('.tools_flyout').fadeOut();
        $('.tools_flyout').hide();
        //methodDraw.clickSelect();

      //canv.setMode('select');
      });

//
      var shape_cats = $('<div id="shape_cats">');
      var cat_str = '';

      $.each(categories, function(id, label) {
        cat_str += '<div data-cat=' + id + '>' + label + '</div>';
      });

      shape_cats.html(cat_str).children().bind('mouseup', function() {
        var catlink = $(this);
        catlink.siblings().removeClass('current');
        catlink.addClass('current');

        loadLibrary(catlink.attr('data-cat'));
        // Get stuff

        return false;
      });

      shape_cats.children().eq(0).addClass('current');

      $('#tools_shapelib').prepend(shape_cats);

      shower.mouseup(function() {
    //    canv.setMode(current_d ? mode_id : 'select');
    //    canv.setMode('select'); //**MDP
    //    mathodDraw.clickSelect();
      });


      $('#tool_shapelib').remove();

      var h = $('#tools_shapelib').height();
      $('#tools_shapelib').css({
        'margin-top': -(h/2)+75,
        'margin-left': 3
      });


    },
     mouseDown: function(opts) {
//       var mode = canv.getMode();
//       if(mode !== mode_id) return;
//
//       var e = opts.event;
//       var x = start_x = opts.start_x;
//       var y = start_y = opts.start_y;
//       var cur_style = canv.getStyle();
//
//       cur_shape = canv.addSvgElementFromJson({
//         "element": "path",
//         "curStyles": true,
//         "attr": {
//           "d": current_d,
//           "id": canv.getNextId(),
//           "opacity": cur_style.opacity / 2,
//           "style": "pointer-events:none"
//         }
//       });
//       cur_shape.setAttribute("d", current_d);
//       // Make sure shape uses absolute values
//       if(/[a-z]/.test(current_d)) {
//         current_d = cur_lib.data[cur_shape_id] = canv.pathActions.convertPath(cur_shape);
//         cur_shape.setAttribute('d', current_d);
//         canv.pathActions.fixEnd(cur_shape);
//       }
//
//       cur_shape.setAttribute('transform', "translate(" + x + "," + y + ") scale(0.005) translate(" + -x + "," + -y + ")");
// //      console.time('b');
//       canv.recalculateDimensions(cur_shape);
//       var tlist = canv.getTransformList(cur_shape);
//       lastBBox = cur_shape.getBBox();
//       totalScale = {
//         sx: 1,
//         sy: 1
//       };
//       return {
//         started: true
//       }
//       // current_d
//     },
//     mouseMove: function(opts) {
//       var mode = canv.getMode();
//       if(mode !== mode_id) return;
//
//       var zoom = canv.getZoom();
//       var evt = opts.event
//
//       var x = opts.mouse_x/zoom;
//       var y = opts.mouse_y/zoom;
//
//       var tlist = canv.getTransformList(cur_shape),
//         box = cur_shape.getBBox(),
//         left = box.x, top = box.y, width = box.width,
//         height = box.height;
//       var dx = (x-start_x), dy = (y-start_y);
//
//       var newbox = {
//         'x': Math.min(start_x,x),
//         'y': Math.min(start_y,y),
//         'width': Math.abs(x-start_x),
//         'height': Math.abs(y-start_y)
//       };
//
//       var ts = null,
//         tx = 0, ty = 0,
//         sy = height ? (height+dy)/height : 1,
//         sx = width ? (width+dx)/width : 1;
//
//       var sx = newbox.width / lastBBox.width;
//       var sy = newbox.height / lastBBox.height;
//
//       sx = sx || 1;
//       sy = sy || 1;
//
//       // Not perfect, but mostly works...
//
//       if(x < start_x) {
//         tx = lastBBox.width;
//       }
//       if(y < start_y) ty = lastBBox.height;
//
//       // update the transform list with translate,scale,translate
//       var translateOrigin = svgroot.createSVGTransform(),
//         scale = svgroot.createSVGTransform(),
//         translateBack = svgroot.createSVGTransform();
//
//       translateOrigin.setTranslate(-(left+tx), -(top+ty));
//       if(evt.shiftKey) {
//         replaced = true
//         var max = Math.min(Math.abs(sx), Math.abs(sy));
//         sx = max * (sx < 0 ? -1 : 1);
//         sy = max * (sy < 0 ? -1 : 1);
//         if (totalScale.sx != totalScale.sy) {
//           var multiplierX = (totalScale.sx > totalScale.sy) ? 1 : totalScale.sx/totalScale.sy;
//           var multiplierY = (totalScale.sy > totalScale.sx) ? 1 : totalScale.sy/totalScale.sx;
//           sx *= multiplierY
//           sy *= multiplierX
//         }
//       }
//       totalScale.sx *= sx;
//       totalScale.sy *= sy;
//       scale.setScale(sx,sy);
//       translateBack.setTranslate(left+tx, top+ty);
//       var N = tlist.numberOfItems;
//       tlist.appendItem(translateBack);
//       tlist.appendItem(scale);
//       tlist.appendItem(translateOrigin);
//
//       canv.recalculateDimensions(cur_shape);
//       lastBBox = cur_shape.getBBox();
    //      canv.setMode("select")
     },
     mouseUp: function(opts) {
    //   var mode = canv.getMode();
    //   if(mode !== mode_id) return;
    //
    //   if(opts.mouse_x == start_x && opts.mouse_y == start_y) {
    //     return {
    //       keep: false,
    //       element: cur_shape,
    //       started: false
    //     }
    //   }
    //   canv.setMode("select")
    //   return {
    //     keep: true,
    //     element: cur_shape,
    //     started: false
    //   }
     }
  }
});
