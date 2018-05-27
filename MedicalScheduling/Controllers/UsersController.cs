using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MedicalScheduling.Models;
using MedicalScheduling.Types;
using MedicalScheduling.DTO;

namespace MedicalScheduling.Controllers
{
    [Produces("application/json")]
    [Route("api/Users")]
    public class UsersController : Controller
    {
        private readonly MedicalSchedulingContext _context;
        private readonly IUrlHelper urlHelper;

        public UsersController(MedicalSchedulingContext context, IUrlHelper urlHelper)
        {
            _context = context;
            this.urlHelper = urlHelper;
        }

        // GET: api/Users
        [Route("~/api/GetAllUsers", Name = "GetAllUsers")]
        [HttpGet]
        public IActionResult GetUsers(PagingParams pagingParams)
        {
            var query = _context.Users.AsQueryable();
            var model = new PagedList<Users>(query, pagingParams.PageNumber, pagingParams.PageSize);

            Response.Headers.Add("X-Pagination", model.GetHeader().ToJson());

            var outputModel = new UserOutputModel
            {
                Paging = model.GetHeader(),
                Links = GetLinks(model),
                Items = model.List.ToList(),
            };

            return Ok(outputModel);
        }

        // GET: api/Users/5        
        [Route("~/api/GetUser/{id}")]
        [HttpGet("{id}")]        
        public async Task<IActionResult> GetUsers([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var users = await _context.Users.SingleOrDefaultAsync(m => m.Id == id);

            if (users == null)
            {
                return NotFound();
            }

            return Ok(users);
        }

        // PUT: api/Users/5
        [Route("~/api/UpdateUser/{id}")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUsers([FromRoute] int id, [FromBody] Users users)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != users.Id)
            {
                return BadRequest();
            }

            _context.Entry(users).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UsersExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Users
        [Route("~/api/Adduser")]
        [HttpPost]
        public async Task<IActionResult> PostUsers([FromBody] Users users)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Users.Add(users);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUsers", new { id = users.Id }, users);
        }

        // DELETE: api/Users/5
        [Route("~/api/DeleteUser/{id}")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUsers([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var users = await _context.Users.SingleOrDefaultAsync(m => m.Id == id);
            if (users == null)
            {
                return NotFound();
            }

            _context.Users.Remove(users);
            await _context.SaveChangesAsync();

            return Ok(users);
        }

        private bool UsersExists(int id)
        {
            return _context.Users.Any(e => e.Id == id);
        }

        private List<LinkInfo> GetLinks(PagedList<Users> list)
        {
            var links = new List<LinkInfo>();

            if (list.HasPreviousPage)
                links.Add(CreateLink("GetAllUsers", list.PreviousPageNumber, list.PageSize, "previousPage", "GET"));

            links.Add(CreateLink("GetAllUsers", list.PageNumber, list.PageSize, "self", "GET"));

            if (list.HasNextPage)
                links.Add(CreateLink("GetAllUsers", list.NextPageNumber, list.PageSize, "nextPage", "GET"));

            return links;
        }

        private LinkInfo CreateLink(string routeName, int pageNumber, int pageSize, string rel, string method)
        {
            var link = urlHelper.Link(routeName, new { PageNumber = pageNumber, PageSize = pageSize });

            return new LinkInfo
            {
                Href = link,
                Rel = rel,
                Method = method
            };
        }
    }
}