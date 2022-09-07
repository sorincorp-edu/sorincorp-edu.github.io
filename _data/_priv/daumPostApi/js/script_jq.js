const form = $("#form");
const shipaddr = $("#shipaddr");
const username = $("#username");
const uphonefirst = $("#uphonefirst");
const uphonemid = $("#uphonemid");
const uphonelast = $("#uphonelast");
const postcode = $("#postcode");
const road = $("#road");
const detail = $("#detail");
const extra = $("#extra");
const defaultYn = $("#defaultYn");
const privacyYn = $("#privacyYn");

// 체크박스 전체선택
$("#cbx_chkAll").click(function () {
  if ($("#cbx_chkAll").is(":checked"))
    $("input[name=chk]").prop("checked", true);
  else $("input[name=chk]").prop("checked", false);
});

// Daum 주소 검색 API
$("#btn_find").click(function (e) {
  e.preventDefault();
  new daum.Postcode({
    oncomplete: function (data) {
      let roadAddr = data.roadAddress;
      postcode.val(data.zonecode);
      road.val(roadAddr);
      detail.focus();
    },
  }).open();
});

// 입력한 정보 display
function displayInfo() {
  const shipaddrValue = shipaddr.val().trim();
  const nameValue = username.val().trim();
  const uphonefValue = uphonefirst.val();
  const uphonemValue = uphonemid.val().trim();
  const uphonelValue = uphonelast.val().trim();
  const postcodeValue = postcode.val().trim();
  const roadValue = road.val().trim();
  const detailValue = detail.val().trim();
  const extraValue = extra.val().trim();
  const dYnValue = defaultYn.prop("checked");
  const pYnValue = privacyYn.prop("checked");

  let result = "";
  result += "<tr><td><input type='checkbox' name='chk' /></td>";
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
  $(".confirm tbody").append(result);
}

// Reset Input field
function resetInputField() {
  shipaddr.val("");
  username.val("");
  uphonefirst.val("010");
  uphonemid.val("");
  uphonelast.val("");
  postcode.val("");
  road.val("");
  detail.val("");
  extra.val("");
  defaultYn.prop("checked", false);
  privacyYn.prop("checked", false);
}

// Form submit event
form.submit(function (e) {
  e.preventDefault();
  displayInfo();
  resetInputField();
});

// Delete 1 row
$(document).on("click", "#del", function (e) {
  e.preventDefault();
  $(this).closest("tr").remove();
});

// Delete all rows
$("#delAll").click(function (e) {
  e.preventDefault();
  $(this).closest("thead").siblings("tbody").find("tr").remove();
});
