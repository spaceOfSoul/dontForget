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
            iconUrl: 'image/icon32.png',
            title: '목록 갱신알림',
            message: '재로그인 후 새로운 과제가 있는지 확인해주세요!'
        });
    }
});

setDailyAlarm();