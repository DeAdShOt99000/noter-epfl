import flask
import json

app = flask.Flask("note-app")

# def get_html(file_name):
#     with open(f"{file_name}.html") as file:
#         return file.read()

@app.route("/")
def home():
    return flask.render_template("home.html")

@app.route("/all-notes/<firstname>")
def all_notes(firstname):
    with open("db.json") as db:
        data = json.loads(db.read())[firstname]
        return data
    
@app.route("/toggle-favorite/<firstname>/<id>")
def toggle_favorite(firstname, id):
    with open("db.json") as db:
        data = json.loads(db.read())[firstname]
        for entry in data:
            if entry["id"] == id:
                entry["id"] = 1 if entry["id"] == 0 else 0
        return {"message": "success"}