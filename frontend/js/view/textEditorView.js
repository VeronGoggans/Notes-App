import { NoteDetailContainer } from "../components/noteDetailContainer.js";
import { DeleteContainer } from "../components/deleteContainer.js";

export class TextEditorView {
  constructor(textEditorController) {
    this.textEditorController = textEditorController;
    // toolbar top
    this.noteNameInput = document.querySelector('.note-name-input');

    // toolbar middle
    this.noteDropdown = document.querySelector('.file-dropdown');
    this.noteDropdownOptions = this.noteDropdown.querySelector('.options');
    this.noteDetailsSpan = document.querySelector('.note-details-span');
    this.deleteNoteSpan = document.querySelector('.delete-note-span');

    this.exitButton = document.querySelector('.exit-text-editor-btn');
    this.saveButton = document.querySelector('.save-note-btn');

    // toolbar bottom
    this.headingButton = document.querySelector('.heading-button');
    this.headingDropdown = document.querySelector('.heading-dropdown');
    this.headingDropdownOptions = this.headingDropdown.querySelector('.options');

    // other
    this.textEditor = document.querySelector('.editor-wrapper');
    this.page = document.querySelector('.editor');
    this.dialog = document.querySelector('.dialog');

    this.attachEventListeners();
  }

  attachEventListeners() {
    this.noteDropdown.addEventListener('click', () => {this.toggleVisibleDropdown(this.noteDropdownOptions)});
    this.headingDropdown.addEventListener('click', () => {this.toggleVisibleDropdown(this.headingDropdownOptions)});
    this.noteDetailsSpan.addEventListener('click', () => {this.renderNoteDetails()});
    this.deleteNoteSpan.addEventListener('click', () => {this.renderNoteDeleteContainer()});
    this.exitButton.addEventListener('click', () => {this.removeTextEditor()});
    this.saveButton.addEventListener('click', () => {this.handleSaveButtonClick()});


    this.headingDropdownOptions.addEventListener('click', (event) => {
      if (event.target.matches('span')) {
        // Get the text content of the clicked heading option
        const selectedHeading = event.target.textContent;
        this.applyHeading(selectedHeading);
      }
    });
  }

  /**
   * This method toggles the visibility of a specified dropdown,
   * by toggling the visibility style property.
   */
  toggleVisibleDropdown(dropdownOptions) {
    dropdownOptions.style.visibility = dropdownOptions.style.visibility === 'visible' ? 'hidden' : 'visible';
  }

  /**
   * This method shows the text editor,
   * by setting the visibility style property to visible
   */
  show() {
    // Turn text editor visible
    this.textEditor.style.visibility = 'visible';
    this.textEditor.style.top = '0%';
  }

  /**
   * This method opens a note inside the text editor.
   * 
   * @param {String} content 
   * @param {String} name 
   */
  open(content, name) {
    this.page.innerHTML = content;
    this.noteNameInput.value = name;
    this.show();
  }

   /**
   * This method removes all the content in the text editor.
   */
   clear() {
    this.page.innerHTML = '';
    this.noteNameInput.value = '';
  }

  handleSaveButtonClick() {
    const CONTENT = this.page.innerHTML;
    let name = this.noteNameInput.value;
    if (name === '') name = 'untitled';
    this.removeTextEditor();
    this.textEditorController.handleSaveButtonClick(CONTENT, name);
  }

  /**
   * This method hides the text editor,
   * by setting the visibility style property to hidden
   */
  removeTextEditor() {
    // Turn text editor invisible
    this.textEditor.style.top = '100%';
    this.textEditor.style.visibility = 'hidden';
    this.clear();
  }


  // The following methods are related to the file dropdown menu.

  /**
   * This method renders the note details container showing the following.
   * 1. Word count.
   * 2. When the note was created.
   * 3. The last time the not was edited.
   */
  renderNoteDetails() {
    const NOTE_DATA = this.getNoteData();
    this.dialog.appendChild(new NoteDetailContainer(NOTE_DATA[1], NOTE_DATA[2]))
    this.renderDialog();
  }

  /**
   * This method renders the delete container from within the editor.
   */
  renderNoteDeleteContainer() {
    const NOTE_DATA = this.getNoteData();
    const ID = NOTE_DATA[0];
    this.dialog.appendChild(new DeleteContainer(ID, this.noteNameInput.value, this))
    this.renderDialog();
  }

  /**
   * 
   * @returns a list of note data stored in the text editor model
   */
  getNoteData() {
    return this.textEditorController.getStoredNoteData();
  }

  /**
     * This method renders the dialog.
     */
  renderDialog() {
    this.dialog.style.visibility = 'visible';
    this.dialog.style.top = '0%';
  }

  /**
   * This method removes the child of the dialog and the dialog itself from the UI.
   */
  removeDialog() {
      this.dialog.style.visibility = 'hidden';
      this.dialog.style.top = '100%';
      const CHILD = this.dialog.firstChild;
      this.dialog.removeChild(CHILD);
  }  
}