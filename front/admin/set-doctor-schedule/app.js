function scheduleList() {
    let schedule = "";
    const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    for (let i = 0; i < 5; i++) {
        schedule += '<div class="text-i">' + weekdays[i] + '</div>'
        schedule += '<span class="text-ii">Start: </span>'
        schedule += '<select class="dropdown-menu">'
        for (let j = 9; j < 17; j++) {
            let tmp = j.toString()
            schedule += '<option>' + tmp + '</option>'
        }
        schedule += '</select>'
        schedule += '<span class="text-ii">Finish: </span>'
        schedule += '<select class="dropdown-menu">'
        for (let j = 9; j < 17; j++) {
            let tmp = j.toString()
            schedule += '<option>' + tmp + '</option>'
        }
        schedule += '</select>'
        schedule += '<span class="text-ii">Capacity: </span><select class="dropdown-menu">'
        for (let i = 0; i < 20; i++) {
            schedule += '<option>' + i.toString() + '</option>'
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