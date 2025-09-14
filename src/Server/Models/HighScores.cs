namespace Server.Models
{
    public class HighScores
    {
        public int Id { get; set; }

        public string PlayerName { get; set; }
        public int Score { get; set; }

        public int GameId { get; set; }
        public Game Game { get; set; }

    }

    public class HighScoreDto
    {
        public string Player { get; set; }
        public int Score { get; set; }
    }
}
