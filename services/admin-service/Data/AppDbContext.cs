using Microsoft.EntityFrameworkCore;
using Admin.Models;

namespace Admin.Data
{
	public class AppDbContext : DbContext
	{
		public AppDbContext(DbContextOptions<AppDbContext> options)
				: base(options) { }

		public DbSet<User> Users { get; set; }
	}
}
