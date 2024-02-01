var assignmentData = null;

const before_login = document.querySelector("#before-login");
const after_login = document.querySelector("#after-login");
const reload_btn = document.querySelector("#reload_btn");
const loadingSpinner = document.querySelector("#overlay");
loadingSpinner.style.display = "none";

let view_mode = 1;

function get_assignment_data_list() {
    chrome.storage.local.get(['assignment data'], (result) => {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            return;
        }

        if ('assignment data' in result) {
            const ulElement = document.querySelector('.scroll-list');
            ulElement.innerHTML = "";
            before_login.classList.add("hidden");
            const assignmentData = result['assignment data'];
            console.log("Data retrieved from local storage:", assignmentData);

            let sum = 0;

            for (const subject in assignmentData) {
                console.log(subject);
                const assignmentsArray = assignmentData[subject].assignments;
                const now = new Date();

                sum += assignmentsArray.length;

                for (let i = 0; i < assignmentsArray.length; i++) {
                    if (assignmentsArray[i].status == "미제출" && now < new Date(assignmentsArray[i].due)) {
                        const li = document.createElement('li');
                        li.className = 'list-group-item d-flex justify-content-between align-items-center';

                        li.addEventListener('click', () => {
                            window.open(assignmentData[subject].link, '_blank');
                        });

                        li.textContent = assignmentsArray[i].title;

                        li.appendChild(document.createElement('br')); //담줄

                        const dateText = document.createTextNode(assignmentsArray[i].due);
                        li.appendChild(dateText);

                        ulElement.appendChild(li);
                    }
                }
            }

            if (sum === 0) {
                const li = document.createElement('li');
                li.className = 'list-group-item d-flex justify-content-between align-items-center';
                li.textContent = "현재 과제가 없습니다.";

                ulElement.appendChild(li);
            }

        } else {
            after_login.classList.add("hidden");
            console.log("Can't found for key 'assignment data'.");
        }
    });
}

function get_lecture_data_list() {
    chrome.storage.local.get(['assignment data'], (result) => {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            return;
        }

        if ('assignment data' in result) {
            const ulElement = document.querySelector('.scroll-list');
            ulElement.innerHTML = "";
            before_login.classList.add("hidden");
            assignmentData = result['assignment data'];
            console.log("Lecture and assignment data:", assignmentData);

            let sum = 0;

            for (const subject in assignmentData) {
                if (assignmentData[subject].type == "기타")
                    continue;

                sum += assignmentsArray.length;

                const li = document.createElement('li');
                li.className = 'list-group-item d-flex justify-content-between align-items-center';
                li.addEventListener('click', () => {
                    window.open(assignmentData[subject].link, '_blank');
                });

                const assignmentsArray = assignmentData[subject].assignments;
                let incompleteTaskCount = 0;
                const now = new Date();
                for (let i = 0; i < assignmentsArray.length; i++) {
                    if (assignmentsArray[i].status == "미제출" && now < new Date(assignmentsArray[i].due)) {
                        incompleteTaskCount++;
                    }
                }

                var contentSubject = subject;
                li.textContent = contentSubject;

                if (subject.endsWith("NEW")) {
                    li.textContent = subject.slice(0, -3);

                    const span = document.createElement('span');
                    span.className = 'badge badge-danger badge-pill';
                    span.textContent = "NEW";
                    li.appendChild(span);
                }

                // 마치지 않은 과제 개수
                if (incompleteTaskCount > 0) {
                    const span = document.createElement('span');
                    span.className = 'badge badge-primary badge-pill';
                    span.textContent = incompleteTaskCount.toString();
                    span.addEventListener('click', (e) => {
                        e.stopPropagation(); // 부모 항목의 클릭 이벤트 찯ㄴ.
                        window.open(assignmentData[subject].assignment_link, '_blank');
                    });
                    li.appendChild(span);
                }

                ulElement.appendChild(li);
            }

            if (sum === 0) {
                const li = document.createElement('li');
                li.className = 'list-group-item d-flex justify-content-between align-items-center';
                li.textContent = "현재 강의가 없습니다.";

                ulElement.appendChild(li);
            }

            chrome.runtime.sendMessage({ type: 'SET_NOTIFICATIONS', data: assignmentData });
        } else {
            after_login.classList.add("hidden");
            console.log("Can't found for key 'assignment data'.");
        }
    });
}

