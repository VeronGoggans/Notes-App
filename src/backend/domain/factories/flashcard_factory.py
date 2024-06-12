import re
from src.backend.domain.flashcard import Flashcard

class FlashcardFactory:

    @staticmethod
    def deserialize_flashcards(file_path):
        flashcards = []

        with open(file_path, 'r', encoding='utf-8') as file:
            text = file.read()

        sections = re.split(r'\n\n+', text)
        for section in sections:
            lines = section.split('\n')
            if len(lines) >= 2:
                name = lines[0]
                content = '\n'.join(lines[1:])
                flashcard = Flashcard(name, content)
                flashcards.append(flashcard)

        return flashcards