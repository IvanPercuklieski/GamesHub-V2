using Microsoft.AspNetCore.Mvc;

public class UploadGameRequest
{
    [FromForm(Name = "publisherId")]
    public int PublisherId { get; set; }

    [FromForm(Name = "name")]
    public string Name { get; set; }

    [FromForm(Name = "height")]
    public string Height { get; set; }

    [FromForm(Name = "width")]
    public string Width { get; set; }

    [FromForm(Name = "description")]
    public string Description { get; set; }

    [FromForm(Name = "genres")]
    public List<string> Genres { get; set; }

    [FromForm(Name = "coverImage")]
    public IFormFile CoverImage { get; set; }

    [FromForm(Name = "zipFile")]
    public IFormFile ZipFile { get; set; }
}
