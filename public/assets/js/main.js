const empActive = document.getElementById('empActive');

const url = window.location.pathname;
const urlArray = url.split('/');
let nextUrl;
if (urlArray[2] && urlArray[2] == 'employee')
  nextUrl = `/${urlArray[1]}/${urlArray[2]}`;
else if (urlArray[2] && urlArray[2] == 'dashboard')
  nextUrl = `/${urlArray[1]}/${urlArray[2]}`;
else
  nextUrl = `/${urlArray[1]}`;


if (nextUrl == '/admin/dashboard') {
  document.getElementById('dashActive').classList.add('active');
  document.getElementById('empActive').classList.remove('active');
  document.getElementById('clientActive').classList.remove('active');
  document.getElementById('eventActive').classList.remove('active');
  
}
else if (nextUrl == '/admin/employee') {
  document.getElementById('dashActive').classList.remove('active');
  document.getElementById('empActive').classList.add('active');
  document.getElementById('clientActive').classList.remove('active');
  document.getElementById('eventActive').classList.remove('active');
}
else if (nextUrl == '/clients') {
  document.getElementById('dashActive').classList.remove('active');
  document.getElementById('empActive').classList.remove('active');
  document.getElementById('clientActive').classList.add('active');
  document.getElementById('eventActive').classList.remove('active');
  
}
else if (nextUrl == '/customers') {
  document.getElementById('dashActive').classList.remove('active');
  document.getElementById('empActive').classList.remove('active');
  document.getElementById('clientActive').classList.add('active');
  document.getElementById('eventActive').classList.remove('active');
  
}
else if (nextUrl == '/events' || nextUrl == '/events-assign-tasks') {
  document.getElementById('dashActive').classList.remove('active');
  if(document.getElementById('empActive'))
    document.getElementById('empActive').classList.remove('active');
  if(document.getElementById('clientActive'))
    document.getElementById('clientActive').classList.remove('active');
  if(document.getElementById('eventActive'))
    document.getElementById('eventActive').classList.add('active');
}
else if (nextUrl == '/officehours') {
  document.getElementById('dashActive').classList.remove('active');
  document.getElementById('empActive').classList.remove('active');
  document.getElementById('clientActive').classList.remove('active');
  document.getElementById('eventActive').classList.remove('active');
  document.getElementById('officehour').classList.add('active');
}
else if (nextUrl == '/employee') {
  document.getElementById('dashActive').classList.remove('active');
  document.getElementById('empTaskActive').classList.add('active');
  document.getElementById('empAttActive').classList.remove('active');
}
else if (nextUrl == '/employee/dashboard') {
  document.getElementById('dashActive').classList.add('active');
  document.getElementById('empTaskActive').classList.remove('active');
  document.getElementById('empAttActive').classList.remove('active');
}
else if (nextUrl == '/attendances') {
  if(document.getElementById('dashActive'))
    document.getElementById('dashActive').classList.remove('active');
  if(document.getElementById('empTaskActive'))
    document.getElementById('empTaskActive').classList.remove('active');
  if(document.getElementById('attendance'))
    document.getElementById('attendance').classList.add('active');
  if(document.getElementById('empAttActive'))
    document.getElementById('empAttActive').classList.add('active');
}

if (document.getElementById('set-filter-date')) {
  const select = document.getElementById('set-filter-date');
  let format;
  for (let i = 0; i < 12; i++) {
    const now = new Date();
    if (i == 0) {
      format = `${now.getFullYear()}-${now.getMonth() + 1}-1`;
      let option = document.createElement('option');
      option.setAttribute('value', format);
      option.innerText = format;
      select.appendChild(option);
    }

    if (now.getMonth() - i == 0) {
      format = now.getFullYear() - 1 + '-12-1';
    }
    else {
      now.setMonth(now.getMonth() - i);
      now.setDate(1); // 1 will result in the first day of the month
      format = now.getFullYear() + '-' + now.getMonth() + '-' + now.getDate();
      display = now.getFullYear() + '-' + now.getMonth();
    }
    let option = document.createElement('option');
    option.setAttribute('value', format);
    option.innerText = display;
    select.appendChild(option);
  }
}

