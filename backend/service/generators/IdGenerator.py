from backend.service.fileOperations.JsonOperations import Json
import os


class IdGenerator:
    def __init__(self) -> None:
        pass

    
    @staticmethod
    def ID(entity_name: str):
        """
        Generate a unique identifier for a specified entity type.
        Entity types [Note, Directory, SubDirectory]. 
        Both uppercase/lowercase work.

        Args:
            entity_name (str): The name of the entity for which to generate the unique identifier.

        Returns:
            Union[int, str]: 
            - If successful, it returns the generated unique identifier.
            - If the specified entity does not exist yet, it returns a message indicating that the entity does not exist.
        """
        path_to_id_file = os.getcwd() + "/storage/id.json"

        data = Json.load_json_file(path_to_id_file)
        unique_id = None

        for entity in data['ids']:
            if entity['entityName'] == entity_name:
                unique_id = entity['id']
                entity['id'] = unique_id + 1
                Json.update_json_file(path_to_id_file, data)
                return unique_id
        return "Entity does not exist yet"