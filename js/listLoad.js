var assignmentData = null;

const before_login = document.querySelector("#before-login");
const after_login = document.querySelector("#after-login");

chrome.storage.local.get(['assignment data'], (result) => {
    if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        return;
    }

    if ('assignment data' in result) {
        const ulElement = document.querySelector('.scroll-list');

        before_login.classList.add("hidden");
        assignmentData = result['assignment data'];
        console.log("Data retrieved from local storage:", assignmentData);

        for (const subject in assignmentData) {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.addEventListener('click', () => {
                window.open(assignmentData[subject].link, '_blank');
            });

            const assignmentsArray = assignmentData[subject].assignments;
            const arrayLength = assignmentsArray.length;

            var contentSubject = subject;
            li.textContent = contentSubject;

            if (subject.endsWith("NEW")) {
                li.textContent = subject.slice(0, -3);

                const span = document.createElement('span');
                span.className = 'badge badge-danger badge-pill';
                span.textContent = "NEW";
                li.appendChild(span);
            }

            // 과제 개수
            if (arrayLength > 0) {
                const span = document.createElement('span');
                span.className = 'badge badge-primary badge-pill';
                span.textContent = arrayLength.toString();
                span.addEventListener('click', (e) => {
                    e.stopPropagation(); // 부모 항목의 클릭 이벤트를 방지합니다.
                    window.open(assignmentData[subject].assignment_link, '_blank');
                });
                li.appendChild(span);
            }

            ulElement.appendChild(li);
        }
        chrome.runtime.sendMessage({ type: 'SET_NOTIFICATIONS', data: assignmentData });
    } else {
        after_login.classList.add("hidden");
        console.log("Can't found for key 'assignment data'.");
    }
});