const express=require('express');
const request=require('request');
const ejs=require("ejs");
const app=express();
 
app.set('view engine', 'ejs');
app.set('views', './views');
 
// public 폴더하위의 파일들을 기본으로 서비스
app.use(express.static('public'));
 
app.get('/randomdog', function(req,res) {
    request("https://random.dog/woof.json",
function(error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
            let object = JSON.parse(body);
            res.render('randomdog', {
                imagesize: object.fileSizeBytes,
                imageurl: object.url
            });
        }
    });
});
 
// 페이지를 찾을 수 없음 오류 처리
app.use(function(req, res, next) {
    res.status(404);
    res.send(
        '<!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">' +
        '<html><head><title>404 페이지 오류</title></head>' +
        '<body><h1>찾을 수 없습니다</h1>' +
        '<p>요청하신 URL ' + req.url + ' 을 이 서버에서 찾을 수 없습니다..</p><hr>' +
        '</body></html>'
    );
});
app.listen(5500, function() {
    console.log("실행중...");
});