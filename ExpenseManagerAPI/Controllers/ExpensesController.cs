using ExpenseManagerAPI.DataAccess.Models;
using ExpenseManagerAPI.DataAccess.Repositories;
using ExpenseManagerAPI.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ExpenseManagerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ExpensesController : Controller
    {
        private readonly IExpenseRepository _expenseRepository;
        public ExpensesController(IExpenseRepository expenseRepository)
        {
            _expenseRepository = expenseRepository;

        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ExpenseResponseDto>>> GetAllExpenses()
        {
            var expenses = await _expenseRepository.GetAllAsync();
            var response = expenses.Select(e => new ExpenseResponseDto
            {
                Id = e.Id,
                Title = e.Title,
                Amount = e.Amount,
                Description = e.Description,
                Date = e.Date,
                CategoryId = e.CategoryId,

                UserId = e.UserId
            });
            return Ok(response);
        }


        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<ExpenseResponseDto>>> GetExpensesByUserId(int userId)
        {
            var expenses = await _expenseRepository.GetExpensesByUserIdAsync(userId);
            var response = expenses.Select(e => new ExpenseResponseDto
            {
                Id = e.Id,
                Title = e.Title,
                Amount = e.Amount,
                Description = e.Description,
                Date = e.Date,
                CategoryId = e.CategoryId,
                CategoryName = e.Category?.Name ?? "Uncategorized",
                UserId = e.UserId
            });
            return Ok(response);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<ExpenseResponseDto>> GetExpenseById(int id)
        {
            var expense = await _expenseRepository.GetByIdAsync(id);
            if (expense == null)
            {
                return NotFound(new { message = $"Expense with id {id} not found" });
            }
            var response = new ExpenseResponseDto
            {
                Id = expense.Id,
                Title = expense.Title,
                Amount = expense.Amount,
                Description = expense.Description,
                Date = expense.Date,
                CategoryId = expense.CategoryId,
                UserId = expense.UserId
            };
            return Ok(response);
        }
        [HttpPost]
        public async Task<ActionResult<ExpenseResponseDto>> CreateExpense([FromBody] ExpenseCreateDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized(new { message = "User identity could not be verified from token." });
            }

            int authenticatedUserId = int.Parse(userIdClaim);

            var expense = new Expense
            {
                Title = dto.Title,
                Amount = dto.Amount,
                Description = dto.Description,
                Date = dto.Date,
                CategoryId = dto.CategoryId,
                UserId = authenticatedUserId
            };
            await _expenseRepository.AddAsync(expense);
            await _expenseRepository.SaveChangesAsync();
            var response = new ExpenseResponseDto
            {
                Id = expense.Id,
                Title = expense.Title,
                Amount = expense.Amount,
                Description = expense.Description,
                Date = expense.Date,
                CategoryId = expense.CategoryId,
                UserId = expense.UserId
            };
            return CreatedAtAction(nameof(GetExpenseById), new { id = expense.Id }, response);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateExpense(int id, [FromBody] ExpenseCreateDto dto)
        {

            var existingExpense = await _expenseRepository.GetByIdAsync(id);
            if (existingExpense == null)
            {
                return NotFound(new { message = $"Expense with id {id} not found" });
            }
            existingExpense.Title = dto.Title;
            existingExpense.Amount = dto.Amount;
            existingExpense.Description = dto.Description;
            existingExpense.Date = dto.Date;
            existingExpense.CategoryId = dto.CategoryId;
            existingExpense.UserId = dto.UserId;
            _expenseRepository.Update(existingExpense);
            await _expenseRepository.SaveChangesAsync();
            return NoContent();
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExpense(int id)
        {
            var existingExpense = await _expenseRepository.GetByIdAsync(id);
            if (existingExpense == null)
            {
                return NotFound(new { message = $"Expense with id {id} not found" });
            }
            _expenseRepository.Delete(existingExpense);
            await _expenseRepository.SaveChangesAsync();
            return NoContent();
        }

    }
}