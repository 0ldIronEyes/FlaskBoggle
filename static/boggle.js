class BoggleGame {

    constructor() {
        this.score = 0;
        this.words = new Set();
        this.time = 60;
        this.timer = setInterval(this.tick.bind(this), 1000);


        $(".guessform").on("submit", this.handleSubmit.bind(this));
      }

      setMessage($messagesection, text)
      {
         $messagesection.text(text);
      }


    async handleSubmit(evt) {
 
        evt.preventDefault();
        let $wordinput = $(".wordinput");
        let word = $wordinput.val();
        word = word.toLowerCase();
        if (word == "")
        { return; }
        const response = await axios.get("/check-word", { params: { word: word }});
        if (response.data.result == "not-word")
        {
            this.setMessage($(".message"),`${word} is not a word.`);
            $wordinput.val = ""
            return;
        } 
        else if (response.data.result == "Not-on-board")
        {
            this.setMessage($(".message"), `${word} not on the board.`);
            $wordinput.val = ""
            return;
        }
        else if (this.words.has(word))
        {
            this.setMessage($(".message"), `${word} already added.`);
            $wordinput.val = ""
            return;
        }
        else
        {
            this.score += word.length;
            this.words.add(word);
            this.setMessage($(".message"), `${word} found`, "ok");
            this.showScore();
            $wordinput.val = ""
          //  await axios.post("/add-score", { score: this.score });
        }
  
    }

    showScore()
    {
        $("#score").text(this.score);
    }

    async tick() {
        this.time -= 1;
        $("#timer").text(this.time);
    
        if (this.time <= 0) {
          clearInterval(this.timer);
          await this.endGame();
        }
    }
    
    async endGame() {
        $(".guessform").hide();
        $("#timerdiv").hide();
        $(".message").hide;
        const resp = await axios.post("/post-score", { score: this.score });
        if (resp.data.highscore) {
            
            this.setMessage($("#score"), `New record: ${this.score}`, "ok");
        } 
        else
        {
            this.setMessage($("#score"),`Final score: ${this.score}`, "ok");
        }
      }

}
