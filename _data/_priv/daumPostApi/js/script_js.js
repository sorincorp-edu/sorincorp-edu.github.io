const form = document.querySelector("#form");
const shipaddr = document.querySelector("#shipaddr");
const username = document.querySelector("#username");
const uphonefirst = document.querySelector("#uphonefirst");
const uphonemid = document.querySelector("#uphonemid");
const uphonelast = document.querySelector("#uphonelast");
const postcode = document.querySelector("#postcode");
const road = document.querySelector("#road");
const detail = document.querySelector("#detail");
const extra = document.querySelector("#extra");
const defaultYn = document.querySelector("#defaultYn");
const privacyYn = document.querySelector("#privacyYn");
const btnFind = document.querySelector("#btn_find");
const tbody = document.querySelector(".confirm tbody");
const btnDel = document.querySelector("#del");
const btnDelAll = document.querySelector("#delAll");
const chkAll = document.querySelector("#cbx_chkAll");
const checkboxes = document.getElementsByName("chk");

// Daum 주소 검색 API
btnFind.addEventListener("click", (e) => {
  e.preventDefault();
  new daum.Postcode({
    oncomplete: function (data) {
      let roadAddr = data.roadAddress;
      postcode.value = data.zonecode;
      road.value = roadAddr;
      detail.focus();
    },
  }).open();
});

// 입력한 정보 display
function displayInfo() {
  const shipaddrValue = shipaddr.value.trim();
  const nameValue = username.value.trim();
  const uphonefValue = uphonefirst.value;
  const uphonemValue = uphonemid.value.trim();
  const uphonelValue = uphonelast.value.trim();
  const postcodeValue = postcode.value.trim();
  const roadValue = road.value.trim();
  const detailValue = detail.value.trim();
  const extraValue = extra.value.trim();
  const dYnValue = defaultYn.value;
  const pYnValue = privacyYn.value;

  let result = "";
  result += "<tr><td><input type='checkbox' /></td>";
  result += "<td>" + shipaddrValue + "</td>";
  result += "<td>" + nameValue + "</td>";
  result +=
    "<td>" +
    uphonefValue +
    " - " +
    uphonemValue +
    " - " +
    uphonelValue +
    "</td>";
  result +=
    "<td>" +
    " ( " +
    postcodeValue +
    " ) " +
    roadValue +
    ", " +
    detailValue +
    "</td>";
  result += "<td>" + extraValue + "</td>";
  result += "<td>" + (dYnValue ? "O" : "X") + "</td>";
  result += "<td>" + (pYnValue ? "O" : "X") + "</td>";
  result += "<td><button id='del'>삭제</button></td></tr>";
  tbody.innerHTML = result;
}

// Reset Input field
function resetInputField() {
  shipaddr.value = "";
  username.value = "";
  uphonefirst.value = "010";
  uphonemid.value = "";
  uphonelast.value = "";
  postcode.value = "";
  road.value = "";
  detail.value = "";
  extra.value = "";
  defaultYn.checked = false;
  privacyYn.checked = false;
}

// Form submit event
form.addEventListener("submit", (e) => {
  e.preventDefault();
  displayInfo();
  resetInputField();
});

// Delete 1 row
document.addEventListener("click", btnDel, (e) => {
  e.preventDefault();
  const target = e.currentTarget;
  target.closest("tr").innerHTML = "";
});

// Delete all rows
btnDelAll.addEventListener("click", (e) => {
  e.preventDefault();
  tbody.querySelector("tr").remove();
});
