using System.Security.Cryptography.X509Certificates;
using group_backend.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

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
    }
}
