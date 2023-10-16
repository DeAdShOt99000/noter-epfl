(function(){
    "use strict";

    const cont = document.getElementById("container");
    const notesContainer = document.querySelector('.notes-container')


    function toggleFavorite(firstName, pk, starElement){
        fetch(`toggle-favorite/${firstName}/${pk}`)
        .then(response => response.json())
        .then(data => {
            starElement.src = data.favorite ? '/static/img/gold-star-logo.png' :'/static/img/star-logo.png';
        })
    };

    // function deleteNote(pk, noteElement){
    //     fetch(`delete/${pk}`)
    //     .then(function(){
    //         notesContainer.removeChild(noteElement)
    //         if (notesContainer.children.length < 1){
    //             noNotesAddNote.style.display = 'block'
    //         }
    //     })
    // }

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    function prettyDate(dateStr){
        const dateObj = new Date(dateStr)
        return `${weekDays[dateObj.getDay()]} ${dateObj.getDate()} ${months[dateObj.getMonth()]}, ${dateObj.getFullYear()} ${prettyTime(dateObj)}`
    }

    function prettyTime(timeObj){
        let hour = timeObj.getHours()
        const minutes = timeObj.getMinutes() < 10 ? `0${timeObj.getMinutes()}`: timeObj.getMinutes().toString();
        let AmPm = 'am'
        if (hour >= 12){
            hour = hour - 12
            AmPm = 'pm'
        }
        if (hour == '00'){
            hour = 12
        }
        return `${hour}:${minutes} ${AmPm}`
    }

    function createNote(firstName, noteObj, newEntry=false){
        const noteElement = document.createElement('div')
        noteElement.className = 'note-element'
        noteElement.id = noteObj.id

        const noteSubject = document.createElement('div')
        noteSubject.className = 'note-subject'
        noteSubject.setAttribute('contenteditable', 'true')
        noteSubject.innerText = noteObj.subject

        const noteText = document.createElement('div')
        noteText.className = 'note-text'
        noteText.setAttribute('contenteditable', 'true')
        noteText.innerText = noteObj.note
        
        const noteDates = document.createElement('div')
        noteDates.className = 'note-dates'
        
        const createdSpan = document.createElement('span')
        createdSpan.className = 'created-span'
        createdSpan.innerText = 'Created at: '
        
        const cDateText = document.createElement('span')
        cDateText.className = 'date-text'
        cDateText.id = `c${noteObj.created_at}`
        cDateText.innerText = prettyDate(noteObj.created_at)
        
        const updatedSpan = document.createElement('span')
        updatedSpan.className = 'updated-span'
        updatedSpan.innerText = 'Updated at: '
        
        const uDateText = document.createElement('span')
        uDateText.className = 'date-text'
        uDateText.id = `u${noteObj.updated_at}`
        uDateText.innerText = prettyDate(noteObj.updated_at)

        const deleteLogo = document.createElement('img')
        deleteLogo.classList = 'delete-logo'
        deleteLogo.src = '/static/img/delete-logo.png'
        
        const starLogo = document.createElement('img')
        starLogo.className = 'star-logo'
        starLogo.src = noteObj.favorite ? '/static/img/gold-star-logo.png' :'/static/img/star-logo.png';
        starLogo.alt = 'Favorite button'
        
        createdSpan.appendChild(cDateText)
        updatedSpan.appendChild(uDateText)
        
        noteDates.appendChild(createdSpan)
        noteDates.appendChild(document.createElement('br'))
        noteDates.appendChild(updatedSpan)
        noteDates.appendChild(deleteLogo)
        noteDates.appendChild(starLogo)
        
        noteElement.appendChild(noteSubject)
        noteElement.appendChild(noteText)
        noteElement.appendChild(noteDates)
        
        if (newEntry){
            notesContainer.prepend(noteElement)
        } else {
            notesContainer.appendChild(noteElement)
        }
                
        // noteText.onfocus = function(){updateOnSwitch(this)}
        // noteText.oninput = waitAndSave
        
        // noteSubject.onfocus = function(){updateOnSwitch(this)}
        // noteSubject.oninput = waitAndSave
        
        starLogo.onclick = function(){toggleFavorite(firstName, noteObj.id, starLogo)}
        // deleteLogo.onclick = function(){deleteNote(noteObj.id, noteElement)}
    }

    const firstName = localStorage.getItem("first-name")
    if (firstName){
        const welcome = document.getElementsByClassName("user-logo")[0];
        welcome.innerText = `Welcome ${firstName}!`;
        
        const signout = document.getElementById("signout");
        signout.addEventListener("click", function(){
            localStorage.removeItem("first-name");
            window.location = "";
        });

        fetch(`/all-notes/${firstName}`)
        .then(response => response.json())
        .then(data => {
            for (let entry in data){
                createNote(firstName, data[entry])
            }
        })

        
        
    } else {
        cont.innerHTML = `
        <form action="">
            <span class="app-name">Noter</span>
            <input type="text" id="text" placeholder="Enter your first name...">
            <input type="submit" id="submit" value="Submit">
        </form>
        `
        const btn = document.getElementById("submit");
        const inp = document.getElementById("text");

        btn.addEventListener("click", function(){
            localStorage.setItem("first-name", inp.value);
        });
    };
})();