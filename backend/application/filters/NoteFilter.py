from backend.domain.note import Note
from backend.domain.enums.noteTypes import NoteTypes
from datetime import datetime

class NoteFilter:
    def __init__(self) -> None:
        pass


    def filter_by_type(self, notes: list, note_type: enumerate) -> list:
        """Returns a filtered list of note objects by the note type that has been given."""
        filtered_list = []
        note_objects = self.__create_note_object_list(notes)

        if note_type == NoteTypes.STANDARD.value:
            for note in note_objects:
                if note.bookmark == False:
                    filtered_list.append(note)
            return filtered_list
        if note_type == NoteTypes.BOOKMARKED.value:
            for note in note_objects:
                if note.bookmark == True:
                    filtered_list.append(note)
            return filtered_list
        if note_type == NoteTypes.ALL.value:
            return note_objects
               

    def filter_by_date(self, notes: list, order_by='desc'):
        if order_by == 'decs':
            return sorted(notes, key=self.__get_creation_date)
        if order_by == 'asc':
            pass


    def __get_creation_date(self, note: dict):
        return datetime.strptime(note["creation"], "%d/%m/%Y")


    def __create_note_object_list(self, notes: list):
        note_objects = []
        for note_data in notes:
            note_object = self.__create_note_object(note_data)
            note_object.set_content_text()
            note_objects.append(note_object)
        return note_objects
    

    def __create_note_object(self, note_data: Note):
        return Note(
            note_data['id'], 
            note_data['title'], 
            note_data['content'], 
            note_data['bookmark'], 
            note_data['last_edit'],
            note_data['creation']
            )