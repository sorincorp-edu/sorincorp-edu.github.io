const date = new Date();

// 초기화 - 화면을 처음 loading할때 처리됨
$(document).ready(function () {
    console.log('Page Load start...');
    // Calendar화면 그리기
    renderCalendar();

    // 이전달 클릭 이벤트 등록
    $(".prev").on('click', function (e) {
        e.stopPropagation();
        e.preventDefault();
        date.setMonth(date.getMonth() - 1);
        renderCalendar();
    });
    
    // 다음달 클릭 이벤트 등록
    $(".next").on('click', function (e) {
        e.stopPropagation();
        e.preventDefault();
        date.setMonth(date.getMonth() + 1);
        renderCalendar();
    });
});

var renderCalendar = function () {
    date.setDate(1);
    const monthDays = $(".days");
    const lastDay = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0
    ).getDate();

    const prevLastDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        0
    ).getDate();

    const firstDayIndex = date.getDay();

    const lastDayIndex = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0
    ).getDay();

    const nextDays = 7 - lastDayIndex - 1;

    const months = [
        "1월",
        "2월",
        "3월",
        "4월",
        "5월",
        "6월",
        "7월",
        "8월",
        "9월",
        "10월",
        "11월",
        "12월",
    ];

    $(".date h1").html(months[date.getMonth()]);

    $(".date p").html("TODAY " + new Date().toLocaleDateString());

    let days = "";

    for (let x = firstDayIndex; x > 0; x--) {
        days += `<div class="prev-date">${prevLastDay - x + 1}</div>`;
    }

    for (let i = 1; i <= lastDay; i++) {
        if (
            i === new Date().getDate() &&
            date.getMonth() === new Date().getMonth()
        ) {
            days += `<div class="today">${i}</div>`;
        } else {
            if (new Date(date.getFullYear(), date.getMonth(), i).getDay() == 0) {
                days += `<div class="sun">${i}</div>`;
            } else if (
                new Date(date.getFullYear(), date.getMonth(), i).getDay() == 6
            ) {
                days += `<div class="sat">${i}</div>`;
            } else {
                days += `<div>${i}</div>`;
            }
        }
    }

    for (let j = 1; j <= nextDays; j++) {
        days += `<div class="next-date">${j}</div>`;
    }
    monthDays.html(days);
}


