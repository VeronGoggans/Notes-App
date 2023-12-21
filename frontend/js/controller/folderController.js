import { FolderView } from '../view/folderView.js';
import { FolderModel } from '../model/folderModel.js';

export class FolderController {
    constructor(applicationController) {
        this.applicationController = applicationController;
        this.folderView = new FolderView(this);
        this.folderModel = new FolderModel();
    }

    async getFolders() {
        const RESPONSE = await this.folderModel.getFolders('/folders');
        const FOLDERS = RESPONSE.folders;
        this.folderView.renderFolders(FOLDERS);
        this.folderView.renderListViewFolders(FOLDERS);
    }


    async addFolder(name) {
        const RESPONSE = await this.folderModel.addFolder('/folder', name);
        const FOLDER = RESPONSE.Object;
        this.folderView.renderFolder(FOLDER);
    }


    async updateFolder(folderId, newName) {
        const RESPONSE = await this.folderModel.updateFolder('/folder', folderId, newName);
        const FOLDER = RESPONSE.Object;
    }


    async deleteFolder(folderId) {
        const RESPONSE = await this.folderModel.deleteFolder('/folder', folderId);
        const FOLDER = RESPONSE.Object;
        this.folderView.removefolder(FOLDER);
    }

    async navigateOutofFolder() {
        this.applicationController.navigateOutofFolder();
    }

    async navigateIntoFolder(folderId) {
        this.applicationController.navigateIntoFolder(folderId);
    }
}