const displayedImage = $('.displayed-img')
  , thumbBar = $('.thumb-bar')
  , btn = $('button')
  , overlay = $('.overlay');

/* Declaring the array of image filenames */
const images = ['pic1.jpg', `pic2.jpg`, `pic3.jpg`, `pic4.jpg`, `pic5.jpg`];
const alts = {
  'pic1.jpg': 'Closeup of a human eye',
  'pic2.jpg': 'Rock that looks like a wave',
  'pic3.jpg': 'Purple and white pansies',
  'pic4.jpg': 'Section of wall from a pharoah\'s tomb',
  'pic5.jpg': 'Large moth on a leaf'
}
// 초기화 - 화면을 처음 loading할때 처리됨
$(document).ready(function () {
  console.log('Page Load start...');
  // 화면초기화
  initScreen();
  // 버튼이벤트 추가
  addButtonEvent(btn);
});

var initScreen = function () {
  /* Looping through images */
  $.each(images, function (index, image) {
    let _newImage = document.createElement('img');
    // 생성된 이미지 태그에 id 설정 및 attr 설정
    $(_newImage).attr('id', image).attr('src', 'images/' + image).attr('alt', alts[image]);
    // 화면내 요소에 추가('div.resultParas' 요소 뒤에 붙임)
    $(thumbBar).append($(_newImage));
    // 생성된 버튼에 이벤트 등록
    $(_newImage).on('click', function (e) {
      console.log('click image :' + image + ', e : ', e);
      // 이벤트 버블링 금지
      e.stopPropagation();
      // 처리하려는 이벤트이외 별도 정의된 Default 이벤트 처리안함
      e.preventDefault();
      $(displayedImage).attr('src', e.target.src).attr('alt', e.target.alt);
    });
  })
};

var addButtonEvent = function (targetButton) {
  // 클릭 이벤트 등록
  targetButton.on('click', function (e) {
    // 이벤트 버블링 금지
    e.stopPropagation();
    // 처리하려는 이벤트이외 별도 정의된 Default 이벤트 처리안함
    e.preventDefault();
    // 유저 입력값 확인
    let isDark = $(this).hasClass('dark');
    console.log('click button class :' + isDark, $(displayedImage).attr('class'));

    if (isDark === true) {
      $(this).attr('class', 'light').text('밝게');;
      $('#div_overlay').css('background-color', 'rgba(0,0,0,0.5)');

    } else {
      $(this).attr('class', 'dark').text('어둡게');
      $('#div_overlay').css('background-color', 'rgba(0,0,0,0)');
      
    }
  });
}