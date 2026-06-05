using System.ComponentModel.DataAnnotations;

namespace ExpenseManagerAPI.Dtos
{
    public class ExpenseCreateDto
    {
        [Required]
        [StringLength(100, MinimumLength = 1)]
        public string Title { get; set; } = string.Empty;
        [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than 0")]
        public decimal Amount { get; set; }

        public string Description { get; set; } = string.Empty;
        [Required]
        public DateTime Date { get; set; } = DateTime.UtcNow;
        [Required]
        public int CategoryId { get; set; }
        [Required]
        public int UserId { get; set; }
    }
}
