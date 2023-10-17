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

    function deleteNote(firstName, pk, noteElement){
        fetch(`delete-note/${firstName}/${pk}`)
        .then(function(){
            notesContainer.removeChild(noteElement)
            if (notesContainer.children.length < 1){
                noNotesAddNote.style.display = 'block'
            }
        })
    }

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
        noteSubject.innerText = noteObj.subject

        const noteText = document.createElement('div')
        noteText.className = 'note-text'
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
        
        const deleteLogo = document.createElement('img')
        deleteLogo.classList = 'delete-logo'
        deleteLogo.src = '/static/img/delete-logo.png'
        
        const starLogo = document.createElement('img')
        starLogo.className = 'star-logo'
        starLogo.src = noteObj.favorite ? '/static/img/gold-star-logo.png' :'/static/img/star-logo.png';
        starLogo.alt = 'Favorite button'
        
        createdSpan.appendChild(cDateText)
        
        noteDates.appendChild(createdSpan)
        noteDates.appendChild(document.createElement('br'))
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
        deleteLogo.onclick = function(){deleteNote(firstName, noteObj.id, noteElement)}
    }

    const noNotesAddNote = document.querySelector('.no-notes-add-note')

    function addNoteBtn(firstName){
        noNotesAddNote.style.display = 'none'

        const newNoteForm = document.createElement('div')
        newNoteForm.className = 'note-element note-form'

        const noteSubject = document.createElement('div')
        noteSubject.className = 'note-subject'
        noteSubject.setAttribute('contenteditable', 'true')

        const noteText = document.createElement('div')
        noteText.className = 'note-text'
        noteText.setAttribute('contenteditable', 'true')

        const noteDates = document.createElement('div')
        noteDates.className = 'note-dates'
        noteDates.innerText = 'New Note'
        
        const saveNote = document.createElement('button')
        saveNote.className = 'save-note'
        saveNote.innerText = 'Save'
        saveNote.onclick = function(){addNewNote(firstName)}

        newNoteForm.appendChild(noteSubject)
        newNoteForm.appendChild(noteText)
        newNoteForm.appendChild(noteDates)
        newNoteForm.appendChild(saveNote)

        notesContainer.prepend(newNoteForm)
        noteSubject.focus()

    }

    function addNewNote(firstName){
        const subjectText = document.querySelector('.note-form .note-subject').innerText
        const noteText = document.querySelector('.note-form .note-text').innerText

        if (subjectText != '' || noteText != ''){
            const data = {createdAt: new Date()}
            if (subjectText){
                data.subject = subjectText
            }
            if (noteText){
                data.note = noteText
            }
            fetch(`/add-note/${firstName}`, {
                method: 'post',
                body: JSON.stringify(data),
                headers: {
                    'Content-type': 'application/json',
                }
            })
            .then(response => response.json())
            .then(data => {
                createNote(firstName, data, true)
                notesContainer.removeChild(document.querySelector('.note-form'))
            })
        } else {
            notesContainer.removeChild(document.querySelector('.note-form'))
        }
        if (notesContainer.children.length < 1){
            noNotesAddNote.style.display = 'block'
        }
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

        fetch(`/${firstName}`)
        .then(response => response.json())
        .then(data => {
            for (let entry in data){
                createNote(firstName, data[entry])
            }
        })

        document.querySelector('.add-note').onclick = function(){addNoteBtn(firstName)};
        
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