(function(){
    "use strict";

    const notesContainer = document.querySelector('.notes-container')

    function highlight(text, word){
        let lowerText = text.toLowerCase();
        word = word.toLowerCase();

        if (word.length > 0){
            let start = 0
            let indecies = []
            let currentInd;
            let inLst;
            
            while (lowerText.indexOf(word, start) != -1){
                currentInd = lowerText.indexOf(word, start)
                inLst = []

                start = currentInd + 1
                while (lowerText.indexOf(word, start) != -1 && (lowerText.indexOf(word, start) - currentInd) < word.length){
                    inLst.push(currentInd)
                    currentInd = lowerText.indexOf(word, start)
                    start = currentInd + 1
                }
                if (inLst.length > 0){
                    inLst.push(currentInd)
                    indecies.push(inLst)
                } else {
                    indecies.push(currentInd)
                    currentInd = lowerText.indexOf(word, start)
                }
            }
    
            const opening = '<span style="background-color: rgb(47, 47, 47); color: white;">'
            const closing = '</span>'
            
            let newText = text
            let incrementor = 0

            let ind1;
            let ind2;
            for (let ind of indecies){
                if (Array.isArray(ind)){
                    ind1 = ind[0] + incrementor
                    ind2 = word.length + (incrementor + ind[ind.length - 1])
                } else {
                    ind1 = ind + incrementor
                    ind2 = word.length + ind1
                }
                newText = newText.slice(0, ind1) + opening + newText.slice(ind1, ind2) + closing + newText.slice(ind2);
                incrementor += (opening + closing).length
            }
            return newText
        }
        return text
    }

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
            document.body.removeChild(document.querySelector('.loading'));
            if (Object.keys(data).length < 1){
                noNotesAddNote.style.display = 'block';
            } else {
                for (let entry in data){
                    createNote(firstName, data[entry]);
                }
            }
        })

        document.querySelector('.add-note').onclick = function(){addNoteBtn(firstName)};
        noNotesAddNote.querySelector('span').onclick = function(){addNoteBtn(firstName)};

        const search = document.querySelector('.search');
        search.addEventListener('input', function(){
            for (let elem of document.querySelectorAll('.note-element')){
                if (elem.querySelector('.note-subject').innerText.toLowerCase().includes(search.value.toLowerCase()) || elem.querySelector('.note-text').innerText.toLowerCase().includes(search.value.toLowerCase())){
                    elem.querySelector('.note-subject').innerHTML = highlight(elem.querySelector('.note-subject').innerText, search.value)
                    elem.querySelector('.note-text').innerHTML = highlight(elem.querySelector('.note-text').innerText, search.value)
                    elem.style.display = 'block'
                } else {
                    elem.style.display = 'none'
                }
            }
        });

        const sortBy = document.getElementById('sort-by')

        const sortAsc = document.getElementById('asc')
        const sortAscLabel = document.querySelector(`label[for="${sortAsc.id}"]`)
        
        const sortDes = document.getElementById('des')
        const sortDesLabel = document.querySelector(`label[for="${sortDes.id}"]`)

        sortBy.addEventListener('change', function(){
            switch (sortBy.value){
                case 'date-created':
                    setSortBy('date-created')
                    break;
                case 'subject':
                    setSortBy('subject')
                    break;
                case 'favorite':
                    setSortBy('favorite')
                    break;
                }
            })
    
        document.querySelectorAll('.sort-order').forEach(each => {
            each.addEventListener('change', function(){
                setSortBy(sortBy.value, each.id)
            })
        })
    
        function setSortBy(selectedSort, order='asc'){
            let newArray = [...notesContainer.children]
            switch (selectedSort){
                case 'date-created':
                    sortAscLabel.innerText = 'Older to Newer'
                    sortDesLabel.innerText = 'Newer to Older'
                    
                    newArray.sort((elem1, elem2) => {
                        const date1 = new Date(elem1.querySelector('.created-span .date-text').id.slice(1));
                        const date2 = new Date(elem2.querySelector('.created-span .date-text').id.slice(1));
                        return toggleAndReturn(order, date1, date2)
                    }); break;
    
                case 'subject':
                    sortAscLabel.innerText = 'A to Z'
                    sortDesLabel.innerText = 'Z to A'
                    
                    newArray.sort((elem1, elem2) => {
                        const subject1 = elem1.querySelector('.note-subject').innerText;
                        const subject2 = elem2.querySelector('.note-subject').innerText;
                        return toggleAndReturn(order, subject1, subject2, true)
                    }); break;
                    
                case 'favorite':
                    sortAscLabel.innerText = 'Favorite first'
                    sortDesLabel.innerText = 'Favorite last'
    
                    newArray.sort((elem1, elem2) => {
                        const fav1 = elem1.querySelector('.star-logo').src.includes('gold') ? 0: 1;
                        const fav2 = elem2.querySelector('.star-logo').src.includes('gold') ? 0: 1;
                        return toggleAndReturn(order, fav1, fav2)
                    }); break;
            }
            notesContainer.innerHTML = ''
            newArray.forEach(elem => notesContainer.appendChild(elem))
        }
    
        function toggleAndReturn(order, a, b, string=false){
            switch (order){
                case 'asc':
                    sortDes.checked = false
                    sortAsc.checked = true
                    if (string){
                        return a.localeCompare(b)
                    }
                    return a - b;
                case 'des':
                    sortAsc.checked = false
                    sortDes.checked = true
                    if (string){
                        return b.localeCompare(a)
                    }
                    return b - a;
            }
        }
        
    } else {
        document.body.innerHTML = `
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