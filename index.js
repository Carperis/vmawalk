// Global Login Button
var loginText = "Login";
var loginLink = "login/login.html";



function setLogin(callback) {
    // Judge if login or myreview
    var param = new URL(location)
    if (param.searchParams.has("token")) {
        localStorage.setItem("token", param.searchParams.get("token"))
        if (new URL(document.referrer).pathname.endsWith("EmailConfirm"))
            layui.use("layer", function () {
                layui.layer.msg("Email Confirmed Successfully");
            })
        else if (param.get("pr") == 1) {
            layui.use("layer", function () {
                layui.layer.msg("Password Reset Successfully");
            })
        }
    }
    var token = localStorage.getItem("token")

    if (token) {
        console.log("检测到token")
        try {
            var user = JSON.parse(b64_to_utf8(token.split(".")[1]))
            if (user.exp > Date.now() / 1000) {
                console.log("token未过期, 已登录")
                loginText = "My Review";
                loginLink = "myreview/myreview.html";
            } else {
                console.log("token已过期, 请重新登录")
            }
        } catch (err) {
            localStorage.removeItem("token")
            console.log("token 无效")
            console.log(err)
        }
    } else {
        console.log("未检测到token, 请登录")
    }
    callback()
}

window.onload = function () {

    var selectForm = document.getElementById("submit");
    if (document.documentElement.clientWidth <= 700) {
        selectForm.style.cssText = `padding:0; width: 50px; text-align: center; background-color: #69bdc8; box-shadow: /* -7px -7px 20px 0px #fff9, */
        /* -4px -4px 5px 0px #fff9, */
        7px 7px 20px 0px #0002, 4px 4px 5px 0px #0001, /* inset 0px 0px 0px 0px #fff9, */
        inset 0px 0px 0px 0px #0001, /* inset 0px 0px 0px 0px #fff9, */
        inset 0px 0px 0px 0px #0001;`
        selectForm.innerHTML = '<img src="img/search-icon.png" style="width: 30px;">'
    }

    // Load options of select
    layui.use(['layer', 'jquery', 'form'], async function () {

        var $ = layui.jquery;

        await loadInfo;


        teachers.sort((x, y) => (x.chineseName + x.englishName).localeCompare(y.chineseName + y.englishName)).filter(teacher => {
            if (teacher.chineseName == null) {
                $("#search").append(new Option(teacher.englishName, `1-${teacher.id}`))

                return false;
            } else
                return true
        }).forEach(teacher =>
            $("#search").append(new Option(`${teacher.chineseName} ${teacher.englishName}`, `1-${teacher.id}`))
        )

        Courses.sort((x, y) => x.courseCode.localeCompare(y.courseCode)).forEach(i => {
            $("#search").append(new Option(i.courseName + " " + i.courseCode, "2-" + i.courseCode));
        })

        layui.form.render('select');

    })

    //Load login button
    setLogin(function () {
        let loginDiv = document.getElementById("login-div");
        let login = document.createElement("span");
        login.setAttribute('href', loginLink);
        login.innerHTML = ` <button class = "add-review" onclick="location.href='` + loginLink + `'">
            <text class = "add-review-text"> ` + loginText + ` </text> </button>`;
        loginDiv.appendChild(login);
    })
}


// Set submit button click
layui.use(['form', 'jquery'], function () {

    var form = layui.form;
    var $ = layui.$;

    $(document).keydown(function (e) {
        if (e.keyCode === 13) {

            $("#submit").trigger("click");
            return false;
        }
    });

    form.on('submit(submit)', function (data) {
        query = data.field.teacher;
        link = "menu/menu.html?query=" + encodeURI(encodeURI(query)) + "";
        window.location.href = link;
        return false;
    });
})