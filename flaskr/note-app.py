import flask
import json

app = flask.Flask("note-app")

# def get_html(file_name):
#     with open(f"{file_name}.html") as file:
#         return file.read()

@app.route("/")
def home():
    return flask.render_template("home.html")

@app.route("/<firstname>")
def all_notes(firstname):
    with open("db.json") as db:
        data = json.loads(db.read())[firstname]
        return data
    
@app.route("/toggle-favorite/<firstname>/<id>")
def toggle_favorite(firstname, id):
    with open("db.json", "r+") as db:
        data = json.loads(db.read())
        for entry in data[firstname]:
            if entry["id"] == id:
                entry["favorite"] = 1 if entry["favorite"] == 0 else 0
        db.seek(0)
        db.write(json.dumps(data, indent=4))
        db.truncate()
        return {"favorite": entry["favorite"]}
    
@app.route("/delete-note/<firstname>/<id>")
def delete_note(firstname, id):
    with open("db.json", "r+") as db:
        data = json.loads(db.read())
        new_lst = []
        for entry in data[firstname]:
            if entry["id"] != id:
                new_lst.append(entry)
        data[firstname] = new_lst.copy()
        db.seek(0)
        db.write(json.dumps(data, indent=4))
        db.truncate()
        return {"message": "success"}
    
@app.route("/add-note/<firstname>", methods=("get", "post"))
def add_note(firstname):
    with open("db.json", "r+") as db:
        data = json.loads(db.read())
        id = len(data[firstname]) + 1
        subject = flask.request.json.get("subject")
        note = flask.request.json.get("note")
        created_at = flask.request.json.get("createdAt")
        entry = {
            "id": id,
            "subject": subject if subject else "No Subject",
            "note": note if note else "Empty note",
            "created_at": created_at,
            "favorite": 0
        }
        data[firstname].append(entry)
        db.seek(0)
        db.write(json.dumps(data, indent=4))
        db.truncate()
        return entry
    