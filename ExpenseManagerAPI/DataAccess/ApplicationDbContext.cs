using ExpenseManagerAPI.DataAccess.Models;
using ExpenseManagerAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace ExpenseManagerAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {

        }
        public DbSet<User> Users { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Expense> Expenses { get; set; }
        public DbSet<Income> Incomes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Expense>().Property(e => e.Amount).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<Income>().Property(i => i.Amount).HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Category>().HasData(
                
                new Category { Id = 1, Name = "Food", Color = "#FF5733" },
                new Category { Id = 2, Name = "Transportation", Color = "#33FF57" },
                new Category { Id = 3, Name = "Entertainment", Color = "#3357FF" },
                new Category { Id = 4, Name = "Utilities", Color = "#FF33A8" },
                new Category { Id = 5, Name = "Health", Color = "#33FFF6" },
                new Category { Id = 6, Name = "Education", Color = "#F6FF33" },
                new Category { Id = 7, Name = "Salary", Color = "#8E44AD" },
                new Category { Id = 8, Name = "Freelance", Color = "#27AE60" },
                new Category { Id = 9, Name = "Investments", Color = "#2980B9" },
                new Category { Id = 10, Name = "Other", Color = "#7F8C8D" }
            );

            modelBuilder.Entity<User>().HasData(
                new User { Id = 1, UserName = "umar", Email = "umarfarid034@gmail.com", PasswordHash = "123456" }
            );

            modelBuilder.Entity<Expense>()
                .Property(e => e.Amount)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Income>()
                .Property(i => i.Amount)
                .HasColumnType("decimal(18,2)");




        }

    }
}