function get_etc_data_list() {
    chrome.storage.local.get(['assignment data'], (result) => {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            return;
        }

        if ('assignment data' in result) {
            const ulElement = document.querySelector('.scroll-list');
            ulElement.innerHTML = "";
            before_login.classList.add("hidden");
            assignmentData = result['assignment data'];
            console.log("Lecture and assignment data:", assignmentData);

            let sum = 0;

            for (const subject in assignmentData) {
                if (assignmentData[subject].type != "기타")
                    continue;

                sum += assignmentsArray.length;

                const li = document.createElement('li');
                li.className = 'list-group-item d-flex justify-content-between align-items-center';
                li.addEventListener('click', () => {
                    window.open(assignmentData[subject].link, '_blank');
                });

                const assignmentsArray = assignmentData[subject].assignments;
                let incompleteTaskCount = 0;
                const now = new Date();
                for (let i = 0; i < assignmentsArray.length; i++) {
                    if (assignmentsArray[i].status == "미제출" && now < new Date(assignmentsArray[i].due)) {
                        incompleteTaskCount++;
                    }
                }

                var contentSubject = subject;
                li.textContent = contentSubject;

                if (subject.endsWith("NEW")) {
                    li.textContent = subject.slice(0, -3);

                    const span = document.createElement('span');
                    span.className = 'badge badge-danger badge-pill';
                    span.textContent = "NEW";
                    li.appendChild(span);
                }

                // 마치지 않은 과제 개수
                if (incompleteTaskCount > 0) {
                    const span = document.createElement('span');
                    span.className = 'badge badge-primary badge-pill';
                    span.textContent = incompleteTaskCount.toString();
                    span.addEventListener('click', (e) => {
                        e.stopPropagation(); // 부모 항목의 클릭 이벤트를 방지합니다.
                        window.open(assignmentData[subject].assignment_link, '_blank');
                    });
                    li.appendChild(span);
                }

                ulElement.appendChild(li);
            }

            if (sum === 0) {
                const li = document.createElement('li');
                li.className = 'list-group-item d-flex justify-content-between align-items-center';
                li.textContent = "현재 강의가 없습니다.";

                ulElement.appendChild(li);
            }

            chrome.runtime.sendMessage({ type: 'SET_NOTIFICATIONS', data: assignmentData });
        } else {
            after_login.classList.add("hidden");
            console.log("Can't found for key 'assignment data'.");
        }
    });
}

function request_assign_data() {
    chrome.storage.local.get("gwnu_assignment_token", (token) => {
        loadingSpinner.style.display = "flex";

        token_data = token.gwnu_assignment_token;
        if (!token_data) {
            console.error("Can't found Token.");
            return;
        }

        fetch('http://54.80.179.208/assignment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(token_data)
            })
            .then(response => response.json())
            .then(data => {

                if ("error" in data) { // 에러 발생시
                    console.log("Token is invalid.");
                    window.location.href = "login.html";
                } else { //과제 정보가 멀쩡히 왔을 시.
                    chrome.storage.local.set({ 'assignment data': data }, () => {
                        console.log('Data stored in local storage');
                    });
                }

                if (view_mode == 0)
                    get_assignment_data_list();
                else if (view_mode == 1)
                    get_lecture_data_list();
                else
                    get_etc_data_list();
            })
            .catch((error) => {
                console.error('Error:', error);
                window.location.href = "login.html";
            }).finally(() => {
                loadingSpinner.style.display = "none";
            });
    });
}

reload_btn.addEventListener('click', () => {
    request_assign_data();
});

function changeClass(element, old, _new) {
    element.classList.remove(old);
    element.classList.add(_new);
}

const assignment_list_btn = document.querySelector('#assignment_list');
const lecture_list_btn = document.querySelector('#lecture_list');
const etc_list_btn = document.querySelector('#etc_list');

changeClass(lecture_list_btn, "btn-secondary", "btn-primary");
get_lecture_data_list();

assignment_list_btn.addEventListener('click', () => {
    changeClass(assignment_list_btn, "btn-secondary", "btn-primary");
    changeClass(lecture_list_btn, "btn-primary", "btn-secondary");
    changeClass(etc_list_btn, "btn-primary", "btn-secondary");
    get_assignment_data_list();
    view_mode = 0;
});

lecture_list_btn.addEventListener('click', () => {
    changeClass(assignment_list_btn, "btn-primary", "btn-secondary");
    changeClass(lecture_list_btn, "btn-secondary", "btn-primary");
    changeClass(etc_list_btn, "btn-primary", "btn-secondary");
    get_lecture_data_list();
    view_mode = 1;
});

etc_list_btn.addEventListener('click', () => {
    changeClass(assignment_list_btn, "btn-primary", "btn-secondary");
    changeClass(lecture_list_btn, "btn-primary", "btn-secondary");
    changeClass(etc_list_btn, "btn-secondary", "btn-primary");
    get_etc_data_list();
    view_mode = 2;
});