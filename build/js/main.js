$(document).ready(function () {

  $('.clients__list').slick({
    dots: true,
    arrows: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    infinite: false,
    centerPadding: '60px',
    responsive: [
      {
        breakpoint: 1100,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 700,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          centerMode: true,
        }
      }
    ]
  });


});