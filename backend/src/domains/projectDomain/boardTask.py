class BoardTask():
    def __init__(self, id:int, name: str, description: str, estimated_time: str, due_date: str, priority: bool, board_section: str):
        self.id = id
        self.name = name
        self.description = description
        self.estimated_time = estimated_time
        self.due_date = due_date
        self.priority = priority
        self.board_section = board_section


    def set_due_date(self):
        pass

    
    
    # This method toggles the priority of a task. 
    def set_priority(self):
        self.priority = not self.priority  

    def get_board_section(self):
        return self.board_section  