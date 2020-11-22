function scheduleList() {
    let schedule = "";
    const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    for (let i = 0; i < 5; i++) {
        let day = weekdays[i];
        schedule += '<div class="text-i">' + day + '</div>'
        schedule += '<span class="text-ii">Start: </span>'
        schedule += `<select class="dropdown-menu" name="${day}-start">`
        for (let j = 9; j < 17; j++) {
            let time = j.toString()
            schedule += `<option value="${time}">${time}</option>`
        }
        schedule += '</select>'
        schedule += '<span class="text-ii">Finish: </span>'
        schedule += `<select class="dropdown-menu" name="${day}-end">`
        for (let j = 9; j < 17; j++) {
            let time = j.toString()
            schedule += `<option value="${time}-end">${time}</option>`
        }
        schedule += '</select>'
        schedule += `<span class="text-ii" name="${day}-capacity">Capacity: </span><select class="dropdown-menu">`
        for (let i = 0; i < 20; i++) {
            const cap = i.toString();
            schedule += `<option value="${cap}">${cap}</option>`
        }
        schedule += '</select>'
    }
    return schedule;
}

window.onload = function () {
    const pos = document.getElementById("schedule-container");
    const schedule = scheduleList();
    pos.innerHTML = schedule;
}