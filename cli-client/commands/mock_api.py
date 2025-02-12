from flask import Flask, jsonify, request

app = Flask(__name__)

# Mock endpoints
@app.route('/api/admin/healthcheck', methods=['GET'])
def healthcheck():
    return jsonify({"status": "ok"})

@app.route('/api/admin/resetpasses', methods=['POST'])
def resetpasses():
    return jsonify({"message": "Passes have been reset successfully."})

@app.route('/api/admin/resetstations', methods=['POST'])
def resetstations():
    return jsonify({"message": "Stations Reset Successfully"})

@app.route('/api/tollStationPasses/<station>/<from_date>/<to_date>', methods=['GET'])
def tollstationpasses(station, from_date, to_date):
    format = request.args.get('format', 'json')
    return jsonify({
        "station": station,
        "from_date": from_date,
        "to_date": to_date,
        "format": format,
        "data": [{"id": 1, "pass": "A123"}, {"id": 2, "pass": "B456"}]
    })

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    if username == "admin" and password == "admin":
        return jsonify({"message": "Login successful", "token": "mock-token"})
    return jsonify({"message": "Invalid credentials"}), 401

@app.route('/api/logout', methods=['POST'])
def logout():
    return jsonify({"message": "Logout successful"})

@app.route('/api/passanalysis/<stationop>/<tagop>/<from_date>/<to_date>', methods=['GET'])
def passanalysis(stationop, tagop, from_date, to_date):
    stationop = request.args.get('stationop')
    tagop = request.args.get('tagop')
    from_date = request.args.get('from_date')
    to_date = request.args.get('to_date')
    format = request.args.get('format', 'json')
    return jsonify({
        "stationop": stationop,
        "tagop": tagop,
        "from_date": from_date,
        "to_date": to_date,
        "format": format,
        "analysis": [{"id": 1, "result": "pass"}, {"id": 2, "result": "fail"}]
    })

@app.route('/api/passescost/<stationop>/<tagop>/<from_date>/<to_date>/<opid>', methods=['GET'])
def passescost(stationop, tagop, from_date, to_date, opid):
    stationop = request.args.get('stationop')
    tagop = request.args.get('tagop')
    from_date = request.args.get('from_date')
    to_date = request.args.get('to_date')
    opid = request.args.get('opid')
    return jsonify({
        "stationop": stationop,
        "tagop": tagop,
        "from_date": from_date,
        "to_date": to_date,
        "opid": opid,
        "total_cost": 123.45
    })

@app.route('/api/chargesby/<opid>/<from_date>/<to_date>', methods=['GET'])
def chargesby(opid, from_date, to_date):
    from_date = request.args.get('from_date')
    to_date = request.args.get('to_date')
    return jsonify({
        "opid": opid,
        "from_date": from_date,
        "to_date": to_date,
        "charges": [{"id": 1, "amount": 50.00}, {"id": 2, "amount": 75.00}]
    })

# Mock database (αντικατάστησέ το με πραγματική βάση δεδομένων)
users_db = {}

@app.route('/api/admin/usermod/', methods=["POST"])
def admin_usermod():
    """ Δημιουργία ή ενημέρωση χρήστη """
    data = request.json
    username = data.get("username")
    passw = data.get("passw")

    if not username or not passw:
        return jsonify({"error": "Απαιτούνται username και password"}), 400

    # Προσθήκη ή ενημέρωση χρήστη στη βάση
    users_db[username] = passw
    return jsonify({"message": f"Ο χρήστης {username} δημιουργήθηκε/ενημερώθηκε επιτυχώς"}), 200

# Mock database
users_db = {"alice": "pass123", "bob": "secure456"}
addresses_db = []

@app.route("/api/admin/users", methods=["GET"])
def users():
    """Επιστρέφει τη λίστα των usernames"""
    return jsonify({"users": list(users_db.keys())})

@app.route("/api/admin/addpasses", methods=["POST"])
def addpasses():
    """Προσθέτει διευθύνσεις από αρχείο CSV"""
    try:
        data = request.get_json()
        csv_filename = data.get("source")

        if not csv_filename:
            return jsonify({"error": "Απαιτείται όνομα αρχείου"}), 400

        with open(csv_filename, newline="", encoding="utf-8") as csvfile:
            reader = csv.reader(csvfile)
            for row in reader:
                addresses_db.append(row[0])  # Αποθηκεύει κάθε διεύθυνση

        return jsonify({"message": "Διευθύνσεις προστέθηκαν επιτυχώς"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
