using Microsoft.EntityFrameworkCore;
using Admin.Data;
using Npgsql.EntityFrameworkCore.PostgreSQL; // Add this using directive

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var connectionString = builder.Configuration.GetConnectionString("AdminDatabase");
builder.Services.AddDbContext<AppDbContext>(options =>
{
	options.UseNpgsql(connectionString);
});

var app = builder.Build();

// TEST DB CONNECTION AT STARTUP
using (var scope = app.Services.CreateScope())
{
	var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

	try
	{
		var canConnect = await db.Database.CanConnectAsync();

		if (!canConnect)
		{
			Console.WriteLine("❌ AdminDbContext could not connect to the database.");
			// Optional: fail fast so you notice issues early
			throw new Exception("AdminDbContext cannot connect to the database.");
		}

		Console.WriteLine("✅ AdminDbContext connected to the database successfully.");
	}
	catch (Exception ex)
	{
		Console.WriteLine("❌ Error while testing database connection:");
		Console.WriteLine(ex.Message);
		// Optional: rethrow to stop the app
		throw;
	}
}


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
