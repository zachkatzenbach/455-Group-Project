using System.ComponentModel.DataAnnotations;

namespace group_backend.Data
{
    public class CollaborativeRecommendation
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string personId { get; set; }
        [Required]
        public string contentId { get; set; }
        [Required]
        public int rank { get; set; }
    }
}
