using Microsoft.EntityFrameworkCore;
using Admin.Data;
using Admin.Models;
using Admin.Interfaces;

namespace Admin.Repository
{
	public class UserRepository : IUserRepository
	{
		private readonly AppDbContext _context;

		public UserRepository(AppDbContext context)
		{
			_context = context;
		}

		public async Task<User?> GetByEmailAsync(string email)
		{
			return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
		}

		public async Task<User> CreateAsync(User user)
		{
			await _context.Users.AddAsync(user);
			await _context.SaveChangesAsync();
			return user;
		}

		public async Task<IEnumerable<User>> GetAllAsync()
		{
			return await _context.Users.ToListAsync();
		}
	}
}
