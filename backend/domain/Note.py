from backend.data.fileOperations.HTMLOperations import HTMLOperations
from backend.service.dateOperations.MyDate import MyDate

class Note:
    def __init__(self, id: int, title: str, content: str, bookmark: bool, 
                 password_protected: bool, last_edit = MyDate.datetime(), creation = MyDate.date(), password = ''):
        self.id = id
        self.title = title
        self.content = content
        self.bookmark = bookmark
        self.password_protected = password_protected
        self.last_edit = last_edit
        self.creation = creation
        self.password = password

    
    def set_content_path(self):
        """
        This method takes the html content and id from the note and gives it to 
        the HTMLOperations class that will create a html file and return its path.
        The path returned from the HTMLOperations class will be set as the note content.
        """
        self.content = HTMLOperations.save(self.content, self.id)

    
    def set_content_text(self):
        """
        This method takes the content attribute (which is the path to the note content) from the note and gives it to 
        the HTMLOperations class that will read the path and return the html content that's inside the file.
        """
        self.content = HTMLOperations.load(self.content)


    def update_content(self, note_path: str, updated_html_content: str):
        """This method will update the content of a note's html file."""
        HTMLOperations.update(note_path, updated_html_content)


    def delete_note_file(self, note_path: str):
        """This method uses the note path do delete the file."""
        HTMLOperations.delete(note_path)