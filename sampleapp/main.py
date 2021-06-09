# serve HTML with FASTAPI
from fastapi import FastAPI

app = FastAPI()

# read the content of the HTML file 
html = ""
with open('index.html', 'r') as f:
    html = f.read()

@app.get("/")
async def get():
    return HTMLResponse(html)


# to differentiate between clients
from typing import List
from fastapi import FastAPI, WebSocket
from starlette.websockets import WebSocket
from fastapi.responses import HTMLResponse


# class used to handle the connection to different clients
class ConnectionManager:
    def __init__(self):
        self.connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.connections.append(websocket)

    async def broadcast(self, data: str):
        for connection in self.connections:
            await connection.send_json(data)


manager = ConnectionManager()


@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: int):
    await manager.connect(websocket)
    while True:
        data = await websocket.receive_json()
        await manager.broadcast(f"Client {client_id}: {data}")