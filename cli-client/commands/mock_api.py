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

@app.route('/api/admin', methods=['GET', 'POST'])
def admin():
    """
    Ενέργειες admin:
    - Χωρίς παραμέτρους: Επιστρέφει λίστα με διαθέσιμες ενέργειες.
    - Με παραμέτρους: Εκτελεί συγκεκριμένες ενέργειες.
    """
    if request.method == 'POST':
        data = request.json
        operation = data.get("operation")
        if operation == "usermod":
            # Παράδειγμα τροποποίησης χρήστη
            return jsonify({"message": "User modified."})
        elif operation == "addpasses":
            return jsonify({"message": "Passes added."})
        else:
            return jsonify({"error": "Invalid operation."}), 400
    else:
        # GET method - επιστροφή διαθέσιμων ενεργειών
        return jsonify({
            "available_operations": [
                "usermod (για δημιουργία/τροποποίηση χρήστη)",
                "addpasses (για εισαγωγή δεδομένων)",
                "users (για εμφάνιση όλων των χρηστών)"
            ]
        })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
