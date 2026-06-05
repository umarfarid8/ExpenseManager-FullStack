using ExpenseManagerAPI.DataAccess.Models;

namespace ExpenseManagerAPI.Models
{
    public class Income
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty; 
        public decimal Amount { get; set; }
        public string Description { get; set; } = string.Empty;
        public DateTime Date { get; set; }

        public int UserId { get; set; }
        public int CategoryId { get; set; }
        
        public User? User { get; set; }
        public Category? Category { get; set; }
    }
}