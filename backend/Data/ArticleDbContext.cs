using Microsoft.EntityFrameworkCore;

namespace group_backend.Data
{
    public class ArticleDbContext : DbContext
    {
        public ArticleDbContext(DbContextOptions<ArticleDbContext> options) : base(options)
        {

        }

        public DbSet<Article> content_recommendations { get; set; }
        public DbSet<CollaborativeRecommendation> collaborative_recommendations { get; set; }
    }
}
