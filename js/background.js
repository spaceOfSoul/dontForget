function setDailyAlarm() {
    const now = new Date();
    const nextAlarmTime = new Date(now);
    nextAlarmTime.setHours(22, 0, 0, 0);

    if (now > nextAlarmTime) {
        nextAlarmTime.setDate(nextAlarmTime.getDate() + 1);
    }

    const delayInMinutes = (nextAlarmTime.getTime() - now.getTime()) / 1000 / 60;
    const periodInMinutes = 24 * 60; // 하루에 한 번

    chrome.alarms.create('dailyAlarm', {
        delayInMinutes,
        periodInMinutes
    });
}

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'dailyAlarm') {
        chrome.notifications.create({
            type: 'basic',
            iconUrl: '../images/icon32.png',
            title: '목록 갱신알림',
            message: '재로그인 후 새로운 과제가 있는지 확인해주세요!'
        });
    }
});

setDailyAlarm();

// 과제알림
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'SET_NOTIFICATIONS') {
        console.log(message.data);
        setAssignmentNotifications(message.data);
        chrome.alarms.getAll(alarms => {
            console.log(alarms);
        });
    }
});

function setAlarm(time, assignment, dueDateStr, num) {
    const now = new Date();
    const dueDate = new Date(dueDateStr);

    const diff = dueDate - now; // 밀리초 잔위

    const days = Math.floor(diff / (1000 * 60 * 60 * 24)); // 일
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); // 시
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)); // 분

    const notificationMessage = `${days}일 ${hours}시간 ${minutes}분`;

    if (now > time) {
        chrome.notifications.create({
            type: 'basic',
            iconUrl: '../images/icon32.png',
            title: '과제 마감 알림',
            message: `${assignment.title} 과제의 마감 시간이 ${notificationMessage} 남았습니다.`,
        });
    } else {
        chrome.alarms.create(`assignment-${assignment.title}-${dueDateStr}-${num}`, {
            when: time.getTime(),
        });
    }
}

function deleteAlarm(assignment, dueDateStr, num) {
    const alarmName = `assignment-${assignment.title}-${dueDateStr}-${num}`;
    chrome.alarms.clear(alarmName);
}

function setAssignmentNotifications(subjects) {
    const now = new Date();

    for (const subject in subjects) {
        const assignments = subjects[subject].assignments;

        assignments.forEach((assignment) => {
            if (assignment.status === "미제출") {
                const dueDate = new Date(assignment.due);

                //일주일
                const weekBefore = new Date(dueDate);
                weekBefore.setDate(weekBefore.getDate() - 7);

                //이틀 전
                const twoBefore = new Date(dueDate);
                twoBefore.setDate(twoBefore.getDate() - 2);

                //하루 전
                const dayBefore = new Date(dueDate);
                dayBefore.setDate(dayBefore.getDate() - 1);

                // 한 시간 전
                const hourBefore = new Date(dueDate);
                hourBefore.setHours(hourBefore.getHours() - 1);

                // 5분 전
                const fiveMinutesBefore = new Date(dueDate);
                fiveMinutesBefore.setMinutes(fiveMinutesBefore.getMinutes() - 5);

                if (now < weekBefore)
                    setAlarm(weekBefore, assignment, assignment.due, 7);
                else
                    deleteAlarm(assignment, assignment.due, 7);

                if (now < twoBefore)
                    setAlarm(twoBefore, assignment, assignment.due, 2);
                else
                    deleteAlarm(assignment, assignment.due, 2);

                if (now < dayBefore)
                    setAlarm(dayBefore, assignment, assignment.due, 1);
                else
                    deleteAlarm(assignment, assignment.due, 1);

                if (now < hourBefore)
                    setAlarm(hourBefore, assignment, assignment.due, "60m");
                else
                    deleteAlarm(assignment, assignment.due, "60m");

                if (now < fiveMinutesBefore)
                    setAlarm(fiveMinutesBefore, assignment, assignment.due, "5m");
                else
                    deleteAlarm(assignment, assignment.due, "5m");

            }
        });
    }
}


chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name.startsWith("assignment-")) {
        const [_, assignmentTitle, dueDateStr, num] = alarm.name.split('-');

        const dueDate = new Date(dueDateStr);
        const now = new Date();

        const diff = dueDate - now; // 밀리초 잔위

        const days = Math.floor(diff / (1000 * 60 * 60 * 24)); // 일
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); // 시
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)); // 분

        const notificationMessage = `${days}일 ${hours}시간 ${minutes}분`;

        chrome.notifications.create({
            type: 'basic',
            iconUrl: '../images/icon32.png',
            title: '과제 마감 알림',
            message: `${assignmentTitle} 과제의 마감 시간이 ${notificationMessage} 남았습니다.`,
        });
    }
});