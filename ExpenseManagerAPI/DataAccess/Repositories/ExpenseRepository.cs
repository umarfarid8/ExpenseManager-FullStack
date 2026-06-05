using ExpenseManagerAPI.Data;
using ExpenseManagerAPI.DataAccess.Models;
using Microsoft.EntityFrameworkCore;

namespace ExpenseManagerAPI.DataAccess.Repositories
{
    public class ExpenseRepository : GenericRepository<Expense>, IExpenseRepository
    {
        public ExpenseRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Expense>> GetExpensesByUserIdAsync(int userId)
        {
            return await _context.Expenses
                .Where(e => e.UserId == userId)
                .Include(e => e.Category)
                .OrderByDescending(e => e.Date)
                .ToListAsync();
        }

        public async Task<IEnumerable<Expense>> GetExpensesByCategoryIdAsync(int categoryId)
        {
            return await _context.Expenses
                .Where(e => e.CategoryId == categoryId)

                .ToListAsync();
        }

    }
}
