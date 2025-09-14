namespace Server.Models
{
    public class Game
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public ICollection<HighScores> HighScores { get; set; } = new List<HighScores>();
        public ICollection<Genre> Genres { get; set; } = new List<Genre>();

        public DateTime ReleaseDate { get; set; }
        public int PublisherId { get; set; }
        public User Publisher { get; set; }
        public string Description { get; set; }
        public string Height { get; set; }
        public string Width { get; set; }
        public string CoverImageUrl { get; set; }
        public int Clicks { get; set; }
        public string FilePath { get; set; }
    }

    public class GameDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<GenreDto> Genres { get; set; } = new();
        public DateTime ReleaseDate { get; set; }
        public PublisherDto Publisher { get; set; }
        public string Description { get; set; }
        public string Height { get; set; }
        public string Width { get; set; }
        public string CoverImageUrl { get; set; }
        public int Clicks { get; set; }
        public string FilePath { get; set; }
    }

    public class PublisherDto
    {
        public int Id { get; set; }
        public string Username { get; set; }
    }

}