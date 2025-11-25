using Admin.DTOs;
using Admin.Interfaces;
using Admin.Models;
using BCrypt.Net;

namespace Admin.Service
{
	public class UserService : IUserService
	{
		private readonly IUserRepository _repo;

		public UserService(IUserRepository repo)
		{
			_repo = repo;
		}

		public async Task<UserResponseDto> CreateUserAsync(CreateUserDto dto)
		{
			var existing = await _repo.GetByEmailAsync(dto.Email);
			if (existing != null)
				throw new Exception("User already exists.");

			var hashed = BCrypt.Net.BCrypt.HashPassword(dto.Password);

			var user = new User
			{
				FirstName = dto.FirstName,
				LastName = dto.LastName,
				Email = dto.Email,
				PasswordHash = hashed
			};

			await _repo.CreateAsync(user);

			return new UserResponseDto
			{
				Id = user.Id,
				FirstName = user.FirstName,
				LastName = user.LastName,
				Email = user.Email
			};
		}

		public async Task<IEnumerable<UserResponseDto>> GetAllUsersAsync()
		{
			var users = await _repo.GetAllAsync();

			return users.Select(u => new UserResponseDto
			{
				Id = u.Id,
				FirstName = u.FirstName,
				LastName = u.LastName,
				Email = u.Email
			}).ToList();
		}
	}
}
