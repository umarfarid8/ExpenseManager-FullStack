using ExpenseManagerAPI.Data;
using ExpenseManagerAPI.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ExpenseManagerAPI.DataAccess.Repositories;

namespace ExpenseManagerAPI.DataAccess.Repositories
{
    public class IncomeRepository : GenericRepository<Income>, IIncomeRepository
    {
        public IncomeRepository(ApplicationDbContext context) : base(context)
        {
        }
        public async Task<IEnumerable<Income>> GetIncomesByUserIdAsync(int userId)
        {
            return await _context.Incomes
                .Where(i => i.UserId == userId)
                .Include(i => i.Category)
                .OrderByDescending(i => i.Date)
                .ToListAsync();
        }
        public async Task<IEnumerable<Income>> GetIncomesByCategoryIdAsync(int categoryId)
        {
            return await _context.Incomes
                .Where(i => i.CategoryId == categoryId)
                .OrderByDescending(i => i.Date)
                .ToListAsync();
        }

    }
}
