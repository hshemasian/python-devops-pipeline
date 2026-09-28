function isValidEmail(email) {
    // Regular expression to validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

function test() {
    let name = document.forms["contact"]["full_name"].value;
    if (name === "" || /\d/.test(name) || /^\s+$/.test(name)) {
        alert("השם לא יכול להיות ריק, להכיל מספרים או להכיל רק רווחים");
        return false;
    }

    let phone = document.forms["contact"]["cellular_number"].value;
    if (phone === "" || isNaN(phone) || phone.toString().length < 8 || phone.toString().length > 10) {
        alert("מספר טלפון לא תקין");
        return false;
    }

    const email = document.forms["contact"]["email_address"].value.trim();
    if (!email) {
        alert("אימייל לא יכול להיות ריק");
        return false;
    } else if (!isValidEmail(email)) {
        alert("אנא הזן כתובת דואל תקנית");
        return false;
    }

    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    let isChecked = false;
    checkboxes.forEach(function(checkbox) {
        if (checkbox.checked) {
            isChecked = true;
        }
    });

    if (!isChecked) {
        alert("צריך לבחור חיל אחד לפחות");
        return false;
    }

    const departmentSelect = document.getElementById("department");
    const selectedValue = departmentSelect.value;
    if (selectedValue === "") {
        alert("נאה לבחור למי אתה רוצה ליצור קשר");
        return false;
    }
    return true;
}
                
            




