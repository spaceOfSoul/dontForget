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

function setAlarm(time, assignment, notificationMessage) {
    const now = new Date();

    if (now > time) {
        chrome.notifications.create({
            type: 'basic',
            iconUrl: '../images/icon32.png',
            title: '과제 마감 알림',
            message: `${assignment.title} 과제의 마감 시간이 ${notificationMessage} 남았습니다.`,
        });
    } else {
        chrome.alarms.create(`assignment-${assignment.title}-${notificationMessage}`, {
            when: time.getTime(),
        });
    }
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
                    setAlarm(weekBefore, assignment, "일주일");

                if (now < dayBefore)
                    setAlarm(dayBefore, assignment, "하루");

                if (now < hourBefore)
                    setAlarm(hourBefore, assignment, "한 시간");

                if (now < fiveMinutesBefore)
                    setAlarm(fiveMinutesBefore, assignment, "5분");

            }
        });
    }
}


chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name.startsWith("assignment-")) {
        const [_, assignmentTitle, notificationMessage] = alarm.name.split('-');
        chrome.notifications.create({
            type: 'basic',
            iconUrl: '../images/icon32.png',
            title: '과제 마감 알림',
            message: `${assignmentTitle} 과제의 마감 시간이 ${notificationMessage} 남았습니다.`,
        });
    }
});