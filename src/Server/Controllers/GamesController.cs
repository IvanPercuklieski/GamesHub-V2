using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Models;
using Server.Services;
using System.Text.Json;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GamesController : ControllerBase
    {
        private readonly GamesService _gamesService;

        public GamesController(GamesService gamesService)
        {
            _gamesService = gamesService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var games = await _gamesService.GetAllGames();
            return Ok(games);
        }

        [HttpGet("publisher/{publisherId}")]
        public async Task<IActionResult> GetGamesFromPublisher(int publisherId)
        {
            var games = await _gamesService.GetGamesFromPublisher(publisherId);
            if (games == null || !games.Any())
                return NotFound("No games found for this publisher.");
            return Ok(games);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var game = await _gamesService.GetGameById(id);
            if (game == null) return NotFound();
            return Ok(game);
        }

        [RequestSizeLimit(1073741824)]
        [RequestFormLimits(MultipartBodyLengthLimit = 1073741824)]
        [HttpPost("upload")]
        public async Task<IActionResult> UploadGame([FromForm] UploadGameRequest request)
        {
            // Deserialize genres JSON string to list of ints
            var genreIds = JsonSerializer.Deserialize<List<int>>(request.Genres) ?? new List<int>();

            var game = new Game
            {
                PublisherId = request.PublisherId,
                Name = request.Name,
                Height = request.Height,
                Width = request.Width,
                Description = request.Description,
                ReleaseDate = DateTime.UtcNow
            };

            var createdGame = await _gamesService.UploadGame(game, request.CoverImage, request.ZipFile, genreIds);
            return Ok(createdGame);
        }

        [HttpGet("top")]
        public async Task<IActionResult> GetTopGames()
        {
            var topGames = await _gamesService.GetTopGames();
            return Ok(topGames);
        }

        [HttpPost("{id}/click")]
        public async Task<IActionResult> IncrementGameClicks(int id)
        {
            var updatedGame = await _gamesService.IncrementClicks(id);
            if (updatedGame == null)
                return NotFound(new { message = "Game not found" });
            return Ok(updatedGame);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGame(int id, [FromQuery] int publisherId)
        {
            try
            {
                var success = await _gamesService.DeleteGame(id, publisherId);
                if (!success) return NotFound();
                return NoContent();
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
        }

        [HttpPost("{gameId}/highscores")]
        public async Task<IActionResult> AddHighScore(int gameId, [FromBody] ScoreRequest request)
        {
            await _gamesService.AddHighScore(gameId, request.Player, request.Score);
            return Ok();
        }

        [HttpGet("{gameId}/highscores")]
        public async Task<IActionResult> GetHighScores(int gameId)
        {
            var scores = await _gamesService.GetHighScores(gameId);
            return Ok(scores);
        }

        [HttpGet("genres")]
        public async Task<IActionResult> GetAllGenres()
        {
            var genres = await _gamesService.GetAllGenres();
            return Ok(genres);
        }

        [HttpGet("paged")]
        public async Task<IActionResult> GetPaged([FromQuery] int skip = 0, [FromQuery] int take = 10, [FromQuery] string filter = "")
        {
            var games = await _gamesService.GetGamesPaged(skip, take, filter);
            return Ok(games);
        }

    }

    public class ScoreRequest
    {
        public string Player { get; set; } = string.Empty;
        public int Score { get; set; }
    }

    public class UploadGameRequest
    {
        [FromForm] public required int PublisherId { get; set; }
        [FromForm] public required string Name { get; set; }
        [FromForm] public required string Height { get; set; }
        [FromForm] public required string Width { get; set; }
        [FromForm] public required string Description { get; set; }
        [FromForm] public string Genres { get; set; } = "[]"; // JSON string
        [FromForm] public required IFormFile CoverImage { get; set; }
        [FromForm] public required IFormFile ZipFile { get; set; }
    }
}
