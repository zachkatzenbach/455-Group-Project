using System.Security.Cryptography.X509Certificates;
using group_backend.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;

namespace group_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArticleController : ControllerBase
    {
        private ArticleDbContext _articleContext;

        public ArticleController(ArticleDbContext temp)
        {
            _articleContext = temp;
        }

        [HttpGet("Article/{id}")]
        public IActionResult GetArticlesByOriginalId(long id)
        {
            var articles = _articleContext.content_recommendations
                              .Where(a => a.original_contentId == id)
                              .ToList();

            if (articles == null || articles.Count == 0)
            {
                return NotFound($"No articles found with original_contentId = {id}");
            }

            return Ok(articles);
        }

        [HttpGet("CollaborativeItem/{id}")]
        public IActionResult GetCollaborativeItemRecs(string id)
        {
            var results = new List<Article>(); // reuse Article model or create another one

            using (var connection = new SqliteConnection("Data Source=item_item_collaborative.sqlite"))
            {
                connection.Open();
                var command = connection.CreateCommand();
                command.CommandText = @"
            SELECT NULL as Id, original_contentId, recommended_contentId, similarity
            FROM collaborative_item_recs
            WHERE original_contentId = $id
            ORDER BY similarity DESC
            LIMIT 5";
                command.Parameters.AddWithValue("$id", id);

                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        results.Add(new Article
                        {
                            original_contentId = long.Parse(reader.GetString(1)),
                            recommended_contentId = long.Parse(reader.GetString(2)),
                            similarity = reader.GetDouble(3)
                        });
                    }
                }
            }

            if (results.Count == 0)
                return NotFound($"No collaborative item recs found for contentId = {id}");

            return Ok(results);
        }

    }
}
