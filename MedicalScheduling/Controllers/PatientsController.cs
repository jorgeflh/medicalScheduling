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
    [Route("api/Patients")]
    public class PatientsController : Controller
    {
        private readonly MedicalSchedulingContext _context;
        private readonly IUrlHelper urlHelper;

        public PatientsController(MedicalSchedulingContext context, IUrlHelper urlHelper)
        {
            _context = context;
            this.urlHelper = urlHelper;
        }

        // GET: api/Patients
        [Route("~/api/GetAllPatients", Name = "GetAllPatients")]
        [HttpGet]
        public IActionResult GetPatients(PagingParams pagingParams)
        {
            var query = _context.Patients.AsQueryable();
            var model = new PagedList<Patients>(query, pagingParams.PageNumber, pagingParams.PageSize);

            Response.Headers.Add("X-Pagination", model.GetHeader().ToJson());

            var outputModel = new PatientOutputModel
            {
                Paging = model.GetHeader(),
                Links = GetLinks(model),
                Items = model.List.ToList(),
            };

            return Ok(outputModel);
        }

        [Route("~/api/GetPatientList/{term}")]
        [HttpGet]
        public IEnumerable<Patients> GetPatientList([FromRoute] string term)
        {
            var patientsList = _context.Patients.Where(d => d.Name.Contains(term)).ToList();
            return patientsList;
        }

        // GET: api/Patients/5
        [Route("~/api/GetPatient/{id}")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPatients([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var patients = await _context.Patients.SingleOrDefaultAsync(m => m.Id == id);

            if (patients == null)
            {
                return NotFound();
            }

            return Ok(patients);
        }

        // PUT: api/Patients/5
        [Route("~/api/UpdatePatient/{id}")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPatients([FromRoute] int id, [FromBody] Patients patients)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != patients.Id)
            {
                return BadRequest();
            }

            _context.Entry(patients).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PatientsExists(id))
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

        // POST: api/Patients
        [Route("~/api/AddPatient")]
        [HttpPost]
        public async Task<IActionResult> PostPatients([FromBody] Patients patients)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Patients.Add(patients);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPatients", new { id = patients.Id }, patients);
        }

        // DELETE: api/Patients/5
        [Route("~/api/DeletePatient/{id}")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePatients([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var patients = await _context.Patients.SingleOrDefaultAsync(m => m.Id == id);
            if (patients == null)
            {
                return NotFound();
            }

            var schedules = _context.Schedules.Where(s => s.PatientId == id).ToList();

            if (schedules != null)
            {
                return BadRequest("O paciente possui agendamento!");
            }

            _context.Patients.Remove(patients);
            await _context.SaveChangesAsync();

            return Ok(patients);
        }

        private bool PatientsExists(int id)
        {
            return _context.Patients.Any(e => e.Id == id);
        }

        private List<LinkInfo> GetLinks(PagedList<Patients> list)
        {
            var links = new List<LinkInfo>();

            if (list.HasPreviousPage)
                links.Add(CreateLink("GetAllPatients", list.PreviousPageNumber, list.PageSize, "previousPage", "GET"));

            links.Add(CreateLink("GetAllPatients", list.PageNumber, list.PageSize, "self", "GET"));

            if (list.HasNextPage)
                links.Add(CreateLink("GetAllPatients", list.NextPageNumber, list.PageSize, "nextPage", "GET"));

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