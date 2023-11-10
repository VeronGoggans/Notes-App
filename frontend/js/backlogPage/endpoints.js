async function addBacklogItem(projectId, name, description, priority) {
    const backlogItemRequestObject = {
        "name": name,
        "description": description,
        "priority": priority
    }
    const response = await fetch(
        `/productBacklogItem/${projectId}`,
        {method: "POST", 
        body: JSON.stringify(backlogItemRequestObject),
        headers: {"Content-Type": "application/json"}
    });
    return await response.json();
}


async function updateBacklogItem(projectId, itemId, name, description, priority) {
    const backlogItemRequestObject = {
        "name": name,
        "description": description,
        "priority": priority
    }
    const response = await fetch(
        `/productBacklogItem/${projectId}/${itemId}`,
        {method: "PUT", 
        body: JSON.stringify(backlogItemRequestObject),
        headers: {"Content-Type": "application/json"}
    });
    return await response.json();
}


async function getBacklogItems(projectId) {
    const response = await fetch(`/productBacklogItems/${projectId}`);
    return await response.json();
}


async function deleteBacklogItem(projectId, itemId) {
    const response = await fetch(`/productBacklogItem/${projectId}/${itemId}`, {method: "DELETE", headers: {"Content-Type": "application/json"}});
    return await response.json();
}