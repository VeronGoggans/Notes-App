import { Folder } from '../components/folder.js';
import { ListFolder } from '../components/listFolder.js';
import { DeleteFolderContainer } from '../components/deleteFolderContainer.js';


export class FolderView {
    constructor(folderController) {
        this.folderController = folderController;
        this._content = document.querySelector('.content-view');
        this._list = document.querySelector('.list-content');
        this._cover = document.querySelector('.cover');
        this.dialog = document.querySelector('.dialog');

    }

    renderListViewFolders(folders) {
        for (let i = 0; i < folders.length; i++) {
            const ID = folders[i].id;
            const NAME = folders[i].name;
            const FOLDER_CARD = this.listFolder(ID, NAME);
            this._list.appendChild(FOLDER_CARD);
        }
    }

    renderFolders(folders) {
        for (let i = 0; i < folders.length; i++) {
            const ID = folders[i].id;
            const NAME = folders[i].name;
            const FOLDER_CARD = this.folder(ID, NAME);
            this._content.appendChild(FOLDER_CARD);
        }
    }

    renderFolder(folder) {
        const ID = folder.id;
        const NAME = folder.name;
        const FOLDER_CARD = this.folder(ID, NAME);
        this._content.appendChild(FOLDER_CARD);
        this.removeDialog();
    }

    listFolder(id, name) {
        return new ListFolder(id, name, this);
    }

    folder(id, name) {
        return new Folder(id, name, this);
    }

    async updateFolder(id, name) {
        await this.folderController.updateFolder(id, name);
    }

    async handleConfirmButtonClick(id) {
        await this.folderController.deleteFolder(id);
    }


    /**
     * Takes the user into a folder and displays the notes inside it.
     * 
     * This method is triggered when a folder card is clicked. It removes all existing folders from the screen
     * using {@link removeContent}, and then it navigates into the specified folder, displaying its notes and subfolders
     * using {@link navigateIntoFolder}.
     * 
     * @param {string} id - The ID of the folder to navigate into.
     */
    handleFolderCardClick(id) {
        this.removeContent();
        this.folderController.navigateIntoFolder(id);
    }

    /**
     * Removes a specific folder from the UI.
     *
     * This method removes the folder from the UI that it has been given.
     * @param {number} id the ID of the folder to be removed from the UI.
     * @returns {void}
     */
    removefolder(folder) {
        const ALL_FOLDERS = this._content.children;
        const ID = folder.id
        for (let i = 0; i < ALL_FOLDERS.length; i++) {
            if (ALL_FOLDERS[i].id === ID) {
                this._content.removeChild(ALL_FOLDERS[i]);
                this._list.querySelector(`#${ID}`);
            }
        }
        this.removeDialog();
    }

    /**
     * Removes folders from the UI.
     *
     * This method removes all the child elements from the content html div and list-view html div
     *
     * @returns {void}
     */
    removeContent() {
        const CONTENT = this._content;
        const LIST = this._list;
        while (CONTENT.firstChild) CONTENT.removeChild(CONTENT.firstChild);
        while (LIST.firstChild) LIST.removeChild(LIST.firstChild);
    }

    back() {
        this.removeContent();
        this.folderController.navigateOutofFolder();
    }

    renderDeleteFolderContainer(id, name) {
        this.dialog.appendChild(new DeleteFolderContainer(id, name, this));
        this.renderDialog();
    }

    renderDialog() {
        this.dialog.style.visibility = 'visible';
        this.dialog.style.top = '0%';
    }

    removeDialog() {
        this.dialog.style.visibility = 'hidden';
        this.dialog.style.top = '100%';
        const CHILD = this.dialog.firstChild;
        this.dialog.removeChild(CHILD);
    }
}