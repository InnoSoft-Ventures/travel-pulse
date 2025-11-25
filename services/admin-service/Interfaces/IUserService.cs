using Admin.DTOs;

namespace Admin.Interfaces
{
	public interface IUserService
	{
		Task<UserResponseDto> CreateUserAsync(CreateUserDto dto);
		Task<IEnumerable<UserResponseDto>> GetAllUsersAsync();
	}
}
