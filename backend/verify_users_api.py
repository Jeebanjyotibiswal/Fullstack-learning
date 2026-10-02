from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

post_response = client.post(
    '/users/',
    json={'username': 'jeeban', 'email': 'jeeban@example.com', 'age': 22},
)
print('POST', post_response.status_code, post_response.json())

get_response = client.get('/users/')
print('GET', get_response.status_code, len(get_response.json()))
