using ExpenseManagerAPI.DataAccess.Repositories;
using ExpenseManagerAPI.Dtos;
using ExpenseManagerAPI.Models;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseManagerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IncomesController : ControllerBase
    {
        private readonly IIncomeRepository _incomeRepository;
        public IncomesController(IIncomeRepository incomeRepository)
        {
            _incomeRepository = incomeRepository;
        }
        
        
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<IncomeResponseDto>>> GetIncomesByUserId(int userId)
        {
            var incomes = await _incomeRepository.GetIncomesByUserIdAsync(userId);
            var response = incomes.Select(i => new IncomeResponseDto
            {
                Id = i.Id,
                Title = i.Title,
                Amount = i.Amount,
                Description = i.Description,
                Date = i.Date,
                CategoryId = i.CategoryId,
                CategoryName = i.Category?.Name ?? "Uncategorized",
                UserId = i.UserId
            });
            return Ok(response);
        }
        
        
        [HttpPost]
        public async Task<ActionResult<IncomeResponseDto>> CreateIncome([FromBody] IncomeCreateDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var income = new Income
            {
                Title = dto.Title,
                Amount = dto.Amount,
                Description = dto.Description,
                Date = dto.Date,
                CategoryId = dto.CategoryId,
                UserId = dto.UserId
            };
            await _incomeRepository.AddAsync(income);
            await _incomeRepository.SaveChangesAsync();

            var response = new IncomeResponseDto
            {
                Id = income.Id,
                Title = income.Title,
                Amount = income.Amount,
                Description = income.Description,
                Date = income.Date,
                CategoryId = income.CategoryId,
                CategoryName = income.Category?.Name ?? "Uncategorized",
                UserId = income.UserId
            };
            return CreatedAtAction(nameof(GetIncomesByUserId), new { userId = income.UserId }, response);

        }
        
        
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteIncome(int id)
        {
            var income = await _incomeRepository.GetByIdAsync(id);
            if (income == null)
            {
                return NotFound();
            }
            _incomeRepository.Delete(income);
            await _incomeRepository.SaveChangesAsync();
            return NoContent();
        }

    }
}