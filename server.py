from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from backend.src.service.dtos.NotesDTO import NoteDTO
from backend.src.service.dtos.NotesPasswordDTO import NotesPasswordsDTO
from backend.src.service.dtos.CategoryDTO import CategoryDTO
from backend.src.service.dtos.SubcategoryDTO import SubcategoryDTO
from backend.src.service.idGenerators.idGenerator import IdGenerator
from backend.src.service.security.hash import Hash

# ===================================Request classes imports below=================================== 
from backend.src.requestClasses.NoteRequest import NoteRequest

# ===================================Domain classes imports below===================================
from backend.src.service.enums.responseMessages import RespMsg
from backend.src.domains.noteDomain.category import Category
from backend.src.domains.noteDomain.subCategory import SubCategory
from backend.src.domains.noteDomain.Note import Note

app = FastAPI()
notes_dto = NoteDTO()
notes_password_dto = NotesPasswordsDTO()
category_dto = CategoryDTO()
subcategory_dto = SubcategoryDTO()
my_ID = IdGenerator()


#____________________________________[NOTES] GET METHODS____________________________________

@app.get('/categories/{rerender}')
def categories(rerender: bool):
    response = category_dto.get_categories(rerender)
    return {"status_code": RespMsg.OK, "category_names": response}


@app.get('/subcategories/{category_name}')
def subcategories(category_name: str):
    response = subcategory_dto.get_subcategories(category_name)
    return {"status_code": RespMsg.OK, "subcategory_names": response}


@app.get("/notes/{category_name}/{parent}/{rerender}")
def notes(category_name: str, parent: bool, rerender: bool):
    response = notes_dto.get_notes(category_name, parent, rerender)
    return {"status_code": RespMsg.OK, "notes": response}


@app.get('/noteById/{parent}/{id}')
def note_by_id(parent: bool, id: int):
    response = notes_dto.get_note_by_id(parent, id)
    return {"status_code": RespMsg.OK, "note": response}


@app.get('/notePasswordCheck/{id}/{password}')
def note_password_check(id: int, password: str):
    recieved_password = Hash.hash(password)
    stored_password = notes_password_dto.get_note_password(id)
    response = Hash.compare(stored_password, recieved_password)
    if response:
        return {'status_code': RespMsg.OK}
    return {'status_code': RespMsg.INVALID_PASSWORD}



#____________________________________[NOTES] POST METHODS____________________________________

@app.post('/category/{category_name}')
def category(category_name: str):
    # generating an id for the new note 
    catergory_id = my_ID.id("Category")

    # creating a new Note object 
    new_category = Category(catergory_id, category_name)
    response = category_dto.add_category(new_category)
    if response != RespMsg.INTERAL_SERVER_ERROR:
        return {'status_code': response}
    return {"status_code": RespMsg.INTERAL_SERVER_ERROR} 


@app.post('/note/{category_name}/{parent}')
def note(category_name: str, parent: bool, note_data: NoteRequest):
    # generating an id for the new note 
    note_id = my_ID.id("Note")

    # creating a new Note object 
    new_note = Note(note_id, note_data.title, note_data.content, note_data.bookmark, note_data.password_protected)
    
    # adding the note to the json file
    response = notes_dto.add_note(category_name, parent, new_note)
    if response != RespMsg.INTERAL_SERVER_ERROR:
        return {'status_code': response}
    return {"status_code": RespMsg.INTERAL_SERVER_ERROR} 


@app.post('/notePassword/{id}/{password}/{parent}')
def note_password(id: int, password: str, parent: bool):
    hashed_password = Hash.hash(password)
    response = notes_password_dto.add_note_password(id, hashed_password, parent)
    if response != RespMsg.INTERAL_SERVER_ERROR:
        return {'status_code': response}
    return {"status_code": RespMsg.INTERAL_SERVER_ERROR} 
    

@app.post('/subcategory/{category_name}/{subcategory_name}')
def subcategory(category_name: str, subcategory_name: str):
    # generating an id for the new subcategory 
    subcategory_id = my_ID.id('Subcategory')

    # creating a new subcategory object
    new_subcategory = SubCategory(subcategory_id, subcategory_name)

    response = subcategory_dto.add_subcategory(category_name, new_subcategory)
    if response != RespMsg.INTERAL_SERVER_ERROR:
        return {'status_code': response}
    return {"status_code": RespMsg.INTERAL_SERVER_ERROR} 


#____________________________________[NOTES] DELETE METHODS____________________________________

@app.delete('/note/{note_id}/{child_of_parent}')
def note(note_id: int, child_of_parent: bool):
    response = notes_dto.delete_note(note_id, child_of_parent)
    
    if response != RespMsg.INTERAL_SERVER_ERROR:
        return {'status_code': response}
    return {"status_code": RespMsg.INTERAL_SERVER_ERROR} 


@app.delete('/notePassword/{id}/{parent}')
def note_password(id: int, parent: bool):
    response = notes_password_dto.delete_note_password(id, parent)
    if response != RespMsg.INTERAL_SERVER_ERROR:
        return {'status_code': response}
    return {"status_code": RespMsg.INTERAL_SERVER_ERROR} 


@app.delete('/category/{category_id}')
def category(category_id: int):
    response = category_dto.delete_category(category_id)

    if response != RespMsg.INTERAL_SERVER_ERROR:
        return {'status_code': response}
    return {"status_code": RespMsg.INTERAL_SERVER_ERROR} 


@app.delete('/subcategory/{subcategoy_id}')
def subcategory(subcategoy_id: int):
    response = subcategory_dto.delete_subcategory(subcategoy_id)

    if response != RespMsg.INTERAL_SERVER_ERROR:
        return {'status_code': response}
    return {"status_code": RespMsg.INTERAL_SERVER_ERROR} 

#____________________________________[NOTES] UPDATE METHODS____________________________________

@app.put('/note/{note_id}/{parent}')
def note(note_id: int, parent: bool, note_data: NoteRequest):
    updated_note = Note(note_id, note_data.title, note_data.content, note_data.bookmark, note_data.password_protected) 

    response = notes_dto.update_note(parent, updated_note)

    if response != RespMsg.INTERAL_SERVER_ERROR:
        return {'status_code': 200, 'updated_note': response}
    return {"status_code": RespMsg.INTERAL_SERVER_ERROR} 


@app.put('/category/{category_id}/{category_name}')
def category(category_id: int, category_name: str):
    response = category_dto.update_category(category_id, category_name)

    if response != RespMsg.INTERAL_SERVER_ERROR:
        return {'status_code': response}
    return {"status_code": RespMsg.INTERAL_SERVER_ERROR} 


@app.put('/subcategory/{subcategory_id}/{subcategory_name}')
def subcategory(subcategory_id: int, subcategory_name: str):
    response = subcategory_dto.update_subcategory(subcategory_id, subcategory_name)

    if response != RespMsg.INTERAL_SERVER_ERROR:
        return {'status_code': response}
    return {"status_code": RespMsg.INTERAL_SERVER_ERROR} 


# Setting up a FRONT-END page for the API
app.mount("/", StaticFiles(directory=".", html=True), name="static")