using ExpenseManagerAPI.DataAccess.Models;

namespace ExpenseManagerAPI.DataAccess.Repositories
{
    public interface IExpenseRepository : IGenericRepository<Expense>
    {
        Task<IEnumerable<Expense>> GetExpensesByUserIdAsync(int userId);
        Task<IEnumerable<Expense>> GetExpensesByCategoryIdAsync(int categoryId);
    }
}
