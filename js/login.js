const id_input = document.querySelector("#id");
const pw_input = document.querySelector("#pw");
const login_failed = document.querySelector("#login_failed");

document.getElementById("overlay").style.display = "none";

document.addEventListener("submit", (e) => {
    e.preventDefault();

    document.getElementById("overlay").style.display = "flex";

    const id_val = id_input.value;
    const pw_val = pw_input.value;

    fetch("http://127.0.0.1:5000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: id_val, pw: pw_val })
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById("overlay").style.display = "none";

            if ('token' in data && 'assignment_data' in data) { //키 두개 제대로 달렸는지
                if ("error" in data["assignment_data"]) { // 에러 발생시
                    login_failed.style = "display:block;";
                } else { //과제 정보가 멀쩡히 왔을 시.
                    chrome.storage.local.set({ 'assignment data': data["assignment_data"] }, () => {
                        console.log('Assignment data stored in local storage');
                    });
                    chrome.storage.local.set({ 'gwnu_assignment_token': data["token"] }, () => {
                        console.log('Token data stored in local storage');
                    });

                    window.location.href = "popup.html";
                }
            } else {
                login_failed.style = "display:block;";
            }
        });
});