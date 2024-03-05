// CHEATING NOT ALLOWED
$('body').bind('copy paste', function (e) {
    e.preventDefault(); return false;
});

// DISABLE BUTTON IF INPUT IS NOT MATCHING
function confirmPassword() {
    var input1 = $("#password").val();
    var input2 = $("#password2").val();

    if (input1 == input2) {
        $('#btn-confirm').removeAttr("disabled");
    }
    else if (input1 !== input2) {
        $('#btn-confirm').attr("disabled", true);
    }
}

// MATCHING PASSWORD INPUTS
function checkPassword() {
    var password = document.getElementById("password");
    var confirm = document.getElementById("password2");
    var white_text = "#ffffff";
    var good_color = "#5cb85c";
    var meh_color = "#f0ad4e";
    var bad_color = "#d9534f";

    if (password.value == confirm.value) {
        confirm.style.backgroundColor = good_color;
        confirm.style.color = white_text;
    } else {
        confirm.style.backgroundColor = bad_color;
        confirm.style.color = white_text;
    }
}

// PASSWORD VALIDATION
function validatePassword() {
    var text = document.getElementById('password').value;
    var length = document.getElementById('length');
    var lowercase = document.getElementById('lowercase');
    var uppercase = document.getElementById('uppercase');
    var number = document.getElementById('number');
    var special = document.getElementById('special');

    checkIfEightChar(text) ? length.classList.add('list-group-item-success') : length.classList.remove('list-group-item-success');
    checkIfOneLowercase(text) ? lowercase.classList.add('list-group-item-success') : lowercase.classList.remove('list-group-item-success');
    checkIfOneUppercase(text) ? uppercase.classList.add('list-group-item-success') : uppercase.classList.remove('list-group-item-success');
    checkIfOneDigit(text) ? number.classList.add('list-group-item-success') : number.classList.remove('list-group-item-success');
    checkIfOneSpecialChar(text) ? special.classList.add('list-group-item-success') : special.classList.remove('list-group-item-success');
}

function checkIfEightChar(text) {
    return text.length >= 12;
}
function checkIfOneLowercase(text) {
    return /[a-z]/.test(text);
}
function checkIfOneUppercase(text) {
    return /[A-Z]/.test(text);
}
function checkIfOneDigit(text) {
    return /[0-9]/.test(text);
}
function checkIfOneSpecialChar(text) {
    return /[_()~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(text);
}

// MEASURE PASSWORD STRENGTH
function ClassifyChar(ch) {
    if (('a' <= ch && 'z' >= ch) || ' ' == ch)
        return 'lower';
    if ('A' <= ch && 'Z' >= ch)
        return 'upper';
    if ('0' <= ch && '9' >= ch)
        return 'number';
    if (0 <= "`~!@#$%^&*()_-+={}|[]\\:\";',./<>?".indexOf(ch))
        return 'symbol';
    return 'other';
}

function CalcPasswordStrength(pw) {
    if (!pw.length)
        return 0;

    var score = { "lower": 26, "upper": 26, "number": 10, "symbol": 35, "other": 20 };

    var dist = {}, used = {};
    for (var i = 0; i < pw.length; i++)
        if (undefined === used[pw[i]]) {
            used[pw[i]] = 1;
            var c = ClassifyChar(pw[i]);
            if (undefined === dist[c])
                dist[c] = score[c] / 2;
            else
                dist[c] = score[c];
        }

    var total = 0;
    $.each(dist, function (k, v) { total += v; });

    used = {};
    var strength = 1;
    for (var i = 0; i < pw.length; i++) {
        if (undefined === used[pw[i]])
            used[pw[i]] = 1;
        else
            used[pw[i]]++;

        if (total > used[pw[i]])
            strength *= total / used[pw[i]];
    }

    return parseInt(Math.log(strength));
}
// PROGRESS BAR OF PASSWORD STRENGTH
$("#password").keyup(function (e) {
    var ctrl = "#passwordStrength";
    var strength = CalcPasswordStrength($("#password").val());
    var percent = Math.max(15, Math.min(100, parseInt(strength)));

    $('#showPassword').text($("#password").val());

    $(ctrl).width('' + percent + '%');
    $(ctrl).removeClass('progress-bar-success progress-bar-warning progress-bar-danger');

    if (40 > strength)
        $(ctrl).text("Weak"),
            $(ctrl).addClass("progress-bar-danger");
    else if (60 > strength)
        $(ctrl).text("Moderate"),
            $(ctrl).addClass("progress-bar-warning");
    else if (90 > strength)
        $(ctrl).text("Strong"),
            $(ctrl).addClass("progress-bar-success");
    else
        $(ctrl).text("Very Strong"),
            $(ctrl).addClass("progress-bar-success");

    $(ctrl).attr("data-strength", strength);
    $(this).attr("data-strength", strength);

    // OUTPUT VALUE OF PASSWORD STRENGTH
    document.getElementById("value-digit").innerHTML = strength;

    // CHANGING BACKGROUND, ADDING TEXT AND CONFETTI DEPENDING ON PASSWORD STRENGTH
    $(document).ready(function () {
        var confettiSettings = { target: "confetti" };
        var confetti = new ConfettiGenerator(confettiSettings);
    
        // Bind modal show and hide events outside of the button click to avoid binding them multiple times
        $('#ModalCenter').on('shown.bs.modal', function () {
            // This now just ensures the canvas is visible, actual rendering happens later based on condition
            document.getElementById('confetti').style.visibility = 'visible';
        });
    
        $('#ModalCenter').on('hide.bs.modal', function () {
            document.getElementById('confetti').style.visibility = 'hidden';
        });
    
        $('#btn-confirm').click(function () {
            validatePassword(); // Ensure validations run before calculating strength
            var strength = CalcPasswordStrength($("#password").val());
    
            // Reset confetti visibility and clear previous confetti (if any)
            document.getElementById('confetti').style.visibility = 'hidden';
            
            if (strength > 90) {
                $("#value-text").addClass("progress-bar-success");
                $("#value-digit").addClass("progress-bar-success");
                $("#confirmMessage").html("<p>This password is typically good enough to safely guard sensitive information like financial records.</p>");
    
                // Show and render confetti only for this condition
                document.getElementById('confetti').style.visibility = 'visible';
                confetti.render();
            } else if (strength > 60) {
                $("#value-text").removeClass("progress-bar-danger").addClass("progress-bar-warning");
                $("#value-digit").removeClass("progress-bar-danger").addClass("progress-bar-warning");
                $("#confirmMessage").html("<p>This password is usually good enough for computer logins and to keep out the average person.</p>");
            } else if (strength > 40) {
                $("#value-text").removeClass("progress-bar-warning").addClass("progress-bar-success");
                $("#value-digit").removeClass("progress-bar-warning").addClass("progress-bar-success");
                $("#confirmMessage").html("<p>This password is fairly secure cryptographically and skilled hackers may need some good computing power to crack it.</p>");
            } else {
                $("#value-text").removeClass("progress-bar-warning").addClass("progress-bar-danger");
                $("#value-digit").removeClass("progress-bar-warning").addClass("progress-bar-danger");
                $("#confirmMessage").html("<p>This password is quite short. The longer a password is the more secure it will be.</p>");
            }
        });
    
        $('body').bind('copy paste', function (e) {
            e.preventDefault(); return false;
        });
    
        document.getElementById('currentYear').textContent = new Date().getFullYear();
    });    
});  