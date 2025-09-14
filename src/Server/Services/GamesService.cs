using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Server.Data;
using Server.Models;
using System.IO.Compression;

namespace Server.Services
{
    public class GamesService
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public GamesService(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // Get all games with genres and publisher info
        public async Task<List<GameDto>> GetAllGames()
        {
            return await _context.Games
                .Include(g => g.Publisher)
                .Include(g => g.Genres)
                .Select(g => new GameDto
                {
                    Id = g.Id,
                    Name = g.Name,
                    Genres = g.Genres.Select(genre => new GenreDto { Id = genre.Id, Name = genre.Name }).ToList(),
                    ReleaseDate = g.ReleaseDate,
                    Description = g.Description,
                    Height = g.Height,
                    Width = g.Width,
                    CoverImageUrl = g.CoverImageUrl,
                    Clicks = g.Clicks,
                    FilePath = g.FilePath,
                    Publisher = new PublisherDto
                    {
                        Id = g.Publisher.Id,
                        Username = g.Publisher.Username
                    }
                })
                .ToListAsync();
        }

        // Get a single game by ID
        public async Task<GameDto?> GetGameById(int id)
        {
            return await _context.Games
                .Include(g => g.Publisher)
                .Include(g => g.Genres)
                .Where(g => g.Id == id)
                .Select(g => new GameDto
                {
                    Id = g.Id,
                    Name = g.Name,
                    Genres = g.Genres.Select(genre => new GenreDto { Id = genre.Id, Name = genre.Name }).ToList(),
                    ReleaseDate = g.ReleaseDate,
                    Description = g.Description,
                    Height = g.Height,
                    Width = g.Width,
                    CoverImageUrl = g.CoverImageUrl,
                    Clicks = g.Clicks,
                    FilePath = g.FilePath,
                    Publisher = new PublisherDto
                    {
                        Id = g.Publisher.Id,
                        Username = g.Publisher.Username
                    }
                })
                .FirstOrDefaultAsync();
        }

        // Get all games for a publisher
        public async Task<List<GameDto>> GetGamesFromPublisher(int publisherId)
        {
            return await _context.Games
                .Where(g => g.PublisherId == publisherId)
                .Include(g => g.Publisher)
                .Include(g => g.Genres)
                .Select(g => new GameDto
                {
                    Id = g.Id,
                    Name = g.Name,
                    Genres = g.Genres.Select(genre => new GenreDto
                    {
                        Id = genre.Id,
                        Name = genre.Name
                    }).ToList(),
                    ReleaseDate = g.ReleaseDate,
                    Description = g.Description,
                    Height = g.Height,
                    Width = g.Width,
                    CoverImageUrl = g.CoverImageUrl,
                    Clicks = g.Clicks,
                    FilePath = g.FilePath,
                    Publisher = new PublisherDto
                    {
                        Id = g.Publisher.Id,
                        Username = g.Publisher.Username
                    }
                })
                .ToListAsync();
        }

        // Get top N games by clicks
        public async Task<List<GameDto>> GetTopGames(int top = 10)
        {
            return await _context.Games
                .Include(g => g.Publisher)
                .Include(g => g.Genres)
                .OrderByDescending(g => g.Clicks)
                .Take(top)
                .Select(g => new GameDto
                {
                    Id = g.Id,
                    Name = g.Name,
                    Genres = g.Genres.Select(genre => new GenreDto
                    {
                        Id = genre.Id,
                        Name = genre.Name
                    }).ToList(),
                    ReleaseDate = g.ReleaseDate,
                    Description = g.Description,
                    Height = g.Height,
                    Width = g.Width,
                    CoverImageUrl = g.CoverImageUrl,
                    Clicks = g.Clicks,
                    FilePath = g.FilePath,
                    Publisher = new PublisherDto
                    {
                        Id = g.Publisher.Id,
                        Username = g.Publisher.Username
                    }
                })
                .ToListAsync();
        }

        // Increment clicks
        public async Task<Game?> IncrementClicks(int gameId)
        {
            var game = await _context.Games.FindAsync(gameId);
            if (game == null) return null;

            game.Clicks += 1;
            await _context.SaveChangesAsync();

            return game;
        }

        // Delete a game
        public async Task<bool> DeleteGame(int gameId, int publisherId)
        {
            var game = await _context.Games
                .Include(g => g.Publisher)
                .FirstOrDefaultAsync(g => g.Id == gameId);

            if (game == null) return false;

            if (game.PublisherId != publisherId)
                throw new UnauthorizedAccessException("You are not allowed to delete this game.");

            var gameFolder = Path.Combine(_env.ContentRootPath, game.FilePath);
            if (Directory.Exists(gameFolder))
                Directory.Delete(gameFolder, true);

            _context.Games.Remove(game);
            await _context.SaveChangesAsync();

            return true;
        }

        // Add or update a high score
        public async Task AddHighScore(int gameId, string player, int score)
        {
            var game = await _context.Games
                .Include(g => g.HighScores)
                .FirstOrDefaultAsync(g => g.Id == gameId);

            if (game == null)
                throw new Exception("Game not found");

            var existing = game.HighScores.FirstOrDefault(h => h.PlayerName == player);

            if (existing != null)
                existing.Score = score;
            else
                game.HighScores.Add(new HighScores { PlayerName = player, Score = score });

            await _context.SaveChangesAsync();
        }

        // Get all scores for a game, ordered by highest
        public async Task<List<HighScoreDto>> GetHighScores(int gameId)
        {
            return await _context.HighScores
                .Where(h => h.GameId == gameId)
                .OrderByDescending(h => h.Score)
                .Select(h => new HighScoreDto
                {
                    Player = h.PlayerName,
                    Score = h.Score
                })
                .ToListAsync();
        }



        // Get all genres as DTOs (id + name only)
        public async Task<List<GenreDto>> GetAllGenres()
        {
            return await _context.Genres
                .Select(g => new GenreDto
                {
                    Id = g.Id,
                    Name = g.Name
                })
                .ToListAsync();
        }



        // Get games with pagination
        public async Task<List<GameDto>> GetGamesPaged(int skip, int take, string filter)
        {
            var query = _context.Games
                .Include(g => g.Publisher)
                .Include(g => g.Genres)
                .OrderByDescending(g => g.ReleaseDate)
                .AsQueryable();

            if (!string.IsNullOrEmpty(filter))
            {
                string loweredFilter = filter.ToLower();
                query = query.Where(g => g.Name.ToLower().Contains(loweredFilter));
            }

            return await query
                .Skip(skip)
                .Take(take)
                .Select(g => new GameDto
                {
                    Id = g.Id,
                    Name = g.Name,
                    Genres = g.Genres.Select(genre => new GenreDto
                    {
                        Id = genre.Id,
                        Name = genre.Name
                    }).ToList(),
                    ReleaseDate = g.ReleaseDate,
                    Description = g.Description,
                    Height = g.Height,
                    Width = g.Width,
                    CoverImageUrl = g.CoverImageUrl,
                    Clicks = g.Clicks,
                    FilePath = g.FilePath,
                    Publisher = new PublisherDto
                    {
                        Id = g.Publisher.Id,
                        Username = g.Publisher.Username
                    }
                })
                .ToListAsync();
        }





        // Upload a game
        public async Task<GameDto> UploadGame(Game game, IFormFile coverImage, IFormFile zipFile, List<int>? genreIds = null)
        {
            var publisher = await _context.Users.FindAsync(game.PublisherId);
            if (publisher == null) throw new Exception("Publisher not found");

            game.Publisher = publisher;

            // Attach genres by IDs
            if (genreIds != null && genreIds.Any())
            {
                game.Genres = await _context.Genres
                    .Where(g => genreIds.Contains(g.Id))
                    .ToListAsync();
            }

            string baseFolder = Path.Combine(_env.ContentRootPath, "Games", publisher.Username, game.Name);
            Directory.CreateDirectory(baseFolder);

            // Cover image
            if (coverImage != null)
            {
                string coverFileName = Guid.NewGuid() + Path.GetExtension(coverImage.FileName);
                string coverPath = Path.Combine(baseFolder, coverFileName);

                await using (var stream = new FileStream(coverPath, FileMode.Create, FileAccess.Write, FileShare.None))
                    await coverImage.CopyToAsync(stream);

                game.CoverImageUrl = Path.Combine("Games", publisher.Username, game.Name, coverFileName).Replace("\\", "/");
            }

            // ZIP file
            if (zipFile != null)
            {
                string tempZipPath = Path.Combine(baseFolder, Guid.NewGuid() + Path.GetExtension(zipFile.FileName));

                await using (var stream = new FileStream(tempZipPath, FileMode.Create, FileAccess.Write, FileShare.None))
                    await zipFile.CopyToAsync(stream);

                ZipFile.ExtractToDirectory(tempZipPath, baseFolder, overwriteFiles: true);
                File.Delete(tempZipPath);

                game.FilePath = Path.Combine("Games", publisher.Username, game.Name, "Game").Replace("\\", "/");
            }

            publisher.PublishedGames.Add(game);
            _context.Games.Add(game);
            await _context.SaveChangesAsync();


            return new GameDto
            {
                Id = game.Id,
                Name = game.Name,
                Genres = game.Genres.Select(g => new GenreDto
                {
                    Id = g.Id,
                    Name = g.Name
                }).ToList(),
                ReleaseDate = game.ReleaseDate,
                Description = game.Description,
                Height = game.Height,
                Width = game.Width,
                CoverImageUrl = game.CoverImageUrl,
                Clicks = game.Clicks,
                FilePath = game.FilePath,
                Publisher = new PublisherDto
                {
                    Id = publisher.Id,
                    Username = publisher.Username
                }
            };

        }
    }
}
