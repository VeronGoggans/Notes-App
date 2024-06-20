import { Note } from "../components/note.js";
import { DeleteModal } from "../components/modals/deleteModal.js";
import { NoteObjectArray } from "../util/array.js";
import { dateFormat } from "../util/date.js";
import { formatName, filterNotePreview } from "../util/formatters.js";
import {AnimationHandler} from "../handlers/animation/animationHandler.js";
import { DragAndDrop } from "../handlers/drag&drop/dragAndDropHandler.js";


export class NoteView {
    constructor(noteController, applicationController, dialog, notificationHandler) {
        this.noteController = noteController;
        this.applicationController = applicationController;
        this.notificationHandler = notificationHandler;
        this.dialog = dialog;
        this.noteObjects = new NoteObjectArray();
        this.dragAndDrop = new DragAndDrop(this);

        this.#initializeDomElements();
    }

    
    renderAll(notes) {
        this.noteObjects.clear();
        if (notes.length > 0) { 
            const contentFragment = document.createDocumentFragment();

            for (let i = 0; i < notes.length; i++) {
                const NOTE_CARD = this.#note(notes[i]);

                contentFragment.appendChild(NOTE_CARD);
                AnimationHandler.fadeInFromBottom(NOTE_CARD);
            }
            this._content.appendChild(contentFragment);
        } else {
            this.pushNotification('empty');
        }
    }

    
    renderOne(note) {
        const noteCard = this.#note(note);
        this._content.appendChild(noteCard);
        AnimationHandler.fadeInFromBottom(noteCard);
    }


    renderUpdate(note) {
        const cards = this._content.children 

        for (let i = 0; i < cards.length; i++) {
            if (cards[i].id === note.id) {

                const notePreview = cards[i].querySelector('p');
                notePreview.innerHTML = filterNotePreview(note.content);

                const noteName = cards[i].querySelector('h4');
                noteName.textContent = formatName(note.name);

                cards[i].setAttribute("data-info", `${dateFormat(note.creation)}--${dateFormat(note.last_edit)}`);

                this.noteObjects.update(note);
            }
        }
    }

    
    renderDelete(note, closeDialog = true) {
        const cards = this._content.children;

        for (let i = 0; i < cards.length; i++) {
            if (cards[i].id === note.id) {
                AnimationHandler.fadeOutCard(cards[i], this._content);
                this.noteObjects.remove(note);
            }
        }
        if (closeDialog) this.dialog.hide();
    }

    
    handleNoteCardClick(noteId) {
        const note = this.noteObjects.get(noteId);
        note.last_edit = dateFormat(note.last_edit)
        this.applicationController.openNoteInTextEditor(note);
    }

    /**
     * This method updates the stored object of a given note
     * @param {Dict} note 
     */
    update(note) {
        this.noteObjects.update(note);
    }

    getNoteObject(noteId) {
        return this.noteObjects.get(noteId);
    }

   /**
    * type has to be one of the following 
    * (saved, deleted, new, empty).
    * 
    * noteName is optional and only nessecary for the 
    * deleted type.
    * 
    * @param {String} type 
    * @param {String} noteName 
    */
    pushNotification(type, noteName = null) {
        if (type === 'empty' && this._content.children.length === 0) {
            this.notificationHandler.push(type, noteName);
        } 
        if (type !== 'empty') {
            this.notificationHandler.push(type, noteName);
        }
    }

    /**
     * This method renders a confirmation container 
     * telling the user if they want to delete the note.
     * 
     * @param {String} id 
     * @param {String} name
     */
    renderDeleteContainer(id, name) {
        this.dialog.addChild(new DeleteModal(id, name, this));
        this.dialog.show();
    }

    /**
     * This method creates a note card component 
     * And adds a note object to the noteObjects array. 
     * 
     * @param {Object} note 
     * @returns A note card component.
     */
    #note(note) {
        this.noteObjects.add(note);
        return new Note(note, this);
    }

    #initializeDomElements() {
        this._content = document.querySelector('.content-view');
    }

    async updateNote(id, name, content, bookmark, favorite, color) {
        await this.noteController.updateNote(id, name, content, bookmark, favorite, color);
    }

    async handleDeleteButtonClick(id) {
        await this.noteController.deleteNote(id);
    }
}