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
    [Route("api/Doctors")]
    public class DoctorsController : Controller
    {
        private readonly MedicalSchedulingContext _context;
        private readonly IUrlHelper urlHelper;

        public DoctorsController(MedicalSchedulingContext context, IUrlHelper urlHelper)
        {
            _context = context;
            this.urlHelper = urlHelper;
        }

        // GET: api/Doctors
        [Route("~/api/GetAllDoctors", Name = "GetAllDoctors")]
        [HttpGet]
        public IActionResult GetDoctors(PagingParams pagingParams)
        {
            var query = _context.Doctors.AsQueryable();
            var model = new PagedList<Doctors>(query, pagingParams.PageNumber, pagingParams.PageSize);

            Response.Headers.Add("X-Pagination", model.GetHeader().ToJson());

            var outputModel = new DoctorOutputModel
            {
                Paging = model.GetHeader(),
                Links = GetLinks(model),
                Items = model.List.ToList(),
            };

            return Ok(outputModel);
        }

        [Route("~/api/GetDoctorList/{term}")]
        [HttpGet]
        public IEnumerable<Doctors> GetDoctorList([FromRoute] string term)
        {
            var doctorsList = _context.Doctors.Where(d => d.Name.Contains(term)).ToList();
            return doctorsList;
        }

        // GET: api/Doctors/5
        [Route("~/api/GetDoctor/{id}")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDoctors([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var doctor = await _context.Doctors.SingleOrDefaultAsync(m => m.Id == id);

            if (doctor == null)
            {
                return NotFound();
            }

            return Ok(doctor);
        }

        // PUT: api/Doctors/5
        [Route("~/api/UpdateDoctor/{id}")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDoctors([FromRoute] int id, [FromBody] Doctors doctors)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != doctors.Id)
            {
                return BadRequest();
            }

            _context.Entry(doctors).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DoctorsExists(id))
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

        // POST: api/Doctors
        [Route("~/api/AddDoctor/")]
        [HttpPost]
        public async Task<IActionResult> PostDoctors([FromBody] Doctors doctors)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Doctors.Add(doctors);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDoctors", new { id = doctors.Id }, doctors);
        }

        // DELETE: api/Doctors/5
        [Route("~/api/DeleteDoctor/{id}")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDoctors([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var doctors = await _context.Doctors.SingleOrDefaultAsync(m => m.Id == id);
            if (doctors == null)
            {
                return NotFound();
            }

            _context.Doctors.Remove(doctors);
            await _context.SaveChangesAsync();

            return Ok(doctors);
        }

        private bool DoctorsExists(int id)
        {
            return _context.Doctors.Any(e => e.Id == id);
        }

        private List<LinkInfo> GetLinks(PagedList<Doctors> list)
        {
            var links = new List<LinkInfo>();

            if (list.HasPreviousPage)
                links.Add(CreateLink("GetAllDoctors", list.PreviousPageNumber, list.PageSize, "previousPage", "GET"));

            links.Add(CreateLink("GetAllDoctors", list.PageNumber, list.PageSize, "self", "GET"));

            if (list.HasNextPage)
                links.Add(CreateLink("GetAllDoctors", list.NextPageNumber, list.PageSize, "nextPage", "GET"));

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