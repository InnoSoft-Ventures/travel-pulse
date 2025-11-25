using Microsoft.AspNetCore.Mvc;
using Admin.Interfaces;
using Admin.DTOs;

namespace Admin.Controllers
{
	[ApiController]
	[Route("api/users")]
	public class UserController : ControllerBase
	{
		private readonly IUserService _service;

		public UserController(IUserService service)
		{
			_service = service;
		}

		[HttpPost]
		public async Task<IActionResult> Create([FromBody] CreateUserDto dto)
		{
			var result = await _service.CreateUserAsync(dto);
			return Ok(result);
		}

		[HttpGet]
		public async Task<IActionResult> GetAll()
		{
			var users = await _service.GetAllUsersAsync();
			return Ok(users);
		}
	}
}