// FILTER USER
const handleFilter = (date) => {
  const tableBody = document.getElementById('event-lists');
  tableBody.innerHTML = '';
  $.get("/events/filter/" + date, function (data, status) {
    if (data.length == 0) {
      const tr = document.createElement('tr');
      const td1 = document.createElement('td');
      td1.innerText = 'Events Not found';
      td1.setAttribute('colSpan', '4');

      tr.appendChild(td1);

      tableBody.appendChild(tr);
    }
    else {
      data.forEach((event, index) => {
        const tr = document.createElement('tr');
        const td1 = document.createElement('td');
        td1.innerText = index + 1;
        const td2 = document.createElement('td');
        td2.innerText = event.id;
        const td3 = document.createElement('td');
        td3.innerText = event.name;
        const td4 = document.createElement('td');
        td4.innerText = event.startDate;
        const td5 = document.createElement('td');
        td5.innerText = event.endDate;
        const td6 = document.createElement('td');
        td6.innerHTML = `<div class="media align-items-center">
        <div class="media-body">
          <a href="events/${event.id}/edit" style='color:blue;'>
            <i class="fas fa-edit"></i>
          </a>
        </div>  
        <div class="media-body">
        <form action="events/${event.id}" method='POST'>
           <p style="display:none"> {{method_field('DELETE')}} </p>
           <p style="display:none"> {{ csrf_field() }} </p>
            <button type='submit' style='color:white;border:none;background-color:transparent;'>
              <i class="fas fa-trash"></i>
            </button>
          </form>  
        </div>
      </div>`;

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);
        tr.appendChild(td6);

        tableBody.appendChild(tr);
      });
    }
  });
}

// Initiate the Pusher JS library
// let pusher = new Pusher('2cde0a7995c08e6b4e8d', {
//   encrypted: true
// });

// // Subscribe to the channel we specified in our Laravel Event
// let channel = pusher.subscribe('notification-channel');


// channel.bind('App\\Events\\NotificationAlert', function (data) {
//   // console.log(data);
// })

const getEvents = path => {
  let url;
  url = `./events/get/${path}`
  $.get(url, function (data) {
    const tBody = document.getElementById('events-lists');
    if(path=='thismonth')
      document.getElementById('event-title-name').innerText='Event of current Month';
    else if(path=='active')
      document.getElementById('event-title-name').innerText='Active Events';
    else if(path=='previous')
      document.getElementById('event-title-name').innerText='Previous Events';
    else
      document.getElementById('event-title-name').innerText='Total Events';

    tBody.innerHTML = '';
    const {events ,role}=data;
    if (events.length > 0) {
      events.forEach(event => {
        const tr = document.createElement('tr');

        let td1 = document.createElement('td');
        td1.innerText = event.id;
        tr.appendChild(td1);

        let td2 = document.createElement('td');
        td2.innerText = event.name;
        tr.appendChild(td2);

        let td3 = document.createElement('td');
        td3.innerText = event.startDate;
        tr.appendChild(td3);

        let td4 = document.createElement('td');
        td4.innerText = event.endDate;
        tr.appendChild(td4);

        if(role=='admin'){
          let td6 = document.createElement('td');
          td6.innerHTML = `
          <div class="media align-items-center">
          <div class="media-body">
            <a href="./events/${event.id}/edit" style='color:blue;'>
              <i class="fas fa-edit"></i>
            </a>
          </div>  
          <div class="media-body">
          <button type="button"  style='color:white;border:none;background-color:transparent;' data-toggle="modal" data-target="#event-${event.id}">
          <i class="fas fa-trash text-warning"></i>
        </button>
        <div class="modal fade" id="event-${event.id}" tabindex="-1" role="dialog" aria-labelledby="event-${event.id}Label" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Delete Event of Id ${event.id}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-footer">
                <form action="events/${event.id}" method='POST'>
                  <input type='hidden' name="_method" value="DELETE">
                  <input type='hidden' name="_token" value="${$('meta[name="csrf-token"]').attr('content')}">
                  <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                  <button type="submit" class="btn btn-primary">Delete Now</button>
                </form>
              </div>
            </div>
          </div>
        </div>
          </div>
        </div>
          `;
          tr.appendChild(td6);
        }
        tBody.appendChild(tr);
      })
    } else
      tBody.innerHTML = 'Events Not found';
  });
}

