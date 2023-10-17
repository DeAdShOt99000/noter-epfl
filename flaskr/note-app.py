import flask
import json

app = flask.Flask("note-app")

@app.route("/")
def home():
    return flask.render_template("home.html")

@app.route("/<firstname>")
def all_notes(firstname):
    with open("db.json", "r+") as db:
        data = json.loads(db.read())
        if firstname not in data:
            data[firstname] = []
            db.seek(0)
            db.write(json.dumps(data, indent=4))
            db.truncate()
        return data[firstname]
    
@app.route("/toggle-favorite/<firstname>/<id>")
def toggle_favorite(firstname, id):
    with open("db.json", "r+") as db:
        data = json.loads(db.read())
        for entry in data[firstname]:
            if entry["id"] == int(id):
                entry["favorite"] = 0 if entry["favorite"] else 1
                returnDict = {"favorite": entry["favorite"]}
        db.seek(0)
        db.write(json.dumps(data, indent=4))
        db.truncate()
        return returnDict
    
@app.route("/delete-note/<firstname>/<id>")
def delete_note(firstname, id):
    with open("db.json", "r+") as db:
        data = json.loads(db.read())
        new_lst = []
        for entry in data[firstname]:
            if entry["id"] != int(id):
                new_lst.append(entry)
        data[firstname] = new_lst.copy()
        db.seek(0)
        db.write(json.dumps(data, indent=4))
        db.truncate()
        return {"message": "success"}
    
@app.route("/add-note/<firstname>", methods=("get", "post"))
def add_note(firstname):
    firstname = firstname.lower()
    with open("db.json", "r+") as db:
        data = json.loads(db.read())
        id = data["id_tracker"] + 1
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
        data["id_tracker"] += 1
        db.seek(0)
        db.write(json.dumps(data, indent=4))
        db.truncate()
        return entry
    