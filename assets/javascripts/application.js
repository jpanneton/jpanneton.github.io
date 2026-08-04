$(document).ready(function() {
  $('html').removeClass('fouc');

  // ScrollAppear
  if (typeof $.fn.scrollAppear === 'function') {
    $('.scrollappear').scrollAppear();
  }

  // Zooming
  // customSize caps rasters at their native pixel size, but it makes zooming
  // scale from naturalWidth, which an SVG with only a viewBox doesn't have.
  new Zooming(
    {customSize: '100%', scaleBase: 0.9, scaleExtra: 0}
  ).listen('.zooming-raster');

  new Zooming(
    {scaleBase: 0.9, scaleExtra: 0}
  ).listen('.zooming-vector');

  // Share buttons
  $('.article-share a').on('click', function() {
    window.open($(this).attr('href'), 'Share', 'width=200,height=200,noopener');
    return false;
  });
});