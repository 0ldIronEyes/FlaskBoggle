from flask import Flask, request, render_template, jsonify, session
from boggle import Boggle

app = Flask(__name__)
app.config["SECRET_KEY"] = "secrekeyyyy"
boggle_game = Boggle()


@app.route("/")
def homepage():
    """ renders the main board and game"""
    board = boggle_game.make_board()
    session["board"] = board
    if not session.get('score'):
        session["score"] = 0
    return render_template("index.html", board= board)

@app.route("/check-word")
def checkWord():
    """ checkes to see if the word submitted is valid or on the board"""
    word = request.args["word"]
    response = boggle_game.check_valid_word(session["board"], word)
    return jsonify({'result': response})


@app.route("/add-score", methods=["POST"])
def addScore():
    """ Adds the score to the session score"""
    newScore = request.json["score"]
    session["highscore"] = newScore



@app.route("/post-score", methods=["POST"])
def post_score():
    """Shows the score received at the end of the game and compares it to the saved high score"""
    score = request.json["score"]
    session["score"] = score
    session["highscore"] = session.get("highscore",0)
    session["gamenumber"] = session.get("gamenumber",0) + 1
    if session["score"] > session["highscore"]:
        session["highscore"] = session["score"]
        return jsonify(highscored = True)
    else:
        return jsonify(highscore=False)