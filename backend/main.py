import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import flask
from flask import Flask, jsonify
from flask_cors import CORS


cred = credentials.Certificate("photomount-648f0-firebase-adminsdk-kuceg-54b16dec84.json")
firebase_admin.initialize_app(cred, {
    'projectId': "photomount-648f0"
})

db = firestore.client()

app = Flask(__name__)
CORS(app)


@app.route('/site', methods=['GET'])
def getSiteList():
    docs = db.collection('site_info').stream()
    siteDict = {}

    for doc in docs:
        siteDict[doc.id] = doc.to_dict()

    return jsonify(siteDict)


if __name__ == "__main__":
    app.run()