// TO GET EVENTS ACCORDING TO TASK
const getTaskForEvent = value => {
  $.get("/events/get-event-data/" + value, function (data, status) {
    const select = document.getElementById('eventLists');
    const selectedOptions = document.getElementById('selectedEvents');
    selectedOptions.innerHTML=null;
    select.innerHTML = null;
    data.forEach((event, index) => {
      const option = document.createElement('option');
      option.setAttribute('value', event.id);
      option.innerText = event.name;
      select.appendChild(option);
    });
  });
}

const handleClick = (sel) => {
  const selectedOptions = document.getElementById('selectedEvents');
  const selectedOption = sel.options[sel.selectedIndex];
  selectedOptions.appendChild(selectedOption);
}

const returnEvent = (sel) => {
  console.log(sel);
  const selectedOptions = document.getElementById('eventLists');
  const selectedOption = sel.options[sel.selectedIndex];
  selectedOptions.appendChild(selectedOption);
}

const submitTasks = () => {
  let options = $('#selectedEvents option');
  let events = $.map(options, function (option) {
    if (option.value != '')
      return option.value;
  });
  const userId = $('#userId').val();
  const taskName = $('#taskName').val();

  if (userId && events.length > 0 && taskName) {
    const data = { userId, taskName, events }
    $.ajax({
      url: '/events/bulk-assign',
      type: 'PUT',
      headers: {
        'X-CSRF-Token': `${$('meta[name="csrf-token"]').attr('content')}`,
      },
      data,
      success: function (data) {
        if(data.status==true){
        alert(`${taskName} Task assigned successfully`);
          location.reload();
        }
      }
    });
  }
}

if(document.getElementById('formDatas')){
  document.getElementById('formDatas').addEventListener('submit', e => {
    e.preventDefault();
  })
}

// TO CALL ROUTE FOR CHECKING THE USER CHECKOUT TIME IS EXPIRED OR NOT
// IF YES DEACTIVE THE USER AND ADD CHECKOUT TIME
setInterval(()=>{
  $.ajax('user/check/active',function(data, status){});
},10000);

// GET ATTENDANCE FOR EMPLOYEE
const getEmpAttendances=(attendances)=>{
  const select = document.getElementById("selectedUser");
  const tableBody=document.getElementById('attendanceLists');
  tableBody.innerHTML=null;
  const empId = select.options[select.selectedIndex].value;
  if(attendances.length>0 && empId){
  $.get("/users-getname/" + empId, function (empName, status) {
    if(empName){
      let count=0;
      attendances.forEach(attendance=>{
        if(attendance.userId==empId){
          const tr = document.createElement('tr');
          const td2 = document.createElement('td');
          td2.innerText = empId;
          const td3 = document.createElement('td');
          td3.innerText = empName;
          const td4 = document.createElement('td');
          td4.innerText = attendance.checkIn;
          const td5 = document.createElement('td');
          td5.innerText = attendance.breakStart;
          const td6 = document.createElement('td');
          td6.innerText = attendance.breakEnd;
          const td7 = document.createElement('td');
          td7.innerText = attendance.checkOut;
  
          tr.appendChild(td2);
          tr.appendChild(td3);
          tr.appendChild(td4);
          tr.appendChild(td5);
          tr.appendChild(td6);
          tr.appendChild(td7);
  
          tableBody.appendChild(tr);
          count++;
        }
      });
      if(count==0){
        tableBody.innerText=`Attendance Data Not Found for ${empName} :)`;
      }
    }
  })
  }
}

// // TO GET ATTENDANCE RECORD BY DATE
// if(document.getElementById('attendance-by-date')){
//   const form=document.getElementById('attendance-by-date');
//   form.addEventListener('submit',e=>{
//     e.preventDefault();  
//     const date=document.getElementById('date').value;
//     const attendanceDatas=document.getElementById('attendanceDatas').value;
//     console.log(date);
//     console.log(JSON.parse(attendanceDatas));
//   })
// }