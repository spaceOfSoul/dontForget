const id_input = document.querySelector("#id");
const pw_input = document.querySelector("#pw");
const login_failed = document.querySelector("#login_failed");

document.getElementById("overlay").style.display = "none";

document.addEventListener("submit", (e) => {
    e.preventDefault();

    document.getElementById("overlay").style.display = "flex";

    const id_val = id_input.value;
    const pw_val = pw_input.value;

    fetch("http://54.80.179.208/assignment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: id_val, pw: pw_val })
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById("overlay").style.display = "none";
            if ("error" in data) { // 에러 발생시
                login_failed.style = "display:block;";
            } else { //과제 정보가 멀쩡히 왔을 시.
                chrome.storage.local.set({ 'assignment data': data }, () => {
                    console.log('Data stored in local storage');
                });

                window.location.href = "popup.html";
            }
        });
});