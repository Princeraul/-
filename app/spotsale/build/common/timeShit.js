
function timeChange(time, flag) {
    // flag: true 减1年
    var day;
    var month;
    var timeSource = new Date(time);
    timeSource.setFullYear(flag ? (timeSource.getFullYear() - 1) : (timeSource.getFullYear() + 1));
    timeSource.setDate(flag ? (timeSource.getDate() + 1) : (timeSource.getDate() -1 ));

    month = (timeSource.getMonth() + 1 >= 10) ? (timeSource.getMonth() + 1) : '0' + (timeSource.getMonth() + 1);
    day = (timeSource.getDate() >= 10) ? timeSource.getDate() : '0' + timeSource.getDate();
    timeSource = timeSource.getFullYear() + '-' + month + '-' + day;

    return timeSource;
}

function timeAddOneDay(time) {
    var day;
    var timeSource = new Date(time);
    timeSource.setDate(timeSource.getDate() + 1);
    day = timeSource.getDate() >= 10 ? timeSource.getDate() : '0' + timeSource.getDate();
    timeSource = timeSource.getFullYear() + '-' + (timeSource.getMonth()+1) + '-' + day;
    return timeSource;
}
