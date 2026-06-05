using ExpenseManagerAPI.Data;
using ExpenseManagerAPI.DataAccess.Models;
using ExpenseManagerAPI.DataAccess.Repositories;

using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped<IExpenseRepository, ExpenseRepository>();

builder.Services.AddScoped<IIncomeRepository, IncomeRepository>();

builder.Services.AddControllers();
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Define a unique policy name
var myAllowSpecificOrigins = "_myAllowSpecificOrigins";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: myAllowSpecificOrigins,
        policy =>
        {
            policy.WithOrigins("http://localhost:5173") // React default development URL
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors(myAllowSpecificOrigins);

app.UseAuthorization();

app.MapControllers();

// AUTOMATED DATABASE SEEDER
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();

        // 1. Automatically apply any pending migrations or create DB if missing
        context.Database.EnsureCreated();

        // 2. Check if the Categories table is empty
        if (!context.Categories.Any())
        {
            context.Categories.AddRange(
                new Category { Name = "Groceries", Color = "#dc3545" },
                new Category { Name = "Entertainment", Color = "#ffc107" },
                new Category { Name = "Salary", Color = "#0f8b46" },
                new Category { Name = "Freelance", Color = "#17a2b8" }
            );
            context.SaveChanges();
        }

        // 3. Check if our default user exists
        if (!context.Users.Any())
        {
            context.Users.Add(new ExpenseManagerAPI.DataAccess.Models.User
            {
                UserName = "umar",
                Email = "umar@test.com",
                PasswordHash = "secure_hash"
            });
            context.SaveChanges();
        }
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while seeding the database.");
    }
}

// app.Run() should be immediately below this
app.Run();

app.Run();
