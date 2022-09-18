const date = new Date(); // 현재시간
console.log(date); 
console.log(date.getMonth() + 1); // 월 - getMonth()의 반환값이 0 ~ 11이기 때문에 +1을 해주어야 된다.
console.log(date.getDate()); // 일
console.log(date.getDay()); // 요일
console.log(date.getHours()); // 시간
console.log(date.getMinutes()); // 분
console.log(date.getSeconds()); // 초
console.log(date.getMilliseconds()); // 밀리초

console.log(date.toLocaleDateString());
console.log(date.toLocaleTimeString());
console.log(date.toLocaleString());
