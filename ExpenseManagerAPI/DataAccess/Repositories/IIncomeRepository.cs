using ExpenseManagerAPI.Models;

namespace ExpenseManagerAPI.DataAccess.Repositories
{
    public interface IIncomeRepository : IGenericRepository<Income>
    {
        Task<IEnumerable<Income>> GetIncomesByUserIdAsync(int userId);
        Task<IEnumerable<Income>> GetIncomesByCategoryIdAsync(int categoryId);
    }
}
