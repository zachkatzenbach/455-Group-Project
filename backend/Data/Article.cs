using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace group_backend.Data
{
    public class Article
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public long original_contentId {  get; set; }
        [Required]
        public long recommended_contentId { get; set; }
        [Required]
        public double similarity { get; set; }
    }
}
